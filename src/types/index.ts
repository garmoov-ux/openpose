export type RenderMode = 'shading' | 'openpose' | 'depth' | 'normal' | 'canny';

export type GizmoMode = 'rotate' | 'translate' | 'scale';
export type GizmoSpace = 'local' | 'world';

export type CameraPreset = 'front' | 'side' | 'top' | 'closeup' | 'fullbody';

export type MannequinModelId =
  | 'procedural'
  | 'anime_female'
  | 'realistic_woman'
  | 'realistic_muscular_male'
  | 'anime_basic_male'
  | 'male_mannequin'
  | 'chibi_male'
  | 'child_toddler'
  | 'child_toddler_f'
  | 'child_elementary'
  | 'child_elementary_f'
  | 'teen_middle_m'
  | 'teen_middle_f'
  | 'teen_girl'
  | 'teen_boy'
  | 'college_female'
  | 'college_male'
  | 'solo_female'
  | 'solo_male'
  | 'office_female'
  | 'office_male'
  | 'married_wife'
  | 'married_husband'
  | 'elderly_grandpa'
  | 'elderly_grandma'
  | 'plus_size_body'
  | 'heroic_tall';

export type MaterialStyle = 'matte_white' | 'toon_outline' | 'clay' | 'chrome';

export interface MannequinBoneScaleMap {
  [boneName: string]: [number, number, number];
}

export interface MannequinModelInfo {
  id: MannequinModelId;
  name: string;
  ageGroup: string;
  heightCm: number;
  headRatio: string;
  category: 'realistic' | 'anime' | 'age_body' | 'stylized';
  lifeStage?: 'youth' | 'young_adult' | 'married_senior' | 'model_art';
  gender: 'female' | 'male' | 'neutral';
  description: string;
  file?: string;
  badge?: string;
  targetHeight?: number;
  boneScales?: MannequinBoneScaleMap;
}

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
  category: 'standing' | 'sitting' | 'action' | 'glamour' | 'couple';
  subGroup?: string;
  description: string;
  pose: PoseKeyframe;
  mainOffset?: [number, number, number];
  mainRotationY?: number;
  partnerPose?: PoseKeyframe;
  partnerOffset?: [number, number, number];
  partnerRotationY?: number;
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
