/**
 * KPIContainer — Key Performance Indicators display panel.
 * Positioned as a bottom popup, toggled via the BottomToolbar.
 */
import { useKPIStore } from "../../store/kpiStore";
import { useUIStore } from "../../store/uiStore";
import { useTranslation } from "../../hooks/useTranslation";
import { useDraggablePanel } from "../../hooks/useDraggablePanel";
import { PANEL_MIN_WIDTHS } from "../../lib/params";

export const KPIContainer = () => {
  const kpis = useKPIStore((s) => s.kpis);
  const currentLang = useUIStore((s) => s.currentLang);
  const showKPI = useUIStore((s) => s.showKPI);
  const toggleKPI = useUIStore((s) => s.toggleKPI);
  const t = useTranslation("kpiPane");

  const { position, width, handleMouseDown } =
    useDraggablePanel("btn-kpi-panel");

  if (!showKPI) return null;

  return (
    <div
      className="fixed z-50 bg-black/95 border border-emerald-500/30 rounded-xl p-4 text-white shadow-2xl backdrop-blur-xl"
      style={{
        left: position.x,
        bottom: position.y,
        width: Math.max(width, PANEL_MIN_WIDTHS.kpiContainer),
      }}
    >
      {/* Drag Handle */}
      <div
        className="cursor-grab active:cursor-grabbing mb-3 text-center text-xs text-emerald-400/70 select-none border-b border-emerald-500/20 pb-2 flex justify-between"
        onMouseDown={handleMouseDown}
      >
        <span>⠿ {t("title")}</span>
        <button onClick={toggleKPI} className="text-white/50 hover:text-white">
          ✕
        </button>
      </div>

      {/* KPI Cards */}
      <div className="space-y-1.5">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div>
              <span className="text-[9px] text-white/60 block leading-tight">
                {kpi.label[currentLang]}
              </span>
              <span className="text-sm font-mono font-bold text-white leading-tight">
                {kpi.value}
                <span className="text-[8px] text-white/40 ml-0.5">
                  {kpi.unit}
                </span>
              </span>
            </div>
            <span
              className={`text-[10px] font-mono ${
                kpi.trendDirection === "up" ? "text-green-400" : "text-red-400"
              }`}
            >
              {kpi.trend[currentLang]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
