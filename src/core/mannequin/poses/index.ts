import { PoseKeyframe } from '@/types';
import { CLOSE_SEATED_POSES } from './closeSeatedPoses';
import { CLOSE_LOUNGE_POSES } from './closeLoungePoses';
import { ULTRA_CLOSE_POSES_A } from './ultraClosePosesA';
import { ULTRA_CLOSE_POSES_B } from './ultraClosePosesB';

export * from './poseMath';
export * from './closeSeatedPoses';
export * from './closeLoungePoses';
export * from './ultraClosePosesA';
export * from './ultraClosePosesB';

// 100종 포즈 전체 통합 맵
export const SOLO_THEME_POSES_MAP: Record<number, PoseKeyframe> = {
  ...CLOSE_SEATED_POSES,
  ...CLOSE_LOUNGE_POSES,
  ...ULTRA_CLOSE_POSES_A,
  ...ULTRA_CLOSE_POSES_B,
};

// ID로 포즈 키프레임 조회
export function getSoloThemePoseKeyframe(id: number): PoseKeyframe | null {
  return SOLO_THEME_POSES_MAP[id] || null;
}

