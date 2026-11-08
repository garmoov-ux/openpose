import * as THREE from 'three';
import { BoneJointInfo } from '@/types';

export interface HumanoidRigResult {
  group: THREE.Group;
  skeleton: THREE.Skeleton;
  bones: Map<string, THREE.Bone>;
  colliders: Map<string, THREE.Mesh>;
  skinnedMesh: THREE.SkinnedMesh;
}

export const JOINT_DEFINITIONS: BoneJointInfo[] = [
  { name: 'Hips', label: '골반(루트)' },
  { name: 'Spine', label: '척추 하부', parentName: 'Hips' },
  { name: 'Spine1', label: '척추 상부', parentName: 'Spine' },
  { name: 'Neck', label: '목', parentName: 'Spine1', openposeId: 1 },
  { name: 'Head', label: '머리', parentName: 'Neck', openposeId: 0 },
  { name: 'LeftShoulder', label: '좌측 어깨', parentName: 'Spine1' },
  { name: 'LeftArm', label: '좌측 팔 상완', parentName: 'LeftShoulder', openposeId: 5 },
  { name: 'LeftForeArm', label: '좌측 팔 전완', parentName: 'LeftArm', openposeId: 6 },
  { name: 'LeftHand', label: '좌측 손', parentName: 'LeftForeArm', openposeId: 7 },
  { name: 'RightShoulder', label: '우측 어깨', parentName: 'Spine1' },
  { name: 'RightArm', label: '우측 팔 상완', parentName: 'RightShoulder', openposeId: 2 },
  { name: 'RightForeArm', label: '우측 팔 전완', parentName: 'RightArm', openposeId: 3 },
  { name: 'RightHand', label: '우측 손', parentName: 'RightForeArm', openposeId: 4 },
  { name: 'LeftUpLeg', label: '좌측 대퇴부', parentName: 'Hips', openposeId: 11 },
  { name: 'LeftLeg', label: '좌측 하퇴부', parentName: 'LeftUpLeg', openposeId: 12 },
  { name: 'LeftFoot', label: '좌측 발', parentName: 'LeftLeg', openposeId: 13 },
  { name: 'RightUpLeg', label: '우측 대퇴부', parentName: 'Hips', openposeId: 8 },
  { name: 'RightLeg', label: '우측 하퇴부', parentName: 'RightUpLeg', openposeId: 9 },
  { name: 'RightFoot', label: '우측 발', parentName: 'RightLeg', openposeId: 10 },
];

