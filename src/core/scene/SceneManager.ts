import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { RenderMode, GizmoMode, GizmoSpace, CameraPreset, MannequinModelId, MaterialStyle } from '@/types';
import { SoloThemeId } from '@/types/themeSolo';
import { createProceduralHumanoid, HumanoidRigResult, applyBodyProportions } from '@/core/mannequin/humanoidRig';
import { loadFbxMannequin } from '@/core/mannequin/modelLoader';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';
import { applyOutfitToMannequin } from '@/core/mannequin/outfitVisualizer';
import { CameraController } from './CameraController';
import {
  createDepthShaderMaterial,
  createNormalShaderMaterial,
  createCannyMaterial,
  createMaterialByStyle,
} from '@/core/shaders/materials';
import {
  backupBoneRotations,
  restoreBoneRotations,
  applyMaterialToHierarchy,
  createStylizedSkeletonHelper,
  updateStylizedSkeletonHelper,
  setJointDotsVisible,
} from './modelSwapHelper';
import {
  StudioLights,
  createStudioLightsAndStage,
  applyStudioThemeEnvironment,
} from './environmentStudio';
import { pickBoneFromRaycast } from './smartPicker';
import { getJointScreenPositions, drawOpenPoseSkeleton } from '@/core/pipeline/openposePipeline';

