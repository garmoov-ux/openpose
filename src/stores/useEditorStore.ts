import { create } from 'zustand';
import { RenderMode, GizmoMode, GizmoSpace, CameraPreset, MannequinModelId, MaterialStyle } from '@/types';
import { BodyFormat, SceneDocumentV1 } from '@/types/sceneDocument';
import { cloneSceneDocument, createDefaultSceneDocument } from '@/core/commands/commandApplier';

export type LeftSidebarSection = 'mannequin' | 'poses' | 'themes' | 'export' | null;

interface EditorState {
  renderMode: RenderMode;
  gizmoMode: GizmoMode;
  gizmoSpace: GizmoSpace;
  selectedBoneName: string | null;
  selectedActorId: 'main' | 'partner';
  cameraPreset: CameraPreset;
  showGrid: boolean;
  showSkeleton: boolean;
  symmetryEnabled: boolean;
  romEnabled: boolean;
  exportResolution: number;
  exportWidth: number;
  exportHeight: number;
  bodyFormat: BodyFormat;
  currentModelId: MannequinModelId;
  currentMaterialStyle: MaterialStyle;
  modelLoadingProgress: number | null;

  // 단일 장면 계약(SceneDocumentV1) 리비전 및 Undo/Redo 스택
  sceneDocument: SceneDocumentV1;
  sceneRevision: number;
  undoStack: SceneDocumentV1[];
  redoStack: SceneDocumentV1[];
  lastCommandSource: 'user' | 'ai' | 'preset' | 'file';
  lastCommandWarning: string | null;

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
  setSelectedBoneName: (name: string | null, actorId?: 'main' | 'partner') => void;
  setSelectedActorId: (actorId: 'main' | 'partner') => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setShowGrid: (show: boolean) => void;
  setShowSkeleton: (show: boolean) => void;
  setSymmetryEnabled: (enabled: boolean) => void;
  setRomEnabled: (enabled: boolean) => void;
  setExportResolution: (resolution: number) => void;
  setExportDimensions: (width: number, height: number) => void;
  setBodyFormat: (format: BodyFormat) => void;
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
  commitSceneDocument: (
    nextDoc: SceneDocumentV1,
    source?: 'user' | 'ai' | 'preset' | 'file',
    warning?: string | null
  ) => void;
  undoSceneDocument: () => SceneDocumentV1 | null;
  redoSceneDocument: () => SceneDocumentV1 | null;
  resetPose: () => void;
}

const initialDoc = createDefaultSceneDocument();

export const useEditorStore = create<EditorState>((set, get) => ({
  renderMode: 'shading',
  gizmoMode: 'rotate',
  gizmoSpace: 'local',
  selectedBoneName: null,
  selectedActorId: 'main',
  cameraPreset: 'front',
  showGrid: true,
  showSkeleton: true,
  symmetryEnabled: false,
  romEnabled: true,
  exportResolution: 1024,
  exportWidth: 1024,
  exportHeight: 1024,
  bodyFormat: 'coco18',
  currentModelId: 'realistic_woman',
  currentMaterialStyle: 'matte_white',
  modelLoadingProgress: null,

  sceneDocument: initialDoc,
  sceneRevision: initialDoc.revision,
  undoStack: [],
  redoStack: [],
  lastCommandSource: 'user',
  lastCommandWarning: null,

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
  setSelectedBoneName: (selectedBoneName, actorId) =>
    set((s) => ({
      selectedBoneName,
      selectedActorId: actorId ?? s.selectedActorId,
    })),
  setSelectedActorId: (selectedActorId) => set({ selectedActorId }),
  setCameraPreset: (cameraPreset) => set({ cameraPreset }),
  setShowGrid: (showGrid) => set({ showGrid }),
  setShowSkeleton: (showSkeleton) => set({ showSkeleton }),
  setSymmetryEnabled: (symmetryEnabled) => set({ symmetryEnabled }),
  setRomEnabled: (romEnabled) => set({ romEnabled }),
  setExportResolution: (exportResolution) =>
    set({
      exportResolution,
      exportWidth: exportResolution,
      exportHeight: exportResolution,
    }),
  setExportDimensions: (exportWidth, exportHeight) =>
    set({
      exportWidth,
      exportHeight,
      exportResolution: exportWidth,
    }),
  setBodyFormat: (bodyFormat) => set({ bodyFormat }),
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
      ...(status ? { generationStatus: status } : {}),
    }),
  setCapturedImageUrl: (capturedImageUrl) => set({ capturedImageUrl }),
  commitSceneDocument: (nextDoc, source = 'user', warning = null) =>
    set((s) => {
      const prevCopy = cloneSceneDocument(s.sceneDocument);
      const nextCopy = cloneSceneDocument(nextDoc);
      nextCopy.revision = s.sceneRevision + 1;
      const undoStack = [...s.undoStack.slice(-29), prevCopy];
      return {
        sceneDocument: nextCopy,
        sceneRevision: nextCopy.revision,
        undoStack,
        redoStack: [],
        lastCommandSource: source,
        lastCommandWarning: warning,
        exportWidth: nextCopy.export.width,
        exportHeight: nextCopy.export.height,
        bodyFormat: nextCopy.export.bodyFormat,
      };
    }),
  undoSceneDocument: () => {
    const s = get();
    if (s.undoStack.length === 0) return null;
    const prev = s.undoStack[s.undoStack.length - 1];
    const nextUndo = s.undoStack.slice(0, -1);
    const currentCopy = cloneSceneDocument(s.sceneDocument);
    const restored = cloneSceneDocument(prev);
    restored.revision = s.sceneRevision + 1;
    set({
      sceneDocument: restored,
      sceneRevision: restored.revision,
      undoStack: nextUndo,
      redoStack: [...s.redoStack, currentCopy],
      lastCommandSource: 'user',
      lastCommandWarning: null,
    });
    return restored;
  },
  redoSceneDocument: () => {
    const s = get();
    if (s.redoStack.length === 0) return null;
    const next = s.redoStack[s.redoStack.length - 1];
    const nextRedo = s.redoStack.slice(0, -1);
    const currentCopy = cloneSceneDocument(s.sceneDocument);
    const restored = cloneSceneDocument(next);
    restored.revision = s.sceneRevision + 1;
    set({
      sceneDocument: restored,
      sceneRevision: restored.revision,
      undoStack: [...s.undoStack, currentCopy],
      redoStack: nextRedo,
      lastCommandSource: 'user',
      lastCommandWarning: null,
    });
    return restored;
  },
  resetPose: () => {},
}));
