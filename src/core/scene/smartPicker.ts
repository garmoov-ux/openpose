import * as THREE from 'three';
import { HumanoidRigResult } from '@/core/mannequin/humanoidRig';

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
  const colliderHits = raycaster.intersectObjects(colliders, true);
  if (colliderHits.length > 0) {
    const hit = colliderHits[0].object as THREE.Mesh;
    if (hit.userData?.boneName) {
      return hit.userData.boneName;
    }
  }

  const meshHits = raycaster.intersectObjects(humanoidGroup.children, true);
  for (const hit of meshHits) {
    if (hit.object.userData?.boneName) {
      return hit.object.userData.boneName;
    }
    if ((hit.object as THREE.Mesh).isMesh) {
      const nearest = findNearestBone(hit.point, bones);
      if (nearest) return nearest;
    }
  }

  return null;
}

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

export type PickedSceneEntity =
  | { kind: 'bone'; actorId: 'main' | 'partner'; boneName: string }
  | { kind: 'prop'; propUid: string }
  | { kind: 'none' };

export function pickSceneEntityAtPointer(
  event: PointerEvent,
  canvas: HTMLCanvasElement,
  camera: THREE.Camera,
  raycaster: THREE.Raycaster,
  mouse: THREE.Vector2,
  mainRig: HumanoidRigResult,
  partnerRig: HumanoidRigResult,
  partnerVisible: boolean,
  themePropsGroup: THREE.Group
): PickedSceneEntity {
  const rect = canvas.getBoundingClientRect();
  mouse.set(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
  raycaster.setFromCamera(mouse, camera);

  const mainBone = pickBoneFromRaycast(
    raycaster,
    Array.from(mainRig.colliders.values()),
    mainRig.group,
    mainRig.bones
  );
  if (mainBone) {
    return { kind: 'bone', actorId: 'main', boneName: mainBone };
  }

  if (partnerVisible && partnerRig.group.visible) {
    const pBone = pickBoneFromRaycast(
      raycaster,
      Array.from(partnerRig.colliders.values()),
      partnerRig.group,
      partnerRig.bones
    );
    if (pBone) {
      return { kind: 'bone', actorId: 'partner', boneName: pBone };
    }
  }

  const propUid = pickRoomPropFromRaycast(raycaster, themePropsGroup);
  if (propUid) {
    return { kind: 'prop', propUid };
  }

  return { kind: 'none' };
}
