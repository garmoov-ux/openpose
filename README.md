# 3D Mannequin & OpenPose ControlNet Editor

웹 브라우저 환경에서 3D 인체 마네킹의 관절을 직관적으로 제어하고, Stable Diffusion / ComfyUI 생성을 위한 **OpenPose, Depth, Normal, Canny** 제어 맵을 실시간으로 추출하여 원클릭으로 연동하는 3D 포즈 에디터입니다. (PoseMyArt 스타일 벤치마크)

---

## 1. 주요 핵심 기능

### 1.1. 3D 인체 마네킹 및 골격(Bone) 조작
- **스켈레톤 계층 릭(Rig)**: 머리, 목, 척추, 어깨, 팔(상완/전완/손), 골반, 다리(대퇴부/하퇴부/발)로 이어지는 해부학적 관절 구조
- **정밀 인터랙션**: 관절 콜라이더 클릭 피킹 및 `TransformControls` 3축 회전/이동 기즈모 제어
- **카메라 프리셋**: 정면(Front), 측면(Side), 상단(Top), 전신(Full Body), 상반신(Close-up) 시점 즉시 전환
- **포즈 프리셋 라이브러리**: 기본 서기, 표준 T-포즈, 보행(Walking), 전력 질주(Sprint), 의자 앉기, 격투 가드 등 원클릭 적용

### 1.2. ControlNet 4대 렌더링 모드
- **OpenPose 모드**: COCO 18 키포인트 표준 규격 RGB 컬러 라인 및 관절 포인트 2D 캔버스 드로잉
- **Depth 모드**: 원근 카메라의 비선형 깊이를 선형화한 커스텀 GLSL 셰이더 (가까운 곳: 흰색, 먼 곳: 검정색)
- **Normal 모드**: 카메라 뷰 공간(View-space) 표면 법선 벡터를 RGB 색상으로 매핑하는 커스텀 GLSL 셰이더
- **Canny / Lineart 모드**: 인체 윤곽선 및 와이어프레임 엣지 렌더링

### 1.3. ComfyUI 및 WebUI 원클릭 파이프라인
- **원클릭 클립보드 복사**: 버튼 한 번으로 고해상도(512~1024px) 렌더링 결과(PNG)를 시스템 클립보드에 복사하여 ComfyUI `LoadImage` 노드에 즉시 `Ctrl+V` 붙여넣기 지원
- **ComfyUI 로컬 서버 직결**: 로컬 서버(`http://127.0.0.1:8188`)로 이미지 업로드(`/upload/image`) 및 WebSocket을 통한 실시간 생성 진행률(0~100%) 모니터링
- **OpenPose JSON 내보내기**: OpenPose v1.7.0 표준 규격의 2D 키포인트 JSON 파일 내보내기 지원

---

## 2. 기술 스택 (Tech Stack)

- **프론트엔드 코어**: React 19, TypeScript (Strict Mode), Vite 6
- **3D 렌더링 엔진**: Three.js (`three`), TransformControls, OrbitControls
- **스타일링 & UI**: Tailwind CSS v4, Lucide React 아이콘
- **상태 관리**: Zustand
- **통신 & 파이프라인**: HTML5 Canvas, OffscreenCanvas, Clipboard API, WebSocket

---

## 3. 시작하기 (Quick Start)

### 3.1. 의존성 설치
```bash
npm install
```

### 3.2. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173`으로 접속합니다.

### 3.3. 프로덕션 빌드
```bash
npm run build
```

---

## 4. 프로젝트 디렉터리 아키텍처

```plaintext
src/
├── app/                  # 앱 진입점 및 메인 레이아웃 (App.tsx, main.tsx)
├── components/           # UI 컴포넌트
│   ├── editor/           # 3D 뷰포트 캔버스, 기즈모 툴바, 카메라 툴바
│   ├── sidebar/          # 렌더 모드 탭, 포즈 프리셋 갤러리
│   └── export/           # 캡처, 클립보드 복사, ComfyUI 연동 패널
├── core/                 # 3D 엔진 코어
│   ├── scene/            # Three.js 씬, 조명, 카메라, 렌더 루프
│   ├── mannequin/        # 인체 마네킹 절차적 생성 및 포즈 프리셋
│   ├── pipeline/         # OpenPose 2D 투영 및 스켈레톤 드로잉
│   └── shaders/          # Depth / Normal GLSL 셰이더 머티리얼
├── services/             # ComfyUI REST/WebSocket 연동 서비스
├── stores/               # Zustand 에디터 전역 상태 스토어
├── types/                # TypeScript 전용 타입 인터페이스
└── utils/                # 캔버스 캡처, 클립보드 주입, JSON I/O
```

---

## 5. 라이선스

MIT License

