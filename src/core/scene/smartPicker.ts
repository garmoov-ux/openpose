import * as THREE from 'three';

const BONE_WORLD_POS = new THREE.Vector3();

// 충돌 지점에서 가장 가까운 주요 본 탐색 (스마트 피킹)
export function findNearestBone(
  hitPoint: THREE.Vector3,
  bones: Map<string, THREE.Bone>
): string | null {
  let nearestBoneName: string | null = null;
  let minDistance = Infinity;

  bones.forEach((bone, name) => {
    bone.getWorldPosition(BONE_WORLD_POS);
    const dist = BONE_WORLD_POS.distanceTo(hitPoint);
    if (dist < minDistance) {
      minDistance = dist;
      nearestBoneName = name;
    }
  });

  return nearestBoneName;
}

// 레이캐스터를 통해 최적의 본 탐색 (1순위: 콜라이더 직격, 2순위: 인체 메쉬 기반 근접 본)
export function pickBoneFromRaycast(
  raycaster: THREE.Raycaster,
  colliders: THREE.Mesh[],
  humanoidGroup: THREE.Group,
  bones: Map<string, THREE.Bone>
): string | null {
  // 1. 콜라이더 직격 검사
  const colliderHits = raycaster.intersectObjects(colliders, true);
  if (colliderHits.length > 0) {
    const hit = colliderHits[0].object as THREE.Mesh;
    if (hit.userData?.boneName) {
      return hit.userData.boneName;
    }
  }

  // 2. 인체 메쉬 클릭 시 스마트 최접 본 탐색
  const meshHits = raycaster.intersectObjects(humanoidGroup.children, true);
  for (const hit of meshHits) {
    if (hit.object.userData?.boneName) {
      return hit.object.userData.boneName;
    }
    // 스킨드 메시나 일반 메쉬 표면 클릭 시 가장 가까운 본 도출
    if ((hit.object as THREE.Mesh).isMesh) {
      const nearest = findNearestBone(hit.point, bones);
      if (nearest) return nearest;
    }
  }

  return null;
}

// 룸 가구 및 소품(RoomPropInstance) 레이캐스트 피킹 (사각 룸 벽체/바닥 셸은 제외)
export function pickRoomPropFromRaycast(
  raycaster: THREE.Raycaster,
  themePropsGroup: THREE.Group
): string | null {
  if (!themePropsGroup.visible) return null;
  const hits = raycaster.intersectObjects(themePropsGroup.children, true);
  for (const hit of hits) {
    const uid = hit.object.userData?.propUid as string | undefined;
    if (uid && hit.object.userData?.isSceneProp) {
      return uid;
    }
  }
  return null;
}

export function findPropGroupByUid(
  themePropsGroup: THREE.Group,
  propUid: string
): THREE.Group | null {
  for (const child of themePropsGroup.children) {
    if (child.userData?.propUid === propUid && child.userData?.isSceneProp) {
      return child as THREE.Group;
    }
  }
  return null;
}

