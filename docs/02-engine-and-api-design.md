# 엔진, 데이터 계약, AI 제어 및 ComfyUI 설계

이 문서는 현재 구조에서 추가할 기능의 구현 계약이다. 입력과 출력의 좌표계·규격을 먼저 고정하고 UI와 API가 같은 명령 계층을 사용하게 한다.

## 1. 단일 장면 계약

`src/types/sceneDocument.ts`에 버전이 있는 `SceneDocument`를 정의한다. 화면 표시 상태와 내보내기 데이터의 출처가 이 객체 하나가 되어야 한다. Three.js 객체는 직렬화하지 않는다.

```ts
type Vec3 = [number, number, number];
type Quat = [number, number, number, number]; // x, y, z, w
type ActorId = string;

interface SceneDocumentV1 {
  schemaVersion: 1;
  units: 'meter';
  coordinateSystem: 'right-handed-y-up';
  actors: Array<{
    id: ActorId;
    modelId: MannequinModelId;
    root: { position: Vec3; rotation: Quat; scale: number };
    bones: Record<string, { rotation: Quat; position?: Vec3 }>;
  }>;
  camera: {
    projection: 'perspective';
    position: Vec3;
    target: Vec3;
    fovDegrees: number;
    near: number;
    far: number;
  };
  export: { width: number; height: number; bodyFormat: 'coco18' | 'body25' };
}
```

- `rotation`은 **각 모델의 rest pose 기준 로컬 델타**로 저장한다. FBX 원본의 절대 bone quaternion을 모델 간 공유하면 방향이 달라진다. 현재 `modelSwapHelper.ts`의 백업/복원 수식을 재사용하되 왕복 테스트를 추가한다.
- `actor.id`는 배열 인덱스나 모델 이름과 별개인 안정적인 ID다. 본 선택, AI 명령, 멀티 인물 내보내기가 이 ID를 사용한다.
- `root`는 인물 배치, `bones`는 관절 포즈다. `Hips.position` 같은 관절 이동은 지원 범위를 명시하고, 임의 bone 위치 변경은 기본적으로 거절한다.
- `sceneDocument`에 프롬프트 문장이나 의상 텍스트를 섞지 않는다. 필요할 때 `appearance`와 `environment`를 별도 확장 필드로 추가한다.
- `src/utils/securityUtils.ts`의 검증은 현재 `JOINT_DEFINITIONS`만 허용한다. 새 계약은 `schemaVersion`, 배열 길이, 유한값, 정규화 가능한 quaternion, bone allowlist, actor 수·크기 제한, 지원 모델 여부를 검증한다. 외부 입력은 전체를 검증한 뒤 원자적으로 적용한다.

## 2. 명령 계층과 AI 연동

`SceneManager`를 API로 직접 노출하지 않는다. `src/core/commands/`에 순수 명령 적용기와 상태 검증을 둔다. UI 조작, JSON 불러오기, 향후 AI 통신은 같은 명령 경로를 호출한다.

```ts
type SceneCommand =
  | { type: 'actor.add'; actor: SceneDocumentV1['actors'][number] }
  | { type: 'actor.remove'; actorId: string }
  | { type: 'actor.root.set'; actorId: string; position?: Vec3; rotation?: Quat; scale?: number }
  | { type: 'bone.rotation.set'; actorId: string; boneId: string; rotation: Quat }
  | { type: 'pose.apply'; actorId: string; presetId: string }
  | { type: 'camera.set'; camera: SceneDocumentV1['camera'] };

interface CommandBatch {
  schemaVersion: 1;
  baseRevision: number;
  requestId: string;
  commands: SceneCommand[];
}
```

적용 순서: JSON 크기 제한 → 스키마 검사 → `baseRevision` 검사 → 모든 명령을 임시 상태에 적용 → 가동 범위와 충돌 정책 검사 → 한 번에 커밋 → `revision` 증가 → 렌더 객체 동기화 → 결과 이벤트 발행. 부분 성공은 허용하지 않는다. 응답은 `requestId`, 새 `revision`, 변경된 `actorId`, 경고 목록을 담는다. 중복 `requestId`는 재적용하지 않는다. 이 구조를 먼저 브라우저 내부에서 완성한 후 HTTP 또는 WebSocket 전송 계층을 붙인다.

