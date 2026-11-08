import * as THREE from 'three';
import { OutfitItem } from '@/types/themeSolo';
import { findOutfitById } from './mannequinProfiles';
import { classifyTriangleZone } from './outfitZoneClassifier';

interface ParsedStyle {
  primaryHex: number;
  secondaryHex: number;
  roughness: number;
  metalness: number;
  opacity: number;
}

const COLOR_MAP: Array<[RegExp, number]> = [
  [/crimson|ruby|scarlet|red|체리|루비|레드|와인|버건디|burgundy/i, 0xe11d48],
  [/emerald|jade|green|mint|에메랄드|그린|민트|제이드/i, 0x10b981],
  [/sapphire|cobalt|navy|blue|azure|sky|사파이어|블루|네이비|코발트|스카이/i, 0x2563eb],
  [/cyan|aqua|turquoise|teal|시안|아쿠아|터콰이즈|틸/i, 0x06b6d4],
  [/gold|amber|yellow|champagne|골드|샴페인|앰버|옐로우/i, 0xf59e0b],
  [/brown|camel|beige|브라운|베이지|카멜/i, 0xb45309],
  [/purple|violet|amethyst|lavender|lilac|퍼플|바이올렛|라벤더|보라/i, 0x9333ea],
  [/pink|rose|coral|blush|magenta|fuchsia|핑크|로즈|코랄|마젠타/i, 0xf43f5e],
  [/orange|peach|apricot|tangerine|오렌지|피치|살구/i, 0xf97316],
  [/silver|platinum|chrome|metallic|실버|플래티넘|크롬|메탈/i, 0xcbd5e1],
  [/pearl|ivory|white|cream|snow|화이트|아이보리|진주|크림/i, 0xf8fafc],
  [/obsidian|black|noir|onyx|charcoal|블랙|오닉스|누아르|검정|차콜/i, 0x1e293b],
];

function parseOutfitStyle(item: OutfitItem): ParsedStyle {
  const combined = `${item.nameKo} ${item.text}`;
  const matchedColors: number[] = [];

  for (const [regex, hex] of COLOR_MAP) {
    if (regex.test(combined)) matchedColors.push(hex);
  }

  const fallbackByCat: Record<string, [number, number]> = {
    lingerie: [0xe11d48, 0xfda4af],
    micro_bikini: [0x0284c7, 0x38bdf8],
    body_jewelry: [0xf59e0b, 0xfef08a],
    crop_hotpants: [0x2563eb, 0x1e293b],
    top_only: [0xf8fafc, 0x1e3a8a],
    topless_bottom: [0x1e293b, 0xf59e0b],
    costume_dress: [0x38bdf8, 0xf8fafc],
    color_contrast: [0x1e40af, 0x334155],
  };

  const fb = fallbackByCat[item.category] || [0x2563eb, 0x334155];
  const basePrimary = new THREE.Color(matchedColors[0] ?? fb[0]);
  basePrimary.offsetHSL(((item.id % 7) - 3) * 0.025, 0, 0);
  const baseSecondary = new THREE.Color(matchedColors[1] ?? fb[1]);

  let roughness = 0.42;
  let metalness = 0.14;
  let opacity = 0.98;

  if (item.category === 'body_jewelry' || /chain|gold|silver|crystal|armor|tactical|체인|아머/i.test(combined)) {
    roughness = 0.2;
    metalness = 0.78;
    opacity = 1.0;
  } else if (/silk|satin|glossy|latex|leather|실크|새틴|레더/i.test(combined)) {
    roughness = 0.24;
    metalness = 0.28;
  } else if (/sheer|lace|mesh|chiffon|시스루|레이스|쉬폰/i.test(combined)) {
    opacity = 0.84;
    roughness = 0.35;
  }

  return {
    primaryHex: basePrimary.getHex(),
    secondaryHex: baseSecondary.getHex(),
    roughness,
    metalness,
    opacity,
  };
}

export function clearOutfitMeshes(root: THREE.Object3D): void {
  const toRemove: THREE.Object3D[] = [];
  root.traverse((child) => {
    if (child.userData?.isOutfitMesh && !child.userData?.isWardrobeMesh) toRemove.push(child);
  });
  toRemove.forEach((mesh) => {
    mesh.parent?.remove(mesh);
    const m = mesh as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    if (m.material) {
      if (Array.isArray(m.material)) m.material.forEach((mt) => mt.dispose());
      else m.material.dispose();
    }
  });
}

export interface CachedTriData {
  triCoords: Float32Array;
  thickness: number;
}