export class SceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public orbitControls: OrbitControls;
  public transformControls: TransformControls;
  public cameraController: CameraController;
  public humanoid: HumanoidRigResult;
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
  private currentMode: RenderMode = 'shading';
  private showGridState = true;
  private showSkeletonState = true;
  private selectedBoneName: string | null = null;
  private currentThemeBgHex = 0x1c1917;
  private currentOutfitId: number | null = 1;

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
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    this.camera.position.set(0, 1.15, 3.1);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    this.renderer.setSize(width, height);
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
    this.scene.add(this.gridHelper);

    this.humanoid = createProceduralHumanoid();
    applyPosePreset(this.humanoid.bones, POSE_PRESETS[0]);
    applyOutfitToMannequin(this.humanoid.group, this.humanoid.bones, this.currentOutfitId);
    this.scene.add(this.humanoid.group);

    this.skeletonHelper = createStylizedSkeletonHelper();
    this.scene.add(this.skeletonHelper);

    this.orbitControls = new OrbitControls(this.camera, canvas);
    this.orbitControls.enableDamping = true;
    this.orbitControls.target.set(0, 0.95, 0);
    this.cameraController = new CameraController(this.camera, this.orbitControls);

    this.transformControls = new TransformControls(this.camera, canvas);
    this.transformControls.size = 0.72;
    this.transformControls.setSpace('local');
    this.scene.add(this.transformControls.getHelper());
    this.transformControls.addEventListener('dragging-changed', (e) => {
      this.orbitControls.enabled = !e.value;
      if (e.value) {
        this.isDraggingGizmo = true;
      }
    });

    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
    this.startLoop();
    this.loadMannequinModel('realistic_woman').catch(() => {});
  }

  private onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    this.pointerDownPos = { x: event.clientX, y: event.clientY };
    this.isDraggingGizmo = this.transformControls.dragging;
  };

  private onPointerUp = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    if (this.isDraggingGizmo || this.transformControls.dragging) {
      this.isDraggingGizmo = false;
      return;
    }

    const dx = event.clientX - this.pointerDownPos.x;
    const dy = event.clientY - this.pointerDownPos.y;
    if (Math.hypot(dx, dy) > 5) return;

    if ((this.transformControls as unknown as { axis: string | null }).axis !== null) {
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const colliders = Array.from(this.humanoid.colliders.values());
    const boneName = pickBoneFromRaycast(this.raycaster, colliders, this.humanoid.group, this.humanoid.bones);
    this.selectBone(boneName);
  };

  public selectBone(boneName: string | null): void {
    this.selectedBoneName = boneName;
    if (!boneName) {
      this.transformControls.detach();
      setJointDotsVisible(this.humanoid.group, this.showSkeletonState && this.currentMode === 'shading', null);
      this.onBoneSelectedCallback?.(null);
      return;
    }
    const bone = this.humanoid.bones.get(boneName);
    if (bone) {
      this.transformControls.attach(bone);
      setJointDotsVisible(this.humanoid.group, this.showSkeletonState && this.currentMode === 'shading', boneName);
      this.onBoneSelectedCallback?.(boneName);
    }
  }

  public setRenderMode(mode: RenderMode): void {
    this.currentMode = mode;
    this.overlayCanvas.classList.toggle('hidden', mode !== 'openpose');
    const isShading = mode === 'shading';

    this.gridHelper.visible = isShading && this.showGridState;
    this.studioLights.stageFloor.visible = isShading && this.showGridState;
    this.studioLights.stageRing.visible = isShading && this.showGridState;
    this.skeletonHelper.visible = isShading && this.showSkeletonState;
    this.humanoid.group.visible = mode !== 'openpose';
    setJointDotsVisible(this.humanoid.group, isShading && this.showSkeletonState, this.selectedBoneName);

    if (mode === 'depth') {
      this.scene.background = new THREE.Color(0x000000);
      applyMaterialToHierarchy(this.humanoid.group, this.depthMaterial, false);
    } else if (mode === 'normal') {
      this.scene.background = new THREE.Color(0x8080ff);
      applyMaterialToHierarchy(this.humanoid.group, this.normalMaterial, false);
    } else if (mode === 'canny') {
      this.scene.background = new THREE.Color(0x000000);
      applyMaterialToHierarchy(this.humanoid.group, this.cannyMaterial, false);
    } else if (mode === 'openpose') {
      this.scene.background = new THREE.Color(0x000000);
    } else {
      this.scene.background = new THREE.Color(this.currentThemeBgHex);
      applyMaterialToHierarchy(this.humanoid.group, this.defaultMaterial, true);
    }
  }

  public applyThemeEnvironment(themeId: SoloThemeId, envIndex: number, lightIndex: number): void {
    this.currentThemeBgHex = applyStudioThemeEnvironment(
      this.scene,
      this.studioLights,
      themeId,
      envIndex,
      lightIndex,
      this.currentMode === 'shading'
    );
  }

  public applyOutfit(outfitId: number | null): void {
    this.currentOutfitId = outfitId;
    applyOutfitToMannequin(this.humanoid.group, this.humanoid.bones, outfitId);
    if (this.currentMode !== 'shading' && this.currentMode !== 'openpose') {
      this.setRenderMode(this.currentMode);
    }
  }

  public async loadMannequinModel(modelId: MannequinModelId, onProgress?: (percent: number) => void): Promise<void> {
    if (this.currentModelId === modelId) return;
    const boneBackup = backupBoneRotations(this.humanoid.bones);
    const prevSelected = this.selectedBoneName;
    this.transformControls.detach();

    const newRig = modelId === 'procedural'
      ? createProceduralHumanoid()
      : await loadFbxMannequin(modelId, this.currentMaterialStyle, onProgress);

    this.scene.remove(this.humanoid.group);
    restoreBoneRotations(newRig.bones, boneBackup);
    this.humanoid = newRig;
    this.currentModelId = modelId;
    applyOutfitToMannequin(this.humanoid.group, this.humanoid.bones, this.currentOutfitId);
    this.scene.add(this.humanoid.group);

    this.setRenderMode(this.currentMode);
    if (prevSelected) this.selectBone(prevSelected);
  }

  public setMaterialStyle(style: MaterialStyle): void {
    this.currentMaterialStyle = style;
    this.defaultMaterial = createMaterialByStyle(style);
    if (this.currentMode === 'shading') {
      applyMaterialToHierarchy(this.humanoid.group, this.defaultMaterial, true);
    }
  }

  public setShowGrid(show: boolean): void {
    this.showGridState = show;
    if (this.currentMode === 'shading') {
      this.gridHelper.visible = show;
      this.studioLights.stageFloor.visible = show;
      this.studioLights.stageRing.visible = show;
    }
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
    this.cameraController.setSoloThemeShot(targetHeight, Math.max(2.1, distance), fov);
  }
  public setPetiteProportions(isPetite: boolean): void { applyBodyProportions(this.humanoid.bones, isPetite); }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.overlayCanvas.width = width;
    this.overlayCanvas.height = height;
  }

  public captureSnapshot(resolution = 1024): string {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = resolution;
    offCanvas.height = resolution;
    const ctx = offCanvas.getContext('2d')!;

    if (this.currentMode === 'openpose') {
      const positions = getJointScreenPositions(this.humanoid.bones, this.camera, resolution, resolution);
      drawOpenPoseSkeleton(ctx, positions, resolution, resolution);
    } else {
      const offRenderer = new THREE.WebGLRenderer({ canvas: offCanvas, antialias: true, preserveDrawingBuffer: true });
      offRenderer.setSize(resolution, resolution, false);
      const oldAspect = this.camera.aspect;
      this.camera.aspect = 1.0;
      this.camera.updateProjectionMatrix();

      const helper = this.transformControls.getHelper();
      const prevHelperVis = helper.visible;
      const prevSkelVis = this.skeletonHelper.visible;
      helper.visible = false;
      this.skeletonHelper.visible = false;
      setJointDotsVisible(this.humanoid.group, false);

      offRenderer.render(this.scene, this.camera);

      helper.visible = prevHelperVis;
      this.skeletonHelper.visible = prevSkelVis;
      setJointDotsVisible(this.humanoid.group, this.showSkeletonState && this.currentMode === 'shading', this.selectedBoneName);
      this.camera.aspect = oldAspect;
      this.camera.updateProjectionMatrix();
      offRenderer.dispose();
    }
    return offCanvas.toDataURL('image/png');
  }

  private startLoop(): void {
    const tick = () => {
      this.orbitControls.update();
      this.humanoid.group.updateMatrixWorld(true);

      if (this.currentMode === 'depth') {
        const dist = this.camera.position.distanceTo(this.orbitControls.target);
        this.depthMaterial.uniforms.cameraNear.value = Math.max(0.1, dist - 0.65);
        this.depthMaterial.uniforms.cameraFar.value = dist + 0.65;
      }

      if (this.currentMode === 'openpose') {
        const ctx = this.overlayCanvas.getContext('2d');
        if (ctx) {
          const w = this.overlayCanvas.width;
          const h = this.overlayCanvas.height;
          const positions = getJointScreenPositions(this.humanoid.bones, this.camera, w, h);
          drawOpenPoseSkeleton(ctx, positions, w, h);
        }
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
    this.orbitControls.dispose();
    this.transformControls.dispose();
    this.renderer.dispose();
  }
}
