import * as THREE from 'three';
import { BoneJointInfo } from '@/types';
import { createMaterialByStyle } from '@/core/shaders/materials';

export interface HumanoidRigResult {
  group: THREE.Group;
  skeleton: THREE.Skeleton;
  bones: Map<string, THREE.Bone>;
  colliders: Map<string, THREE.Mesh>;
  skinnedMesh: THREE.SkinnedMesh;
}

export const JOINT_DEFINITIONS: BoneJointInfo[] = [
  { name: 'Hips', label: '골반 (중심)' },
  { name: 'Spine', label: '허리 (척추 하부)', parentName: 'Hips' },
  { name: 'Spine1', label: '가슴 (척추 상부)', parentName: 'Spine' },
  { name: 'Neck', label: '목', parentName: 'Spine1', openposeId: 1 },
  { name: 'Head', label: '머리', parentName: 'Neck', openposeId: 0 },
  { name: 'LeftShoulder', label: '좌측 쇄골/어깨', parentName: 'Spine1' },
  { name: 'LeftArm', label: '좌측 상완 (위팔)', parentName: 'LeftShoulder', openposeId: 5 },
  { name: 'LeftForeArm', label: '좌측 전완 (아래팔)', parentName: 'LeftArm', openposeId: 6 },
  { name: 'LeftHand', label: '좌측 손목/손', parentName: 'LeftForeArm', openposeId: 7 },
  { name: 'RightShoulder', label: '우측 쇄골/어깨', parentName: 'Spine1' },
  { name: 'RightArm', label: '우측 상완 (위팔)', parentName: 'RightShoulder', openposeId: 2 },
  { name: 'RightForeArm', label: '우측 전완 (아래팔)', parentName: 'RightArm', openposeId: 3 },
  { name: 'RightHand', label: '우측 손목/손', parentName: 'RightForeArm', openposeId: 4 },
  { name: 'LeftUpLeg', label: '좌측 허벅지 (고관절)', parentName: 'Hips', openposeId: 11 },
  { name: 'LeftLeg', label: '좌측 무릎/종아리', parentName: 'LeftUpLeg', openposeId: 12 },
  { name: 'LeftFoot', label: '좌측 발목/발', parentName: 'LeftLeg', openposeId: 13 },
  { name: 'RightUpLeg', label: '우측 허벅지 (고관절)', parentName: 'Hips', openposeId: 8 },
  { name: 'RightLeg', label: '우측 무릎/종아리', parentName: 'RightUpLeg', openposeId: 9 },
  { name: 'RightFoot', label: '우측 발목/발', parentName: 'RightLeg', openposeId: 10 },
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
    Spine: [0, 0.14, 0],
    Spine1: [0, 0.19, 0],
    Neck: [0, 0.21, 0],
    Head: [0, 0.10, 0],
    LeftShoulder: [0.07, 0.16, 0],
    LeftArm: [0.11, 0, 0],
    LeftForeArm: [0.25, 0, 0],
    LeftHand: [0.23, 0, 0],
    RightShoulder: [-0.07, 0.16, 0],
    RightArm: [-0.11, 0, 0],
    RightForeArm: [-0.25, 0, 0],
    RightHand: [-0.23, 0, 0],
    LeftUpLeg: [0.10, -0.04, 0],
    LeftLeg: [0, -0.43, 0],
    LeftFoot: [0, -0.42, 0],
    RightUpLeg: [-0.10, -0.04, 0],
    RightLeg: [0, -0.43, 0],
    RightFoot: [0, -0.42, 0],
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
  group.updateMatrixWorld(true);

  // 모든 본에 초기 바인드 포즈(Rest Pose) 저장
  boneList.forEach((bone) => {
    const worldRest = new THREE.Quaternion();
    bone.getWorldQuaternion(worldRest);
    bone.userData.localRestQuat = bone.quaternion.clone();
    bone.userData.worldRestQuat = worldRest;
    bone.userData.restPos = bone.position.clone();
  });

  const skeleton = new THREE.Skeleton(boneList);
  const bodyMaterial = createMaterialByStyle('matte_white');
  const jointBallMaterial = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    roughness: 0.4,
    metalness: 0.2,
  });

  // 3. 각 Bone에 직접 입체 관절 마네킹 파츠 메쉬 부착 (계층형 아티큘레이티드 마네킹)
  const attachLimbPart = (
    boneName: string,
    geom: THREE.BufferGeometry,
    offset: [number, number, number],
    rotEuler?: [number, number, number],
    scaleVec?: [number, number, number]
  ) => {
    const bone = bonesMap.get(boneName);
    if (!bone) return;
    const mesh = new THREE.Mesh(geom, bodyMaterial);
    mesh.position.set(offset[0], offset[1], offset[2]);
    if (rotEuler) {
      mesh.rotation.set(rotEuler[0], rotEuler[1], rotEuler[2]);
    }
    if (scaleVec) {
      mesh.scale.set(scaleVec[0], scaleVec[1], scaleVec[2]);
    }
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    bone.add(mesh);
  };

  const attachJointBall = (boneName: string, radius: number) => {
    const bone = bonesMap.get(boneName);
    if (!bone) return;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 20), jointBallMaterial);
    ball.castShadow = true;
    ball.receiveShadow = true;
    bone.add(ball);
  };

  // 골반, 허리, 흉곽, 목, 머리
  attachLimbPart('Hips', new THREE.CylinderGeometry(0.11, 0.13, 0.15, 24), [0, 0.02, 0], undefined, [1.15, 1, 0.78]);
  attachJointBall('Spine', 0.085);
  attachLimbPart('Spine', new THREE.CylinderGeometry(0.115, 0.10, 0.16, 24), [0, 0.09, 0], undefined, [1.1, 1, 0.75]);
  attachLimbPart('Spine1', new THREE.CylinderGeometry(0.145, 0.115, 0.22, 24), [0, 0.10, 0.01], undefined, [1.15, 1, 0.8]);
  attachLimbPart('Neck', new THREE.CylinderGeometry(0.042, 0.048, 0.11, 20), [0, 0.05, 0]);
  attachLimbPart('Head', new THREE.SphereGeometry(0.105, 28, 28), [0, 0.10, 0.01], undefined, [0.88, 1.15, 0.96]);

  // 양쪽 어깨, 상완, 전완, 손
  attachJointBall('LeftArm', 0.052);
  attachLimbPart('LeftArm', new THREE.CylinderGeometry(0.044, 0.036, 0.23, 20), [0.125, 0, 0], [0, 0, -Math.PI / 2]);
  attachJointBall('LeftForeArm', 0.038);
  attachLimbPart('LeftForeArm', new THREE.CylinderGeometry(0.036, 0.028, 0.21, 20), [0.115, 0, 0], [0, 0, -Math.PI / 2]);
  attachJointBall('LeftHand', 0.028);
  attachLimbPart('LeftHand', new THREE.BoxGeometry(0.085, 0.028, 0.065), [0.05, 0, 0]);

  attachJointBall('RightArm', 0.052);
  attachLimbPart('RightArm', new THREE.CylinderGeometry(0.044, 0.036, 0.23, 20), [-0.125, 0, 0], [0, 0, Math.PI / 2]);
  attachJointBall('RightForeArm', 0.038);
  attachLimbPart('RightForeArm', new THREE.CylinderGeometry(0.036, 0.028, 0.21, 20), [-0.115, 0, 0], [0, 0, Math.PI / 2]);
  attachJointBall('RightHand', 0.028);
  attachLimbPart('RightHand', new THREE.BoxGeometry(0.085, 0.028, 0.065), [-0.05, 0, 0]);

  // 양쪽 고관절, 허벅지, 무릎, 종아리, 발
  attachJointBall('LeftUpLeg', 0.068);
  attachLimbPart('LeftUpLeg', new THREE.CylinderGeometry(0.068, 0.050, 0.40, 24), [0, -0.21, 0]);
  attachJointBall('LeftLeg', 0.050);
  attachLimbPart('LeftLeg', new THREE.CylinderGeometry(0.048, 0.034, 0.39, 24), [0, -0.21, 0]);
  attachJointBall('LeftFoot', 0.036);
  attachLimbPart('LeftFoot', new THREE.BoxGeometry(0.075, 0.05, 0.17), [0, -0.025, 0.045]);

  attachJointBall('RightUpLeg', 0.068);
  attachLimbPart('RightUpLeg', new THREE.CylinderGeometry(0.068, 0.050, 0.40, 24), [0, -0.21, 0]);
  attachJointBall('RightLeg', 0.050);
  attachLimbPart('RightLeg', new THREE.CylinderGeometry(0.048, 0.034, 0.39, 24), [0, -0.21, 0]);
  attachJointBall('RightFoot', 0.036);
  attachLimbPart('RightFoot', new THREE.BoxGeometry(0.075, 0.05, 0.17), [0, -0.025, 0.045]);

  // 4. 각 조인트에 피킹용 투명 콜라이더 및 시각적 관절 포인트 부착
  const colliderMaterial = new THREE.MeshBasicMaterial({
    visible: true,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
  });

  JOINT_DEFINITIONS.forEach((def) => {
    const bone = bonesMap.get(def.name);
    if (!bone) return;
    const radius = def.name === 'Head' ? 0.14 : def.name === 'Hips' ? 0.13 : 0.095;
    const collider = new THREE.Mesh(new THREE.SphereGeometry(radius, 12, 12), colliderMaterial);
    collider.renderOrder = 999;
    collider.name = `Collider_${def.name}`;
    collider.userData = { boneName: def.name, isCollider: true };

    const dotRadius = def.name === 'Hips' ? 0.024 : 0.018;
    const dotMesh = new THREE.Mesh(
      new THREE.SphereGeometry(dotRadius, 16, 16),
      new THREE.MeshBasicMaterial({
        color: def.name === 'Hips' ? 0x0066ff : 0x38bdf8,
        transparent: true,
        opacity: 0.85,
        depthTest: false,
      })
    );
    dotMesh.renderOrder = 1000;
    dotMesh.userData = { boneName: def.name, isJointDot: true };
    collider.add(dotMesh);

    bone.add(collider);
    collidersMap.set(def.name, collider);
  });

  const dummySkinnedMesh = new THREE.SkinnedMesh(new THREE.BufferGeometry(), bodyMaterial);
  dummySkinnedMesh.bind(skeleton);

  return { group, skeleton, bones: bonesMap, colliders: collidersMap, skinnedMesh: dummySkinnedMesh };
}

// 155cm 단신 아시안 여성 체형 스케일 적용 함수
export function applyBodyProportions(bones: Map<string, THREE.Bone>, isPetite155: boolean): void {
  const root = bones.get('Hips');
  if (!root) return;

  if (isPetite155) {
    root.scale.set(0.92, 0.88, 0.90);
  } else {
    root.scale.set(1.0, 1.0, 1.0);
  }
  root.updateMatrixWorld(true);
}
