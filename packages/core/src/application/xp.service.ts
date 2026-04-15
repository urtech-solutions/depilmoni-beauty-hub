import type { Promotion, XPLevel } from "../domain/models";

export type XPCalculationInput = {
  orderTotal: number;
  activePromotions?: Promotion[];
  baseRate?: number;
};

export const resolveXPMultiplier = (promotions: Promotion[] = []) =>
  promotions
    .filter((promotion) => promotion.active && promotion.xpMultiplier > 0)
    .reduce((acc, promotion) => acc * promotion.xpMultiplier, 1);

export const calculateXP = ({
  orderTotal,
  activePromotions = [],
  baseRate = 1
}: XPCalculationInput): number => {
  const multiplier = resolveXPMultiplier(activePromotions);
  return Math.floor(orderTotal * baseRate * multiplier);
};

export type LevelResolution = {
  level: XPLevel | null;
  previousLevel: XPLevel | null;
  leveledUp: boolean;
};

export const resolveLevel = (
  xpBalance: number,
  previousXPBalance: number,
  levels: XPLevel[]
): LevelResolution => {
  const sorted = [...levels].sort((left, right) => left.minXP - right.minXP);
  const current = sorted.filter((level) => level.minXP <= xpBalance).at(-1) ?? null;
  const previous = sorted.filter((level) => level.minXP <= previousXPBalance).at(-1) ?? null;

  return {
    level: current,
    previousLevel: previous,
    leveledUp: Boolean(current && current.id !== previous?.id)
  };
};
