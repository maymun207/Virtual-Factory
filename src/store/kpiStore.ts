/**
 * KPI Store — KPIs, defects, and trend history.
 * Updated via useKPISync hook, not directly by simulationStore.
 */
import { create } from 'zustand';
import type { KPI, Defect } from '../lib/params';
import { INITIAL_KPIS, INITIAL_DEFECTS } from '../lib/params';
import type { KPIHistoryRecord } from '../lib/kpiCalculations';

interface KPIState {
  kpis: KPI[];
  defects: Defect[];
  kpiHistory: KPIHistoryRecord[];

  resetKPIs: () => void;
}

export const useKPIStore = create<KPIState>((set) => ({
  kpis: INITIAL_KPIS,
  defects: INITIAL_DEFECTS,
  kpiHistory: [],

  resetKPIs: () => set({
    kpis: INITIAL_KPIS,
    defects: INITIAL_DEFECTS,
    kpiHistory: [],
  }),
}));
