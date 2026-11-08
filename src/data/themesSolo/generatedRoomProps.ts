import type { RoomPropCatalogItem } from './roomPropCatalog';

type GeneratedPropShape = 'seat' | 'table' | 'cabinet' | 'shelf' | 'cart' | 'lamp' | 'screen' | 'container' | 'equipment';
type GeneratedPropCategory = RoomPropCatalogItem['category'];

interface PropSeed {
  id: string;
  nameKo: string;
  nameEn: string;
  shape: GeneratedPropShape;
  category: GeneratedPropCategory;
  color: number;
}

const SEEDS: PropSeed[] = [
  { id: 'stack_chair', nameKo: '적층 의자', nameEn: 'stacking chair', shape: 'seat', category: 'sub_furniture', color: 0x64748b },
  { id: 'folding_chair', nameKo: '다목적 접이식 의자', nameEn: 'folding chair', shape: 'seat', category: 'sub_furniture', color: 0x475569 },
  { id: 'drafting_stool', nameKo: '제도용 높이조절 스툴', nameEn: 'adjustable drafting stool', shape: 'seat', category: 'sub_furniture', color: 0x334155 },
  { id: 'lab_stool', nameKo: '실험실 회전 스툴', nameEn: 'laboratory swivel stool', shape: 'seat', category: 'sub_furniture', color: 0x0f766e },
  { id: 'shop_stool', nameKo: '작업장 원형 스툴', nameEn: 'workshop round stool', shape: 'seat', category: 'sub_furniture', color: 0x78716c },
  { id: 'auditorium_chair', nameKo: '강당 고정 좌석', nameEn: 'auditorium chair', shape: 'seat', category: 'sub_furniture', color: 0x7f1d1d },
  { id: 'waiting_bench', nameKo: '공공시설 대기 벤치', nameEn: 'public waiting bench', shape: 'seat', category: 'sub_furniture', color: 0x475569 },
  { id: 'workbench_stool', nameKo: '공구 작업용 스툴', nameEn: 'tool-room work stool', shape: 'seat', category: 'sub_furniture', color: 0x92400e },
  { id: 'cafeteria_chair', nameKo: '구내식당 의자', nameEn: 'cafeteria chair', shape: 'seat', category: 'sub_furniture', color: 0x166534 },
  { id: 'operator_chair', nameKo: '관제실 작업 의자', nameEn: 'control-room operator chair', shape: 'seat', category: 'sub_furniture', color: 0x1e3a8a },
  { id: 'school_desk', nameKo: '교실 학생 책걸상', nameEn: 'classroom student desk', shape: 'table', category: 'main_furniture', color: 0x92400e },
  { id: 'seminar_table', nameKo: '세미나 접이식 테이블', nameEn: 'seminar folding table', shape: 'table', category: 'main_furniture', color: 0x64748b },
  { id: 'lab_table', nameKo: '실험실 내화학 작업대', nameEn: 'chemical-resistant lab table', shape: 'table', category: 'main_furniture', color: 0x0f766e },
  { id: 'packing_table', nameKo: '포장 작업 테이블', nameEn: 'packing work table', shape: 'table', category: 'main_furniture', color: 0x78716c },
  { id: 'inspection_table', nameKo: '검수용 조명 테이블', nameEn: 'illuminated inspection table', shape: 'table', category: 'main_furniture', color: 0x334155 },
  { id: 'canteen_table', nameKo: '구내식당 공용 테이블', nameEn: 'canteen communal table', shape: 'table', category: 'main_furniture', color: 0x166534 },
  { id: 'utility_workbench', nameKo: '정비용 공구 작업대', nameEn: 'maintenance workbench', shape: 'table', category: 'main_furniture', color: 0x475569 },
  { id: 'map_table', nameKo: '지도 판독 테이블', nameEn: 'map-reading table', shape: 'table', category: 'main_furniture', color: 0x78350f },
  { id: 'drawing_desk', nameKo: '제도용 경사 작업대', nameEn: 'tilting drafting desk', shape: 'table', category: 'main_furniture', color: 0x92400e },
  { id: 'sorting_table', nameKo: '우편물 분류 테이블', nameEn: 'mail-sorting table', shape: 'table', category: 'main_furniture', color: 0x334155 },
  { id: 'records_cabinet', nameKo: '문서 보관 캐비닛', nameEn: 'records storage cabinet', shape: 'cabinet', category: 'sub_furniture', color: 0x475569 },
  { id: 'tool_cabinet', nameKo: '공구 보관 캐비닛', nameEn: 'tool storage cabinet', shape: 'cabinet', category: 'sub_furniture', color: 0x334155 },
  { id: 'locker_bank', nameKo: '다중 도어 개인 사물함', nameEn: 'multi-door personal locker bank', shape: 'cabinet', category: 'sub_furniture', color: 0x64748b },
  { id: 'chemical_cabinet', nameKo: '시약 안전 보관함', nameEn: 'chemical safety cabinet', shape: 'cabinet', category: 'sub_furniture', color: 0x166534 },
  { id: 'first_aid_cabinet', nameKo: '구급용품 벽 캐비닛', nameEn: 'first aid wall cabinet', shape: 'cabinet', category: 'sub_furniture', color: 0xb91c1c },
  { id: 'fire_safety_cabinet', nameKo: '소방 장비 보관함', nameEn: 'fire safety equipment cabinet', shape: 'cabinet', category: 'sub_furniture', color: 0xdc2626 },
  { id: 'electrical_cabinet', nameKo: '전기 제어 캐비닛', nameEn: 'electrical control cabinet', shape: 'cabinet', category: 'sub_furniture', color: 0x1e3a8a },
  { id: 'archive_cabinet', nameKo: '도면 수납 캐비닛', nameEn: 'flat-file archive cabinet', shape: 'cabinet', category: 'sub_furniture', color: 0x78350f },
  { id: 'parts_cabinet', nameKo: '부품 서랍 캐비닛', nameEn: 'parts drawer cabinet', shape: 'cabinet', category: 'sub_furniture', color: 0x475569 },
  { id: 'linen_cabinet', nameKo: '세탁물 수납장', nameEn: 'linen storage cabinet', shape: 'cabinet', category: 'sub_furniture', color: 0xf5f5f4 },
  { id: 'open_shelf', nameKo: '다목적 오픈 선반', nameEn: 'open utility shelving', shape: 'shelf', category: 'sub_furniture', color: 0x78350f },
  { id: 'wire_shelf', nameKo: '스테인리스 와이어 선반', nameEn: 'stainless wire shelving', shape: 'shelf', category: 'sub_furniture', color: 0x94a3b8 },
  { id: 'library_shelf', nameKo: '도서관 서가 모듈', nameEn: 'library book shelving unit', shape: 'shelf', category: 'sub_furniture', color: 0x78350f },
  { id: 'parts_shelf', nameKo: '소형 부품 정리 선반', nameEn: 'small-parts shelving unit', shape: 'shelf', category: 'sub_furniture', color: 0x475569 },
  { id: 'archive_rack', nameKo: '기록물 보존 랙', nameEn: 'archive storage rack', shape: 'shelf', category: 'sub_furniture', color: 0x64748b },
  { id: 'plant_rack', nameKo: '묘목 재배 선반', nameEn: 'seedling propagation rack', shape: 'shelf', category: 'sub_furniture', color: 0x166534 },
  { id: 'drying_rack', nameKo: '건조 작업 랙', nameEn: 'industrial drying rack', shape: 'shelf', category: 'sub_furniture', color: 0x94a3b8 },
  { id: 'pallet_rack', nameKo: '창고 팔레트 랙', nameEn: 'warehouse pallet rack', shape: 'shelf', category: 'sub_furniture', color: 0xdc2626 },
  { id: 'display_shelf', nameKo: '전시용 진열 선반', nameEn: 'public exhibit display shelving', shape: 'shelf', category: 'sub_furniture', color: 0x92400e },
  { id: 'shoe_rack', nameKo: '작업화 건조 선반', nameEn: 'work-boot drying rack', shape: 'shelf', category: 'sub_furniture', color: 0x475569 },
  { id: 'service_cart', nameKo: '다단 서비스 카트', nameEn: 'multi-tier service cart', shape: 'cart', category: 'sub_furniture', color: 0x94a3b8 },
  { id: 'tool_trolley', nameKo: '정비 공구 트롤리', nameEn: 'mechanic tool trolley', shape: 'cart', category: 'sub_furniture', color: 0xdc2626 },
  { id: 'library_cart', nameKo: '도서 운반 카트', nameEn: 'library book transport cart', shape: 'cart', category: 'sub_furniture', color: 0x334155 },
  { id: 'laundry_cart', nameKo: '세탁물 운반 카트', nameEn: 'laundry transport cart', shape: 'cart', category: 'sub_furniture', color: 0x64748b },
  { id: 'mail_cart', nameKo: '우편물 분류 카트', nameEn: 'postal sorting cart', shape: 'cart', category: 'sub_furniture', color: 0x1e3a8a },
  { id: 'platform_trolley', nameKo: '평판 운반 대차', nameEn: 'flatbed platform trolley', shape: 'cart', category: 'sub_furniture', color: 0x475569 },
  { id: 'cylinder_dolly', nameKo: '가스 실린더 운반대', nameEn: 'gas cylinder hand truck', shape: 'cart', category: 'sub_furniture', color: 0xdc2626 },
  { id: 'waste_bin_cart', nameKo: '폐기물 수거 카트', nameEn: 'waste collection cart', shape: 'cart', category: 'sub_furniture', color: 0x166534 },
  { id: 'linen_trolley', nameKo: '린넨 수거 트롤리', nameEn: 'linen collection trolley', shape: 'cart', category: 'sub_furniture', color: 0xf5f5f4 },
  { id: 'warehouse_picker', nameKo: '창고 피킹 카트', nameEn: 'warehouse order-picking cart', shape: 'cart', category: 'sub_furniture', color: 0x92400e },
  { id: 'desk_lamp', nameKo: '관절형 작업 데스크 램프', nameEn: 'adjustable task desk lamp', shape: 'lamp', category: 'lighting_arch', color: 0xfbbf24 },
  { id: 'inspection_lamp', nameKo: '검사 스탠드 조명', nameEn: 'inspection stand light', shape: 'lamp', category: 'lighting_arch', color: 0xe2e8f0 },
  { id: 'machine_light', nameKo: '공작기계 작업등', nameEn: 'machine tool work light', shape: 'lamp', category: 'lighting_arch', color: 0x0f766e },
  { id: 'emergency_light', nameKo: '비상 유도등', nameEn: 'emergency guidance light', shape: 'lamp', category: 'lighting_arch', color: 0x22c55e },
  { id: 'floor_task_light', nameKo: '이동형 작업 조명', nameEn: 'portable floor task light', shape: 'lamp', category: 'lighting_arch', color: 0xf97316 },
  { id: 'magnifier_light', nameKo: '확대경 검사 조명', nameEn: 'magnifying inspection lamp', shape: 'lamp', category: 'lighting_arch', color: 0x94a3b8 },
  { id: 'safety_screen', nameKo: '용접 보호 스크린', nameEn: 'welding safety screen', shape: 'screen', category: 'lighting_arch', color: 0x1e3a8a },
  { id: 'privacy_screen', nameKo: '공공시설 이동식 칸막이', nameEn: 'portable privacy partition', shape: 'screen', category: 'lighting_arch', color: 0x64748b },
  { id: 'notice_board', nameKo: '공지 게시판', nameEn: 'public notice board', shape: 'screen', category: 'lighting_arch', color: 0x78350f },
  { id: 'whiteboard', nameKo: '강의실 화이트보드', nameEn: 'classroom whiteboard', shape: 'screen', category: 'lighting_arch', color: 0xf5f5f4 },
  { id: 'acoustic_screen', nameKo: '흡음 이동 패널', nameEn: 'mobile acoustic divider panel', shape: 'screen', category: 'lighting_arch', color: 0x475569 },
  { id: 'safety_barrier', nameKo: '접이식 안전 가드', nameEn: 'folding safety barrier', shape: 'screen', category: 'lighting_arch', color: 0xf97316 },
  { id: 'recycling_bin', nameKo: '분리수거 수납함', nameEn: 'recycling station bin', shape: 'container', category: 'table_props', color: 0x16a34a },
  { id: 'parts_bin', nameKo: '부품 적재 박스', nameEn: 'stackable parts bin', shape: 'container', category: 'table_props', color: 0x2563eb },
  { id: 'linen_hamper', nameKo: '세탁물 수거함', nameEn: 'laundry collection hamper', shape: 'container', category: 'table_props', color: 0x64748b },
  { id: 'document_tote', nameKo: '문서 운반 토트', nameEn: 'document transport tote', shape: 'container', category: 'table_props', color: 0x475569 },
  { id: 'spill_kit', nameKo: '유출물 대응 키트함', nameEn: 'industrial spill response kit container', shape: 'container', category: 'table_props', color: 0xfbbf24 },
  { id: 'medical_bin', nameKo: '의료 소모품 보관함', nameEn: 'medical supply container', shape: 'container', category: 'table_props', color: 0x0f766e },
  { id: 'sample_crate', nameKo: '검체 운반 상자', nameEn: 'specimen transport crate', shape: 'container', category: 'table_props', color: 0x0f766e },
  { id: 'toolbox', nameKo: '현장 정비 공구함', nameEn: 'field maintenance toolbox', shape: 'container', category: 'table_props', color: 0xdc2626 },
  { id: 'salt_bin', nameKo: '제설제 보관함', nameEn: 'road salt storage bin', shape: 'container', category: 'table_props', color: 0xf97316 },
  { id: 'water_jug_stand', nameKo: '급수통 받침대', nameEn: 'water cooler bottle stand', shape: 'container', category: 'table_props', color: 0x38bdf8 },
  { id: 'fume_hood', nameKo: '실험실 흄 후드', nameEn: 'laboratory fume hood', shape: 'equipment', category: 'bath_wellness', color: 0x0f766e },
  { id: 'sterilizer', nameKo: '기구 고압 멸균기', nameEn: 'instrument autoclave sterilizer', shape: 'equipment', category: 'bath_wellness', color: 0x94a3b8 },
  { id: 'water_purifier', nameKo: '실험용 정수 장치', nameEn: 'laboratory water purification unit', shape: 'equipment', category: 'bath_wellness', color: 0x38bdf8 },
  { id: 'floor_scale', nameKo: '산업용 플랫폼 저울', nameEn: 'industrial platform scale', shape: 'equipment', category: 'bath_wellness', color: 0x475569 },
  { id: 'air_compressor', nameKo: '이동형 공기 압축기', nameEn: 'portable air compressor', shape: 'equipment', category: 'bath_wellness', color: 0x2563eb },
  { id: 'dehumidifier', nameKo: '산업용 제습기', nameEn: 'industrial dehumidifier', shape: 'equipment', category: 'bath_wellness', color: 0x64748b },
  { id: 'air_scrubber', nameKo: '공기 정화 장치', nameEn: 'portable air scrubber', shape: 'equipment', category: 'bath_wellness', color: 0x16a34a },
  { id: 'floor_fan', nameKo: '이동형 산업용 송풍기', nameEn: 'mobile industrial floor fan', shape: 'equipment', category: 'bath_wellness', color: 0x334155 },
  { id: 'portable_generator', nameKo: '현장용 발전기', nameEn: 'portable site generator', shape: 'equipment', category: 'bath_wellness', color: 0x1e3a8a },
  { id: 'battery_charger', nameKo: '배터리 충전 스테이션', nameEn: 'battery charging station', shape: 'equipment', category: 'bath_wellness', color: 0x22c55e },
  { id: 'tool_chest', nameKo: '이동형 공구 서랍장', nameEn: 'mobile mechanic tool chest', shape: 'cabinet', category: 'sub_furniture', color: 0xdc2626 },
  { id: 'file_pedestal', nameKo: '책상 아래 파일 서랍', nameEn: 'under-desk file pedestal', shape: 'cabinet', category: 'sub_furniture', color: 0x475569 },
  { id: 'key_cabinet', nameKo: '열쇠 관리 보관함', nameEn: 'key management cabinet', shape: 'cabinet', category: 'sub_furniture', color: 0x64748b },
  { id: 'parcel_locker', nameKo: '무인 택배 보관함', nameEn: 'parcel locker module', shape: 'cabinet', category: 'sub_furniture', color: 0x2563eb },
  { id: 'shoe_locker', nameKo: '현장 개인화 신발장', nameEn: 'worksite shoe locker', shape: 'cabinet', category: 'sub_furniture', color: 0x78350f },
  { id: 'equipment_locker', nameKo: '현장 장비 사물함', nameEn: 'equipment locker', shape: 'cabinet', category: 'sub_furniture', color: 0x475569 },
  { id: 'sample_cabinet', nameKo: '시료 보관 캐비닛', nameEn: 'laboratory sample cabinet', shape: 'cabinet', category: 'sub_furniture', color: 0x0f766e },
  { id: 'map_cabinet', nameKo: '대형 도면 보관함', nameEn: 'large-format map cabinet', shape: 'cabinet', category: 'sub_furniture', color: 0x78350f },
  { id: 'cleaning_cabinet', nameKo: '청소 도구 수납장', nameEn: 'janitorial supply cabinet', shape: 'cabinet', category: 'sub_furniture', color: 0x16a34a },
  { id: 'meter_cabinet', nameKo: '계량기 점검 캐비닛', nameEn: 'utility meter service cabinet', shape: 'cabinet', category: 'sub_furniture', color: 0x334155 },
  { id: 'hose_reel', nameKo: '소방 호스 릴 스탠드', nameEn: 'fire hose reel stand', shape: 'equipment', category: 'bath_wellness', color: 0xdc2626 },
  { id: 'extinguisher_stand', nameKo: '소화기 거치대', nameEn: 'fire extinguisher stand', shape: 'equipment', category: 'bath_wellness', color: 0xdc2626 },
  { id: 'traffic_cone_stack', nameKo: '도로 작업 안전 콘', nameEn: 'roadwork traffic cone stack', shape: 'container', category: 'table_props', color: 0xf97316 },
  { id: 'road_barrier', nameKo: '도로 통제 바리케이드', nameEn: 'road closure barrier', shape: 'screen', category: 'lighting_arch', color: 0xf97316 },
  { id: 'bollard_pair', nameKo: '보행로 안전 볼라드', nameEn: 'pedestrian safety bollard pair', shape: 'equipment', category: 'bath_wellness', color: 0xfbbf24 },
  { id: 'queue_stanchion', nameKo: '민원실 대기 안내봉', nameEn: 'public service queue stanchion', shape: 'screen', category: 'lighting_arch', color: 0x334155 },
  { id: 'portable_ramp', nameKo: '이동형 접근성 경사판', nameEn: 'portable accessibility ramp', shape: 'equipment', category: 'bath_wellness', color: 0x64748b },
  { id: 'step_ladder', nameKo: '접이식 안전 발판 사다리', nameEn: 'folding safety step ladder', shape: 'equipment', category: 'bath_wellness', color: 0xfbbf24 },
  { id: 'extension_ladder', nameKo: '정비용 연장 사다리', nameEn: 'maintenance extension ladder', shape: 'equipment', category: 'bath_wellness', color: 0x2563eb },
  { id: 'scaffold_tower', nameKo: '이동형 작업 발판 타워', nameEn: 'mobile access scaffold tower', shape: 'equipment', category: 'bath_wellness', color: 0x94a3b8 },
  { id: 'hand_truck', nameKo: '수하물 운반 핸드카트', nameEn: 'baggage hand truck', shape: 'cart', category: 'sub_furniture', color: 0x334155 },
];



