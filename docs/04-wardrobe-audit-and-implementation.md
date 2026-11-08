# 의상·아이템 시스템 분석 및 구현 설계

기준: 2026-11-08 현재 작업 트리. 이 문서는 [기존 제품 설계](02-engine-and-api-design.md)의 `appearance` 확장 설계이며, [품목 후보 목록](05-wardrobe-catalog.md)과 함께 사용한다. 사용자 요청의 “일상 섹시 아이템”은 **성인 모델용 일상 패션·이너웨어·스타일링**으로 정의한다. 아동·청소년 모델은 별도의 일반 의상 목록만 제공한다.

## 1. 현재 코드에서 확인한 사실

| 영역 | 현재 상태 | 개선 필요성 |
| --- | --- | --- |
| 의상 데이터 | `src/data/themesSolo/outfitsData.json`에 200개 항목이 있다. 범주별로 `lingerie` 30, `micro_bikini` 30, `body_jewelry` 20, `crop_hotpants` 20, `top_only` 25, `topless_bottom` 25, `costume_dress` 25, `color_contrast` 25다. `OutfitItem`은 ID, 범주, 표시명, 긴 프롬프트 문장으로 구성된다. | 일상 상의/하의/아우터/양말/신발이 서로 독립된 품목으로 관리되지 않는다. 200개가 있어도 조합 가능한 200개 의상은 아니다. |
| 데이터 생성 경로 | `scripts/syncThemesSolo.mjs:51-86,166-170`이 외부 `F:/prompt/themes_solo` 텍스트에서 200개 JSON을 다시 생성한다. | 현재 JSON을 직접 고치면 동기화 시 덮어쓸 수 있다. 신규 카탈로그는 별도 파일과 경로로 관리해야 한다. |
| 3D 의상 | `outfitVisualizer.ts:270-338`은 한 `outfitId`를 받아 기본 스킨 메쉬의 삼각형을 두 영역으로 복사해 색칠한다. 영역은 `outfitZoneClassifier.ts`의 8개 범주와 숫자 ID 조건으로 정해진다. | 셔츠·바지·치마·재킷의 실제 실루엣, 옷깃, 주름, 두께, 신발 굽 등은 항목명과 일치하지 않는다. 목록 추가만으로 3D 표현이 늘지 않는다. |
| 액세서리 | `accessoriesAndPropsData.ts`에 신발·스타킹·양말이 `FOOTWEAR_ITEMS` 15개로 합쳐져 있다. `bodyAccessoryMeshes.ts:227-270`은 이 중 하나만 그린다. | 양말+신발, 스타킹+부츠를 동시에 고를 수 없다. 속옷과 겉옷도 레이어가 없다. |
| UI | `OutfitSelectorTab.tsx`는 한 벌 중 하나를 고르는 3열 카드 그리드다. 카드 그림은 범주별 SVG 실루엣을 재사용한다. 액세서리는 `PropsAndAccessoriesTab.tsx`의 여섯 큰 묶음 안에 있다. | 200개 카드에서 부위별 조합을 이해하기 어렵고, 실제 형상과 썸네일이 다를 수 있다. |
| 호환성 | `getOutfitsForMannequin`은 `adult_female`, `adult_male`, `youth_casual`, `senior_classic`, `art_mannequin`별 표시 목록을 다르게 만든다. 반면 `useThemeSoloStore.ts:277-306`의 전체/액세서리 무작위 선택은 현재 모델 호환 목록을 참조하지 않는다. `setSelectedOutfitId` 자체에도 호환성 검사가 없다. | 모델을 바꾸거나 무작위 버튼을 누를 때 해당 모델에 맞지 않는 의상이 남을 수 있다. 특히 성인 전용 스타일이 청소년·아동 모델에 적용되지 않도록 데이터·명령·UI 모두에서 차단해야 한다. |
| 프롬프트 | `promptBuilder.ts`가 의상 `text`와 신발 등 액세서리 `promptEn`을 조합한다. 기존 `text`는 의상 설명 외의 인물·레퍼런스·신체 표현을 함께 포함한다. | 3D의 실제 착용 상태와 생성 문장이 서로 다른 결과를 만들 수 있다. 의상 속성만 가진 구조화된 태그로 분리해야 한다. |

