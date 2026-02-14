/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║                  CENTRALIZED PARAMETER MODULE                     ║
 * ║                                                                   ║
 * ║  Single source of truth for EVERY parameter, constant, initial    ║
 * ║  value, color, dimension, and magic number in the project.        ║
 * ║  NO other file should contain hardcoded values.                   ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════════════════
// SIMULATION — Core timing and layout
// ═══════════════════════════════════════════════════════════════════

export const STATION_COUNT = 7;
export const STATION_SPACING = 0.0625; // Progress units between stations
export const STATION_STAGES = Array.from(
  { length: STATION_COUNT },
  (_, i) => (i + 1) * STATION_SPACING
);
// Result: [0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 0.4375]

export const DEFAULT_S_CLOCK_PERIOD = 500;  // ms
export const DEFAULT_STATION_INTERVAL = 4;  // S_clk ticks per station
export const DEFAULT_CONVEYOR_SPEED = 1.0;  // multiplier

export const DEFECT_PROBABILITY = 0.05;     // 5% chance of defect

// ═══════════════════════════════════════════════════════════════════
// TOLERANCES — How close a tile must be to a station for detection
// ═══════════════════════════════════════════════════════════════════

export const LIGHT_TOLERANCE = 0.018;    // Station light activation (Scene)
export const SNAPSHOT_TOLERANCE = 0.032; // Matrix snapshot (wider to catch between frames)

// ═══════════════════════════════════════════════════════════════════
// TILE LIFECYCLE — Where tiles spawn, get sorted, collected, removed
// ═══════════════════════════════════════════════════════════════════

export const SPAWN_T = STATION_STAGES[0];                    // 0.0625 (Press)
export const SORT_THRESHOLD = STATION_STAGES[5] + 0.01;      // 0.385  (just past Sorting)
export const COLLECT_THRESHOLD = STATION_STAGES[6] + 0.0325; // 0.47   (just past Packaging)
export const END_OF_LINE_T = 0.5;                             // Tile removal point

// ═══════════════════════════════════════════════════════════════════
// CONVEYOR VISUAL — Slat count and curve definition
// ═══════════════════════════════════════════════════════════════════

export const SLAT_COUNT = 100;

/** The CatmullRom spline control points for the conveyor belt loop */
export const CONVEYOR_CURVE_POINTS: [number, number, number][] = [
  [-16, 0.1, 0],
  [16, 0.1, 0],
  [16, -1, 0],
  [-16, -1, 0],
];
export const CONVEYOR_CURVE_TENSION = 0.1;

export const SLAT_GEOMETRY: [number, number, number] = [0.3, 0.05, 2];
export const TILE_GEOMETRY: [number, number, number] = [1.035, 0.071875, 1.035];
export const TILE_Y_OFFSET = 0.07; // Tile hover distance above conveyor

// ═══════════════════════════════════════════════════════════════════
// SCENE LAYOUT — 3D positions, camera, orbit controls
// ═══════════════════════════════════════════════════════════════════

export const STATION_SPACING_3D = 4;   // World units between station centers
export const STATION_CENTER_INDEX = 3; // Station index that sits at x=0

export const TRASH_BIN_POSITION: [number, number, number] = [10, 0, -2.5];
export const SHIPMENT_BOX_POSITION: [number, number, number] = [16, 0, 0];

export const PRODUCTION_TABLE_POSITION: [number, number, number] = [0, 0.05, 8.5];
export const PRODUCTION_TABLE_ROTATION: [number, number, number] = [-Math.PI / 2.5, 0, 0];

export const CAMERA_POSITION: [number, number, number] = [25, 17.3, 21];
export const CAMERA_FOV = 40;

export const ORBIT_CONTROLS = {
  minPolarAngle: Math.PI / 6,
  maxPolarAngle: Math.PI / 2.2,
  minDistance: 20,
  maxDistance: 50,
  dampingFactor: 0.05,
} as const;

