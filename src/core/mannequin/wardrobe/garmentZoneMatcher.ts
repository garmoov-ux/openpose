import { OutfitItemOverride, WardrobeItemV1 } from '@/types/wardrobe';

export interface GarmentTriangleMatch {
  matched: boolean;
  radialInflate: number;
  dropSkirtFactor: number;
}

const NO_MATCH: GarmentTriangleMatch = {
  matched: false,
  radialInflate: 1.0,
  dropSkirtFactor: 0,
};

function matchUnderwearOrSwim(
  item: WardrobeItemV1,
  ax: number,
  y: number,
  z: number,
  isArm: boolean
): GarmentTriangleMatch | null {
  const gKey = item.geometryKey;
  const slug = item.id.toLowerCase();
  const shape = item.shape || {};

  if (gKey === 'underwear') {
    if (isArm) return NO_MATCH;
    if (item.slots.includes('underwear_top')) {
      return { matched: y >= 0.67 && y <= 0.775, radialInflate: 1.0, dropSkirtFactor: 0 };
    }
    const legCut = shape.legCut || 'brief';
    const maxY = shape.rise === 'high' ? 0.565 : shape.rise === 'low' ? 0.515 : 0.54;
    const minY = legCut === 'short' || legCut === 'boxer' || legCut === 'boyshort' ? 0.415 : 0.465;
    if (y < minY || y > maxY) return NO_MATCH;
    if (legCut === 'thong') {
      const isWaistBand = y >= maxY - 0.022;
      const isFrontPanel = z >= 0.48 && ax < 0.088;
      const isBackStrap = z < 0.48 && ax < 0.024;
      return { matched: isWaistBand || isFrontPanel || isBackStrap, radialInflate: 1.0, dropSkirtFactor: 0 };
    }
    return { matched: true, radialInflate: 1.0, dropSkirtFactor: 0 };
  }

  if (gKey === 'swim-top') {
    if (slug.includes('rashguard')) {
      const maxArm = slug.includes('sleeveless') ? 0.145 : slug.includes('short') || slug.includes('crop') ? 0.195 : 0.245;
      if (ax > maxArm) return NO_MATCH;
      const minY = slug.includes('crop') ? 0.64 : 0.55;
      return { matched: y >= minY && y <= 0.815, radialInflate: 1.05, dropSkirtFactor: 0 };
    }
    if (isArm) return NO_MATCH;
    const minY = slug.includes('tankini') ? 0.56 : slug.includes('longline') ? 0.64 : 0.68;
    return { matched: y >= minY && y <= 0.775, radialInflate: 1.02, dropSkirtFactor: 0 };
  }

  if (gKey === 'swim-bottom') {
    if (isArm) return NO_MATCH;
    const maxY = slug.includes('high-waist') ? 0.57 : slug.includes('low-rise') ? 0.515 : 0.54;
    const minY = slug.includes('surf-legging')
      ? 0.09
      : slug.includes('jammer')
      ? 0.31
      : slug.includes('board') || slug.includes('trunks') || slug.includes('short') || slug.includes('skirt')
      ? 0.39
      : 0.465;
    return { matched: y >= minY && y <= maxY, radialInflate: slug.includes('board') ? 1.15 : 1.02, dropSkirtFactor: 0 };
  }

  if (gKey === 'swim-one-piece') {
    const isSurf = slug.includes('surf');
    const maxArm = isSurf ? (slug.includes('long') ? 0.245 : 0.19) : 0.145;
    if (ax > maxArm) return NO_MATCH;
    const minY = isSurf ? 0.38 : 0.465;
    if (y < minY || y > 0.795) return NO_MATCH;
    if (shape.cutoutLayout === 'side-cutout' && y >= 0.56 && y <= 0.64 && ax > 0.065) {
      return NO_MATCH;
    }
    return { matched: true, radialInflate: 1.02, dropSkirtFactor: 0 };
  }

  return null;
}

