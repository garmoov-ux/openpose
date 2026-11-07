# OpenPose & 3D Mannequin Editor 에이전트 운영 지침서 (AGENTS.md)

- **프로젝트 명**: 웹 기반 3D 인체 마네킹 포즈 에디터 및 ComfyUI ControlNet 파이프라인
- **벤치마크 대상**: PoseMyArt (https://posemy.art/ko/)
- **핵심 목표**: 브라우저에서 3D 인체 마네킹의 관절을 직관적으로 제어하고, OpenPose, Depth, Normal, Lineart 제어 맵을 실시간 추출하여 ComfyUI 및 WebUI 생성 워크플로우에 원클릭으로 연동한다.
- **기준 일자**: 2026년 11월

---

## 1. 프로젝트 핵심 기능 및 아키텍처 명세

### 1.1. 주요 기능 범위
1. **3D 인체 마네킹 및 스켈레톤 릭 조작**:
   - 남성/여성/애니메이션 스타일 3D 마네킹 모델(.glb) 서빙 및 렌더링
   - 관절(Head, Neck, Shoulders, Elbows, Wrists, Spine, Hips, Knees, Ankles, Fingers) 개별 피킹 및 3축 회전 기즈모(TransformControls) 제어
   - 인체 해부학적 가동 범위(ROM) 제약 및 대칭 포징(Symmetry Posing)
   - 전신 포즈 프리셋(서기, 앉기, 달리기, 점프, 격투 등) 및 손 포즈 프리셋(주먹, 손가락 펴기, 총 모양 등) 라이브러리
2. **ControlNet 4대 렌더링 모드 추출**:
   - **OpenPose 모드**: COCO 18/25 신체 관절 표준 RGB 컬러 라인 및 포인트 렌더링 (손가락 21 키포인트, 얼굴 랜드마크 포함)
   - **Depth 모드**: 카메라 기준 선형 Z-Depth(Linear Depth) 흑백 명암 렌더링 (Near: 흰색, Far: 검정색)
   - **Normal 모드**: 카메라 뷰 공간(View-space) 표면 법선 벡터 RGB 컬러 렌더링 (좌우 X: R, 상하 Y: G, 전후 Z: B)
   - **Canny / Lineart 모드**: 인체 윤곽선 엣지 및 와이어프레임 렌더링
3. **ComfyUI 및 외부 AI 생성 파이프라인 연동**:
   - **원클릭 클립보드 복사**: 버튼 한 번으로 렌더링 결과(PNG Blob)를 클립보드에 주입하여 ComfyUI의 `LoadImage` 노드에 즉시 `Ctrl+V` 붙여넣기 지원
   - **ComfyUI REST/WebSocket 직결**: 로컬 ComfyUI 서버(`http://127.0.0.1:8188`)로 이미지 업로드(`/upload/image`) 및 프롬프트 큐 트리거(`/prompt`), 실시간 생성 진행률 수신
   - **포즈 데이터 I/O**: OpenPose 표준 포맷 JSON 내보내기/불러오기 및 사용자 커스텀 프리셋 저장

### 1.2. 기술 스택 조합
- **프론트엔드 코어**: React 19 + Vite 6 + TypeScript (Strict Mode)
- **3D 렌더링 엔진**: Three.js (`three`), TransformControls, OrbitControls
- **스타일링 & UI**: Tailwind CSS v4, Lucide React 아이콘
- **상태 관리**: Zustand (씬 설정, 선택된 관절, 렌더링 모드, 프리셋 캐시)
- **이미지 및 캔버스 연산**: HTML5 Canvas, OffscreenCanvas, Clipboard API

---

## 2. 프로젝트 전용 스킬(Skills) 및 MCP 도구 목록

프로젝트 내 구현 및 유지보수 시 아래 프로젝트 전용 스킬과 MCP 서버를 필수로 활용합니다:

### 2.1. 프로젝트 전용 스킬 (.agents/skills/)
1. **`threejs-pose-editor`**:
   - Three.js 씬 초기화, PBR 조명, 스켈레톤 본 피킹, TransformControls 회전 기즈모 바인딩, 카메라 시점 프리셋(정면, 측면, 상단, 전신, 상반신) 제어 가이드.
2. **`controlnet-render-pipeline`**:
   - COCO 18/25 키포인트 컬러 규격 스켈레톤 렌더링, Linear Depth 커스텀 GLSL 셰이더, View-space Normal Map 셰이더 구현 가이드.
3. **`comfyui-integration`**:
   - ComfyUI 로컬 서버(`127.0.0.1:8188`) REST API(`/upload/image`, `/prompt`), WebSocket 진행률 구독, ControlNet 워크플로우 JSON 템플릿 주입 가이드.
4. **`offscreen-canvas-exporter`**:
   - 해상도 독립적(512~2048px) 오프스크린 캔버스 캡처, `navigator.clipboard.write` 클립보드 PNG 복사, 포즈 JSON 직렬화/역직렬화 가이드.

### 2.2. 공용 글로벌 MCP 도구 (%USERPROFILE%\.gemini\config\mcp_config.json)
기존 공용 글로벌 환경에 이미 등록되어 Antigravity에 상주하는 3대 MCP를 그대로 활용합니다 (중복 설치 불필요):
1. **`context7`**: Three.js, React 19, WebGL, ComfyUI 최신 공식 명세 질의.
2. **`playwright`**: 3D 캔버스 뷰포트 E2E 렌더링 검증 및 브라우저 제어 테스트.
3. **`sequential-thinking`**: 3D 쿼터니언 회전 행렬 연산, 관절 릭 제약 조건, 복잡한 셰이더 파이프라인 심층 논리 검증.

---

## 3. 에이전트 역할 분담 및 워크플로우

대규모 기능 개발 및 리팩터링 시 다음 4개 하위 역할로 책임을 나누어 수행합니다:

1. **3D 엔진 및 본 릭 엔지니어 (`core/scene`, `core/mannequin`, `core/controls`)**:
   - 3D 씬 수명 주기 관리, 메모리 해제(Dispose), 마네킹 로딩 및 본 계층 구조 수립, 마우스 피킹 및 기즈모 인터랙션을 전담합니다.
2. **렌더링 파이프라인 및 셰이더 엔지니어 (`core/pipeline`, `core/shaders`)**:
   - OpenPose 2D 스켈레톤 투영 캔버스 드로잉, GLSL 기반 Depth 및 Normal 셰이더 개발, 오프스크린 고해상도 렌더러를 전담합니다.
3. **ComfyUI 및 데이터 I/O 엔지니어 (`services/comfyui`, `utils/export`)**:
   - ComfyUI REST/WebSocket 클라이언트, 클립보드 복사, OpenPose JSON 스키마 변환 및 파일 저장/로드 로직을 전담합니다.
4. **UI/UX 및 프리셋 엔지니어 (`components/`, `stores/`)**:
   - Tailwind CSS 기반 다크 테마 에디터 인터페이스, 포즈/핸드 프리셋 갤러리, 뷰포트 오버레이 툴바, 렌더링 결과 미리보기 모달을 전담합니다.

---

## 4. 파일 비대화 방지 및 코딩 품질 규칙

1. **단일 파일 행 수 제한**:
   - UI 컴포넌트(`.tsx`): 300행 이내 (초과 시 즉시 하위 컴포넌트나 커스텀 훅으로 분리)
   - 3D 및 비즈니스 로직(`.ts`): 350행 이내 (초과 시 전용 모듈로 분할)
   - 단일 함수 본문: 80행 이내
2. **Three.js 렌더 루프 격리**:
   - 초당 60회 실행되는 `requestAnimationFrame` 내부에서는 React `useState` 호출을 일체 금지하며, Ref 및 Three.js 내부 속성만을 갱신하여 렌더 병목을 방지합니다.
3. **이모지 전면 금지**:
   - 소스 코드 주석, 마크다운 문서, UI 텍스트에 이모지를 사용하지 않고 명확한 한국어 텍스트와 전문 용어, 아이콘 라이브러리(`lucide-react`)를 사용합니다.

---

## 5. 슬래시 명령어 활용 가이드

- **`/plan`**: 새로운 제어 모드(예: 얼굴 표정 제어, 멀티 캐릭터 지원)나 아키텍처 변경 전 파일별 수정 계획을 수립할 때 사용합니다.
- **`/boost`**: 3D 쿼터니언 회전 연산 버그, 카메라 투영 오차, 복잡한 셰이더 렌더링 결함을 심층 분석할 때 사용합니다.
- **`/browser`**: 로컬에 띄운 3D 에디터 화면(`http://localhost:5173`)을 직접 브라우저로 띄워 캔버스 렌더링 및 기즈모 반응을 검증할 때 사용합니다.
- **`/goal`**: 프로젝트 초기 보일러플레이트 구축부터 마네킹 렌더링 확인까지 목표를 자율 완수할 때 사용합니다.