// ═══════════════════════════════════════════════════════════════════
// LIGHTING — Ambient, spot, point light configurations
// ═══════════════════════════════════════════════════════════════════

export const AMBIENT_INTENSITY = 0.4;

export const SPOT_LIGHT = {
  position: [10, 20, 10] as [number, number, number],
  angle: 0.15,
  penumbra: 1,
  intensity: 1.5,
  shadowMapSize: 1024,
} as const;

export const POINT_LIGHT = {
  position: [-10, -10, -10] as [number, number, number],
  intensity: 0.5,
} as const;

export const ENVIRONMENT_PRESET = 'city' as const;

// ═══════════════════════════════════════════════════════════════════
// FLOOR GRID — Grid visual configuration
// ═══════════════════════════════════════════════════════════════════

export const GRID_CONFIG = {
  position: [0, -0.01, 0] as [number, number, number],
  cellSize: 1,
  cellThickness: 0.5,
  cellColor: '#202020',
  sectionSize: 5,
  sectionThickness: 1,
  sectionColor: '#00ff88',
  fadeDistance: 30,
  fadeStrength: 1,
} as const;

// ═══════════════════════════════════════════════════════════════════
// COLORS — Every color used across the project
// ═══════════════════════════════════════════════════════════════════

export const COLORS = {
  // Brand / Theme
  primary: '#00ff88',
  accent: '#00d4ff',
  warning: '#ffaa00',
  error: '#ff4444',
  gold: '#fbbf24',

  // Station visuals
  stationBase: '#333',
  stationBodyInactive: '#0a0a0a',
  stationBodyEmissiveOff: '#000000',
  lightOff: '#330000',
  lightOn: '#00ff88',

  // Trash bin
  trashBin: '#808080',
  trashBinInside: '#000',
  trashBinGlow: '#00cc66',
  trashBinCounter: '#ff4444',

  // Shipment box
  shipmentBoxBase: '#8B6914',
  shipmentBoxBack: '#A0782C',
  shipmentBoxFront: '#A0782C',
  shipmentBoxSide: '#96701E',
  shipmentBoxCounter: '#00ff88',
  shipmentBoxLabel: '#fbbf24',

  // Conveyor
  conveyorSlat: '#222',
  conveyorJammed: '#ff4444',

  // Tiles
  tileNormal: '#e5e7eb',
  tileDefected: '#f9a8d4',
  tileLabel: 'black',

  // Production table
  tableBackground: '#0a0a0a',
  tableBorder: '#00ff88',
  tableGridLine: '#333',
  tableHeaderColor: '#fbbf24',
  tableActiveRow: '#fff',
  tableInactiveRow: '#666',
  tableActiveCell: '#00ff88',
  tableEmptyCell: '#222',
  tableCellWhite: '#ffffff',

  // Text
  textWhite: 'white',
  textOutline: '#000000',
} as const;

// ═══════════════════════════════════════════════════════════════════
// MATERIAL PRESETS — Roughness, metalness, opacity configs
// ═══════════════════════════════════════════════════════════════════

export const MATERIALS = {
  stationBase: { roughness: 0.5, metalness: 0.8 },
  stationBody: { roughness: 0.1, metalness: 0.9, opacity: 0.95, emissiveIntensity: 0 },
  stationBodyActive: { emissiveIntensity: 0.8 },
  trashBin: { metalness: 0.6, roughness: 0.4 },
  trashBinGlow: { emissiveIntensity: 2.0 },
  trashBinStrip: { emissiveIntensity: 1.5 },
  shipmentBox: { roughness: 0.8, metalness: 0.1 },
  conveyorSlat: { metalness: 0.6, roughness: 0.4 },
  tile: { roughness: 0.3, metalness: 0.1 },
  tableBase: { roughness: 0.1, metalness: 0.9, opacity: 0.8 },
  tableBorderGlow: { emissiveIntensity: 0.6 },
  tableGridLine: { opacity: 0.5 },
} as const;