현재 항목 수와 실제 제공 가치가 다른 이유는 **한 벌 선택**, **프롬프트와 3D 형상의 분리 부족**, **액세서리 슬롯 혼합**이다. 신규 품목의 수량을 늘리면서 이 세 지점을 함께 바꿔야 한다.

## 2. 제품 범위와 출시 단위

- 기본 사용자는 `상·하의/원피스`, `속옷`, `수영복`, `양말·스타킹`, `신발`, `액세서리`를 부위별로 조합한다. `코디 세트`는 여러 부위의 품목 ID를 한 번에 적용하는 프리셋이다.
- 스타일 태그는 `일상`, `오피스`, `스포츠`, `라운지`, `데이트`, `성인 이너웨어`, `파티`처럼 **필터**로 사용한다. `섹시`는 카테고리 전체를 대신하지 않고 성인 모델에서만 선택 가능한 스타일 태그로 둔다.
- 3D 품질은 품목별 `renderSupport: 'asset' | 'procedural' | 'color-only' | 'prompt-only'`로 표시한다. `prompt-only` 품목을 “3D 착용 완료”로 표시하지 않는다. 공개 목록의 기본 필터는 `asset` 또는 `procedural`이다.
- 첫 구현에서 모든 품목의 독립 3D 메시를 만들 수는 없다. [카탈로그](05-wardrobe-catalog.md)의 수량은 **제품 데이터 후보**다. 출시 가능한 항목 수는 실제 3D 결과와 프롬프트를 검증한 품목으로만 계산한다.

## 3. 정규화된 의상 데이터 계약

신규 파일은 `src/data/wardrobe/items/*.json`, 타입은 `src/types/wardrobe.ts`에 둔다. 기존 200개 JSON은 읽기 전용 레거시 소스로 남기고 자동 동기화 대상에서 분리한다. 숫자 ID 대신 안정적인 문자열 ID를 쓴다.

```ts
type WardrobeSlot =
  | 'underwear_top' | 'underwear_bottom' | 'base_top' | 'base_bottom'
  | 'one_piece' | 'outerwear' | 'swim_top' | 'swim_bottom' | 'swim_one_piece' | 'swim_cover'
  | 'legwear' | 'socks' | 'footwear'
  | 'neck_accessory' | 'wrist_accessory' | 'head_accessory' | 'face_accessory' | 'bag';

interface WardrobeItemV1 {
  id: string;                 // 예: top.oxford-shirt; 색상은 variant로 분리
  version: 1;
  nameKo: string;
  nameEn: string;
  category: string;
  slots: WardrobeSlot[];
  layer: 'underwear' | 'base' | 'outer' | 'accessory';
  styleTags: string[];
  compatibleProfileIds: string[];
  adultOnly: boolean;
  fitProfile: 'adult-feminine' | 'adult-masculine' | 'adult-unisex' | 'youth';
  coverage: string[];         // torso, pelvis, legs, feet 등 실제 가림 영역
  geometryKey: string;        // 소수의 재사용 가능한 3D 형상 원형
  renderSupport: 'asset' | 'procedural' | 'color-only' | 'prompt-only';
  materials: Array<{ role: string; color: string; fabric: string }>;
  promptTags: string[];       // 의상 자체의 짧고 중립적인 속성만
  iconKey: string;
  sortOrder: number;
  shape?: { neckline?: string; sleeve?: string; rise?: string; legCut?: string;
    heelHeightCm?: number; shaftHeightCm?: number; toeShape?: string;
    opacity?: 'opaque' | 'semi-sheer' | 'sheer';
    closureState?: 'closed' | 'open'; strapLayout?: string; cutoutLayout?: string };
}

interface OutfitCompositionV1 {
  schemaVersion: 1;
  actorId: string;
  itemIds: string[];
  overrides?: Record<string, { color?: string; material?: string }>;
}

interface WardrobeSetV1 {
  id: string;
  nameKo: string;
  itemIds: string[];          // 품목 ID만 참조하고 형상은 중복 정의하지 않음
  adultOnly: boolean;
  styleTags: string[];        // 콘셉트 필터용. 품목 형상을 대체하지 않음
}
```

