import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';


export type Language = 'tr' | 'en';

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
    trendDirection: 'up' | 'down'; // 'up' is good for OEE, bad for Scrap
    status?: 'normal' | 'warning' | 'error';
}

interface Defect {
    name: string;
    value: number;
    label: { tr: string; en: string };
}

interface FactoryState {
    // System State
    currentLang: Language;
    isDataFlowing: boolean;
    activeModal: string | null;
    showPassport: boolean;
    showHeatmap: boolean;
    showControlPanel: boolean;

    // Simulation State
    tilePosition: number; 
    partPositions: number[]; 
    partPositionsRef: { current: number[] };

    // Timing Systems
    sClockPeriod: number;
    cFactor: number;
    pFactor: number;
    sClockCount: number;
    pClockCount: number;
    statusMatrix: (string | null)[][]; // 5 rows x 7 cols (history of steps)
    
    setSClockPeriod: (period: number) => void;
    setCFactor: (factor: number) => void;
    setPFactor: (factor: number) => void;

    // Data
    stations: StationData[];
    kpis: KPI[];
    defects: Defect[];

    // Actions
    setLanguage: (lang: Language) => void;
    toggleDataFlow: () => void;
    setModal: (modalId: string | null) => void;
    togglePassport: () => void;
    toggleHeatmap: () => void;
    toggleControlPanel: () => void;
    updateSimulation: () => void;
    setPartPositions: (positions: number[]) => void;

    // Conveyor State
    conveyorSpeed: number;
    conveyorStatus: 'running' | 'stopped' | 'jammed';
    activeParts: { id: number; t: number; isDefected: boolean; label: string | number }[];
    setConveyorSpeed: (speed: number) => void;
    setConveyorStatus: (status: 'running' | 'stopped' | 'jammed') => void;
    addPart: (part: { id: number; t: number; isDefected: boolean; label: string | number }) => void;
    updatePart: (id: number, t: number, isDefected?: boolean) => void;
    removePart: (id: number) => void;

    // Telemetry
    telemetryInterval: ReturnType<typeof setInterval> | null;
    startTelemetrySync: () => void;
    stopTelemetrySync: () => void;
    
    // Reset
    resetVersion: number;
    resetFactory: () => void;
}


const INITIAL_STATIONS: StationData[] = [
    {
        id: 'press',
        name: { tr: 'PRES', en: 'PRESS' },
        status: 'normal',
        icon: '🔨',
        color: '#00ff88',
        protocol: 'Modbus TCP',
        stats: [
            { label: { tr: 'Pres Kuvveti', en: 'Press Force' }, value: '2500', unit: 'bar' },
            { label: { tr: 'Titreşim', en: 'Vibration' }, value: '0.8', unit: 'mm/s' }
        ]
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
            { label: { tr: 'Sıcaklık', en: 'Temp' }, value: '110-125', unit: '°C' }
        ]
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
            { label: { tr: 'Gramaj', en: 'Weight' }, value: '680', unit: 'g/m²' }
        ]
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
            { label: { tr: 'Basınç', en: 'Pressure' }, value: '2.1', unit: 'bar' }
        ]
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
            { label: { tr: 'E. Tüketimi', en: 'Energy' }, value: '18.2', unit: 'kWh', status: 'error' }
        ]
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
            { label: { tr: 'Sınıf A', en: 'Grade A' }, value: '85', unit: '%' }
        ]
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
            { label: { tr: 'Ağırlık', en: 'Weight' }, value: '28.5', unit: 'kg' }
        ]
    }
];

