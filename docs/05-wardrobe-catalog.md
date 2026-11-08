# 의상·아이템 후보 카탈로그

이 목록은 **새로 구현할 428개 품목/코디 후보**다. 기존 `outfitsData.json` 200개와 별개이며, 기존 항목을 단순 복제한 수량이 아니다. 기존 문서의 192개 후보에 성인 여성·남성 수영복, 티팬티를 포함한 이너웨어, 구두·신발, 의상과 코디 등 **236개 후보를 추가**했다. 여기에는 단품, 라운지 세트, 코디 세트가 함께 포함된다. 새로 더한 12개는 기존 단품을 조합한 성인 코디이며 신규 의상 메시 수에 포함되지 않는다. 각 코드는 안정적인 `WardrobeItemV1.id` 또는 `WardrobeSetV1.id`가 된다. 색상·원단 변화는 동일 품목의 variant로 관리한다. 실제 3D 구현 상태는 [의상 시스템 설계](04-wardrobe-audit-and-implementation.md)의 `renderSupport`로 개별 추적한다. 성인 전용 이너웨어·스타일은 **성인 모델에서만** 사용한다.

| 묶음 | 후보 수 | 주요 대상 |
| --- | ---: | --- |
| A~M: 기존 확장 목록 | 192 | 일상복, 기본 이너웨어, 신발, 일반 아동·청소년 의상 |
| N~O: 성인 수영복 | 44 | 여성형 24, 남성형 20 |
| P~Q: 성인 이너웨어 추가 | 40 | 여성형 20, 남성형 20 |
| R~S: 성인 신발 추가 | 60 | 여성형 30, 남성형 30 |
| T~U: 성인 의상 추가 | 40 | 여성형 20, 남성형 20 |
| V~X: 레그웨어·코디·액세서리 추가 | 40 | 16 + 12 + 12 |
| Y: 성인 콘셉트 코디 추가 | 12 | 기존 단품을 조합한 세트, 신규 메시 0 |
| **총계** | **428** | 후보 수이며 출시 완료 수와 다름 |

## A. 일상 상의 20개 — `base_top`

형상 원형: `fitted-top`, `loose-top`. 소매·기장·넥라인 차이를 파라미터로 구현한다.

1. `top.crew-tee` — 라운드 반팔 티셔츠
2. `top.vneck-tee` — 브이넥 반팔 티셔츠
3. `top.long-sleeve-tee` — 긴팔 기본 티셔츠
4. `top.ribbed-tank` — 골지 민소매
5. `top.sleeveless-blouse` — 민소매 블라우스
6. `top.oxford-shirt` — 옥스퍼드 셔츠
7. `top.linen-shirt` — 린넨 셔츠
8. `top.denim-shirt` — 데님 셔츠
9. `top.striped-shirt` — 스트라이프 셔츠
10. `top.polo-shirt` — 폴로 셔츠
11. `top.henley` — 헨리넥 티셔츠
12. `top.turtleneck` — 터틀넥 니트
13. `top.mock-neck` — 모크넥 니트
14. `top.fine-knit` — 얇은 라운드 니트
15. `top.chunky-knit` — 두꺼운 케이블 니트
16. `top.sweatshirt` — 기본 맨투맨
17. `top.zip-hoodie` — 집업 후디
18. `top.pullover-hoodie` — 풀오버 후디
19. `top.sport-jersey` — 스포츠 저지
20. `top.compression-top` — 기능성 컴프레션 상의

## B. 성인 스타일 상의 16개 — `base_top`, `adultOnly`

형상 원형: 크롭·오프숄더·랩·메시 변형. 노출 수준은 품목 속성으로 관리하고 성인 모델에만 표시한다.

1. `adult-top.crop-tee` — 크롭 반팔 티셔츠
2. `adult-top.crop-knit` — 크롭 니트
3. `adult-top.off-shoulder-knit` — 오프숄더 니트
4. `adult-top.one-shoulder-top` — 원숄더 탑
5. `adult-top.halter-top` — 홀터넥 탑
6. `adult-top.satin-camisole` — 새틴 캐미솔
7. `adult-top.lace-trim-camisole` — 레이스 트림 캐미솔
8. `adult-top.wrap-blouse` — 랩 블라우스
9. `adult-top.tie-front-blouse` — 앞매듭 블라우스
10. `adult-top.sheer-overlay-blouse` — 시스루 오버레이 블라우스
11. `adult-top.mesh-layer-top` — 메시 레이어드 탑
12. `adult-top.sweetheart-top` — 스위트하트 넥라인 탑
13. `adult-top.bustier-style-top` — 뷔스티에 스타일 상의
14. `adult-top.corset-style-top` — 코르셋 스타일 상의
15. `adult-top.backless-knit` — 백리스 니트
16. `adult-top.fitted-bodysuit` — 피트되는 바디수트 상의

## C. 하의 20개 — `base_bottom`

형상 원형: `trousers`, `shorts-skirt`. 허리 높이·바지통·기장·플레어를 명시한다.

1. `bottom.straight-jeans` — 스트레이트 데님
2. `bottom.slim-jeans` — 슬림 데님
3. `bottom.wide-jeans` — 와이드 데님
4. `bottom.bootcut-jeans` — 부츠컷 데님
5. `bottom.cargo-pants` — 카고 팬츠
6. `bottom.chino-pants` — 치노 팬츠
7. `bottom.tailored-slacks` — 테일러드 슬랙스
8. `bottom.wide-slacks` — 와이드 슬랙스
9. `bottom.jogger-pants` — 조거 팬츠
10. `bottom.track-pants` — 트랙 팬츠
11. `bottom.linen-pants` — 린넨 팬츠
12. `bottom.leggings` — 기본 레깅스
13. `bottom.bike-shorts` — 바이커 쇼츠
14. `bottom.denim-shorts` — 데님 반바지
15. `bottom.tailored-shorts` — 테일러드 반바지
16. `bottom.pleated-mini-skirt` — 플리츠 미니 스커트
17. `bottom.a-line-skirt` — A라인 스커트
18. `bottom.pencil-skirt` — 펜슬 스커트
19. `bottom.satin-midi-skirt` — 새틴 미디 스커트
20. `bottom.maxi-skirt` — 맥시 스커트