AI가 사용할 최소 API는 `GET scene`, `POST commands`, `POST render-jobs`, `GET render-jobs/{id}`다. 브라우저가 호스트인 경우 같은 머신의 로컬 브리지 서버가 이 API를 제공하고, 인증된 브라우저 세션에 명령을 전달한다. 임의 웹사이트에서 로컬 편집기로 명령을 보낼 수 없도록 Origin 검증, 짧은 수명의 세션 토큰, 요청 크기 제한, 로컬 바인딩을 설계한다. 원격 AI 서비스와 연결할 때는 사용자가 세션을 열고 허용 범위를 지정하는 방식으로 확장한다. 향후 네트워크 기술은 이 명령 계약을 유지하는 범위에서 선택한다.

가동 범위(ROM)는 `boneId`별 rest 기준 허용 스윙/트위스트를 데이터로 정의하고, 명령 적용기와 기즈모 종료 시 동일하게 검사한다. 1차 단계는 손목·팔꿈치·무릎·목에 우선 적용하며, 몸이 뒤집히는 프리셋을 보존하기 위해 프리셋 마이그레이션 검증을 함께 수행한다. 좌우 대칭은 3D 월드 좌표의 임의 부호 반전이 아니라 rest 축을 기준으로 좌우 본 매핑과 quaternion 변환을 검증한다.

## 3. 렌더와 OpenPose의 단일 투영

`src/core/pipeline/renderJob.ts`에 `RenderSpec`과 `RenderResult`를 둔다. 렌더 요청은 `sceneRevision`, 카메라 스냅샷, `width`, `height`, `mode`, 포함할 actor IDs를 가진다. 한 작업에서 카메라를 복제하고 종횡비 `width/height`를 설정한 뒤 PNG와 2D 키포인트를 모두 계산한다. UI 카메라를 임시 수정하지 않는다.

```ts
interface RenderSpec {
  sceneRevision: number;
  width: number;
  height: number;
  mode: 'openpose' | 'depth' | 'normal' | 'lineart' | 'shading';
  actorIds: string[];
  bodyFormat: 'coco18' | 'body25';
}
interface RenderResult {
  png: Blob;
  keypoints?: OpenPoseExportData;
  width: number;
  height: number;
  sceneRevision: number;
}
```

### COCO 18 변환

현재 본은 14개다. COCO 18의 순서는 `Nose, Neck, RShoulder, RElbow, RWrist, LShoulder, LElbow, LWrist, RHip, RKnee, RAnkle, LHip, LKnee, LAnkle, REye, LEye, REar, LEar`다. `Head`를 Nose로 이름만 바꾸면 위치가 틀린다. FBX 메쉬 또는 Head 본의 로컬 축으로 코 위치를 추정하는 모델별 앵커를 둔다. 눈·귀 앵커가 없으면 `0,0,0`으로 내보내고, 결과에는 지원 범위를 표시한다. 몸통 양측 고관절도 `Hips` 하나를 복제하지 말고 `LeftUpLeg`/`RightUpLeg`의 해부학적 앵커를 사용한다. BODY_25는 추가 발끝/발꿈치 앵커가 마련된 모델에만 허용한다.

