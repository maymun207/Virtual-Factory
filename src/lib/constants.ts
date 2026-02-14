// ─── Station Layout ─────────────────────────────────────
export const STATION_COUNT = 7;
export const STATION_SPACING = 0.0625; // Progress units between stations
export const STATION_STAGES = Array.from(
  { length: STATION_COUNT },
  (_, i) => (i + 1) * STATION_SPACING
);
// Result: [0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375]

// ─── Peeking Tolerances ─────────────────────────────────
export const LIGHT_TOLERANCE = 0.018;    // For station light activation (Scene.tsx)
export const SNAPSHOT_TOLERANCE = 0.032; // For matrix snapshot (wider to catch between frames)

// ─── Tile Lifecycle Thresholds ──────────────────────────
export const SPAWN_T = STATION_STAGES[0];                    // 0.0625 (Press)
export const SORT_THRESHOLD = STATION_STAGES[5] + 0.01;      // 0.385  (just past Sorting)
export const COLLECT_THRESHOLD = STATION_STAGES[6] + 0.0325; // 0.47   (just past Packaging)
export const END_OF_LINE_T = 0.5;                             // Tile removal point

// ─── Defect Rate ────────────────────────────────────────
export const DEFECT_PROBABILITY = 0.05;

// ─── Conveyor Visual ────────────────────────────────────
export const SLAT_COUNT = 100;

// ─── Defaults ───────────────────────────────────────────
export const DEFAULT_S_CLOCK_PERIOD = 500;  // ms
export const DEFAULT_STATION_INTERVAL = 4;  // S_clk ticks per station
export const DEFAULT_CONVEYOR_SPEED = 1.0;  // multiplier