export function getOrComputeTriData(skinnedMesh: THREE.SkinnedMesh): CachedTriData {
  if (skinnedMesh.userData.cachedTriData) {
    return skinnedMesh.userData.cachedTriData as CachedTriData;
  }

  const geom = skinnedMesh.geometry;
  const posAttr = geom.attributes.position as THREE.BufferAttribute;
  const count = posAttr.count;
  const numTris = Math.floor(count / 3);

  const rawBox = new THREE.Box3().setFromBufferAttribute(posAttr);
  const rawSize = new THREE.Vector3();
  rawBox.getSize(rawSize);
  const thickness = Math.max(rawSize.x, rawSize.y, rawSize.z, 1.0) * 0.0024;

  const bindMat = skinnedMesh.bindMatrix;
  const v = new THREE.Vector3();
  let minY = Infinity, maxY = -Infinity, bodyMaxY = -Infinity, minZ = Infinity, maxZ = -Infinity;

  const skinIdxAttr = geom.attributes.skinIndex as THREE.BufferAttribute;
  const skinWgtAttr = geom.attributes.skinWeight as THREE.BufferAttribute;
  const armBoneIndices = new Set<number>();
  const headBoneIndices = new Set<number>();
  skinnedMesh.skeleton?.bones.forEach((b, idx) => {
    if (/Arm|ForeArm|Hand|Thumb|Index|Middle|Ring|Pinky/i.test(b.name)) {
      armBoneIndices.add(idx);
    }
    if (/Head|Neck|Eye|Jaw|Tongue|Hair/i.test(b.name)) {
      headBoneIndices.add(idx);
    }
  });

  for (let i = 0; i < count; i += 6) {
    v.fromBufferAttribute(posAttr, i).applyMatrix4(bindMat);
    if (v.y < minY) minY = v.y;
    if (v.y > maxY) maxY = v.y;
    if (v.z < minZ) minZ = v.z;
    if (v.z > maxZ) maxZ = v.z;

    let headW = 0;
    if (skinIdxAttr && skinWgtAttr && headBoneIndices.size > 0) {
      headW =
        (headBoneIndices.has(skinIdxAttr.getX(i)) ? skinWgtAttr.getX(i) : 0) +
        (headBoneIndices.has(skinIdxAttr.getY(i)) ? skinWgtAttr.getY(i) : 0) +
        (headBoneIndices.has(skinIdxAttr.getZ(i)) ? skinWgtAttr.getZ(i) : 0) +
        (headBoneIndices.has(skinIdxAttr.getW(i)) ? skinWgtAttr.getW(i) : 0);
    }
    if (headW < 0.15 && v.y > bodyMaxY) {
      bodyMaxY = v.y;
    }
  }

  const spanY = Math.max(0.001, maxY - minY);
  const bodySpanY = bodyMaxY > minY ? (bodyMaxY - minY) / 0.84 : spanY;
  const spanZ = Math.max(0.001, maxZ - minZ);
  const triCoords = new Float32Array(numTris * 3);
  const v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();

  for (let t = 0; t < numTris; t++) {
    const i0 = t * 3;
    v0.fromBufferAttribute(posAttr, i0).applyMatrix4(bindMat);
    v1.fromBufferAttribute(posAttr, i0 + 1).applyMatrix4(bindMat);
    v2.fromBufferAttribute(posAttr, i0 + 2).applyMatrix4(bindMat);

    const cx = (v0.x + v1.x + v2.x) / 3;
    const cy = (v0.y + v1.y + v2.y) / 3;
    const cz = (v0.z + v1.z + v2.z) / 3;

    let isArmTri = false;
    let isHeadTri = false;
    if (skinIdxAttr && skinWgtAttr) {
      if (armBoneIndices.size > 0) {
        const armW =
          (armBoneIndices.has(skinIdxAttr.getX(i0)) ? skinWgtAttr.getX(i0) : 0) +
          (armBoneIndices.has(skinIdxAttr.getY(i0)) ? skinWgtAttr.getY(i0) : 0) +
          (armBoneIndices.has(skinIdxAttr.getZ(i0)) ? skinWgtAttr.getZ(i0) : 0) +
          (armBoneIndices.has(skinIdxAttr.getW(i0)) ? skinWgtAttr.getW(i0) : 0);
        if (armW > 0.35) isArmTri = true;
      }
      if (headBoneIndices.size > 0) {
        const headW =
          (headBoneIndices.has(skinIdxAttr.getX(i0)) ? skinWgtAttr.getX(i0) : 0) +
          (headBoneIndices.has(skinIdxAttr.getY(i0)) ? skinWgtAttr.getY(i0) : 0) +
          (headBoneIndices.has(skinIdxAttr.getZ(i0)) ? skinWgtAttr.getZ(i0) : 0) +
          (headBoneIndices.has(skinIdxAttr.getW(i0)) ? skinWgtAttr.getW(i0) : 0);
        if (headW > 0.12) isHeadTri = true;
      }
    }

    const rawAx = Math.abs(cx) / bodySpanY;
    triCoords[t * 3] = isArmTri ? Math.max(0.165, rawAx) : Math.min(0.132, rawAx);
    triCoords[t * 3 + 1] = isHeadTri ? 0.99 : (cy - minY) / bodySpanY;
    triCoords[t * 3 + 2] = (cz - minZ) / spanZ;
  }

  const cached: CachedTriData = { triCoords, thickness };
  skinnedMesh.userData.cachedTriData = cached;
  return cached;
}