const INITIAL_KPIS: KPI[] = [
    { id: 'oee', label: { tr: 'OEE', en: 'OEE' }, value: '85.3', unit: '%', trend: { tr: '↑ %2.1', en: '↑ 2.1%' }, trendDirection: 'up' },
    { id: 'ftq', label: { tr: 'FTQ', en: 'FTQ' }, value: '92.7', unit: '%', trend: { tr: '↑ %1.3', en: '↑ 1.3%' }, trendDirection: 'up' },
    { id: 'scrap', label: { tr: 'Hurda', en: 'Scrap' }, value: '3.2', unit: '%', trend: { tr: '↓ %0.5', en: '↓ 0.5%' }, trendDirection: 'down', status: 'warning' },
    { id: 'energy', label: { tr: 'Enerji', en: 'Energy' }, value: '24.5', unit: 'kWh', trend: { tr: '↓ %3.2', en: '↓ 3.2%' }, trendDirection: 'down' },
    { id: 'co2', label: { tr: 'CO₂', en: 'CO₂' }, value: '12.8', unit: 'kg', trend: { tr: '↓ %4.1', en: '↓ 4.1%' }, trendDirection: 'down' }
];

const INITIAL_DEFECTS: Defect[] = [
    { name: 'pinhole', value: 0.8, label: { tr: 'Pinhole', en: 'Pinhole' } },
    { name: 'glaze', value: 1.2, label: { tr: 'Glaze Akması', en: 'Glaze Flow' } },
    { name: 'banding', value: 0.5, label: { tr: 'Banding', en: 'Banding' } },
    { name: 'black', value: 0.4, label: { tr: 'Siyah Çekirdek', en: 'Black Core' } },
    { name: 'ghosting', value: 0.2, label: { tr: 'Ghosting', en: 'Ghosting' } },
    { name: 'edge', value: 2.1, label: { tr: 'Kenar Kırığı', en: 'Edge Break' } },
    { name: 'crack', value: 0.1, label: { tr: 'Çatlak', en: 'Crack' } },
    { name: 'pattern', value: 0.3, label: { tr: 'Desen Kayması', en: 'Pattern Shift' } }
];

