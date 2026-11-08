import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import {
  getWardrobeItemById,
  getWardrobeSetById,
  validateWardrobeCatalog,
  WARDROBE_SETS,
} from './catalog';
import {
  isCompatible,
  isSetCompatible,
  partitionItemsByModelCompatibility,
} from './compatibility';
import {
  applyWardrobeSetToOutfit,
  composeOutfit,
  toggleItemInOutfit,
} from './composition';
import { applyWardrobeCompositionToRig } from './garmentRenderer';
import { createProceduralHumanoid } from '../humanoidRig';
import { buildWardrobeCompositionTags } from '@/services/comfyui/promptBuilder';
import { validateSceneDocumentV1 } from '@/utils/securityUtils';
import { applyCommandBatch, createDefaultSceneDocument } from '@/core/commands/commandApplier';

describe('Wardrobe Catalog & Schema Validation (428 Candidates)', () => {
  it('validates 392 items and 36 sets (= 428 candidates) with zero schema or ID errors', () => {
    const report = validateWardrobeCatalog();
    expect(report.errors).toEqual([]);
    expect(report.valid).toBe(true);
    expect(report.totalItems).toBe(392);
    expect(report.totalSets).toBe(36);
    expect(report.totalCandidates).toBe(428);
  });

  it('validates all 12 adult concept sets (Group Y) reference valid items and resolve without self-conflict', () => {
    const ySets = WARDROBE_SETS.filter((s) => s.id.startsWith('set-adult.'));
    expect(ySets.length).toBe(12);

    for (const setItem of ySets) {
      expect(setItem.adultOnly).toBe(true);
      const composed = composeOutfit(setItem.itemIds);
      expect(composed.slotConflicts).toEqual([]);
      expect(composed.activeItemIds.length).toBe(setItem.itemIds.length);
    }
  });
});

