import * as THREE from 'three';

export function mat(
  color: number,
  roughness = 0.45,
  metalness = 0.2,
  emissive = 0x000000,
  emissiveIntensity = 0,
  opacity = 1
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    emissive,
    emissiveIntensity,
    transparent: opacity < 1,
    opacity,
  });
}

export function box(
  group: THREE.Group,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  material: THREE.Material,
  rx = 0,
  ry = 0,
  rz = 0
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  if (rx || ry || rz) m.rotation.set(rx, ry, rz);
  m.castShadow = true;
  m.receiveShadow = true;
  group.add(m);
  return m;
}

export function cyl(
  group: THREE.Group,
  rt: number,
  rb: number,
  h: number,
  x: number,
  y: number,
  z: number,
  material: THREE.Material,
  rx = 0,
  ry = 0,
  rz = 0
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 24), material);
  m.position.set(x, y, z);
  if (rx || ry || rz) m.rotation.set(rx, ry, rz);
  m.castShadow = true;
  m.receiveShadow = true;
  group.add(m);
  return m;
}

export function sphere(
  group: THREE.Group,
  r: number,
  x: number,
  y: number,
  z: number,
  material: THREE.Material,
  sx = 1,
  sy = 1,
  sz = 1
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 20), material);
  m.position.set(x, y, z);
  m.scale.set(sx, sy, sz);
  m.castShadow = true;
  m.receiveShadow = true;
  group.add(m);
  return m;
}

// 1. 스트리트 벽돌 아치, 카페 주철 난간, 원목 슬랫 벤치, 비스트로 테이블, 클래식 가로등
export function buildStreetCafeStage(
  group: THREE.Group,
  shift: (hex: number) => number,
  mode: 'cafe' | 'storefront' | 'stairs' | 'street'
): void {
  const brickMat = mat(shift(0x6b2f24), 0.82, 0.08);
  const mortarMat = mat(0x3f3f46, 0.7, 0.15);
  const stoneMat = mat(0x52525b, 0.65, 0.15);
  const ironMat = mat(0x18181b, 0.32, 0.82);
  const woodMat = mat(shift(0x78350f), 0.55, 0.12);
  const glassWarmMat = mat(0xfef3c7, 0.15, 0.3, 0xf59e0b, 0.85, 0.9);
  const neonMat = mat(0x38bdf8, 0.15, 0.3, shift(0x0284c7), 1.4);
  const lampGlow = mat(0xfffbeb, 0.15, 0.1, 0xfbbf24, 1.6);

  // 입체 벽돌 배경 벽체 + 상하 석조 몰딩 + 가로 줄눈 디테일
  box(group, 2.3, 1.95, 0.14, -0.15, 0.975, -0.92, brickMat);
  box(group, 2.38, 0.14, 0.2, -0.15, 0.07, -0.9, stoneMat);
  box(group, 2.38, 0.1, 0.22, -0.15, 1.96, -0.9, stoneMat);
  for (let i = 1; i <= 5; i++) {
    box(group, 2.32, 0.015, 0.15, -0.15, i * 0.32, -0.92, mortarMat);
  }

  // 쇼윈도 창문 프레임 & 창살(Mullions) & 어닝 차양
  box(group, 1.05, 0.88, 0.06, -0.45, 1.22, -0.84, ironMat);
  box(group, 0.95, 0.78, 0.07, -0.45, 1.22, -0.83, glassWarmMat);
  box(group, 0.96, 0.025, 0.08, -0.45, 1.22, -0.82, ironMat);
  box(group, 0.025, 0.78, 0.08, -0.45, 1.22, -0.82, ironMat);
  box(group, 1.12, 0.06, 0.16, -0.45, 0.76, -0.8, stoneMat);
  // 프레임 네온 간판
  box(group, 0.68, 0.22, 0.04, 0.42, 1.56, -0.83, ironMat);
  box(group, 0.62, 0.16, 0.05, 0.42, 1.56, -0.82, neonMat);

  // 주철 카페 난간 (Balustrade)
  box(group, 0.85, 0.035, 0.035, -0.82, 0.78, -0.48, ironMat);
  for (let i = 0; i < 6; i++) {
    cyl(group, 0.012, 0.012, 0.78, -1.2 + i * 0.15, 0.39, -0.48, ironMat);
  }

  if (mode === 'stairs') {
    // 돌계단 단상 3단
    box(group, 1.2, 0.14, 0.55, 0, 0.07, -0.35, stoneMat);
    box(group, 1.05, 0.28, 0.42, 0, 0.14, -0.52, stoneMat);
    box(group, 0.9, 0.42, 0.3, 0, 0.21, -0.68, stoneMat);
  } else {
    // 원목 슬랫 카페 벤치 (좌판 슬랫 3개 + 등받이 슬랫 2개 + 주철 다리/팔걸이)
    for (let s = 0; s < 3; s++) {
      box(group, 1.08, 0.035, 0.11, 0, 0.42, -0.22 - s * 0.12, woodMat);
    }
    box(group, 1.08, 0.1, 0.03, 0, 0.58, -0.48, woodMat);
    box(group, 1.08, 0.1, 0.03, 0, 0.72, -0.48, woodMat);
    box(group, 0.05, 0.42, 0.38, -0.5, 0.21, -0.34, ironMat);
    box(group, 0.05, 0.42, 0.38, 0.5, 0.21, -0.34, ironMat);
    box(group, 0.04, 0.38, 0.04, -0.5, 0.6, -0.48, ironMat);
    box(group, 0.04, 0.38, 0.04, 0.5, 0.6, -0.48, ironMat);
  }

  if (mode === 'cafe') {
    // 원형 비스트로 사이드 테이블 & 커피잔
    cyl(group, 0.24, 0.24, 0.03, -0.78, 0.64, -0.18, stoneMat);
    cyl(group, 0.025, 0.025, 0.64, -0.78, 0.32, -0.18, ironMat);
    cyl(group, 0.16, 0.18, 0.03, -0.78, 0.015, -0.18, ironMat);
    cyl(group, 0.035, 0.028, 0.07, -0.75, 0.69, -0.16, lampGlow);
  }

  // 클래식 다단 주철 가로등 기둥 & 글로브 랜턴
  cyl(group, 0.09, 0.12, 0.28, 0.92, 0.14, -0.62, ironMat);
  cyl(group, 0.032, 0.048, 1.85, 0.92, 1.05, -0.62, ironMat);
  box(group, 0.36, 0.035, 0.035, 0.76, 1.95, -0.62, ironMat);
  sphere(group, 0.11, 0.62, 1.86, -0.62, lampGlow);
  cyl(group, 0.08, 0.13, 0.05, 0.62, 1.97, -0.62, ironMat);
}

