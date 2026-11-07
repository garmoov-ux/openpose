# 아키텍처 및 파일 비대화 방지 규칙

- **적용 대상**: 프로젝트 내 모든 소스 코드 (.ts, .tsx, .css, .json)
- **작성 기준**: 2026년 11월
- **원칙**: 단일 파일에 과도한 책임이 집중되는 스파게티 코드를 원천 방지하고 컴포넌트 단위의 철저한 관심사 분리를 구현한다.

---

## 1. 파일 및 함수 크기 상한선 (엄격 준수)

단일 파일의 길이가 길어지면 인라인 리팩터링 난이도가 급상승하고 컨텍스트 윈도우 낭비가 심화된다. 다음 행 수 기준을 초과할 수 없다:

1. **UI 컴포넌트 (`.tsx`)**:
   - 권장 200행 이내, **최대 300행 엄격 제한**.
   - 300행 초과 시 즉시 하위 컴포넌트(`components/`)나 커스텀 훅(`hooks/`)으로 분리한다.
2. **3D 로직 및 비즈니스 서비스 (`.ts`)**:
   - 권장 200행 이내, **최대 350행 엄격 제한**.
   - 씬 매니저, 기즈모 컨트롤러, 셰이더 머티리얼 등은 단일 파일에 모두 넣지 않고 모듈별로 세분화한다.
3. **단일 함수 본문**:
   - 권장 40행 이내, **최대 80행 엄격 제한**.
   - 80행 초과 시 순수 함수 유틸리티(`utils/`)로 로직을 추출한다.

---

## 2. 프로젝트 디렉터리 구조 표준

프로젝트는 명확한 레이어드 아키텍처를 따른다:

```plaintext
src/
├── app/                  # 앱 진입점 및 루트 레이아웃 (App.tsx, main.tsx)
├── assets/               # 3D 모델(.glb), 텍스처, 아이콘 정적 자산
├── components/           # UI 컴포넌트
│   ├── common/           # 공용 버튼, 다이얼로그, 슬라이더, 툴팁
│   ├── editor/           # 3D 뷰포트 래퍼, 기즈모 툴바, 카메라 툴바
│   ├── sidebar/          # 포즈 프리셋 라이브러리, 핸드 프리셋, 바디 커스텀 패널
│   └── export/           # 렌더링 모드 선택 및 ComfyUI 전송 패널
├── core/                 # 핵심 3D 엔진 및 파이프라인
│   ├── scene/            # Three.js Scene, Light, Grid, Camera 매니저
│   ├── mannequin/        # 마네킹 로더, 스켈레톤 본 계층 구조, 릭(Rig)
│   ├── controls/         # TransformControls, OrbitControls, 관절 Raycast
│   ├── pipeline/         # OpenPose, Depth, Normal, Canny 렌더 패스
│   └── shaders/          # Depth 셰이더, Normal 셰이더, Outline 셰이더
├── hooks/                # 리액트 커스텀 훅 (useThreeScene, usePoseSync 등)
├── services/             # 외부 연동 서비스 (ComfyUI WebSocket/REST, 포즈 파일 IO)
├── stores/               # 글로벌 상태 관리 (Zustand 또는 전용 Store)
├── types/                # TypeScript 전용 타입 정의 (.d.ts, interface)
└── utils/                # 수학 연산, 쿼터니언 변환, 캔버스 캡처 헬퍼
```

---

## 3. 언어 및 코딩 컨벤션

1. **TypeScript Strict Mode**:
   - `any` 타입 사용을 전면 금지하며, 인터페이스와 타입 유니온을 엄격히 선언한다.
   - 3D 벡터, 오일러각, 쿼터니언 변환 시 Three.js 타입을 명확히 사용한다.
2. **스타일링**:
   - Tailwind CSS v4를 기본으로 사용하며, 인라인 스타일은 3D 캔버스 동적 픽셀 크기 조정 등 불가피한 경우로 한정한다.
3. **상태 관리**:
   - 60FPS 애니메이션 루프 내에서 불필요한 React 리렌더링이 발생하지 않도록 3D 씬 내부 상태와 React UI 상태를 분리한다.
   - Three.js 렌더 루프 내부에서는 Ref 및 순수 객체를 참조하여 React Virtual DOM과의 병목을 차단한다.

