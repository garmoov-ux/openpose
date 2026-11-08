import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { RenderMode, GizmoMode, GizmoSpace, CameraPreset, MannequinModelId, MaterialStyle } from '@/types';
import { BodyFormat, Quat, RenderResult, RenderSpec, SceneDocumentV1 } from '@/types/sceneDocument';
import { OutfitCompositionV1 } from '@/types/wardrobe';
import { SoloThemeId } from '@/types/themeSolo';
import { RoomPropInstance } from '@/data/themesSolo/roomPropCatalog';
import { createProceduralHumanoid, HumanoidRigResult, applyBodyProportions } from '@/core/mannequin/humanoidRig';
import { loadFbxMannequin, measureHumanoidWorldYBounds } from '@/core/mannequin/modelLoader';
import { MANNEQUIN_MODELS } from '@/core/mannequin/models';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';
import { getMannequinProfile } from '@/core/mannequin/mannequinProfiles';
import { applyOutfitToMannequin } from '@/core/mannequin/outfitVisualizer';
import { applyWardrobeCompositionToRig } from '@/core/mannequin/wardrobe/garmentRenderer';
import { BodyAccessoryConfig, applyBodyAccessoriesToRig } from '@/core/mannequin/bodyAccessoryMeshes';
import { CameraController } from './CameraController';
import {
  createDepthShaderMaterial, createNormalShaderMaterial, createLineartShaderMaterial,
  createWireframeMaterial, createMaterialByStyle, computeCameraSpaceDepthBounds,
} from '@/core/shaders/materials';
import {
  applyMaterialToHierarchy, createStylizedSkeletonHelper, updateStylizedSkeletonHelper,
  setJointDotsVisible, applyMannequinGroupTransform, applyCouplePresetToRigs,
  disposeObjectHierarchy, disposeSharedRenderTarget,
} from './modelSwapHelper';
import { StudioLights, createStudioLightsAndStage, applyStudioThemeEnvironment } from './environmentStudio';
import { findPropGroupByUid, pickSceneEntityAtPointer } from './smartPicker';
import { getJointScreenPositions, drawOpenPoseSkeleton } from '@/core/pipeline/openposePipeline';
import { applyActorV1ToRig, buildSceneDocumentSnapshot, extractRestDeltaQuat, runSceneRenderJob } from './sceneDocumentSync';
import { buildEditableModelScene, buildStaticModelScene, ModelExportFormat } from './modelExport';