// ═══════════════════════════════════════════════════════════════════
// GEOMETRY DIMENSIONS — All 3D object sizes
// ═══════════════════════════════════════════════════════════════════

export const STATION_BASE_SIZE: [number, number, number] = [2, 1, 2];
export const STATION_BASE_Y = 0.5;
export const STATION_BODY_SIZE: [number, number, number] = [1.8, 1, 1.8];
export const STATION_BODY_Y = 1.5;
export const STATION_LIGHT_RADIUS = 0.2;
export const STATION_LIGHT_SEGMENTS = 16;
export const STATION_LIGHT_Y = 2.5;
export const STATION_LABEL_Y = 3.2;

export const TRASH_BIN_SIZE: [number, number, number] = [1.7, 1.65, 1.7];
export const TRASH_BIN_INSIDE_SIZE: [number, number, number] = [1.53, 0.01, 1.53];
export const TRASH_BIN_INSIDE_Y = 0.835;
export const TRASH_BIN_COUNTER_Y = 1.5;
export const TRASH_BIN_RIM_Y = 0.825;
export const TRASH_BIN_RIM_THICKNESS = 0.08;
export const TRASH_BIN_RIM_OFFSET = 0.82;
export const TRASH_BIN_STRIP_OFFSET_Y = -0.15;
export const TRASH_BIN_STRIP_OFFSET_Z = 0.855;
export const TRASH_BIN_STRIP_THICKNESS = 0.045;
export const TRASH_BIN_STRIP_DEPTH = 0.01;
export const TRASH_BIN_STRIP_LENGTH = 1.71;
export const TRASH_BIN_LABEL_Y = -0.65;
export const TRASH_BIN_LABEL_Z = 0.87;

export const SHIPMENT_BOX_BASE: [number, number, number] = [2.5, 0.1, 2.5];
export const SHIPMENT_BOX_BASE_Y = 0.4;
export const SHIPMENT_BOX_BACK_WALL: [number, number, number] = [2.5, 1.2, 0.1];
export const SHIPMENT_BOX_BACK_Y = 1.0;
export const SHIPMENT_BOX_BACK_Z = -1.2;
export const SHIPMENT_BOX_FRONT_WALL: [number, number, number] = [2.5, 0.5, 0.1];
export const SHIPMENT_BOX_FRONT_Y = 0.65;
export const SHIPMENT_BOX_FRONT_Z = 1.2;
export const SHIPMENT_BOX_SIDE_WALL: [number, number, number] = [0.1, 1.2, 2.5];
export const SHIPMENT_BOX_SIDE_Y = 1.0;
export const SHIPMENT_BOX_SIDE_X = 1.2;
export const SHIPMENT_BOX_COUNTER_Y = 3.0;
export const SHIPMENT_BOX_LABEL_Y = 2.2;

// ═══════════════════════════════════════════════════════════════════
// 3D TEXT SIZES — Font sizes for all 3D labels
// ═══════════════════════════════════════════════════════════════════

export const TEXT_SIZES = {
  stationLabel: 0.45,
  stationLabelOutline: 0.02,
  tileId: 0.4,
  tileIdYOffset: 0.04,
  counter: 0.8,
  counterOutline: 0.05,
  shipmentLabel: 0.4,
  shipmentLabelOutline: 0.015,
  trashBinLabel: 0.245,
  trashBinLabelOutline: 0.02,
  tableHeader: 0.32,
  tableStationHeader: 0.28,
  tableStationHeaderMaxWidth: 3.5,
  tableCell: 0.24,
  tableClockCell: 0.26,
} as const;

// ═══════════════════════════════════════════════════════════════════
// PRODUCTION TABLE — Layout parameters
// ═══════════════════════════════════════════════════════════════════

