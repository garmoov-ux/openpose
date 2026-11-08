import * as THREE from 'three';
import { PoseKeyframe } from '@/types';

// 오일러 각도(Degree)를 쿼터니언 [x, y, z, w]으로 변환하는 순수 함수
export function q(xDeg: number, yDeg: number, zDeg: number): [number, number, number, number] {
  const euler = new THREE.Euler(
    THREE.MathUtils.degToRad(xDeg),
    THREE.MathUtils.degToRad(yDeg),
    THREE.MathUtils.degToRad(zDeg),
    'XYZ'
  );
  const quat = new THREE.Quaternion().setFromEuler(euler);
  return [quat.x, quat.y, quat.z, quat.w];
}

// 쿼터니언 배열을 오일러 각도(Degree) [x, y, z]로 역변환
export function quatToDeg(rot: [number, number, number, number]): [number, number, number] {
  const quat = new THREE.Quaternion(rot[0], rot[1], rot[2], rot[3]);
  const euler = new THREE.Euler().setFromQuaternion(quat, 'XYZ');
  return [
    THREE.MathUtils.radToDeg(euler.x),
    THREE.MathUtils.radToDeg(euler.y),
    THREE.MathUtils.radToDeg(euler.z),
  ];
}

// 기본 베이스 키프레임 생성 헬퍼 (T-포즈 고착 방지용 자연스러운 기본 자세)
export function createBaseKeyframe(hipPos: [number, number, number] = [0, 0.95, 0]): PoseKeyframe {
  return {
    Hips: { rotation: q(0, 0, 0), position: hipPos },
    Spine: { rotation: q(0, 0, 0) },
    Spine1: { rotation: q(0, 0, 0) },
    Neck: { rotation: q(0, 0, 0) },
    Head: { rotation: q(0, 0, 0) },
    LeftShoulder: { rotation: q(0, 0, 0) },
    RightShoulder: { rotation: q(0, 0, 0) },
    LeftArm: { rotation: q(-8, 0, -64) },
    LeftForeArm: { rotation: q(0, -18, -10) },
    LeftHand: { rotation: q(0, 0, 0) },
    RightArm: { rotation: q(-8, 0, 64) },
    RightForeArm: { rotation: q(0, 18, 10) },
    RightHand: { rotation: q(0, 0, 0) },
    LeftUpLeg: { rotation: q(0, -4, 4) },
    LeftLeg: { rotation: q(2, 0, 0) },
    LeftFoot: { rotation: q(0, 0, 0) },
    RightUpLeg: { rotation: q(0, 4, -4) },
    RightLeg: { rotation: q(2, 0, 0) },
    RightFoot: { rotation: q(0, 0, 0) },
  };
}

// 인체 해부학적 가동 범위(ROM) 및 축 부호 보정 정규화 함수
export function sanitizePoseKeyframe(raw: PoseKeyframe, isTPose = false): PoseKeyframe {
  if (isTPose) return raw;

  const base = createBaseKeyframe(raw.Hips?.position || [0, 0.95, 0]);
  const result: PoseKeyframe = { ...base };

  Object.entries(raw).forEach(([boneName, joint]) => {
    if (!joint) return;
    let [rx, ry, rz] = quatToDeg(joint.rotation);

    // 1. 무릎(LeftLeg, RightLeg)은 절대 앞으로 꺾이지 않도록(xDeg >= 0) 해부학적 굴곡 방향 보장
    if (boneName === 'LeftLeg' || boneName === 'RightLeg') {
      rx = Math.abs(rx);
      rx = Math.min(138, rx);
    }

    // 2. 좌측 고관절(LeftUpLeg): 바깥쪽 벌림(외전)은 z >= 0, y <= 0 이어야 다리가 교차하지 않음
    if (boneName === 'LeftUpLeg') {
      if (rz < -5 && ry > 5) {
        rz = Math.abs(rz) * 0.85;
        ry = -Math.abs(ry) * 0.65;
      } else if (rz < -5) {
        rz = Math.abs(rz) * 0.85;
      }
    }

    // 3. 우측 고관절(RightUpLeg): 바깥쪽 벌림(외전)은 z <= 0, y >= 0 이어야 다리가 교차하지 않음
    if (boneName === 'RightUpLeg') {
      if (rz > 5 && ry < -5) {
        rz = -Math.abs(rz) * 0.85;
        ry = Math.abs(ry) * 0.65;
      } else if (rz > 5) {
        rz = -Math.abs(rz) * 0.85;
      }
    }

    // 4. 좌측 상완(LeftArm): T-포즈에서 팔을 내리는 기본각(rz: -52 ~ -68) 보정 및 전후방 방향 보정
    if (boneName === 'LeftArm') {
      if (rz > -45) {
        rz = Math.min(-52, rz - 32);
      }
      rx = -rx * 0.75;
    }

    // 5. 우측 상완(RightArm): T-포즈에서 팔을 내리는 기본각(rz: +52 ~ +68) 보정 및 전후방 방향 보정
    if (boneName === 'RightArm') {
      if (rz < 45) {
        rz = Math.max(52, rz + 32);
      }
      rx = -rx * 0.75;
    }

    // 6. 좌/우 전완(LeftForeArm, RightForeArm): 팔꿈치를 자연스럽게 앞/안쪽으로 굽히도록 Y/Z축 결합
    if (boneName === 'LeftForeArm' && Math.abs(ry) < 5 && rz < -15) {
      const bend = Math.min(85, Math.abs(rz));
      ry = -bend * 0.75;
      rz = -bend * 0.35;
    }
    if (boneName === 'RightForeArm' && Math.abs(ry) < 5 && rz > 15) {
      const bend = Math.min(85, Math.abs(rz));
      ry = bend * 0.75;
      rz = bend * 0.35;
    }

    result[boneName] = {
      rotation: q(rx, ry, rz),
      ...(joint.position ? { position: joint.position } : {}),
    };
  });

  return result;
}
