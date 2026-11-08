import { MannequinModelId, MannequinModelInfo } from '@/types';
import {
  MannequinAgeClass,
  WardrobeFitProfile,
  WardrobeItemV1,
  WardrobeSetV1,
} from '@/types/wardrobe';
import { MANNEQUIN_MODELS } from '../models';
import { getWardrobeItemById } from './catalog';

export interface CompatibilityResult {
  compatible: boolean;
  reason?: string;
}

export function getModelInfoById(modelId: MannequinModelId): MannequinModelInfo | undefined {
  return MANNEQUIN_MODELS.find((m) => m.id === modelId);
}

export function getModelAgeClass(modelId: MannequinModelId): MannequinAgeClass {
  const info = getModelInfoById(modelId);
  if (!info || !info.ageClass) return 'unknown';
  return info.ageClass;
}

export function getModelFitProfile(modelId: MannequinModelId): WardrobeFitProfile {
  const info = getModelInfoById(modelId);
  if (info?.fitProfile) return info.fitProfile;
  if (info?.lifeStage === 'youth') return 'youth';
  if (info?.gender === 'female') return 'adult-feminine';
  if (info?.gender === 'male') return 'adult-masculine';
  return 'adult-unisex';
}

export function isFitProfileCompatible(
  itemFit: WardrobeFitProfile,
  modelFit: WardrobeFitProfile,
  ageClass: MannequinAgeClass
): boolean {
  if (ageClass === 'minor') {
    return itemFit === 'youth' || itemFit === 'adult-unisex';
  }
  if (modelFit === 'youth') {
    return itemFit === 'youth' || itemFit === 'adult-unisex';
  }
  if (itemFit === 'adult-unisex') return true;
  return itemFit === modelFit;
}

/**
 * 결정 순서:
 * 1) 모델 레지스트리의 ageClass 확인
 * 2) 품목 adultOnly 확인 (adult가 아니면 minor 또는 unknown 모두 거절)
 * 3) fitProfile과 모델 메시 호환 확인
 * 4) compatibleProfileIds 포함 여부 확인
 */
export function isCompatible(
  item: WardrobeItemV1,
  modelId: MannequinModelId
): CompatibilityResult {
  const info = getModelInfoById(modelId);
  if (!info) {
    return { compatible: false, reason: `존재하지 않는 모델 ID입니다 (${modelId}).` };
  }

  const ageClass = getModelAgeClass(modelId);

  if (item.adultOnly) {
    if (ageClass === 'minor') {
      return {
        compatible: false,
        reason: '아동·청소년 모델에는 성인 전용 의상이나 이너웨어를 적용할 수 없습니다.',
      };
    }
    if (ageClass === 'unknown') {
      return {
        compatible: false,
        reason: '연령이 명시적으로 성인으로 확인되지 않은 모델에는 성인 전용 품목을 적용할 수 없습니다.',
      };
    }
  }

  if (ageClass === 'minor' && item.styleTags.some((t) => t.includes('성인') || t.includes('섹시'))) {
    return {
      compatible: false,
      reason: '아동·청소년 모델에는 성인 스타일 태그 품목을 적용할 수 없습니다.',
    };
  }

  const modelFit = getModelFitProfile(modelId);
  if (!isFitProfileCompatible(item.fitProfile, modelFit, ageClass)) {
    return {
      compatible: false,
      reason: `체형 피팅(${item.fitProfile})이 현재 모델(${modelFit})과 호환되지 않습니다.`,
    };
  }

  if (
    item.compatibleProfileIds.length > 0 &&
    !item.compatibleProfileIds.includes(modelId)
  ) {
    return {
      compatible: false,
      reason: `현재 모델(${info.name})에서 검증된 의상 메시 목록에 포함되지 않았습니다.`,
    };
  }

  return { compatible: true };
}

export function isSetCompatible(
  setItem: WardrobeSetV1,
  modelId: MannequinModelId
): CompatibilityResult {
  const ageClass = getModelAgeClass(modelId);
  if (setItem.adultOnly && ageClass !== 'adult') {
    return {
      compatible: false,
      reason:
        ageClass === 'minor'
          ? '아동·청소년 모델에는 성인 전용 코디 세트를 적용할 수 없습니다.'
          : '연령 미확인(unknown) 모델에는 성인 전용 코디 세트를 적용할 수 없습니다.',
    };
  }

  for (const refId of setItem.itemIds) {
    const item = getWardrobeItemById(refId);
    if (!item) {
      return {
        compatible: false,
        reason: `세트에 포함된 품목(${refId})을 카탈로그에서 찾을 수 없습니다.`,
      };
    }
    const check = isCompatible(item, modelId);
    if (!check.compatible) {
      return {
        compatible: false,
        reason: `${item.nameKo}: ${check.reason}`,
      };
    }
  }

  return { compatible: true };
}

export interface ModelMigrationHoldItem {
  itemId: string;
  nameKo: string;
  reason: string;
}

export function partitionItemsByModelCompatibility(
  itemIds: string[],
  modelId: MannequinModelId
): {
  compatibleItemIds: string[];
  heldItems: ModelMigrationHoldItem[];
} {
  const compatibleItemIds: string[] = [];
  const heldItems: ModelMigrationHoldItem[] = [];

  for (const id of itemIds) {
    const item = getWardrobeItemById(id);
    if (!item) {
      heldItems.push({
        itemId: id,
        nameKo: id,
        reason: '카탈로그에서 제거되었거나 존재하지 않는 품목 ID입니다.',
      });
      continue;
    }
    const res = isCompatible(item, modelId);
    if (res.compatible) {
      compatibleItemIds.push(id);
    } else {
      heldItems.push({
        itemId: id,
        nameKo: item.nameKo,
        reason: res.reason || '모델과 호환되지 않습니다.',
      });
    }
  }

  return { compatibleItemIds, heldItems };
}