export const TABLE_ROW_COUNT = 9;
export const TABLE_HEIGHT = 10;
export const TABLE_WIDTH = 31;       // From -17 to 14
export const TABLE_CENTER_X = -1.5;  // Table mesh centering offset
export const TABLE_STATION_X: number[] = [-12, -8, -4, 0, 4, 8, 12];
export const TABLE_CLOCK_X = -15.5;
export const TABLE_V_LINES: number[] = [-17, -14, -10, -6, -2, 2, 6, 10, 14];
export const TABLE_BASE_PADDING = 0.6;
export const TABLE_BORDER_PADDING = 0.8;
export const TABLE_BORDER_Z = -0.06;
export const TABLE_GRID_Z = 0.06;
export const TABLE_CONTENT_Z = 0.1;
export const TABLE_GRID_THICKNESS = 0.025;
export const TABLE_BASE_DEPTH = 0.1;
export const TABLE_BORDER_DEPTH = 0.05;

// ═══════════════════════════════════════════════════════════════════
// ANIMATION — Tile sort/collect motion parameters
// ═══════════════════════════════════════════════════════════════════

export const SORT_ANIMATION_SPEED = 10;     // Multiplier for sort throw speed
export const COLLECT_ANIMATION_SPEED = 12;  // Multiplier for collect drop speed
export const SORT_ARC_HEIGHT = 1.5;         // Peak height of sort throw arc
export const COLLECT_ARC_HEIGHT = 0.8;      // Peak height of collect drop arc
export const TILE_SCALE_SPEED = 2;          // How fast tiles scale up on spawn
export const SORT_FADE_THRESHOLD = 0.8;     // Progress at which sorted tile starts fading
export const SORT_FADE_RATE = 5;            // 1 / (1 - SORT_FADE_THRESHOLD)
export const COLLECT_FADE_THRESHOLD = 0.7;  // Progress at which collected tile starts fading
export const COLLECT_FADE_RATE = 3.33;      // 1 / (1 - COLLECT_FADE_THRESHOLD)
export const COLLECT_TARGET_Y = 0.5;        // Y position of shipment target
export const SORT_TARGET_Y = -0.2;          // Y position of trash bin target

// ═══════════════════════════════════════════════════════════════════
// KPI CALCULATION — Factors and constants for formulae
// ═══════════════════════════════════════════════════════════════════

export const CO2_FACTOR_ELECTRIC = 0.4;   // kg CO₂ per kWh
export const CO2_FACTOR_GAS = 1.9;        // kg CO₂ per m³ gas
export const AVAILABILITY_FACTOR = 0.96;  // Simulated 96% uptime
export const DESIGN_SPEED = 2.0;          // Benchmark for 100% performance
export const KPI_TREND_WINDOW = 30;       // Keep last N ticks for trend history
export const KPI_TREND_MIN_TICKS = 5;     // Minimum ticks before showing trend
export const DEFECT_RANDOMIZATION = 0.2;  // +/- range for defect value jitter

// ═══════════════════════════════════════════════════════════════════
// SPEED RANGE — Min/base/max for energy calculations
// ═══════════════════════════════════════════════════════════════════

export const SPEED_RANGE = {
  min: 0.3,
  base: 1.0,
  max: 2.0,
} as const;

// ═══════════════════════════════════════════════════════════════════
// ENERGY CONFIG — Per-station consumption parameters
// ═══════════════════════════════════════════════════════════════════

export interface ConsumptionParams {
  base: number;
  minEffect: number;  // e.g., -0.2 for -20%
  maxEffect: number;  // e.g., 0.3 for +30%
  idleFactor: number; // e.g., 0.15 for 15% consumption when idle
}

