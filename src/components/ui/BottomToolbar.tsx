import { Settings } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { useTranslation } from "../../hooks/useTranslation";

export const BottomToolbar = () => {
  const toggleControlPanel = useUIStore((s) => s.toggleControlPanel);
  const showControlPanel = useUIStore((s) => s.showControlPanel);

  const t = useTranslation("controlPanel");

  return (
    <button
      id="btn-control-actions"
      onClick={toggleControlPanel}
      className={`fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-[60] group flex items-center gap-1.5 sm:gap-3 px-3 py-2 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 shadow-lg ${
        showControlPanel
          ? "bg-[#00ff88]/20 border-[#00ff88] text-white shadow-[0_0_25px_rgba(0,255,136,0.4)]"
          : "bg-black/70 backdrop-blur-xl border-[#00ff88]/40 text-white/90 hover:bg-[#00ff88]/10 hover:border-[#00ff88]/70 hover:text-white hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]"
      }`}
    >
      <Settings
        className={`w-4 h-4 sm:w-[1.125rem] sm:h-[1.125rem] transition-transform duration-500 ${showControlPanel ? "rotate-90 text-[#00ff88]" : "text-[#00ff88]/70 group-hover:rotate-45"}`}
      />
      <span className="font-bold text-[0.625rem] sm:text-sm tracking-wide">
        {t("title")}
      </span>
    </button>
  );
};
