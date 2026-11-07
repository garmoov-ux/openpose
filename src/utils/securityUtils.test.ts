import { describe, it, expect } from 'vitest';
import { validateAndSanitizePoseData } from './securityUtils';

describe('보안 검증 (securityUtils)', () => {
  it('유효한 포즈 데이터는 정상적으로 정제되어 파싱되어야 한다', () => {
    const raw = {
      name: 'CustomPose',
      timestamp: 123456789,
      bones: {
        Hips: { rotation: [0, 0, 0, 1], position: [0, 1, 0] },
        Neck: { rotation: [0.1, 0, 0, 0.99] },
      },
    };

    const result = validateAndSanitizePoseData(raw);
    expect(result).not.toBeNull();
    expect(result?.name).toBe('CustomPose');
    expect(result?.bones.Hips.rotation).toEqual([0, 0, 0, 1]);
    expect(result?.bones.Hips.position).toEqual([0, 1, 0]);
    expect(result?.bones.Neck.rotation).toEqual([0.1, 0, 0, 0.99]);
  });

  it('프로토타입 오염 공격 키(__proto__)는 무시되고 차단되어야 한다', () => {
    const malicious = {
      name: 'Exploit',
      bones: {
        '__proto__': { rotation: [1, 2, 3, 4] },
        'constructor': { rotation: [1, 2, 3, 4] },
        Hips: { rotation: [0, 0, 0, 1] },
      },
    };

    const result = validateAndSanitizePoseData(malicious);
    expect(result).not.toBeNull();
    expect(Object.prototype.hasOwnProperty.call(result?.bones, '__proto__')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(result?.bones, 'constructor')).toBe(false);
    expect(result?.bones.Hips).toBeDefined();
  });

  it('허용 목록에 없는 임의의 관절 키는 필터링되어야 한다', () => {
    const rawWithUnknown = {
      name: 'UnknownTest',
      bones: {
        Hips: { rotation: [0, 0, 0, 1] },
        InvalidCustomJoint: { rotation: [0, 1, 0, 0] },
      },
    };

    const result = validateAndSanitizePoseData(rawWithUnknown);
    expect(result).not.toBeNull();
    expect(result?.bones.Hips).toBeDefined();
    expect((result?.bones as any).InvalidCustomJoint).toBeUndefined();
  });

  it('쿼터니언 회전값에 숫자가 아닌 타입이나 NaN이 포함된 경우 거부되어야 한다', () => {
    const invalidRot = {
      name: 'InvalidRot',
      bones: {
        Hips: { rotation: ['invalid', 0, 0, 1] },
        Neck: { rotation: [NaN, 0, 0, 1] },
      },
    };

    const result = validateAndSanitizePoseData(invalidRot);
    expect(result).toBeNull();
  });
});
