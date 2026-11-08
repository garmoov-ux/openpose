import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { HumanoidRigResult, JOINT_DEFINITIONS } from './humanoidRig';
import { MANNEQUIN_MODELS } from './models';
import { MannequinModelId, MaterialStyle } from '@/types';
import { createMaterialByStyle } from '@/core/shaders/materials';

// 표준 본 이름 매핑 헬퍼 (mixamorig, mixamorig1 등 모든 접두사 제거)
export function normalizeBoneName(rawName: string): string {
  const clean = rawName
    .replace(/^mixamorig[0-9]*:?_?|^Character1:?_?|^Armature:?_?|FBXASC032/gi, '')
    .trim();

  if (/IKTarget|_end$|OP$/i.test(clean)) {
    return clean;
  }

  const mapping: Record<string, string> = {
    hips: 'Hips',
    hip: 'Hips',
    pelvis: 'Hips',
    spine: 'Spine',
    spine1: 'Spine1',
    spine2: 'Spine2',
    chest: 'Spine1',
    neck: 'Neck',
    head: 'Head',
    leftshoulder: 'LeftShoulder',
    leftarm: 'LeftArm',
    leftforearm: 'LeftForeArm',
    lefthand: 'LeftHand',
    rightshoulder: 'RightShoulder',
    rightarm: 'RightArm',
    rightforearm: 'RightForeArm',
    righthand: 'RightHand',
    leftupleg: 'LeftUpLeg',
    leftleg: 'LeftLeg',
    leftfoot: 'LeftFoot',
    rightupleg: 'RightUpLeg',
    rightleg: 'RightLeg',
    rightfoot: 'RightFoot',
  };
  return mapping[clean.toLowerCase()] || clean;
}

function createJointColliderAndDot(
  boneName: string,
  worldRadius: number,
  scaleFactor: number
): THREE.Mesh {
  const localRadius = worldRadius / (scaleFactor || 1);
  const geom = new THREE.SphereGeometry(localRadius, 12, 12);
  const mat = new THREE.MeshBasicMaterial({
    visible: true,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
  });
  const collider = new THREE.Mesh(geom, mat);
  collider.renderOrder = 999;
  collider.userData = { boneName, isCollider: true };

  const dotRadius = (boneName === 'Hips' ? 0.026 : 0.02) / (scaleFactor || 1);
  const dotGeom = new THREE.SphereGeometry(dotRadius, 16, 16);
  const dotMat = new THREE.MeshBasicMaterial({
    color: boneName === 'Hips' ? 0x0066ff : 0x38bdf8,
    transparent: true,
    opacity: 0.85,
    depthTest: false,
  });
  const dotMesh = new THREE.Mesh(dotGeom, dotMat);
  dotMesh.renderOrder = 1000;
  dotMesh.userData = { boneName, isJointDot: true };
  collider.add(dotMesh);

  return collider;
}

const fbxBufferCache = new Map<string, Promise<ArrayBuffer>>();

