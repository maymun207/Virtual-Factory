/**
 * Energy consumption calculation — pure function module.
 * All config data lives in params.ts.
 */
import type { ConsumptionParams } from './params';
import { SPEED_RANGE } from './params';

/**
 * Calculates current consumption for a specific parameter based on speed and occupancy.
 */
export const calculateConsumption = (
  params: ConsumptionParams,
  currentSpeed: number,
  isOccupied: boolean,
  isRunning: boolean
): number => {
  if (!isRunning) return params.base * params.idleFactor;

  let multiplier = 1;
  if (currentSpeed <= SPEED_RANGE.min) {
    multiplier = 1 + params.minEffect;
  } else if (currentSpeed >= SPEED_RANGE.max) {
    multiplier = 1 + params.maxEffect;
  } else if (currentSpeed < SPEED_RANGE.base) {
    const t = (currentSpeed - SPEED_RANGE.min) / (SPEED_RANGE.base - SPEED_RANGE.min);
    multiplier = 1 + params.minEffect * (1 - t);
  } else {
    const t = (currentSpeed - SPEED_RANGE.base) / (SPEED_RANGE.max - SPEED_RANGE.base);
    multiplier = 1 + params.maxEffect * t;
  }

  const baseWithSpeed = params.base * multiplier;
  return isOccupied ? baseWithSpeed : baseWithSpeed * params.idleFactor;
};
