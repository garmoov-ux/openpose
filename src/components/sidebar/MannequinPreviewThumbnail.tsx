import React, { useEffect, useState } from 'react';
import { MannequinModelId } from '@/types';
import { useEditorStore } from '@/stores/useEditorStore';
import {
  getCachedMannequinThumbnail,
  renderMannequinThumbnail,
} from '@/core/mannequin/mannequinThumbnailRenderer';
import { Loader2 } from 'lucide-react';

interface MannequinPreviewThumbnailProps {
  modelId: MannequinModelId;
  isSelected?: boolean;
}

export const MannequinPreviewThumbnail: React.FC<MannequinPreviewThumbnailProps> = React.memo(
  ({ modelId, isSelected = false }) => {
    const currentMaterialStyle = useEditorStore((s) => s.currentMaterialStyle);
    const [imageUrl, setImageUrl] = useState<string | null>(() =>
      getCachedMannequinThumbnail(modelId, currentMaterialStyle)
    );

    useEffect(() => {
      let mounted = true;
      const cached = getCachedMannequinThumbnail(modelId, currentMaterialStyle);
      if (cached) {
        setImageUrl(cached);
        return;
      }

      renderMannequinThumbnail(modelId, currentMaterialStyle)
        .then((url) => {
          if (mounted) {
            setImageUrl(url);
          }
        })
        .catch((err) => {
          console.error('마네킹 썸네일 렌더링 오류:', err);
        });

      return () => {
        mounted = false;
      };
    }, [modelId, currentMaterialStyle]);

    return (
      <div
        className={`relative w-full aspect-[4/3] bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center border transition-colors ${
          isSelected
            ? 'border-blue-500/80'
            : 'border-zinc-800/80 group-hover:border-zinc-600'
        }`}
      >
        {/* 신장 눈금 가이드라인 */}
        <div className="absolute inset-0 flex flex-col justify-between py-1.5 px-2 pointer-events-none opacity-20 z-10">
          <div className="border-b border-dashed border-zinc-500 text-[7px] text-zinc-300">190</div>
          <div className="border-b border-dashed border-zinc-500 text-[7px] text-zinc-300">150</div>
          <div className="border-b border-dashed border-zinc-500 text-[7px] text-zinc-300">100</div>
          <div className="border-b border-zinc-500 text-[7px] text-zinc-300">0cm</div>
        </div>

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${modelId} 3D 마네킹 미리보기`}
            className="w-full h-full object-cover relative z-20 transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1 text-zinc-500 relative z-20">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            <span className="text-[9px]">3D 렌더링 중</span>
          </div>
        )}
      </div>
    );
  }
);
