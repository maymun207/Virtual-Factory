import { useState } from "react";
import { useFactoryStore } from "../../store/factoryStore";
import { translations } from "../../lib/translations";

export const KPIContainer = () => {
  const { kpis, currentLang } = useFactoryStore();
  const [collapsed, setCollapsed] = useState(true);

  const t = (key: keyof typeof translations.kpiPane) =>
    translations.kpiPane[key][currentLang];

  return (
    <div
      className={`fixed top-24 right-4 z-30 bg-black/80 backdrop-blur-xl border-2 border-[#00ff88] rounded-2xl shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all duration-300 flex flex-row-reverse overflow-hidden ${collapsed ? "w-12" : "w-80"}`}
    >
      {/* Vertical Header / Toggle Side */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        className={`w-12 flex flex-col items-center justify-between py-4 cursor-pointer hover:bg-[#00ff88]/5 transition-colors ${collapsed ? "" : "border-l border-[#00ff88]/30 bg-[#00ff88]/10"}`}
      >
        <div className="flex flex-col items-center gap-8">
          <span className="text-white/80 font-bold text-lg">
            {collapsed ? "+" : "−"}
          </span>
          <span
            className="text-[#00ff88] font-bold text-xs whitespace-nowrap tracking-[0.2em] uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {t("title").split(" ").slice(1).join(" ")}
          </span>
        </div>
        <span className="text-xl">📊</span>
      </div>

      {/* Content Side */}
      {!collapsed && (
        <div className="flex-1 p-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div className="flex flex-col gap-3">
            {kpis.map((kpi) => (
              <div
                key={kpi.id}
                className="relative group bg-white/5 border border-[#00ff88]/20 rounded-xl p-4 transition-all duration-300 hover:bg-[#00ff88]/10 hover:translate-x-[-4px] cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/0 via-[#00ff88]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] text-white/50 uppercase tracking-wider font-bold">
                    {kpi.label[currentLang]}
                  </span>
                  <span
                    className={`text-[11px] font-bold flex items-center gap-1 ${kpi.trendDirection === "up" ? "text-[#00ff88]" : "text-[#ff4444]"}`}
                  >
                    {kpi.trend[currentLang]}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-bold drop-shadow-[0_0_10px_rgba(0,255,136,0.3)] ${kpi.status === "warning" ? "text-[#ffaa00]" : kpi.status === "error" ? "text-[#ff4444]" : "text-[#00ff88]"}`}
                  >
                    {kpi.value}
                  </span>
                  <span className="text-sm text-white/40 font-medium">
                    {kpi.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