export function createProceduralHumanoid(): HumanoidRigResult {
  const group = new THREE.Group();
  group.name = 'HumanoidModel';

  const bonesMap = new Map<string, THREE.Bone>();
  const collidersMap = new Map<string, THREE.Mesh>();
  const boneList: THREE.Bone[] = [];

  // 1. 본 생성
  JOINT_DEFINITIONS.forEach((def) => {
    const bone = new THREE.Bone();
    bone.name = def.name;
    bonesMap.set(def.name, bone);
    boneList.push(bone);
  });

  // 2. 본 계층 구조 및 상대 위치 설정
  const positions: Record<string, [number, number, number]> = {
    Hips: [0, 0.95, 0],
    Spine: [0, 0.15, 0],
    Spine1: [0, 0.20, 0],
    Neck: [0, 0.20, 0],
    Head: [0, 0.15, 0],
    LeftShoulder: [0.12, 0.15, 0],
    LeftArm: [0.10, 0, 0],
    LeftForeArm: [0.24, 0, 0],
    LeftHand: [0.22, 0, 0],
    RightShoulder: [-0.12, 0.15, 0],
    RightArm: [-0.10, 0, 0],
    RightForeArm: [-0.24, 0, 0],
    RightHand: [-0.22, 0, 0],
    LeftUpLeg: [0.10, -0.05, 0],
    LeftLeg: [0, -0.42, 0],
    LeftFoot: [0, -0.40, 0.05],
    RightUpLeg: [-0.10, -0.05, 0],
    RightLeg: [0, -0.42, 0],
    RightFoot: [0, -0.40, 0.05],
  };

  JOINT_DEFINITIONS.forEach((def) => {
    const bone = bonesMap.get(def.name)!;
    const pos = positions[def.name] || [0, 0, 0];
    bone.position.set(pos[0], pos[1], pos[2]);

    if (def.parentName) {
      const parent = bonesMap.get(def.parentName);
      if (parent) parent.add(bone);
    }
  });

  const rootBone = bonesMap.get('Hips')!;
  group.add(rootBone);

  const skeleton = new THREE.Skeleton(boneList);

  // 3. 인체 형상 메시 파츠 생성 (부위별 기하체 결합)
  const partGeometries: THREE.BufferGeometry[] = [];

  const addPart = (geom: THREE.BufferGeometry, boneName: string, offset: THREE.Vector3, rot?: THREE.Euler) => {
    const boneIdx = boneList.findIndex((b) => b.name === boneName);
    geom = geom.clone();
    if (rot) {
      const q = new THREE.Quaternion().setFromEuler(rot);
      geom.applyQuaternion(q);
    }
    geom.translate(offset.x, offset.y, offset.z);

    const count = geom.attributes.position.count;
    const skinIndices = new Float32Array(count * 4);
    const skinWeights = new Float32Array(count * 4);

    for (let i = 0; i < count; i++) {
      skinIndices[i * 4] = boneIdx;
      skinWeights[i * 4] = 1.0;
    }

    geom.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
    geom.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));
    partGeometries.push(geom);
  };

  // 몸통, 머리, 팔다리 메시
  addPart(new THREE.BoxGeometry(0.24, 0.16, 0.16), 'Hips', new THREE.Vector3(0, 0.04, 0));
  addPart(new THREE.BoxGeometry(0.22, 0.18, 0.15), 'Spine', new THREE.Vector3(0, 0.09, 0));
  addPart(new THREE.BoxGeometry(0.26, 0.20, 0.17), 'Spine1', new THREE.Vector3(0, 0.10, 0));
  addPart(new THREE.CylinderGeometry(0.05, 0.06, 0.15), 'Neck', new THREE.Vector3(0, 0.07, 0));
  addPart(new THREE.SphereGeometry(0.11, 24, 24), 'Head', new THREE.Vector3(0, 0.10, 0.02));

  // 팔
  addPart(new THREE.CylinderGeometry(0.04, 0.035, 0.24), 'LeftArm', new THREE.Vector3(0.12, 0, 0), new THREE.Euler(0, 0, -Math.PI / 2));
  addPart(new THREE.CylinderGeometry(0.035, 0.03, 0.22), 'LeftForeArm', new THREE.Vector3(0.11, 0, 0), new THREE.Euler(0, 0, -Math.PI / 2));
  addPart(new THREE.BoxGeometry(0.08, 0.03, 0.08), 'LeftHand', new THREE.Vector3(0.05, 0, 0));

  addPart(new THREE.CylinderGeometry(0.04, 0.035, 0.24), 'RightArm', new THREE.Vector3(-0.12, 0, 0), new THREE.Euler(0, 0, Math.PI / 2));
  addPart(new THREE.CylinderGeometry(0.035, 0.03, 0.22), 'RightForeArm', new THREE.Vector3(-0.11, 0, 0), new THREE.Euler(0, 0, Math.PI / 2));
  addPart(new THREE.BoxGeometry(0.08, 0.03, 0.08), 'RightHand', new THREE.Vector3(-0.05, 0, 0));

  // 다리
  addPart(new THREE.CylinderGeometry(0.06, 0.045, 0.42), 'LeftUpLeg', new THREE.Vector3(0, -0.21, 0));
  addPart(new THREE.CylinderGeometry(0.045, 0.035, 0.40), 'LeftLeg', new THREE.Vector3(0, -0.20, 0));
  addPart(new THREE.BoxGeometry(0.07, 0.06, 0.16), 'LeftFoot', new THREE.Vector3(0, -0.03, 0.04));

  addPart(new THREE.CylinderGeometry(0.06, 0.045, 0.42), 'RightUpLeg', new THREE.Vector3(0, -0.21, 0));
  addPart(new THREE.CylinderGeometry(0.045, 0.035, 0.40), 'RightLeg', new THREE.Vector3(0, -0.20, 0));
  addPart(new THREE.BoxGeometry(0.07, 0.06, 0.16), 'RightFoot', new THREE.Vector3(0, -0.03, 0.04));

  // 4. 버퍼 병합
  const mergedGeometry = mergeGeometriesManually(partGeometries);

  const defaultMaterial = new THREE.MeshStandardMaterial({
    color: 0x90a4ae,
    roughness: 0.35,
    metalness: 0.15,
  });

  const skinnedMesh = new THREE.SkinnedMesh(mergedGeometry, defaultMaterial);
  skinnedMesh.add(rootBone);
  skinnedMesh.bind(skeleton);
  skinnedMesh.castShadow = true;
  skinnedMesh.receiveShadow = true;
  group.add(skinnedMesh);

  // 5. 각 조인트에 피킹용 콜라이더 구체 부착 (투명 렌더링으로 레이캐스터 100% 감지)
  const colliderMaterial = new THREE.MeshBasicMaterial({
    visible: true,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
  });
  const sphereGeom = new THREE.SphereGeometry(0.12, 12, 12);

  JOINT_DEFINITIONS.forEach((def) => {
    const bone = bonesMap.get(def.name);
    if (!bone) return;
    const collider = new THREE.Mesh(sphereGeom, colliderMaterial);
    collider.renderOrder = 999;
    collider.name = `Collider_${def.name}`;
    collider.userData = { boneName: def.name };
    bone.add(collider);
    collidersMap.set(def.name, collider);
  });

  return { group, skeleton, bones: bonesMap, colliders: collidersMap, skinnedMesh };
}

