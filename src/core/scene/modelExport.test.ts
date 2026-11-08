import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { createProceduralHumanoid } from '@/core/mannequin/humanoidRig';
import { buildEditableModelScene, buildStaticModelScene, encodeModelScene } from './modelExport';

class TestFileReader {
  result: ArrayBuffer | null = null;
  onloadend: (() => void) | null = null;
  readAsArrayBuffer(blob: Blob) {
    void blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      this.onloadend?.();
    });
  }
}

describe('3D model export', () => {
  it('keeps the posed visible model and removes editor picking meshes', async () => {
    const rig = createProceduralHumanoid();
    rig.bones.get('LeftArm')!.rotation.z = -0.8;
    rig.group.updateMatrixWorld(true);
    const editable = buildEditableModelScene([rig.group]);
    const staticScene = buildStaticModelScene([rig.group]);

    expect(editable.getObjectByName('LeftArm')).toBeDefined();
    expect(editable.children[0].getObjectByName('Collider_LeftArm')).toBeUndefined();
    expect(staticScene.children.length).toBeGreaterThan(10);
    expect(staticScene.children.every((child) => (child as THREE.Mesh).isMesh)).toBe(true);

    const obj = await encodeModelScene(staticScene, 'obj');
    expect((await obj.text()).includes('\nv ')).toBe(true);
    const stl = await encodeModelScene(staticScene, 'stl');
    expect(stl.size).toBeGreaterThan(84);

    const fbx = await encodeModelScene(editable, 'fbx');
    const bytes = new Uint8Array(await fbx.arrayBuffer());
    expect(new TextDecoder().decode(bytes.slice(0, 18))).toBe('Kaydara FBX Binary');
    const parsed = new FBXLoader().parse(bytes.buffer, '');
    expect(parsed.children.length).toBeGreaterThan(0);

    vi.stubGlobal('FileReader', TestFileReader);
    try {
      const glb = await encodeModelScene(editable, 'glb');
      expect(glb.size).toBeGreaterThan(20);
      expect(new DataView(await glb.arrayBuffer()).getUint32(0, true)).toBe(0x46546c67);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('preserves a loaded mannequin skeleton in FBX', async () => {
    const source = readFileSync(new URL('../../../public/models/male_mannequin_OP_IK.fbx', import.meta.url));
    const input = source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength) as ArrayBuffer;
    const mannequin = new FBXLoader().parse(input, '');
    const scene = buildEditableModelScene([mannequin]);
    const output = await encodeModelScene(scene, 'fbx');
    const parsed = new FBXLoader().parse(await output.arrayBuffer(), '');
    let skinnedMeshes = 0;
    parsed.traverse((object) => { if ((object as THREE.SkinnedMesh).isSkinnedMesh) skinnedMeshes++; });
    expect(skinnedMeshes).toBeGreaterThan(0);

    vi.stubGlobal('FileReader', TestFileReader);
    try {
      const glb = await encodeModelScene(scene, 'glb');
      const buffer = await glb.arrayBuffer();
      const view = new DataView(buffer);
      const jsonLength = view.getUint32(12, true);
      const json = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer, 20, jsonLength)));
      expect(json.skins.length).toBeGreaterThan(0);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