미니 스커트 등 성인 스타일 변형은 별도 `adultOnly` 태그로 분리한다. 일반 하의 ID를 청소년 모델에 제공할 때는 적절한 연령과 체형용 메시를 별도로 지정한다.

## D. 원피스·점프수트 12개 — `one_piece`

1. `dress.tshirt-dress` — 티셔츠 원피스
2. `dress.shirt-dress` — 셔츠 원피스
3. `dress.wrap-dress` — 랩 원피스
4. `dress.a-line-midi` — A라인 미디 원피스
5. `dress.flared-maxi` — 플레어 맥시 원피스
6. `dress.sleeveless-knit` — 민소매 니트 원피스
7. `dress.ribbed-long` — 골지 롱 원피스
8. `dress.satin-slip` — 새틴 슬립 원피스, 성인 전용
9. `dress.off-shoulder` — 오프숄더 원피스, 성인 전용
10. `dress.bodycon-midi` — 바디콘 미디 원피스, 성인 전용
11. `dress.denim-overall` — 데님 멜빵 원피스
12. `dress.utility-jumpsuit` — 유틸리티 점프수트

## E. 아우터 12개 — `outerwear`

1. `outer.denim-jacket` — 데님 재킷
2. `outer.bomber-jacket` — 봄버 재킷
3. `outer.leather-jacket` — 레더 재킷
4. `outer.cropped-jacket` — 크롭 재킷, 성인 전용 스타일
5. `outer.tailored-blazer` — 테일러드 블레이저
6. `outer.double-breasted-blazer` — 더블 브레스티드 블레이저
7. `outer.knit-cardigan` — 니트 카디건
8. `outer.long-cardigan` — 롱 카디건
9. `outer.trench-coat` — 트렌치코트
10. `outer.wool-coat` — 울 코트
11. `outer.puffer-vest` — 패딩 베스트
12. `outer.windbreaker` — 윈드브레이커

## F. 성인 이너웨어 상의 12개 — `underwear_top`, `adultOnly`

형상 원형: 스포츠형, 브라렛형, 밴드형, 캐미솔형. 이 카탈로그는 의복 모델링 사양이며 프롬프트에 신체 묘사를 추가하지 않는다.

1. `inner-top.sports-bra` — 스포츠 브라
2. `inner-top.seamless-bralette` — 심리스 브라렛
3. `inner-top.cotton-bralette` — 코튼 브라렛
4. `inner-top.lace-bralette` — 레이스 브라렛
5. `inner-top.satin-bralette` — 새틴 브라렛
6. `inner-top.longline-bralette` — 롱라인 브라렛
7. `inner-top.balcony-bra` — 발코니형 브라
8. `inner-top.strapless-bra` — 스트랩리스 브라
9. `inner-top.racerback-bra` — 레이서백 브라
10. `inner-top.bandeau` — 밴도형 이너웨어
11. `inner-top.soft-cup-bra` — 소프트컵 브라
12. `inner-top.silk-camisole` — 실크 이너 캐미솔

## G. 성인 이너웨어 하의 12개 — `underwear_bottom`, `adultOnly`

1. `inner-bottom.cotton-brief` — 코튼 브리프
2. `inner-bottom.seamless-brief` — 심리스 브리프
3. `inner-bottom.high-waist-brief` — 하이웨이스트 브리프
4. `inner-bottom.boyshort` — 보이쇼츠
5. `inner-bottom.bikini-brief` — 비키니 브리프
6. `inner-bottom.lace-brief` — 레이스 브리프
7. `inner-bottom.satin-brief` — 새틴 브리프
8. `inner-bottom.mesh-overlay-brief` — 메시 오버레이 브리프
9. `inner-bottom.fitted-boxer` — 피트되는 드로즈
10. `inner-bottom.classic-boxer` — 클래식 박서
11. `inner-bottom.sport-compression-short` — 스포츠 이너 쇼츠
12. `inner-bottom.shapewear-short` — 보정 쇼츠

## H. 라운지·잠옷 12개 — `one_piece` 또는 `base_top + base_bottom`

세트는 아래 `set.*`과 마찬가지로 실제 단품 ID를 참조한다. 하나의 프롬프트 문장으로만 구성하지 않는다.

1. `lounge.cotton-pajama-set` — 코튼 파자마 세트
2. `lounge.satin-pajama-set` — 새틴 파자마 세트
3. `lounge.linen-pajama-set` — 린넨 파자마 세트
4. `lounge.oversized-tee-set` — 오버사이즈 티·쇼츠 세트
5. `lounge.knit-home-set` — 니트 홈웨어 세트
6. `lounge.sweat-home-set` — 스웨트 홈웨어 세트
7. `lounge.robe-cotton` — 코튼 로브
8. `lounge.robe-waffle` — 와플 로브
9. `lounge.robe-satin` — 새틴 로브, 성인 전용 스타일
10. `lounge.slip-nightdress` — 슬립 나이트드레스, 성인 전용
11. `lounge.long-nightdress` — 롱 나이트드레스
12. `lounge.fleece-onesie` — 플리스 원피스 홈웨어

## I. 양말·스타킹·레그웨어 18개 — `socks` / `legwear`

양말과 신발은 서로 다른 슬롯이다. 발목·종아리·무릎·허벅지 길이와 불투명도·패턴을 별도 속성으로 둔다.

