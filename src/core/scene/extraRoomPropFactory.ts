import * as THREE from 'three';
import { box, cyl, mat, sphere } from './themeFurniturePrimitives';

export function createExtraRoomPropGroup(id: string, shift: (hex: number) => number): THREE.Group | null {
  const g = new THREE.Group();
  const wood = mat(shift(0x78350f), 0.55, 0.1);
  const dark = mat(shift(0x27272a), 0.38, 0.35);
  const light = mat(shift(0xf5f5f4), 0.5, 0.05);
  const metal = mat(shift(0xcbd5e1), 0.2, 0.82);
  const gold = mat(shift(0xd4a96a), 0.25, 0.65);
  const glass = mat(0xbae6fd, 0.1, 0.65, 0x38bdf8, 0.15, 0.65);
  const green = mat(shift(0x15803d), 0.7, 0.02);
  const glow = mat(0xfff7ed, 0.3, 0.05, 0xfbbf24, 1.3);

  switch (id) {
    case 'storefront_facade':
      box(g, 1.7, 2.2, 0.08, 0, 1.1, 0, wood);
      box(g, 1.25, 1.35, 0.09, 0, 1.25, 0.06, glass);
      box(g, 1.3, 0.05, 0.1, 0, 0.6, 0.1, gold);
      box(g, 1.8, 0.18, 0.48, 0, 2.17, 0.25, dark);
      break;
    case 'street_awning':
      box(g, 1.9, 0.07, 0.85, 0, 0, 0, mat(shift(0xb91c1c)), -0.14);
      for (const x of [-0.75, -0.25, 0.25, 0.75]) box(g, 0.14, 0.01, 0.85, x, 0.04, 0, light, -0.14);
      break;
    case 'stone_steps':
      for (let i = 0; i < 3; i++) box(g, 1.55 - i * 0.14, 0.14 * (i + 1), 0.45, 0, 0.07 * (i + 1), -0.4 * i, light);
      break;
    case 'fitting_pedestal':
      cyl(g, 0.72, 0.78, 0.2, 0, 0.1, 0, wood);
      cyl(g, 0.74, 0.74, 0.035, 0, 0.21, 0, gold);
      break;
    case 'champagne_cart':
    case 'hotel_bar_cart':
      box(g, 0.68, 0.05, 0.42, 0, 0.76, 0, gold);
      box(g, 0.68, 0.04, 0.42, 0, 0.32, 0, wood);
      for (const x of [-0.28, 0.28]) for (const z of [-0.16, 0.16]) cyl(g, 0.015, 0.015, 0.7, x, 0.46, z, metal);
      for (const x of [-0.25, 0.25]) cyl(g, 0.08, 0.08, 0.04, x, 0.06, 0.2, dark, 0, 0, Math.PI / 2);
      cyl(g, 0.035, 0.04, 0.28, -0.13, 0.93, 0, glass);
      cyl(g, 0.04, 0.025, 0.12, 0.12, 0.87, 0, glass);
      break;
    case 'makeup_case':
      box(g, 0.52, 0.14, 0.32, 0, 0.09, 0.06, dark);
      box(g, 0.52, 0.04, 0.32, 0, 0.29, -0.13, dark, -0.55);
      for (const x of [-0.15, 0, 0.15]) cyl(g, 0.035, 0.035, 0.07, x, 0.19, 0.06, gold);
      break;
    case 'rattan_daybed':
    case 'hanging_swing_sofa':
      box(g, 1.55, 0.18, 0.7, 0, 0.42, 0, wood);
      box(g, 1.48, 0.1, 0.6, 0, 0.55, 0, light);
      box(g, 1.55, 0.55, 0.08, 0, 0.72, -0.38, wood);
      if (id === 'hanging_swing_sofa') {
        for (const x of [-0.7, 0.7]) cyl(g, 0.012, 0.012, 1.7, x, 1.5, 0, metal);
        box(g, 1.9, 0.05, 0.9, 0, 2.35, 0, metal);
      } else for (const x of [-0.67, 0.67]) box(g, 0.06, 0.38, 0.6, x, 0.22, 0, wood);
      break;
    case 'planter_cluster':
      for (const [x, z, h] of [[-0.3, 0, 0.8], [0.3, -0.1, 1.15], [0.05, 0.28, 0.55]]) {
        cyl(g, 0.15, 0.11, 0.27, x, 0.14, z, wood);
        cyl(g, 0.018, 0.018, h - 0.25, x, h / 2 + 0.1, z, green);
        sphere(g, 0.26, x, h, z, green, 1, 0.7, 0.7);
      }
      break;
    case 'rococo_fireplace':
      box(g, 1.55, 1.32, 0.3, 0, 0.66, 0, light);
      box(g, 0.95, 0.88, 0.32, 0, 0.46, 0.04, dark);
      box(g, 1.7, 0.16, 0.44, 0, 1.34, 0.05, light);
      sphere(g, 0.22, 0, 0.25, 0.23, glow, 1.3, 0.65, 0.3);
      break;
    case 'harpsichord':
      box(g, 1.35, 0.2, 0.72, 0, 0.73, 0, wood);
      box(g, 1.35, 0.05, 0.65, 0, 0.92, -0.2, wood, -0.55);
      box(g, 1.13, 0.025, 0.2, 0, 0.84, 0.26, light);
      for (const x of [-0.55, 0.55]) cyl(g, 0.035, 0.035, 0.65, x, 0.34, 0, wood);
      break;
    case 'chest_drawers':
    case 'jet_service_console':
    case 'onyx_limo_bar': {
      const shell = id === 'onyx_limo_bar' ? dark : wood;
      box(g, 1.05, 0.8, 0.4, 0, 0.4, 0, shell);
      box(g, 1.1, 0.05, 0.46, 0, 0.83, 0, id === 'onyx_limo_bar' ? glass : light);
      for (const y of [0.28, 0.52, 0.72]) {
        box(g, 0.85, 0.018, 0.015, 0, y, 0.21, gold);
        sphere(g, 0.018, 0, y + 0.07, 0.23, gold);
      }
      break;
    }
    case 'laundry_basket':
      cyl(g, 0.22, 0.16, 0.45, 0, 0.23, 0, wood);
      cyl(g, 0.21, 0.21, 0.04, 0, 0.47, 0, light);
      break;
    case 'coffee_machine':
      box(g, 0.4, 0.42, 0.32, 0, 0.24, 0, metal);
      box(g, 0.32, 0.04, 0.25, 0, 0.04, 0.06, dark);
      cyl(g, 0.07, 0.05, 0.12, 0.05, 0.12, 0.14, light);
      break;
    case 'yacht_railing':
      for (const x of [-1, -0.5, 0, 0.5, 1]) cyl(g, 0.018, 0.018, 1.0, x, 0.5, 0, metal);
      for (const y of [0.55, 1.02]) box(g, 2.05, 0.025, 0.025, 0, y, 0, metal);
      break;
    case 'yacht_helm':
      box(g, 0.55, 0.8, 0.45, 0, 0.4, 0, wood);
      cyl(g, 0.31, 0.31, 0.04, 0, 0.95, 0.16, metal, Math.PI / 2);
      for (const angle of [0, Math.PI / 2]) box(g, 0.56, 0.025, 0.025, 0, 0.95, 0.2, wood, 0, 0, angle);
      break;
    case 'tiki_bar':
      box(g, 1.45, 0.85, 0.5, 0, 0.43, 0, wood);
      box(g, 1.6, 0.07, 0.68, 0, 0.9, 0.02, light);
      for (const x of [-0.65, 0.65]) cyl(g, 0.035, 0.035, 1.4, x, 1.6, -0.1, wood);
      box(g, 1.85, 0.09, 0.9, 0, 2.3, 0, wood, -0.12);
      break;
    case 'beach_cabana':
      for (const x of [-0.8, 0.8]) for (const z of [-0.55, 0.55]) cyl(g, 0.03, 0.03, 2.25, x, 1.12, z, wood);
      box(g, 1.72, 0.06, 1.18, 0, 2.26, 0, light);
      box(g, 0.06, 1.6, 1.1, -0.78, 1.4, 0, light);
      break;
    case 'bamboo_screen':
      for (let x = -0.62; x <= 0.62; x += 0.12) cyl(g, 0.04, 0.04, 2.0, x, 1.0, 0, green);
      for (const y of [0.4, 1.5]) box(g, 1.45, 0.04, 0.06, 0, y, 0, wood);
      break;
    case 'andon_lantern':
      box(g, 0.38, 0.72, 0.38, 0, 0.48, 0, glow);
      for (const x of [-0.2, 0.2]) for (const z of [-0.2, 0.2]) box(g, 0.025, 0.92, 0.025, x, 0.46, z, wood);
      box(g, 0.45, 0.04, 0.45, 0, 0.94, 0, wood);
      break;
    case 'tea_table':
      box(g, 0.9, 0.06, 0.65, 0, 0.32, 0, wood);
      for (const x of [-0.35, 0.35]) for (const z of [-0.22, 0.22]) box(g, 0.05, 0.3, 0.05, x, 0.15, z, wood);
      cyl(g, 0.09, 0.07, 0.1, 0, 0.43, 0, light);
      break;
    case 'pilates_mat':
      box(g, 0.7, 0.025, 1.5, 0, 0.015, 0, mat(shift(0xddd6fe)));
      for (const x of [-0.27, 0.27]) box(g, 0.13, 0.1, 0.2, x, 0.06, -0.55, light);
      break;
    case 'ladder_barrel':
      box(g, 0.6, 0.09, 0.8, 0, 0.7, 0, dark);
      for (const x of [-0.32, 0.32]) box(g, 0.04, 1.25, 0.04, x, 0.63, -0.42, wood);
      for (const y of [0.3, 0.55, 0.8, 1.05]) box(g, 0.68, 0.03, 0.03, 0, y, -0.42, wood);
      break;
    case 'boardroom_table':
    case 'drafting_table':
      box(g, 1.8, 0.08, 0.85, 0, 0.77, 0, wood, id === 'drafting_table' ? -0.22 : 0);
      for (const x of [-0.68, 0.68]) for (const z of [-0.3, 0.3]) cyl(g, 0.035, 0.035, 0.72, x, 0.36, z, metal);
      if (id === 'drafting_table') box(g, 0.65, 0.012, 0.45, 0, 0.85, 0, light, -0.22);
      break;
    case 'jet_oval_window':
      box(g, 2.0, 1.65, 0.1, 0, 0.95, 0, light);
      for (const x of [-0.62, 0, 0.62]) {
        sphere(g, 0.26, x, 1.05, 0.07, metal, 0.82, 1.4, 0.16);
        sphere(g, 0.21, x, 1.05, 0.1, glass, 0.82, 1.4, 0.16);
      }
      break;
    case 'spa_oil_warmer':
      cyl(g, 0.13, 0.16, 0.22, 0, 0.11, 0, wood);
      sphere(g, 0.07, 0, 0.3, 0, glow);
      for (const x of [-0.22, 0.22]) cyl(g, 0.035, 0.04, 0.16, x, 0.08, 0, gold);
      break;
    case 'hammam_bench':
      box(g, 1.5, 0.18, 0.65, 0, 0.5, 0, light);
      for (const x of [-0.65, 0.65]) box(g, 0.12, 0.42, 0.6, x, 0.21, 0, light);
      break;
    case 'dumbbell_rack':
      for (const y of [0.3, 0.65]) box(g, 1.2, 0.05, 0.3, 0, y, 0, metal);
      for (const x of [-0.48, 0.48]) box(g, 0.04, 0.8, 0.3, x, 0.4, 0, metal);
      for (const x of [-0.35, 0, 0.35]) for (const y of [0.4, 0.75]) {
        cyl(g, 0.1, 0.1, 0.04, x - 0.09, y, 0, dark, 0, 0, Math.PI / 2);
        cyl(g, 0.1, 0.1, 0.04, x + 0.09, y, 0, dark, 0, 0, Math.PI / 2);
      }
      break;
    case 'sauna_heater':
      box(g, 0.46, 0.58, 0.43, 0, 0.29, 0, dark);
      for (const x of [-0.12, 0, 0.12]) for (const z of [-0.1, 0.1]) sphere(g, 0.1, x, 0.62, z, metal);
      break;
    default:
      return null;
  }
  return g;
}