export class SceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public orbitControls: OrbitControls;
  public transformControls: TransformControls;
  public cameraController: CameraController;
  public humanoid: HumanoidRigResult;
  public partnerHumanoid: HumanoidRigResult;
  public skeletonHelper: THREE.LineSegments;
  public gridHelper: THREE.GridHelper;
  private studioLights: StudioLights;
  private canvas: HTMLCanvasElement;
  private overlayCanvas: HTMLCanvasElement;
  private animId: number | null = null;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private pointerDownPos = { x: 0, y: 0 };
  private isDraggingGizmo = false;
  private onBoneSelectedCallback?: (boneName: string | null, actorId?: 'main' | 'partner') => void;
  public onPropSelectedCallback?: (propUid: string | null) => void;
  public onPropTransformCallback?: (uid: string, pos: [number, number, number], rotY: number, scale: number, rotX: number, rotZ: number) => void;
  public onMannequinTransformCallback?: (target: 'main' | 'partner', pos: [number, number, number], rot: [number, number, number], scale: number) => void;
  public onBoneTransformEndCallback?: (actorId: 'main' | 'partner', boneId: string, deltaRotation: Quat) => void;
  private currentMode: RenderMode = 'shading';
  private showGridState = true;
  private showSkeletonState = true;
  private showThemePropsState = true;
  private showPartnerState = false;
  private selectedBoneName: string | null = null;
  private selectedActorId: 'main' | 'partner' = 'main';
  private selectedPropUid: string | null = null;
  private selectedMannequinRoot: 'main' | 'partner' | null = null;
  private partnerLoadedModelId: MannequinModelId | null = null;
  private mainLoadSeq = 0;
  private partnerLoadSeq = 0;
  private lastPartnerPreset?: (typeof POSE_PRESETS)[number];
  private currentThemeBgHex = 0x18181b;
  private currentOutfitId: number | null = null;
  private currentMainWardrobe: OutfitCompositionV1 = { schemaVersion: 1, actorId: 'main', itemIds: [] };
  private currentPartnerWardrobe: OutfitCompositionV1 = { schemaVersion: 1, actorId: 'partner', itemIds: [] };
  private currentAccessoryConfig: BodyAccessoryConfig = {
    nailColorId: 'nail_none', footwearId: 'foot_bare', neckItemId: 'neck_none', wristItemId: 'wrist_none', legItemId: 'leg_none',
  };
  public currentModelId: MannequinModelId = 'procedural';
  public currentMaterialStyle: MaterialStyle = 'matte_white';
  private defaultMaterial = createMaterialByStyle('matte_white');
  private depthMaterial = createDepthShaderMaterial();
  private normalMaterial = createNormalShaderMaterial();
  private lineartMaterial = createLineartShaderMaterial();
  private wireframeMaterial = createWireframeMaterial();

  constructor(canvas: HTMLCanvasElement, onBoneSelect?: (name: string | null, actorId?: 'main' | 'partner') => void) {
    this.canvas = canvas;
    this.onBoneSelectedCallback = onBoneSelect;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.currentThemeBgHex);
    const [width, height] = [canvas.clientWidth || window.innerWidth || 800, canvas.clientHeight || window.innerHeight || 600];
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    this.camera.position.set(0, 0.92, 3.75);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.overlayCanvas = Object.assign(document.createElement('canvas'), {
      width, height, className: 'absolute inset-0 w-full h-full pointer-events-none hidden',
    });
    canvas.parentElement?.appendChild(this.overlayCanvas);
    this.studioLights = createStudioLightsAndStage(this.scene);
    this.gridHelper = new THREE.GridHelper(10, 20, 0x3f3f46, 0x27272a);
    this.humanoid = createProceduralHumanoid();
    applyPosePreset(this.humanoid.bones, POSE_PRESETS[0]);
    this.partnerHumanoid = createProceduralHumanoid();
    setJointDotsVisible(this.partnerHumanoid.group, false, null);
    this.partnerHumanoid.group.visible = false;
    this.skeletonHelper = createStylizedSkeletonHelper();
    this.scene.add(this.gridHelper, this.humanoid.group, this.partnerHumanoid.group, this.skeletonHelper);
    this.orbitControls = new OrbitControls(this.camera, canvas);
    this.orbitControls.enableDamping = true;
    this.orbitControls.target.set(0, 0.86, 0);
    this.cameraController = new CameraController(this.camera, this.orbitControls);
    this.transformControls = new TransformControls(this.camera, canvas);
    this.transformControls.size = 0.72;
    this.transformControls.setSpace('local');
    this.scene.add(this.transformControls.getHelper());
    this.transformControls.addEventListener('dragging-changed', (e) => {
      this.orbitControls.enabled = !e.value;
      if (e.value) { this.isDraggingGizmo = true; return; }
      const o = this.transformControls.object;
      if (!o) return;
      const pos: [number, number, number] = [Number(o.position.x.toFixed(3)), Number(o.position.y.toFixed(3)), Number(o.position.z.toFixed(3))];
      const rot: [number, number, number] = [Number(o.rotation.x.toFixed(3)), Number(o.rotation.y.toFixed(3)), Number(o.rotation.z.toFixed(3))];
      if (this.selectedPropUid && o.userData?.propUid === this.selectedPropUid) {
        this.onPropTransformCallback?.(this.selectedPropUid, pos, rot[1], Number(o.scale.x.toFixed(3)), rot[0], rot[2]);
      } else if (this.selectedMannequinRoot) {
        const mult = Number((o.scale.x / (o.userData?.baseScale || 1.0)).toFixed(3));
        this.onMannequinTransformCallback?.(this.selectedMannequinRoot, pos, rot, mult);
      } else if (this.selectedBoneName && (o as THREE.Bone).isBone) {
        this.onBoneTransformEndCallback?.(this.selectedActorId, this.selectedBoneName, extractRestDeltaQuat(o as THREE.Bone));
      }
    });
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.startLoop();
    this.loadMannequinModel('realistic_woman').catch(() => {});
  }

  private onPointerDown = (event: PointerEvent): void => {
    if (event.button === 0) { this.pointerDownPos = { x: event.clientX, y: event.clientY }; this.isDraggingGizmo = this.transformControls.dragging; }
  };

  private onPointerUp = (event: PointerEvent): void => {
    if (event.button !== 0 || Math.hypot(event.clientX - this.pointerDownPos.x, event.clientY - this.pointerDownPos.y) > 5) return;
    if (this.isDraggingGizmo || this.transformControls.dragging) { this.isDraggingGizmo = false; return; }
    if ((this.transformControls as unknown as { axis: string | null }).axis !== null) return;
    const hit = pickSceneEntityAtPointer(
      event, this.canvas, this.camera, this.raycaster, this.mouse,
      this.humanoid, this.partnerHumanoid, this.showPartnerState, this.studioLights.themePropsGroup
    );
    if (hit.kind === 'bone') {
      this.selectedMannequinRoot = null; this.selectProp(null); this.onPropSelectedCallback?.(null);
      this.selectBone(hit.boneName, hit.actorId);
    } else if (hit.kind === 'prop') {
      this.selectedMannequinRoot = null; this.selectBone(null); this.selectProp(hit.propUid); this.onPropSelectedCallback?.(hit.propUid);
    } else {
      this.selectedMannequinRoot = null; this.selectBone(null); this.selectProp(null); this.onPropSelectedCallback?.(null);
    }
  };

  public selectBone(boneName: string | null, actorId: 'main' | 'partner' = this.selectedActorId): void {
    this.selectedBoneName = boneName;
    this.selectedActorId = actorId;
    const showDots = this.showSkeletonState && this.currentMode === 'shading';
    if (!boneName) {
      if (!this.selectedPropUid && !this.selectedMannequinRoot) this.transformControls.detach();
      setJointDotsVisible(this.humanoid.group, showDots, null);
      setJointDotsVisible(this.partnerHumanoid.group, showDots && this.showPartnerState, null);
      this.onBoneSelectedCallback?.(null, actorId);
      return;
    }
    const targetRig = actorId === 'partner' ? this.partnerHumanoid : this.humanoid;
    const bone = targetRig.bones.get(boneName);
    if (bone) {
      this.selectedPropUid = null; this.selectedMannequinRoot = null;
      this.transformControls.setSpace('local'); this.transformControls.setMode('rotate');
      this.transformControls.attach(bone);
      setJointDotsVisible(this.humanoid.group, showDots, actorId === 'main' ? boneName : null);
      setJointDotsVisible(this.partnerHumanoid.group, showDots && this.showPartnerState, actorId === 'partner' ? boneName : null);
      this.onBoneSelectedCallback?.(boneName, actorId);
    }
  }

  public getSelectedActorId(): 'main' | 'partner' { return this.selectedActorId; }

  public selectProp(propUid: string | null): void {
    this.selectedPropUid = propUid;
    if (!propUid) { if (!this.selectedBoneName && !this.selectedMannequinRoot) this.transformControls.detach(); return; }
    const propGroup = findPropGroupByUid(this.studioLights.themePropsGroup, propUid);
    if (!propGroup) { this.transformControls.detach(); return; }
    this.selectedBoneName = null; this.selectedMannequinRoot = null;
    setJointDotsVisible(this.humanoid.group, this.showSkeletonState && this.currentMode === 'shading', null);
    this.transformControls.setSpace('world'); this.transformControls.attach(propGroup);
  }

  public selectMannequinRoot(target: 'main' | 'partner' | null): void {
    this.selectedMannequinRoot = target;
    if (!target) { if (!this.selectedBoneName && !this.selectedPropUid) this.transformControls.detach(); return; }
    this.selectedBoneName = null; this.selectedPropUid = null;
    setJointDotsVisible(this.humanoid.group, this.showSkeletonState && this.currentMode === 'shading', null);
    this.transformControls.setSpace('world');
    this.transformControls.attach(target === 'main' ? this.humanoid.group : this.partnerHumanoid.group);
  }

  public applyMannequinTransform(target: 'main' | 'partner', pos: [number, number, number], rot: [number, number, number], scale: number): void {
    applyMannequinGroupTransform(target === 'main' ? this.humanoid.group : this.partnerHumanoid.group, pos, rot, scale);
  }

  public setRenderMode(mode: RenderMode): void {
    this.currentMode = mode;
    this.overlayCanvas.classList.toggle('hidden', mode !== 'openpose');
    const isShading = mode === 'shading';
    this.gridHelper.visible = isShading && this.showGridState;
    this.studioLights.stageFloor.visible = false;
    this.studioLights.stageRing.visible = false;
    this.studioLights.themePropsGroup.visible = isShading && this.showThemePropsState;
    this.skeletonHelper.visible = isShading && this.showSkeletonState;
    this.humanoid.group.visible = mode !== 'openpose';
    this.partnerHumanoid.group.visible = this.showPartnerState && mode !== 'openpose';
    setJointDotsVisible(this.humanoid.group, isShading && this.showSkeletonState, this.selectedActorId === 'main' ? this.selectedBoneName : null);
    setJointDotsVisible(this.partnerHumanoid.group, isShading && this.showSkeletonState && this.showPartnerState, this.selectedActorId === 'partner' ? this.selectedBoneName : null);
    const bgMap: Record<RenderMode, number> = {
      depth: 0x000000, normal: 0x8080ff, canny: 0x000000, lineart: 0x000000, wireframe: 0x000000, openpose: 0x000000, shading: this.currentThemeBgHex,
    };
    this.scene.background = new THREE.Color(bgMap[mode]);
    const matMap: Record<Exclude<RenderMode, 'openpose'>, THREE.Material> = {
      depth: this.depthMaterial, normal: this.normalMaterial, lineart: this.lineartMaterial,
      canny: this.wireframeMaterial, wireframe: this.wireframeMaterial, shading: this.defaultMaterial,
    };
    if (mode !== 'openpose') {
      applyMaterialToHierarchy(this.humanoid.group, matMap[mode], isShading);
      applyMaterialToHierarchy(this.partnerHumanoid.group, matMap[mode], isShading);
    }
  }

  public applyThemeEnvironment(themeId: SoloThemeId, envIndex: number, lightIndex: number, roomProps?: RoomPropInstance[]): void {
    this.currentThemeBgHex = applyStudioThemeEnvironment(this.scene, this.studioLights, themeId, envIndex, lightIndex, this.currentMode === 'shading', roomProps);
    if (this.selectedPropUid) this.selectProp(this.selectedPropUid);
  }

  public setShowThemeProps(show: boolean): void { this.showThemePropsState = show; if (this.currentMode === 'shading') this.studioLights.themePropsGroup.visible = show; }
  public createPoseExportScene(format: ModelExportFormat): THREE.Scene {
    const previousMode = this.currentMode;
    if (previousMode !== 'shading') this.setRenderMode('shading');
    try {
      const actors = [this.humanoid.group, ...(this.showPartnerState ? [this.partnerHumanoid.group] : [])];
      return format === 'glb' || format === 'fbx'
        ? buildEditableModelScene(actors)
        : buildStaticModelScene(actors);
    } finally {
      if (previousMode !== 'shading') this.setRenderMode(previousMode);
    }
  }
  public applyOutfit(outfitId: number | null): void {
    this.currentOutfitId = outfitId && outfitId > 0 ? outfitId : null;
    applyOutfitToMannequin(this.humanoid.group, this.humanoid.bones, this.currentOutfitId);
    if (this.currentMode !== 'shading' && this.currentMode !== 'openpose') this.setRenderMode(this.currentMode);
  }
  public applyWardrobeComposition(composition: OutfitCompositionV1, actorId: 'main' | 'partner' = 'main'): void {
    if (actorId === 'partner') {
      this.currentPartnerWardrobe = composition;
      applyWardrobeCompositionToRig(
        this.partnerHumanoid.group,
        this.partnerHumanoid.bones,
        composition,
        this.partnerLoadedModelId || 'realistic_muscular_male'
      );
    } else {
      this.currentMainWardrobe = composition;
      applyWardrobeCompositionToRig(this.humanoid.group, this.humanoid.bones, composition, this.currentModelId);
    }
    if (this.currentMode !== 'shading' && this.currentMode !== 'openpose') this.setRenderMode(this.currentMode);
  }
  public applyBodyAccessories(config: BodyAccessoryConfig): void { this.currentAccessoryConfig = config; applyBodyAccessoriesToRig(this.humanoid.group, this.humanoid.bones, config); }

  public setPartnerGuide(show: boolean, partnerPreset?: (typeof POSE_PRESETS)[number]): void {
    const wasShowingPartner = this.showPartnerState;
    this.showPartnerState = show;
    if (partnerPreset) this.lastPartnerPreset = partnerPreset;
    const activePreset = partnerPreset || this.lastPartnerPreset || POSE_PRESETS.find((p) => p.category === 'couple');
    this.partnerHumanoid.group.visible = show && this.currentMode !== 'openpose';
    if (!show) {
      if (this.selectedActorId === 'partner') this.selectBone(null, 'main');
      if (wasShowingPartner) {
        applyMannequinGroupTransform(this.humanoid.group, [0, 0, 0], [0, 0, 0], 1.0);
        this.onMannequinTransformCallback?.('main', [0, 0, 0], [0, 0, 0], 1.0);
      }
      return;
    }
    const isMainMale = MANNEQUIN_MODELS.find((m) => m.id === this.currentModelId)?.gender === 'male';
    const desiredPartnerModel: MannequinModelId = isMainMale ? 'realistic_woman' : 'realistic_muscular_male';
    if (this.partnerLoadedModelId !== desiredPartnerModel) {
      const pSeq = ++this.partnerLoadSeq;
      loadFbxMannequin(desiredPartnerModel, 'clay')
        .then((fbxRig) => {
          if (pSeq !== this.partnerLoadSeq) { disposeObjectHierarchy(fbxRig.group); return; }
          this.scene.remove(this.partnerHumanoid.group);
          disposeObjectHierarchy(this.partnerHumanoid.group);
          this.partnerHumanoid = fbxRig;
          this.partnerHumanoid.group.visible = this.showPartnerState && this.currentMode !== 'openpose';
          setJointDotsVisible(this.partnerHumanoid.group, false, null);
          this.scene.add(this.partnerHumanoid.group);
          this.partnerLoadedModelId = desiredPartnerModel;
          if (this.showPartnerState) this.setPartnerGuide(true, this.lastPartnerPreset);
        })
        .catch(() => {});
    }
    if (activePreset) {
      const res = applyCouplePresetToRigs(this.humanoid, this.partnerHumanoid, activePreset, isMainMale);
      this.onMannequinTransformCallback?.('main', res.mainPos, [0, res.mainRotY, 0], 1.0);
      this.onMannequinTransformCallback?.('partner', res.partnerPos, [0, res.partnerRotY, 0], 1.0);
    }
  }

  public async loadMannequinModel(modelId: MannequinModelId, onProgress?: (percent: number) => void): Promise<void> {
    if (this.currentModelId === modelId) return;
    const seq = ++this.mainLoadSeq;
    this.transformControls.detach();
    this.selectedBoneName = null;
    this.onBoneSelectedCallback?.(null, 'main');
    const newRig = modelId === 'procedural' ? createProceduralHumanoid() : await loadFbxMannequin(modelId, this.currentMaterialStyle, onProgress);
    if (seq !== this.mainLoadSeq) { disposeObjectHierarchy(newRig.group); return; }
    this.scene.remove(this.humanoid.group);
    disposeObjectHierarchy(this.humanoid.group);
    this.humanoid = newRig;
    this.currentModelId = modelId;
    const profile = getMannequinProfile(modelId);
    const defaultPreset = POSE_PRESETS.find((p) => p.id === profile.defaultStandardPoseId) || POSE_PRESETS[0];
    applyPosePreset(this.humanoid.bones, defaultPreset);
    applyOutfitToMannequin(this.humanoid.group, this.humanoid.bones, this.currentOutfitId);
    applyWardrobeCompositionToRig(this.humanoid.group, this.humanoid.bones, this.currentMainWardrobe, modelId);
    applyBodyAccessoriesToRig(this.humanoid.group, this.humanoid.bones, this.currentAccessoryConfig);
    this.scene.add(this.humanoid.group);
    if (this.showPartnerState && this.lastPartnerPreset) this.setPartnerGuide(true, this.lastPartnerPreset);
    const bounds = measureHumanoidWorldYBounds(this.humanoid.group, this.humanoid.bones, modelId);
    this.cameraController.frameFullBody(bounds.spanY, Math.min(0, bounds.minY));
    this.setRenderMode(this.currentMode);
  }

  public setMaterialStyle(style: MaterialStyle): void {
    this.currentMaterialStyle = style;
    this.defaultMaterial.dispose();
    this.defaultMaterial = createMaterialByStyle(style);
    if (this.currentMode === 'shading') applyMaterialToHierarchy(this.humanoid.group, this.defaultMaterial, true);
  }

  public setShowGrid(show: boolean): void { this.showGridState = show; if (this.currentMode === 'shading') this.gridHelper.visible = show; }
  public setShowSkeleton(show: boolean): void {
    this.showSkeletonState = show;
    if (this.currentMode === 'shading') {
      this.skeletonHelper.visible = show;
      setJointDotsVisible(this.humanoid.group, show, this.selectedActorId === 'main' ? this.selectedBoneName : null);
      setJointDotsVisible(this.partnerHumanoid.group, show && this.showPartnerState, this.selectedActorId === 'partner' ? this.selectedBoneName : null);
    }
  }
  public setGizmoMode(mode: GizmoMode): void { this.transformControls.setMode(mode); }
  public setGizmoSpace(space: GizmoSpace): void { this.transformControls.setSpace(space); }
  public setCameraPreset(preset: CameraPreset): void { this.cameraController.setStandardPreset(preset); }
  public setSoloThemeShot(targetHeight: number, distance: number, fov = 35): void { this.cameraController.setSoloThemeShot(targetHeight, Math.max(2.5, distance), fov); }
  public setPetiteProportions(isPetite: boolean): void { applyBodyProportions(this.humanoid.bones, isPetite); }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    [this.overlayCanvas.width, this.overlayCanvas.height] = [width, height];
  }

  public runRenderJob(spec: RenderSpec): RenderResult {
    return runSceneRenderJob(spec, {
      scene: this.scene, camera: this.camera, renderer: this.renderer, currentMode: this.currentMode,
      mainRig: this.humanoid, mainOutfit: this.currentMainWardrobe,
      partnerRig: this.partnerHumanoid, partnerOutfit: this.currentPartnerWardrobe, partnerVisible: this.showPartnerState,
      transformHelper: this.transformControls.getHelper(), skeletonHelper: this.skeletonHelper,
      depthMaterial: this.depthMaterial, restoreDots: this.showSkeletonState && this.currentMode === 'shading',
      selectedBoneName: this.selectedBoneName,
    });
  }

  public captureSnapshot(width = 1024, height = width): string {
    return this.runRenderJob({ sceneRevision: 1, width, height, mode: this.currentMode, actorIds: this.showPartnerState ? ['main', 'partner'] : ['main'], bodyFormat: 'coco18' }).dataUrl;
  }

  public extractSceneDocument(revision = 1, width = 1024, height = 1024, bodyFormat: BodyFormat = 'coco18'): SceneDocumentV1 {
    return buildSceneDocumentSnapshot({
      revision, mainRig: this.humanoid, mainModelId: this.currentModelId, mainOutfit: this.currentMainWardrobe,
      partnerRig: this.partnerHumanoid, partnerModelId: this.partnerLoadedModelId || 'realistic_muscular_male', partnerOutfit: this.currentPartnerWardrobe,
      partnerVisible: this.showPartnerState, camera: this.camera, target: this.orbitControls.target,
      exportWidth: width, exportHeight: height, bodyFormat,
    });
  }

  public applySceneDocument(doc: SceneDocumentV1): void {
    const mainActor = doc.actors.find((a) => a.id === 'main') || doc.actors[0];
    if (mainActor) {
      applyActorV1ToRig(mainActor, this.humanoid);
      if (mainActor.outfit) this.applyWardrobeComposition(mainActor.outfit, 'main');
    }
    const partnerActor = doc.actors.find((a) => a.id === 'partner');
    if (partnerActor) {
      this.showPartnerState = partnerActor.visible;
      this.partnerHumanoid.group.visible = partnerActor.visible && this.currentMode !== 'openpose';
      applyActorV1ToRig(partnerActor, this.partnerHumanoid);
      if (partnerActor.outfit) this.applyWardrobeComposition(partnerActor.outfit, 'partner');
    }
    this.camera.position.set(doc.camera.position[0], doc.camera.position[1], doc.camera.position[2]);
    this.orbitControls.target.set(doc.camera.target[0], doc.camera.target[1], doc.camera.target[2]);
    this.camera.fov = doc.camera.fovDegrees;
    this.camera.updateProjectionMatrix();
    this.orbitControls.update();
  }

  private startLoop(): void {
    const tick = () => {
      this.orbitControls.update();
      this.humanoid.group.updateMatrixWorld(true);
      if (this.showPartnerState) this.partnerHumanoid.group.updateMatrixWorld(true);
      if (this.currentMode === 'depth') {
        const bounds = computeCameraSpaceDepthBounds(this.camera, [this.humanoid.group, ...(this.showPartnerState ? [this.partnerHumanoid.group] : [])]);
        this.depthMaterial.uniforms.cameraNear.value = bounds.near;
        this.depthMaterial.uniforms.cameraFar.value = bounds.far;
      }
      const ctx = this.currentMode === 'openpose' ? this.overlayCanvas.getContext('2d') : null;
      if (ctx) {
        const [w, h] = [this.overlayCanvas.width, this.overlayCanvas.height];
        const maps = [getJointScreenPositions(this.humanoid.bones, this.camera, w, h)];
        if (this.showPartnerState) maps.push(getJointScreenPositions(this.partnerHumanoid.bones, this.camera, w, h));
        drawOpenPoseSkeleton(ctx, maps, w, h);
      } else {
        updateStylizedSkeletonHelper(this.skeletonHelper, this.humanoid.bones);
        this.renderer.render(this.scene, this.camera);
      }
      this.animId = requestAnimationFrame(tick);
    };
    tick();
  }

  public dispose(): void {
    this.mainLoadSeq++;
    this.partnerLoadSeq++;
    if (this.animId !== null) cancelAnimationFrame(this.animId);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.overlayCanvas.parentElement?.removeChild(this.overlayCanvas);
    disposeObjectHierarchy(this.humanoid.group);
    disposeObjectHierarchy(this.partnerHumanoid.group);
    disposeObjectHierarchy(this.skeletonHelper);
    disposeSharedRenderTarget();
    [this.defaultMaterial, this.depthMaterial, this.normalMaterial, this.lineartMaterial, this.wireframeMaterial].forEach((m) => m.dispose());
    [this.orbitControls, this.transformControls, this.renderer].forEach((c) => c.dispose());
  }
}
