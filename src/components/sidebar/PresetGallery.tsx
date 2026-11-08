import React, { useState, useMemo } from 'react';
import { SceneManager } from '@/core/scene/SceneManager';
import { POSTURES_DATA } from '@/data/themesSolo/posturesTextData';
import { getSoloThemePoseKeyframe } from '@/core/mannequin/poses';
import { applyPosePreset } from '@/core/mannequin/presets';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { PosePreviewThumbnail } from './PosePreviewThumbnail';
import { Bookmark, Search, Check, Dices } from 'lucide-react';

interface PresetGalleryProps {
  sceneManager: SceneManager | null;
}

const GROUPS = [
  { id: 'all', label: '전체 (100)' },
  { id: 'seated_m', label: '좌식 & M자 (15)' },
  { id: 'standing', label: '기립 (10)' },
  { id: 'lounging', label: '리클라이닝 (10)' },
  { id: 'furniture_straddle', label: '가구 스트래들 (15)' },
  { id: 'v_split', label: 'V-스플릿 (10)' },
  { id: 'deep_m_squat', label: '딥 M-스쿼트 (10)' },
  { id: 'rear_arch', label: '3/4 캣아치 (10)' },
  { id: 'bolster_ride', label: '볼스터 라이딩 (10)' },
  { id: 'high_leg', label: '하이 레그프롭 (10)' },
];

export const PresetGallery: React.FC<PresetGalleryProps> = ({ sceneManager }) => {
  const { selectedPostureId, setSelectedPostureId, rollRandomPosture } = useThemeSoloStore();
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPostures = useMemo(() => {
    return POSTURES_DATA.filter((p) => {
      const matchGroup = selectedGroup === 'all' || p.group === selectedGroup;
      const matchQuery =
        !searchQuery.trim() ||
        p.labelKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.id).includes(searchQuery.trim());
      return matchGroup && matchQuery;
    });
  }, [selectedGroup, searchQuery]);

  const handleSelectPosture = (postureId: number) => {
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

    if (postureData) {
      sceneManager.setSoloThemeShot(
        postureData.targetHeight,
        postureData.cameraDistance,
        postureData.fov
      );
    }
  };

  return (
    <div className="flex flex-col gap-3 text-xs">
      {/* 헤더 및 랜덤 추천 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-zinc-900 text-xs tracking-tight">
          <Bookmark className="w-3.5 h-3.5 text-blue-600" />
          <span>100종 프리미엄 3D 포즈 프리뷰</span>
        </div>
        <button
          onClick={rollRandomPosture}
          className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold rounded-full transition-colors active:scale-95"
          title="포즈 무작위 추천"
        >
          <Dices className="w-3.5 h-3.5 text-blue-600" />
          <span>랜덤 추천</span>
        </button>
      </div>

      {/* 검색창 */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="포즈 번호(#001), M자, 스쿼트 등 검색..."
          className="w-full bg-zinc-100 text-zinc-900 placeholder-zinc-400 rounded-2xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>

      {/* 카테고리 필터 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {GROUPS.map((g) => {
          const isActive = selectedGroup === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
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

      {/* 포즈 2열 비주얼 그리드 (PoseMy.Art 스타일) */}
      <div className="grid grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
        {filteredPostures.map((p) => {
          const isSelected = selectedPostureId === p.id;
          const cleanTitle = p.labelKo.replace(/\[포즈 \d+\]\s*/, '');

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
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md font-bold ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    #{String(p.id).padStart(3, '0')}
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
                  카메라 {p.cameraDistance.toFixed(1)}m · {p.fov}도
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
