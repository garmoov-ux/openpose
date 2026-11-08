import * as THREE from 'three';
import {
  NAIL_ITEMS,
  FOOTWEAR_ITEMS,
  NECK_ITEMS,
  WRIST_ITEMS,
  LEG_ITEMS,
} from '@/data/themesSolo/accessoriesAndPropsData';
import { getOrComputeTriData } from './outfitVisualizer';
import { attachAdultToyMeshToBones } from './adultToyMeshBuilder';

export type BodyAccessoryCategoryKey =
  | 'footwear'
  | 'nails'
  | 'neck'
  | 'wrist'
  | 'legs'
  | 'toy_special';

export interface BodyAccessoryConfig {
  nailColorId: string;
  footwearId: string;
  neckItemId: string;
  wristItemId: string;
  legItemId: string;
  toyItemId?: string;
  customColors?: Partial<Record<BodyAccessoryCategoryKey, number>>;
}

function clearBoneAccessories(group: THREE.Object3D): void {
  const toRemove: THREE.Object3D[] = [];
  group.traverse((obj) => {
    if (obj.userData?.isBodyAccessory) {
      toRemove.push(obj);
    }
  });
  toRemove.forEach((obj) => {
    obj.parent?.remove(obj);
    obj.traverse((child) => {
      const m = child as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      if (m.material) {
        if (Array.isArray(m.material)) m.material.forEach((mt) => mt.dispose());
        else m.material.dispose();
      }
    });
  });
}

function buildAccessorySkinnedShell(
  skinnedMesh: THREE.SkinnedMesh,
  matchFn: (ax: number, y: number, z: number) => boolean,
  material: THREE.Material,
  offsetFactor = 1.65
): THREE.SkinnedMesh | null {
  const { triCoords, thickness } = getOrComputeTriData(skinnedMesh);
  const geom = skinnedMesh.geometry;
  const posAttr = geom.attributes.position as THREE.BufferAttribute;
  const normAttr = geom.attributes.normal as THREE.BufferAttribute;
  const skinIdxAttr = geom.attributes.skinIndex as THREE.BufferAttribute;
  const skinWgtAttr = geom.attributes.skinWeight as THREE.BufferAttribute;

  const numTris = triCoords.length / 3;
  const matchedTris: number[] = [];

  for (let t = 0; t < numTris; t++) {
    if (matchFn(triCoords[t * 3], triCoords[t * 3 + 1], triCoords[t * 3 + 2])) {
      matchedTris.push(t);
    }
  }
  if (matchedTris.length === 0) return null;

  const vertCount = matchedTris.length * 3;
  const positions = new Float32Array(vertCount * 3);
  const normals = new Float32Array(vertCount * 3);
  const skinIndices = new Float32Array(vertCount * 4);
  const skinWeights = new Float32Array(vertCount * 4);
  const offset = thickness * offsetFactor;

  for (let m = 0; m < matchedTris.length; m++) {
    const t = matchedTris[m];
    for (let k = 0; k < 3; k++) {
      const srcIdx = t * 3 + k;
      const dstIdx = m * 3 + k;
      const nx = normAttr.getX(srcIdx), ny = normAttr.getY(srcIdx), nz = normAttr.getZ(srcIdx);

      positions[dstIdx * 3] = posAttr.getX(srcIdx) + nx * offset;
      positions[dstIdx * 3 + 1] = posAttr.getY(srcIdx) + ny * offset;
      positions[dstIdx * 3 + 2] = posAttr.getZ(srcIdx) + nz * offset;
      normals[dstIdx * 3] = nx;
      normals[dstIdx * 3 + 1] = ny;
      normals[dstIdx * 3 + 2] = nz;

      if (skinIdxAttr && skinWgtAttr) {
        skinIndices[dstIdx * 4] = skinIdxAttr.getX(srcIdx);
        skinIndices[dstIdx * 4 + 1] = skinIdxAttr.getY(srcIdx);
        skinIndices[dstIdx * 4 + 2] = skinIdxAttr.getZ(srcIdx);
        skinIndices[dstIdx * 4 + 3] = skinIdxAttr.getW(srcIdx);
        skinWeights[dstIdx * 4] = skinWgtAttr.getX(srcIdx);
        skinWeights[dstIdx * 4 + 1] = skinWgtAttr.getY(srcIdx);
        skinWeights[dstIdx * 4 + 2] = skinWgtAttr.getZ(srcIdx);
        skinWeights[dstIdx * 4 + 3] = skinWgtAttr.getW(srcIdx);
      }
    }
  }

  const outGeom = new THREE.BufferGeometry();
  outGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  outGeom.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  outGeom.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
  outGeom.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));

  const shell = new THREE.SkinnedMesh(outGeom, material);
  shell.position.copy(skinnedMesh.position);
  shell.quaternion.copy(skinnedMesh.quaternion);
  shell.scale.copy(skinnedMesh.scale);
  shell.castShadow = true;
  shell.receiveShadow = true;
  shell.frustumCulled = false;
  shell.bind(skinnedMesh.skeleton, skinnedMesh.bindMatrix);
  shell.userData = { isBodyAccessory: true, outfitMaterial: material };
  return shell;
}

