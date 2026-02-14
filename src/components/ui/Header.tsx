import { Play, Square, RotateCcw } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { useSimulationStore } from "../../store/simulationStore";
import { translations } from "../../lib/translations";

export const Header = () => {
  const currentLang = useUIStore((s) => s.currentLang);
  const setLanguage = useUIStore((s) => s.setLanguage);
  const isDataFlowing = useSimulationStore((s) => s.isDataFlowing);
  const toggleDataFlow = useSimulationStore((s) => s.toggleDataFlow);
  const resetFactory = useSimulationStore((s) => s.resetFactory);
  const t = translations.header;

  return (
    <div className="absolute top-0 left-0 right-0 z-50 px-5 py-3 bg-black/30 backdrop-blur-md border-b border-white/10 flex justify-between items-center flex-wrap gap-4">
      {/* Title */}
      <div className="flex flex-col">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-transparent bg-clip-text">
          {t.title[currentLang]}
        </h1>
        <p className="text-white/70 text-sm">{t.subtitle[currentLang]}</p>
      </div>

      {/* Start / Reset Buttons + Language Switcher */}
      <div className="flex items-center gap-3">
        {/* Start / Stop */}
        <button
          onClick={toggleDataFlow}
          className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 border ${
            isDataFlowing
              ? "bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(255,68,68,0.6)]"
              : "bg-[#00ff88]/20 text-[#00ff88] border-[#00ff88]/50 hover:bg-[#00ff88] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,136,0.6)]"
          }`}
        >
          {isDataFlowing ? (
            <>
              <Square size={14} />
              Stop
            </>
          ) : (
            <>
              <Play size={14} />
              Start
            </>
          )}
        </button>

        {/* Reset */}
        <button
          onClick={resetFactory}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 border border-white/20 text-white/60 hover:border-white/50 hover:text-white hover:bg-white/10"
        >
          <RotateCcw size={14} />
          Reset
        </button>

        {/* Language Switcher */}
        <div className="flex gap-1 bg-white/5 rounded-full p-0.5 border border-white/10 ml-2">
          <button
            onClick={() => setLanguage("tr")}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all duration-300 ${
              currentLang === "tr"
                ? "bg-gradient-to-br from-[#00ff88]/40 to-[#00ff88]/20 text-white shadow-[0_1px_5px_rgba(0,255,136,0.2)]"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            TR 🇹🇷
          </button>
          <button
            onClick={() => setLanguage("en")}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all duration-300 ${
              currentLang === "en"
                ? "bg-gradient-to-br from-[#00ff88]/40 to-[#00ff88]/20 text-white shadow-[0_1px_5px_rgba(0,255,136,0.2)]"
                : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
          >
            EN 🇬🇧
          </button>
        </div>
      </div>
    </div>
  );
};
