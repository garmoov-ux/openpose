import * as THREE from 'three';
import { OUTFITS_DATA } from '@/data/themesSolo/outfitsData';
import { OutfitItem } from '@/types/themeSolo';

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
  [/sapphire|cobalt|navy|blue|azure|사파이어|블루|네이비|코발트/i, 0x2563eb],
  [/cyan|aqua|turquoise|teal|시안|아쿠아|터콰이즈|틸/i, 0x06b6d4],
  [/gold|amber|yellow|champagne|골드|샴페인|앰버|옐로우/i, 0xf59e0b],
  [/purple|violet|amethyst|lavender|lilac|퍼플|바이올렛|라벤더|보라/i, 0x9333ea],
  [/pink|rose|coral|blush|magenta|fuchsia|핑크|로즈|코랄|마젠타/i, 0xf43f5e],
  [/orange|peach|apricot|tangerine|오렌지|피치|살구/i, 0xf97316],
  [/silver|platinum|chrome|metallic|실버|플래티넘|크롬|메탈/i, 0xcbd5e1],
  [/pearl|ivory|white|cream|snow|화이트|아이보리|진주|크림/i, 0xf8fafc],
  [/obsidian|black|noir|onyx|블랙|오닉스|누아르|검정/i, 0x1e293b],
];

function parseOutfitStyle(item: OutfitItem): ParsedStyle {
  const combined = `${item.nameKo} ${item.text}`;
  const matchedColors: number[] = [];

  for (const [regex, hex] of COLOR_MAP) {
    if (regex.test(combined)) {
      matchedColors.push(hex);
    }
  }

  const fallbackByCat: Record<string, [number, number]> = {
    lingerie: [0xe11d48, 0xfda4af],
    micro_bikini: [0x0284c7, 0x38bdf8],
    body_jewelry: [0xf59e0b, 0xfef08a],
    crop_hotpants: [0x4f46e5, 0x1e293b],
    top_only: [0x3b82f6, 0xf8fafc],
    topless_bottom: [0x7c3aed, 0xfbbf24],
    costume_dress: [0xbe123c, 0xfbbf24],
    color_contrast: [0x059669, 0x18181b],
  };

  const fb = fallbackByCat[item.category] || [0x2563eb, 0x93c5fd];
  const basePrimary = new THREE.Color(matchedColors[0] ?? fb[0]);
  const hueShift = ((item.id % 7) - 3) * 0.03;
  basePrimary.offsetHSL(hueShift, 0, 0);

  const baseSecondary = new THREE.Color(matchedColors[1] ?? fb[1]);

  let roughness = 0.38;
  let metalness = 0.14;
  let opacity = 0.96;

  if (item.category === 'body_jewelry' || /chain|gold|silver|crystal|체인|주얼리/i.test(combined)) {
    roughness = 0.16;
    metalness = 0.88;
    opacity = 1.0;
  } else if (/silk|satin|glossy|latex|leather|실크|새틴|레더/i.test(combined)) {
    roughness = 0.22;
    metalness = 0.3;
  } else if (/sheer|lace|mesh|chiffon|시스루|레이스|쉬폰/i.test(combined)) {
    opacity = 0.82;
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
    if (child.userData?.isOutfitMesh) {
      toRemove.push(child);
    }
  });
  toRemove.forEach((mesh) => {
    mesh.parent?.remove(mesh);
    if ((mesh as THREE.Mesh).geometry) {
      (mesh as THREE.Mesh).geometry.dispose();
    }
  });
}