1. `sock.no-show` — 페이크 삭스
2. `sock.ankle-cotton` — 코튼 발목 양말
3. `sock.ankle-ribbed` — 골지 발목 양말
4. `sock.crew-cotton` — 코튼 크루 삭스
5. `sock.crew-sport` — 스포츠 크루 삭스
6. `sock.crew-striped` — 스트라이프 크루 삭스
7. `sock.knee-cotton` — 코튼 니삭스
8. `sock.wool-winter` — 울 겨울 양말
9. `sock.sheer-ankle` — 시어 발목 양말, 성인 전용 스타일
10. `sock.lace-trim-ankle` — 레이스 트림 발목 양말, 성인 전용 스타일
11. `legwear.opaque-tights` — 불투명 타이츠
12. `legwear.sheer-tights` — 시어 타이츠, 성인 전용 스타일
13. `legwear.patterned-tights` — 패턴 타이츠
14. `legwear.fishnet-tights` — 망사 패턴 타이츠, 성인 전용
15. `legwear.thigh-high-stockings` — 허벅지 길이 스타킹, 성인 전용
16. `legwear.knee-high-stockings` — 무릎 길이 스타킹
17. `legwear.compression-stockings` — 컴프레션 스타킹
18. `legwear.leg-warmers` — 니트 레그워머

## J. 신발 20개 — `footwear`

형상 원형: `sneaker`, `flat`, `sandal`, `heel`, `boot`. 기존 `FOOTWEAR_ITEMS`에서 양말·스타킹을 분리한다.

1. `shoe.canvas-sneaker` — 캔버스 스니커즈
2. `shoe.running-sneaker` — 러닝화
3. `shoe.chunky-sneaker` — 청키 스니커즈
4. `shoe.low-top-leather` — 로우탑 가죽 스니커즈
5. `shoe.high-top-sneaker` — 하이탑 스니커즈
6. `shoe.penny-loafer` — 페니 로퍼
7. `shoe.tassel-loafer` — 태슬 로퍼
8. `shoe.mary-jane` — 메리제인 슈즈
9. `shoe.ballet-flat` — 발레 플랫
10. `shoe.oxford` — 옥스퍼드 구두
11. `shoe.chelsea-boot` — 첼시 부츠
12. `shoe.ankle-boot` — 앵클부츠
13. `shoe.combat-boot` — 워커 부츠
14. `shoe.knee-boot` — 무릎 길이 부츠
15. `shoe.slide-sandal` — 슬라이드 샌들
16. `shoe.strappy-sandal` — 스트랩 샌들
17. `shoe.platform-sandal` — 플랫폼 샌들
18. `shoe.block-heel` — 블록힐, 성인 전용 스타일
19. `shoe.slingback-heel` — 슬링백 힐, 성인 전용 스타일
20. `shoe.stiletto-heel` — 스틸레토 힐, 성인 전용 스타일

## K. 일상 스타일 액세서리 14개 — 독립 슬롯

액세서리는 현재 `neck/wrist/legs` 한 품목 제한에서 벗어나 슬롯별 1~3개를 허용하되 렌더 가능한 것만 기본 목록에 노출한다.

1. `acc.canvas-tote` — 캔버스 토트백
2. `acc.mini-shoulder-bag` — 미니 숄더백
3. `acc.crossbody-bag` — 크로스백
4. `acc.leather-belt` — 가죽 벨트
5. `acc.slim-belt` — 슬림 벨트
6. `acc.baseball-cap` — 볼캡
7. `acc.bucket-hat` — 버킷햇
8. `acc.silk-scarf` — 실크 스카프
9. `acc.chain-necklace` — 체인 목걸이
10. `acc.pearl-necklace` — 진주 목걸이
11. `acc.small-hoop-earrings` — 작은 링 귀걸이
12. `acc.simple-bracelet` — 심플 팔찌
13. `acc.wrist-watch` — 손목시계
14. `acc.sunglasses` — 선글라스

## L. 성인 코디 세트 12개 — 단품 ID의 조합

세트는 새로운 의상 메시가 아니라 슬롯별 품목의 조합이다. 아래 구성의 색상은 별도 variant로 선택한다. 성인 전용 품목을 포함한 세트에는 `adultOnly`를 적용한다.

1. `set.casual-denim` — 라운드 티 + 스트레이트 데님 + 캔버스 스니커즈
2. `set.weekend-linen` — 린넨 셔츠 + 린넨 팬츠 + 스트랩 샌들
3. `set.office-classic` — 옥스퍼드 셔츠 + 테일러드 슬랙스 + 로퍼
4. `set.office-skirt` — 블라우스 + 펜슬 스커트 + 블록힐, 성인 전용
5. `set.sport-training` — 컴프레션 상의 + 조거 팬츠 + 러닝화
6. `set.street-layered` — 기본 티 + 데님 재킷 + 카고 팬츠 + 하이탑
7. `set.knit-autumn` — 얇은 니트 + 와이드 데님 + 앵클부츠
8. `set.date-satin` — 새틴 캐미솔 + 새틴 미디 스커트 + 슬링백 힐, 성인 전용
9. `set.evening-minimal` — 랩 블라우스 + 슬랙스 + 스틸레토 힐, 성인 전용
10. `set.lounge-soft` — 니트 홈웨어 + 코튼 양말
11. `set.rainy-day` — 맨투맨 + 스트레이트 데님 + 첼시 부츠 + 트렌치코트
12. `set.summer-dress` — 셔츠 원피스 + 발목 양말 + 메리제인 슈즈

세트의 초기 `itemIds` 매핑은 다음과 같다. `lounge.*` 역시 같은 원칙으로 상·하의 단품을 추가 정의하거나, 로브/원피스처럼 하나의 실제 형상으로 구현한다.

