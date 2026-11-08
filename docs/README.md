# 프로젝트 분석과 구현 문서

기준: 2026-11-08, 현재 작업 트리. 이 문서는 구현 담당자가 아래 순서로 읽도록 작성했다.

1. [01-audit-and-priorities.md](01-audit-and-priorities.md): 현재 동작, 확인된 결함, 우선순위와 제거 후보
2. [02-engine-and-api-design.md](02-engine-and-api-design.md): 포즈 계약, 렌더링, AI 제어 API, ComfyUI 구현 설계
3. [03-ui-ux-and-delivery.md](03-ui-ux-and-delivery.md): 화면 구조, Pretendard 적용, 단계별 작업과 완료 기준
4. [04-wardrobe-audit-and-implementation.md](04-wardrobe-audit-and-implementation.md): 의상·아이템 현황, 조합형 데이터와 3D 구현 설계
5. [05-wardrobe-catalog.md](05-wardrobe-catalog.md): 여성·남성 수영복, 성인 이너웨어, 구두·신발을 포함한 416개 후보 목록

## 제품 방향

핵심 결과물은 사람이 직접 편집하거나 AI가 API로 수정한 **동일한 장면 상태**에서 생성한 ControlNet 맵과 JSON이다. 편집 화면은 이 장면 상태를 다루는 클라이언트여야 한다. 의상, 테마, 소품과 프롬프트 문구는 포즈 및 맵 생성의 정확도를 높이는 경우에만 핵심 흐름에 남긴다.

## 확인 범위

- `src/`의 장면, 렌더, 편집, 내보내기, ComfyUI 코드 및 기존 테스트를 정적 검토했다.
- `npm run build` 통과. Vite가 약 1.57 MB의 메인 JS 청크 경고를 출력했다.
- `npm test` 통과: 4개 파일, 18개 테스트. 현재 테스트 통과는 OpenPose 호환성이나 실제 브라우저 캡처를 증명하지 않는다.
- 브라우저에서 마우스 조작, WebGL 출력, ComfyUI 실서버 연결은 이번 분석에서 실행하지 않았다. 관련 항목은 문서에 검증 과제로 표시했다.
- 분석 시작 시 `TransformControlBox.tsx`, `couplePosesLoungeAndPassion.ts`, `soloExtraPosesPart1.ts`, `soloExtraPosesPart2.ts`에 기존 미커밋 변경이 있었다. 이 파일은 수정하지 않았다.
