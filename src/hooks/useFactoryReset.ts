/**
 * useFactoryReset — Orchestrates full factory reset across all stores.
 *
 * This keeps individual stores independent. Reset logic that spans
 * multiple stores lives here, not inside any single store.
 */
import { useCallback } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { useKPIStore } from '../store/kpiStore';
import { useUIStore } from '../store/uiStore';

export function useFactoryReset() {
  return useCallback(() => {
    // Reset KPI store
    useKPIStore.getState().resetKPIs();

    // Reset UI panels
    useUIStore.setState({
      showPassport: false,
      showHeatmap: false,
      showControlPanel: false,
    });

    // Reset simulation store
    useSimulationStore.getState().resetSimulation();
  }, []);
}