| 세트 ID | `itemIds` |
| --- | --- |
| `set.casual-denim` | `top.crew-tee`, `bottom.straight-jeans`, `shoe.canvas-sneaker` |
| `set.weekend-linen` | `top.linen-shirt`, `bottom.linen-pants`, `shoe.strappy-sandal` |
| `set.office-classic` | `top.oxford-shirt`, `bottom.tailored-slacks`, `shoe.penny-loafer` |
| `set.office-skirt` | `top.sleeveless-blouse`, `bottom.pencil-skirt`, `shoe.block-heel` |
| `set.sport-training` | `top.compression-top`, `bottom.jogger-pants`, `shoe.running-sneaker` |
| `set.street-layered` | `top.crew-tee`, `outer.denim-jacket`, `bottom.cargo-pants`, `shoe.high-top-sneaker` |
| `set.knit-autumn` | `top.fine-knit`, `bottom.wide-jeans`, `shoe.ankle-boot` |
| `set.date-satin` | `adult-top.satin-camisole`, `bottom.satin-midi-skirt`, `shoe.slingback-heel` |
| `set.evening-minimal` | `adult-top.wrap-blouse`, `bottom.tailored-slacks`, `shoe.stiletto-heel` |
| `set.lounge-soft` | `lounge.knit-home-set`, `sock.crew-cotton` |
| `set.rainy-day` | `top.sweatshirt`, `bottom.straight-jeans`, `shoe.chelsea-boot`, `outer.trench-coat` |
| `set.summer-dress` | `dress.shirt-dress`, `sock.ankle-cotton`, `shoe.mary-jane` |

## M. 아동·청소년용 일반 의상 12개 — `youth_casual`

이 묶음은 성인 이너웨어·성인 스타일 목록과 별도다. 모델 연령과 체형에 맞춘 메시를 만들고, 일반 의상 태그만 허용한다.

1. `youth.cotton-tee` — 코튼 반팔 티셔츠
2. `youth.long-sleeve-tee` — 긴팔 티셔츠
3. `youth.school-cardigan` — 기본 카디건
4. `youth.zip-hoodie` — 집업 후디
5. `youth.sport-jacket` — 체육복 재킷
6. `youth.denim-overalls` — 데님 멜빵바지
7. `youth.cotton-shorts` — 코튼 반바지
8. `youth.straight-pants` — 일자 바지
9. `youth.pleated-skirt` — 일반 플리츠 스커트
10. `youth.crew-socks` — 크루 양말
11. `youth.school-sneaker` — 기본 스니커즈
12. `youth.rain-boots` — 레인부츠

## N. 성인 여성형 수영복 24개 — `swim_top` / `swim_bottom` / `swim_one_piece`

모두 `adultOnly: true`, `fitProfile: adult-feminine`. 상·하의형과 원피스형을 별도 슬롯으로 등록한다. 색상·패턴은 variant다.

슬롯 매핑: 1~8 `swim_top`, 9~14 `swim_bottom`, 15~24 `swim_one_piece`. 래시가드는 수영 상의 위에 겹칠 수 있는 `layer: outer` 변형을 허용한다.

1. `swim-f.triangle-top` — 트라이앵글 비키니 상의
2. `swim-f.bandeau-top` — 밴도 비키니 상의
3. `swim-f.halter-top` — 홀터넥 비키니 상의
4. `swim-f.sport-top` — 스포츠형 비키니 상의
5. `swim-f.longline-top` — 롱라인 비키니 상의
6. `swim-f.rashguard-crop` — 크롭 래시가드 상의
7. `swim-f.rashguard-long` — 긴팔 래시가드 상의
8. `swim-f.tankini-top` — 탱키니 상의
9. `swim-f.classic-bottom` — 기본 비키니 하의
10. `swim-f.high-waist-bottom` — 하이웨이스트 비키니 하의
11. `swim-f.side-tie-bottom` — 옆매듭 비키니 하의
12. `swim-f.sport-bottom` — 스포츠형 비키니 하의
13. `swim-f.skirted-bottom` — 스커트형 수영 하의
14. `swim-f.board-short` — 여성형 보드쇼츠
15. `swim-f.classic-one-piece` — 기본 원피스 수영복
16. `swim-f.sport-one-piece` — 스포츠 원피스 수영복
17. `swim-f.halter-one-piece` — 홀터 원피스 수영복
18. `swim-f.one-shoulder-one-piece` — 원숄더 원피스 수영복
19. `swim-f.square-neck-one-piece` — 스퀘어넥 원피스 수영복
20. `swim-f.cutout-one-piece` — 컷아웃 원피스 수영복
21. `swim-f.high-neck-one-piece` — 하이넥 원피스 수영복
22. `swim-f.short-sleeve-surf-suit` — 반팔 서프 수트
23. `swim-f.long-sleeve-surf-suit` — 긴팔 서프 수트
24. `swim-f.swim-dress` — 스윔 드레스

## O. 성인 남성형 수영복 20개 — `swim_top` / `swim_bottom` / `swim_one_piece`

모두 `adultOnly: true`, `fitProfile: adult-masculine`. 상의가 있는 수영복은 독립 상의로 조합한다. 보드쇼츠와 브리프류는 허리 높이·기장·커버 패널이 다르다.

슬롯 매핑: 1~15 `swim_bottom`, 16~18 `swim_top`, 19~20 `swim_one_piece`.