export const useFactoryStore = create<FactoryState>((set) => ({
    currentLang: 'tr',
    isDataFlowing: false,
    activeModal: null,
    showPassport: false,
    showHeatmap: false,
    showControlPanel: false,
    tilePosition: 0,
    partPositions: [],
    partPositionsRef: { current: [] },
    stations: INITIAL_STATIONS,
    kpis: INITIAL_KPIS,
    defects: INITIAL_DEFECTS,
    resetVersion: 0,

    // Timing
    sClockPeriod: 500,
    cFactor: 2,
    pFactor: 4, // Assuming press is slower than base Simulator clock
    sClockCount: 0,
    pClockCount: 0,
    statusMatrix: Array(5).fill(null).map(() => Array(7).fill(null)),

    setSClockPeriod: (period) => set({ sClockPeriod: period }),
    setCFactor: (factor) => set({ cFactor: factor }),
    setPFactor: (factor) => set({ pFactor: factor }),

    setLanguage: (lang) => set({ currentLang: lang }),
    toggleDataFlow: () => set((state) => ({ 
        isDataFlowing: !state.isDataFlowing,
        conveyorStatus: !state.isDataFlowing ? 'running' : 'stopped' 
    })),
    setModal: (modalId) => set({ activeModal: modalId }),
    togglePassport: () => set((state) => ({ showPassport: !state.showPassport })),
    toggleHeatmap: () => set((state) => ({ showHeatmap: !state.showHeatmap })),
    toggleControlPanel: () => set((state) => ({ showControlPanel: !state.showControlPanel })),
    
    setPartPositions: (positions) => set({ partPositions: positions }),

    updateSimulation: () => set((state) => {
        if (!state.isDataFlowing) return state;

        const nextSClockCount = state.sClockCount + 1;
        let nextPClockCount = state.pClockCount;
        let nextStatusMatrix = [...state.statusMatrix];
        let nextActiveParts = [...state.activeParts];

        // 1. Check Press Clock (P_clk)
        // If sClockCount is multiple of pFactor, a new tile is produced
        const isPressTick = nextSClockCount % state.pFactor === 0;
        if (isPressTick) {
            nextPClockCount += 1;
            const newPartId = nextPClockCount;
            
            // Add to active parts at start of conveyor (t=0)
            nextActiveParts.push({
                id: newPartId,
                t: 0,
                isDefected: Math.random() < 0.05,
                label: `Tile #${newPartId}`
            });

            // Update Status Matrix (Shift history and add new row)
            // Each row represents a "Press Event" snapshot
            const currentStationOccupancy = state.stations.map((_station, sIdx) => {
                // Find tile in this station's segment
                // Total stations = 7. Assume each station covers 1/7th of conveyor (t from 0 to 1)
                const segmentSize = 1 / 7;
                const part = nextActiveParts.find(p => 
                    p.t >= sIdx * segmentSize && p.t < (sIdx + 1) * segmentSize
                );
                return part ? `Tile #${part.id}` : null;
            });

            nextStatusMatrix = [currentStationOccupancy, ...nextStatusMatrix.slice(0, 4)];
        }

        // 2. Check Conveyor Clock (C_clk) - Movement
        // Move parts regardless of C_clk threshold if we want smooth movement,
        // but let's follow user's "every C_clk move 1000mm" logic.
        // For visual smoothness in React, we might move a tiny bit every S_clk
        // but the 'logic' step happens at C_clk multipliers.
        const isConveyorTick = nextSClockCount % state.cFactor === 0;
        if (isConveyorTick) {
            // Move across stations
            nextActiveParts = nextActiveParts.map(part => ({
                ...part,
                t: part.t + (1 / 7) // Move one station per C_clk tick for demonstration
            })).filter(part => part.t <= 1); // Remove if off conveyor
        }

        // Randomize KPIs slightly (existing logic)
        const newKpis = state.kpis.map(kpi => {
            const val = parseFloat(kpi.value);
            const variation = (Math.random() - 0.5) * 0.5;
            return { ...kpi, value: (val + variation).toFixed(1) };
        });

        return {
            sClockCount: nextSClockCount,
            pClockCount: nextPClockCount,
            statusMatrix: nextStatusMatrix,
            activeParts: nextActiveParts,
            kpis: newKpis as KPI[]
        };
    }),

    // Conveyor State
    conveyorSpeed: 1,
    conveyorStatus: 'stopped',
    activeParts: [],
    setConveyorSpeed: (speed: number) => set({ conveyorSpeed: speed }),
    setConveyorStatus: (status: 'running' | 'stopped' | 'jammed') => set({ conveyorStatus: status }),
    
    addPart: (part) => set((state) => ({ 
        activeParts: [...state.activeParts, part] 
    })),
    
    updatePart: (id, t, isDefected) => set((state) => ({
        activeParts: state.activeParts.map(p => 
            p.id === id ? { ...p, t, isDefected: isDefected ?? p.isDefected } : p
        )
    })),
    
    removePart: (id) => set((state) => ({
        activeParts: state.activeParts.filter(p => p.id !== id)
    })),

    // Telemetry
    telemetryInterval: null,
    startTelemetrySync: () => {
        const interval = setInterval(async () => {
            const state = useFactoryStore.getState();
            if (!state.isDataFlowing) return;

            const statsPayload: { machine_id: string; metric_name: string; value: number }[] = [];

            // Collect Station Stats
            state.stations.forEach(station => {
                station.stats.forEach(stat => {
                    statsPayload.push({
                        machine_id: station.id,
                        metric_name: stat.label.en, // Use English label as metric name key
                        value: parseFloat(stat.value) || 0
                    });
                });
            });

            // Collect KPIs
            state.kpis.forEach(kpi => {
                statsPayload.push({
                    machine_id: 'factory', // Use 'factory' for global KPIs
                    metric_name: kpi.id,
                    value: parseFloat(kpi.value) || 0
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

        }, 5000);

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

    resetFactory: () => set((state) => ({
        stations: INITIAL_STATIONS,
        kpis: INITIAL_KPIS,
        defects: INITIAL_DEFECTS,
        activeParts: [],
        tilePosition: 0,
        partPositions: [],
        partPositionsRef: { current: [] },
        isDataFlowing: false,
        conveyorSpeed: 1,
        conveyorStatus: 'stopped',
        resetVersion: state.resetVersion + 1,
        showPassport: false,
        showHeatmap: false,
        showControlPanel: false
    }))
}));
