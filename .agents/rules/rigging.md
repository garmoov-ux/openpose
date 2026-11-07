# Three.js 씬 및 본(Bone) 릭 조작 표준 규칙

- **적용 대상**: `src/core/` 내 모든 3D 렌더링, 본 조작, 카메라 및 컨트롤러 코드
- **작성 기준**: 2026년 11월
- **원칙**: 웹 브라우저에서 60FPS 이상의 부드러운 인터랙션을 보장하고, 인체의 자연스러운 관절 가동 범위를 유지하며 정밀한 포즈 편집 기능을 제공한다.

---

## 1. 3D 마네킹 및 스켈레톤 본 계층 구조

1. **표준 인체 본 명칭 및 계층 체계**:
   - 인체 골격은 OpenPose 18/25 키포인트 및 SMPL/Mixamo 본 계층 구조와 1:1 매핑 가능하도록 명명한다.
   - 루트 본: `Root` -> `Hips` (골반)
   - 척추/상체: `Spine` -> `Spine1` -> `Spine2` -> `Neck` -> `Head`
   - 좌/우 어깨 및 팔: `Shoulder` -> `Arm` -> `ForeArm` -> `Hand` -> `Finger_*`
   - 좌/우 다리: `UpLeg` -> `Leg` -> `Foot` -> `ToeBase`
2. **관절 회전 제약 (Bone Rotation Constraints)**:
   - 각 관절은 인체 해부학적 가동 범위(ROM: Range of Motion)를 넘어서는 기괴한 꺾임을 방지하도록 최소/최대 회전 각도 제한(Limit Angle)을 둔다.
   - 회전 계산은 짐벌 락(Gimbal Lock)을 방지하기 위해 오일러각 대신 항상 **쿼터니언(THREE.Quaternion)**을 기본 연산 단위로 사용한다.

---

## 2. 인터랙션 및 기즈모 (TransformControls)

1. **관절 피킹 (Joint Raycasting)**:
   - 사용자가 3D 뷰포트에서 마우스로 마네킹의 관절을 클릭할 때 정밀한 선택이 가능하도록 각 주요 조인트 위치에 눈에 보이지 않거나 반투명한 구체(Bounding Sphere 콜라이더)를 배치한다.
   - 선택된 조인트는 시각적 하이라이트(컬러 변경 또는 아웃라인)를 부여한다.
2. **기즈모 제어**:
   - `TransformControls`를 활용하여 회전(Rotate), 이동(Translate) 모드를 단축키(`R`, `W`)로 토글할 수 있게 한다.
   - 로컬 좌표계(Local Space)와 월드 좌표계(World Space) 전환을 지원하여 관절 본의 축을 기준으로 회전할 수 있도록 보장한다.
3. **카메라 조작과 기즈모 간섭 차단**:
   - 기즈모를 드래그하여 조작하는 동안에는 `OrbitControls`가 비활성화(`orbitControls.enabled = false`)되어 시점 회전과 관절 회전이 충돌하지 않도록 이벤트 리스너를 바인딩한다.

---

## 3. 메모리 누수 방지 및 리소스 해제 (Disposal)

1. Three.js 객체는 가비지 컬렉터가 자동으로 GPU 메모리를 비워주지 않으므로, 씬 변경 또는 컴포넌트 언마운트 시 명시적인 Dispose를 실행한다:
   - 기하 구조: `geometry.dispose()`
   - 재질: `material.dispose()` (배열 재질인 경우 순회 해제)
   - 텍스처: `texture.dispose()`
   - 렌더러: `renderer.dispose()` 및 `renderer.forceContextLoss()`
2. 애니메이션 프레임 루프는 `cancelAnimationFrame(requestId)`를 통해 컴포넌트 해제 시 즉시 중단한다.