**규칙:**

1. `slots`는 몸의 점유 영역, `layer`는 겹침 순서를 뜻한다. 속옷과 상의는 함께 입을 수 있고, 양말과 신발도 함께 입을 수 있다.
2. 같은 레이어에서 `one_piece`와 `base_top`·`base_bottom`은 기본적으로 충돌한다. 단, 원피스 위의 `outerwear`는 허용한다. 오버사이즈 셔츠를 원피스로 입는 경우 별도 `geometryKey` 또는 `coverage` 값으로 명시한다.
3. `compatibleProfileIds`는 사용 가능 모델군, `fitProfile`은 메시의 기준 체형이다. **연령 허용 여부와 체형 맞춤 여부를 분리**한다. `adultOnly`는 별도로 검사한다. `art_mannequin`이나 이름만 성인처럼 보이는 모델도 명시적 연령 확인 없이 성인 전용 목록에 넣지 않는다. 아동·청소년 모델은 일반 의상만 노출하고 API 명령에서도 성인 전용 품목을 거절한다.
4. 속성인 색상·원단·길이는 상품 ID를 무한 복제하는 대신 `variant`로 조합한다. 예: 흰색/검정색/남색 셔츠는 하나의 형상에 색상 3개 옵션이다. 품목 수는 실루엣·구조가 다른 경우에만 증가시킨다.
5. 사용자 저장 파일에는 `itemIds`와 선택한 `overrides`를 넣는다. 카탈로그 업데이트 후 품목이 사라졌다면 장면 불러오기에서 명시적 대체 매핑 또는 누락 경고를 낸다.
6. 세트는 `WardrobeSetV1`로 정의하고 모든 참조 ID의 존재와 모델 호환성을 검증한다. 세트에 성인 전용 품목이 하나라도 있으면 세트도 성인 전용이다.
7. 성인 콘셉트의 차이는 이름만으로 만들지 않는다. `opacity`, `closureState`, 스트랩·컷아웃 구조와 원단이 실제 메시·머티리얼·썸네일에 반영되는 경우에만 독립 품목 또는 코디로 노출한다. 소재만 다른 경우에는 variant를 우선한다.

## 4. 3D 구현 전략

### 4.1. 공통 리그와 의상 형상

`src/core/mannequin/wardrobe/` 아래에 `catalog.ts`, `compatibility.ts`, `composition.ts`, `garmentGeometry.ts`, `garmentRenderer.ts`, `dispose.ts`를 둔다. 현재 `classifyTriangleZone(category, outfitId, ...)`의 숫자 조건을 신규 품목에 늘리지 않는다. 3D 형상은 다음 원형부터 구현한다.

| 원형 | 대상 | 최소 형상 기준 |
| --- | --- | --- |
| fitted-top | 티셔츠, 니트, 블라우스, 브라렛 | 어깨·가슴·허리 라인을 따라가는 스킨 메쉬, 넥라인·소매 길이 파라미터 |
| loose-top | 셔츠, 후디, 오버사이즈 티 | 몸 표면에서 일정 간격을 둔 볼륨과 소매, 팔을 올렸을 때 끼임 검사 |
| trousers | 슬랙스, 데님, 조거 | 좌우 다리 분리, 허리·밑위·통·기장 파라미터 |
| shorts-skirt | 반바지, 스커트 | 두 다리 분리 또는 스커트 테두리, 앉는 포즈의 관통 검사 |
| dress | 미니/미디/맥시 원피스 | 상체와 하단 플레어 연결, 앉기/걷기에서 밑단 뒤집힘 검사 |
| outer | 재킷, 카디건, 코트 | 안쪽 의상보다 큰 두께, 여밈 상태, 겹침 우선순위 |
| hosiery | 양말, 타이츠, 스타킹 | 다리 스킨셸과 발 부분, 불투명도·패턴·길이. 신발과 별도 렌더 |
| shoe | 스니커즈, 로퍼, 샌들, 부츠 | 발 전용 메시, 굽 높이·발목 높이·앞코 형상. 발바닥 바닥면 보정 |
| swim-top/bottom | 비키니·탱키니·수영 쇼츠 | 수영복 전용 상·하의 메시와 밴드·스트랩·허리 높이, 물 표면 장면과 무관하게 의상 형상 유지 |
| swim-one-piece | 원피스 수영복·서프 수트 | 몸통과 하단의 연결, 목·등 파임, 소매·다리 기장, 슬라이딩 없는 스킨 변형 |
| underwear | 브리프·드로즈·티팬티 | 허리 밴드, 앞·뒤 커버 패널과 다리 둘레를 분리한 메시. 일반 하의 안에서는 가림 처리 |