function matchOuterAndApparel(
  item: WardrobeItemV1,
  ax: number,
  y: number,
  z: number,
  isArm: boolean,
  override?: OutfitItemOverride
): GarmentTriangleMatch | null {
  const gKey = item.geometryKey;
  const slug = item.id.toLowerCase();
  const shape = item.shape || {};

  if (gKey === 'fitted-top' || gKey === 'loose-top') {
    const sleeve = shape.sleeve || 'short';
    const maxArm = sleeve === 'sleeveless' ? 0.145 : sleeve === 'short' ? 0.195 : 0.248;
    if (ax > maxArm) return NO_MATCH;
    const isCrop = slug.includes('crop') || slug.includes('bralette') || slug.includes('bra') || slug.includes('bandeau') || slug.includes('bustier');
    const minY = isCrop ? (slug.includes('bra') || slug.includes('bandeau') ? 0.675 : 0.62) : slug.includes('bodysuit') ? 0.47 : 0.525;
    const maxY = shape.neckline === 'turtleneck' ? 0.835 : shape.neckline === 'off-shoulder' || shape.neckline === 'strapless' ? 0.765 : 0.812;
    if (y < minY || y > maxY) return NO_MATCH;
    if (shape.cutoutLayout === 'backless' && z < 0.46 && y >= 0.6 && y <= 0.76) return NO_MATCH;
    return { matched: true, radialInflate: gKey === 'loose-top' ? 1.38 : 1.05, dropSkirtFactor: 0 };
  }

  if (gKey === 'trousers' || gKey === 'shorts-skirt') {
    if (isArm) return NO_MATCH;
    const isOverall = slug.includes('overall') || slug.includes('jumpsuit');
    const maxY = isOverall ? 0.78 : shape.rise === 'high' ? 0.58 : 0.545;
    const minY =
      gKey === 'shorts-skirt'
        ? slug.includes('maxi')
          ? 0.12
          : slug.includes('midi')
          ? 0.24
          : slug.includes('mini') || slug.includes('shorts') || slug.includes('short')
          ? 0.38
          : 0.32
        : 0.085;
    if (y < minY || y > maxY) return NO_MATCH;
    const isSkirt = shape.legCut === 'skirt' || slug.includes('skirt');
    const isWide = shape.legCut === 'wide' || slug.includes('wide') || slug.includes('cargo');
    const inflate = isSkirt ? 1.48 : isWide ? 1.32 : 1.08;
    const dropFactor = isSkirt && y < 0.48 ? (0.48 - y) * 1.4 : 0;
    return { matched: true, radialInflate: inflate, dropSkirtFactor: dropFactor };
  }

  if (gKey === 'dress') {
    const sleeve = shape.sleeve || 'short';
    const maxArm = sleeve === 'sleeveless' ? 0.145 : 0.195;
    if (ax > maxArm) return NO_MATCH;
    const minY = slug.includes('maxi') || slug.includes('long') || slug.includes('evening') ? 0.12 : slug.includes('midi') ? 0.25 : 0.36;
    const maxY = shape.neckline === 'off-shoulder' ? 0.765 : 0.805;
    if (y < minY || y > maxY) return NO_MATCH;
    const isBodycon = slug.includes('bodycon') || slug.includes('sheath');
    return {
      matched: true,
      radialInflate: isBodycon ? 1.08 : 1.36,
      dropSkirtFactor: !isBodycon && y < 0.48 ? (0.48 - y) * 1.25 : 0,
    };
  }

  if (gKey === 'outer') {
    const sleeve = shape.sleeve || 'long';
    const maxArm = sleeve === 'sleeveless' ? 0.145 : 0.252;
    if (ax > maxArm) return NO_MATCH;
    const minY =
      slug.includes('trench') || slug.includes('wool-coat') || slug.includes('overcoat') || slug.includes('robe') || slug.includes('coverup') || slug.includes('kimono')
        ? 0.24
        : slug.includes('cropped')
        ? 0.61
        : 0.48;
    if (y < minY || y > 0.822) return NO_MATCH;
    const closure = override?.closureState || shape.closureState || 'open';
    if (closure === 'open' && !isArm && ax < 0.026 && z >= 0.48) return NO_MATCH;
    return { matched: true, radialInflate: 1.55, dropSkirtFactor: 0 };
  }

  return null;
}

export function matchGarmentTriangle(
  item: WardrobeItemV1,
  ax: number,
  y: number,
  z: number,
  hiddenRegions: string[],
  override?: OutfitItemOverride
): GarmentTriangleMatch {
  if (y > 0.84) return NO_MATCH;

  const gKey = item.geometryKey;
  const slug = item.id.toLowerCase();
  const shape = item.shape || {};
  const isArm = ax >= 0.145;
  const hideFeet = hiddenRegions.includes('feet');
  const hideLowerLegs = hiddenRegions.includes('lower_legs');
  const hideTorso = hiddenRegions.includes('upper_torso') && hiddenRegions.includes('lower_torso');

  if (hideTorso && (gKey === 'fitted-top' || gKey === 'loose-top') && !isArm) {
    return NO_MATCH;
  }

  const innerOrSwim = matchUnderwearOrSwim(item, ax, y, z, isArm);
  if (innerOrSwim) return innerOrSwim;

  const apparel = matchOuterAndApparel(item, ax, y, z, isArm, override);
  if (apparel) return apparel;

  if (gKey === 'hosiery') {
    if (isArm) return NO_MATCH;
    const minY = hideFeet ? 0.062 : 0.0;
    if (hideLowerLegs && y <= 0.24) return NO_MATCH;
    const shaft = shape.shaftHeightCm ?? 15;
    const maxY = slug.includes('tights') ? 0.54 : shaft >= 45 ? 0.43 : shaft >= 30 ? 0.29 : shaft >= 14 ? 0.16 : 0.085;
    return { matched: y >= minY && y <= maxY, radialInflate: 0.9, dropSkirtFactor: 0 };
  }

  if (gKey === 'shoe') {
    if (isArm) return NO_MATCH;
    const shaft = shape.shaftHeightCm ?? 0;
    const maxY = shaft >= 48 ? 0.45 : shaft >= 35 ? 0.31 : shaft >= 22 ? 0.21 : shaft >= 12 ? 0.14 : 0.068;
    if (y > maxY) return NO_MATCH;
    if (shape.shoeForm === 'sandal' || shape.shoeForm === 'mule') {
      const isSoleOrStrap = y <= 0.026 || (y >= 0.042 && y <= 0.065);
      return { matched: isSoleOrStrap, radialInflate: 1.45, dropSkirtFactor: 0 };
    }
    return { matched: true, radialInflate: 1.55, dropSkirtFactor: 0 };
  }

  if (slug.includes('necklace') || slug.includes('scarf')) {
    return { matched: !isArm && y >= 0.805 && y <= 0.835, radialInflate: 1.5, dropSkirtFactor: 0 };
  }
  if (slug.includes('bracelet') || slug.includes('watch')) {
    return { matched: ax >= 0.215 && ax <= 0.248, radialInflate: 1.45, dropSkirtFactor: 0 };
  }
  if (slug.includes('belt')) {
    return { matched: !isArm && y >= 0.525 && y <= 0.55, radialInflate: 1.5, dropSkirtFactor: 0 };
  }
  return NO_MATCH;
}