1. `swim-m.classic-trunks` — 기본 수영 트렁크
2. `swim-m.short-trunks` — 짧은 수영 트렁크
3. `swim-m.long-trunks` — 긴 수영 트렁크
4. `swim-m.boardshort-mid` — 미디 보드쇼츠
5. `swim-m.boardshort-long` — 롱 보드쇼츠
6. `swim-m.elastic-waist-short` — 밴딩 수영 쇼츠
7. `swim-m.drawstring-short` — 드로스트링 수영 쇼츠
8. `swim-m.square-cut` — 스퀘어컷 수영복
9. `swim-m.classic-brief` — 기본 수영 브리프
10. `swim-m.sport-brief` — 스포츠 수영 브리프
11. `swim-m.low-rise-brief` — 로우라이즈 수영 브리프
12. `swim-m.jammer` — 무릎 위 재머 수영복
13. `swim-m.long-jammer` — 무릎 길이 재머 수영복
14. `swim-m.compression-swim-short` — 컴프레션 수영 쇼츠
15. `swim-m.surf-legging` — 서프 레깅스
16. `swim-m.rashguard-short` — 반팔 래시가드 상의
17. `swim-m.rashguard-long` — 긴팔 래시가드 상의
18. `swim-m.sleeveless-rashguard` — 민소매 래시가드 상의
19. `swim-m.short-surf-suit` — 반팔 서프 수트
20. `swim-m.full-surf-suit` — 긴팔 서프 수트

## P. 성인 여성형 이너웨어 하의 추가 20개 — `underwear_bottom`

모두 `adultOnly: true`, `fitProfile: adult-feminine`. 티팬티는 커버 패널·허리 밴드·다리 둘레 구조로 구분한다. 품목명 외의 신체 묘사는 데이터에 넣지 않는다.

1. `inner-f.classic-thong` — 클래식 티팬티
2. `inner-f.cotton-thong` — 코튼 티팬티
3. `inner-f.seamless-thong` — 심리스 티팬티
4. `inner-f.lace-thong` — 레이스 티팬티
5. `inner-f.satin-thong` — 새틴 티팬티
6. `inner-f.high-waist-thong` — 하이웨이스트 티팬티
7. `inner-f.low-rise-thong` — 로우라이즈 티팬티
8. `inner-f.v-waist-thong` — 브이 허리선 티팬티
9. `inner-f.tanga` — 탕가형 팬티
10. `inner-f.g-string` — G스트링형 티팬티
11. `inner-f.bikini-cut` — 비키니컷 팬티
12. `inner-f.cheeky-cut` — 치키컷 팬티
13. `inner-f.high-leg-brief` — 하이레그 브리프
14. `inner-f.mid-rise-brief` — 미드라이즈 브리프
15. `inner-f.sport-brief` — 스포츠 브리프
16. `inner-f.sport-boyshort` — 스포츠 보이쇼츠
17. `inner-f.mesh-panel-brief` — 메시 패널 브리프
18. `inner-f.bamboo-brief` — 대나무 섬유 브리프
19. `inner-f.modal-brief` — 모달 브리프
20. `inner-f.period-brief` — 흡수형 기능성 브리프

## Q. 성인 남성형 이너웨어 20개 — `underwear_bottom` / `underwear_top`

모두 `adultOnly: true`, `fitProfile: adult-masculine`. 허리 밴드·다리 길이·앞 패널을 별도 형상 파라미터로 둔다.

슬롯 매핑: 1~17 `underwear_bottom`, 18~20 `underwear_top`.

1. `inner-m.cotton-boxer` — 코튼 박서
2. `inner-m.modal-boxer` — 모달 박서
3. `inner-m.loose-boxer` — 루즈 박서
4. `inner-m.trunk` — 트렁크
5. `inner-m.short-trunk` — 숏 트렁크
6. `inner-m.boxer-brief` — 박서 브리프
7. `inner-m.long-boxer-brief` — 롱 박서 브리프
8. `inner-m.classic-brief` — 클래식 브리프
9. `inner-m.low-rise-brief` — 로우라이즈 브리프
10. `inner-m.sport-brief` — 스포츠 브리프
11. `inner-m.seamless-brief` — 심리스 브리프
12. `inner-m.compression-short` — 컴프레션 이너 쇼츠
13. `inner-m.thermal-long-john` — 보온 내의 하의
14. `inner-m.mesh-sport-boxer` — 메시 스포츠 박서
15. `inner-m.silk-boxer` — 실크 박서
16. `inner-m.mens-thong` — 남성형 티팬티
17. `inner-m.mens-tanga` — 남성형 탕가
18. `inner-m.sleeveless-undershirt` — 민소매 러닝 이너웨어
19. `inner-m.thermal-undershirt` — 보온 내의 상의
20. `inner-m.compression-undershirt` — 컴프레션 이너 상의

## R. 성인 여성형 구두·신발 추가 30개 — `footwear`

`adultOnly: true`, `fitProfile: adult-feminine`. 기존 `shoe.*` 20개와 구별되는 굽, 앞코, 여밈, 부츠 높이의 형상 차이다. 색상만 다른 품목은 variant로 처리한다.

1. `shoe-f.kitten-heel-pump` — 키튼힐 펌프스
2. `shoe-f.mid-heel-pump` — 미들힐 펌프스
3. `shoe-f.high-heel-pump` — 하이힐 펌프스
4. `shoe-f.pointed-pump` — 포인티드 토 펌프스
5. `shoe-f.round-pump` — 라운드 토 펌프스
6. `shoe-f.square-toe-pump` — 스퀘어 토 펌프스
7. `shoe-f.dorsay-pump` — 도르세 펌프스
8. `shoe-f.t-strap-heel` — T스트랩 힐
9. `shoe-f.ankle-strap-heel` — 앵클 스트랩 힐
10. `shoe-f.platform-pump` — 플랫폼 펌프스
11. `shoe-f.wedge-heel` — 웨지힐
12. `shoe-f.slingback-flat` — 슬링백 플랫
13. `shoe-f.slingback-kitten` — 슬링백 키튼힐
14. `shoe-f.mule-flat` — 플랫 뮬
15. `shoe-f.mule-heel` — 힐 뮬
16. `shoe-f.peep-toe-heel` — 오픈토 힐
17. `shoe-f.espadrille-wedge` — 에스파드리유 웨지
18. `shoe-f.gladiator-sandal` — 글래디에이터 샌들
19. `shoe-f.fisherman-sandal` — 피셔맨 샌들
20. `shoe-f.strappy-heel-sandal` — 스트랩 힐 샌들
21. `shoe-f.platform-mary-jane` — 플랫폼 메리제인
22. `shoe-f.mary-jane-heel` — 힐 메리제인
23. `shoe-f.sock-boot` — 삭스 부츠
24. `shoe-f.lace-up-ankle-boot` — 레이스업 앵클부츠
25. `shoe-f.western-boot` — 웨스턴 부츠
26. `shoe-f.mid-calf-boot` — 미드카프 부츠
27. `shoe-f.over-knee-boot` — 오버니 부츠
28. `shoe-f.platform-boot` — 플랫폼 부츠
29. `shoe-f.suede-loafer` — 스웨이드 로퍼
30. `shoe-f.pointed-flat` — 포인티드 플랫

