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
        className={`w-full px-3.5 py-3 flex items-center justify-between gap-2 transition-colors ${
          isOpen
            ? 'bg-zinc-900 text-white'
            : 'bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800'
        }`}
      >
        <button type="button" onClick={onToggleOpen} aria-expanded={isOpen} aria-controls="couple-pose-list" className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-rose-500">
          <Users className="w-4 h-4 text-rose-400 shrink-0" />
          <div>
            <div className="font-bold text-xs flex items-center gap-1.5">
              <span>두 사람 자세 (140종)</span>
              {isOpen && (
                <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-rose-600 text-white font-bold">
                  제어 중
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-400">
              두 사람의 자세를 함께 고릅니다
            </p>
          </div>
        </button>
        <div className="flex items-center gap-1.5">
          {isOpen && (
            <button
              type="button"
              onClick={() => {
                if (filteredCouplePresets.length > 0) {
                  onApplyPreset(
                    filteredCouplePresets[Math.floor(Math.random() * filteredCouplePresets.length)]
                  );
                }
              }}
              className="flex items-center gap-1 px-2.5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold focus-visible:outline-2 focus-visible:outline-white"
            >
              <Dices className="w-3 h-3" />
              <span>무작위 자세</span>
            </button>
          )}
          <button type="button" onClick={onToggleOpen} aria-label={isOpen ? '두 사람 자세 접기' : '두 사람 자세 펼치기'} className="p-2 focus-visible:outline-2 focus-visible:outline-rose-500">
            {isOpen ? <ChevronUp className="w-4 h-4 text-rose-400" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div id="couple-pose-list" className="p-3 space-y-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={coupleSearch}
              onChange={(e) => setCoupleSearch(e.target.value)}
              placeholder="자세 번호(01~140), 손잡기, 앉기, 리프트 등 검색..."
              aria-label="두 사람 자세 검색"
              className="w-full min-h-10 bg-zinc-100 text-zinc-900 placeholder-zinc-500 rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-1">
            {COUPLE_SUBGROUPS.map((sg) => (
              <button
                key={sg.id}
                onClick={() => setCoupleSubGroup(sg.id)}
                  aria-pressed={coupleSubGroup === sg.id}
                  className={`px-2 py-2 rounded-xl text-xs font-bold transition-all border truncate ${
                  coupleSubGroup === sg.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-400'
                }`}
              >
                {sg.label}
              </button>
            ))}
          </div>

          {filteredCouplePresets.length === 0 && <p role="status" className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-600">찾은 자세가 없습니다. 검색어나 분류를 바꿔 보세요.</p>}
          <div className="grid grid-cols-3 gap-2">
            {filteredCouplePresets.map((preset) => {
              const isSelected = activeCouplePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onApplyPreset(preset)}
                  aria-pressed={isSelected}
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

