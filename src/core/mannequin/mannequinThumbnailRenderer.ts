import * as THREE from 'three';
import { MannequinModelId, MaterialStyle } from '@/types';
import { createProceduralHumanoid } from './humanoidRig';
import { loadFbxMannequin, measureHumanoidWorldYBounds } from './modelLoader';
import { POSE_PRESETS, applyPosePreset } from './presets';
import { getMannequinProfile } from './mannequinProfiles';
import { applyOutfitToMannequin } from './outfitVisualizer';
import { setJointDotsVisible, applyMaterialToHierarchy } from '@/core/scene/modelSwapHelper';
import { createMaterialByStyle } from '@/core/shaders/materials';

const thumbnailCache = new Map<string, string>();
let renderQueue: Promise<void> = Promise.resolve();

let sharedRenderer: THREE.WebGLRenderer | null = null;
let sharedScene: THREE.Scene | null = null;
let sharedCamera: THREE.PerspectiveCamera | null = null;

function getSharedStudio(): {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
} {
  if (sharedRenderer && sharedScene && sharedCamera) {
    return { renderer: sharedRenderer, scene: sharedScene, camera: sharedCamera };
  }

  const canvas = document.createElement('canvas');
  canvas.width = 240;
  canvas.height = 240;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(240, 240, false);
  renderer.setPixelRatio(1);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x141418);

  const ambient = new THREE.AmbientLight(0xffffff, 0.95);
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.65);
  keyLight.position.set(2.2, 3.5, 2.8);
  const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.75);
  fillLight.position.set(-2.2, 1.8, 1.2);
  const rimLight = new THREE.DirectionalLight(0xfde68a, 0.65);
  rimLight.position.set(0, 2.8, -2.5);

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.62, 0.02, 32),
    new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4, metalness: 0.2 })
  );
  pedestal.position.set(0, -0.01, 0);

  scene.add(ambient, keyLight, fillLight, rimLight, pedestal);

  const camera = new THREE.PerspectiveCamera(36, 1.0, 0.1, 25);
  camera.position.set(0, 0.9, 3.2);
  camera.lookAt(0, 0.88, 0);

  sharedRenderer = renderer;
  sharedScene = scene;
  sharedCamera = camera;

  return { renderer, scene, camera };
}

export function getCachedMannequinThumbnail(
  modelId: MannequinModelId,
  style: MaterialStyle = 'matte_white'
): string | null {
  return thumbnailCache.get(`${modelId}_${style}`) || null;
}

export function renderMannequinThumbnail(
  modelId: MannequinModelId,
  style: MaterialStyle = 'matte_white'
): Promise<string> {
  const cacheKey = `${modelId}_${style}`;
  const cached = thumbnailCache.get(cacheKey);
  if (cached) {
    return Promise.resolve(cached);
  }

  return new Promise<string>((resolve, reject) => {
    renderQueue = renderQueue.then(async () => {
      const hit = thumbnailCache.get(cacheKey);
      if (hit) {
        resolve(hit);
        return;
      }

      try {
        const { renderer, scene, camera } = getSharedStudio();
        const rig =
          modelId === 'procedural'
            ? createProceduralHumanoid()
            : await loadFbxMannequin(modelId, style);

        const profile = getMannequinProfile(modelId);
        const defaultPreset =
          POSE_PRESETS.find((p) => p.id === profile.defaultStandardPoseId) || POSE_PRESETS[0];

        applyPosePreset(rig.bones, defaultPreset);
        applyOutfitToMannequin(rig.group, rig.bones, profile.defaultOutfitId);

        if (modelId === 'procedural') {
          applyMaterialToHierarchy(rig.group, createMaterialByStyle(style), true);
        }

        setJointDotsVisible(rig.group, false, null);

        rig.group.rotation.y = 0.22;
        scene.add(rig.group);
        rig.group.updateMatrixWorld(true);

        // 실제 골격 월드 Y 범위를 측정하여 머리부터 발끝까지 100% 전신 풀샷으로 카메라 자동 정렬
        const bounds = measureHumanoidWorldYBounds(rig.group, rig.bones, modelId);
        const minY = Math.min(-0.02, bounds.minY);
        const maxY = Math.max(0.85, bounds.maxY);
        const heightSpan = Math.max(0.85, maxY - minY);
        const centerY = minY + heightSpan * 0.5;

        const fovRad = THREE.MathUtils.degToRad(camera.fov);
        const fitDist = (heightSpan * 0.58) / Math.tan(fovRad / 2);

        camera.position.set(0, centerY + 0.04, Math.max(1.65, fitDist));
        camera.lookAt(0, centerY, 0);
        camera.updateProjectionMatrix();

        renderer.render(scene, camera);
        const dataUrl = renderer.domElement.toDataURL('image/webp', 0.9);

        scene.remove(rig.group);
        thumbnailCache.set(cacheKey, dataUrl);
        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    });
  });
}
