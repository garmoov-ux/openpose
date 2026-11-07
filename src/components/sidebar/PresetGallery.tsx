import React, { useState, useMemo } from 'react';
import { SceneManager } from '@/core/scene/SceneManager';
import { POSTURES_DATA } from '@/data/themesSolo/posturesTextData';
import { getSoloThemePoseKeyframe } from '@/core/mannequin/poses';
import { applyPosePreset } from '@/core/mannequin/presets';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { Bookmark, Search, Check, Sparkles, Dices } from 'lucide-react';

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
        p.coreText.toLowerCase().includes(searchQuery.toLowerCase());
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
    <div className="flex flex-col gap-2.5 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-[#141414] text-[13px] tracking-tight">
          <Bookmark className="w-3.5 h-3.5 text-[#0066ff]" />
          <span>100종 다이나믹 3D 포즈</span>
        </div>
        <button
          onClick={rollRandomPosture}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#f3f3f3] hover:bg-[#e0e0e0] text-[#141414] font-medium rounded-full transition-colors active:scale-95"
          title="포즈 무작위 추첨"
        >
          <Dices className="w-3.5 h-3.5 text-[#0066ff]" />
          <span>랜덤 포즈</span>
        </button>
      </div>

      {/* 검색창 */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-[#707070] absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="포즈 키워드, M자, 스쿼트, 리클라이닝..."
          className="w-full bg-[#f0f0f0] text-[#141414] placeholder-[#adadad] rounded-[16px] pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#141414]"
        />
      </div>

      {/* 그룹 필터 필 */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {GROUPS.map((g) => {
          const isActive = selectedGroup === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                isActive
                  ? 'bg-[#141414] text-[#ffffff]'
                  : 'bg-[#f3f3f3] text-[#707070] hover:text-[#141414] hover:bg-[#e0e0e0]'
              }`}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      {/* 포즈 리스트 (100종) */}
      <div className="grid grid-cols-1 gap-2 max-h-[280px] overflow-y-auto pr-1">
        {filteredPostures.map((p) => {
          const isSelected = selectedPostureId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectPosture(p.id)}
              className={`p-2.5 rounded-[16px] text-left transition-all border flex items-start justify-between gap-2 ${
                isSelected
                  ? 'bg-[#141414] text-[#ffffff] border-[#141414]'
                  : 'bg-[#ffffff] text-[#141414] border-[#e0e0e0] hover:bg-[#f3f3f3]'
              }`}
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-[#262626] text-[#ffffff]' : 'bg-[#f0f0f0] text-[#707070]'
                    }`}
                  >
                    #{String(p.id).padStart(3, '0')}
                  </span>
                  <span className="font-semibold text-[11px] truncate">{p.labelKo}</span>
                </div>
                <p
                  className={`text-[10px] line-clamp-2 leading-relaxed ${
                    isSelected ? 'text-[#adadad]' : 'text-[#707070]'
                  }`}
                >
                  {p.coreText}
                </p>
              </div>
              {isSelected ? (
                <div className="p-1 rounded-full bg-[#0066ff] text-[#ffffff] flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
              ) : (
                <Sparkles className="w-3 h-3 text-[#adadad] flex-shrink-0 mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
