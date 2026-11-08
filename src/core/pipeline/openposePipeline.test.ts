import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import {
  COCO_18_KEYPOINT_ORDER,
  BODY_25_KEYPOINT_ORDER,
  COCO_LIMBS,
  exportOpenPoseJson,
  getJointScreenPositions,
  ScreenJointPoint,
} from './openposePipeline';
import { createProceduralHumanoid } from '@/core/mannequin/humanoidRig';
import { projectActorsWithRenderSpec } from './renderJob';

describe('OpenPose 렌더링 파이프라인 및 단일 투영 (openposePipeline & renderJob)', () => {
  it('COCO 표준 림(Limb) 정의가 올바른 관절 및 RGB 컬러를 가져야 한다', () => {
    expect(COCO_LIMBS.length).toBeGreaterThanOrEqual(13);

    const noseToNeck = COCO_LIMBS.find((l) => l.from === 'Nose' && l.to === 'Neck');
    expect(noseToNeck).toBeDefined();
    expect(noseToNeck?.color).toBe('rgb(255, 0, 0)');
  });

  it('COCO 18(54개 값) 및 BODY_25(75개 값) 골든 순서와 미지원 점(0,0,0), 2인 people[] 배열을 정확히 생성해야 한다', () => {
    const actor1 = new Map<string, ScreenJointPoint>([
      ['Nose', { x: 256, y: 90, visible: true }],
      ['Neck', { x: 256, y: 150, visible: true }],
      ['RightArm', { x: 200, y: 160, visible: true }],
      ['LeftUpLeg', { x: 280, y: 310, visible: true }],
    ]);
    const actor2 = new Map<string, ScreenJointPoint>([
      ['Nose', { x: 350, y: 95, visible: true }],
      ['Neck', { x: 350, y: 155, visible: true }],
    ]);

    const cocoResult = exportOpenPoseJson([actor1, actor2], 512, 512, 'coco18');
    expect(cocoResult.version).toBe(1.3);
    expect(cocoResult.canvas_width).toBe(512);
    expect(cocoResult.canvas_height).toBe(512);
    expect(cocoResult.people).toHaveLength(2);

    const p1 = cocoResult.people[0].pose_keypoints_2d;
    expect(p1).toHaveLength(COCO_18_KEYPOINT_ORDER.length * 3); // 18 * 3 = 54
    // index 0: Nose (256, 90, 1)
    expect(p1.slice(0, 3)).toEqual([256, 90, 1.0]);
    // index 1: Neck (256, 150, 1)
    expect(p1.slice(3, 6)).toEqual([256, 150, 1.0]);
    // index 2: RShoulder / RightArm (200, 160, 1)
    expect(p1.slice(6, 9)).toEqual([200, 160, 1.0]);
    // index 11: LHip / LeftUpLeg (280, 310, 1)
    expect(p1.slice(11 * 3, 11 * 3 + 3)).toEqual([280, 310, 1.0]);
    // index 14~17: REye, LEye, REar, LEar -> 미지원 점은 0,0,0
    expect(p1.slice(14 * 3, 18 * 3)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const body25Result = exportOpenPoseJson([actor1], 512, 512, 'body25');
    expect(body25Result.people[0].pose_keypoints_2d).toHaveLength(
      BODY_25_KEYPOINT_ORDER.length * 3
    ); // 25 * 3 = 75
  });

  it('카메라 뒤, near/far 밖, 화면 밖, NaN 좌표가 confidence 0 (0,0,0)으로 처리되어야 한다', () => {
    const cam = new THREE.PerspectiveCamera(45, 1.0, 0.5, 10.0);
    cam.position.set(0, 1, 3);
    cam.lookAt(0, 1, 0);
    cam.updateMatrixWorld();
    cam.updateProjectionMatrix();

    const makeBone = (name: string, x: number, y: number, z: number) => {
      const b = new THREE.Bone();
      b.name = name;
      b.position.set(x, y, z);
      b.updateMatrixWorld(true);
      return b;
    };

    const bones = new Map<string, THREE.Bone>([
      ['Neck', makeBone('Neck', 0, 1, 0)],          // 정상 (카메라 전방 3m)
      ['RightArm', makeBone('RightArm', 0, 1, 5)],  // 카메라 뒤 (z=5 > cam.z=3)
      ['LeftArm', makeBone('LeftArm', 0, 1, -20)],  // far(10m) 밖 (거리 23m)
      ['RightHand', makeBone('RightHand', 50, 1, 0)], // 화면 좌우 경계 밖
      ['LeftHand', makeBone('LeftHand', Number.NaN, 1, 0)], // NaN 좌표
    ]);

    const screenMap = getJointScreenPositions(bones, cam, 512, 512);
    expect(screenMap.get('Neck')?.visible).toBe(true);
    expect(screenMap.get('RightArm')?.visible).toBe(false);
    expect(screenMap.get('LeftArm')?.visible).toBe(false);
    expect(screenMap.get('RightHand')?.visible).toBe(false);
    expect(screenMap.get('LeftHand')?.visible).toBe(false);

    const exported = exportOpenPoseJson(screenMap, 512, 512, 'coco18');
    const kp = exported.people[0].pose_keypoints_2d;
    // Neck(index 1)은 confidence 1
    expect(kp[1 * 3 + 2]).toBe(1.0);
    // RightArm(index 2), LeftArm(index 5), RightHand(index 4), LeftHand(index 7)은 모두 0,0,0
    expect(kp.slice(2 * 3, 2 * 3 + 3)).toEqual([0, 0, 0]);
    expect(kp.slice(4 * 3, 4 * 3 + 3)).toEqual([0, 0, 0]);
    expect(kp.slice(5 * 3, 5 * 3 + 3)).toEqual([0, 0, 0]);
    expect(kp.slice(7 * 3, 7 * 3 + 3)).toEqual([0, 0, 0]);
  });

  it('16:9 뷰포트 카메라에서 1:1(1024x1024) 및 3:4(768x1024) 내보내기 시 투영과 JSON 좌표 오차가 2px 이내이고 원본 카메라 종횡비를 변경하지 않아야 한다', () => {
    const rig = createProceduralHumanoid();
    const viewportCam = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 50);
    viewportCam.position.set(0.25, 1.0, 3.6);
    viewportCam.lookAt(0, 0.9, 0);
    viewportCam.updateMatrixWorld();
    viewportCam.updateProjectionMatrix();

    for (const [w, h] of [
      [1024, 1024],
      [768, 1024],
    ]) {
      const { renderCam, actorPositionMaps, keypoints } = projectActorsWithRenderSpec(
        { width: w, height: h, actorIds: ['main'], bodyFormat: 'coco18' },
        viewportCam,
        [{ id: 'main', visible: true, group: rig.group, bones: rig.bones }]
      );

      // 원본 뷰포트 카메라의 16:9 종횡비가 훼손되지 않아야 함
      expect(viewportCam.aspect).toBeCloseTo(16 / 9, 5);
      expect(renderCam.aspect).toBeCloseTo(w / h, 5);

      const posMap = actorPositionMaps[0];
      const kp = keypoints.people[0].pose_keypoints_2d;

      COCO_18_KEYPOINT_ORDER.forEach((key, idx) => {
        const rawPt = posMap.get(key);
        const jsonX = kp[idx * 3];
        const jsonY = kp[idx * 3 + 1];
        const jsonC = kp[idx * 3 + 2];
        if (rawPt && rawPt.visible) {
          expect(jsonC).toBe(1.0);
          expect(Math.abs(rawPt.x - jsonX)).toBeLessThanOrEqual(1.0);
          expect(Math.abs(rawPt.y - jsonY)).toBeLessThanOrEqual(1.0);
        } else {
          expect(jsonC).toBe(0.0);
        }
      });
    }
  });
});
