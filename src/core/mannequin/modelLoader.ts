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

  // IK 타겟이나 OpenPose 보조 본, 끝단 본은 표준 본 매핑에서 제외
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

// 본 주변 피킹용 투명 콜라이더 및 시각적 관절 포인트 생성
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

  // 시각적 관절 조절점 (Joint Control Dot)
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

// FBX 모델 로드 및 HumanoidRigResult 정규화
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

  // 월드 행렬 갱신 후 바인드 포즈(Rest Pose) 저장
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

      // 초기 바인드 회전 및 위치 백업
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

  const skinnedMesh = foundMeshes[0] || null;

  // 바운딩 박스를 계산하여 높이 정규화 (연령/체형별 목표 키 적용)
  const box = new THREE.Box3().setFromObject(fbxGroup);
  const size = new THREE.Vector3();
  box.getSize(size);

  let scaleFactor = 1.0;
  if (size.y > 0) {
    const targetHeight = meta.targetHeight || (modelId === 'chibi_male' ? 1.2 : 1.75);
    scaleFactor = targetHeight / size.y;
    fbxGroup.scale.multiplyScalar(scaleFactor);
  }

  // 연령/체형별 본 스케일 변형 (어린이 대두 비율, 노년 체형, 플러스 사이즈, 9등신 등)
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

  // 주요 19개 관절에 스케일 보정된 콜라이더 및 관절 조절점 부착
  JOINT_DEFINITIONS.forEach((def) => {
    const bone = bonesMap.get(def.name);
    if (bone) {
      const worldRadius = def.name === 'Head' ? 0.14 : def.name === 'Hips' ? 0.13 : 0.095;
      const collider = createJointColliderAndDot(def.name, worldRadius, scaleFactor);
      bone.add(collider);
      collidersMap.set(def.name, collider);
    }
  });

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
