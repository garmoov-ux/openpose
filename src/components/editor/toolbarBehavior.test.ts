import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CameraController } from '@/core/scene/CameraController';
import { createDefaultSceneDocument } from '@/core/commands/commandApplier';
import { useEditorStore } from '@/stores/useEditorStore';

describe('화면 도구 동작', () => {
  it('이미 정면이 선택된 뒤 카메라를 움직여도 정면을 다시 적용할 수 있다', () => {
    const camera = new THREE.PerspectiveCamera();
    const controls = { target: new THREE.Vector3(), update: () => {} } as unknown as OrbitControls;
    const controller = new CameraController(camera, controls);

    controller.setStandardPreset('front');
    camera.position.set(2, 2, 2);
    controller.setStandardPreset('front');

    expect(camera.position.toArray()).toEqual([0, 0.92, 3.75]);
    expect(controls.target.toArray()).toEqual([0, 0.86, 0]);
  });

  it('실행 취소와 다시 실행이 장면 기록을 정해진 순서로 복원한다', () => {
    const initial = createDefaultSceneDocument();
    useEditorStore.setState({ sceneDocument: initial, sceneRevision: 1, undoStack: [], redoStack: [] });
    const changed = structuredClone(initial);
    changed.camera.fovDegrees = 55;
    useEditorStore.getState().commitSceneDocument(changed);

    expect(useEditorStore.getState().undoSceneDocument()?.camera.fovDegrees).toBe(initial.camera.fovDegrees);
    expect(useEditorStore.getState().redoSceneDocument()?.camera.fovDegrees).toBe(55);
  });
});