FBX 모델마다 체형·rest pose가 다르다. 처음에는 대표 성인 여성·성인 남성·절차형 모델 3개에만 형상 원형을 검증하고, `geometryKey`별 호환 모델 목록을 넓힌다. 메쉬 추출 방식은 기존 스킨 메쉬의 skinIndex/skinWeight를 재사용하되 목·손목·발목 경계의 찢어짐을 확인한다. 헐렁한 옷과 치마는 몸 표면 복제만으로 구현하지 말고 별도 의상 메시 또는 정해진 변형 원형을 사용한다. 메쉬의 몸 관통 문제는 오프셋, 커버 영역, 포즈별 스냅샷으로 판단한다. 신발은 발 본의 회전과 바닥 접촉을 따라간다.

현재 `clearOutfitMeshes`는 geometry만 해제한다. 신규 렌더러는 품목 인스턴스별 생성 geometry/material/texture 소유권을 기록하고 해제한다. 공유 캐시 자산은 참조 수가 0일 때만 해제한다. 내보내기 모드의 Depth/Normal/Lineart에는 **착용한 의상과 신발의 실제 형상**을 포함한다. prompt-only 항목이 제어 맵에 영향을 주는 것으로 오해되지 않도록 결과 패널에 표시한다.

### 4.2. 레이어와 충돌

렌더 순서를 `몸 → 속옷 → 상·하의/원피스 → 아우터 → 양말·스타킹 → 신발 → 액세서리`로 정의한다. 렌더 순서만으로 깊이 문제는 해결되지 않으므로 부위별 셸 오프셋과 z-fighting 검사도 필요하다. 브라와 상의의 겹침, 타이츠와 양말 겹침, 부츠 안쪽의 양말 가시성은 `visibilityMask` 또는 `hideWhenCoveredBy` 규칙으로 제어한다. 사용자가 고른 품목은 상태에 남기되 가려진 영역만 숨긴다.

`composeOutfit(items)`는 순수 함수로 구현한다. 반환값은 활성 품목, 슬롯 충돌, 가려진 영역, `renderSupport` 요약이다. UI와 API 모두 이 함수로 검증한다. 특정 품목을 추가할 때 같은 슬롯의 기존 품목을 자동 교체할지, 추가를 거절할지는 슬롯별로 고정한다. 기본값은 `base_top`, `base_bottom`, `footwear`는 교체, `accessory`는 허용 개수 이내 추가다. 덮어쓴 품목은 Undo에 기록한다.

### 4.3. 수영복·성인 이너웨어·신발의 세부 계약

수영복을 일반 속옷이나 `one_piece`에 억지로 넣지 않는다. 투피스는 `swim_top`과 `swim_bottom`, 원피스는 `swim_one_piece`, 래시가드·보드쇼츠는 각각 독립 품목으로 둔다. `swim_one_piece` 선택 시 같은 몸통의 상·하의 수영복은 교체하고, 래시가드는 지정된 수영 상의 위에 겹칠 수 있다. 비치 커버업은 `swim_cover`로 취급해 수영복 위에 겹친다. 수영복은 여성·남성·중성 체형용 피팅 프로필을 분리한다. 수영복을 선택했다고 속옷 품목을 자동으로 추가하지 않는다.

