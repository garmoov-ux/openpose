# ComfyUI API 및 데이터 교환 표준 규칙

- **적용 대상**: `src/services/comfyui/`, 데이터 내보내기/불러오기 모듈
- **작성 기준**: 2026년 11월
- **원칙**: ComfyUI 및 WebUI 환경과 원클릭으로 연동되어 사용자가 브라우저에서 작업한 포즈를 AI 생성 파이프라인으로 지체 없이 전송할 수 있도록 통신 인터페이스를 표준화한다.

---

## 1. ComfyUI REST API 및 WebSocket 통신 표준

1. **기본 호스트 및 포트**:
   - 기본 주소: `http://127.0.0.1:8188` (사용자가 설정 패널에서 커스텀 URL로 변경 가능해야 함)
   - CORS 대응: ComfyUI 실행 시 `--enable-cors-header` 옵션이 켜져 있거나, 프론트엔드 Vite 개발 서버 프록시(`/api/comfy`)를 통해 우회 통신할 수 있는 Fallback 구조를 구현한다.
2. **이미지 업로드 엔드포인트 (`POST /upload/image`)**:
   - `FormData`를 구성하여 캡처된 Blob(PNG)을 `image` 필드로 전송한다.
   - 응답으로 수신된 파일명(`name`), 하위폴더(`subfolder`), 타입(`type`)을 획득한다.
3. **프롬프트 큐 등록 엔드포인트 (`POST /prompt`)**:
   - ComfyUI 워크플로우 JSON 객체 내의 `LoadImage` 또는 ControlNet 프리프로세서 입력 노드의 `inputs.image` 값을 업로드된 파일명으로 치환하여 전송한다.
4. **실시간 진행도 트래킹 (`WebSocket ws://127.0.0.1:8188/ws?clientId={uuid}`)**:
   - `status`, `progress`, `executing`, `executed` 메시지를 구독하여 AI 이미지 생성 진행률(0~100%)을 에디터 하단 상태 표시줄에 실시간으로 반영한다.

---

## 2. OpenPose JSON 직렬화 규격 (OpenPose v1.7.0 호환)

에디터에서 관절을 추출하여 JSON 파일로 내보낼 때, ComfyUI의 `OpenPose Editor` 노드 및 WebUI `sd-webui-controlnet`과 양방향 호환되는 포맷을 지원한다:

```json
{
  "version": 1.3,
  "people": [
    {
      "person_id": [-1],
      "pose_keypoints_2d": [
        x0, y0, confidence0,
        x1, y1, confidence1,
        ...
        x17, y17, confidence17
      ],
      "face_keypoints_2d": [],
      "hand_left_keypoints_2d": [
        lx0, ly0, lconf0,
        ...
        lx20, ly20, lconf20
      ],
      "hand_right_keypoints_2d": [
        rx0, ry0, rconf0,
        ...
        rx20, ry20, rconf20
      ]
    }
  ],
  "canvas_width": 512,
  "canvas_height": 512
}
```

- 좌표 `x, y`는 렌더링된 캔버스 픽셀 절대 좌표 또는 `0.0~1.0` 정규화 좌표를 옵션으로 지원한다.
- 3D 공간 상에서 카메라에 가려지거나 화면 밖으로 벗어난 관절은 `confidence = 0.0`으로 표기한다.

---

## 3. 원클릭 클립보드 복사 규격

1. **`navigator.clipboard.write` API 사용**:
   - 브라우저 비동기 클립보드 API를 사용하여 사용자가 클릭 한 번으로 PNG 이미지를 클립보드에 담을 수 있도록 한다.
   - 복사 후 ComfyUI 브라우저 탭에서 `Ctrl+V`를 누르면 즉시 `LoadImage` 노드로 붙여넣기가 가능하도록 완벽한 이미지 MIME 타입(`image/png`) Blob을 주입한다.

