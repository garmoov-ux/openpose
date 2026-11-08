import React, { useState, useMemo } from 'react';
import { POSE_PRESETS } from '@/core/mannequin/presets';
import { COUPLE_SUBGROUPS } from '@/core/mannequin/coupleAndGlamourPoses';
import { PosePreviewThumbnail } from './PosePreviewThumbnail';
import { Users, Search, Dices, ChevronDown, ChevronUp } from 'lucide-react';
import { PosePreset } from '@/types';

interface CouplePoseAccordionProps {
  isOpen: boolean;
  activeCouplePresetId: string | null;
  onToggleOpen: () => void;
  onApplyPreset: (preset: PosePreset) => void;
}

export const CouplePoseAccordion: React.FC<CouplePoseAccordionProps> = ({
  isOpen,
  activeCouplePresetId,
  onToggleOpen,
  onApplyPreset,
}) => {
  const [coupleSubGroup, setCoupleSubGroup] = useState<string>('all');
  const [coupleSearch, setCoupleSearch] = useState('');

  const filteredCouplePresets = useMemo(() => {
    const q = coupleSearch.trim().toLowerCase();
    return POSE_PRESETS.filter((p) => {
      if (p.category !== 'couple') return false;
      const matchSub = coupleSubGroup === 'all' || p.subGroup === coupleSubGroup;
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchSub && matchQ;
    });
  }, [coupleSubGroup, coupleSearch]);

  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        isOpen
          ? 'border-rose-500/90 bg-white shadow-sm'
          : 'border-zinc-200 bg-zinc-50/80'
      }`}
    >
      <div
        onClick={onToggleOpen}
        className={`w-full px-3.5 py-3 flex items-center justify-between cursor-pointer transition-colors ${
          isOpen
            ? 'bg-zinc-900 text-white'
            : 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-rose-400 shrink-0" />
          <div>
            <div className="font-bold text-xs flex items-center gap-1.5">
              <span>1. 남·여 커플 자세 (140종)</span>
              {isOpen && (
                <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-rose-600 text-white font-bold">
                  제어 중
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400">
              클릭 시 남녀 2인 마네킹 모드로 전환 (개인 자세 자동 해제)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isOpen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (filteredCouplePresets.length > 0) {
                  onApplyPreset(
                    filteredCouplePresets[Math.floor(Math.random() * filteredCouplePresets.length)]
                  );
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold"
            >
              <Dices className="w-3 h-3" />
              <span>체위 셔플</span>
            </button>
          )}
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-rose-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-500" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="p-3 space-y-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={coupleSearch}
              onChange={(e) => setCoupleSearch(e.target.value)}
              placeholder="자세 번호(01~140), 손잡기, 앉기, 리프트 등 검색..."
              className="w-full bg-zinc-100 text-zinc-900 placeholder-zinc-400 rounded-xl pl-8 pr-3 py-1.5 text-[11px] focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-1">
            {COUPLE_SUBGROUPS.map((sg) => (
              <button
                key={sg.id}
                onClick={() => setCoupleSubGroup(sg.id)}
                className={`px-2 py-1.5 rounded-xl text-[10px] font-bold transition-all border truncate ${
                  coupleSubGroup === sg.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                {sg.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 max-h-[420px] overflow-y-auto pr-0.5">
            {filteredCouplePresets.map((preset) => {
              const isSelected = activeCouplePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onApplyPreset(preset)}
                  className={`group p-2 rounded-2xl text-[10.5px] font-semibold border transition-all flex flex-col gap-1 items-center ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-rose-500 ring-2 ring-rose-500/25 shadow-sm'
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
        </div>
      )}
    </div>
  );
};

