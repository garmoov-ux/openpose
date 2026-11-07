import { create } from 'zustand';
import { RenderMode, GizmoMode, GizmoSpace, CameraPreset } from '@/types';

interface EditorState {
  renderMode: RenderMode;
  gizmoMode: GizmoMode;
  gizmoSpace: GizmoSpace;
  selectedBoneName: string | null;
  cameraPreset: CameraPreset;
  showGrid: boolean;
  showSkeleton: boolean;
  exportResolution: number;
  comfyUrl: string;
  isComfyConnected: boolean;
  isGenerating: boolean;
  generationProgress: number;
  generationStatus: string;
  capturedImageUrl: string | null;
  
  // Actions
  setRenderMode: (mode: RenderMode) => void;
  setGizmoMode: (mode: GizmoMode) => void;
  setGizmoSpace: (space: GizmoSpace) => void;
  setSelectedBoneName: (name: string | null) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setShowGrid: (show: boolean) => void;
  setShowSkeleton: (show: boolean) => void;
  setExportResolution: (resolution: number) => void;
  setComfyUrl: (url: string) => void;
  setIsComfyConnected: (connected: boolean) => void;
  setIsGenerating: (generating: boolean) => void;
  setGenerationProgress: (progress: number, status?: string) => void;
  setCapturedImageUrl: (url: string | null) => void;
  resetPose: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  renderMode: 'shading',
  gizmoMode: 'rotate',
  gizmoSpace: 'local',
  selectedBoneName: null,
  cameraPreset: 'front',
  showGrid: true,
  showSkeleton: true,
  exportResolution: 1024,
  comfyUrl: 'http://127.0.0.1:8188',
  isComfyConnected: false,
  isGenerating: false,
  generationProgress: 0,
  generationStatus: '대기 중',
  capturedImageUrl: null,

  setRenderMode: (renderMode) => set({ renderMode }),
  setGizmoMode: (gizmoMode) => set({ gizmoMode }),
  setGizmoSpace: (gizmoSpace) => set({ gizmoSpace }),
  setSelectedBoneName: (selectedBoneName) => set({ selectedBoneName }),
  setCameraPreset: (cameraPreset) => set({ cameraPreset }),
  setShowGrid: (showGrid) => set({ showGrid }),
  setShowSkeleton: (showSkeleton) => set({ showSkeleton }),
  setExportResolution: (exportResolution) => set({ exportResolution }),
  setComfyUrl: (comfyUrl) => set({ comfyUrl }),
  setIsComfyConnected: (isComfyConnected) => set({ isComfyConnected }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationProgress: (progress, status) =>
    set({
      generationProgress: progress,
      ...(status ? { generationStatus: status } : {})
    }),
  setCapturedImageUrl: (capturedImageUrl) => set({ capturedImageUrl }),
  resetPose: () => {
    // 씬 리셋 트리거용 타임스탬프 또는 이벤트
  },
}));