function fetchFbxBuffer(url: string, onProgress?: (percent: number) => void): Promise<ArrayBuffer> {
  const cached = fbxBufferCache.get(url);
  if (cached) {
    onProgress?.(100);
    return cached;
  }

  const promise = new Promise<ArrayBuffer>((resolve, reject) => {
    const loader = new THREE.FileLoader();
    loader.setResponseType('arraybuffer');
    loader.load(
      url,
      (data) => resolve(data as ArrayBuffer),
      (xhr) => {
        if (xhr.total > 0 && onProgress) {
          onProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (err) => {
        fbxBufferCache.delete(url);
        reject(err);
      }
    );
  });

  fbxBufferCache.set(url, promise);
  return promise;
}

const ANATOMICAL_BONE_NAMES = [
  'Hips',
  'Spine',
  'Spine1',
  'Neck',
  'Head',
  'LeftUpLeg',
  'LeftLeg',
  'LeftFoot',
  'RightUpLeg',
  'RightLeg',
  'RightFoot',
];

// 핵심 인체 관절(Head ~ Foot)의 실제 월드 좌표를 기반으로 발바닥부터 정수리까지의 월드 Y 범위 산출
export function measureHumanoidWorldYBounds(
  group: THREE.Object3D,
  bonesMap: Map<string, THREE.Bone>,
  modelId?: MannequinModelId
): { minY: number; maxY: number; spanY: number } {
  group.updateMatrixWorld(true);
  let minBoneY = Infinity;
  let maxBoneY = -Infinity;
  const v = new THREE.Vector3();

  for (const name of ANATOMICAL_BONE_NAMES) {
    const b = bonesMap.get(name);
    if (!b) continue;
    b.getWorldPosition(v);
    if (v.y < minBoneY) minBoneY = v.y;
    if (v.y > maxBoneY) maxBoneY = v.y;
  }

  if (!Number.isFinite(minBoneY) || !Number.isFinite(maxBoneY) || maxBoneY - minBoneY < 0.05) {
    return { minY: 0, maxY: 1.72, spanY: 1.72 };
  }

  const boneSpan = Math.max(0.2, maxBoneY - minBoneY);
  const headExtraRatio =
    modelId === 'chibi_male' || modelId === 'child_toddler'
      ? 0.46
      : modelId === 'child_elementary'
        ? 0.25
        : 0.16;

  const minY = Math.min(0, minBoneY - boneSpan * 0.06);
  const maxY = maxBoneY + boneSpan * headExtraRatio;
  return { minY, maxY, spanY: Math.max(0.5, maxY - minY) };
}

export async function loadFbxMannequin(
  modelId: MannequinModelId,
  style: MaterialStyle = 'matte_white',
  onProgress?: (percent: number) => void
): Promise<HumanoidRigResult> {
  const meta = MANNEQUIN_MODELS.find((m) => m.id === modelId);
  if (!meta || !meta.file) {
    throw new Error(`모델 파일을 찾을 수 없습니다: ${modelId}`);
  }

  const buffer = await fetchFbxBuffer(meta.file, onProgress);
  const loader = new FBXLoader();
  const fbxGroup = loader.parse(buffer, '/models/');

  fbxGroup.updateMatrixWorld(true);

  const bonesMap = new Map<string, THREE.Bone>();
  const collidersMap = new Map<string, THREE.Mesh>();
  const boneList: THREE.Bone[] = [];
  const foundMeshes: THREE.SkinnedMesh[] = [];

  const material = createMaterialByStyle(style);
  fbxGroup.traverse((child) => {
    if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
      const sm = child as THREE.SkinnedMesh;
      foundMeshes.push(sm);
      sm.material = material;
      sm.castShadow = true;
      sm.receiveShadow = true;
      sm.frustumCulled = false;
    } else if ((child as THREE.Mesh).isMesh) {
      const m = child as THREE.Mesh;
      m.material = material;
      m.castShadow = true;
      m.receiveShadow = true;
    }

    if ((child as THREE.Bone).isBone) {
      const bone = child as THREE.Bone;
      const normalized = normalizeBoneName(bone.name);

      const worldRest = new THREE.Quaternion();
      bone.getWorldQuaternion(worldRest);
      bone.userData.localRestQuat = bone.quaternion.clone();
      bone.userData.worldRestQuat = worldRest;
      bone.userData.restPos = bone.position.clone();

      if (!bonesMap.has(normalized)) {
        bone.name = normalized;
        bonesMap.set(normalized, bone);
      }
      boneList.push(bone);
    }
  });

  const box = new THREE.Box3().setFromObject(fbxGroup);
  const size = new THREE.Vector3();
  box.getSize(size);

  let scaleFactor = 1.0;
  if (size.y > 0) {
    const targetHeight = meta.targetHeight || (modelId === 'chibi_male' ? 1.2 : 1.75);
    scaleFactor = targetHeight / size.y;
    fbxGroup.scale.multiplyScalar(scaleFactor);
  }

  if (meta.boneScales) {
    Object.entries(meta.boneScales).forEach(([bName, sVec]) => {
      const targetBone = bonesMap.get(bName);
      if (targetBone) {
        targetBone.scale.set(sVec[0], sVec[1], sVec[2]);
      }
    });
  }

  fbxGroup.updateMatrixWorld(true);
  const updatedBox = new THREE.Box3().setFromObject(fbxGroup);
  fbxGroup.position.y -= updatedBox.min.y;
  fbxGroup.updateMatrixWorld(true);

  JOINT_DEFINITIONS.forEach((def) => {
    const bone = bonesMap.get(def.name);
    if (bone) {
      const worldRadius = def.name === 'Head' ? 0.14 : def.name === 'Hips' ? 0.13 : 0.095;
      const collider = createJointColliderAndDot(def.name, worldRadius, scaleFactor);
      bone.add(collider);
      collidersMap.set(def.name, collider);
    }
  });

  const skinnedMesh = foundMeshes[0] || null;
  const skeleton = skinnedMesh?.skeleton || new THREE.Skeleton(boneList);
  const finalMesh = skinnedMesh || new THREE.SkinnedMesh();

  return {
    group: fbxGroup,
    skeleton,
    bones: bonesMap,
    colliders: collidersMap,
    skinnedMesh: finalMesh,
  };
}
