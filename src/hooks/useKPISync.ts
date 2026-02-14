/**
 * useKPISync — Subscribes to simulationStore clock changes and
 * pushes KPI updates to kpiStore.
 *
 * This decouples the KPI calculation logic from the simulation store,
 * keeping each store independent and testable.
 */
import { useEffect, useRef } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { useKPIStore } from '../store/kpiStore';
import {
  calculateEnergy,
  calculateFTQ,
  calculateScrap,
  calculateOEE,
  updateKPIs,
  calculateTrends,
  randomizeDefects,
} from '../lib/kpiCalculations';

export function useKPISync() {
  const prevSClockRef = useRef(0);

  useEffect(() => {
    // Subscribe to sClockCount changes in simulationStore
    const unsub = useSimulationStore.subscribe(
      (state) => state.sClockCount,
      (sClockCount) => {
        // Only run when clock actually advances
        if (sClockCount <= prevSClockRef.current) {
          // Reset detected (sClockCount went backwards or stayed same)
          prevSClockRef.current = sClockCount;
          return;
        }
        prevSClockRef.current = sClockCount;

        const simState = useSimulationStore.getState();
        const kpiState = useKPIStore.getState();

        const isRunning =
          simState.isDataFlowing && simState.conveyorStatus === 'running';
        const energy = calculateEnergy(
          simState.conveyorSpeed,
          simState.partPositionsRef.current,
          isRunning,
        );
        const ftq = calculateFTQ(simState.shipmentCount, simState.wasteCount);
        const scrap = calculateScrap(simState.shipmentCount, simState.wasteCount);
        const oee = calculateOEE(simState.conveyorSpeed, ftq);

        // Single-pass KPI update
        let newKpis = updateKPIs(kpiState.kpis, { energy, ftq, scrap, oee });

        // Trend calculation
        const currentVals = {
          oee,
          ftq,
          scrap,
          energy: energy.totalKwh,
          gas: energy.totalGas,
          co2: energy.totalCO2,
        };
        const trendResult = calculateTrends(
          newKpis,
          currentVals,
          kpiState.kpiHistory,
          sClockCount,
        );
        newKpis = trendResult.kpis;

        // Randomize defects
        const newDefects = randomizeDefects(kpiState.defects);

        // Push updates to kpiStore
        useKPIStore.setState({
          kpis: newKpis,
          defects: newDefects,
          kpiHistory: trendResult.history,
        });
      },
    );

    return unsub;
  }, []);
}