// 2. 할리우드 조명 거울 화장대 / 3면 전신 거울 피팅 부스 & 벨벳 스툴 & 행거
export function buildVanityOrFittingStage(
  group: THREE.Group,
  shift: (hex: number) => number,
  isTriptych: boolean
): void {
  const wallMat = mat(shift(0x4c0519), 0.7, 0.1);
  const goldMat = mat(0xfbbf24, 0.25, 0.85);
  const mirrorMat = mat(0xe2e8f0, 0.06, 0.94);
  const tableMat = mat(0xf8fafc, 0.35, 0.15);
  const velvetMat = mat(shift(0xbe123c), 0.6, 0.1);
  const bulbMat = mat(0xfffbeb, 0.15, 0.1, 0xfde68a, 1.5);

  // 벨벳 커튼 배경 월
  box(group, 2.2, 2.0, 0.08, 0, 1.0, -0.95, wallMat);

  if (isTriptych) {
    // 3면 폴딩 전신 거울 + 원형 피팅 포디움
    box(group, 0.72, 1.72, 0.05, 0, 0.92, -0.78, goldMat);
    box(group, 0.64, 1.64, 0.06, 0, 0.92, -0.77, mirrorMat);
    box(group, 0.56, 1.68, 0.05, -0.62, 0.9, -0.64, goldMat, 0, 0.38, 0);
    box(group, 0.48, 1.6, 0.06, -0.61, 0.9, -0.63, mirrorMat, 0, 0.38, 0);
    box(group, 0.56, 1.68, 0.05, 0.62, 0.9, -0.64, goldMat, 0, -0.38, 0);
    box(group, 0.48, 1.6, 0.06, 0.61, 0.9, -0.63, mirrorMat, 0, -0.38, 0);
    cyl(group, 0.52, 0.56, 0.08, 0, 0.04, -0.1, velvetMat);
    cyl(group, 0.54, 0.57, 0.02, 0, 0.085, -0.1, goldMat);
  } else {
    // 화장대 데스크 (상판 + 서랍 + 다리 4개) + 할리우드 볼전구 거울
    box(group, 1.32, 0.1, 0.46, -0.15, 0.74, -0.62, tableMat);
    box(group, 0.05, 0.72, 0.42, -0.76, 0.36, -0.62, goldMat);
    box(group, 0.05, 0.72, 0.42, 0.46, 0.36, -0.62, goldMat);
    box(group, 0.96, 0.92, 0.05, -0.15, 1.26, -0.78, goldMat);
    box(group, 0.86, 0.82, 0.06, -0.15, 1.26, -0.77, mirrorMat);
    for (let i = 0; i < 5; i++) {
      const y = 0.88 + i * 0.19;
      sphere(group, 0.028, -0.6, y, -0.73, bulbMat);
      sphere(group, 0.028, 0.3, y, -0.73, bulbMat);
    }
    // 향수병 오브제 & 벨벳 스툴
    cyl(group, 0.035, 0.035, 0.11, -0.45, 0.84, -0.52, goldMat);
    cyl(group, 0.24, 0.24, 0.12, -0.15, 0.4, -0.22, velvetMat);
    cyl(group, 0.03, 0.18, 0.34, -0.15, 0.17, -0.22, goldMat);
  }

  // 우측 골드 의상 행거 랙
  cyl(group, 0.02, 0.02, 1.62, 0.88, 0.81, -0.58, goldMat);
  box(group, 0.42, 0.03, 0.36, 0.88, 1.62, -0.58, goldMat);
  box(group, 0.08, 0.65, 0.28, 0.88, 1.2, -0.58, velvetMat);
}

