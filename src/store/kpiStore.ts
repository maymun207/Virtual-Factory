/**
 * KPI Store — KPIs, defects, and trend history.
 */
import { create } from 'zustand';
import type { KPI, Defect } from '../lib/params';
import { INITIAL_KPIS, INITIAL_DEFECTS } from '../lib/params';
import type { KPIHistoryRecord } from '../lib/kpiCalculations';

interface KPIState {
  kpis: KPI[];
  defects: Defect[];
  kpiHistory: KPIHistoryRecord[];

  setKpis: (kpis: KPI[]) => void;
  setDefects: (defects: Defect[]) => void;
  setKpiHistory: (history: KPIHistoryRecord[]) => void;
  resetKPIs: () => void;
}

export const useKPIStore = create<KPIState>((set) => ({
  kpis: INITIAL_KPIS,
  defects: INITIAL_DEFECTS,
  kpiHistory: [],

  setKpis: (kpis) => set({ kpis }),
  setDefects: (defects) => set({ defects }),
  setKpiHistory: (history) => set({ kpiHistory: history }),
  resetKPIs: () => set({
    kpis: INITIAL_KPIS,
    defects: INITIAL_DEFECTS,
    kpiHistory: [],
  }),
}));