## S. 성인 남성형 구두·신발 추가 30개 — `footwear`

`adultOnly: true`, `fitProfile: adult-masculine`. 드레스화는 앞코와 끈·버클·측면 장식 차이를, 부츠는 샤프트 높이를 형상으로 구현한다.

1. `shoe-m.cap-toe-oxford` — 캡토 옥스퍼드
2. `shoe-m.plain-toe-oxford` — 플레인토 옥스퍼드
3. `shoe-m.wholecut-oxford` — 홀컷 옥스퍼드
4. `shoe-m.brogue-oxford` — 브로그 옥스퍼드
5. `shoe-m.wingtip-oxford` — 윙팁 옥스퍼드
6. `shoe-m.plain-derby` — 플레인 더비
7. `shoe-m.cap-toe-derby` — 캡토 더비
8. `shoe-m.brogue-derby` — 브로그 더비
9. `shoe-m.apron-toe-derby` — 에이프런 토 더비
10. `shoe-m.single-monk` — 싱글 몽크스트랩
11. `shoe-m.double-monk` — 더블 몽크스트랩
12. `shoe-m.bit-loafer` — 비트 로퍼
13. `shoe-m.venetian-loafer` — 베네시안 로퍼
14. `shoe-m.suede-penny-loafer` — 스웨이드 페니 로퍼
15. `shoe-m.driving-shoe` — 드라이빙 슈즈
16. `shoe-m.boat-shoe` — 보트 슈즈
17. `shoe-m.desert-boot` — 데저트 부츠
18. `shoe-m.chukka-boot` — 처카 부츠
19. `shoe-m.chelsea-leather` — 가죽 첼시 부츠
20. `shoe-m.service-boot` — 서비스 부츠
21. `shoe-m.work-boot` — 워크 부츠
22. `shoe-m.hiking-boot` — 하이킹 부츠
23. `shoe-m.dress-boot` — 드레스 부츠
24. `shoe-m.leather-low-sneaker` — 가죽 로우 스니커즈
25. `shoe-m.retro-runner` — 레트로 러닝화
26. `shoe-m.training-sneaker` — 트레이닝화
27. `shoe-m.basketball-high` — 하이탑 농구화
28. `shoe-m.minimal-slip-on` — 미니멀 슬립온
29. `shoe-m.leather-sandal` — 가죽 샌들
30. `shoe-m.recovery-slide` — 리커버리 슬라이드

## T. 성인 여성형 의상 추가 20개 — `base_top` / `base_bottom` / `one_piece`

`adultOnly: true`, `fitProfile: adult-feminine`. 일상·오피스·파티 스타일을 확장하되 색상 복제는 품목 수에 넣지 않는다.

1. `adult-f.ruched-top` — 셔링 탑
2. `adult-f.peplum-blouse` — 페플럼 블라우스
3. `adult-f.cowl-neck-top` — 카울넥 탑
4. `adult-f.square-neck-knit` — 스퀘어넥 니트
5. `adult-f.sleeveless-turtleneck` — 민소매 터틀넥
6. `adult-f.bell-sleeve-blouse` — 벨소매 블라우스
7. `adult-f.lace-overlay-top` — 레이스 오버레이 상의
8. `adult-f.waistcoat-top` — 베스트형 상의
9. `adult-f.paperbag-shorts` — 페이퍼백 쇼츠
10. `adult-f.high-waist-shorts` — 하이웨이스트 쇼츠
11. `adult-f.wrap-skirt` — 랩 스커트
12. `adult-f.pleated-midi-skirt` — 플리츠 미디 스커트
13. `adult-f.mermaid-skirt` — 머메이드 스커트
14. `adult-f.slit-midi-skirt` — 슬릿 미디 스커트
15. `adult-f.faux-leather-pants` — 인조 가죽 팬츠
16. `adult-f.tailored-vest-set` — 테일러드 베스트 세트
17. `adult-f.sheath-dress` — 시스 원피스
18. `adult-f.halter-dress` — 홀터 원피스
19. `adult-f.satin-evening-dress` — 새틴 이브닝 드레스
20. `adult-f.wide-leg-jumpsuit` — 와이드 점프수트

## U. 성인 남성형 의상 추가 20개 — `base_top` / `base_bottom` / `outerwear`

`adultOnly: true`, `fitProfile: adult-masculine`. 셔츠 핏·수트 구조·하의 실루엣을 분리한다.