성인 이너웨어는 여성형·남성형·중성형 형상군을 구분하되 모델 성별 문자열만으로 차단하지 않는다. `fitProfile`과 실제 `geometryKey` 호환성을 검사한다. 티팬티는 **의복의 한 종류**로 다루며, 앞·뒤 패널, 허리 밴드, 다리 둘레의 메시 구조와 커버 영역을 정의한다. 특정 부위 노출을 암시하는 프롬프트 문장은 카탈로그에 저장하지 않는다. 모델 프로필의 성인 여부가 불명확하면 성인 이너웨어를 적용하지 않는다.

신발은 `shoeForm`을 `sneaker / flat / loafer / derby / oxford / monk / pump / sandal / mule / boot / slipper`로 분류한다. `heelHeightCm`, `shaftHeightCm`, `toeShape`, `closure`, `soleThicknessCm`, `leftRightPair`를 데이터에 둔다. 발 본에 신발을 붙이고 굽 높이에 따른 발바닥·지면 관계를 계산한다. 굽을 신었다고 관절 포즈를 임의로 변경하지 않는다. 필요하면 사용자가 선택하는 `footPose`를 별도 명령으로 적용하고 Undo할 수 있게 한다. 부츠의 안쪽 양말 가림, 스타킹의 신발 안쪽 가림, 발끝과 신발 메시 관통을 검증한다.

### 4.4. 대상별 호환 결정 순서

`isCompatible(item, actor)`는 모델 레지스트리의 `ageClass` 확인 → 품목 `adultOnly` 확인 → `fitProfile`과 모델 메시 호환 확인 → 필요한 본·발 앵커 확인 → 현재 착장 슬롯·가림 규칙 확인 순서로 검사한다. `adult_female`과 `adult_male`이라는 현재 `outfitProfile`은 1차 마이그레이션 입력으로만 쓰고, 최종 판단은 `ageClass`, `fitProfile`, `geometryCapabilities`로 한다. 성인 남성 모델에는 남성형 수영복·속옷·구두를, 성인 여성 모델에는 여성형 품목을 기본 추천하되, 호환되는 중성 품목은 양쪽에 제공한다. 모델 변경 시 호환되지 않는 품목을 조용히 다른 의상으로 바꾸지 말고, 보류 목록과 이유를 보여준다.

| 대상 프로필 | 초기 모델 예시 | 기본 목록 | 성인 전용 |
| --- | --- | --- | --- |
| 성인 여성형 | `realistic_woman`, `solo_female`, `college_female`, `office_female`, `married_wife`, `plus_size_body` | `adult-feminine`과 호환되는 `adult-unisex` | 허용. 체형별 의상 메시가 검증된 품목만 표시 |
| 성인 남성형 | `realistic_muscular_male`, `solo_male`, `college_male`, `office_male`, `married_husband` | `adult-masculine`과 호환되는 `adult-unisex` | 허용. 남성형 이너웨어·수영복·구두 별도 피팅 |
| 시니어 성인 | `elderly_grandma`, `elderly_grandpa` | 성인 일반 의상과 시니어 핏 | 연령상 성인이나 품목별 메시 호환 검증 후 허용 |
| 연령이 불명확한 스타일형 | `anime_female`, `anime_basic_male`, `heroic_tall`, `chibi_male`, `procedural` | 기본 일반 의상 | 모델 메타데이터에 성인 설정이 명시되고 메시가 맞을 때만 허용 |
| 아동·청소년 | `teen_*`, `child_*` | 일반 의상 전용 | 거절 |

이 표는 초기 마이그레이션 제안이다. `models.ts`의 나이 문구를 파싱해 자동 판정하지 말고 모델 레지스트리에 `ageClass: 'adult' | 'minor' | 'unknown'`을 명시한다. `unknown`은 성인 전용 품목에 대해서 거절한다. 남성·여성형 분류는 옷의 **피팅 메시**를 가리키며 사용자의 선택을 제한하는 고정 정체성 분류로 쓰지 않는다.