// 3. 침실 / 캐노피 킹 베드 / 원형 미러 베드 / 오픈 옷장 드레스룸
export function buildBedroomOrClosetStage(
  group: THREE.Group,
  shift: (hex: number) => number,
  mode: 'closet' | 'canopy' | 'round'
): void {
  const woodMat = mat(shift(0x4a2c1d), 0.55, 0.15);
  const sheetMat = mat(mode === 'round' ? 0x18181b : 0xf8fafc, 0.65, 0.08);
  const duvetMat = mat(shift(mode === 'round' ? 0x9f1239 : 0xe11d48), 0.55, 0.12);
  const goldMat = mat(0xfbbf24, 0.25, 0.85);
  const lampGlow = mat(0xffedd5, 0.2, 0.1, 0xf97316, 1.3);

  if (mode === 'round') {
    // 원형 실크 베드 + 상단 서클 미러 + 네온 링 (마네킹 뒤쪽 배치)
    cyl(group, 0.78, 0.82, 0.24, 0, 0.12, -0.78, woodMat);
    cyl(group, 0.74, 0.74, 0.14, 0, 0.28, -0.78, sheetMat);
    cyl(group, 0.68, 0.7, 0.06, 0, 0.36, -0.72, duvetMat);
    cyl(group, 0.11, 0.11, 0.75, 0, 0.44, -0.98, duvetMat, 0, 0, Math.PI / 2);
    cyl(group, 0.68, 0.68, 0.03, 0, 1.92, -0.78, mat(0xe2e8f0, 0.08, 0.92));
    return;
  }

  // 침대 매트리스 + 이불 + 베개 2개 + 볼스터 + 헤드보드 (마네킹 다리와 겹치지 않도록 z=-0.68 배치)
  box(group, 1.48, 0.22, 0.78, 0.14, 0.11, -0.68, woodMat);
  box(group, 1.4, 0.18, 0.72, 0.14, 0.28, -0.68, sheetMat);
  box(group, 1.42, 0.08, 0.48, 0.14, 0.38, -0.56, duvetMat);
  box(group, 0.46, 0.1, 0.22, -0.16, 0.42, -0.88, sheetMat, 0.2, 0, 0);
  box(group, 0.46, 0.1, 0.22, 0.44, 0.42, -0.88, sheetMat, 0.2, 0, 0);
  cyl(group, 0.09, 0.09, 0.88, 0.14, 0.43, -0.72, duvetMat, 0, 0, Math.PI / 2);
  box(group, 1.52, 0.98, 0.1, 0.14, 0.49, -1.06, woodMat);

  if (mode === 'closet') {
    // 좌측 오픈 옷장 (외곽 프레임 + 선반 + 행거봉 + 걸린 의상 3벌 + 열린 서랍)
    box(group, 0.72, 1.88, 0.42, -0.94, 0.94, -0.82, woodMat);
    box(group, 0.64, 1.4, 0.38, -0.94, 1.12, -0.78, mat(0x27272a, 0.7, 0.1));
    cyl(group, 0.015, 0.015, 0.6, -0.94, 1.68, -0.72, goldMat, 0, 0, Math.PI / 2);
    box(group, 0.12, 0.62, 0.24, -1.1, 1.32, -0.72, duvetMat);
    box(group, 0.12, 0.56, 0.24, -0.94, 1.35, -0.72, sheetMat);
    box(group, 0.12, 0.66, 0.24, -0.78, 1.3, -0.72, mat(0x38bdf8, 0.5, 0.1));
    box(group, 0.66, 0.18, 0.48, -0.94, 0.28, -0.66, woodMat);
  } else {
    // 4주 캐노피 프레임 기둥 & 상단 바 + 협탁 스탠드 조명
    const posts = [
      [-0.56, -1.04],
      [0.84, -1.04],
      [-0.56, -0.32],
      [0.84, -0.32],
    ];
    posts.forEach(([px, pz]) => cyl(group, 0.03, 0.035, 1.92, px, 0.96, pz, woodMat));
    box(group, 1.44, 0.04, 0.04, 0.14, 1.9, -1.04, woodMat);
    box(group, 1.44, 0.04, 0.04, 0.14, 1.9, -0.32, woodMat);
    box(group, 0.36, 0.46, 0.36, -0.88, 0.23, -0.82, woodMat);
    cyl(group, 0.11, 0.15, 0.24, -0.88, 0.62, -0.82, lampGlow);
  }
}
