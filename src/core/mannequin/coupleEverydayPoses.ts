import { PosePreset } from '@/types';
import { makeCouplePreset, CompactPoseSpec } from './couplePoseBuilder';

type Row = [string, string, CompactPoseSpec, CompactPoseSpec, [number, number, number], number?];

const rows: Row[] = [
  ['나란히 손잡고 서기', '두 사람이 나란히 서서 안쪽 손을 잡는 자세', { rArm: [-42, -12, 35], rFore: [0, 58, 18] }, { lArm: [-42, 12, -35], lFore: [0, -58, -18] }, [0.55, 0, 0]],
  ['나란히 걷기', '나란히 한 발씩 앞으로 내디디며 걷는 자세', { lThigh: [-26, -8, 8], lKnee: 30, rThigh: [18, 8, -8], rKnee: 14, rArm: [20, -10, 45] }, { lThigh: [18, -8, 8], lKnee: 14, rThigh: [-26, 8, -8], rKnee: 30, lArm: [20, 10, -45] }, [0.56, 0, -0.08]],
  ['어깨에 팔 두르기', '한 사람이 다른 사람 어깨에 팔을 둘러 나란히 선 자세', { rArm: [-56, -20, 18], rFore: [0, 68, 12] }, { lArm: [-88, 20, -18], lFore: [0, -72, -14] }, [0.51, 0, 0]],
  ['등 맞대고 서기', '서로 등을 맞대고 바깥을 바라보는 자세', { lArm: [8, -10, -56], rArm: [8, 10, 56] }, { lArm: [8, -10, -56], rArm: [8, 10, 56] }, [0, 0, -0.42], Math.PI],
  ['마주 보고 인사하기', '마주 서서 상체를 가볍게 숙여 인사하는 자세', { hips: [8, 0, 0], spine: [12, 0, 0], lArm: [8, -10, -52], rArm: [8, 10, 52] }, { hips: [8, 0, 0], spine: [12, 0, 0], lArm: [8, -10, -52], rArm: [8, 10, 52] }, [0, 0, 0.84], Math.PI],
  ['마주 보고 손 맞잡기', '두 사람이 마주 서서 두 손을 맞잡는 자세', { lArm: [-58, 12, -34], rArm: [-58, -12, 34], lFore: [0, -54, -18], rFore: [0, 54, 18] }, { lArm: [-58, 12, -34], rArm: [-58, -12, 34], lFore: [0, -54, -18], rFore: [0, 54, 18] }, [0, 0, 0.66], Math.PI],
  ['나란히 바닥에 앉기', '두 사람이 나란히 바닥에 앉아 다리를 앞으로 뻗는 자세', { hips: [-18, 0, 0], lThigh: [-78, -10, 10], lKnee: 10, rThigh: [-78, 10, -10], rKnee: 10 }, { hips: [-18, 0, 0], lThigh: [-78, -10, 10], lKnee: 10, rThigh: [-78, 10, -10], rKnee: 10 }, [0.58, 0, 0]],
  ['나란히 양반다리', '두 사람이 나란히 양반다리로 앉은 자세', { hips: [-12, 0, 0], lThigh: [-78, -42, 38], lKnee: 110, rThigh: [-78, 42, -38], rKnee: 110 }, { hips: [-12, 0, 0], lThigh: [-78, -42, 38], lKnee: 110, rThigh: [-78, 42, -38], rKnee: 110 }, [0.72, 0, 0]],
  ['나란히 기대어 앉기', '두 사람이 나란히 앉아 각자 뒤로 기대는 자세', { hips: [-24, 0, 0], spine: [-14, 0, 0], lThigh: [-80, -10, 10], lKnee: 78, rThigh: [-80, 10, -10], rKnee: 78 }, { hips: [-24, 0, 0], spine: [-14, 0, 0], lThigh: [-80, -10, 10], lKnee: 78, rThigh: [-80, 10, -10], rKnee: 78 }, [0.58, 0, 0]],
  ['함께 한쪽 무릎 꿇기', '두 사람이 나란히 한쪽 무릎을 꿇는 자세', { lThigh: [-78, -12, 10], lKnee: 96, rThigh: [-42, 12, -10], rKnee: 112 }, { lThigh: [-42, -12, 10], lKnee: 112, rThigh: [-78, 12, -10], rKnee: 96 }, [0.62, 0, 0]],
];

export const COUPLE_EVERYDAY_PRESETS: PosePreset[] = rows.map(([title, description, female, male, offset, rotation], index) =>
  makeCouplePreset(`couple-everyday-${String(index + 1).padStart(2, '0')}`, `${131 + index}. ${title}`, 'couple_everyday', description, female, male, offset, rotation ?? 0)
);
