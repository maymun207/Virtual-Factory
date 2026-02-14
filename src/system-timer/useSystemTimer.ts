import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFactoryStore } from '../store/factoryStore';
import { STATION_SPACING } from '../lib/constants';

/**
 * useSystemTimer — The heartbeat of the simulator.
 *
 * Must be rendered inside the R3F <Canvas> tree.
 * Drives all simulation advancement through the store.
 */
export const useSystemTimer = () => {
  const accumulatorRef = useRef(0);

  useFrame((_, delta) => {
    const state = useFactoryStore.getState();

    // ── Guard: Only tick when simulation is active ──
    if (!state.isDataFlowing || state.conveyorStatus !== 'running') {
      accumulatorRef.current = 0; // Reset accumulator when stopped
      return;
    }

    // ── Accumulate real time (in milliseconds) ──
    // conveyorSpeed scales how fast time "passes" for the simulation
    accumulatorRef.current += delta * 1000 * state.conveyorSpeed;

    // ── Emit S_clk ticks ──
    // Process ALL pending ticks in this frame (handles lag spikes gracefully)
    while (accumulatorRef.current >= state.sClockPeriod) {
      accumulatorRef.current -= state.sClockPeriod;
      state.advanceSClock(); // Store action
    }
  });

  return null;
};

/**
 * Compute the base velocity for tile/slat movement.
 * This is a pure function — call it wherever velocity is needed.
 *
 * @returns Progress units per second (before conveyorSpeed scaling)
 */
export const computeBaseVelocity = (
  sClockPeriod: number,
  stationInterval: number
): number => {
  const T_station = (sClockPeriod * stationInterval) / 1000; // seconds per station
  return STATION_SPACING / T_station; // progress units per second
};
