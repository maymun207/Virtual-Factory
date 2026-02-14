/**
 * Telemetry Store — Supabase telemetry sync.
 */
import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { useSimulationStore } from './simulationStore';
import { useKPIStore } from './kpiStore';
import { TELEMETRY_INTERVAL_MS, TELEMETRY_FACTORY_ID, INITIAL_STATIONS } from '../lib/params';

interface TelemetryState {
  telemetryInterval: ReturnType<typeof setInterval> | null;
  startTelemetrySync: () => void;
  stopTelemetrySync: () => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  telemetryInterval: null,

  startTelemetrySync: () => {
    const interval = setInterval(async () => {
      const simState = useSimulationStore.getState();
      if (!simState.isDataFlowing) return;

      const kpiState = useKPIStore.getState();
      const stations = INITIAL_STATIONS; // Station stats are static in current impl

      const statsPayload: { machine_id: string; metric_name: string; value: number }[] = [];

      // Collect Station Stats
      stations.forEach(station => {
        station.stats.forEach(stat => {
          statsPayload.push({
            machine_id: station.id,
            metric_name: stat.label.en,
            value: parseFloat(stat.value) || 0,
          });
        });
      });

      // Collect KPIs
      kpiState.kpis.forEach(kpi => {
        statsPayload.push({
          machine_id: TELEMETRY_FACTORY_ID,
          metric_name: kpi.id,
          value: parseFloat(kpi.value) || 0,
        });
      });

      if (statsPayload.length > 0 && supabase) {
        const { error } = await supabase
          .from('factory_stats')
          .insert(statsPayload);

        if (error) {
          console.error('Error syncing telemetry:', error);
        }
      }
    }, TELEMETRY_INTERVAL_MS);

    set({ telemetryInterval: interval });
  },

  stopTelemetrySync: () => {
    set((state) => {
      if (state.telemetryInterval) {
        clearInterval(state.telemetryInterval);
      }
      return { telemetryInterval: null };
    });
  },
}));