function isNoneId(id: string | undefined): boolean {
  return !id || id === 'none' || id.endsWith('_none') || id === 'bare_feet' || id === 'foot_bare';
}

// 마네킹 SkinnedMesh 표면에 밀착되는 바디 아이템 및 3D 성인·스페셜 기구 생성
export function applyBodyAccessoriesToRig(
  group: THREE.Object3D,
  bones: Map<string, THREE.Bone>,
  config: BodyAccessoryConfig
): void {
  clearBoneAccessories(group);

  let targetSkinnedMesh: THREE.SkinnedMesh | null = null;
  group.traverse((child) => {
    if (
      !targetSkinnedMesh &&
      (child as THREE.SkinnedMesh).isSkinnedMesh &&
      !child.userData?.isOutfitMesh &&
      !child.userData?.isBodyAccessory &&
      (child as THREE.SkinnedMesh).geometry.attributes.position?.count > 100
    ) {
      targetSkinnedMesh = child as THREE.SkinnedMesh;
    }
  });

  const sm = targetSkinnedMesh as THREE.SkinnedMesh | null;
  const parent = sm?.parent || group;
  const colors = config.customColors || {};

  // 1. 목걸이 · 초커 · 바디체인 · 리쉬
  const neckOpt = NECK_ITEMS.find((i) => i.id === config.neckItemId);
  if (sm && neckOpt && !isNoneId(neckOpt.id)) {
    const isChain = neckOpt.id.includes('chain') || neckOpt.id.includes('leash');
    const neckMat = new THREE.MeshStandardMaterial({
      color: colors.neck ?? neckOpt.colorHex,
      roughness: 0.22,
      metalness: 0.78,
      side: THREE.DoubleSide,
    });
    const shell = buildAccessorySkinnedShell(
      sm,
      (ax, y, z) => {
        if (ax < 0.068 && y >= 0.824 && y <= 0.844) return true;
        if (isChain) {
          if (ax < 0.018 && y >= 0.59 && y <= 0.824 && z >= 0.44) return true;
          if (ax < 0.128 && y >= 0.585 && y <= 0.604) return true;
        }
        return false;
      },
      neckMat,
      1.75
    );
    if (shell) parent.add(shell);
  }

  // 2. 손목 브레이슬릿 · 수갑 커프스 · 글러브
  const wristOpt = WRIST_ITEMS.find((i) => i.id === config.wristItemId);
  if (sm && wristOpt && !isNoneId(wristOpt.id)) {
    const isGlove = wristOpt.id.includes('gloves');
    const wristMat = new THREE.MeshStandardMaterial({
      color: colors.wrist ?? wristOpt.colorHex,
      roughness: isGlove ? 0.18 : 0.24,
      metalness: isGlove ? 0.35 : 0.75,
      side: THREE.DoubleSide,
    });
    const shell = buildAccessorySkinnedShell(
      sm,
      (ax) => (isGlove ? ax >= 0.185 && ax <= 0.268 : ax >= 0.215 && ax <= 0.248),
      wristMat,
      1.75
    );
    if (shell) parent.add(shell);
  }

  // 3. 허벅지 가터링 · 종아리 스트랩 · 발목 구속 커프스
  const legOpt = LEG_ITEMS.find((i) => i.id === config.legItemId);
  if (sm && legOpt && !isNoneId(legOpt.id)) {
    const legMat = new THREE.MeshStandardMaterial({
      color: colors.legs ?? legOpt.colorHex,
      roughness: 0.3,
      metalness: 0.45,
      side: THREE.DoubleSide,
    });
    const shell = buildAccessorySkinnedShell(
      sm,
      (ax, y) => {
        if (ax >= 0.135) return false;
        if (legOpt.id.includes('anklet') || legOpt.id.includes('ankle')) return y >= 0.082 && y <= 0.105;
        if (legOpt.id.includes('calf') || legOpt.id.includes('crisscross')) {
          return (y >= 0.205 && y <= 0.225) || (y >= 0.255 && y <= 0.275);
        }
        if (legOpt.id.includes('dual') || legOpt.id.includes('harness')) {
          return (y >= 0.365 && y <= 0.388) || (y >= 0.415 && y <= 0.442);
        }
        return y >= 0.415 && y <= 0.442;
      },
      legMat,
      1.72
    );
    if (shell) parent.add(shell);
  }

  // 4. 신발 · 스틸레토 힐 · 스타킹 · 망사 · 롱부츠
  const footOpt = FOOTWEAR_ITEMS.find((i) => i.id === config.footwearId);
  if (sm && footOpt && !isNoneId(footOpt.id)) {
    const mainFootColor = colors.footwear ?? footOpt.colorHex;
    const isStocking = footOpt.id.includes('stocking') || footOpt.id.includes('garter') || footOpt.id.includes('fishnet');
    const isBoot = footOpt.id.includes('boots');
    const isSock = footOpt.id.includes('socks');

    if (isStocking) {
      const sheerMat = new THREE.MeshStandardMaterial({
        color: mainFootColor,
        roughness: 0.32,
        metalness: 0.15,
        transparent: true,
        opacity: footOpt.id.includes('fishnet') ? 0.58 : 0.72,
        side: THREE.DoubleSide,
      });
      const bandMat = new THREE.MeshStandardMaterial({
        color: colors.footwear ?? footOpt.secondaryHex ?? footOpt.colorHex,
        roughness: 0.25,
        metalness: 0.35,
        side: THREE.DoubleSide,
      });
      const sheerShell = buildAccessorySkinnedShell(sm, (ax, y) => ax < 0.135 && y <= 0.415, sheerMat, 1.5);
      const bandShell = buildAccessorySkinnedShell(
        sm,
        (ax, y) => ax < 0.135 && ((y > 0.415 && y <= 0.448) || y <= 0.052),
        bandMat,
        1.8
      );
      if (sheerShell) parent.add(sheerShell);
      if (bandShell) parent.add(bandShell);
    } else {
      const shoeMat = new THREE.MeshStandardMaterial({
        color: mainFootColor,
        roughness: isBoot ? 0.15 : 0.22,
        metalness: isBoot ? 0.48 : 0.55,
        side: THREE.DoubleSide,
      });
      const maxShoeY = isBoot ? 0.43 : isSock ? 0.125 : 0.058;
      const shoeShell = buildAccessorySkinnedShell(
        sm,
        (ax, y) => ax < 0.135 && (y <= maxShoeY || (!isBoot && !isSock && y >= 0.076 && y <= 0.092)),
        shoeMat,
        1.78
      );
      if (shoeShell) parent.add(shoeShell);
    }
  }

  // 5. 매니큐어 & 페디큐어
  const nailOpt = NAIL_ITEMS.find((i) => i.id === config.nailColorId);
  if (sm && nailOpt && !isNoneId(nailOpt.id)) {
    const nailMat = new THREE.MeshStandardMaterial({
      color: colors.nails ?? nailOpt.colorHex,
      roughness: 0.12,
      metalness: 0.4,
      side: THREE.DoubleSide,
    });
    const nailShell = buildAccessorySkinnedShell(
      sm,
      (ax, y, z) => ax >= 0.268 || (ax < 0.135 && y <= 0.022 && z >= 0.58),
      nailMat,
      1.85
    );
    if (nailShell) parent.add(nailShell);
  }

  // 6. 성인용 자위기구 · 남성용/여성용 스페셜 토이 · 페티시 바디 기구
  if (config.toyItemId && !isNoneId(config.toyItemId)) {
    attachAdultToyMeshToBones(
      group,
      bones,
      config.toyItemId,
      colors.toy_special,
      sm
        ? (matchFn, mat, offset = 1.8) => {
            const s = buildAccessorySkinnedShell(sm, matchFn, mat, offset);
            if (s) parent.add(s);
          }
        : undefined
    );
  }
}
