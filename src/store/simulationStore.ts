/**
 * Simulation Store — Clocks, conveyor, matrix, tile tracking.
 * The advanceSClock action orchestrates KPI updates via kpiStore.
 */
import { create } from 'zustand';
import {
  DEFAULT_S_CLOCK_PERIOD,
  DEFAULT_STATION_INTERVAL,
  DEFAULT_CONVEYOR_SPEED,
  STATION_STAGES,
  SNAPSHOT_TOLERANCE,
  INITIAL_STATIONS,
  createInitialStatusMatrix,
} from '../lib/params';
import {
  calculateEnergy,
  calculateFTQ,
  calculateScrap,
  calculateOEE,
  updateKPIs,
  calculateTrends,
  randomizeDefects,
} from '../lib/kpiCalculations';
import { useKPIStore } from './kpiStore';
import { useUIStore } from './uiStore';

interface SimulationState {
  // Data flow
  isDataFlowing: boolean;

  // Mutable tile tracking (imperative, not reactive)
  partPositionsRef: { current: number[] };
  partIdsRef: { current: number[] };

  // Clock state
  sClockPeriod: number;
  stationInterval: number;
  sClockCount: number;
  pClockCount: number;

  // Status matrix
  statusMatrix: (string | null)[][];

  // Counters
  wasteCount: number;
  shipmentCount: number;

  // Conveyor
  conveyorSpeed: number;
  conveyorStatus: 'running' | 'stopped' | 'jammed';

  // Stations (for rendering)
  stations: typeof INITIAL_STATIONS;

  // Reset
  resetVersion: number;

  // Actions
  toggleDataFlow: () => void;
  setSClockPeriod: (period: number) => void;
  setStationInterval: (interval: number) => void;
  setConveyorSpeed: (speed: number) => void;
  setConveyorStatus: (status: 'running' | 'stopped' | 'jammed') => void;
  incrementWasteCount: () => void;
  incrementShipmentCount: () => void;
  advanceSClock: () => void;
  resetFactory: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  isDataFlowing: false,
  partPositionsRef: { current: [] },
  partIdsRef: { current: [] },
  sClockPeriod: DEFAULT_S_CLOCK_PERIOD,
  stationInterval: DEFAULT_STATION_INTERVAL,
  sClockCount: 0,
  pClockCount: 0,
  statusMatrix: createInitialStatusMatrix(),
  wasteCount: 0,
  shipmentCount: 0,
  conveyorSpeed: DEFAULT_CONVEYOR_SPEED,
  conveyorStatus: 'stopped',
  stations: INITIAL_STATIONS,
  resetVersion: 0,

  toggleDataFlow: () => set((s) => ({
    isDataFlowing: !s.isDataFlowing,
    conveyorStatus: !s.isDataFlowing ? 'running' : 'stopped',
  })),

  setSClockPeriod: (period) => set({ sClockPeriod: period }),
  setStationInterval: (interval) => set({ stationInterval: interval }),
  setConveyorSpeed: (speed) => set({ conveyorSpeed: speed }),
  setConveyorStatus: (status) => set({
    conveyorStatus: status,
    isDataFlowing: status === 'running',
  }),
  incrementWasteCount: () => set((s) => ({ wasteCount: s.wasteCount + 1 })),
  incrementShipmentCount: () => set((s) => ({ shipmentCount: s.shipmentCount + 1 })),

  advanceSClock: () => set((state) => {
    const nextSClockCount = state.sClockCount + 1;
    let nextPClockCount = state.pClockCount;
    let nextStatusMatrix = state.statusMatrix; // No copy unless needed

    // P_clk tick: fires every stationInterval S_clk ticks
    const isPressTick = nextSClockCount % state.stationInterval === 0;
    if (isPressTick) {
      nextPClockCount += 1;

      // Snapshot occupancy from physical positions
      const currentOccupancy = STATION_STAGES.map((stage, idx) => {
        if (idx === 0) return `Tile #${nextPClockCount}`;
        const partIdx = state.partPositionsRef.current
          .findIndex(t => Math.abs(t - stage) < SNAPSHOT_TOLERANCE);
        const partId = partIdx !== -1
          ? state.partIdsRef.current[partIdx]
          : null;
        return partId ? `Tile #${partId}` : null;
      });

      nextStatusMatrix = [currentOccupancy, ...state.statusMatrix.slice(0, 8)];
    }

    // ── KPI Update (via kpiStore) ──
    const isRunning = state.isDataFlowing && state.conveyorStatus === 'running';
    const energy = calculateEnergy(state.conveyorSpeed, state.partPositionsRef.current, isRunning);
    const ftq = calculateFTQ(state.shipmentCount, state.wasteCount);
    const scrap = calculateScrap(state.shipmentCount, state.wasteCount);
    const oee = calculateOEE(state.conveyorSpeed, ftq);

    // Single-pass KPI update
    const kpiState = useKPIStore.getState();
    let newKpis = updateKPIs(kpiState.kpis, { energy, ftq, scrap, oee });

    // Trend calculation
    const currentVals = {
      oee, ftq, scrap,
      energy: energy.totalKwh,
      gas: energy.totalGas,
      co2: energy.totalCO2,
    };
    const trendResult = calculateTrends(newKpis, currentVals, kpiState.kpiHistory, nextSClockCount);
    newKpis = trendResult.kpis;

    // Randomize defects
    const newDefects = randomizeDefects(kpiState.defects);

    // Push KPI updates to kpiStore
    useKPIStore.setState({
      kpis: newKpis,
      defects: newDefects,
      kpiHistory: trendResult.history,
    });

    return {
      sClockCount: nextSClockCount,
      pClockCount: nextPClockCount,
      statusMatrix: nextStatusMatrix,
    };
  }),

  resetFactory: () => {
    // Reset KPI store
    useKPIStore.getState().resetKPIs();
    // Reset UI store
    useUIStore.setState({
      showPassport: false,
      showHeatmap: false,
      showControlPanel: false,
    });
    // Reset simulation
    set((s) => ({
      partPositionsRef: { current: [] },
      partIdsRef: { current: [] },
      sClockCount: 0,
      pClockCount: 0,
      statusMatrix: createInitialStatusMatrix(),
      isDataFlowing: false,
      conveyorSpeed: DEFAULT_CONVEYOR_SPEED,
      conveyorStatus: 'stopped',
      resetVersion: s.resetVersion + 1,
      wasteCount: 0,
      shipmentCount: 0,
      stations: INITIAL_STATIONS,
    }));
  },
}));
