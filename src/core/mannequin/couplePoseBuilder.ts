import { PoseKeyframe, PosePreset } from '@/types';
import { q } from './poses/poseMath';

export interface CompactPoseSpec {
  hipPos?: [number, number, number];
  hips?: [number, number, number];
  spine?: [number, number, number];
  spine1?: [number, number, number];
  neck?: [number, number, number];
  head?: [number, number, number];
  lArm?: [number, number, number];
  lFore?: [number, number, number];
  rArm?: [number, number, number];
  rFore?: [number, number, number];
  lThigh?: [number, number, number];
  lKnee?: number;
  rThigh?: [number, number, number];
  rKnee?: number;
  lFoot?: [number, number, number];
  rFoot?: [number, number, number];
}

export function buildPoseFromSpec(s: CompactPoseSpec): PoseKeyframe {
  return {
    Hips: { rotation: q(...(s.hips || [0, 0, 0])), position: s.hipPos || [0, 0.95, 0] },
    Spine: { rotation: q(...(s.spine || [0, 0, 0])) },
    Spine1: { rotation: q(...(s.spine1 || [0, 0, 0])) },
    Neck: { rotation: q(...(s.neck || [0, 0, 0])) },
    Head: { rotation: q(...(s.head || [0, 0, 0])) },
    LeftShoulder: { rotation: q(0, 0, 0) },
    RightShoulder: { rotation: q(0, 0, 0) },
    LeftArm: { rotation: q(...(s.lArm || [-10, 0, -62])) },
    LeftForeArm: { rotation: q(...(s.lFore || [0, -24, -12])) },
    LeftHand: { rotation: q(0, 0, 0) },
    RightArm: { rotation: q(...(s.rArm || [-10, 0, 62])) },
    RightForeArm: { rotation: q(...(s.rFore || [0, 24, 12])) },
    RightHand: { rotation: q(0, 0, 0) },
    LeftUpLeg: { rotation: q(...(s.lThigh || [0, -5, 5])) },
    LeftLeg: { rotation: q(Math.max(0, s.lKnee ?? 4), 0, 0) },
    LeftFoot: { rotation: q(...(s.lFoot || [6, 0, 0])) },
    RightUpLeg: { rotation: q(...(s.rThigh || [0, 5, -5])) },
    RightLeg: { rotation: q(Math.max(0, s.rKnee ?? 4), 0, 0) },
    RightFoot: { rotation: q(...(s.rFoot || [6, 0, 0])) },
  };
}

export function makeCouplePreset(
  id: string,
  title: string,
  subGroup: string,
  description: string,
  femaleSpec: CompactPoseSpec,
  maleSpec: CompactPoseSpec,
  partnerOffset: [number, number, number],
  partnerRotationY = 0,
  mainOffset: [number, number, number] = [0, 0, 0],
  mainRotationY = 0
): PosePreset {
  return {
    id,
    title,
    category: 'couple',
    subGroup,
    description,
    pose: buildPoseFromSpec(femaleSpec),
    mainOffset,
    mainRotationY,
    partnerPose: buildPoseFromSpec(maleSpec),
    partnerOffset,
    partnerRotationY,
  };
}

export const COUPLE_SUBGROUPS: { id: string; label: string }[] = [
  { id: 'all', label: '전체 커플 (130)' },
  { id: 'couple_standing', label: '기립·벽면·리프트 (10)' },
  { id: 'couple_chair', label: '의자·소파·랩시팅 (10)' },
  { id: 'couple_bed_front', label: '침대 대면·온탑 (10)' },
  { id: 'couple_bed_rear', label: '침대 후면·아치 (10)' },
  { id: 'couple_side_floor', label: '측면·스푼·욕조 (10)' },
  { id: 'couple_acrobatic', label: '고난도 아크로바틱 (10)' },
  { id: 'couple_tantra_deep', label: '탄트라·딥폴딩 (10)' },
  { id: 'couple_bondage_rp', label: '구속·서브미션·SM (10)' },
  { id: 'couple_furniture_special', label: '스윙·폴·특수가구 (10)' },
  { id: 'couple_oral_foreplay', label: '전희·69·스페셜 (10)' },
  { id: 'couple_lounge_corner', label: '소파·코너·딥트위스트 (10)' },
  { id: 'couple_cushion_arch', label: '볼스터·웻지·하이앵글 (10)' },
  { id: 'couple_dynamic_passion', label: '익스트림·파워리프트 (10)' },
];
