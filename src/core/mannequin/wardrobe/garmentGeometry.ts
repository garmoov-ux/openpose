import * as THREE from 'three';
import { getOrComputeTriData } from '../outfitVisualizer';
import {
  OutfitItemOverride,
  WardrobeItemV1,
  WardrobeLayer,
} from '@/types/wardrobe';
import { matchGarmentTriangle } from './garmentZoneMatcher';

const LAYER_OFFSET_MULT: Record<WardrobeLayer, number> = {
  underwear: 1.0,
  base: 1.45,
  outer: 2.1,
  accessory: 1.75,
};

export function createGarmentMaterial(
  item: WardrobeItemV1,
  override?: OutfitItemOverride
): THREE.MeshStandardMaterial {
  const matSpec = item.materials[0] || { role: 'main', color: '#f8fafc', fabric: 'cotton' };
  const colorStr = override?.color || matSpec.color || '#f8fafc';
  const fabric = (override?.material || matSpec.fabric || 'cotton').toLowerCase();
  const opacityMode = item.shape?.opacity || 'opaque';

  let roughness = 0.55;
  let metalness = 0.08;
  let opacity = 1.0;

  if (fabric.includes('satin') || fabric.includes('silk')) {
    roughness = 0.24;
    metalness = 0.25;
  } else if (fabric.includes('leather')) {
    roughness = 0.22;
    metalness = 0.38;
  } else if (fabric.includes('suede')) {
    roughness = 0.72;
    metalness = 0.05;
  } else if (fabric.includes('denim') || fabric.includes('knit') || fabric.includes('wool')) {
    roughness = 0.68;
    metalness = 0.05;
  } else if (fabric.includes('swim') || fabric.includes('lycra')) {
    roughness = 0.3;
    metalness = 0.18;
  } else if (fabric.includes('lace') || fabric.includes('mesh')) {
    roughness = 0.4;
    metalness = 0.1;
  }

  if (opacityMode === 'sheer') {
    opacity = 0.48;
  } else if (opacityMode === 'semi-sheer') {
    opacity = 0.72;
  }

  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(colorStr),
    roughness,
    metalness,
    transparent: opacity < 1.0,
    opacity,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: -LAYER_OFFSET_MULT[item.layer],
    polygonOffsetUnits: -1,
  });
}

