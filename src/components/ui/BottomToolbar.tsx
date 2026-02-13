import { Plus } from "lucide-react";
import { useFactoryStore } from "../../store/factoryStore";
import { translations } from "../../lib/translations";

export const BottomToolbar = () => {
  const {
    currentLang,
    togglePassport,
    toggleHeatmap,
    toggleControlPanel,
    showPassport,
    showHeatmap,
    showControlPanel,
  } = useFactoryStore();

  const t = translations;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex gap-6 items-end">
      {/* Tile Passport Button */}
      <button
        id="btn-tile-passport"
        onClick={togglePassport}
        className={`group relative flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${
          showPassport
            ? "bg-[#00ff88]/20 border-[#00ff88] text-white shadow-[0_0_20px_rgba(0,255,136,0.3)]"
            : "bg-black/60 backdrop-blur-xl border-[#00ff88]/30 text-white/80 hover:bg-[#00ff88]/10 hover:border-[#00ff88]/60 hover:text-white"
        }`}
      >
        <span className="font-bold text-sm tracking-wide">
          {t.tilePassport.title[currentLang]}
        </span>
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
            showPassport
              ? "bg-[#00ff88] text-black"
              : "bg-white/10 text-white group-hover:bg-[#00ff88]/20"
          }`}
        >
          <Plus
            size={14}
            className={`transition-transform duration-300 ${showPassport ? "rotate-45" : ""}`}
          />
        </div>
      </button>

      {/* Control & Actions Button */}
      <button
        id="btn-control-actions"
        onClick={toggleControlPanel}
        className={`group relative flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${
          showControlPanel
            ? "bg-[#00ff88]/20 border-[#00ff88] text-white shadow-[0_0_20px_rgba(0,255,136,0.3)]"
            : "bg-black/60 backdrop-blur-xl border-[#00ff88]/30 text-white/80 hover:bg-[#00ff88]/10 hover:border-[#00ff88]/60 hover:text-white"
        }`}
      >
        <span className="font-bold text-sm tracking-wide">
          {t.controlPanel.title[currentLang]}
        </span>
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
            showControlPanel
              ? "bg-[#00ff88] text-black"
              : "bg-white/10 text-white group-hover:bg-[#00ff88]/20"
          }`}
        >
          <Plus
            size={14}
            className={`transition-transform duration-300 ${showControlPanel ? "rotate-45" : ""}`}
          />
        </div>
      </button>

      {/* Heatmap Button */}
      <button
        id="btn-defect-heatmap"
        onClick={toggleHeatmap}
        className={`group relative flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${
          showHeatmap
            ? "bg-[#00ff88]/20 border-[#00ff88] text-white shadow-[0_0_20px_rgba(0,255,136,0.3)]"
            : "bg-black/60 backdrop-blur-xl border-[#00ff88]/30 text-white/80 hover:bg-[#00ff88]/10 hover:border-[#00ff88]/60 hover:text-white"
        }`}
      >
        <span className="font-bold text-sm tracking-wide">
          {t.defects.heatmapTitle[currentLang]}
        </span>
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
            showHeatmap
              ? "bg-[#00ff88] text-black"
              : "bg-white/10 text-white group-hover:bg-[#00ff88]/20"
          }`}
        >
          <Plus
            size={14}
            className={`transition-transform duration-300 ${showHeatmap ? "rotate-45" : ""}`}
          />
        </div>
      </button>
    </div>
  );
};