export const ENERGY_CONFIG: {
  kwh: Record<string, ConsumptionParams>;
  gas: Record<string, ConsumptionParams>;
} = {
  kwh: {
    press:     { base: 10,  minEffect: -0.2, maxEffect: 0.3,  idleFactor: 0.15 },
    drying:    { base: 20,  minEffect: 0,    maxEffect: 0,    idleFactor: 0.15 },
    glaze:     { base: 8,   minEffect: -0.1, maxEffect: 0.15, idleFactor: 0.15 },
    digital:   { base: 20,  minEffect: -0.3, maxEffect: 0.3,  idleFactor: 0.15 },
    kiln:      { base: 100, minEffect: 0,    maxEffect: 0,    idleFactor: 0.8  },
    sorting:   { base: 10,  minEffect: -0.5, maxEffect: 0.5,  idleFactor: 0.15 },
    packaging: { base: 10,  minEffect: -0.5, maxEffect: 0.5,  idleFactor: 0.15 },
  },
  gas: {
    drying: { base: 30,  minEffect: 0, maxEffect: 0, idleFactor: 0.15 },
    kiln:   { base: 100, minEffect: 0, maxEffect: 0, idleFactor: 0.8  },
  },
};

// ═══════════════════════════════════════════════════════════════════
// TELEMETRY — Sync interval
// ═══════════════════════════════════════════════════════════════════

export const TELEMETRY_INTERVAL_MS = 5000;
export const TELEMETRY_FACTORY_ID = 'factory'; // machine_id for global KPIs

// ═══════════════════════════════════════════════════════════════════
// UI — Conveyor speed slider range and control panel config
// ═══════════════════════════════════════════════════════════════════

export const CONVEYOR_SPEED_RANGE = {
  min: 0.3,
  max: 2,
  step: 0.1,
} as const;

export const S_CLOCK_RANGE = {
  min: 100,
  max: 2000,
  step: 100,
} as const;

export const STATION_INTERVAL_RANGE = {
  min: 1,
  max: 20,
  step: 1,
} as const;

// ═══════════════════════════════════════════════════════════════════
// INITIAL DATA — Stations, KPIs, Defects
// ═══════════════════════════════════════════════════════════════════

export interface StationData {
  id: string;
  name: { tr: string; en: string };
  status: 'normal' | 'warning' | 'error';
  icon: string;
  color: string;
  protocol: string;
  stats: {
    label: { tr: string; en: string };
    value: string;
    unit?: string;
    status?: 'normal' | 'warning' | 'error';
  }[];
}

export interface KPI {
  id: string;
  label: { tr: string; en: string };
  value: string;
  unit: string;
  trend: { tr: string; en: string };
  trendDirection: 'up' | 'down';
  status?: 'normal' | 'warning' | 'error';
}

export interface Defect {
  name: string;
  value: number;
  label: { tr: string; en: string };
}