export function buildWardrobeItemSkinnedMesh(
  skinnedMesh: THREE.SkinnedMesh,
  item: WardrobeItemV1,
  hiddenRegions: string[],
  override?: OutfitItemOverride
): THREE.SkinnedMesh | null {
  const { triCoords, thickness } = getOrComputeTriData(skinnedMesh);
  const geom = skinnedMesh.geometry;
  const posAttr = geom.attributes.position as THREE.BufferAttribute;
  const normAttr = geom.attributes.normal as THREE.BufferAttribute;
  const skinIdxAttr = geom.attributes.skinIndex as THREE.BufferAttribute;
  const skinWgtAttr = geom.attributes.skinWeight as THREE.BufferAttribute;

  const numTris = triCoords.length / 3;
  const matchedTris: Array<{ t: number; inflate: number; drop: number }> = [];

  for (let t = 0; t < numTris; t++) {
    const ax = triCoords[t * 3];
    const y = triCoords[t * 3 + 1];
    const z = triCoords[t * 3 + 2];
    const res = matchGarmentTriangle(item, ax, y, z, hiddenRegions, override);
    if (res.matched) {
      matchedTris.push({ t, inflate: res.radialInflate, drop: res.dropSkirtFactor });
    }
  }

  if (matchedTris.length === 0) return null;

  const vertCount = matchedTris.length * 3;
  const positions = new Float32Array(vertCount * 3);
  const normals = new Float32Array(vertCount * 3);
  const skinIndices = new Float32Array(vertCount * 4);
  const skinWeights = new Float32Array(vertCount * 4);

  const baseLayerMult = LAYER_OFFSET_MULT[item.layer] || 1.3;

  for (let m = 0; m < matchedTris.length; m++) {
    const { t, inflate, drop } = matchedTris[m];
    const offset = thickness * baseLayerMult * inflate;
    for (let k = 0; k < 3; k++) {
      const srcIdx = t * 3 + k;
      const dstIdx = m * 3 + k;
      const nx = normAttr.getX(srcIdx);
      const ny = normAttr.getY(srcIdx);
      const nz = normAttr.getZ(srcIdx);

      const px = posAttr.getX(srcIdx);
      const py = posAttr.getY(srcIdx);
      const pz = posAttr.getZ(srcIdx);

      const skirtOutward = drop > 0 ? thickness * 2.2 * drop : 0;

      positions[dstIdx * 3] = px + nx * (offset + skirtOutward);
      positions[dstIdx * 3 + 1] = py + ny * offset * 0.6;
      positions[dstIdx * 3 + 2] = pz + nz * (offset + skirtOutward);
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
  if (skinIdxAttr && skinWgtAttr) {
    outGeom.setAttribute('skinIndex', new THREE.BufferAttribute(skinIndices, 4));
    outGeom.setAttribute('skinWeight', new THREE.BufferAttribute(skinWeights, 4));
  }

  const material = createGarmentMaterial(item, override);
  const shell = new THREE.SkinnedMesh(outGeom, material);
  shell.position.copy(skinnedMesh.position);
  shell.quaternion.copy(skinnedMesh.quaternion);
  shell.scale.copy(skinnedMesh.scale);
  shell.castShadow = true;
  shell.receiveShadow = true;
  shell.frustumCulled = false;
  shell.renderOrder = Math.round(baseLayerMult * 10);
  shell.bind(skinnedMesh.skeleton, skinnedMesh.bindMatrix);
  shell.userData = {
    isOutfitMesh: true,
    isWardrobeMesh: true,
    wardrobeItemId: item.id,
    wardrobeLayer: item.layer,
    outfitMaterial: material,
  };
  return shell;
}

export function buildFootBoneShoePair(
  bones: Map<string, THREE.Bone>,
  item: WardrobeItemV1,
  override?: OutfitItemOverride
): THREE.Object3D[] {
  const created: THREE.Object3D[] = [];
  const leftFoot = bones.get('LeftFoot');
  const rightFoot = bones.get('RightFoot');
  if (!leftFoot && !rightFoot) return created;

  const heelCm = item.shape?.heelHeightCm ?? 2.0;
  const soleCm = item.shape?.soleThicknessCm ?? 1.5;
  const mat = createGarmentMaterial(item, override);

  const attachSoleAndHeel = (footBone: THREE.Bone) => {
    const group = new THREE.Group();
    group.userData = {
      isOutfitMesh: true,
      isWardrobeMesh: true,
      wardrobeItemId: item.id,
      outfitMaterial: mat,
    };

    const soleH = Math.max(0.01, soleCm * 0.004);
    const soleGeom = new THREE.BoxGeometry(0.075, soleH, 0.16);
    const soleMesh = new THREE.Mesh(soleGeom, mat);
    soleMesh.position.set(0, -0.035, 0.035);
    soleMesh.userData = { isOutfitMesh: true, isWardrobeMesh: true, outfitMaterial: mat };
    group.add(soleMesh);

    if (heelCm >= 3.5) {
      const heelH = Math.min(0.08, heelCm * 0.0065);
      const heelRadius = item.id.includes('stiletto') || item.id.includes('pointed') ? 0.009 : 0.018;
      const heelGeom = new THREE.CylinderGeometry(heelRadius, heelRadius * 0.8, heelH, 12);
      const heelMesh = new THREE.Mesh(heelGeom, mat);
      heelMesh.position.set(0, -0.035 - heelH * 0.5, -0.025);
      heelMesh.userData = { isOutfitMesh: true, isWardrobeMesh: true, outfitMaterial: mat };
      group.add(heelMesh);
    }

    footBone.add(group);
    created.push(group);
  };

  if (leftFoot) attachSoleAndHeel(leftFoot);
  if (rightFoot) attachSoleAndHeel(rightFoot);
  return created;
}
