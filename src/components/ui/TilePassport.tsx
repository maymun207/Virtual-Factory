import { useState, useRef, useEffect } from "react";
import { useFactoryStore } from "../../store/factoryStore";
import { translations } from "../../lib/translations";

export const TilePassport = () => {
  const { currentLang, tilePosition, stations, showPassport, togglePassport } =
    useFactoryStore();
  const [minimized, setMinimized] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 100 });
  const [width, setWidth] = useState(320);
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      const btn = document.getElementById("btn-tile-passport");
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

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const t = (key: keyof typeof translations.tilePassport) =>
    translations.tilePassport[key][currentLang];

  if (!showPassport) return null;

  return (
    <div
      style={{ left: position.x, bottom: position.y, width }}
      className={`fixed z-40 bg-black/80 backdrop-blur-xl border-2 border-[#00ff88] rounded-2xl shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all duration-300 flex flex-col-reverse`}
    >
      <div
        onMouseDown={handleMouseDown}
        className={`flex justify-between items-center cursor-move select-none transition-all ${minimized ? "px-3 py-2" : "p-3 bg-[#00ff88]/10 border-t border-[#00ff88]/30 rounded-b-2xl"}`}
      >
        <span className="text-[#00ff88] font-bold text-sm leading-tight text-center w-full break-words whitespace-normal px-1">
          {t("title")} {showPassport && "- Live Tracking"}
        </span>
        <button
          onClick={togglePassport}
          className="bg-white/10 hover:bg-[#ff4444]/20 text-white/80 hover:text-[#ff4444] w-6 h-6 rounded-md flex items-center justify-center transition-all ml-2 flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {!minimized && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-white/50 uppercase tracking-wider">
                {t("tileId")}:
              </span>
              <span className="text-xs text-[#00d4ff] font-bold">#000123</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-white/50 uppercase tracking-wider">
                {t("lot")}:
              </span>
              <span className="text-xs text-[#00d4ff] font-bold">L-4589</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-white/50 uppercase tracking-wider">
                {t("order")}:
              </span>
              <span className="text-xs text-[#00d4ff] font-bold">O-7721</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-white/50 uppercase tracking-wider">
                {t("recipe")}:
              </span>
              <span className="text-xs text-[#00d4ff] font-bold">
                R-GLZ-A17
              </span>
            </div>
          </div>

          <div className="bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-lg p-3 mb-3">
            <div className="text-[10px] text-white/70 mb-1">
              {t("location")}
            </div>
            <div className="text-lg font-bold text-[#00ff88] mb-1 drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
              {stations[tilePosition].name[currentLang]}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] transition-all duration-500 shadow-[0_0_10px_rgba(0,255,136,0.8)]"
                  style={{ width: `${((tilePosition + 1) / 7) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-white/60">
                {tilePosition + 1}/7
              </span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-[10px] text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]" />
              {t("quality")}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_#00ff88]" />
              {t("tracking")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
