import { useState, useEffect } from "react";
import { useFactoryStore } from "../../store/factoryStore";
import { translations } from "../../lib/translations";
import { computeBaseVelocity } from "../../system-timer/useSystemTimer";

export const ControlPanel = () => {
  const {
    currentLang,
    isDataFlowing,
    toggleDataFlow,
    setModal,
    conveyorSpeed,
    setConveyorSpeed,
    conveyorStatus,
    setConveyorStatus,
    showControlPanel,
    toggleHeatmap,
    sClockPeriod,
    setSClockPeriod,
    stationInterval,
    setStationInterval,
    showProductionTable,
    setShowProductionTable,
  } = useFactoryStore();

  const [position, setPosition] = useState({ x: 0, y: 120 });
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const updatePosition = () => {
      const btn = document.getElementById("btn-control-actions");
      if (btn) {
        const rect = btn.getBoundingClientRect();
        setPosition({
          x: rect.left,
          y: window.innerHeight - rect.top + 20,
        });
        setWidth(rect.width);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, []);

  const t = (key: keyof typeof translations.controlPanel) =>
    translations.controlPanel[key][currentLang];

  if (!showControlPanel) return null;

  return (
    <div
      style={{ left: position.x, bottom: position.y, width }}
      className={`fixed z-50 bg-black/90 backdrop-blur-xl border-2 border-[#00ff88] rounded-2xl shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all duration-75 flex flex-col`}
    >
      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Start/Stop Button */}
        <button
          onClick={toggleDataFlow}
          className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 border ${
            isDataFlowing
              ? "bg-[#00d4ff]/20 border-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.3)]"
              : "bg-white/5 border-white/10 hover:bg-white/10"
          }`}
        >
          {isDataFlowing ? t("stop") : t("start")}
        </button>

        {/* Passport details */}
        <button className="w-full py-2.5 px-3 rounded-lg text-xs text-left text-white/80 bg-white/5 border border-white/10 hover:bg-[#00ff88]/20 hover:border-[#00ff88]/30 hover:text-white transition-all duration-300">
          {t("passport")}
        </button>

        {/* Playbook */}
        <button
          onClick={() => setModal("playbook")}
          className="w-full py-2.5 px-3 rounded-lg text-xs text-left text-white/80 bg-white/5 border border-white/10 hover:bg-[#00ff88]/20 hover:border-[#00ff88]/30 hover:text-white transition-all duration-300"
        >
          {t("playbook")}
        </button>

        {/* Critical Event */}
        <button className="w-full py-2.5 px-3 rounded-lg text-xs text-left text-white/80 bg-white/5 border border-white/10 hover:bg-[#ffaa00]/20 hover:border-[#ffaa00]/30 hover:text-white transition-all duration-300">
          {t("critical")}
        </button>

        {/* Heatmap Update */}
        <button
          onClick={toggleHeatmap}
          className="w-full py-2.5 px-3 rounded-lg text-xs text-left text-white/80 bg-white/5 border border-white/10 hover:bg-[#ff4444]/20 hover:border-[#ff4444]/30 hover:text-white transition-all duration-300"
        >
          {t("heatmap")}
        </button>

        <div className="h-px bg-white/10 my-1" />

        {/* Conveyor Speed - Multiplier */}
        <div className="space-y-1 bg-[#00ff88]/5 p-2 rounded-lg border border-[#00ff88]/20">
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-[#00ff88]">
              {t("conveyorSpeed")}: {conveyorSpeed.toFixed(1)}x
            </span>
            <span className="bg-[#00ff88] text-black px-1.5 py-0.5 rounded-[4px] text-[8px] tracking-tighter">
              SYNCED
            </span>
          </div>
          <input
            type="range"
            min="0.3"
            max="2"
            step="0.1"
            value={conveyorSpeed}
            onChange={(e) => setConveyorSpeed(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00ff88] outline-none"
          />
          <div className="text-[14px] font-bold text-white/90 py-1">
            Eff:{" "}
            {(
              computeBaseVelocity(sClockPeriod, stationInterval) * conveyorSpeed
            ).toFixed(4)}
            x
          </div>
          <div className="text-[8px] text-white/40 italic leading-none">
            Linked to s_clk ({sClockPeriod}ms) & station_interval (
            {stationInterval})
          </div>
        </div>

        <div className="h-px bg-white/10 my-1" />

        {/* Visibility Toggle */}
        <div className="flex items-center justify-between py-1">
          <span className="text-[10px] text-white/80 font-bold">
            {t("showTable")}
          </span>
          <button
            onClick={() => setShowProductionTable(!showProductionTable)}
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 focus:outline-none ${showProductionTable ? "bg-[#00ff88]" : "bg-gray-700"}`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${showProductionTable ? "translate-x-[22px]" : "translate-x-[4px]"}`}
            />
          </button>
        </div>

        <div className="h-px bg-white/10 my-1" />

        <div className="text-[9px] text-[#00ff88]/60 font-bold uppercase tracking-widest px-1">
          {t("simParams")}
        </div>

        {/* Simulation Sliders */}
        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-white/80 font-bold">
              <span>
                {t("s_clk")}: {sClockPeriod}ms
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={sClockPeriod}
              onChange={(e) => setSClockPeriod(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] text-white/80 font-bold">
              <span>
                {t("stationInterval")}: {stationInterval}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={stationInterval}
              onChange={(e) => setStationInterval(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00ff88]"
            />
          </div>
        </div>

        {/* Status Buttons */}
        <div className="grid grid-cols-3 gap-1">
          {(["running", "stopped", "jammed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setConveyorStatus(status)}
              className={`text-[9px] font-bold py-1.5 rounded border transition-all ${
                conveyorStatus === status
                  ? status === "running"
                    ? "bg-green-500/20 border-green-500 text-green-400Shadow"
                    : status === "stopped"
                      ? "bg-gray-500/20 border-gray-500 text-gray-400"
                      : "bg-red-500/20 border-red-500 text-red-400"
                  : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
              }`}
            >
              {status.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Header */}
      <div
        className={`flex justify-center items-center p-3 bg-[#00ff88]/10 border-t border-[#00ff88]/30 rounded-b-2xl`}
      >
        <span className="text-[#00ff88] font-bold text-sm whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center w-full">
          {t("title")}
        </span>
      </div>
    </div>
  );
};
