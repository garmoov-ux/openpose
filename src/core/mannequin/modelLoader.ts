import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { HumanoidRigResult, JOINT_DEFINITIONS } from './humanoidRig';
import { MANNEQUIN_MODELS } from './models';
import { MannequinModelId, MaterialStyle } from '@/types';
import { createMaterialByStyle } from '@/core/shaders/materials';

// 표준 본 이름 매핑 헬퍼 (prefix 제거 및 대체명 처리)
function normalizeBoneName(rawName: string): string {
  const clean = rawName.replace(/^mixamorig[0-9]*:_?|^Character1:_?|^Armature:_?|FBXASC032/gi, '');
  const mapping: Record<string, string> = {
    hip: 'Hips',
    pelvis: 'Hips',
    spine: 'Spine',
    spine1: 'Spine1',
    chest: 'Spine1',
    spine2: 'Spine1',
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

// 본 주변 피킹용 투명 구체 콜라이더 생성
function createColliderSphere(radius = 0.08): THREE.Mesh {
  const geom = new THREE.SphereGeometry(radius, 8, 8);
  const mat = new THREE.MeshBasicMaterial({
    visible: false,
    wireframe: true,
  });
  return new THREE.Mesh(geom, mat);
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

  const loader = new FBXLoader();
  const fbxGroup = await new Promise<THREE.Group>((resolve, reject) => {
    loader.load(
      meta.file!,
      (group) => resolve(group),
      (xhr) => {
        if (xhr.total > 0 && onProgress) {
          onProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (err) => reject(err)
    );
  });

  const bonesMap = new Map<string, THREE.Bone>();
  const collidersMap = new Map<string, THREE.Mesh>();
  const boneList: THREE.Bone[] = [];
  const foundMeshes: THREE.SkinnedMesh[] = [];

  // 메시 및 본 탐색
  const material = createMaterialByStyle(style);
  fbxGroup.traverse((child) => {
    if ((child as THREE.SkinnedMesh).isSkinnedMesh) {
      const sm = child as THREE.SkinnedMesh;
      foundMeshes.push(sm);
      sm.material = material;
      sm.castShadow = true;
      sm.receiveShadow = true;
    }
    if ((child as THREE.Bone).isBone) {
      const bone = child as THREE.Bone;
      const normalized = normalizeBoneName(bone.name);
      bone.name = normalized;
      bonesMap.set(normalized, bone);
      boneList.push(bone);
    }
  });

  const skinnedMesh = foundMeshes[0] || null;

  // 바운딩 박스를 계산하여 높이 정규화 (표준 성인 키 약 1.75m)
  const box = new THREE.Box3().setFromObject(fbxGroup);
  const size = new THREE.Vector3();
  box.getSize(size);

  if (size.y > 0) {
    const targetHeight = modelId === 'chibi_male' ? 1.2 : 1.75;
    const scaleFactor = targetHeight / size.y;
    fbxGroup.scale.multiplyScalar(scaleFactor);
  }

  // 발바닥을 바닥(y=0)에 정렬
  const updatedBox = new THREE.Box3().setFromObject(fbxGroup);
  fbxGroup.position.y -= updatedBox.min.y;

  // 콜라이더 생성 및 바인딩
  JOINT_DEFINITIONS.forEach((def) => {
    const bone = bonesMap.get(def.name);
    if (bone) {
      const collider = createColliderSphere(def.name === 'Head' ? 0.12 : 0.08);
      collider.userData = { boneName: def.name };
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
