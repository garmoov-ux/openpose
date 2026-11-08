import React, { useState, useMemo, useEffect } from 'react';
import { SceneManager } from '@/core/scene/SceneManager';
import { POSTURES_DATA } from '@/data/themesSolo/posturesTextData';
import { getSoloThemePoseKeyframe } from '@/core/mannequin/poses';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';
import { getMannequinProfile } from '@/core/mannequin/mannequinProfiles';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { PosePreviewThumbnail } from './PosePreviewThumbnail';
import { Bookmark, Search, Check, Dices, Users } from 'lucide-react';
import { PosePreset } from '@/types';

interface PresetGalleryProps {
  sceneManager: SceneManager | null;
}

const ALL_GROUPS = [
  { id: 'all', label: '전체 추천' },
  { id: 'standing', label: '기립 자세 (10)' },
  { id: 'furniture_straddle', label: '의자·소파 착석 (15)' },
  { id: 'lounging', label: '기대어 휴식 (10)' },
  { id: 'seated_m', label: '좌식 다리굽힘 (15)' },
  { id: 'v_split', label: '스트레칭 (10)' },
  { id: 'deep_m_squat', label: '깊은 스쿼트 (10)' },
  { id: 'rear_arch', label: '측후면 아치 (10)' },
  { id: 'bolster_ride', label: '쿠션 기대기 (10)' },
  { id: 'high_leg', label: '다리 들기 (10)' },
];

