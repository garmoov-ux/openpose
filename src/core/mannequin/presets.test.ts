import { describe, it, expect } from 'vitest';
import { POSE_PRESETS } from './presets';

describe('포즈 프리셋 라이브러리 (presets)', () => {
  it('사전 정의된 포즈 프리셋이 5개 이상 존재해야 한다', () => {
    expect(POSE_PRESETS.length).toBeGreaterThanOrEqual(5);
  });

  it('모든 프리셋은 필수 메타데이터(id, title, category, pose)를 충족해야 한다', () => {
    POSE_PRESETS.forEach((preset) => {
      expect(preset.id).toBeTruthy();
      expect(preset.title).toBeTruthy();
      expect(['standing', 'sitting', 'action', 'hands']).toContain(preset.category);
      expect(Object.keys(preset.pose).length).toBeGreaterThan(0);
    });
  });

  it('모든 프리셋의 본 회전 쿼터니언은 정규화(길이 1.0)되어 있어야 한다', () => {
    POSE_PRESETS.forEach((preset) => {
      Object.entries(preset.pose).forEach(([, data]) => {
        const [x, y, z, w] = data.rotation;
        const length = Math.sqrt(x * x + y * y + z * z + w * w);
        // 부동 소수점 오차 허용 (0.999 ~ 1.001)
        expect(length).toBeGreaterThan(0.99);
        expect(length).toBeLessThan(1.01);
      });
    });
  });
});
