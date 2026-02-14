/**
 * ControlPanel — Horizontal slide-out panel.
 * Opens right-to-left from the bottom-right button.
 * Three grouped sections arranged horizontally.
 */
import { useState, useEffect } from "react";
import { useSimulationStore } from "../../store/simulationStore";
import { useUIStore } from "../../store/uiStore";
import { useTranslation } from "../../hooks/useTranslation";
import {
  CONVEYOR_SPEED_RANGE,
  S_CLOCK_RANGE,
  STATION_INTERVAL_RANGE,
  CONTROL_PANEL_GAP,
} from "../../lib/params";

export const ControlPanel = () => {
  const conveyorSpeed = useSimulationStore((s) => s.conveyorSpeed);
  const setConveyorSpeed = useSimulationStore((s) => s.setConveyorSpeed);
  const sClockPeriod = useSimulationStore((s) => s.sClockPeriod);
  const setSClockPeriod = useSimulationStore((s) => s.setSClockPeriod);
  const stationInterval = useSimulationStore((s) => s.stationInterval);
  const setStationInterval = useSimulationStore((s) => s.setStationInterval);
  const conveyorStatus = useSimulationStore((s) => s.conveyorStatus);
  const setConveyorStatus = useSimulationStore((s) => s.setConveyorStatus);
  const showProductionTable = useUIStore((s) => s.showProductionTable);
  const setShowProductionTable = useUIStore((s) => s.setShowProductionTable);
  const showPassport = useUIStore((s) => s.showPassport);
  const togglePassport = useUIStore((s) => s.togglePassport);
  const showHeatmap = useUIStore((s) => s.showHeatmap);
  const toggleHeatmap = useUIStore((s) => s.toggleHeatmap);
  const showKPI = useUIStore((s) => s.showKPI);
  const toggleKPI = useUIStore((s) => s.toggleKPI);
  const showControlPanel = useUIStore((s) => s.showControlPanel);

  const t = useTranslation("controlPanel");

  // Position panel so its right edge aligns with the button's left edge
  const [rightOffset, setRightOffset] = useState(0);
  useEffect(() => {
    const btn = document.getElementById("btn-control-actions");
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setRightOffset(window.innerWidth - rect.left + CONTROL_PANEL_GAP);
    }
  }, [showControlPanel]);

  if (!showControlPanel) return null;

  return (
    <div
      className="fixed bottom-6 z-50 flex items-stretch gap-[1px] rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30"
      style={{
        right: rightOffset,
        animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Group 1 — Panel Toggles (2×2) */}
      <div className="bg-black/90 backdrop-blur-xl p-3 flex flex-col justify-center min-w-[200px]">
        <span className="text-[9px] text-emerald-400/60 font-semibold uppercase tracking-widest mb-2">
          {t("title")}
        </span>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          <button
            id="btn-tile-passport"
            onClick={togglePassport}
            className={`py-2 px-2 rounded-lg border transition-all duration-200 leading-tight ${
              showPassport
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                : "border-white/10 text-white/50 hover:border-emerald-500/40 hover:text-white/80"
            }`}
          >
            {t("tilePassport")}
          </button>
          <button
            onClick={() => setShowProductionTable(!showProductionTable)}
            className={`py-2 px-2 rounded-lg border transition-all duration-200 leading-tight ${
              showProductionTable
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                : "border-white/10 text-white/50 hover:border-emerald-500/40 hover:text-white/80"
            }`}
          >
            {t("productionTable")}
          </button>
          <button
            id="btn-defect-heatmap"
            onClick={toggleHeatmap}
            className={`py-2 px-2 rounded-lg border transition-all duration-200 leading-tight ${
              showHeatmap
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                : "border-white/10 text-white/50 hover:border-emerald-500/40 hover:text-white/80"
            }`}
          >
            {t("defectHeatmap")}
          </button>
          <button
            id="btn-kpi-panel"
            onClick={toggleKPI}
            className={`py-2 px-2 rounded-lg border transition-all duration-200 leading-tight ${
              showKPI
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                : "border-white/10 text-white/50 hover:border-emerald-500/40 hover:text-white/80"
            }`}
          >
            {t("kpiPanel")}
          </button>
        </div>
      </div>

      {/* Group 2 — Conveyor Status */}
      <div className="bg-black/90 backdrop-blur-xl p-3 flex flex-col justify-center min-w-[140px]">
        <span className="text-[9px] text-emerald-400/60 font-semibold uppercase tracking-widest mb-2">
          {t("conveyorStatus")}
        </span>
        <div className="flex flex-col gap-1.5 text-[10px]">
          {(["running", "stopped", "jammed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setConveyorStatus(status)}
              className={`py-1.5 px-3 rounded-lg border transition-all duration-200 ${
                conveyorStatus === status
                  ? status === "running"
                    ? "bg-green-500/20 border-green-500 text-green-400"
                    : status === "jammed"
                      ? "bg-red-500/20 border-red-500 text-red-400"
                      : "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                  : "border-white/10 text-white/50 hover:border-white/30"
              }`}
            >
              {status === "running"
                ? `▶ ${t("running")}`
                : status === "stopped"
                  ? `⏸ ${t("stopped")}`
                  : `⚠ ${t("jammed")}`}
            </button>
          ))}
        </div>
      </div>

      {/* Group 3 — Sliders */}
      <div className="bg-black/90 backdrop-blur-xl p-3 flex flex-col justify-center min-w-[220px]">
        <span className="text-[9px] text-emerald-400/60 font-semibold uppercase tracking-widest mb-2">
          ⚙️ {t("simParams")}
        </span>

        {/* Speed */}
        <div className="mb-2">
          <div className="flex justify-between text-[10px] mb-0.5">
            <span className="text-emerald-300">{t("speed")}</span>
            <span className="text-emerald-400 font-mono">
              {conveyorSpeed.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min={CONVEYOR_SPEED_RANGE.min}
            max={CONVEYOR_SPEED_RANGE.max}
            step={CONVEYOR_SPEED_RANGE.step}
            value={conveyorSpeed}
            onChange={(e) => setConveyorSpeed(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 h-1"
          />
        </div>

        {/* S_clk */}
        <div className="mb-2">
          <div className="flex justify-between text-[10px] mb-0.5">
            <span className="text-emerald-300">{t("sClockPeriod")}</span>
            <span className="text-emerald-400 font-mono">{sClockPeriod}ms</span>
          </div>
          <input
            type="range"
            min={S_CLOCK_RANGE.min}
            max={S_CLOCK_RANGE.max}
            step={S_CLOCK_RANGE.step}
            value={S_CLOCK_RANGE.min + S_CLOCK_RANGE.max - sClockPeriod}
            onChange={(e) =>
              setSClockPeriod(
                S_CLOCK_RANGE.min +
                  S_CLOCK_RANGE.max -
                  parseInt(e.target.value),
              )
            }
            className="w-full accent-emerald-500 h-1"
          />
        </div>

        {/* Station Interval */}
        <div>
          <div className="flex justify-between text-[10px] mb-0.5">
            <span className="text-emerald-300">{t("stationInterval")}</span>
            <span className="text-emerald-400 font-mono">
              {stationInterval}
            </span>
          </div>
          <input
            type="range"
            min={STATION_INTERVAL_RANGE.min}
            max={STATION_INTERVAL_RANGE.max}
            step={STATION_INTERVAL_RANGE.step}
            value={
              STATION_INTERVAL_RANGE.min +
              STATION_INTERVAL_RANGE.max -
              stationInterval
            }
            onChange={(e) =>
              setStationInterval(
                STATION_INTERVAL_RANGE.min +
                  STATION_INTERVAL_RANGE.max -
                  parseInt(e.target.value),
              )
            }
            className="w-full accent-emerald-500 h-1"
          />
        </div>
      </div>
    </div>
  );
};
