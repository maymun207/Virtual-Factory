import { useState, useRef, useEffect } from "react";
import { useFactoryStore } from "../../store/factoryStore";
import { translations } from "../../lib/translations";

export const TilePassport = () => {
  const { currentLang, tilePosition, stations } = useFactoryStore();
  const [minimized, setMinimized] = useState(true);
  const [position, setPosition] = useState({ x: 200, y: 20 });
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

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const t = (key: keyof typeof translations.tilePassport) =>
    translations.tilePassport[key][currentLang];

  return (
    <div
      style={{ left: position.x, bottom: position.y }}
      className={`fixed z-40 bg-black/80 backdrop-blur-xl border-2 border-[#00ff88] rounded-2xl shadow-[0_0_20px_rgba(0,255,136,0.4)] transition-all duration-300 flex flex-col-reverse w-80`}
    >
      <div
        onMouseDown={handleMouseDown}
        className={`flex justify-between items-center cursor-move select-none transition-all ${minimized ? "px-4 py-3" : "p-4 bg-[#00ff88]/10 border-t border-[#00ff88]/30 rounded-b-2xl"}`}
      >
        <span className="text-[#00ff88] font-bold text-base whitespace-nowrap tracking-wide flex items-center gap-2">
          {t("title")}
        </span>
        <button
          onClick={() => setMinimized(!minimized)}
          className="bg-white/10 hover:bg-[#00ff88]/20 text-white/80 hover:text-[#00ff88] w-7 h-7 rounded-lg flex items-center justify-center transition-all ml-4"
        >
          {minimized ? "+" : "−"}
        </button>
      </div>

      {!minimized && (
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-white/50 uppercase tracking-wider">
                {t("tileId")}:
              </span>
              <span className="text-sm text-[#00d4ff] font-bold">#000123</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-white/50 uppercase tracking-wider">
                {t("lot")}:
              </span>
              <span className="text-sm text-[#00d4ff] font-bold">L-4589</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-white/50 uppercase tracking-wider">
                {t("order")}:
              </span>
              <span className="text-sm text-[#00d4ff] font-bold">O-7721</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] text-white/50 uppercase tracking-wider">
                {t("recipe")}:
              </span>
              <span className="text-sm text-[#00d4ff] font-bold">
                R-GLZ-A17
              </span>
            </div>
          </div>

          <div className="bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-lg p-4 mb-4">
            <div className="text-xs text-white/70 mb-2">{t("location")}</div>
            <div className="text-xl font-bold text-[#00ff88] mb-2 drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
              {stations[tilePosition].name[currentLang]}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00ff88] to-[#00d4ff] transition-all duration-500 shadow-[0_0_10px_rgba(0,255,136,0.8)]"
                  style={{ width: `${((tilePosition + 1) / 7) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-white/60">
                {tilePosition + 1}/7
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
              {t("quality")}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse shadow-[0_0_8px_#00ff88]" />
              {t("tracking")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