export const INITIAL_STATIONS: StationData[] = [
  {
    id: 'press',
    name: { tr: 'PRES', en: 'PRESS' },
    status: 'normal',
    icon: '🔨',
    color: '#00ff88',
    protocol: 'Modbus TCP',
    stats: [
      { label: { tr: 'Pres Kuvveti', en: 'Press Force' }, value: '2500', unit: 'bar' },
      { label: { tr: 'Titreşim', en: 'Vibration' }, value: '0.8', unit: 'mm/s' },
    ],
  },
  {
    id: 'drying',
    name: { tr: 'KURUTMA', en: 'DRYING' },
    status: 'normal',
    icon: '💨',
    color: '#0077ff',
    protocol: 'OPC-UA',
    stats: [
      { label: { tr: 'Nem', en: 'Humidity' }, value: '5', unit: '%' },
      { label: { tr: 'Sıcaklık', en: 'Temp' }, value: '110-125', unit: '°C' },
    ],
  },
  {
    id: 'glaze',
    name: { tr: 'SIR/RENK', en: 'GLAZE/COLOR' },
    status: 'warning',
    icon: '🎨',
    color: '#00d4ff',
    protocol: 'Modbus RTU',
    stats: [
      { label: { tr: 'Viskozite', en: 'Viscosity' }, value: '45', unit: 's', status: 'warning' },
      { label: { tr: 'Gramaj', en: 'Weight' }, value: '680', unit: 'g/m²' },
    ],
  },
  {
    id: 'print',
    name: { tr: 'DİJİTAL BASKI', en: 'DIGITAL PRINT' },
    status: 'normal',
    icon: '🖨️',
    color: '#ff00ff',
    protocol: 'OPC-UA',
    stats: [
      { label: { tr: 'Kafa Isısı', en: 'Head Temp' }, value: '42', unit: '°C' },
      { label: { tr: 'Basınç', en: 'Pressure' }, value: '2.1', unit: 'bar' },
    ],
  },
  {
    id: 'kiln',
    name: { tr: 'FIRIN', en: 'KILN' },
    status: 'error',
    icon: '🔥',
    color: '#ff4444',
    protocol: 'Modbus TCP',
    stats: [
      { label: { tr: 'Sıcaklık', en: 'Temp' }, value: '1203', unit: '°C' },
      { label: { tr: 'E. Tüketimi', en: 'Energy' }, value: '18.2', unit: 'kWh', status: 'error' },
    ],
  },
  {
    id: 'sorting',
    name: { tr: 'AYIKLAMA', en: 'SORTING' },
    status: 'normal',
    icon: '🔍',
    color: '#aa00ff',
    protocol: 'AI Vision',
    stats: [
      { label: { tr: 'Kalite', en: 'Quality' }, value: '92.7', unit: '%' },
      { label: { tr: 'Sınıf A', en: 'Grade A' }, value: '85', unit: '%' },
    ],
  },
  {
    id: 'packaging',
    name: { tr: 'PAKETLEME', en: 'PACKAGING' },
    status: 'normal',
    icon: '📦',
    color: '#ffffff',
    protocol: 'Modbus RTU',
    stats: [
      { label: { tr: 'Adet', en: 'Count' }, value: '6', unit: 'pcs' },
      { label: { tr: 'Ağırlık', en: 'Weight' }, value: '28.5', unit: 'kg' },
    ],
  },
];

export const INITIAL_KPIS: KPI[] = [
  { id: 'oee', label: { tr: 'OEE', en: 'OEE' }, value: '0.0', unit: '%', trend: { tr: '↑ %0.0', en: '↑ 0.0%' }, trendDirection: 'up' },
  { id: 'ftq', label: { tr: 'FTQ', en: 'FTQ' }, value: '100.0', unit: '%', trend: { tr: '↑ %0.0', en: '↑ 0.0%' }, trendDirection: 'up' },
  { id: 'scrap', label: { tr: 'Hurda', en: 'Scrap' }, value: '0.0', unit: '%', trend: { tr: '↓ %0.0', en: '↓ 0.0%' }, trendDirection: 'down' },
  { id: 'energy', label: { tr: 'Enerji', en: 'Energy' }, value: '91.7', unit: 'kWh', trend: { tr: '↓ %0.0', en: '↓ 0.0%' }, trendDirection: 'down' },
  { id: 'gas', label: { tr: 'Doğal Gaz', en: 'Natural Gas' }, value: '84.5', unit: 'm³', trend: { tr: '↓ %0.0', en: '↓ 0.0%' }, trendDirection: 'down' },
  { id: 'co2', label: { tr: 'CO₂', en: 'CO₂' }, value: '197.2', unit: 'kg', trend: { tr: '↓ %0.0', en: '↓ 0.0%' }, trendDirection: 'down' },
];

export const INITIAL_DEFECTS: Defect[] = [
  { name: 'pinhole', value: 0.8, label: { tr: 'Pinhole', en: 'Pinhole' } },
  { name: 'glaze', value: 1.2, label: { tr: 'Glaze Akması', en: 'Glaze Flow' } },
  { name: 'banding', value: 0.5, label: { tr: 'Banding', en: 'Banding' } },
  { name: 'black', value: 0.4, label: { tr: 'Siyah Çekirdek', en: 'Black Core' } },
  { name: 'ghosting', value: 0.2, label: { tr: 'Ghosting', en: 'Ghosting' } },
  { name: 'edge', value: 2.1, label: { tr: 'Kenar Kırığı', en: 'Edge Break' } },
  { name: 'crack', value: 0.1, label: { tr: 'Çatlak', en: 'Crack' } },
  { name: 'pattern', value: 0.3, label: { tr: 'Desen Kayması', en: 'Pattern Shift' } },
];

