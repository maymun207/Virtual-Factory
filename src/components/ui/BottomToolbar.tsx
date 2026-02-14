import { Settings } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { translations } from "../../lib/translations";

export const BottomToolbar = () => {
  const currentLang = useUIStore((s) => s.currentLang);
  const toggleControlPanel = useUIStore((s) => s.toggleControlPanel);
  const showControlPanel = useUIStore((s) => s.showControlPanel);

  const t = translations;

  return (
    <button
      id="btn-control-actions"
      onClick={toggleControlPanel}
      className={`fixed bottom-6 right-6 z-[60] group flex items-center gap-3 px-6 py-3.5 rounded-2xl border-2 transition-all duration-300 shadow-lg ${
        showControlPanel
          ? "bg-[#00ff88]/20 border-[#00ff88] text-white shadow-[0_0_25px_rgba(0,255,136,0.4)]"
          : "bg-black/70 backdrop-blur-xl border-[#00ff88]/40 text-white/90 hover:bg-[#00ff88]/10 hover:border-[#00ff88]/70 hover:text-white hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]"
      }`}
    >
      <Settings
        size={18}
        className={`transition-transform duration-500 ${showControlPanel ? "rotate-90 text-[#00ff88]" : "text-[#00ff88]/70 group-hover:rotate-45"}`}
      />
      <span className="font-bold text-sm tracking-wide">
        {t.controlPanel.title[currentLang]}
      </span>
    </button>
  );
};
