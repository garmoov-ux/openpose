import React, { useState, useMemo } from 'react';
import { SceneManager } from '@/core/scene/SceneManager';
import { POSTURES_DATA } from '@/data/themesSolo/posturesTextData';
import { getSoloThemePoseKeyframe } from '@/core/mannequin/poses';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { PosePreviewThumbnail } from './PosePreviewThumbnail';
import { Bookmark, Search, Check, Dices, UserCheck } from 'lucide-react';
import { PosePreset } from '@/types';

interface PresetGalleryProps {
  sceneManager: SceneManager | null;
}

const GROUPS = [
  { id: 'all', label: '전체 (100)' },
  { id: 'seated_m', label: '좌식 다리굽힘 (15)' },
  { id: 'standing', label: '기립 자세 (10)' },
  { id: 'lounging', label: '기대어 눕기 (10)' },
  { id: 'furniture_straddle', label: '걸터앉기 (15)' },
  { id: 'v_split', label: '다리 벌리기 (10)' },
  { id: 'deep_m_squat', label: '깊은 스쿼트 (10)' },
  { id: 'rear_arch', label: '측후면 아치 (10)' },
  { id: 'bolster_ride', label: '쿠션 기대기 (10)' },
  { id: 'high_leg', label: '다리 들기 (10)' },
];

function formatKoreanPoseTitle(rawLabel: string): string {
  return rawLabel
    .replace(/\[포즈 \d+\]\s*/g, '')
    .replace(/M자/g, '다리굽힘')
    .replace(/V-스플릿/g, '다리벌리기')
    .replace(/딥 M-스쿼트/g, '깊은 스쿼트')
    .replace(/3\/4 캣아치/g, '측후면 아치')
    .replace(/볼스터 라이딩/g, '쿠션 기대기')
    .replace(/하이 레그프롭/g, '다리 들기')
    .replace(/가구 스트래들/g, '걸터앉기')
    .replace(/리클라이닝/g, '기대어 눕기')
    .replace(/#/g, '')
    .trim();
}

export const PresetGallery: React.FC<PresetGalleryProps> = ({ sceneManager }) => {
  const { selectedPostureId, setSelectedPostureId } = useThemeSoloStore();
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStandardId, setActiveStandardId] = useState<string | null>('default-stand');

  const filteredPostures = useMemo(() => {
    return POSTURES_DATA.filter((p) => {
      const matchGroup = selectedGroup === 'all' || p.group === selectedGroup;
      const koTitle = formatKoreanPoseTitle(p.labelKo);
      const matchQuery =
        !searchQuery.trim() ||
        koTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.id).includes(searchQuery.trim());
      return matchGroup && matchQuery;
    });
  }, [selectedGroup, searchQuery]);

  const handleApplyStandardPreset = (preset: PosePreset) => {
    setActiveStandardId(preset.id);
    if (!sceneManager) return;
    applyPosePreset(sceneManager.humanoid.bones, preset);
  };

  const handleSelectPosture = (postureId: number) => {
    setActiveStandardId(null);
    setSelectedPostureId(postureId);
    if (!sceneManager) return;

    const poseKeyframe = getSoloThemePoseKeyframe(postureId);
    const postureData = POSTURES_DATA.find((p) => p.id === postureId);

    if (poseKeyframe) {
      applyPosePreset(sceneManager.humanoid.bones, {
        id: `theme-pose-${postureId}`,
        title: postureData?.labelKo || `포즈 ${postureId}`,
        category: 'action',
        description: postureData?.coreText || '',
        pose: poseKeyframe,
      });
    }
  };

  const handleRollRandom = () => {
    const randomId = Math.floor(Math.random() * POSTURES_DATA.length) + 1;
    handleSelectPosture(randomId);
  };

  return (
    <div className="block space-y-3 text-xs">
      {/* 1. 기본 6대 표준 동작 빠른 미리보기 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 font-bold text-zinc-900 text-xs tracking-tight">
          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>기본 표준 자세 (6종)</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {POSE_PRESETS.map((preset) => {
            const isSelected = activeStandardId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyStandardPreset(preset)}
                className={`group p-1.5 rounded-2xl text-[11px] font-semibold border transition-all flex flex-col gap-1 items-center ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-blue-600 ring-2 ring-blue-600/25 shadow-sm'
                    : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <PosePreviewThumbnail customPose={preset.pose} isSelected={isSelected} />
                <span className="truncate w-full text-center py-0.5">{preset.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 100종 다이나믹 포즈 프리뷰 */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
        <div className="flex items-center gap-1.5 font-bold text-zinc-900 text-xs tracking-tight">
          <Bookmark className="w-3.5 h-3.5 text-blue-600" />
          <span>100종 프리미엄 자세 미리보기</span>
        </div>
        <button
          onClick={handleRollRandom}
          className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold rounded-full transition-colors active:scale-95"
          title="무작위 자세 즉시 적용"
        >
          <Dices className="w-3.5 h-3.5 text-blue-600" />
          <span>무작위 추천</span>
        </button>
      </div>

      {/* 검색창 */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="자세 번호(001), 좌식, 기립, 스쿼트 등 검색..."
          className="w-full bg-zinc-100 text-zinc-900 placeholder-zinc-400 rounded-2xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap items-center gap-1">
        {GROUPS.map((g) => {
          const isActive = selectedGroup === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      {/* 포즈 2열 비주얼 그리드 (내부 높이 제한 제거) */}
      <div className="grid grid-cols-2 gap-2.5 pb-4">
        {filteredPostures.map((p) => {
          const isSelected = activeStandardId === null && selectedPostureId === p.id;
          const cleanTitle = formatKoreanPoseTitle(p.labelKo);

          return (
            <button
              key={p.id}
              onClick={() => handleSelectPosture(p.id)}
              className={`group relative p-2 rounded-2xl text-left transition-all border flex flex-col gap-2 ${
                isSelected
                  ? 'bg-zinc-900 text-white border-blue-600 ring-2 ring-blue-600/30 shadow-md'
                  : 'bg-white text-zinc-900 border-zinc-200/90 hover:border-zinc-400 hover:shadow-sm'
              }`}
            >
              {/* 스켈레톤 프리뷰 썸네일 */}
              <PosePreviewThumbnail postureId={p.id} isSelected={isSelected} />

              {/* 하단 메타 정보 */}
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    {String(p.id).padStart(3, '0')}번
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <span className="font-bold text-[11px] truncate mt-0.5 leading-snug">
                  {cleanTitle}
                </span>
                <span
                  className={`text-[10px] truncate ${
                    isSelected ? 'text-zinc-400' : 'text-zinc-500'
                  }`}
                >
                  권장 거리 {p.cameraDistance.toFixed(1)}미터 · 화각 {p.fov}도
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
