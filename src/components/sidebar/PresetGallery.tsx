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
import { GLAMOUR_GROUP_IDS, SOLO_GROUPS, formatKoreanPoseTitle } from './poseGalleryConfig';

interface PresetGalleryProps {
  sceneManager: SceneManager | null;
}

export const PresetGallery: React.FC<PresetGalleryProps> = ({ sceneManager }) => {
  const currentModelId = useEditorStore((s) => s.currentModelId);
  const {
    selectedPostureId, setSelectedPostureId, activePoseAccordion,
    setActivePoseAccordion, activeCouplePresetId, setActiveCouplePresetId,
  } = useThemeSoloStore();

  const profile = useMemo(() => getMannequinProfile(currentModelId), [currentModelId]);
  const isYouthModel = profile.outfitProfile === 'youth_casual';

  const [selectedSoloGroup, setSelectedSoloGroup] = useState<string>('basic_std');
  const [soloSearch, setSoloSearch] = useState('');
  const [activeSoloStdId, setActiveSoloStdId] = useState<string | null>(null);

  useEffect(() => {
    if (isYouthModel) { setActivePoseAccordion('solo'); setSelectedSoloGroup('basic_std'); }
  }, [isYouthModel, setActivePoseAccordion]);

  const filteredSoloPresets = useMemo(() => {
    const q = soloSearch.trim().toLowerCase();
    if (GLAMOUR_GROUP_IDS.has(selectedSoloGroup)) {
      return POSE_PRESETS.filter((p) => {
        if (p.category !== 'glamour') return false;
        const matchSub = selectedSoloGroup === 'solo_all_glamour' || p.subGroup === selectedSoloGroup;
        const matchQ = !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
        return matchSub && matchQ;
      });
    }
    if (selectedSoloGroup === 'solo_everyday') {
      return POSE_PRESETS.filter((p) => p.subGroup === 'solo_everyday' && (!q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)));
    }
    if (selectedSoloGroup === 'basic_std') {
      return POSE_PRESETS.filter(
        (p) =>
          (p.category === 'standing' || p.category === 'sitting' || p.category === 'action') &&
          p.subGroup !== 'solo_everyday' &&
          (!q || p.title.toLowerCase().includes(q))
      );
    }
    return [];
  }, [selectedSoloGroup, soloSearch]);

  const filteredSoloPostures = useMemo(() => {
    if (GLAMOUR_GROUP_IDS.has(selectedSoloGroup) || selectedSoloGroup === 'basic_std') return [];
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
    sceneManager.setPartnerGuide(true, preset);
  };

  const handleApplySoloStandard = (preset: PosePreset) => {
    setActiveSoloStdId(preset.id);
    setActiveCouplePresetId(null);
    setActivePoseAccordion('solo');
    if (!sceneManager) return;
    sceneManager.setPartnerGuide(false);
    useThemeSoloStore.getState().setMainMannequinTransform({ position: preset.mainOffset || [0, 0, 0], rotation: [0, preset.mainRotationY ?? 0, 0], scale: 1 });
    sceneManager.applyMannequinTransform('main', preset.mainOffset || [0, 0, 0], [0, preset.mainRotationY ?? 0, 0], 1);
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
      const targetPreset = POSE_PRESETS.find((p) => p.id === activeCouplePresetId) || POSE_PRESETS.find((p) => p.category === 'couple');
      if (targetPreset) handleApplyCouplePreset(targetPreset);
    } else sceneManager?.setPartnerGuide(false);
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
          className={`w-full px-3.5 py-3 flex items-center justify-between gap-2 transition-colors ${
            activePoseAccordion === 'solo' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800'
          }`}
        >
          <button type="button" onClick={() => handleSwitchAccordion('solo')} aria-expanded={activePoseAccordion === 'solo'} aria-controls="solo-pose-list" className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-blue-500">
            <User className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <div className="font-bold text-xs flex items-center gap-1.5">
                <span>한 사람 자세 (365종)</span>
                {activePoseAccordion === 'solo' && (
                  <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-blue-600 text-white font-bold">제어 중</span>
                )}
              </div>
              <p className="text-[10px] text-zinc-400">한 사람의 자세를 고릅니다</p>
            </div>
          </button>
          <div className="flex items-center gap-1.5">
            {activePoseAccordion === 'solo' && (
              <button
                type="button"
                onClick={() => {
                  if (filteredSoloPresets.length > 0) {
                    handleApplySoloStandard(filteredSoloPresets[Math.floor(Math.random() * filteredSoloPresets.length)]);
                  } else if (filteredSoloPostures.length > 0) {
                    handleSelectSoloPosture(filteredSoloPostures[Math.floor(Math.random() * filteredSoloPostures.length)].id);
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold focus-visible:outline-2 focus-visible:outline-white"
              >
                <Dices className="w-3 h-3" />
                <span>무작위 자세</span>
              </button>
            )}
            <button type="button" onClick={() => handleSwitchAccordion('solo')} aria-label={activePoseAccordion === 'solo' ? '한 사람 자세 접기' : '한 사람 자세 펼치기'} className="p-2 focus-visible:outline-2 focus-visible:outline-blue-500">
              {activePoseAccordion === 'solo' ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
            </button>
          </div>
        </div>

        {activePoseAccordion === 'solo' && (
          <div id="solo-pose-list" className="p-3 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={soloSearch}
                onChange={(e) => setSoloSearch(e.target.value)}
                placeholder="자세 이름 검색"
                aria-label="한 사람 자세 검색"
                className="w-full min-h-10 bg-zinc-100 text-zinc-900 placeholder-zinc-500 rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-1">
              {SOLO_GROUPS.filter(
                (g) =>
                  !isYouthModel ||
                  (!GLAMOUR_GROUP_IDS.has(g.id) &&
                    (g.id === 'all' || g.id === 'basic_std' || g.id === 'solo_everyday' || profile.allowedPostureGroups.includes(g.id)))
              ).map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedSoloGroup(g.id)}
                  aria-pressed={selectedSoloGroup === g.id}
                  className={`px-2 py-2 rounded-xl text-xs font-bold transition-all border truncate ${
                    selectedSoloGroup === g.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {filteredSoloPresets.length === 0 && filteredSoloPostures.length === 0 && <p role="status" className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-600">찾은 자세가 없습니다. 검색어나 분류를 바꿔 보세요.</p>}
            {filteredSoloPresets.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {filteredSoloPresets.map((preset) => {
                  const isSelected = activeSoloStdId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleApplySoloStandard(preset)}
                      aria-pressed={isSelected}
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
              <div className="grid grid-cols-3 gap-2">
                {filteredSoloPostures.map((p) => {
                  const isSelected = activeSoloStdId === null && selectedPostureId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectSoloPosture(p.id)}
                      aria-pressed={isSelected}
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};
