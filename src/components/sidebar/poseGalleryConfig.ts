import { SOLO_EXTRA_SUBGROUPS } from '@/core/mannequin/coupleAndGlamourPoses';

export const GLAMOUR_GROUP_IDS = new Set(SOLO_EXTRA_SUBGROUPS.map((group) => group.id));

export const SOLO_GROUPS = [
  ...SOLO_EXTRA_SUBGROUPS,
  { id: 'all', label: '테마 기본 (100)' },
  { id: 'standing', label: '서기 (10)' },
  { id: 'furniture_straddle', label: '의자에 앉기 (15)' },
  { id: 'lounging', label: '기대어 쉬기 (10)' },
  { id: 'seated_m', label: '바닥에 앉기 (15)' },
  { id: 'v_split', label: '스트레칭 (10)' },
  { id: 'deep_m_squat', label: '쪼그려 앉기 (10)' },
  { id: 'rear_arch', label: '몸 뒤로 젖히기 (10)' },
  { id: 'bolster_ride', label: '쿠션에 기대기 (10)' },
  { id: 'high_leg', label: '다리 들기 (10)' },
  { id: 'basic_std', label: '기본·동작 (9)' },
  { id: 'solo_everyday', label: '일상 자세 (36)' },
];

export function formatKoreanPoseTitle(rawLabel: string): string {
  return rawLabel
    .replace(/\[포즈 \d+\]\s*/g, '')
    .replace(/M자/g, '다리굽힘')
    .replace(/V-스플릿/g, '스트레칭')
    .replace(/딥 M-스쿼트/g, '깊은 스쿼트')
    .replace(/3\/4 캣아치/g, '측후면 아치')
    .replace(/볼스터 라이딩/g, '쿠션 기대기')
    .replace(/하이 레그프롭/g, '다리 들기')
    .replace(/가구 스트래들/g, '의자 착석')
    .replace(/리클라이닝/g, '기대어 휴식')
    .replace(/#/g, '')
    .trim();
}