// 155cm 단신 아시안 여성 체형 스케일 적용 함수 (85mm 망원 렌즈 및 themes_solo 규격)
export function applyBodyProportions(bones: Map<string, THREE.Bone>, isPetite155: boolean): void {
  const root = bones.get('Hips');
  if (!root) return;

  if (isPetite155) {
    // 155cm 슬림 체형: 전체 신장 약 0.88x, 골반 및 사지 비율 섬세화
    root.scale.set(0.92, 0.88, 0.90);
    const leftArm = bones.get('LeftArm');
    const rightArm = bones.get('RightArm');
    if (leftArm) leftArm.scale.set(0.90, 0.90, 0.90);
    if (rightArm) rightArm.scale.set(0.90, 0.90, 0.90);
  } else {
    // 표준 체형 (1.0x)
    root.scale.set(1.0, 1.0, 1.0);
    const leftArm = bones.get('LeftArm');
    const rightArm = bones.get('RightArm');
    if (leftArm) leftArm.scale.set(1.0, 1.0, 1.0);
    if (rightArm) rightArm.scale.set(1.0, 1.0, 1.0);
  }
  root.updateMatrixWorld(true);
}

function mergeGeometriesManually(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const merged = new THREE.BufferGeometry();
  let totalPos = 0;

  geometries.forEach((g) => {
    totalPos += g.attributes.position.count;
  });

  const posArray = new Float32Array(totalPos * 3);
  const normArray = new Float32Array(totalPos * 3);
  const skinIdxArray = new Float32Array(totalPos * 4);
  const skinWeightArray = new Float32Array(totalPos * 4);

  let offset = 0;
  geometries.forEach((g) => {
    const count = g.attributes.position.count;
    const pos = g.attributes.position.array;
    const norm = g.attributes.normal?.array;
    const sIdx = g.attributes.skinIndex.array;
    const sWt = g.attributes.skinWeight.array;

    for (let i = 0; i < count * 3; i++) {
      posArray[offset * 3 + i] = pos[i];
      if (norm) normArray[offset * 3 + i] = norm[i];
    }
    for (let i = 0; i < count * 4; i++) {
      skinIdxArray[offset * 4 + i] = sIdx[i];
      skinWeightArray[offset * 4 + i] = sWt[i];
    }
    offset += count;
  });

  merged.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(normArray, 3));
  merged.setAttribute('skinIndex', new THREE.BufferAttribute(skinIdxArray, 4));
  merged.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeightArray, 4));
  merged.computeVertexNormals();

  return merged;
}
