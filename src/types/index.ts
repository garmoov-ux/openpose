export type RenderMode = 'shading' | 'openpose' | 'depth' | 'normal' | 'canny';

export type GizmoMode = 'rotate' | 'translate';
export type GizmoSpace = 'local' | 'world';

export type CameraPreset = 'front' | 'side' | 'top' | 'closeup' | 'fullbody';

export interface BoneJointInfo {
  name: string;
  label: string;
  parentName?: string;
  openposeId?: number;
  cocoLimbId?: number;
}

export interface PoseKeyframe {
  [boneName: string]: {
    rotation: [number, number, number, number]; // Quaternion [x, y, z, w]
    position?: [number, number, number];        // Vector3 [x, y, z]
  };
}

export interface PosePreset {
  id: string;
  title: string;
  category: 'standing' | 'sitting' | 'action' | 'hands';
  description: string;
  pose: PoseKeyframe;
}

export interface ComfyUISettings {
  serverUrl: string;
  workflowTemplate: string;
  connected: boolean;
  isGenerating: boolean;
  progress: number;
  statusText: string;
  lastGeneratedUrl?: string;
}

export interface OpenPoseKeypoint2D {
  x: number;
  y: number;
  confidence: number;
}

export interface OpenPoseExportData {
  version: number;
  people: Array<{
    person_id: number[];
    pose_keypoints_2d: number[];
    face_keypoints_2d: number[];
    hand_left_keypoints_2d: number[];
    hand_right_keypoints_2d: number[];
  }>;
  canvas_width: number;
  canvas_height: number;
}

