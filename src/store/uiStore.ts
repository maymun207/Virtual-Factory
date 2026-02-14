/**
 * UI Store — Language, modals, panels, and visibility toggles.
 */
import { create } from 'zustand';

export type Language = 'tr' | 'en';

interface UIState {
  currentLang: Language;
  activeModal: string | null;
  showPassport: boolean;
  showHeatmap: boolean;
  showControlPanel: boolean;
  showProductionTable: boolean;
  showKPI: boolean;

  setLanguage: (lang: Language) => void;
  setModal: (modalId: string | null) => void;
  togglePassport: () => void;
  toggleHeatmap: () => void;
  toggleControlPanel: () => void;
  setShowProductionTable: (show: boolean) => void;
  toggleKPI: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentLang: 'tr',
  activeModal: null,
  showPassport: false,
  showHeatmap: false,
  showControlPanel: false,
  showProductionTable: true,
  showKPI: false,

  setLanguage: (lang) => set({ currentLang: lang }),
  setModal: (modalId) => set({ activeModal: modalId }),
  togglePassport: () => set((s) => ({ showPassport: !s.showPassport })),
  toggleHeatmap: () => set((s) => ({ showHeatmap: !s.showHeatmap })),
  toggleControlPanel: () => set((s) => ({ showControlPanel: !s.showControlPanel })),
  setShowProductionTable: (show) => set({ showProductionTable: show }),
  toggleKPI: () => set((s) => ({ showKPI: !s.showKPI })),
}));
