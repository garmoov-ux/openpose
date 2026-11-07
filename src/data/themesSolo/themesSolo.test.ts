import { describe, it, expect } from 'vitest';
import { THEMES_DATA } from './themesData';
import { OUTFITS_DATA } from './outfitsData';
import { POSTURES_DATA } from './posturesTextData';
import { getSoloThemePoseKeyframe } from '@/core/mannequin/poses';
import { buildResolvedPrompt, buildWildcardPrompt } from '@/services/comfyui/promptBuilder';
import { SoloThemeId } from '@/types/themeSolo';

describe('Solo Themes Studio 통합 검증', () => {
  it('16개 테마가 모두 유효한 배경 및 조명 목록을 보유해야 한다', () => {
    const themeKeys = Object.keys(THEMES_DATA) as SoloThemeId[];
    expect(themeKeys.length).toBe(16);

    themeKeys.forEach((key) => {
      const theme = THEMES_DATA[key];
      expect(theme.titleKo.length).toBeGreaterThan(0);
      expect(theme.environments.length).toBeGreaterThanOrEqual(22);
      expect(theme.lightings.length).toBeGreaterThanOrEqual(5);
    });
  });

  it('200종 의상이 모두 유효한 텍스트와 카테고리를 가져야 한다', () => {
    expect(OUTFITS_DATA.length).toBe(200);

    OUTFITS_DATA.forEach((outfit, idx) => {
      expect(outfit.id).toBe(idx + 1);
      expect(outfit.text.length).toBeGreaterThan(10);
      expect(outfit.categoryLabelKo.length).toBeGreaterThan(0);
    });
  });

  it('100종 코어 포즈와 3D 키프레임이 1:1로 완벽 매핑되어야 한다', () => {
    expect(POSTURES_DATA.length).toBe(100);

    for (let id = 1; id <= 100; id++) {
      const keyframe = getSoloThemePoseKeyframe(id);
      expect(keyframe).toBeDefined();
      expect(keyframe?.Hips).toBeDefined();

      // Hips 쿼터니언 정규화 검증 (length 약 1.0)
      const rot = keyframe!.Hips.rotation;
      const lenSq = rot[0] ** 2 + rot[1] ** 2 + rot[2] ** 2 + rot[3] ** 2;
      expect(Math.abs(lenSq - 1.0)).toBeLessThan(0.001);
    }
  });

  it('단일 확정 프롬프트 빌더가 누락 없이 완벽한 텍스트를 조합해야 한다', () => {
    const prompt = buildResolvedPrompt({
      themeId: 'alley_downtown_street',
      envIndex: 0,
      lightIndex: 0,
      outfitId: 1,
      outfitCategory: 'all',
      postureId: 1,
      shotPrefixIndex: 0,
      isWildcardMode: false,
    });

    expect(prompt).toContain('strictly a single solo woman');
    expect(prompt).toContain('Picture 1 (image1)');
    expect(prompt).toContain('captured in a brand-new dynamic posture');
    expect(prompt).toContain('set in a brand-new background environment');
  });

  it('와일드카드 모드 프롬프트가 {옵션1|옵션2} 구문을 유지해야 한다', () => {
    const prompt = buildWildcardPrompt({
      themeId: 'pilates_mirror_studio',
      envIndex: 0,
      lightIndex: 0,
      outfitId: 1,
      outfitCategory: 'lingerie',
      postureId: 5,
      shotPrefixIndex: 0,
      isWildcardMode: true,
    });

    expect(prompt).toContain('{');
    expect(prompt).toContain('|');
    expect(prompt).toContain('}');
  });
});