function buildSkinnedGarmentShell(
  skinnedMesh: THREE.SkinnedMesh,
  zoneTarget: 1 | 2,
  item: OutfitItem,
  material: THREE.Material
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
    if (classifyTriangleZone(item.category, item.id, triCoords[t * 3], triCoords[t * 3 + 1], triCoords[t * 3 + 2]) === zoneTarget) {
      matchedTris.push(t);
    }
  }

  if (matchedTris.length === 0) return null;

  const vertCount = matchedTris.length * 3;
  const positions = new Float32Array(vertCount * 3);
  const normals = new Float32Array(vertCount * 3);
  const skinIndices = new Float32Array(vertCount * 4);
  const skinWeights = new Float32Array(vertCount * 4);
  const offset = zoneTarget === 2 ? thickness * 1.35 : thickness;

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
  shell.userData = { isOutfitMesh: true, outfitMaterial: material };
  return shell;
}

export function applyOutfitToMannequin(
  root: THREE.Object3D,
  bones: Map<string, THREE.Bone>,
  outfitId: number | null
): void {
  clearOutfitMeshes(root);
  if (!outfitId || outfitId <= 0) return;

  const item = findOutfitById(outfitId);
  if (!item) return;

  const style = parseOutfitStyle(item);
  const primaryMat = new THREE.MeshStandardMaterial({
    color: style.primaryHex,
    roughness: style.roughness,
    metalness: style.metalness,
    transparent: style.opacity < 1.0,
    opacity: style.opacity,
    side: THREE.DoubleSide,
  });

  const secondaryMat = new THREE.MeshStandardMaterial({
    color: style.secondaryHex,
    roughness: Math.max(0.15, style.roughness - 0.08),
    metalness: Math.min(0.9, style.metalness + 0.1),
    side: THREE.DoubleSide,
  });

  let targetSkinnedMesh: THREE.SkinnedMesh | null = null;
  root.traverse((child) => {
    if (
      !targetSkinnedMesh &&
      (child as THREE.SkinnedMesh).isSkinnedMesh &&
      !child.userData?.isOutfitMesh &&
      (child as THREE.SkinnedMesh).geometry.attributes.position?.count > 100
    ) {
      targetSkinnedMesh = child as THREE.SkinnedMesh;
    }
  });

  if (targetSkinnedMesh) {
    const sm = targetSkinnedMesh as THREE.SkinnedMesh;
    const parent = sm.parent || root;
    const primaryShell = buildSkinnedGarmentShell(sm, 1, item, primaryMat);
    const secondaryShell = buildSkinnedGarmentShell(sm, 2, item, secondaryMat);
    if (primaryShell) parent.add(primaryShell);
    if (secondaryShell) parent.add(secondaryShell);
    return;
  }

  const spine1 = bones.get('Spine1');
  const hips = bones.get('Hips');
  if (spine1) {
    const topMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.22, 24), primaryMat);
    topMesh.position.set(0, 0.1, 0.01);
    topMesh.scale.set(1.16, 1, 0.82);
    topMesh.userData = { isOutfitMesh: true, outfitMaterial: primaryMat };
    spine1.add(topMesh);
  }
  if (hips) {
    const botMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.18, 24), secondaryMat);
    botMesh.position.set(0, 0.02, 0);
    botMesh.scale.set(1.16, 1, 0.8);
    botMesh.userData = { isOutfitMesh: true, outfitMaterial: secondaryMat };
    hips.add(botMesh);
  }
}
