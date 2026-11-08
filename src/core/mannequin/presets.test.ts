import * as THREE from 'three';
import { describe, it, expect } from 'vitest';
import { POSE_PRESETS, applyPosePreset } from './presets';
import { createProceduralHumanoid } from './humanoidRig';
import { getSoloThemePoseKeyframe } from './poses';
import { quatToDeg } from './poses/poseMath';
import { MANNEQUIN_MODELS } from './models';
import { getMannequinProfile, getOutfitsForMannequin, findOutfitById } from './mannequinProfiles';
import { rebuildThemePropsGroup } from '@/core/scene/themePropsBuilder';
import { ROOM_PROP_CATALOG, getDefaultRoomPropsForTheme } from '@/data/themesSolo/roomPropCatalog';
import { buildCompactSceneTagSummary } from '@/services/comfyui/promptBuilder';

describe('포즈 프리셋 라이브러리 및 해부학 무결성 검증 (presets)', () => {
  it('사전 정의된 포즈 프리셋이 5개 이상 존재해야 한다', () => {
    expect(POSE_PRESETS.length).toBeGreaterThanOrEqual(5);
  });

  it('모든 프리셋은 필수 메타데이터(id, title, category, pose)를 충족해야 한다', () => {
    POSE_PRESETS.forEach((preset) => {
      expect(preset.id).toBeTruthy();
      expect(preset.title).toBeTruthy();
      expect(['standing', 'sitting', 'action', 'hands', 'glamour', 'couple']).toContain(
        preset.category
      );
      expect(Object.keys(preset.pose).length).toBeGreaterThan(0);
    });
  });

  it('모든 프리셋의 본 회전 쿼터니언은 정규화(길이 1.0)되어 있어야 한다', () => {
    POSE_PRESETS.forEach((preset) => {
      Object.entries(preset.pose).forEach(([, data]) => {
        const [x, y, z, w] = data.rotation;
        const length = Math.sqrt(x * x + y * y + z * z + w * w);
        expect(length).toBeGreaterThan(0.99);
        expect(length).toBeLessThan(1.01);
      });
    });
  });

  it('기본 프리셋과 100종 포즈 모두 무릎 역관절(음수 X 회전)이 없어야 하며 바닥 아래로 파묻히지 않아야 한다', () => {
    const rig = createProceduralHumanoid();
    const lKneePos = new THREE.Vector3();
    const rKneePos = new THREE.Vector3();

    for (let id = 1; id <= 100; id++) {
      const kf = getSoloThemePoseKeyframe(id);
      expect(kf).not.toBeNull();

      // 무릎 각도가 음수(역관절)가 아닌지 확인
      if (kf?.LeftLeg) {
        const [rx] = quatToDeg(kf.LeftLeg.rotation);
        expect(rx).toBeGreaterThanOrEqual(-0.1);
      }
      if (kf?.RightLeg) {
        const [rx] = quatToDeg(kf.RightLeg.rotation);
        expect(rx).toBeGreaterThanOrEqual(-0.1);
      }

      // 3D 마네킹에 적용 시 다리 X자 교차 및 바닥 침투가 없어야 함
      applyPosePreset(rig.bones, {
        id: `test-pose-${id}`,
        title: `테스트 ${id}`,
        category: 'action',
        description: '',
        pose: kf!,
      });

      rig.bones.get('LeftLeg')!.getWorldPosition(lKneePos);
      rig.bones.get('RightLeg')!.getWorldPosition(rKneePos);

      expect(lKneePos.y).toBeGreaterThan(0.03);
      expect(rKneePos.y).toBeGreaterThan(0.03);
    }
  });

  it('27종 마네킹 각각에 기본 의상 미착용(0) 및 전용 추천 복장·자세가 매핑되어 있어야 한다', () => {
    expect(MANNEQUIN_MODELS.length).toBe(27);
    MANNEQUIN_MODELS.forEach((model) => {
      const profile = getMannequinProfile(model.id);
      expect(profile).toBeDefined();
      expect(profile.defaultOutfitId).toBe(0);
      expect(POSE_PRESETS.some((p) => p.id === profile.defaultStandardPoseId)).toBe(true);

      const outfits = getOutfitsForMannequin(model.id);
      expect(outfits.length).toBeGreaterThan(0);

      if (profile.recommendedOutfitId > 0) {
        expect(findOutfitById(profile.recommendedOutfitId)).toBeDefined();
      }

      // 유아/아동/남성/시니어는 성인 여성 란제리·마이크로비키니가 포함되지 않아야 함
      if (profile.outfitProfile !== 'adult_female') {
        expect(outfits.some((o) => o.category === 'lingerie' || o.category === 'micro_bikini')).toBe(false);
      }
    });
  });

  it('테마 사물 생성기와 장면 핵심 태그 요약기가 정상 동작해야 한다', () => {
    const group = new THREE.Group();
    rebuildThemePropsGroup(group, 'alley_downtown_street', 0);
    expect(group.children.length).toBeGreaterThan(0);

    const tags = buildCompactSceneTagSummary({
      modelId: 'realistic_muscular_male',
      outfitId: 1011,
      themeId: 'alley_downtown_street',
      envIndex: 0,
      lightIndex: 0,
      postureId: 1,
    });
    expect(tags).toContain('185cm');
    expect(tags.toLowerCase()).not.toContain('picture 1');
  });

  it('100종 남·여 커플 체위 프리셋과 55종 사각 룸 가구·소품 카탈로그가 무결해야 한다', () => {
    const couplePresets = POSE_PRESETS.filter((p) => p.category === 'couple');
    expect(couplePresets.length).toBe(100);
    couplePresets.forEach((cp) => {
      expect(cp.partnerPose).toBeDefined();
      expect(cp.partnerOffset).toBeDefined();
      expect(cp.subGroup).toBeTruthy();
    });

    expect(ROOM_PROP_CATALOG.length).toBe(55);
    const defaultRoomProps = getDefaultRoomPropsForTheme('house_indoor_room', 0);
    expect(defaultRoomProps.length).toBeGreaterThanOrEqual(6);

    const group = new THREE.Group();
    rebuildThemePropsGroup(group, 'house_indoor_room', 0, 0, defaultRoomProps);
    const selectableProps = group.children.filter((c) => c.userData?.isSceneProp && c.userData?.propUid);
    expect(selectableProps.length).toBe(defaultRoomProps.length);
  });
});
