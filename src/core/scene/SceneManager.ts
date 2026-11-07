import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { RenderMode, GizmoMode, GizmoSpace, CameraPreset } from '@/types';
import { createProceduralHumanoid, HumanoidRigResult, applyBodyProportions } from '@/core/mannequin/humanoidRig';
import { CameraController } from './CameraController';
import {
  createDefaultShadingMaterial,
  createDepthShaderMaterial,
  createNormalShaderMaterial,
  createCannyMaterial,
} from '@/core/shaders/materials';
import {
  getJointScreenPositions,
  drawOpenPoseSkeleton,
} from '@/core/pipeline/openposePipeline';

export class SceneManager {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public orbitControls: OrbitControls;
  public transformControls: TransformControls;
  public cameraController: CameraController;
  public humanoid: HumanoidRigResult;
  public skeletonHelper: THREE.SkeletonHelper;
  public gridHelper: THREE.GridHelper;

  private canvas: HTMLCanvasElement;
  private animId: number | null = null;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();
  private onBoneSelectedCallback?: (boneName: string | null) => void;
  private currentMode: RenderMode = 'shading';

  private defaultMaterial = createDefaultShadingMaterial();
  private depthMaterial = createDepthShaderMaterial();
  private normalMaterial = createNormalShaderMaterial();
  private cannyMaterial = createCannyMaterial();

  constructor(canvas: HTMLCanvasElement, onBoneSelect?: (name: string | null) => void) {
    this.canvas = canvas;
    this.onBoneSelectedCallback = onBoneSelect;

    // 1. 씬 및 카메라
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x18181b);

    const width = canvas.clientWidth || 800;
    const height = canvas.clientHeight || 600;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    this.camera.position.set(0, 1.2, 3.2);

    // 2. 렌더러
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.shadowMap.enabled = true;

    // 3. 조명
    this.setupLighting();

    // 4. 바닥 그리드
    this.gridHelper = new THREE.GridHelper(10, 20, 0x3f3f46, 0x27272a);
    this.gridHelper.position.y = 0;
    this.scene.add(this.gridHelper);

    // 5. 마네킹 로드
    this.humanoid = createProceduralHumanoid();
    this.scene.add(this.humanoid.group);

    // 스켈레톤 도우미
    this.skeletonHelper = new THREE.SkeletonHelper(this.humanoid.group);
    (this.skeletonHelper.material as THREE.LineBasicMaterial).linewidth = 2;
    this.scene.add(this.skeletonHelper);

    // 6. 컨트롤러
    this.orbitControls = new OrbitControls(this.camera, canvas);
    this.orbitControls.enableDamping = true;
    this.orbitControls.target.set(0, 0.95, 0);

    this.cameraController = new CameraController(this.camera, this.orbitControls);

    this.transformControls = new TransformControls(this.camera, canvas);
    this.transformControls.size = 0.75;
    this.transformControls.setSpace('local');
    this.scene.add(this.transformControls.getHelper());

    this.transformControls.addEventListener('dragging-changed', (e) => {
      this.orbitControls.enabled = !e.value;
    });

