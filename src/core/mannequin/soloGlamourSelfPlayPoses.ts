import { PosePreset } from '@/types';
import { buildPoseFromSpec } from './couplePoseBuilder';

// 화보 · 글래머 · 셀프플레이(자위기구/페티시 활용) 솔로 프리셋 (20종)
export const SOLO_GLAMOUR_SELF_PLAY_PRESETS: PosePreset[] = [
  {
    id: 'glamour-s-curve-arch',
    title: '01. S라인 하이힐 백아치',
    category: 'glamour',
    description: '골반을 측후방으로 밀어내고 허리를 깊게 아치로 휜 S라인 화보 포즈',
    pose: buildPoseFromSpec({
      hips: [10, 18, -10], spine: [-14, -10, 8], spine1: [-12, -8, 6], neck: [6, 14, -5], head: [5, 18, -4],
      lArm: [-18, -12, -48], lFore: [0, -55, -24], rArm: [14, 18, 52], rFore: [0, 68, 30],
      lThigh: [-10, -8, 8], lKnee: 16, rThigh: [8, 6, -6], rKnee: 4, lFoot: [24, 0, 0], rFoot: [22, 0, 0],
    }),
  },
  {
    id: 'glamour-kneeling-bed-arch',
    title: '02. 베드 닐링 아치 포즈',
    category: 'glamour',
    description: '침대나 소파 위에 무릎을 꿇고 상체를 세워 흉곽과 골반 곡선을 강조하는 포즈',
    pose: buildPoseFromSpec({
      hipPos: [0, 0.56, 0], hips: [14, 0, 0], spine: [-18, 0, 0], spine1: [-14, 0, 0], neck: [-8, 0, 0], head: [-6, 8, 0],
      lArm: [18, -15, -42], lFore: [0, -72, -32], rArm: [18, 15, 42], rFore: [0, 72, 32],
      lThigh: [-28, -14, 14], lKnee: 118, rThigh: [-28, 14, -14], rKnee: 118, lFoot: [35, 0, 0], rFoot: [35, 0, 0],
    }),
  },
  {
    id: 'glamour-chair-cross-leg',
    title: '03. 벨벳 체어 크로스레그',
    category: 'glamour',
    description: '라운지 의자에 앉아 다리를 길게 꼬고 상체를 살짝 숙인 하이패션 착석 포즈',
    pose: buildPoseFromSpec({
      hipPos: [0, 0.54, -0.18], hips: [-8, -10, 4], spine: [8, 6, -3], spine1: [10, 6, 0], neck: [-8, -8, 0], head: [-5, -10, 4],
      lArm: [-24, 10, -52], lFore: [0, -42, -18], rArm: [-28, -14, 48], rFore: [0, 58, 24],
      lThigh: [-82, 12, -8], lKnee: 76, rThigh: [-68, -8, 6], rKnee: 84, lFoot: [28, 0, 0], rFoot: [18, 0, 0],
    }),
  },
  {
    id: 'glamour-over-shoulder-back',
    title: '04. 오버숄더 백미러 포즈',
    category: 'glamour',
    description: '등과 힙 라인을 보여주며 어깨 너머로 시선을 돌리는 백사이드 화보 포즈',
    pose: buildPoseFromSpec({
      hips: [12, -32, 8], spine: [-10, 14, -5], spine1: [-8, 18, -4], neck: [5, 28, -6], head: [6, 32, -5],
      lArm: [10, -14, -56], lFore: [0, -48, -20], rArm: [-18, 20, 46], rFore: [0, 64, 28],
      lThigh: [-14, -6, 6], lKnee: 22, rThigh: [6, 5, -5], rKnee: 4, lFoot: [25, 0, 0], rFoot: [20, 0, 0],
    }),
  },
  {
    id: 'glamour-sunbed-recline',
    title: '05. 선베드 리클라인 포즈',
    category: 'glamour',
    description: '선베드나 카바나에 비스듬히 기대어 한쪽 무릎을 세운 리조트 비치웨어 포즈',
    pose: buildPoseFromSpec({
      hipPos: [0, 0.36, -0.1], hips: [-32, 10, -4], spine: [-12, -6, 3], spine1: [-8, -5, 0], neck: [16, 8, 0], head: [14, 10, 0],
      lArm: [28, -10, -44], lFore: [0, -35, -14], rArm: [-24, 15, 50], rFore: [0, 52, 22],
      lThigh: [-58, -12, 12], lKnee: 78, rThigh: [-18, 8, -6], rKnee: 16, lFoot: [24, 0, 0], rFoot: [28, 0, 0],
    }),
  },
  {
    id: 'glamour-wide-floor-arch',
    title: '06. 와이드 플로어 아치',
    category: 'glamour',
    description: '바닥이나 침대 위에서 다리를 넓게 벌리고 상체를 아치형으로 젖힌 하이텐션 포즈',
    pose: buildPoseFromSpec({
      hipPos: [0, 0.44, 0], hips: [-16, 0, 0], spine: [-16, 0, 0], spine1: [-14, 0, 0], neck: [-10, 0, 0], head: [-8, 0, 0],
      lArm: [24, -12, -46], lFore: [0, -28, -12], rArm: [24, 12, 46], rFore: [0, 28, 12],
      lThigh: [-64, -26, 26], lKnee: 92, rThigh: [-64, 26, -26], rKnee: 92, lFoot: [30, 0, 0], rFoot: [30, 0, 0],
    }),
  },
  {
    id: 'solo-self-magic-wand-recline',
    title: '07. [셀프] 매직완드 M-레그 리클라인',
    category: 'glamour',
    description: '침대에 기대어 양다리를 M자로 넓게 벌리고 오른손으로 매직완드 기구를 골반에 밀착하는 셀프 플레이',
    pose: buildPoseFromSpec({
      hips: [-46, 0, 0], spine: [-12, 0, 0], spine1: [-8, 0, 0], head: [18, 0, 0],
      lArm: [20, -14, -46], lFore: [0, -42, -18], rArm: [-28, -24, 34], rFore: [0, 68, 28],
      lThigh: [-84, -36, 36], lKnee: 96, rThigh: [-84, 36, -36], rKnee: 96,
    }),
  },
  {
    id: 'solo-self-deep-m-squat-touch',
    title: '08. [셀프] 딥 M-스쿼트 플로어 마운트',
    category: 'glamour',
    description: '플로어 딜도 마운트 위에서 깊은 M자 스쿼트로 다리를 벌리고 양손으로 허벅지와 가슴을 터치하는 자세',
    pose: buildPoseFromSpec({
      hips: [24, 0, 0], spine: [-18, 0, 0], spine1: [-16, 0, 0], head: [-14, 6, 0],
      lArm: [-32, 18, -42], lFore: [0, -68, -28], rArm: [-28, -22, 34], rFore: [0, 64, 26],
      lThigh: [-106, -38, 38], lKnee: 124, rThigh: [-106, 38, -38], rKnee: 124,
    }),
  },
  {
    id: 'solo-self-saddle-machine-ride',
    title: '09. [셀프] 전동 새들 머신 하이아치 라이딩',
    category: 'glamour',
    description: '전동 새들 라이딩 머신 위에 올라타 무릎을 꿇고 상체와 목을 뒤로 깊게 젖힌 엑스터시 라이딩 자세',
    pose: buildPoseFromSpec({
      hips: [16, 0, 0], spine: [-24, 0, 0], spine1: [-22, 0, 0], head: [-28, 0, 0],
      lArm: [-36, 16, -42], lFore: [0, -54, -22], rArm: [-36, -16, 42], rFore: [0, 54, 22],
      lThigh: [-48, -34, 34], lKnee: 116, rThigh: [-48, 34, -34], rKnee: 116,
    }),
  },
  {
    id: 'solo-self-cat-arch-plug-show',
    title: '10. [셀프] 딥 캣아치 플러그·폭스테일 강조',
    category: 'glamour',
    description: '가슴과 어깨를 바닥에 낮게 밀착하고 골반을 높게 세워 주얼 플러그·폭스테일과 힙 라인을 강조하는 자세',
    pose: buildPoseFromSpec({
      hips: [68, 0, 0], spine: [-28, 0, 0], spine1: [-26, 0, 0], head: [-32, 16, 0],
      lArm: [-72, 14, -32], lFore: [0, -64, -26], rArm: [24, 18, 36], rFore: [0, 62, 26],
      lThigh: [-18, -24, 24], lKnee: 106, rThigh: [-18, 24, -24], rKnee: 106,
    }),
  },
  {
    id: 'solo-self-side-curl-egg-vibe',
    title: '11. [셀프] 사이드 라잉 에그 바이브 컬',
    category: 'glamour',
    description: '옆으로 누워 한쪽 다리를 높게 들고 무선 에그 바이브레이터의 자극에 몸을 아치로 마는 자세',
    pose: buildPoseFromSpec({
      hips: [12, 0, 68], spine: [-12, 0, 8], spine1: [-10, 0, 6], head: [-14, 14, 0],
      lArm: [-36, 18, -40], lFore: [0, -64, -26], rArm: [-24, -22, 34], rFore: [0, 66, 28],
      lThigh: [-84, -28, 28], lKnee: 76, rThigh: [-32, 12, -12], rKnee: 46,
    }),
  },
  {
    id: 'solo-self-legs-up-wall-dildo',
    title: '12. [셀프] 양다리 V-업 셀프 딜도 플레이',
    category: 'glamour',
    description: '등을 대고 누워 양다리를 공중으로 높게 V자로 뻗어 올리고 양손으로 기구를 컨트롤하는 자세',
    pose: buildPoseFromSpec({
      hips: [-58, 0, 0], spine: [-10, 0, 0], spine1: [-8, 0, 0], head: [20, 0, 0],
      lArm: [-38, 18, -38], lFore: [0, -62, -26], rArm: [-32, -22, 34], rFore: [0, 68, 28],
      lThigh: [-112, -32, 32], lKnee: 14, rThigh: [-112, 32, -32], rKnee: 14,
    }),
  },
  {
    id: 'solo-self-standing-mirror-touch',
    title: '13. [셀프] 스탠딩 원레그업 셀프 터치',
    category: 'glamour',
    description: '전신 거울 앞에서 한쪽 다리를 의자/스툴 위에 높게 올리고 가슴과 골반을 동시에 터치하는 기립 자세',
    pose: buildPoseFromSpec({
      hips: [10, -10, 6], spine: [-14, 8, 0], spine1: [-12, 6, 0], head: [-8, 12, 0],
      lArm: [-38, 22, -38], lFore: [0, -76, -32], rArm: [-24, -24, 34], rFore: [0, 62, 26],
      lThigh: [-82, -24, 24], lKnee: 84, rThigh: [6, 8, -8], rKnee: 8,
    }),
  },
  {
    id: 'solo-self-bolster-straddle-grind',
    title: '14. [셀프] 실크 볼스터 쿠션 스트래들 그라인딩',
    category: 'glamour',
    description: '원통형 실크 볼스터 쿠션 위에 양다리를 벌려 올라타고 상체를 앞으로 숙여 밀착하는 셀프 그라인딩 자세',
    pose: buildPoseFromSpec({
      hips: [32, 0, 0], spine: [-16, 0, 0], spine1: [-14, 0, 0], head: [-16, 8, 0],
      lArm: [-48, 16, -38], lFore: [0, -48, -20], rArm: [-48, -16, 38], rFore: [0, 48, 20],
      lThigh: [-42, -28, 28], lKnee: 114, rThigh: [-42, 28, -28], rKnee: 114,
    }),
  },
  {
    id: 'solo-self-backbound-kneel-sub',
    title: '15. [페티시] 뒷손 수갑 결박 닐링 서브미션',
    category: 'glamour',
    description: '양손을 등 뒤로 모으고 무릎을 넓게 벌려 앉아 가슴을 내밀고 올려다보는 BDSM 서브미시브 자세',
    pose: buildPoseFromSpec({
      hips: [18, 0, 0], spine: [-20, 0, 0], spine1: [-18, 0, 0], head: [-24, 10, 0],
      lArm: [36, 24, -24], lFore: [0, -76, -32], rArm: [36, -24, 24], rFore: [0, 76, 32],
      lThigh: [-32, -32, 32], lKnee: 118, rThigh: [-32, 32, -32], rKnee: 118,
    }),
  },
  {
    id: 'solo-self-xframe-bound-arch',
    title: '16. [페티시] X-프레임 양팔 상단 결박 아치',
    category: 'glamour',
    description: '양팔을 머리 위 X-프레임으로 높이 뻗어 올리고 허리와 골반을 S자로 비튼 본디지 기립 포즈',
    pose: buildPoseFromSpec({
      hips: [16, 14, -8], spine: [-18, -10, 6], spine1: [-16, -8, 0], head: [-14, 14, 0],
      lArm: [-138, -22, -26], lFore: [0, -18, -8], rArm: [-138, 22, 26], rFore: [0, 18, 8],
      lThigh: [-14, -18, 18], lKnee: 22, rThigh: [6, 16, -16], rKnee: 8,
    }),
  },
  {
    id: 'solo-self-chair-spread-vibe',
    title: '17. [셀프] 암체어 팔걸이 레그스프레드 바이브',
    category: 'glamour',
    description: '암체어에 깊게 기대어 양다리를 팔걸이 위로 넓게 걸치고 바이브레이터를 사용하는 라운지 셀프 포즈',
    pose: buildPoseFromSpec({
      hips: [-34, 0, 0], spine: [-12, 0, 0], spine1: [-10, 0, 0], head: [-12, 8, 0],
      lArm: [-36, 20, -38], lFore: [0, -72, -30], rArm: [-28, -22, 34], rFore: [0, 66, 28],
      lThigh: [-94, -38, 38], lKnee: 82, rThigh: [-94, 38, -38], rKnee: 82,
    }),
  },
  {
    id: 'solo-self-male-stroker-recline',
    title: '18. [남성/공용] 리클라인 오토 스트로커 그립',
    category: 'glamour',
    description: '소파나 침대에 기대앉아 다리를 벌리고 오른손으로 전동 스트로커 챔버를 파지한 남성/공용 셀프 포즈',
    pose: buildPoseFromSpec({
      hips: [-28, 0, 0], spine: [-8, 0, 0], spine1: [-6, 0, 0], head: [14, 0, 0],
      lArm: [18, -14, -46], lFore: [0, -44, -18], rArm: [-26, -22, 36], rFore: [0, 68, 28],
      lThigh: [-72, -24, 24], lKnee: 86, rThigh: [-72, 24, -24], rKnee: 86,
    }),
  },
  {
    id: 'solo-self-bridge-hip-thrust',
    title: '19. [셀프] 플로어 힙쓰러스트 브릿지 터치',
    category: 'glamour',
    description: '어깨를 바닥에 대고 골반을 높게 들어 올린 브릿지 상태에서 양손으로 골반과 기구를 지지하는 자세',
    pose: buildPoseFromSpec({
      hips: [-48, 0, 0], spine: [-24, 0, 0], spine1: [-22, 0, 0], head: [22, 0, 0],
      lArm: [16, -18, -42], lFore: [0, -56, -24], rArm: [-24, -22, 36], rFore: [0, 64, 26],
      lThigh: [-58, -28, 28], lKnee: 104, rThigh: [-58, 28, -28], rKnee: 104,
    }),
  },
  {
    id: 'solo-self-full-split-forward-arch',
    title: '20. [셀프] 180도 와이드 스플릿 체스트 아치',
    category: 'glamour',
    description: '바닥에서 양다리를 180도 좌우로 완전히 찢고 상체를 아치형으로 세워 유연성과 바디라인을 극대화한 자세',
    pose: buildPoseFromSpec({
      hips: [16, 0, 0], spine: [-20, 0, 0], spine1: [-18, 0, 0], head: [-14, 0, 0],
      lArm: [18, -14, -46], lFore: [0, -38, -16], rArm: [-28, -20, 36], rFore: [0, 62, 26],
      lThigh: [-78, -54, 54], lKnee: 6, rThigh: [-78, 54, -54], rKnee: 6,
    }),
  },
];

