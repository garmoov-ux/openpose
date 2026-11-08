import * as THREE from 'three';
import { MannequinModelId } from '@/types';
import {
  ComposedOutfitResult,
  OutfitCompositionV1,
  WardrobeItemV1,
} from '@/types/wardrobe';
import { composeOutfit } from './composition';
import { disposeWardrobeMeshesOnRoot } from './dispose';
import {
  buildFootBoneShoePair,
  buildWardrobeItemSkinnedMesh,
  createGarmentMaterial,
} from './garmentGeometry';

function attachProceduralFallbackItem(
  bones: Map<string, THREE.Bone>,
  item: WardrobeItemV1,
  override?: OutfitCompositionV1['overrides']
): void {
  const mat = createGarmentMaterial(item, override?.[item.id]);
  const spine1 = bones.get('Spine1');
  const hips = bones.get('Hips');
  const head = bones.get('Head');
  const leftUpLeg = bones.get('LeftUpLeg');
  const rightUpLeg = bones.get('RightUpLeg');

  if (
    item.geometryKey === 'fitted-top' ||
    item.geometryKey === 'loose-top' ||
    item.geometryKey === 'outer' ||
    item.geometryKey === 'swim-top' ||
    item.geometryKey === 'swim-one-piece'
  ) {
    if (spine1) {
      const r = item.geometryKey === 'outer' ? 0.165 : item.geometryKey === 'loose-top' ? 0.155 : 0.145;
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.85, 0.24, 24), mat);
      mesh.position.set(0, 0.08, 0.01);
      mesh.scale.set(1.16, 1, 0.84);
      mesh.userData = { isOutfitMesh: true, isWardrobeMesh: true, outfitMaterial: mat };
      spine1.add(mesh);
    }
  }

  if (
    item.geometryKey === 'trousers' ||
    item.geometryKey === 'shorts-skirt' ||
    item.geometryKey === 'dress' ||
    item.geometryKey === 'underwear' ||
    item.geometryKey === 'swim-bottom' ||
    item.geometryKey === 'swim-one-piece'
  ) {
    if (hips) {
      const isSkirtOrDress = item.geometryKey === 'dress' || item.id.includes('skirt');
      const h = isSkirtOrDress ? 0.28 : 0.18;
      const rBot = isSkirtOrDress ? 0.18 : 0.14;
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.125, rBot, h, 24), mat);
      mesh.position.set(0, 0.01, 0);
      mesh.scale.set(1.16, 1, 0.82);
      mesh.userData = { isOutfitMesh: true, isWardrobeMesh: true, outfitMaterial: mat };
      hips.add(mesh);
    }
    if (item.geometryKey === 'trousers') {
      [leftUpLeg, rightUpLeg].forEach((leg) => {
        if (!leg) return;
        const m = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.055, 0.34, 16), mat);
        m.position.set(0, -0.18, 0);
        m.userData = { isOutfitMesh: true, isWardrobeMesh: true, outfitMaterial: mat };
        leg.add(m);
      });
    }
  }

  if (item.geometryKey === 'shoe') {
    buildFootBoneShoePair(bones, item, override?.[item.id]);
  }

  if (item.geometryKey === 'accessory' && item.slots.includes('head_accessory') && head) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.06, 20), mat);
    m.position.set(0, 0.12, 0);
    m.userData = { isOutfitMesh: true, isWardrobeMesh: true, outfitMaterial: mat };
    head.add(m);
  }
}

export function applyWardrobeCompositionToRig(
  root: THREE.Object3D,
  bones: Map<string, THREE.Bone>,
  composition: OutfitCompositionV1 | null | undefined,
  modelId?: MannequinModelId
): ComposedOutfitResult {
  disposeWardrobeMeshesOnRoot(root);

  const itemIds = composition?.itemIds || [];
  const composed = composeOutfit(itemIds, modelId ? { modelId } : undefined);

  if (composed.visibleItems.length === 0) {
    return composed;
  }

  let targetSkinnedMesh: THREE.SkinnedMesh | null = null;
  root.traverse((child) => {
    if (
      !targetSkinnedMesh &&
      (child as THREE.SkinnedMesh).isSkinnedMesh &&
      !child.userData?.isOutfitMesh &&
      !child.userData?.isWardrobeMesh &&
      !child.userData?.isBodyAccessory &&
      (child as THREE.SkinnedMesh).geometry.attributes.position?.count > 100
    ) {
      targetSkinnedMesh = child as THREE.SkinnedMesh;
    }
  });

  if (targetSkinnedMesh) {
    const sm = targetSkinnedMesh as THREE.SkinnedMesh;
    const parent = sm.parent || root;

    for (const item of composed.visibleItems) {
      if (item.renderSupport === 'prompt-only') continue;
      const hidden = composed.hiddenRegionsByItem[item.id] || [];
      const override = composition?.overrides?.[item.id];
      const shell = buildWardrobeItemSkinnedMesh(sm, item, hidden, override);
      if (shell) {
        parent.add(shell);
      }
      if (item.geometryKey === 'shoe') {
        buildFootBoneShoePair(bones, item, override);
      }
    }
    return composed;
  }

  // 절차형(procedural) 도형 마네킹 폴백 렌더링
  for (const item of composed.visibleItems) {
    if (item.renderSupport === 'prompt-only') continue;
    attachProceduralFallbackItem(bones, item, composition?.overrides);
  }

  return composed;
}

export function setDressedMeshesVisibility(root: THREE.Object3D, visible: boolean): void {
  root.traverse((child) => {
    if (
      child.userData?.isOutfitMesh ||
      child.userData?.isWardrobeMesh ||
      child.userData?.isBodyAccessory
    ) {
      child.visible = visible;
    }
  });
}

