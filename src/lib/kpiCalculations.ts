/**
 * KPI Calculations — Pure functions for all KPI-related math.
 * Extracted from the monolithic advanceSClock() for testability and modularity.
 */
import type { ConsumptionParams, KPI, Defect } from './params';
import {
  ENERGY_CONFIG,
  CO2_FACTOR_ELECTRIC,
  CO2_FACTOR_GAS,
  AVAILABILITY_FACTOR,
  DESIGN_SPEED,
  STATION_STAGES,
  SNAPSHOT_TOLERANCE,
  KPI_TREND_WINDOW,
  KPI_TREND_MIN_TICKS,
  DEFECT_RANDOMIZATION,
} from './params';
import { calculateConsumption } from './energyConfig';

// ─── Energy & Emissions ────────────────────────────────────────

export interface EnergyResult {
  totalKwh: number;
  totalGas: number;
  totalCO2: number;
}

export const calculateEnergy = (
  conveyorSpeed: number,
  partPositions: number[],
  isRunning: boolean,
): EnergyResult => {
  const checkOccupancy = (stageIdx: number) =>
    partPositions.some(t => Math.abs(t - STATION_STAGES[stageIdx]) < SNAPSHOT_TOLERANCE);

  const machineStates: Record<string, boolean> = {
    press: isRunning,
    drying: checkOccupancy(1),
    glaze: checkOccupancy(2),
    digital: checkOccupancy(3),
    kiln: checkOccupancy(4),
    sorting: checkOccupancy(5),
    packaging: checkOccupancy(6),
  };

  const totalKwh = Object.entries(ENERGY_CONFIG.kwh).reduce(
    (acc, [id, params]) => acc + calculateConsumption(params as ConsumptionParams, conveyorSpeed, machineStates[id], isRunning),
    0
  );
  const totalGas = Object.entries(ENERGY_CONFIG.gas).reduce(
    (acc, [id, params]) => acc + calculateConsumption(params as ConsumptionParams, conveyorSpeed, machineStates[id], isRunning),
    0
  );
  const totalCO2 = (totalKwh * CO2_FACTOR_ELECTRIC) + (totalGas * CO2_FACTOR_GAS);

  return { totalKwh, totalGas, totalCO2 };
};

// ─── Quality KPIs ──────────────────────────────────────────────

export const calculateFTQ = (shipmentCount: number, wasteCount: number): number => {
  const total = shipmentCount + wasteCount;
  return total === 0 ? 100.0 : (shipmentCount / total) * 100;
};

export const calculateScrap = (shipmentCount: number, wasteCount: number): number => {
  const total = shipmentCount + wasteCount;
  return total === 0 ? 0.0 : (wasteCount / total) * 100;
};

// ─── OEE ───────────────────────────────────────────────────────

export const calculateOEE = (conveyorSpeed: number, ftq: number): number => {
  const performance = Math.min(1.0, conveyorSpeed / DESIGN_SPEED);
  const quality = ftq / 100;
  return Math.min(100, AVAILABILITY_FACTOR * performance * quality * 100);
};

// ─── Single-Pass KPI Update ────────────────────────────────────

export interface KPIUpdateInput {
  energy: EnergyResult;
  ftq: number;
  scrap: number;
  oee: number;
}

export const updateKPIs = (kpis: KPI[], input: KPIUpdateInput): KPI[] => {
  return kpis.map(kpi => {
    switch (kpi.id) {
      case 'energy': return { ...kpi, value: input.energy.totalKwh.toFixed(1) };
      case 'gas':    return { ...kpi, value: input.energy.totalGas.toFixed(1) };
      case 'co2':    return { ...kpi, value: input.energy.totalCO2.toFixed(1) };
      case 'ftq':    return { ...kpi, value: input.ftq.toFixed(1) };
      case 'scrap':  return { ...kpi, value: input.scrap.toFixed(1) };
      case 'oee':    return { ...kpi, value: input.oee.toFixed(1) };
      default:       return kpi;
    }
  });
};

// ─── Trend Calculation ─────────────────────────────────────────

export interface KPIHistoryRecord {
  sClock: number;
  values: Record<string, number>;
}

const INVERTED_KPIS = ['scrap', 'energy', 'gas', 'co2'];
const TRACKED_KPI_IDS = ['oee', 'ftq', 'scrap', 'energy', 'gas', 'co2'];

export const calculateTrends = (
  kpis: KPI[],
  currentVals: Record<string, number>,
  history: KPIHistoryRecord[],
  sClockCount: number,
): { kpis: KPI[]; history: KPIHistoryRecord[] } => {
  const nextHistory = [
    ...history,
    { sClock: sClockCount, values: currentVals },
  ].filter(h => sClockCount - h.sClock <= KPI_TREND_WINDOW);

  const oldRecord = nextHistory[0];
  if (!oldRecord || sClockCount - oldRecord.sClock < KPI_TREND_MIN_TICKS) {
    return { kpis, history: nextHistory };
  }

  const updatedKpis = kpis.map(kpi => {
    if (!TRACKED_KPI_IDS.includes(kpi.id)) return kpi;

    const current = currentVals[kpi.id];
    const previous = oldRecord.values[kpi.id];
    if (current === undefined || previous === undefined) return kpi;

    const diff = current - previous;
    const absDiff = Math.abs(diff).toFixed(1);
    const isIncreasing = diff >= 0;

    let trendDir: 'up' | 'down';
    if (INVERTED_KPIS.includes(kpi.id)) {
      trendDir = isIncreasing ? 'down' : 'up';
    } else {
      trendDir = isIncreasing ? 'up' : 'down';
    }

    const arrow = isIncreasing ? '↑' : '↓';

    return {
      ...kpi,
      trend: { tr: `${arrow} %${absDiff}`, en: `${arrow} ${absDiff}%` },
      trendDirection: trendDir,
    };
  });

  return { kpis: updatedKpis, history: nextHistory };
};

// ─── Defect Randomization ──────────────────────────────────────

export const randomizeDefects = (defects: Defect[]): Defect[] => {
  return defects.map(d => ({
    ...d,
    value: Number(Math.max(0, parseFloat((d.value + (Math.random() - 0.5) * DEFECT_RANDOMIZATION).toFixed(1)))),
  }));
};