1. `adult-m.fitted-crew-tee` — 피트되는 라운드 티
2. `adult-m.fitted-vneck-tee` — 피트되는 브이넥 티
3. `adult-m.sleeveless-tank` — 민소매 탱크톱
4. `adult-m.camp-collar-shirt` — 캠프 칼라 셔츠
5. `adult-m.cuban-collar-shirt` — 쿠반 칼라 셔츠
6. `adult-m.slim-dress-shirt` — 슬림 드레스 셔츠
7. `adult-m.relaxed-dress-shirt` — 릴랙스 드레스 셔츠
8. `adult-m.knitted-polo` — 니트 폴로
9. `adult-m.waistcoat` — 테일러드 베스트
10. `adult-m.double-breasted-blazer` — 더블 브레스티드 블레이저
11. `adult-m.tuxedo-jacket` — 턱시도 재킷
12. `adult-m.suede-jacket` — 스웨이드 재킷
13. `adult-m.long-overcoat` — 롱 오버코트
14. `adult-m.slim-chino` — 슬림 치노
15. `adult-m.pleated-trousers` — 플리츠 슬랙스
16. `adult-m.tapered-slacks` — 테이퍼드 슬랙스
17. `adult-m.tailored-short` — 테일러드 쇼츠
18. `adult-m.utility-cargo` — 유틸리티 카고 팬츠
19. `adult-m.suit-trousers` — 수트 팬츠
20. `adult-m.linen-summer-pants` — 린넨 여름 팬츠

## V. 성인 레그웨어·양말 추가 16개 — `socks` / `legwear`

`adultOnly: true`. 여성형·남성형·중성형의 길이와 패턴 차이를 별도 데이터로 둔다. 신발과 독립적으로 조합한다.

1. `leg-adult.seamed-stockings` — 백심 스타킹
2. `leg-adult.opaque-thigh-high` — 불투명 오버니 스타킹
3. `leg-adult.sheer-thigh-high` — 시어 오버니 스타킹
4. `leg-adult.lace-top-stockings` — 레이스 밴드 스타킹
5. `leg-adult.microfishnet-tights` — 미세망사 타이츠
6. `leg-adult.diamond-pattern-tights` — 다이아 패턴 타이츠
7. `leg-adult.polished-sheer-tights` — 광택 시어 타이츠
8. `leg-adult.stirrup-tights` — 스티럽 타이츠
9. `leg-adult.ribbed-over-knee-socks` — 골지 오버니 삭스
10. `leg-adult.wool-knee-socks` — 울 니삭스
11. `sock-adult.dress-merino` — 메리노 드레스 양말
12. `sock-adult.dress-silk` — 실크 드레스 양말
13. `sock-adult.dress-patterned` — 패턴 드레스 양말
14. `sock-adult.no-show-loafer` — 로퍼용 페이크 삭스
15. `sock-adult.athletic-cushioned` — 쿠션 스포츠 양말
16. `sock-adult.hiking-merino` — 메리노 등산 양말

## W. 성인 확장 코디 세트 12개 — `WardrobeSetV1`

세트는 새로운 메시가 아니다. 세트 데이터는 아래 단품 ID를 그대로 참조한다. 스타일명보다 슬롯 충돌과 실제 3D 결과를 우선 검증한다.

1. `set-f.pool-sport` — 스포츠 비키니 상·하의+슬라이드
2. `set-f.resort-halter` — 홀터 비키니 상의+하이웨이스트 하의+샌들
3. `set-f.surf-day` — 긴팔 래시가드+보드쇼츠+리커버리 슬라이드
4. `set-f.swim-classic` — 기본 원피스 수영복+플랫 샌들
5. `set-f.satin-evening` — 새틴 이브닝 드레스+슬링백 힐
6. `set-f.modern-office` — 페플럼 블라우스+펜슬 스커트+키튼힐
7. `set-m.pool-classic` — 기본 수영 트렁크+슬라이드
8. `set-m.surf-day` — 긴팔 래시가드+보드쇼츠+리커버리 슬라이드
9. `set-m.resort-linen` — 캠프 칼라 셔츠+린넨 팬츠+가죽 샌들
10. `set-m.business-formal` — 슬림 드레스 셔츠+수트 팬츠+캡토 옥스퍼드
11. `set-m.date-casual` — 니트 폴로+테이퍼드 슬랙스+스웨이드 페니 로퍼
12. `set-m.evening-formal` — 턱시도 재킷+수트 팬츠+홀컷 옥스퍼드

| 세트 ID | 구성 품목 ID |
| --- | --- |
| `set-f.pool-sport` | `swim-f.sport-top`, `swim-f.sport-bottom`, `shoe.slide-sandal` |
| `set-f.resort-halter` | `swim-f.halter-top`, `swim-f.high-waist-bottom`, `shoe.strappy-sandal` |
| `set-f.surf-day` | `swim-f.rashguard-long`, `swim-f.board-short`, `shoe.slide-sandal` |
| `set-f.swim-classic` | `swim-f.classic-one-piece`, `shoe.slide-sandal` |
| `set-f.satin-evening` | `adult-f.satin-evening-dress`, `shoe-f.slingback-kitten` |
| `set-f.modern-office` | `adult-f.peplum-blouse`, `bottom.pencil-skirt`, `shoe-f.kitten-heel-pump` |
| `set-m.pool-classic` | `swim-m.classic-trunks`, `shoe-m.recovery-slide` |
| `set-m.surf-day` | `swim-m.rashguard-long`, `swim-m.boardshort-mid`, `shoe-m.recovery-slide` |
| `set-m.resort-linen` | `adult-m.camp-collar-shirt`, `adult-m.linen-summer-pants`, `shoe-m.leather-sandal` |
| `set-m.business-formal` | `adult-m.slim-dress-shirt`, `adult-m.suit-trousers`, `shoe-m.cap-toe-oxford` |
| `set-m.date-casual` | `adult-m.knitted-polo`, `adult-m.tapered-slacks`, `shoe-m.suede-penny-loafer` |
| `set-m.evening-formal` | `adult-m.tuxedo-jacket`, `adult-m.suit-trousers`, `shoe-m.wholecut-oxford` |