좌표 유효성은 투영 전 카메라 공간의 깊이가 near/far 안인지 확인하고, 투영 후 `-1 ≤ x,y,z ≤ 1` 및 유한값을 검사한다. 가려진 관절을 0으로 만들지, 추정 위치를 유지할지는 `visibilityPolicy`로 정의하고 PNG와 JSON에서 동일하게 사용한다. 직접 구성한 3D 관절에서 `confidence=1`은 검출 확률이 아니라 유효한 투영이라는 뜻이므로 메타데이터에 기록한다. 화면 밖/미지원 점은 `0,0,0`이다. 다중 인물은 `people[]`에 actor 순서대로 기록한다. JSON 배열 길이는 COCO 18에서 54, BODY_25에서 75다. 현재 테스트의 42개 기대값은 교체해야 한다. [공식 관절 순서 및 JSON 형식](https://github.com/CMU-Perceptual-Computing-Lab/openpose/blob/master/doc/02_output.md)을 기준으로 골든 픽스처를 만든다.

### 모드별 출력

| 모드 | 구현 계약 |
| --- | --- |
| OpenPose | 검정 배경, 표준 순서에서 정의한 연결선·점, 지원하지 않는 점은 생략. 프레임 전체에 인물 모두 투영. PNG와 JSON의 카메라가 동일해야 한다. |
| Depth | 인물 메쉬만 렌더한다. 카메라 공간의 전후 경계를 모든 인물의 바운드에서 구하고 `[near,far]` 선형 밝기를 적용한다. 검정 배경 및 제어 맵용 색 공간 설정을 고정한다. 범위를 메타데이터에 저장한다. |
| Normal | 카메라 기준 법선을 `normal * 0.5 + 0.5`로 부호화한다. 스킨 변형된 메쉬와 뒷면 처리, 출력 색 공간을 확인한다. 채널 방향을 기준 구체로 테스트한다. |
| Lineart | 현재 와이어프레임을 별도 `wireframe` 개발 보기로 이동한다. 렌더 타깃의 실루엣과 깊이/법선 불연속을 결합한 후 임계값과 선 굵기를 적용한다. 실제 Canny 명칭은 Canny 알고리즘을 구현한 경우에만 사용한다. |
| Shading | 편집·검토용. 내보내기는 기즈모, 그리드, 콜라이더, 선택 점을 숨기되 의도적으로 포함한 소품/조명은 옵션으로 관리한다. |

렌더 타깃은 동일한 WebGLRenderer에서 크기별로 재사용하고 `setRenderTarget`의 이전 값, 뷰포트, 배경, 색 공간, 가시성, 그림자 설정을 `try/finally`로 복원한다. 픽셀 읽기 후 Y축 뒤집기와 PNG 인코딩을 한 곳에서 처리한다. WebGLRenderTarget과 임시 재질도 명시적으로 dispose한다. [Three.js WebGLRenderer API](https://threejs.org/docs/pages/WebGLRenderer), [리소스 해제 지침](https://threejs.org/manual/pages/how-to-dispose-of-objects.html)을 참고한다.

## 4. ComfyUI 작업 계약

현재 버튼은 업로드만 한다. 첫 단계에서 이름을 `ComfyUI에 이미지 업로드`로 바꾸고 파일명·업로드 상태를 정확히 표시한다. 실제 생성 버튼은 사용자가 ComfyUI API 형식 워크플로우 JSON을 불러오고 `LoadImage` 노드의 **명시적인 node ID**를 지정한 경우에만 활성화한다. 첫 `LoadImage`를 임의 선택하지 않는다. 워크플로우는 업로드한 이미지 이름을 복제본의 해당 노드에 주입하고, 정적 입력/출력 노드 검증 뒤 큐에 제출한다.

실행 상태 기계: `idle → checking → uploading → queued → running → completed | failed | cancelled`. WebSocket을 구독한 뒤 `POST /prompt`를 보내고 반환된 `prompt_id`만 추적한다. `executing.node`가 존재하면 실행 중이며, 해당 `prompt_id`의 `node: null`이 완료 신호다. `progress`의 `value/max`는 현재 샘플러 단계의 비율로만 표시하고 전체 작업 완료율로 단정하지 않는다. `execution_error`는 실패로 처리하고, 소켓이 끊기면 `GET /history/{prompt_id}`로 상태를 복구한다. 완료 후 history의 출력 이미지 정보를 읽어 결과를 보여준다. 다른 클라이언트의 이벤트는 무시한다. 업로드 응답의 `name`과 `subfolder`를 보존하고, 중복 파일명 덮어쓰기는 기본 해제한다. 서버 오류 본문, CORS 문제, 타임아웃을 구분해 표시한다. 이 흐름은 [ComfyUI 공식 WebSocket API 예제](https://github.com/comfyorg/comfyui/blob/master/script_examples/websockets_api_example.py)와 [공식 API 명세](https://github.com/Comfy-Org/ComfyUI/blob/master/openapi.yaml)를 기준으로 구현한다.

**연결 경계:** 로컬 ComfyUI 기본 주소는 `http://127.0.0.1:8188`이다. 사용자가 다른 주소를 입력할 수 있다면 URL 파싱과 허용 정책을 분리한다. 브라우저 직접 연결은 ComfyUI의 CORS 설정에 영향을 받는다. 배포형 웹앱에서 사용자의 로컬 ComfyUI에 접근하는 방식은 별도 브리지로 설계하고, 이 문서의 브라우저 직접 연결을 배포 가능하다고 가정하지 않는다.

## 5. 저장과 불러오기

사용자 저장 형식은 `SceneDocumentV1` JSON으로 고정한다. `파일 저장`은 현재 revision의 장면 스냅샷을 다운로드하고, `파일 열기`는 파일 크기와 `schemaVersion`을 검사한 뒤 검증된 새 장면을 원자적으로 적용한다. 알 수 없는 필드는 버전별 마이그레이션에서만 처리한다. 기존 `validateAndSanitizePoseData`는 개별 본 포즈 입력용으로 유지하거나 새 계약 검증기로 통합한다. 외부 JSON을 적용하기 전 현재 장면을 Undo 스택에 남긴다. 가져온 파일이 참조하는 모델이 없으면 명시적 오류를 보여주고 장면은 그대로 둔다.

OpenPose 2D JSON은 **출력 형식**으로 취급한다. 카메라와 3D 깊이가 없는 2D 키포인트를 `SceneDocumentV1`으로 자동 복원하지 않는다. 2D 입력으로 3D 포즈를 추정하는 기능이 필요해질 때 별도 추정기와 불확실성 표시를 설계한다. 따라서 UI에서는 `장면 JSON 열기`와 `OpenPose JSON 다운로드`를 구분한다.

## 6. 파일별 구현 순서

1. `src/types/sceneDocument.ts`, `src/core/commands/*`: 버전 계약, 검증, 원자적 명령, revision, Undo/Redo.
2. `src/core/scene/SceneManager.ts`, `src/components/editor/ViewportCanvas.tsx`: actor ID 선택, 렌더 객체 동기화, 비동기 로드 세대 검사, 해제.
3. `src/core/pipeline/openposePipeline.ts`, `src/core/pipeline/renderJob.ts`, `src/core/scene/modelSwapHelper.ts`: 공통 카메라와 렌더 타깃, 정확한 키포인트, 다중 인물.
4. `src/core/shaders/materials.ts`: Depth 범위, Normal 규약, Lineart. Wireframe 개발 모드 분리.
5. `src/services/comfyui/comfyClient.ts`, 새 `workflowMapper.ts`, `src/components/export/ExportPanel.tsx`: 업로드 전용과 큐 실행 분리, `prompt_id` 상태 추적.
6. API 브리지: 명령 계층이 안정화된 다음 추가. 먼저 브라우저 내부의 JSON 명령 호출로 AI 사용 계약을 검증한다.

## 7. 필수 테스트

- COCO 18/BODY_25 배열 길이·순서·미지원 점과 2인 `people[]` 골든 테스트.
- PNG와 JSON 동일 `RenderSpec`에서 관절 좌표 오차 2px 이내. 16:9 뷰포트에서 1:1 및 3:4 내보내기를 모두 검증.
- 카메라 뒤/near·far 밖/화면 밖/NaN 점이 confidence 0인지 검증.
- 모델 교체 요청 A→B가 역순으로 완료되어도 B가 남는지 검증.
- 명령 배치의 검증 실패·revision 충돌·중복 requestId가 장면을 바꾸지 않는지 검증.
- ComfyUI 업로드 성공 후 큐 제출 실패, 실행 오류, 연결 끊김, 타 작업 이벤트, 정상 결과를 모의 서버로 검증.
