import { create } from 'zustand';
import { RenderMode, GizmoMode, GizmoSpace, CameraPreset, MannequinModelId, MaterialStyle } from '@/types';

export type LeftSidebarSection = 'mannequin' | 'poses' | 'themes' | 'export' | null;

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

  // 좌측 통합 사이드바 및 플로팅 UI 모달 상태
  activeLeftSection: LeftSidebarSection;
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
  setActiveLeftSection: (section: LeftSidebarSection) => void;
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

  activeLeftSection: null,
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
  setActiveLeftSection: (activeLeftSection) =>
    set({
      activeLeftSection,
      isModelModalOpen: activeLeftSection === 'mannequin',
      isPresetsDrawerOpen: activeLeftSection === 'poses',
      isThemesDrawerOpen: activeLeftSection === 'themes',
      isExportDrawerOpen: activeLeftSection === 'export',
    }),
  setIsModelModalOpen: (isModelModalOpen) =>
    set((s) => ({
      isModelModalOpen,
      activeLeftSection: isModelModalOpen ? 'mannequin' : s.activeLeftSection === 'mannequin' ? null : s.activeLeftSection,
    })),
  setIsThemesDrawerOpen: (isThemesDrawerOpen) =>
    set((s) => ({
      isThemesDrawerOpen,
      activeLeftSection: isThemesDrawerOpen ? 'themes' : s.activeLeftSection === 'themes' ? null : s.activeLeftSection,
    })),
  setIsPresetsDrawerOpen: (isPresetsDrawerOpen) =>
    set((s) => ({
      isPresetsDrawerOpen,
      activeLeftSection: isPresetsDrawerOpen ? 'poses' : s.activeLeftSection === 'poses' ? null : s.activeLeftSection,
    })),
  setIsExportDrawerOpen: (isExportDrawerOpen) =>
    set((s) => ({
      isExportDrawerOpen,
      activeLeftSection: isExportDrawerOpen ? 'export' : s.activeLeftSection === 'export' ? null : s.activeLeftSection,
    })),
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