`swim-acc.*`의 슬롯은 `beach-coverup`, `light-kimono`, `mesh-coverup`, `sarong`은 `swim_cover`, `beach-shorts`는 `base_bottom`, 모자·수모는 `head_accessory`, 수경은 `face_accessory`, 가방·파우치는 `bag`, 플립플롭·아쿠아 슈즈는 `footwear`다. 수경과 선글라스는 같은 부위에서 충돌하고, 수모와 넓은 모자는 한 슬롯에서 교체된다.

AI 명령, 저장 파일 복원, 세트 적용, 무작위 선택은 UI와 같은 `isCompatible` 결과를 사용한다. 청소년·아동 모델에는 성인 전용 품목을 검색 결과와 추천에서 제외하고, 외부 명령으로 들어와도 명시적으로 거절한다. 이 검사는 UI 숨김만으로 대체할 수 없다.

### 4.5. 성인 콘셉트 코디와 연령 경계

[카탈로그 Y](05-wardrobe-catalog.md#y-성인-콘셉트-코디-12개--wardrobesetv1)의 12개 세트는 기존 단품 ID를 조합한다. `set-adult.satin-lounge`의 로브는 이너웨어 위 외부 레이어, `set-adult.resort-mesh`의 커버업은 수영복 위 `swim_cover`로 취급한다. 두 조합의 슬롯·가림 규칙을 구현하기 전에는 선택 가능 세트로 세지 않는다. 세트의 `adultOnly`는 모든 진입 경로에서 검사하며, 세트 참조 품목도 개별적으로 `isCompatible`을 통과해야 한다.

성인 대학·프레피 세트는 명시적으로 성인으로 등록된 모델에만 제공한다. 학교 교복이나 미성년자 역할을 성적 콘셉트로 만들지 않는다. 이름, 검색어, 썸네일, 프롬프트, 무작위 추천에도 같은 기준을 적용한다. `ageClass: 'unknown'`이면 성인 코디를 거절한다. 출시 화면에서는 품목 후보 428개와 실제 3D로 검증된 품목·세트 수를 별도로 표시한다.

## 5. 프롬프트와 ComfyUI 데이터

`WardrobeItemV1.promptTags`는 예를 들어 `white cotton oxford shirt`, `dark straight-leg denim jeans`, `black ankle socks`처럼 착용품 자체만 설명한다. 현재 `outfitsData.json`의 긴 `text`를 새 품목의 `promptTags`로 그대로 복사하지 않는다. 해당 문장에는 레퍼런스, 피부, 자세, 신체 묘사가 섞여 있어 새 조합과 충돌한다. `promptBuilder.ts`는 `OutfitCompositionV1`을 순회해 **보이는 품목**의 짧은 태그를 레이어 순서로 결합한다. 색상 override도 반영한다. 3D에 없는 prompt-only 품목은 선택적으로 태그에 포함하되 `3D 미표시`를 분명히 표시한다.

ControlNet의 OpenPose PNG는 의상 형상과 무관한 뼈 투영이다. Depth/Normal/Lineart는 의상 메쉬를 포함할지 `renderSpec.appearanceMode: 'body' | 'dressed'`로 선택한다. 기본값은 `dressed`로 하되 같은 장면의 `body` 맵도 출력할 수 있게 한다. 외부 AI가 의상 변경과 포즈 변경을 한 번에 요청하더라도 장면 명령과 의상 명령을 같은 revision으로 원자적 적용한다.

## 6. UI/UX 구조

상단은 `모델`과 `의상`을 분리한다. 의상 패널의 첫 줄은 현재 착장 슬롯 요약: `속옷 / 상의 / 하의 또는 원피스 / 수영복 / 아우터 / 양말·스타킹 / 신발 / 장신구`. 아래는 `전체`, `일상`, `오피스`, `스포츠`, `데이트`, `라운지`, `수영복`, `성인 이너웨어`, `성인 콘셉트 코디`, `구두·신발` 필터와 검색이다. 성인 콘셉트 코디 안에서는 `이너웨어`, `이브닝`, `리조트`, `데이트`, `대학·프레피` 태그로 찾는다. `여성형 / 남성형 / 중성형`은 의상 메시 피팅 필터로 제공하며, 현재 모델에 맞는 항목을 기본으로 보여준다. 필터는 모델 호환성 검사를 통과한 항목에만 적용한다. 카드는 이름, 실제 3D 미리보기, 색상, 구현 수준을 보여준다. 범주별 동일 SVG를 실제 품목 썸네일로 취급하지 않는다.

품목 선택은 `단품 추가`와 `코디 세트 적용`을 구분한다. 코디 세트는 적용 전 바뀌는 슬롯을 요약한다. `무작위 코디`는 현재 모델·연령·호환 품목·겹침 규칙으로 필터한 뒤 선택하며, 신발만 바꾸는 `무작위 신발` 등도 제공할 수 있다. 품목이 없거나 현재 모델에서 지원하지 않으면 버튼을 비활성화하고 이유를 보여준다. 모바일에서는 착장 슬롯을 가로 스크롤 목록으로 접되, 선택 품목의 이름과 제거 버튼을 항상 확인할 수 있게 한다. Pretendard와 최소 12px 정보 글꼴 원칙은 [UI 문서](03-ui-ux-and-delivery.md)를 따른다.

## 7. 파일별 작업 순서와 수용 기준

1. `src/types/wardrobe.ts`, `src/data/wardrobe/items/*`, `catalog.ts`: 후보 목록과 스키마를 만든다. ID 중복, 필수 필드, 호환 프로필, 프롬프트 태그를 자동 검증한다. 레거시 동기화 스크립트가 신규 파일을 덮지 않음을 확인한다.
2. `compatibility.ts`, `composition.ts`: 성인 전용/모델군/슬롯 충돌/가림 규칙을 순수 함수로 구현한다. UI 선택, 무작위, JSON 가져오기, AI 명령 모두 같은 함수를 사용한다.
3. `garmentGeometry.ts`, `garmentRenderer.ts`: 상의·하의·양말·신발 등 원형을 구현하고 대표 모델 3개에서 자세별 스냅샷을 검토한다. 코디 10회 변경 후 GPU 리소스가 증가만 하지 않도록 검증한다.
4. `useThemeSoloStore.ts`와 `SceneDocumentV1`: `selectedOutfitId`와 묶인 `footwearId`를 `actorId`별 `OutfitCompositionV1`로 마이그레이션한다. 기존 저장값은 매핑 테이블로 복원하거나 지원 불가를 사용자에게 알린다.
5. `OutfitSelectorTab.tsx`, `PropsAndAccessoriesTab.tsx`, `promptBuilder.ts`: 부위별 선택 UI와 태그 조합을 연결한다. 기존 200벌 목록은 `레거시 코디`로 별도 관리한다.

**필수 완료 테스트:** 성인 여성 모델에서 브라렛+셔츠+스커트+스타킹+신발을 함께 착용할 수 있다. 성인 남성 모델에서 드로즈+셔츠+슬랙스+옥스퍼드 구두를 착용할 수 있다. 수영복 상·하의 선택과 원피스 수영복 전환은 슬롯 충돌 규칙대로 동작한다. 신발만 교체해도 나머지 슬롯이 유지된다. 청소년·아동 모델에서는 성인 전용 항목이 UI 검색·무작위·JSON/API 명령 모두에서 거절된다. 3D에서 보이지 않는 품목은 결과 미리보기에 명시된다. 같은 착장을 다시 열면 ID·색상·메시·프롬프트가 일치한다.

**성인 콘셉트 추가 검증:** Y 세트 12개의 참조 ID와 슬롯 충돌을 검사하고, 대표 세트의 레이스·새틴·시스루·로브 여밈 차이가 3D 미리보기 및 Depth/Normal/Lineart에 반영되는지 확인한다. `set-adult.campus-preppy-f/m`은 성인 모델에서만 검색·적용되고 아동·청소년 및 `ageClass: 'unknown'` 모델에서는 무작위·저장 파일 복원·API 명령까지 거절되는지 확인한다.
