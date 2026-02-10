import { useState, useRef, useEffect } from "react";
import { useFactoryStore } from "../../store/factoryStore";
import { translations } from "../../lib/translations";

export const ControlPanel = () => {
  const {
    isDataFlowing,
    toggleDataFlow,
    setModal,
    currentLang,
    conveyorSpeed,
    setConveyorSpeed,
    conveyorStatus,
    setConveyorStatus,
  } = useFactoryStore();
  const [collapsed, setCollapsed] = useState(true);
  const [position, setPosition] = useState({ x: 580, y: 20 });
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: window.innerHeight - e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: window.innerHeight - e.clientY - dragOffset.current.y,
        });
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const t = (key: keyof typeof translations.controlPanel) =>
    translations.controlPanel[key][currentLang];

  return (
    <div
      style={{ left: position.x, bottom: position.y }}
      className={`fixed z-50 bg-black/80 backdrop-blur-xl border-2 border-[#00ff88] rounded-2xl shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all duration-300 flex flex-col-reverse w-80`}
    >
      <div
        onMouseDown={handleMouseDown}
        className={`flex justify-between items-center cursor-move select-none transition-all ${collapsed ? "px-4 py-3" : "p-4 bg-[#00ff88]/10 border-t border-[#00ff88]/30 rounded-b-2xl"}`}
      >
        <span className="text-[#00ff88] font-bold text-base whitespace-nowrap tracking-wide flex items-center gap-2">
          {t("title")}
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-white/10 hover:bg-[#00ff88]/20 text-white/80 hover:text-[#00ff88] w-7 h-7 rounded-lg flex items-center justify-center transition-all ml-4"
        >
          {collapsed ? "+" : "−"}
        </button>
      </div>

      {!collapsed && (
        <div className="p-5 space-y-2">
          <button
            onClick={toggleDataFlow}
            className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
              isDataFlowing
                ? "bg-gradient-to-r from-[#00d4ff]/30 to-[#00d4ff]/20 border border-[#00d4ff]/50 shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                : "bg-white/5 border border-white/10 hover:bg-white/10"
            }`}
          >
            {isDataFlowing ? t("stop") : t("start")}
          </button>

          <button
            onClick={() => {}}
            className="w-full py-2 px-3 rounded-lg text-xs text-left text-white/80 bg-white/5 border border-white/10 hover:bg-[#00ff88]/20 hover:border-[#00ff88]/30 hover:text-white transition-all duration-300 hover:translate-x-1"
          >
            {t("passport")}
          </button>

          <button
            onClick={() => setModal("playbook")}
            className="w-full py-2 px-3 rounded-lg text-xs text-left text-white/80 bg-white/5 border border-white/10 hover:bg-[#00ff88]/20 hover:border-[#00ff88]/30 hover:text-white transition-all duration-300 hover:translate-x-1"
          >
            {t("playbook")}
          </button>

          <button
            onClick={() => {}}
            className="w-full py-2 px-3 rounded-lg text-xs text-left text-white/80 bg-white/5 border border-white/10 hover:bg-[#ff4444]/20 hover:border-[#ff4444]/30 hover:text-white transition-all duration-300 hover:translate-x-1"
          >
            {t("critical")}
          </button>

          <button
            onClick={() => {}}
            className="w-full py-2 px-3 rounded-lg text-xs text-left text-white/80 bg-white/5 border border-white/10 hover:bg-[#ffaa00]/20 hover:border-[#ffaa00]/30 hover:text-white transition-all duration-300 hover:translate-x-1"
          >
            {t("heatmap")}
          </button>

          <button
            onClick={() => {}}
            className="w-full py-2.5 px-3 mt-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#00ff88]/80 to-[#00d4ff]/80 hover:from-[#00ff88] hover:to-[#00d4ff] shadow-lg hover:shadow-[#00ff88]/40 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {t("cta")}
          </button>

          <div className="h-px bg-white/10 my-2" />

          {/* Conveyor Controls */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-white/80">
              <span>
                {t("conveyorSpeed")}: {conveyorSpeed}x
              </span>
            </div>
            <div className="py-3 px-1">
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={conveyorSpeed}
                onChange={(e) => setConveyorSpeed(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#00ff88] [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-1">
              {(["running", "stopped", "jammed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setConveyorStatus(status)}
                  className={`text-[10px] py-1 rounded border transition-colors ${
                    conveyorStatus === status
                      ? status === "running"
                        ? "bg-green-500/20 border-green-500 text-green-400"
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
        </div>
      )}
    </div>
  );
};
