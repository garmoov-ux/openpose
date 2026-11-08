import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { RenderMode, GizmoMode, GizmoSpace, CameraPreset, MannequinModelId, MaterialStyle } from '@/types';
import { SoloThemeId } from '@/types/themeSolo';
import { RoomPropInstance } from '@/data/themesSolo/roomPropCatalog';
import { createProceduralHumanoid, HumanoidRigResult, applyBodyProportions } from '@/core/mannequin/humanoidRig';
import { loadFbxMannequin, measureHumanoidWorldYBounds } from '@/core/mannequin/modelLoader';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';
import { getMannequinProfile } from '@/core/mannequin/mannequinProfiles';
import { applyOutfitToMannequin } from '@/core/mannequin/outfitVisualizer';
import { BodyAccessoryConfig, applyBodyAccessoriesToRig } from '@/core/mannequin/bodyAccessoryMeshes';
import { CameraController } from './CameraController';
import {
  createDepthShaderMaterial, createNormalShaderMaterial, createCannyMaterial, createMaterialByStyle,
} from '@/core/shaders/materials';
import {
  applyMaterialToHierarchy, createStylizedSkeletonHelper, updateStylizedSkeletonHelper,
  setJointDotsVisible, renderOffscreenSceneSnapshot,
} from './modelSwapHelper';
import { StudioLights, createStudioLightsAndStage, applyStudioThemeEnvironment } from './environmentStudio';
import { pickBoneFromRaycast, pickRoomPropFromRaycast, findPropGroupByUid } from './smartPicker';
import { getJointScreenPositions, drawOpenPoseSkeleton } from '@/core/pipeline/openposePipeline';
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
  private onBoneSelectedCallback?: (boneName: string | null) => void;
  public onPropSelectedCallback?: (propUid: string | null) => void;
  public onPropTransformCallback?: (propUid: string, pos: [number, number, number], rotY: number) => void;
  private currentMode: RenderMode = 'shading';
  private showGridState = true;
  private showSkeletonState = true;
  private showThemePropsState = true;
  private showPartnerState = false;
  private selectedBoneName: string | null = null;
  private selectedPropUid: string | null = null;
  private partnerFbxLoaded = false;
  private partnerFbxLoading = false;
  private lastPartnerPreset?: (typeof POSE_PRESETS)[number];
  private currentThemeBgHex = 0x1c1917;
  private currentOutfitId: number | null = null;
  private currentAccessoryConfig: BodyAccessoryConfig = {
    nailColorId: 'nail_none', footwearId: 'foot_bare', neckItemId: 'neck_none', wristItemId: 'wrist_none', legItemId: 'leg_none',
  };
  public currentModelId: MannequinModelId = 'procedural';
  public currentMaterialStyle: MaterialStyle = 'matte_white';
  private defaultMaterial = createMaterialByStyle('matte_white');
  private depthMaterial = createDepthShaderMaterial();
  private normalMaterial = createNormalShaderMaterial();
  private cannyMaterial = createCannyMaterial();
  constructor(canvas: HTMLCanvasElement, onBoneSelect?: (name: string | null) => void) {
    this.canvas = canvas;
    this.onBoneSelectedCallback = onBoneSelect;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.currentThemeBgHex);
    const width = canvas.clientWidth || window.innerWidth || 800;
    const height = canvas.clientHeight || window.innerHeight || 600;
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    this.camera.position.set(0, 0.92, 3.75);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = true;
    this.overlayCanvas = document.createElement('canvas');
    this.overlayCanvas.width = width;
    this.overlayCanvas.height = height;
    this.overlayCanvas.className = 'absolute inset-0 w-full h-full pointer-events-none hidden';
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
      if (e.value) this.isDraggingGizmo = true;
      else if (this.selectedPropUid && this.transformControls.object) {
        const o = this.transformControls.object;
        this.onPropTransformCallback?.(this.selectedPropUid, [Number(o.position.x.toFixed(3)), Number(o.position.y.toFixed(3)), Number(o.position.z.toFixed(3))], Number(o.rotation.y.toFixed(3)));
      }
    });
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.startLoop();
    this.loadMannequinModel('realistic_woman').catch(() => {});
  }
  private onPointerDown = (event: PointerEvent): void => {
    if (event.button === 0) {
      this.pointerDownPos = { x: event.clientX, y: event.clientY };
      this.isDraggingGizmo = this.transformControls.dragging;
    }
  };
  private onPointerUp = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    if (this.isDraggingGizmo || this.transformControls.dragging) { this.isDraggingGizmo = false; return; }
    if (Math.hypot(event.clientX - this.pointerDownPos.x, event.clientY - this.pointerDownPos.y) > 5) return;
    if ((this.transformControls as unknown as { axis: string | null }).axis !== null) return;
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hitBone = pickBoneFromRaycast(this.raycaster, Array.from(this.humanoid.colliders.values()), this.humanoid.group, this.humanoid.bones);
    if (hitBone) {
      this.selectProp(null);
      this.onPropSelectedCallback?.(null);
      this.selectBone(hitBone);
      return;
    }
    if (this.partnerHumanoid.group.visible) {
      const pBoneName = pickBoneFromRaycast(this.raycaster, Array.from(this.partnerHumanoid.colliders.values()), this.partnerHumanoid.group, this.partnerHumanoid.bones);
      const pBone = pBoneName ? this.partnerHumanoid.bones.get(pBoneName) : undefined;
      if (pBoneName && pBone) {
        this.selectProp(null);
        this.onPropSelectedCallback?.(null);
        this.selectedBoneName = pBoneName;
        this.transformControls.setSpace('local');
        this.transformControls.setMode('rotate');
        this.transformControls.attach(pBone);
        this.onBoneSelectedCallback?.(pBoneName);
        return;
      }
    }
    const hitPropUid = pickRoomPropFromRaycast(this.raycaster, this.studioLights.themePropsGroup);
    this.selectBone(null);
    this.selectProp(hitPropUid);
    this.onPropSelectedCallback?.(hitPropUid);
  };
  public selectBone(boneName: string | null): void {
    this.selectedBoneName = boneName;
    if (!boneName) {
      if (!this.selectedPropUid) this.transformControls.detach();
      setJointDotsVisible(this.humanoid.group, this.showSkeletonState && this.currentMode === 'shading', null);
      this.onBoneSelectedCallback?.(null);
      return;
    }
    const bone = this.humanoid.bones.get(boneName);
    if (bone) {
      this.selectedPropUid = null;
      this.transformControls.setSpace('local');
      this.transformControls.setMode('rotate');
      this.transformControls.attach(bone);
      setJointDotsVisible(this.humanoid.group, this.showSkeletonState && this.currentMode === 'shading', boneName);
      this.onBoneSelectedCallback?.(boneName);
    }
  }
  public selectProp(propUid: string | null): void {
    this.selectedPropUid = propUid;
    if (!propUid) {
      if (!this.selectedBoneName) this.transformControls.detach();
      return;
    }
    const propGroup = findPropGroupByUid(this.studioLights.themePropsGroup, propUid);
    if (!propGroup) { this.transformControls.detach(); return; }
    this.selectedBoneName = null;
    setJointDotsVisible(this.humanoid.group, this.showSkeletonState && this.currentMode === 'shading', null);
    this.transformControls.setSpace('world');
    this.transformControls.attach(propGroup);
  }
  public setRenderMode(mode: RenderMode): void {
    this.currentMode = mode;
    this.overlayCanvas.classList.toggle('hidden', mode !== 'openpose');
    const isShading = mode === 'shading';
    this.gridHelper.visible = isShading && this.showGridState;
    this.studioLights.stageFloor.visible = isShading && this.showGridState;
    this.studioLights.stageRing.visible = isShading && this.showGridState;
    this.studioLights.themePropsGroup.visible = isShading && this.showThemePropsState;
    this.skeletonHelper.visible = isShading && this.showSkeletonState;
    this.humanoid.group.visible = mode !== 'openpose';
    this.partnerHumanoid.group.visible = this.showPartnerState && mode !== 'openpose';
    setJointDotsVisible(this.humanoid.group, isShading && this.showSkeletonState, this.selectedBoneName);
    const bgMap: Record<RenderMode, number> = {
      depth: 0x000000, normal: 0x8080ff, canny: 0x000000, openpose: 0x000000, shading: this.currentThemeBgHex,
    };
    this.scene.background = new THREE.Color(bgMap[mode]);
    const matMap: Record<Exclude<RenderMode, 'openpose'>, THREE.Material> = {
      depth: this.depthMaterial, normal: this.normalMaterial, canny: this.cannyMaterial, shading: this.defaultMaterial,
    };
    if (mode !== 'openpose') {
      applyMaterialToHierarchy(this.humanoid.group, matMap[mode], isShading);
      applyMaterialToHierarchy(this.partnerHumanoid.group, matMap[mode], isShading);
    }
  }
  public applyThemeEnvironment(themeId: SoloThemeId, envIndex: number, lightIndex: number, roomProps?: RoomPropInstance[]): void {
    this.currentThemeBgHex = applyStudioThemeEnvironment(
      this.scene, this.studioLights, themeId, envIndex, lightIndex, this.currentMode === 'shading', roomProps
    );
    if (this.selectedPropUid) this.selectProp(this.selectedPropUid);
  }
  public setShowThemeProps(show: boolean): void {
    this.showThemePropsState = show;
    if (this.currentMode === 'shading') this.studioLights.themePropsGroup.visible = show;
  }
  public applyOutfit(outfitId: number | null): void {
    this.currentOutfitId = outfitId && outfitId > 0 ? outfitId : null;
    applyOutfitToMannequin(this.humanoid.group, this.humanoid.bones, this.currentOutfitId);
    if (this.currentMode !== 'shading' && this.currentMode !== 'openpose') this.setRenderMode(this.currentMode);
  }
  public applyBodyAccessories(config: BodyAccessoryConfig): void {
    this.currentAccessoryConfig = config;
    applyBodyAccessoriesToRig(this.humanoid.group, this.humanoid.bones, config);
  }
  public setPartnerGuide(show: boolean, partnerPreset?: (typeof POSE_PRESETS)[number]): void {
    this.showPartnerState = show;
    if (partnerPreset) this.lastPartnerPreset = partnerPreset;
    const activePreset = partnerPreset || this.lastPartnerPreset || POSE_PRESETS.find((p) => p.category === 'couple');
    this.partnerHumanoid.group.visible = show && this.currentMode !== 'openpose';
    if (!show) return;
    if (!this.partnerFbxLoaded && !this.partnerFbxLoading) {
      this.partnerFbxLoading = true;
      loadFbxMannequin('realistic_muscular_male', 'clay')
        .then((fbxRig) => {
          this.scene.remove(this.partnerHumanoid.group);
          this.partnerHumanoid = fbxRig;
          setJointDotsVisible(this.partnerHumanoid.group, false, null);
          this.scene.add(this.partnerHumanoid.group);
          this.partnerFbxLoaded = true;
          this.partnerFbxLoading = false;
          if (this.showPartnerState) this.setPartnerGuide(true, this.lastPartnerPreset);
        })
        .catch(() => { this.partnerFbxLoading = false; });
    }
    this.partnerHumanoid.group.position.set(0, 0, 0);
    this.partnerHumanoid.group.rotation.set(0, 0, 0);
    if (activePreset?.partnerPose) {
      applyPosePreset(this.partnerHumanoid.bones, { ...activePreset, pose: activePreset.partnerPose });
      const [ox, oy, oz] = activePreset.partnerOffset || [0, 0, -0.34];
      this.partnerHumanoid.group.position.set(ox, oy, oz);
      this.partnerHumanoid.group.rotation.set(0, activePreset.partnerRotationY ?? 0, 0);
    } else {
      applyPosePreset(this.partnerHumanoid.bones, POSE_PRESETS[0]);
      this.partnerHumanoid.group.position.set(0.32, 0, -0.22);
    }
  }
  public async loadMannequinModel(modelId: MannequinModelId, onProgress?: (percent: number) => void): Promise<void> {
    if (this.currentModelId === modelId) return;
    this.transformControls.detach();
    this.selectedBoneName = null;
    this.onBoneSelectedCallback?.(null);
    const newRig = modelId === 'procedural'
      ? createProceduralHumanoid()
      : await loadFbxMannequin(modelId, this.currentMaterialStyle, onProgress);
    this.scene.remove(this.humanoid.group);
    this.humanoid = newRig;
    this.currentModelId = modelId;
    const profile = getMannequinProfile(modelId);
    const defaultPreset = POSE_PRESETS.find((p) => p.id === profile.defaultStandardPoseId) || POSE_PRESETS[0];
    applyPosePreset(this.humanoid.bones, defaultPreset);
    applyOutfitToMannequin(this.humanoid.group, this.humanoid.bones, this.currentOutfitId);
    applyBodyAccessoriesToRig(this.humanoid.group, this.humanoid.bones, this.currentAccessoryConfig);
    this.scene.add(this.humanoid.group);
    const bounds = measureHumanoidWorldYBounds(this.humanoid.group, this.humanoid.bones, modelId);
    this.cameraController.frameFullBody(bounds.spanY, Math.min(0, bounds.minY));
    this.setRenderMode(this.currentMode);
  }
  public setMaterialStyle(style: MaterialStyle): void {
    this.currentMaterialStyle = style;
    this.defaultMaterial = createMaterialByStyle(style);
    if (this.currentMode === 'shading') applyMaterialToHierarchy(this.humanoid.group, this.defaultMaterial, true);
  }
  public setShowGrid(show: boolean): void {
    this.showGridState = show;
    if (this.currentMode === 'shading') this.gridHelper.visible = this.studioLights.stageFloor.visible = this.studioLights.stageRing.visible = show;
  }
  public setShowSkeleton(show: boolean): void {
    this.showSkeletonState = show;
    if (this.currentMode === 'shading') {
      this.skeletonHelper.visible = show;
      setJointDotsVisible(this.humanoid.group, show, this.selectedBoneName);
    }
  }
  public setGizmoMode(mode: GizmoMode): void { this.transformControls.setMode(mode); }
  public setGizmoSpace(space: GizmoSpace): void { this.transformControls.setSpace(space); }
  public setCameraPreset(preset: CameraPreset): void { this.cameraController.setStandardPreset(preset); }
  public setSoloThemeShot(targetHeight: number, distance: number, fov = 35): void {
    this.cameraController.setSoloThemeShot(targetHeight, Math.max(2.5, distance), fov);
  }
  public setPetiteProportions(isPetite: boolean): void { applyBodyProportions(this.humanoid.bones, isPetite); }
  public resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    [this.overlayCanvas.width, this.overlayCanvas.height] = [width, height];
  }
  public captureSnapshot(resolution = 1024): string {
    const offCanvas = Object.assign(document.createElement('canvas'), { width: resolution, height: resolution });
    if (this.currentMode === 'openpose') {
      drawOpenPoseSkeleton(offCanvas.getContext('2d')!, getJointScreenPositions(this.humanoid.bones, this.camera, resolution, resolution), resolution, resolution);
    } else {
      renderOffscreenSceneSnapshot(this.scene, this.camera, this.humanoid.group, this.transformControls.getHelper(), this.skeletonHelper, offCanvas, resolution, this.showSkeletonState && this.currentMode === 'shading', this.selectedBoneName);
    }
    return offCanvas.toDataURL('image/png');
  }
  private startLoop(): void {
    const tick = () => {
      this.orbitControls.update();
      this.humanoid.group.updateMatrixWorld(true);
      if (this.partnerHumanoid.group.visible) this.partnerHumanoid.group.updateMatrixWorld(true);
      if (this.currentMode === 'depth') {
        const dist = this.camera.position.distanceTo(this.orbitControls.target);
        this.depthMaterial.uniforms.cameraNear.value = Math.max(0.1, dist - 0.65);
        this.depthMaterial.uniforms.cameraFar.value = dist + 0.65;
      }
      const ctx = this.currentMode === 'openpose' ? this.overlayCanvas.getContext('2d') : null;
      if (ctx) {
        const [w, h] = [this.overlayCanvas.width, this.overlayCanvas.height];
        drawOpenPoseSkeleton(ctx, getJointScreenPositions(this.humanoid.bones, this.camera, w, h), w, h);
      } else {
        updateStylizedSkeletonHelper(this.skeletonHelper, this.humanoid.bones);
        this.renderer.render(this.scene, this.camera);
      }
      this.animId = requestAnimationFrame(tick);
    };
    tick();
  }
  public dispose(): void {
    if (this.animId !== null) cancelAnimationFrame(this.animId);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
    this.overlayCanvas.parentElement?.removeChild(this.overlayCanvas);
    [this.orbitControls, this.transformControls, this.renderer].forEach((c) => c.dispose());
  }
}
