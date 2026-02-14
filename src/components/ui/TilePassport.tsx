/**
 * TilePassport — Shows detail view for a specific tile.
 * Uses top/left positioning via panelIndex=0.
 */
import { useSimulationStore } from "../../store/simulationStore";
import { useUIStore } from "../../store/uiStore";
import { useTranslation } from "../../hooks/useTranslation";
import { useDraggablePanel } from "../../hooks/useDraggablePanel";
import { STATION_COUNT, TILE_PASSPORT_DEFAULTS } from "../../lib/params";

export const TilePassport = () => {
  const pClockCount = useSimulationStore((s) => s.pClockCount);
  const stations = useSimulationStore((s) => s.stations);
  const showPassport = useUIStore((s) => s.showPassport);
  const togglePassport = useUIStore((s) => s.togglePassport);
  const currentLang = useUIStore((s) => s.currentLang);

  const t = useTranslation("tilePassport");
  const { position, width, handleMouseDown } = useDraggablePanel(0);

  if (!showPassport) return null;

  const currentStationIdx =
    pClockCount > 0 ? Math.min(pClockCount - 1, STATION_COUNT - 1) : 0;
  const currentStation = stations[currentStationIdx];

  return (
    <div
      className="fixed z-50 bg-black/95 border border-emerald-500/30 rounded-xl p-3 sm:p-4 text-white shadow-2xl backdrop-blur-xl"
      style={{
        top: position.top,
        left: position.left,
        width,
        maxWidth: "90vw",
        maxHeight: "calc(100vh - 170px)",
        overflowY: "auto",
      }}
    >
      {/* Drag Handle */}
      <div
        className="cursor-grab active:cursor-grabbing mb-3 text-center text-xs text-emerald-400/70 select-none border-b border-emerald-500/20 pb-2 flex justify-between"
        onMouseDown={handleMouseDown}
      >
        <span>⠿ {t("title")}</span>
        <button
          onClick={togglePassport}
          className="text-white/50 hover:text-white"
        >
          ✕
        </button>
      </div>

      {pClockCount === 0 ? (
        <div className="text-center text-xs text-white/40 py-4">
          ⏳{" "}
          {currentLang === "tr"
            ? "Simülasyonu başlatın..."
            : "Start simulation..."}
        </div>
      ) : (
        <>
          {/* Tile Info Grid */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-emerald-300">{t("tileId")}</span>
              <span className="font-mono text-emerald-400">#{pClockCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-300">{t("lot")}</span>
              <span className="font-mono">{TILE_PASSPORT_DEFAULTS.lot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-300">{t("order")}</span>
              <span className="font-mono">{TILE_PASSPORT_DEFAULTS.order}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-300">{t("recipe")}</span>
              <span className="font-mono">{TILE_PASSPORT_DEFAULTS.recipe}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-300">{t("location")}</span>
              <span className="font-mono text-emerald-400">
                {currentStation?.name[currentLang]} ({currentStationIdx + 1}/
                {STATION_COUNT})
              </span>
            </div>
          </div>

          {/* Quality & Tracking */}
          <div className="border-t border-emerald-500/20 mt-3 pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-emerald-300">{t("qualityScore")}</span>
              <span className="text-green-400">
                {TILE_PASSPORT_DEFAULTS.qualityScore}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-300">{t("tracking")}</span>
              <span className="text-emerald-400">{t("realtime")}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
