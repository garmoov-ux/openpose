import { describe, it, expect } from 'vitest';
import { COCO_LIMBS, exportOpenPoseJson } from './openposePipeline';

describe('OpenPose 렌더링 파이프라인 (openposePipeline)', () => {
  it('COCO 표준 림(Limb) 정의가 올바른 관절 및 RGB 컬러를 가져야 한다', () => {
    expect(COCO_LIMBS.length).toBeGreaterThanOrEqual(13);

    // 머리-목 연결선은 빨간색이어야 함
    const headToNeck = COCO_LIMBS.find((l) => l.from === 'Head' && l.to === 'Neck');
    expect(headToNeck).toBeDefined();
    expect(headToNeck?.color).toBe('rgb(255, 0, 0)');
  });

  it('exportOpenPoseJson이 표준 OpenPose v1.3 JSON 스키마를 생성해야 한다', () => {
    const mockPositions = new Map<string, { x: number; y: number; visible: boolean }>([
      ['Head', { x: 256, y: 100, visible: true }],
      ['Neck', { x: 256, y: 150, visible: true }],
      ['RightArm', { x: 200, y: 160, visible: true }],
    ]);

    const result = exportOpenPoseJson(mockPositions, 512, 512);

    expect(result.version).toBe(1.3);
    expect(result.canvas_width).toBe(512);
    expect(result.canvas_height).toBe(512);
    expect(result.people).toHaveLength(1);

    const person = result.people[0];
    expect(person.person_id).toEqual([-1]);
    expect(person.pose_keypoints_2d).toBeInstanceOf(Array);
    // 3개 값(x, y, confidence) 단위로 14개 관절 = 42개 요소
    expect(person.pose_keypoints_2d.length).toBe(14 * 3);

    // Head 관절 검증 (index 0, 1, 2)
    expect(person.pose_keypoints_2d[0]).toBe(256);
    expect(person.pose_keypoints_2d[1]).toBe(100);
    expect(person.pose_keypoints_2d[2]).toBe(1.0);
  });
});