// 삼각형 중심의 정규화 바인드 좌표(ax=|x/H|, y=yNorm, z=zNorm)를 판별하여 0(피부), 1(주색상), 2(배색) 반환
function classifyTriangleZone(
  category: string,
  outfitId: number,
  ax: number,
  y: number,
  z: number
): 0 | 1 | 2 {
  const vShift = ((outfitId % 5) - 2) * 0.008;

  switch (category) {
    case 'lingerie': {
      if (ax < 0.135 && y > 0.77 + vShift && y <= 0.792 + vShift) return 2;
      if (ax < 0.135 && y >= 0.605 + vShift && y <= 0.77 + vShift) return 1;
      if (ax >= 0.042 && ax <= 0.075 && y > 0.79 && y <= 0.838) return 2;
      if (ax < 0.13 && y >= 0.46 && y <= 0.545 && y >= 0.455 + ax * 0.42) return 2;
      return 0;
    }
    case 'micro_bikini': {
      if (ax >= 0.015 && ax <= 0.112 && y >= 0.695 && y <= 0.775 && z >= 0.42) return 1;
      if (ax < 0.13 && y >= 0.692 && y <= 0.712) return 2;
      if (ax >= 0.035 && ax <= 0.068 && y > 0.775 && y <= 0.838 && z >= 0.42) return 2;
      if (ax < 0.125 && y >= 0.46 && y <= 0.535 && (y >= 0.515 || ax < (y - 0.455) * 1.55)) return 1;
      return 0;
    }
    case 'body_jewelry': {
      if (ax < 0.06 && y >= 0.832 && y <= 0.85) return 1;
      if (ax < 0.13 && ((y >= 0.762 && y <= 0.778) || (y >= 0.69 && y <= 0.706))) return 1;
      if (ax < 0.018 && y >= 0.59 && y <= 0.778 && z >= 0.45) return 2;
      if (ax < 0.125 && y >= 0.588 && y <= 0.606) return 1;
      if (ax < 0.13 && Math.abs(y - (0.478 + ax * 0.52)) < 0.013) return 2;
      if (ax < 0.13 && ((y >= 0.375 && y <= 0.392) || (y >= 0.335 && y <= 0.35))) return 2;
      if (ax >= 0.155 && ax <= 0.18 && y >= 0.76 && y <= 0.84) return 1;
      return 0;
    }
    case 'crop_hotpants': {
      if (y >= 0.675 + vShift && y <= 0.838 && ax <= 0.205) return 1;
      if (ax < 0.135 && y >= 0.55 && y <= 0.57) return 1;
      if (ax < 0.138 && y >= 0.425 && y < 0.55) return 2;
      return 0;
    }
    case 'top_only': {
      if (ax < 0.075 && y > 0.818 && y <= 0.848) return 2;
      if (ax < 0.142 && y >= 0.505 + vShift && y <= 0.522 + vShift) return 2;
      if (ax < 0.142 && y > 0.522 + vShift && y <= 0.838) return 1;
      if (ax >= 0.142 && ax <= 0.265 && y >= 0.74 && y <= 0.845) {
        return ax > 0.245 ? 2 : 1;
      }
      return 0;
    }
    case 'topless_bottom': {
      if (ax < 0.128 && y >= 0.585 && y <= 0.62) return 2;
      if (ax < 0.14 && y >= 0.18 + vShift && y < 0.585) return 1;
      return 0;
    }
    case 'costume_dress': {
      if (ax < 0.062 && y >= 0.83 && y <= 0.848) return 2;
      if (ax < 0.128 && y >= 0.595 && y <= 0.622) return 2;
      if (ax < 0.145 && y >= 0.33 + vShift && y <= 0.355 + vShift) return 2;
      if (ax < 0.145 && y > 0.355 + vShift && y <= 0.79) return 1;
      return 0;
    }
    case 'color_contrast':
    default: {
      if (y >= 0.665 && y <= 0.835 && ax <= 0.185) return 1;
      if (ax < 0.136 && y >= 0.45 && y <= 0.575) return 2;
      if (ax < 0.13 && y > 0.32 && y <= 0.345) return 2;
      if (ax < 0.13 && y >= 0.08 && y <= 0.32) return 1;
      return 0;
    }
  }
}

interface CachedTriData {
  triCoords: Float32Array;
  thickness: number;
}