const VARIANTS = [
  { id: 'compact', nameKo: '소형', nameEn: 'compact', scale: 0.78 },
  { id: 'folding', nameKo: '접이식', nameEn: 'folding', scale: 0.88 },
  { id: 'mobile', nameKo: '이동형', nameEn: 'mobile', scale: 1 },
  { id: 'heavy', nameKo: '중량형', nameEn: 'heavy-duty', scale: 1.14 },
] as const;

const ACTIVE_SEEDS = SEEDS.slice(0, 103);
if (ACTIVE_SEEDS.length !== 103) throw new Error(`Expected 103 physical prop bases, got ${ACTIVE_SEEDS.length}`);

export const GENERATED_ROOM_PROPS: RoomPropCatalogItem[] = ACTIVE_SEEDS.flatMap((seed, seedIndex) =>
  VARIANTS.map((variant, variantIndex) => {
    const index = seedIndex * VARIANTS.length + variantIndex;
    return {
      id: `${seed.id}_${variant.id}`,
      nameKo: `${variant.nameKo} ${seed.nameKo}`,
      category: seed.category,
      badge: variant.nameKo,
      colorHex: seed.color,
      promptEn: `${variant.nameEn} ${seed.nameEn} for a practical civic, workshop, laboratory, or service facility`,
      defaultPos: [((index % 7) - 3) * 0.42, 0, -0.55 - (Math.floor(index / 7) % 5) * 0.32],
      meshKind: seed.shape,
      meshVariant: variant.id,
      defaultScale: variant.scale,
    };
  })
);