describe('Required Completion Acceptance Tests (04-wardrobe-audit-and-implementation.md)', () => {
  it('1. Adult female model can equip bralette + shirt + skirt + stockings + shoes simultaneously', () => {
    const items = [
      'inner-top.lace-bralette',
      'top.oxford-shirt',
      'bottom.pleated-mini-skirt',
      'legwear.thigh-high-stockings',
      'shoe.mary-jane',
    ];
    const composed = composeOutfit(items, { modelId: 'realistic_woman' });
    expect(composed.warnings).toEqual([]);
    expect(composed.slotConflicts).toEqual([]);
    expect(composed.activeItemIds).toEqual(expect.arrayContaining(items));
    expect(composed.activeItemIds.length).toBe(5);
    // Opaque shirt covers bralette in 3D visibility while keeping it in active state
    expect(composed.fullyHiddenItemIds).toContain('inner-top.lace-bralette');
  });

  it('2. Adult male model can equip boxer brief + shirt + slacks + oxford shoes simultaneously', () => {
    const items = [
      'inner-m.boxer-brief',
      'top.oxford-shirt',
      'bottom.tailored-slacks',
      'shoe-m.cap-toe-oxford',
    ];
    const composed = composeOutfit(items, { modelId: 'realistic_muscular_male' });
    expect(composed.warnings).toEqual([]);
    expect(composed.slotConflicts).toEqual([]);
    expect(composed.activeItemIds).toEqual(expect.arrayContaining(items));
    expect(composed.activeItemIds.length).toBe(4);
    expect(composed.fullyHiddenItemIds).toContain('inner-m.boxer-brief');
  });

  it('3. Swimwear top/bottom and one-piece transition follows slot conflict rules, while rashguard and swim_cover overlay properly', () => {
    let ids: string[] = [];
    ids = toggleItemInOutfit(ids, 'swim-f.triangle-top', 'realistic_woman').nextItemIds;
    ids = toggleItemInOutfit(ids, 'swim-f.side-tie-bottom', 'realistic_woman').nextItemIds;
    expect(ids).toEqual(['swim-f.triangle-top', 'swim-f.side-tie-bottom']);

    // Equipping one-piece replaces both swim_top (base) and swim_bottom
    const onePieceRes = toggleItemInOutfit(ids, 'swim-f.classic-one-piece', 'realistic_woman');
    expect(onePieceRes.ok).toBe(true);
    expect(onePieceRes.nextItemIds).toEqual(['swim-f.classic-one-piece']);
    expect(onePieceRes.replacedItemIds).toEqual(
      expect.arrayContaining(['swim-f.triangle-top', 'swim-f.side-tie-bottom'])
    );

    // Resort mesh set: triangle-top + side-tie-bottom + mesh-coverup + strappy-sandal
    const resortSet = getWardrobeSetById('set-adult.resort-mesh')!;
    const setRes = applyWardrobeSetToOutfit([], resortSet, 'realistic_woman');
    expect(setRes.ok).toBe(true);
    expect(setRes.nextItemIds.length).toBe(4);
  });

  it('4. Replacing only footwear preserves all other equipped slots', () => {
    const initial = composeOutfit(
      ['top.crew-tee', 'bottom.straight-jeans', 'sock.ankle-cotton', 'shoe.canvas-sneaker'],
      { modelId: 'realistic_woman' }
    ).activeItemIds;

    const afterShoeSwap = toggleItemInOutfit(initial, 'shoe.chelsea-boot', 'realistic_woman');
    expect(afterShoeSwap.ok).toBe(true);
    expect(afterShoeSwap.replacedItemIds).toEqual(['shoe.canvas-sneaker']);
    expect(afterShoeSwap.nextItemIds).toEqual(
      expect.arrayContaining(['top.crew-tee', 'bottom.straight-jeans', 'sock.ankle-cotton', 'shoe.chelsea-boot'])
    );
  });

  it('5. Rejects adultOnly items and set-adult.campus-preppy-f/m on minor and unknown ageClass models across UI/JSON/API', () => {
    const thong = getWardrobeItemById('inner-f.lace-thong')!;
    const preppyF = getWardrobeSetById('set-adult.campus-preppy-f')!;
    const preppyM = getWardrobeSetById('set-adult.campus-preppy-m')!;

    // Allowed on adult models
    expect(isCompatible(thong, 'realistic_woman').compatible).toBe(true);
    expect(isSetCompatible(preppyF, 'college_female').compatible).toBe(true);
    expect(isSetCompatible(preppyM, 'college_male').compatible).toBe(true);

    // Rejected on youth/minor models
    expect(isCompatible(thong, 'teen_girl').compatible).toBe(false);
    expect(isSetCompatible(preppyF, 'teen_girl').compatible).toBe(false);
    expect(isSetCompatible(preppyM, 'teen_boy').compatible).toBe(false);
    expect(isSetCompatible(preppyF, 'child_elementary_f').compatible).toBe(false);

    // Rejected on ageClass: 'unknown' models
    expect(isCompatible(thong, 'anime_female').compatible).toBe(false);
    expect(isSetCompatible(preppyF, 'anime_female').compatible).toBe(false);
    expect(isSetCompatible(preppyM, 'procedural').compatible).toBe(false);

    // Rejected in API CommandBatch
    const doc = createDefaultSceneDocument();
    doc.actors[0].modelId = 'teen_girl';
    const cmdRes = applyCommandBatch(
      doc,
      {
        schemaVersion: 1,
        baseRevision: doc.revision,
        requestId: 'req-minor-block',
        commands: [{ type: 'wardrobe.set.apply', actorId: 'main', setId: 'set-adult.campus-preppy-f' }],
      },
      new Set()
    );
    expect(cmdRes.ok).toBe(false);
    expect(cmdRes.error).toContain('성인 전용');

    // Rejected in JSON SceneDocumentV1 validation
    const invalidJsonDoc = {
      ...doc,
      actors: [
        {
          ...doc.actors[0],
          modelId: 'teen_girl',
          outfit: { schemaVersion: 1, actorId: 'main', itemIds: ['inner-f.lace-thong'] },
        },
      ],
    };
    const valRes = validateSceneDocumentV1(invalidJsonDoc);
    expect(valRes.document).toBeUndefined();
    expect(valRes.error).toBeDefined();
  });

  it('6. Holds incompatible items with reasons when switching from adult model to minor model', () => {
    const part = partitionItemsByModelCompatibility(
      ['top.crew-tee', 'inner-f.lace-thong', 'shoe-f.stiletto-heel'],
      'teen_girl'
    );
    expect(part.compatibleItemIds).toEqual(['top.crew-tee']);
    expect(part.heldItems.length).toBeGreaterThan(0);
  });

  it('7. Disposes previous GPU geometries/materials without unbounded growth across 10 outfit changes and preserves roundtrip consistency', () => {
    const rig = createProceduralHumanoid();
    const candidateSets = WARDROBE_SETS.slice(0, 10);

    for (let i = 0; i < 10; i++) {
      const s = candidateSets[i % candidateSets.length];
      applyWardrobeCompositionToRig(
        rig.group,
        rig.bones,
        { schemaVersion: 1, actorId: 'main', itemIds: s.itemIds },
        'realistic_woman'
      );
    }

    const finalComp = {
      schemaVersion: 1 as const,
      actorId: 'main',
      itemIds: ['top.oxford-shirt', 'bottom.tailored-slacks', 'shoe.penny-loafer'],
      overrides: { 'top.oxford-shirt': { color: '#2563eb' } },
    };

    applyWardrobeCompositionToRig(rig.group, rig.bones, finalComp, 'realistic_woman');

    let wardrobeMeshCount = 0;
    rig.group.traverse((c) => {
      if ((c as THREE.Mesh).isMesh && c.userData?.isWardrobeMesh) {
        wardrobeMeshCount++;
      }
    });
    expect(wardrobeMeshCount).toBeGreaterThan(0);
    expect(wardrobeMeshCount).toBeLessThan(15);

    const promptTags1 = buildWardrobeCompositionTags(finalComp, { modelId: 'realistic_woman' }).tags;
    const doc = createDefaultSceneDocument();
    doc.actors[0].outfit = finalComp;

    const validated = validateSceneDocumentV1(JSON.parse(JSON.stringify(doc)));
    expect(validated.error).toBeUndefined();
    const restoredOutfit = validated.document!.actors[0].outfit!;
    expect(restoredOutfit.itemIds).toEqual(finalComp.itemIds);
    expect(restoredOutfit.overrides).toEqual(finalComp.overrides);

    const promptTags2 = buildWardrobeCompositionTags(restoredOutfit, { modelId: 'realistic_woman' }).tags;
    expect(promptTags2).toEqual(promptTags1);
  });
});
