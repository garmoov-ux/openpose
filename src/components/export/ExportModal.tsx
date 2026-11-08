import React from 'react';
import { useEditorStore } from '@/stores/useEditorStore';
import { ExportPanel } from './ExportPanel';
import { SceneManager } from '@/core/scene/SceneManager';
import { Download, X } from 'lucide-react';

interface ExportModalProps {
  sceneManager: SceneManager | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ sceneManager }) => {
  const { isExportDrawerOpen, setIsExportDrawerOpen } = useEditorStore();

  if (!isExportDrawerOpen) return null;

  return (
    <div
      onClick={() => setIsExportDrawerOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
      >
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 tracking-tight">화면 저장 및 생성 서버 연동</h2>
              <p className="text-[11px] text-zinc-500">클립보드 즉시 복사 및 원클릭 이미지 생성 파이프라인</p>
            </div>
          </div>
          <button
            onClick={() => setIsExportDrawerOpen(false)}
            aria-label="닫기"
            className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6 overflow-y-auto">
          <ExportPanel sceneManager={sceneManager} />
        </div>
      </div>
    </div>
  );
};
