import { create } from 'zustand';
import { RenderMode, GizmoMode, GizmoSpace, CameraPreset, MannequinModelId, MaterialStyle } from '@/types';

interface EditorState {
  renderMode: RenderMode;
  gizmoMode: GizmoMode;
  gizmoSpace: GizmoSpace;
  selectedBoneName: string | null;
  cameraPreset: CameraPreset;
  showGrid: boolean;
  showSkeleton: boolean;
  exportResolution: number;
  currentModelId: MannequinModelId;
  currentMaterialStyle: MaterialStyle;
  modelLoadingProgress: number | null;

  // 플로팅 UI 모달 및 드로어 상태
  isModelModalOpen: boolean;
  isThemesDrawerOpen: boolean;
  isPresetsDrawerOpen: boolean;
  isExportDrawerOpen: boolean;

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
  setCurrentModelId: (id: MannequinModelId) => void;
  setCurrentMaterialStyle: (style: MaterialStyle) => void;
  setModelLoadingProgress: (progress: number | null) => void;
  setIsModelModalOpen: (open: boolean) => void;
  setIsThemesDrawerOpen: (open: boolean) => void;
  setIsPresetsDrawerOpen: (open: boolean) => void;
  setIsExportDrawerOpen: (open: boolean) => void;
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
  currentModelId: 'realistic_woman',
  currentMaterialStyle: 'matte_white',
  modelLoadingProgress: null,

  isModelModalOpen: false,
  isThemesDrawerOpen: false,
  isPresetsDrawerOpen: false,
  isExportDrawerOpen: false,

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
  setCurrentModelId: (currentModelId) => set({ currentModelId }),
  setCurrentMaterialStyle: (currentMaterialStyle) => set({ currentMaterialStyle }),
  setModelLoadingProgress: (modelLoadingProgress) => set({ modelLoadingProgress }),
  setIsModelModalOpen: (isModelModalOpen) => set({ isModelModalOpen }),
  setIsThemesDrawerOpen: (isThemesDrawerOpen) => set({ isThemesDrawerOpen }),
  setIsPresetsDrawerOpen: (isPresetsDrawerOpen) => set({ isPresetsDrawerOpen }),
  setIsExportDrawerOpen: (isExportDrawerOpen) => set({ isExportDrawerOpen }),
  setComfyUrl: (comfyUrl) => set({ comfyUrl }),
  setIsComfyConnected: (isComfyConnected) => set({ isComfyConnected }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationProgress: (progress, status) =>
    set({
      generationProgress: progress,
      ...(status ? { generationStatus: status } : {})
    }),
  setCapturedImageUrl: (capturedImageUrl) => set({ capturedImageUrl }),
  resetPose: () => {},
}));