    this.bindEvents();
    this.startLoop();
  }

  private setupLighting(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(2.5, 4.0, 3.0);
    keyLight.castShadow = true;

    const fillLight = new THREE.DirectionalLight(0x90caf9, 0.6);
    fillLight.position.set(-2.5, 2.0, -1.0);

    const rimLight = new THREE.DirectionalLight(0xffcc80, 0.5);
    rimLight.position.set(0, 3.0, -3.0);

    this.scene.add(ambient, keyLight, fillLight, rimLight);
  }

  private bindEvents(): void {
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
  }

  private onPointerDown = (event: PointerEvent): void => {
    // 기즈모 조작 중이면 무시
    if (this.transformControls.dragging) return;

    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const colliders = Array.from(this.humanoid.colliders.values());
    const intersects = this.raycaster.intersectObjects(colliders, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object as THREE.Mesh;
      const boneName = hit.userData.boneName as string;
      this.selectBone(boneName);
    }
  };

  public selectBone(boneName: string | null): void {
    if (!boneName) {
      this.transformControls.detach();
      this.onBoneSelectedCallback?.(null);
      return;
    }

    const bone = this.humanoid.bones.get(boneName);
    if (bone) {
      this.transformControls.attach(bone);
      this.onBoneSelectedCallback?.(boneName);
    }
  }

  public setRenderMode(mode: RenderMode): void {
    this.currentMode = mode;
    const mesh = this.humanoid.skinnedMesh;

    switch (mode) {
      case 'depth':
        this.scene.background = new THREE.Color(0x000000);
        this.gridHelper.visible = false;
        this.skeletonHelper.visible = false;
        mesh.material = this.depthMaterial;
        break;
      case 'normal':
        this.scene.background = new THREE.Color(0x8080ff);
        this.gridHelper.visible = false;
        this.skeletonHelper.visible = false;
        mesh.material = this.normalMaterial;
        break;
      case 'canny':
        this.scene.background = new THREE.Color(0x000000);
        this.gridHelper.visible = false;
        this.skeletonHelper.visible = false;
        mesh.material = this.cannyMaterial;
        break;
      case 'openpose':
        this.scene.background = new THREE.Color(0x000000);
        this.gridHelper.visible = false;
        this.skeletonHelper.visible = false;
        mesh.visible = false;
        break;
      case 'shading':
      default:
        this.scene.background = new THREE.Color(0x18181b);
        this.gridHelper.visible = true;
        this.skeletonHelper.visible = true;
        mesh.visible = true;
        mesh.material = this.defaultMaterial;
        break;
    }
  }

  public setGizmoMode(mode: GizmoMode): void {
    this.transformControls.setMode(mode);
  }

  public setGizmoSpace(space: GizmoSpace): void {
    this.transformControls.setSpace(space);
  }

  public setCameraPreset(preset: CameraPreset): void {
    this.cameraController.setStandardPreset(preset);
  }

  public setSoloThemeShot(targetHeight: number, distance: number, fov = 28): void {
    this.cameraController.setSoloThemeShot(targetHeight, distance, fov);
  }

  public setPetiteProportions(isPetite: boolean): void {
    applyBodyProportions(this.humanoid.bones, isPetite);
  }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
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
      const offRenderer = new THREE.WebGLRenderer({
        canvas: offCanvas,
        antialias: true,
        preserveDrawingBuffer: true,
      });
      offRenderer.setSize(resolution, resolution, false);

      const oldAspect = this.camera.aspect;
      this.camera.aspect = 1.0;
      this.camera.updateProjectionMatrix();

      // 기즈모 일시 숨김
      const helper = this.transformControls.getHelper();
      helper.visible = false;

      offRenderer.render(this.scene, this.camera);

      helper.visible = true;
      this.camera.aspect = oldAspect;
      this.camera.updateProjectionMatrix();
      offRenderer.dispose();
    }

    return offCanvas.toDataURL('image/png');
  }

  private startLoop(): void {
    const tick = () => {
      this.orbitControls.update();

      if (this.currentMode === 'openpose') {
        // OpenPose 모드에서는 2D 오버레이 렌더링
        this.renderer.clear();
        const ctx = this.canvas.getContext('2d');
        if (ctx) {
          const w = this.canvas.width;
          const h = this.canvas.height;
          const positions = getJointScreenPositions(this.humanoid.bones, this.camera, w, h);
          drawOpenPoseSkeleton(ctx, positions, w, h);
        }
      } else {
        this.renderer.render(this.scene, this.camera);
      }

      this.animId = requestAnimationFrame(tick);
    };
    tick();
  }

  public dispose(): void {
    if (this.animId !== null) cancelAnimationFrame(this.animId);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.orbitControls.dispose();
    this.transformControls.dispose();
    this.renderer.dispose();
    this.defaultMaterial.dispose();
    this.depthMaterial.dispose();
    this.normalMaterial.dispose();
    this.cannyMaterial.dispose();
  }
}
