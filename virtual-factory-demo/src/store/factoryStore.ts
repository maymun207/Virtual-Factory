import { create } from 'zustand';

export type Language = 'tr' | 'en';

export interface StationData {
    id: string;
    name: { tr: string; en: string };
    status: 'normal' | 'warning' | 'error';
    icon: string;
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

    // Simulation State
    tilePosition: number; // 0 to 6 (7 stations)

    // Data
    stations: StationData[];
    kpis: KPI[];
    defects: Defect[];

    // Actions
    setLanguage: (lang: Language) => void;
    toggleDataFlow: () => void;
    setModal: (modalId: string | null) => void;
    updateSimulation: () => void;

    // Conveyor State
    conveyorSpeed: number;
    conveyorStatus: 'running' | 'stopped' | 'jammed';
    setConveyorSpeed: (speed: number) => void;
    setConveyorStatus: (status: 'running' | 'stopped' | 'jammed') => void;
}

const INITIAL_STATIONS: StationData[] = [
    {
        id: 'press',
        name: { tr: 'PRES', en: 'PRESS' },
        status: 'normal',
        icon: '🔨',
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
    tilePosition: 0,
    stations: INITIAL_STATIONS,
    kpis: INITIAL_KPIS,
    defects: INITIAL_DEFECTS,

    setLanguage: (lang) => set({ currentLang: lang }),
    toggleDataFlow: () => set((state) => ({ isDataFlowing: !state.isDataFlowing })),
    setModal: (modalId) => set({ activeModal: modalId }),

    updateSimulation: () => set((state) => {
        if (!state.isDataFlowing) return state;

        // Move tile
        const nextPos = (state.tilePosition + 1) % state.stations.length;

        // Randomize KPIs slightly
        const newKpis = state.kpis.map(kpi => {
            const val = parseFloat(kpi.value);
            const variation = (Math.random() - 0.5) * 0.5;
            return { ...kpi, value: (val + variation).toFixed(1) };
        });

        // Randomize defects slightly
        const newDefects = state.defects.map(d => ({
            ...d,
            value: Number(Math.max(0, parseFloat((d.value + (Math.random() - 0.5) * 0.2).toFixed(1))))
        }));

        return {
            tilePosition: nextPos,
            kpis: newKpis as KPI[],
            defects: newDefects
        };
    }),

    // Conveyor State
    conveyorSpeed: 1,
    conveyorStatus: 'running',
    setConveyorSpeed: (speed: number) => set({ conveyorSpeed: speed }),
    setConveyorStatus: (status: 'running' | 'stopped' | 'jammed') => set({ conveyorStatus: status }),
}));
