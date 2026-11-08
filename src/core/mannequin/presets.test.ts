import * as THREE from 'three';
import { describe, it, expect } from 'vitest';
import { POSE_PRESETS, applyPosePreset } from './presets';
import { createProceduralHumanoid } from './humanoidRig';
import { getSoloThemePoseKeyframe } from './poses';
import { quatToDeg } from './poses/poseMath';

describe('포즈 프리셋 라이브러리 및 해부학 무결성 검증 (presets)', () => {
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
});