function getOrComputeTriData(skinnedMesh: THREE.SkinnedMesh): CachedTriData {
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
  const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z, 1.0);
  const thickness = maxDim * 0.0024;

  const bindMat = skinnedMesh.bindMatrix;
  const v = new THREE.Vector3();
  let minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;

  for (let i = 0; i < count; i += 9) {
    v.fromBufferAttribute(posAttr, i).applyMatrix4(bindMat);
    if (v.y < minY) minY = v.y;
    if (v.y > maxY) maxY = v.y;
    if (v.z < minZ) minZ = v.z;
    if (v.z > maxZ) maxZ = v.z;
  }

  const skinIdxAttr = geom.attributes.skinIndex as THREE.BufferAttribute;
  const skinWgtAttr = geom.attributes.skinWeight as THREE.BufferAttribute;
  const armBoneIndices = new Set<number>();
  if (skinnedMesh.skeleton && skinnedMesh.skeleton.bones) {
    skinnedMesh.skeleton.bones.forEach((b, idx) => {
      if (/Arm|ForeArm|Hand|Thumb|Index|Middle|Ring|Pinky/i.test(b.name)) {
        armBoneIndices.add(idx);
      }
    });
  }

  const spanY = Math.max(0.001, maxY - minY);
  const spanZ = Math.max(0.001, maxZ - minZ);
  const triCoords = new Float32Array(numTris * 3);

  const v0 = new THREE.Vector3();
  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();

  for (let t = 0; t < numTris; t++) {
    const i0 = t * 3;
    v0.fromBufferAttribute(posAttr, i0).applyMatrix4(bindMat);
    v1.fromBufferAttribute(posAttr, i0 + 1).applyMatrix4(bindMat);
    v2.fromBufferAttribute(posAttr, i0 + 2).applyMatrix4(bindMat);

    const cx = (v0.x + v1.x + v2.x) / 3;
    const cy = (v0.y + v1.y + v2.y) / 3;
    const cz = (v0.z + v1.z + v2.z) / 3;

    let isArmTri = false;
    if (skinIdxAttr && skinWgtAttr && armBoneIndices.size > 0) {
      let armW = 0;
      if (armBoneIndices.has(skinIdxAttr.getX(i0))) armW += skinWgtAttr.getX(i0);
      if (armBoneIndices.has(skinIdxAttr.getY(i0))) armW += skinWgtAttr.getY(i0);
      if (armBoneIndices.has(skinIdxAttr.getZ(i0))) armW += skinWgtAttr.getZ(i0);
      if (armBoneIndices.has(skinIdxAttr.getW(i0))) armW += skinWgtAttr.getW(i0);
      if (armW > 0.35) isArmTri = true;
    }

    // 팔 삼각형이면 ax를 최소 0.16 이상으로 마킹하여 민소매 의상이 팔에 묻어나지 않도록 분리
    const rawAx = Math.abs(cx) / spanY;
    triCoords[t * 3] = isArmTri ? Math.max(0.165, rawAx) : Math.min(0.132, rawAx);
    triCoords[t * 3 + 1] = (cy - minY) / spanY;
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
    const ax = triCoords[t * 3];
    const y = triCoords[t * 3 + 1];
    const z = triCoords[t * 3 + 2];
    if (classifyTriangleZone(item.category, item.id, ax, y, z) === zoneTarget) {
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

      const nx = normAttr.getX(srcIdx);
      const ny = normAttr.getY(srcIdx);
      const nz = normAttr.getZ(srcIdx);

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
  shell.userData = {
    isOutfitMesh: true,
    outfitMaterial: material,
  };

  return shell;
}

// 선택된 의상 ID(1~200)를 3D 마네킹 메쉬 표면에 밀착 스킨 쉘로 실시간 렌더링
export function applyOutfitToMannequin(
  root: THREE.Object3D,
  bones: Map<string, THREE.Bone>,
  outfitId: number | null
): void {
  clearOutfitMeshes(root);
  if (!outfitId || outfitId <= 0) return;

  const item = OUTFITS_DATA.find((o) => o.id === outfitId);
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
    roughness: Math.max(0.15, style.roughness - 0.1),
    metalness: Math.min(0.9, style.metalness + 0.15),
    side: THREE.DoubleSide,
  });

  let targetSkinnedMesh: THREE.SkinnedMesh | null = null;
  root.traverse((child) => {
    if (
      !targetSkinnedMesh &&
      (child as THREE.SkinnedMesh).isSkinnedMesh &&
      !child.userData?.isOutfitMesh &&
      (child as THREE.SkinnedMesh).geometry.attributes.position &&
      (child as THREE.SkinnedMesh).geometry.attributes.position.count > 100
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

  // 도형 마네킹(procedural)일 때는 골반/가슴/허리에 심플한 링 부착
  const spine1 = bones.get('Spine1');
  const hips = bones.get('Hips');
  if (spine1) {
    const topMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.2, 24), primaryMat);
    topMesh.position.set(0, 0.1, 0.01);
    topMesh.scale.set(1.16, 1, 0.82);
    topMesh.userData = { isOutfitMesh: true, outfitMaterial: primaryMat };
    spine1.add(topMesh);
  }
  if (hips) {
    const botMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.15, 24), secondaryMat);
    botMesh.position.set(0, 0.02, 0);
    botMesh.scale.set(1.16, 1, 0.8);
    botMesh.userData = { isOutfitMesh: true, outfitMaterial: secondaryMat };
    hips.add(botMesh);
  }
}
