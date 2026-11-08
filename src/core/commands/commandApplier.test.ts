import { describe, it, expect } from 'vitest';
import {
  applyCommandBatch,
  createDefaultSceneDocument,
  mirrorQuaternionLeftRight,
} from './commandApplier';
import { validateSceneDocumentV1 } from '@/utils/securityUtils';
import { backupBoneRotations, restoreBoneRotations } from '@/core/scene/modelSwapHelper';
import { createProceduralHumanoid } from '@/core/mannequin/humanoidRig';

describe('단일 장면 계약(SceneDocumentV1) 및 원자적 명령 계층 (commandApplier)', () => {
  it('유효한 SceneDocumentV1을 통과시키고, 미지원 모델이나 임의 관절 위치 이동을 거절해야 한다', () => {
    const doc = createDefaultSceneDocument();
    const validRes = validateSceneDocumentV1(doc);
    expect(validRes.error).toBeUndefined();
    expect(validRes.document?.schemaVersion).toBe(1);

    const invalidModelDoc = {
      ...doc,
      actors: [{ ...doc.actors[0], modelId: 'unknown_model' }],
    };
    expect(validateSceneDocumentV1(invalidModelDoc).error).toContain('지원하지 않는 마네킹 모델');

    const invalidPosDoc = {
      ...doc,
      actors: [
        {
          ...doc.actors[0],
          bones: {
            LeftArm: { rotation: [0, 0, 0, 1], position: [1, 2, 3] },
          },
        },
      ],
    };
    expect(validateSceneDocumentV1(invalidPosDoc).error).toContain('Hips에만 허용');
  });

  it('명령 배치의 검증 실패, baseRevision 충돌, 중복 requestId가 장면을 훼손하지 않아야 한다', () => {
    const doc = createDefaultSceneDocument();
    const processed = new Set<string>();

    // 1. 정상 명령 배치 적용 -> revision 2로 증가
    const res1 = applyCommandBatch(
      doc,
      {
        schemaVersion: 1,
        baseRevision: 1,
        requestId: 'req-001',
        commands: [
          {
            type: 'bone.rotation.set',
            actorId: 'main',
            boneId: 'LeftArm',
            rotation: [0, 0, 0.2588, 0.9659],
          },
        ],
      },
      processed
    );
    expect(res1.ok).toBe(true);
    expect(res1.revision).toBe(2);
    expect(res1.changedActorIds).toEqual(['main']);

    // 2. 중복 requestId('req-001') 재전송 -> 재적용하지 않고 현재 상태 그대로 반환
    const dupRes = applyCommandBatch(
      res1.document,
      {
        schemaVersion: 1,
        baseRevision: 1,
        requestId: 'req-001',
        commands: [
          {
            type: 'bone.rotation.set',
            actorId: 'main',
            boneId: 'LeftArm',
            rotation: [0, 0, 0, 1],
          },
        ],
      },
      processed
    );
    expect(dupRes.ok).toBe(true);
    expect(dupRes.revision).toBe(2);
    expect(dupRes.warnings[0]).toContain('중복된 requestId');

    // 3. baseRevision 불일치 -> 거절 및 장면 불변
    const revConflict = applyCommandBatch(
      res1.document,
      {
        schemaVersion: 1,
        baseRevision: 1, // 현재는 2
        requestId: 'req-002',
        commands: [{ type: 'camera.set', camera: { fovDegrees: 50 } }],
      },
      processed
    );
    expect(revConflict.ok).toBe(false);
    expect(revConflict.error).toContain('baseRevision 충돌');
    expect(revConflict.document.revision).toBe(2);

    // 4. 다중 명령 중 두 번째 명령이 실패할 경우 첫 번째 명령도 원자적으로 롤백되어야 함
    const partialFail = applyCommandBatch(
      res1.document,
      {
        schemaVersion: 1,
        baseRevision: 2,
        requestId: 'req-003',
        commands: [
          { type: 'camera.set', camera: { fovDegrees: 60 } },
          {
            type: 'bone.rotation.set',
            actorId: 'main',
            boneId: 'InvalidBoneName',
            rotation: [0, 0, 0, 1],
          },
        ],
      },
      processed
    );
    expect(partialFail.ok).toBe(false);
    expect(partialFail.document.camera.fovDegrees).toBe(doc.camera.fovDegrees);
    expect(partialFail.document.revision).toBe(2);
  });

  it('포즈 백업/복원 왕복 및 좌우 대칭 쿼터니언 변환이 일관되어야 한다', () => {
    const rigA = createProceduralHumanoid();
    const rigB = createProceduralHumanoid();
    const leftArmA = rigA.bones.get('LeftArm')!;
    leftArmA.quaternion.setFromAxisAngle(leftArmA.up, 0.45).normalize();

    const backup = backupBoneRotations(rigA.bones);
    restoreBoneRotations(rigB.bones, backup);

    const leftArmB = rigB.bones.get('LeftArm')!;
    expect(leftArmB.quaternion.x).toBeCloseTo(leftArmA.quaternion.x, 4);
    expect(leftArmB.quaternion.y).toBeCloseTo(leftArmA.quaternion.y, 4);
    expect(leftArmB.quaternion.z).toBeCloseTo(leftArmA.quaternion.z, 4);
    expect(leftArmB.quaternion.w).toBeCloseTo(leftArmA.quaternion.w, 4);

    const q: [number, number, number, number] = [0.1, 0.2, 0.3, 0.92736];
    const mirroredTwice = mirrorQuaternionLeftRight(mirrorQuaternionLeftRight(q));
    expect(mirroredTwice[0]).toBeCloseTo(q[0], 3);
    expect(mirroredTwice[1]).toBeCloseTo(q[1], 3);
    expect(mirroredTwice[2]).toBeCloseTo(q[2], 3);
    expect(mirroredTwice[3]).toBeCloseTo(q[3], 3);
  });
});