## X. 수영·스타일 액세서리 12개 — 독립 슬롯

수영복과 함께 쓰되 장면에 표시할 실제 메시가 있는 항목만 활성화한다. 장식 요소는 지오메트리나 텍스처로 검증한다.

1. `swim-acc.beach-coverup` — 비치 커버업
2. `swim-acc.light-kimono` — 얇은 비치 가운
3. `swim-acc.mesh-coverup` — 메시 비치 커버업, 성인 전용
4. `swim-acc.sarong` — 사롱
5. `swim-acc.beach-shorts` — 비치 쇼츠
6. `swim-acc.wide-brim-hat` — 와이드 브림 햇
7. `swim-acc.swim-cap` — 수모
8. `swim-acc.swim-goggles` — 수경
9. `swim-acc.beach-tote` — 비치 토트백
10. `swim-acc.waterproof-pouch` — 방수 파우치
11. `swim-acc.flip-flops` — 플립플롭
12. `swim-acc.water-shoes` — 아쿠아 슈즈

## Y. 성인 콘셉트 코디 12개 — `WardrobeSetV1`

기존 단품을 조합하는 세트이며 모두 `adultOnly: true`다. `styleTags`에는 `성인 스타일`과 아래 콘셉트를 기록한다. 세트 이름이나 색상만으로 서로 다른 메시를 가진 것처럼 계산하지 않는다. 착용 슬롯, 소재 표현, 미리보기가 실제로 구분되는 조합을 우선한다.

| 세트 ID | 콘셉트 | 구성 품목 ID |
| --- | --- | --- |
| `set-adult.lace-lounge` | 레이스 이너웨어와 레그웨어 | `inner-top.lace-bralette`, `inner-f.lace-thong`, `leg-adult.lace-top-stockings`, `shoe-f.kitten-heel-pump` |
| `set-adult.satin-lounge` | 새틴 이너웨어와 로브 | `inner-top.satin-bralette`, `inner-f.satin-thong`, `lounge.robe-satin` |
| `set-adult.bustier-evening` | 뷔스티에와 슬릿 스커트 | `adult-top.bustier-style-top`, `adult-f.slit-midi-skirt`, `shoe-f.strappy-heel-sandal` |
| `set-adult.corset-tailored` | 코르셋 스타일과 테일러드 팬츠 | `adult-top.corset-style-top`, `bottom.tailored-slacks`, `shoe-f.pointed-pump` |
| `set-adult.sheer-layer` | 시스루 상의와 이너 레이어 | `inner-top.soft-cup-bra`, `adult-top.sheer-overlay-blouse`, `bottom.pencil-skirt`, `shoe-f.slingback-kitten` |
| `set-adult.backless-satin` | 백리스 니트와 새틴 스커트 | `adult-top.backless-knit`, `bottom.satin-midi-skirt`, `shoe-f.mule-heel` |
| `set-adult.bodycon-evening` | 바디콘 원피스와 힐 | `dress.bodycon-midi`, `shoe-f.ankle-strap-heel` |
| `set-adult.resort-mesh` | 비키니와 비치 커버업 | `swim-f.triangle-top`, `swim-f.side-tie-bottom`, `swim-acc.mesh-coverup`, `shoe.strappy-sandal` |
| `set-adult.fitted-date` | 피트되는 상의와 슬랙스 | `adult-m.fitted-vneck-tee`, `adult-m.tapered-slacks`, `shoe-m.chelsea-leather` |
| `set-adult.resort-shirt` | 오픈 칼라와 테일러드 쇼츠 | `adult-m.camp-collar-shirt`, `adult-m.tailored-short`, `shoe-m.leather-sandal` |
| `set-adult.campus-preppy-f` | 성인 대학·프레피 스타일 | `top.sleeveless-blouse`, `outer.knit-cardigan`, `adult-f.pleated-midi-skirt`, `shoe.penny-loafer` |
| `set-adult.campus-preppy-m` | 성인 대학·프레피 스타일 | `top.oxford-shirt`, `adult-m.waistcoat`, `adult-m.pleated-trousers`, `shoe-m.suede-penny-loafer` |

마지막 두 세트는 **성인 대학생·성인 프레피 패션**으로만 제시한다. 학교 교복, 중·고등학생, 미성년자 역할 설정을 이름·썸네일·프롬프트·추천 태그에 사용하지 않는다. 성인 여부가 `unknown`인 모델에도 제공하지 않는다. `lounge.robe-satin`은 이너웨어 위에 열고 닫을 수 있는 외부 레이어로 구현하고, 기존 `one_piece`와 충돌하는 현재 슬롯 정의는 세트 활성화 전에 해결한다. `swim-acc.mesh-coverup`도 `swim_cover` 외부 레이어로 검증한다. 이 두 세트의 겹침 규칙이 미구현이면 선택 가능 코디로 표시하지 않는다.

## 구현 우선순위

첫 릴리스는 각 원형이 검증되는 대표 40~60개 품목을 선별한다. 여성형에서는 티팬티·브라렛·비키니 상·하의·원피스 수영복·펌프스·샌들·부츠를, 남성형에서는 드로즈·브리프·수영 트렁크·래시가드·옥스퍼드·더비·로퍼·부츠를 포함한다. 일상 상·하의와 양말은 양쪽 피팅 프로필에서 검증한다. 성인 콘셉트 코디는 `set-adult.bustier-evening`, `set-adult.fitted-date`, `set-adult.campus-preppy-f`를 대표 세트로 먼저 검증한다. 3D 메시와 Depth/Normal/Lineart 결과를 확인한 뒤 나머지 품목을 순차적으로 `renderSupport` 승격한다. 숫자 428을 화면의 완료 수량으로 표시하려면 각 품목의 데이터·썸네일·3D 표현·모델 호환·프롬프트가 모두 검증되어야 한다.
