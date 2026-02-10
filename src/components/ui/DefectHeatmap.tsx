import { useState, useRef, useEffect } from "react";
import { useFactoryStore } from "../../store/factoryStore";
import { translations } from "../../lib/translations";

export const DefectHeatmap = () => {
  const { defects, currentLang } = useFactoryStore();
  const [collapsed, setCollapsed] = useState(true);
  const [position, setPosition] = useState({ x: 960, y: 20 });
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

  const t = translations.defects;

  return (
    <div
      style={{ left: position.x, bottom: position.y }}
      className={`fixed z-30 bg-black/80 backdrop-blur-xl border-2 border-[#00ff88] rounded-2xl shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all duration-300 flex flex-col-reverse w-80`}
    >
      {/* Horizontal Header / Toggle Side */}
      <div
        onMouseDown={handleMouseDown}
        className={`flex justify-between items-center cursor-move select-none transition-all ${collapsed ? "px-4 py-3" : "p-4 bg-[#00ff88]/10 border-t border-[#00ff88]/30 rounded-b-2xl"}`}
      >
        <span className="text-[#00ff88] font-bold text-base whitespace-nowrap tracking-wide flex items-center gap-2">
          <span className="text-xl">🔥</span>
          {t.heatmapTitle[currentLang]}
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-white/10 hover:bg-[#00ff88]/20 text-white/80 hover:text-[#00ff88] w-7 h-7 rounded-lg flex items-center justify-center transition-all ml-4"
        >
          {collapsed ? "+" : "−"}
        </button>
      </div>

      {/* Content Side */}
      {!collapsed && (
        <div className="p-5">
          <div className="grid grid-cols-2 gap-3">
            {defects.map((defect) => {
              let colorClass = "text-[#00ff88]";
              if (defect.value >= 2) colorClass = "text-[#ff4444]";
              else if (defect.value >= 1) colorClass = "text-[#ffaa00]";

              return (
                <div
                  key={defect.name}
                  className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center border border-[#00ff88]/10 hover:border-[#00ff88]/30 transition-all hover:bg-[#00ff88]/5"
                >
                  <span className="text-[10px] text-white/50 mb-1 leading-tight h-6 flex items-center justify-center w-full font-bold uppercase tracking-wider">
                    {defect.label[currentLang]}
                  </span>
                  <span
                    className={`text-xl font-bold ${colorClass} drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]`}
                  >
                    {defect.value}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