function formatKoreanPoseTitle(rawLabel: string): string {
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

export const PresetGallery: React.FC<PresetGalleryProps> = ({ sceneManager }) => {
  const currentModelId = useEditorStore((s) => s.currentModelId);
  const { selectedPostureId, setSelectedPostureId, showPartnerGuide, setShowPartnerGuide } = useThemeSoloStore();
  const profile = useMemo(() => getMannequinProfile(currentModelId), [currentModelId]);
  const [presetTab, setPresetTab] = useState<'all' | 'glamour' | 'couple' | 'basic'>('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStandardId, setActiveStandardId] = useState<string | null>(profile.defaultStandardPoseId);

  useEffect(() => {
    setActiveStandardId(profile.defaultStandardPoseId);
    setSelectedGroup('all');
  }, [profile.defaultStandardPoseId]);

  const filteredTopPresets = useMemo(() => {
    return POSE_PRESETS.filter((p) => {
      if (profile.outfitProfile === 'youth_casual' && (p.category === 'glamour' || p.category === 'couple')) return false;
      if (presetTab === 'all') return true;
      if (presetTab === 'glamour') return p.category === 'glamour';
      if (presetTab === 'couple') return p.category === 'couple';
      return p.category === 'standing' || p.category === 'sitting' || p.category === 'action';
    });
  }, [presetTab, profile.outfitProfile]);

  const availableGroups = useMemo(
    () => ALL_GROUPS.filter((g) => g.id === 'all' || profile.allowedPostureGroups.includes(g.id)),
    [profile.allowedPostureGroups]
  );

  const filteredPostures = useMemo(() => {
    return POSTURES_DATA.filter((p) => {
      if (!profile.allowedPostureGroups.includes(p.group)) return false;
      const matchGroup = selectedGroup === 'all' || p.group === selectedGroup;
      const koTitle = formatKoreanPoseTitle(p.labelKo);
      const matchQuery =
        !searchQuery.trim() ||
        koTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(p.id).includes(searchQuery.trim());
      return matchGroup && matchQuery;
    });
  }, [profile.allowedPostureGroups, selectedGroup, searchQuery]);

  const handleApplyStandardPreset = (preset: PosePreset) => {
    setActiveStandardId(preset.id);
    if (!sceneManager) return;
    applyPosePreset(sceneManager.humanoid.bones, preset);
    if (preset.category === 'couple') {
      setShowPartnerGuide(true);
      sceneManager.setPartnerGuide(true, preset);
    } else if (!showPartnerGuide) {
      sceneManager.setPartnerGuide(false);
    }
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
    if (filteredPostures.length === 0) return;
    const rand = filteredPostures[Math.floor(Math.random() * filteredPostures.length)];
    handleSelectPosture(rand.id);
  };

  return (
    <div className="block space-y-3.5 text-xs">
      {/* 1. 화보 · 글래머 · 커플 듀오 · 표준 프리셋 (3열 그리드) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-zinc-900 text-xs tracking-tight">
            <Users className="w-4 h-4 text-rose-600" />
            <span>화보 · 글래머 · 커플 듀오 · 표준 프리셋 (3열)</span>
          </div>
          <button
            onClick={() => {
              const next = !showPartnerGuide;
              setShowPartnerGuide(next);
              sceneManager?.setPartnerGuide(next);
            }}
            className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-all ${
              showPartnerGuide
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {showPartnerGuide ? '파트너 표시 중' : '커플 파트너 ON'}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'all', label: '전체' },
            { id: 'glamour', label: '화보·글래머' },
            { id: 'couple', label: '커플·듀오' },
            { id: 'basic', label: '기본·액션' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPresetTab(tab.id as typeof presetTab)}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
                presetTab === tab.id
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {filteredTopPresets.map((preset) => {
            const isSelected = activeStandardId === preset.id;
            const isCouple = preset.category === 'couple';
            const isGlamour = preset.category === 'glamour';
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyStandardPreset(preset)}
                className={`group p-2 rounded-2xl text-[11px] font-semibold border transition-all flex flex-col gap-1 items-center ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-blue-600 ring-2 ring-blue-600/25 shadow-sm'
                    : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <PosePreviewThumbnail customPose={preset.pose} isSelected={isSelected} />
                <div className="flex items-center justify-between w-full px-0.5 mt-0.5">
                  <span
                    className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
                      isCouple
                        ? 'bg-rose-500/20 text-rose-500'
                        : isGlamour
                          ? 'bg-pink-500/20 text-pink-500'
                          : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {isCouple ? '커플듀오' : isGlamour ? '글래머' : '표준'}
                  </span>
                </div>
                <span className="truncate w-full text-center font-bold">{preset.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 마네킹 맞춤 테마 자세 카탈로그 (3열 그리드) */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
        <div className="flex items-center gap-1.5 font-bold text-zinc-900 text-xs tracking-tight">
          <Bookmark className="w-4 h-4 text-blue-600" />
          <span>세부 테마 자세 라이브러리 ({filteredPostures.length}종)</span>
        </div>
        <button
          onClick={handleRollRandom}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold rounded-full transition-colors active:scale-95"
        >
          <Dices className="w-3.5 h-3.5 text-blue-600" />
          <span>자세 랜덤</span>
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="자세 번호(001), 아치, 스쿼트, 착석 등 검색..."
          className="w-full bg-zinc-100 text-zinc-900 placeholder-zinc-400 rounded-2xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {availableGroups.map((g) => {
          const isActive = selectedGroup === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
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

      <div className="grid grid-cols-3 gap-2.5 pb-4">
        {filteredPostures.map((p) => {
          const isSelected = activeStandardId === null && selectedPostureId === p.id;
          const cleanTitle = formatKoreanPoseTitle(p.labelKo);

          return (
            <button
              key={p.id}
              onClick={() => handleSelectPosture(p.id)}
              className={`group relative p-2 rounded-2xl text-left transition-all border flex flex-col gap-1.5 ${
                isSelected
                  ? 'bg-zinc-900 text-white border-blue-600 ring-2 ring-blue-600/30 shadow-md'
                  : 'bg-white text-zinc-900 border-zinc-200/90 hover:border-zinc-400 hover:shadow-sm'
              }`}
            >
              <PosePreviewThumbnail postureId={p.id} isSelected={isSelected} />

              <div className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
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
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
