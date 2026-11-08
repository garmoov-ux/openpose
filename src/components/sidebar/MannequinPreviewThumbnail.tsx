import React from 'react';
import { MannequinModelId } from '@/types';

interface MannequinPreviewThumbnailProps {
  modelId: MannequinModelId;
  isSelected?: boolean;
}

interface Proportions {
  scaleY: number;
  headR: number;
  shoulderW: number;
  waistW: number;
  hipW: number;
  legLen: number;
  armW: number;
  accentColor: string;
}

const MODEL_PROPORTIONS: Record<MannequinModelId, Proportions> = {
  realistic_woman: { scaleY: 0.92, headR: 7.5, shoulderW: 15, waistW: 10.5, hipW: 15, legLen: 36, armW: 3.4, accentColor: '#38bdf8' },
  realistic_muscular_male: { scaleY: 0.98, headR: 7.8, shoulderW: 21, waistW: 14, hipW: 14.5, legLen: 37, armW: 5.2, accentColor: '#60a5fa' },
  anime_female: { scaleY: 0.9, headR: 8.2, shoulderW: 13.5, waistW: 9.2, hipW: 13.8, legLen: 37, armW: 2.8, accentColor: '#f472b6' },
  anime_basic_male: { scaleY: 0.94, headR: 8.0, shoulderW: 17.5, waistW: 12.5, hipW: 13.2, legLen: 37, armW: 3.6, accentColor: '#818cf8' },
  child_toddler: { scaleY: 0.62, headR: 11.5, shoulderW: 12, waistW: 11, hipW: 11.5, legLen: 19, armW: 3.4, accentColor: '#fbbf24' },
  child_elementary: { scaleY: 0.76, headR: 9.8, shoulderW: 13.5, waistW: 11, hipW: 12, legLen: 26, armW: 3.2, accentColor: '#34d399' },
  teen_girl: { scaleY: 0.84, headR: 8.4, shoulderW: 13, waistW: 9.5, hipW: 13, legLen: 33, armW: 2.9, accentColor: '#f472b6' },
  teen_boy: { scaleY: 0.88, headR: 8.5, shoulderW: 15.5, waistW: 11.5, hipW: 12.5, legLen: 34, armW: 3.3, accentColor: '#60a5fa' },
  elderly_grandpa: { scaleY: 0.86, headR: 8.5, shoulderW: 16.5, waistW: 14.5, hipW: 14, legLen: 31, armW: 3.6, accentColor: '#94a3b8' },
  elderly_grandma: { scaleY: 0.81, headR: 8.6, shoulderW: 14.5, waistW: 13.8, hipW: 14.8, legLen: 29, armW: 3.4, accentColor: '#cbd5e1' },
  plus_size_body: { scaleY: 0.91, headR: 7.8, shoulderW: 17.5, waistW: 16.5, hipW: 19.5, legLen: 35, armW: 4.8, accentColor: '#fb7185' },
  heroic_tall: { scaleY: 1.04, headR: 6.8, shoulderW: 20, waistW: 13, hipW: 14, legLen: 41, armW: 4.4, accentColor: '#a78bfa' },
  chibi_male: { scaleY: 0.58, headR: 13.5, shoulderW: 11.5, waistW: 10.5, hipW: 11, legLen: 16, armW: 3.5, accentColor: '#2dd4bf' },
  male_mannequin: { scaleY: 0.93, headR: 7.6, shoulderW: 17, waistW: 12.5, hipW: 13.5, legLen: 36, armW: 3.6, accentColor: '#e2e8f0' },
  procedural: { scaleY: 0.93, headR: 7.6, shoulderW: 16.5, waistW: 12, hipW: 13.5, legLen: 36, armW: 3.5, accentColor: '#38bdf8' },
};

export const MannequinPreviewThumbnail: React.FC<MannequinPreviewThumbnailProps> = React.memo(
  ({ modelId, isSelected = false }) => {
    const p = MODEL_PROPORTIONS[modelId] || MODEL_PROPORTIONS.realistic_woman;
    const footY = 90;
    const hipY = footY - p.legLen;
    const torsoH = 26 * p.scaleY;
    const shoulderY = hipY - torsoH;
    const headY = shoulderY - p.headR - 3;

    return (
      <div className="relative w-full aspect-[4/3] bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-800/80 group-hover:border-zinc-600 transition-colors">
        {/* 신장 눈금 가이드라인 */}
        <div className="absolute inset-0 flex flex-col justify-between py-2 px-2 pointer-events-none opacity-25">
          <div className="border-b border-dashed border-zinc-600 text-[7px] text-zinc-400">190</div>
          <div className="border-b border-dashed border-zinc-600 text-[7px] text-zinc-400">150</div>
          <div className="border-b border-dashed border-zinc-600 text-[7px] text-zinc-400">100</div>
          <div className="border-b border-zinc-500 text-[7px] text-zinc-400">0cm</div>
        </div>

        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
          {/* 몸통 실루엣 */}
          <polygon
            points={`${50 - p.shoulderW},${shoulderY} ${50 + p.shoulderW},${shoulderY} ${50 + p.waistW},${(shoulderY + hipY) / 2} ${50 + p.hipW},${hipY} ${50 - p.hipW},${hipY} ${50 - p.waistW},${(shoulderY + hipY) / 2}`}
            fill={isSelected ? p.accentColor : '#e2e8f0'}
            fillOpacity={isSelected ? 0.88 : 0.78}
          />

          {/* 양팔 */}
          <line
            x1={50 - p.shoulderW - 1}
            y1={shoulderY + 2}
            x2={50 - p.shoulderW - 5}
            y2={hipY + 3}
            stroke={isSelected ? p.accentColor : '#cbd5e1'}
            strokeWidth={p.armW}
            strokeLinecap="round"
          />
          <line
            x1={50 + p.shoulderW + 1}
            y1={shoulderY + 2}
            x2={50 + p.shoulderW + 5}
            y2={hipY + 3}
            stroke={isSelected ? p.accentColor : '#cbd5e1'}
            strokeWidth={p.armW}
            strokeLinecap="round"
          />

          {/* 양다리 */}
          <line
            x1={50 - p.hipW * 0.55}
            y1={hipY}
            x2={50 - p.hipW * 0.5}
            y2={footY}
            stroke={isSelected ? p.accentColor : '#cbd5e1'}
            strokeWidth={p.armW * 1.25}
            strokeLinecap="round"
          />
          <line
            x1={50 + p.hipW * 0.55}
            y1={hipY}
            x2={50 + p.hipW * 0.5}
            y2={footY}
            stroke={isSelected ? p.accentColor : '#cbd5e1'}
            strokeWidth={p.armW * 1.25}
            strokeLinecap="round"
          />

          {/* 머리 */}
          <circle
            cx="50"
            cy={headY}
            r={p.headR}
            fill={isSelected ? '#ffffff' : '#f1f5f9'}
            stroke={p.accentColor}
            strokeWidth="1.5"
          />

          {/* 중심 관절선 포인트 */}
          <circle cx="50" cy={shoulderY + 2} r="1.8" fill="#0f172a" />
          <circle cx="50" cy={hipY - 1} r="2.2" fill="#0066ff" />
        </svg>
      </div>
    );
  }
);
