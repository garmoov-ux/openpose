import * as THREE from 'three';
import { MannequinModelId, MaterialStyle } from '@/types';
import { createProceduralHumanoid } from './humanoidRig';
import { loadFbxMannequin } from './modelLoader';
import { POSE_PRESETS, applyPosePreset } from './presets';
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
  canvas.height = 180;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(240, 180, false);
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

  const camera = new THREE.PerspectiveCamera(38, 240 / 180, 0.1, 20);
  camera.position.set(0, 0.94, 2.68);
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

        if (modelId === 'procedural') {
          applyMaterialToHierarchy(rig.group, createMaterialByStyle(style), false);
        }

        applyPosePreset(rig.bones, POSE_PRESETS[0]);
        setJointDotsVisible(rig.group, false, null);

        // 살짝 반측면(12도) 회전하여 체형 볼륨과 실루엣이 입체적으로 보이도록 배치
        rig.group.rotation.y = 0.22;
        scene.add(rig.group);
        rig.group.updateMatrixWorld(true);

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