// ═══════════════════════════════════════════════════════════════════
// DEFECT HEATMAP — Thresholds for color coding
// ═══════════════════════════════════════════════════════════════════

export const DEFECT_THRESHOLD_HIGH = 2;   // >= this = red
export const DEFECT_THRESHOLD_MEDIUM = 1; // >= this = orange, else green

// ═══════════════════════════════════════════════════════════════════
// STATUS MATRIX — Dimensions
// ═══════════════════════════════════════════════════════════════════

export const STATUS_MATRIX_ROWS = 9;
export const STATUS_MATRIX_COLS = 7;

/** Create the initial empty status matrix */
export const createInitialStatusMatrix = (): (string | null)[][] =>
  Array(STATUS_MATRIX_ROWS).fill(null).map(() => Array(STATUS_MATRIX_COLS).fill(null));

// ═══════════════════════════════════════════════════════════════════
// UTILITY — Derive station 3D position from index
// ═══════════════════════════════════════════════════════════════════

export const getStationPosition = (index: number): [number, number, number] => [
  (index - STATION_CENTER_INDEX) * STATION_SPACING_3D,
  0,
  0,
];

// ═══════════════════════════════════════════════════════════════════
// VELOCITY — Pure function for base velocity computation
// ═══════════════════════════════════════════════════════════════════

/**
 * Compute the base velocity for tile/slat movement.
 * @returns Progress units per second (before conveyorSpeed scaling)
 */
export const computeBaseVelocity = (
  sClockPeriod: number,
  stationInterval: number
): number => {
  const T_station = (sClockPeriod * stationInterval) / 1000; // seconds per station
  return STATION_SPACING / T_station; // progress units per second
};

// ═══════════════════════════════════════════════════════════════════
// 3D LABELS — Hardcoded (non-translatable) labels for Scene objects
// ═══════════════════════════════════════════════════════════════════

export const LABEL_WASTE_BIN = 'WASTE BIN';
export const LABEL_SHIPMENT = 'SHIPMENT';

// ═══════════════════════════════════════════════════════════════════
// KPI IDs — Shared type for type-safe KPI matching
// ═══════════════════════════════════════════════════════════════════

export const KPI_IDS = ['oee', 'ftq', 'scrap', 'energy', 'gas', 'co2'] as const;
export type KpiId = typeof KPI_IDS[number];

// ═══════════════════════════════════════════════════════════════════
// TILE PASSPORT — Default display values
// ═══════════════════════════════════════════════════════════════════

export const TILE_PASSPORT_DEFAULTS = {
  lot: 'LOT-2024-001',
  order: 'ORD-7845',
  recipe: 'GLZ-STD-01',
  qualityScore: '92.5',
} as const;

// ═══════════════════════════════════════════════════════════════════
// PANEL UI — Min widths, positions, and offsets
// ═══════════════════════════════════════════════════════════════════

export const PANEL_MIN_WIDTHS = {
  tilePassport: 260,
  defectHeatmap: 260,
  kpiContainer: 260,
} as const;

/** Minimum top offset (px) to clear the header */
export const PANEL_HEADER_CLEARANCE = 70;
/** Horizontal gap between cascaded panels */
export const PANEL_CASCADE_X = 268;
/** Default panel width (px) */
export const PANEL_DEFAULT_WIDTH = 260;
/** Margin from viewport edges (px) */
export const PANEL_EDGE_MARGIN = 12;
/** Minimum clearance from bottom for toolbar (px) */
export const PANEL_BOTTOM_CLEARANCE = 100;
export const CONTROL_PANEL_GAP = 8;

// ═══════════════════════════════════════════════════════════════════
// HEADER UI — Gradient and button config
// ═══════════════════════════════════════════════════════════════════

export const HEADER_GRADIENT = {
  from: '#00ff88',
  to: '#00d4ff',
} as const;
