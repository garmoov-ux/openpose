import * as THREE from 'three';
import { box, cyl, mat, sphere } from './themeFurniturePrimitives';

export type CatalogPropMeshKind =
  | 'seat'
  | 'table'
  | 'cabinet'
  | 'shelf'
  | 'cart'
  | 'lamp'
  | 'screen'
  | 'container'
  | 'equipment';
export type CatalogPropMeshVariant = 'compact' | 'folding' | 'mobile' | 'heavy';

export function createCatalogPropGroup(
  kind: CatalogPropMeshKind | undefined,
  colorHex: number,
  shift: (hex: number) => number,
  variant?: CatalogPropMeshVariant
): THREE.Group | null {
  if (!kind) return null;

  const group = new THREE.Group();
  const body = mat(shift(colorHex), 0.48, 0.24);
  const trim = mat(0xcbd5e1, 0.2, 0.82);
  const dark = mat(0x334155, 0.36, 0.4);
  const pale = mat(0xf1f5f9, 0.5, 0.08);

  switch (kind) {
    case 'seat':
      box(group, 0.78, 0.12, 0.68, 0, 0.48, 0, body);
      box(group, 0.78, 0.72, 0.1, 0, 0.88, -0.28, body);
      for (const x of [-0.32, 0.32]) {
        box(group, 0.06, 0.46, 0.06, x, 0.23, -0.24, trim);
        box(group, 0.06, 0.46, 0.06, x, 0.23, 0.24, trim);
      }
      break;
    case 'table':
      box(group, 1.35, 0.08, 0.82, 0, 0.78, 0, body);
      for (const x of [-0.58, 0.58]) for (const z of [-0.32, 0.32]) {
        box(group, 0.055, 0.74, 0.055, x, 0.37, z, trim);
      }
      break;
    case 'cabinet':
      box(group, 0.92, 1.32, 0.48, 0, 0.66, 0, body);
      box(group, 0.82, 1.2, 0.04, 0, 0.67, 0.25, pale);
      for (const y of [0.34, 0.68, 1.02]) {
        box(group, 0.74, 0.018, 0.025, 0, y, 0.28, trim);
        sphere(group, 0.025, 0.32, y + 0.1, 0.31, dark);
      }
      break;
    case 'shelf':
      for (const x of [-0.58, 0.58]) box(group, 0.06, 1.62, 0.06, x, 0.81, 0, trim);
      for (const y of [0.12, 0.58, 1.04, 1.5]) box(group, 1.22, 0.06, 0.48, 0, y, 0, body);
      break;
    case 'cart':
      for (const y of [0.28, 0.82]) box(group, 0.92, 0.055, 0.58, 0, y, 0, body);
      for (const x of [-0.4, 0.4]) for (const z of [-0.24, 0.24]) {
        cyl(group, 0.022, 0.022, 0.95, x, 0.53, z, trim);
        cyl(group, 0.075, 0.075, 0.045, x, 0.06, z, dark, 0, 0, Math.PI / 2);
      }
      break;
    case 'lamp':
      cyl(group, 0.2, 0.16, 0.06, 0, 0.03, 0, dark);
      cyl(group, 0.025, 0.025, 1.12, 0, 0.59, 0, trim);
      box(group, 0.42, 0.22, 0.3, 0, 1.22, 0, body, -0.18);
      sphere(group, 0.11, 0, 1.08, 0.05, mat(0xfff7cc, 0.3, 0.05, 0xffd166, 0.45));
      break;
    case 'screen':
      for (const x of [-0.58, 0.58]) box(group, 0.045, 1.7, 0.045, x, 0.85, 0, trim);
      box(group, 1.12, 1.55, 0.035, 0, 0.86, 0, body);
      box(group, 1.18, 0.055, 0.3, 0, 0.04, 0, dark);
      break;
    case 'container':
      box(group, 0.78, 0.66, 0.62, 0, 0.34, 0, body);
      box(group, 0.82, 0.055, 0.66, 0, 0.7, 0, trim);
      box(group, 0.48, 0.035, 0.035, 0, 0.75, 0.24, dark);
      break;
    case 'equipment':
      box(group, 0.9, 0.74, 0.62, 0, 0.4, 0, body);
      box(group, 0.74, 0.32, 0.045, 0, 0.53, 0.33, pale);
      for (const x of [-0.26, -0.08, 0.1, 0.28]) sphere(group, 0.035, x, 0.54, 0.37, trim);
      box(group, 0.98, 0.055, 0.68, 0, 0.03, 0, dark);
      break;
  }

  if (variant === 'mobile' && kind !== 'cart') {
    for (const x of [-0.36, 0.36]) for (const z of [-0.22, 0.22]) {
      cyl(group, 0.065, 0.065, 0.04, x, 0.045, z, dark, 0, 0, Math.PI / 2);
    }
  }
  if (variant === 'folding') {
    cyl(group, 0.025, 0.025, 0.9, -0.24, 0.38, 0, trim, 0, 0, -0.48);
    cyl(group, 0.025, 0.025, 0.9, 0.24, 0.38, 0, trim, 0, 0, 0.48);
  }
  if (variant === 'heavy') {
    box(group, 0.055, 0.055, 0.68, 0, 0.13, 0, dark);
  }

  return group;
}
