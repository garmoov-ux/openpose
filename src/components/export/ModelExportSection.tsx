import React, { useState } from 'react';
import type * as THREE from 'three';
import { Download } from 'lucide-react';
import { SceneManager } from '@/core/scene/SceneManager';
import { encodeModelScene, ModelExportFormat } from '@/core/scene/modelExport';
import { downloadBlobAsFile } from '@/utils/exportUtils';

interface Props {
  sceneManager: SceneManager | null;
}

const FORMATS: { id: ModelExportFormat; label: string; detail: string }[] = [
  { id: 'glb', label: 'GLB', detail: '본·재질 포함 3D 모델' },
  { id: 'fbx', label: 'FBX', detail: '본 포함 3D 모델' },
  { id: 'obj', label: 'OBJ', detail: '현재 자세의 정적 메시' },
  { id: 'stl', label: 'STL', detail: '현재 자세의 정적 표면' },
];

export const ModelExportSection: React.FC<Props> = ({ sceneManager }) => {
  const [busy, setBusy] = useState<ModelExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  const download = async (format: ModelExportFormat) => {
    if (!sceneManager || busy) return;
    setBusy(format);
    setError(null);
    let scene: ReturnType<SceneManager['createPoseExportScene']> | null = null;
    try {
      scene = sceneManager.createPoseExportScene(format);
      const blob = await encodeModelScene(scene, format);
      if (blob.size === 0) throw new Error('내보낼 3D 데이터가 없습니다.');
      downloadBlobAsFile(blob, `mannequin_pose.${format}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '3D 모델을 저장하지 못했습니다.');
    } finally {
      if (format === 'obj' || format === 'stl') {
        scene?.traverse((object) => {
          if ((object as THREE.Mesh).isMesh) (object as THREE.Mesh).geometry.dispose();
        });
      }
      setBusy(null);
    }
  };

  return (
    <section className="flex flex-col gap-3 rounded-3xl border border-zinc-200/90 bg-white p-4 shadow-xs">
      <div>
        <h3 className="text-xs font-bold text-zinc-900">3D 모델 내보내기</h3>
        <p className="mt-1 text-[11px] text-zinc-600">현재 보이는 인물의 포즈를 저장합니다. OBJ와 STL은 관절을 다시 조작할 수 없는 메시입니다.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {FORMATS.map(({ id, label, detail }) => (
          <button key={id} type="button" disabled={!sceneManager || busy !== null} onClick={() => void download(id)}
            className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-2 text-zinc-900 hover:bg-zinc-100 disabled:opacity-50">
            <Download className="h-4 w-4 shrink-0" />
            <span className="text-left"><strong className="block text-xs">{busy === id ? '저장 중…' : label}</strong><small className="block text-[10px] text-zinc-500">{detail}</small></span>
          </button>
        ))}
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-2 text-xs text-red-700">{error}</p>}
    </section>
  );
};
