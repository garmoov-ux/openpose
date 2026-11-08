import React, { useState, useMemo, useEffect } from 'react';
import { SceneManager } from '@/core/scene/SceneManager';
import { POSTURES_DATA } from '@/data/themesSolo/posturesTextData';
import { getSoloThemePoseKeyframe } from '@/core/mannequin/poses';
import { POSE_PRESETS, applyPosePreset } from '@/core/mannequin/presets';
import { getMannequinProfile } from '@/core/mannequin/mannequinProfiles';
import { useEditorStore } from '@/stores/useEditorStore';
import { useThemeSoloStore } from '@/stores/useThemeSoloStore';
import { PosePreviewThumbnail } from './PosePreviewThumbnail';
import { CouplePoseAccordion } from './CouplePoseAccordion';
import { User, Search, Dices, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { PosePreset } from '@/types';

interface PresetGalleryProps {
  sceneManager: SceneManager | null;
}

const SOLO_GROUPS = [
  { id: 'glamour_self', label: '섹시·셀프플레이 (20)' },
  { id: 'all', label: '테마 전체 (100)' },
  { id: 'standing', label: '기립 자세 (10)' },
  { id: 'furniture_straddle', label: '의자·소파 착석 (15)' },
  { id: 'lounging', label: '기대어 휴식 (10)' },
  { id: 'seated_m', label: '좌식 다리굽힘 (15)' },
  { id: 'v_split', label: '스트레칭·스플릿 (10)' },
  { id: 'deep_m_squat', label: '깊은 스쿼트 (10)' },
  { id: 'rear_arch', label: '측후면 아치 (10)' },
  { id: 'bolster_ride', label: '쿠션 기대기 (10)' },
  { id: 'high_leg', label: '다리 들기 (10)' },
  { id: 'basic_std', label: '기본·액션 (9)' },
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
  const {
    selectedPostureId,
    setSelectedPostureId,
    activePoseAccordion,
    setActivePoseAccordion,
    activeCouplePresetId,
    setActiveCouplePresetId,
  } = useThemeSoloStore();

  const profile = useMemo(() => getMannequinProfile(currentModelId), [currentModelId]);
  const isYouthModel = profile.outfitProfile === 'youth_casual';

  const [selectedSoloGroup, setSelectedSoloGroup] = useState<string>('glamour_self');
  const [soloSearch, setSoloSearch] = useState('');
  const [activeSoloStdId, setActiveSoloStdId] = useState<string | null>(null);

  useEffect(() => {
    if (isYouthModel) {
      setActivePoseAccordion('solo');
      setSelectedSoloGroup('basic_std');
    }
  }, [isYouthModel, setActivePoseAccordion]);

  const filteredSoloPresets = useMemo(() => {
    if (selectedSoloGroup === 'glamour_self') {
      return POSE_PRESETS.filter((p) => p.category === 'glamour');
    }
    if (selectedSoloGroup === 'basic_std') {
      return POSE_PRESETS.filter(
        (p) => p.category === 'standing' || p.category === 'sitting' || p.category === 'action'
      );
    }
    return [];
  }, [selectedSoloGroup]);

  const filteredSoloPostures = useMemo(() => {
    if (selectedSoloGroup === 'glamour_self' || selectedSoloGroup === 'basic_std') return [];
    const q = soloSearch.trim().toLowerCase();
    return POSTURES_DATA.filter((p) => {
      if (!profile.allowedPostureGroups.includes(p.group)) return false;
      const matchGroup = selectedSoloGroup === 'all' || p.group === selectedSoloGroup;
      const koTitle = formatKoreanPoseTitle(p.labelKo);
      return matchGroup && (!q || koTitle.toLowerCase().includes(q) || String(p.id).includes(q));
    });
  }, [profile.allowedPostureGroups, selectedSoloGroup, soloSearch]);

  const handleApplyCouplePreset = (preset: PosePreset) => {
    setActiveSoloStdId(null);
    setActiveCouplePresetId(preset.id);
    if (!sceneManager) return;
    sceneManager.humanoid.group.position.set(0, 0, 0);
    sceneManager.humanoid.group.rotation.set(0, 0, 0);
    applyPosePreset(sceneManager.humanoid.bones, preset);
    sceneManager.setPartnerGuide(true, preset);
  };

  const handleApplySoloStandard = (preset: PosePreset) => {
    setActiveSoloStdId(preset.id);
    setActiveCouplePresetId(null);
    setActivePoseAccordion('solo');
    if (!sceneManager) return;
    sceneManager.setPartnerGuide(false);
    sceneManager.humanoid.group.position.set(0, 0, 0);
    sceneManager.humanoid.group.rotation.set(0, 0, 0);
    applyPosePreset(sceneManager.humanoid.bones, preset);
  };

  const handleSelectSoloPosture = (postureId: number) => {
    setActiveSoloStdId(null);
    setSelectedPostureId(postureId);
    if (!sceneManager) return;
    sceneManager.setPartnerGuide(false);
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

  const handleSwitchAccordion = (target: 'couple' | 'solo') => {
    setActivePoseAccordion(target);
    if (target === 'couple') {
      const targetPreset =
        POSE_PRESETS.find((p) => p.id === activeCouplePresetId) ||
        POSE_PRESETS.find((p) => p.category === 'couple');
      if (targetPreset) handleApplyCouplePreset(targetPreset);
    } else {
      sceneManager?.setPartnerGuide(false);
    }
  };

  return (
    <div className="block space-y-3 text-xs pb-4">
      {!isYouthModel && (
        <CouplePoseAccordion
          isOpen={activePoseAccordion === 'couple'}
          activeCouplePresetId={activeCouplePresetId}
          onToggleOpen={() => handleSwitchAccordion('couple')}
          onApplyPreset={handleApplyCouplePreset}
        />
      )}

      <div
        className={`rounded-2xl border transition-all overflow-hidden ${
          activePoseAccordion === 'solo' ? 'border-blue-600/90 bg-white shadow-sm' : 'border-zinc-200 bg-zinc-50/80'
        }`}
      >
        <div
          onClick={() => handleSwitchAccordion('solo')}
          className={`w-full px-3.5 py-3 flex items-center justify-between cursor-pointer transition-colors ${
            activePoseAccordion === 'solo' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="font-bold text-xs flex items-center gap-1.5">
                <span>2. 개인 솔로 자세 · 셀프플레이 (129종)</span>
                {activePoseAccordion === 'solo' && (
                  <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-blue-600 text-white font-bold">제어 중</span>
                )}
              </div>
              <p className="text-[10px] text-zinc-400">클릭 시 1인 마네킹 전용 모드로 전환 (파트너 마네킹 자동 숨김)</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {activePoseAccordion === 'solo' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (filteredSoloPresets.length > 0) {
                    handleApplySoloStandard(filteredSoloPresets[Math.floor(Math.random() * filteredSoloPresets.length)]);
                  } else if (filteredSoloPostures.length > 0) {
                    handleSelectSoloPosture(filteredSoloPostures[Math.floor(Math.random() * filteredSoloPostures.length)].id);
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold"
              >
                <Dices className="w-3 h-3" />
                <span>솔로 셔플</span>
              </button>
            )}
            {activePoseAccordion === 'solo' ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
          </div>
        </div>

        {activePoseAccordion === 'solo' && (
          <div className="p-3 space-y-2.5">
            <div className="grid grid-cols-3 gap-1">
              {SOLO_GROUPS.filter(
                (g) =>
                  !isYouthModel ||
                  (g.id !== 'glamour_self' &&
                    (g.id === 'all' || g.id === 'basic_std' || profile.allowedPostureGroups.includes(g.id)))
              ).map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedSoloGroup(g.id)}
                  className={`px-2 py-1.5 rounded-xl text-[10px] font-bold transition-all border truncate ${
                    selectedSoloGroup === g.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {filteredSoloPresets.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 max-h-[420px] overflow-y-auto pr-0.5">
                {filteredSoloPresets.map((preset) => {
                  const isSelected = activeSoloStdId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleApplySoloStandard(preset)}
                      className={`group p-2 rounded-2xl text-[10.5px] font-semibold border transition-all flex flex-col gap-1 items-center ${
                        isSelected
                          ? 'bg-zinc-900 text-white border-pink-500 ring-2 ring-pink-500/25 shadow-sm'
                          : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      <PosePreviewThumbnail customPose={preset.pose} isSelected={isSelected} />
                      <span className="truncate w-full text-center font-bold mt-0.5">
                        {preset.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={soloSearch}
                    onChange={(e) => setSoloSearch(e.target.value)}
                    placeholder="솔로 자세 번호(001), 아치, 스쿼트, 착석 등 검색..."
                    className="w-full bg-zinc-100 text-zinc-900 placeholder-zinc-400 rounded-xl pl-8 pr-3 py-1.5 text-[11px] focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-[420px] overflow-y-auto pr-0.5">
                  {filteredSoloPostures.map((p) => {
                    const isSelected = activeSoloStdId === null && selectedPostureId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectSoloPosture(p.id)}
                        className={`group relative p-2 rounded-2xl text-left transition-all border flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-zinc-900 text-white border-blue-600 ring-2 ring-blue-600/30 shadow-md'
                            : 'bg-white text-zinc-900 border-zinc-200/90 hover:border-zinc-400'
                        }`}
                      >
                        <PosePreviewThumbnail postureId={p.id} isSelected={isSelected} />
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            {String(p.id).padStart(3, '0')}번
                          </span>
                          {isSelected && <Sparkles className="w-3 h-3 text-blue-400" />}
                        </div>
                        <span className="font-bold text-[10.5px] truncate leading-snug">
                          {formatKoreanPoseTitle(p.labelKo)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
