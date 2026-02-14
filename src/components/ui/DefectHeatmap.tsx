/**
 * DefectHeatmap — Defect visualization panel.
 * Uses shared hooks. No dead state variables.
 */
import { useKPIStore } from "../../store/kpiStore";
import { useUIStore } from "../../store/uiStore";
import { useTranslation } from "../../hooks/useTranslation";
import { useDraggablePanel } from "../../hooks/useDraggablePanel";
import {
  DEFECT_THRESHOLD_HIGH,
  DEFECT_THRESHOLD_MEDIUM,
  PANEL_MIN_WIDTHS,
} from "../../lib/params";

export const DefectHeatmap = () => {
  const defects = useKPIStore((s) => s.defects);
  const showHeatmap = useUIStore((s) => s.showHeatmap);
  const toggleHeatmap = useUIStore((s) => s.toggleHeatmap);
  const currentLang = useUIStore((s) => s.currentLang);

  const t = useTranslation("defects");
  const { position, width, handleMouseDown } =
    useDraggablePanel("btn-defect-heatmap");

  if (!showHeatmap) return null;

  const getDefectColor = (value: number) => {
    if (value >= DEFECT_THRESHOLD_HIGH)
      return "text-red-400 bg-red-500/10 border-red-500/30";
    if (value >= DEFECT_THRESHOLD_MEDIUM)
      return "text-orange-400 bg-orange-500/10 border-orange-500/30";
    return "text-green-400 bg-green-500/10 border-green-500/30";
  };

  return (
    <div
      className="fixed z-50 bg-black/95 border border-emerald-500/30 rounded-xl p-4 text-white shadow-2xl backdrop-blur-xl"
      style={{
        left: position.x,
        bottom: position.y,
        width: Math.max(width, PANEL_MIN_WIDTHS.defectHeatmap),
      }}
    >
      {/* Drag Handle */}
      <div
        className="cursor-grab active:cursor-grabbing mb-3 text-center text-xs text-emerald-400/70 select-none border-b border-emerald-500/20 pb-2 flex justify-between"
        onMouseDown={handleMouseDown}
      >
        <span>⠿ {t("title")}</span>
        <button
          onClick={toggleHeatmap}
          className="text-white/50 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Defect Grid */}
      <div className="grid grid-cols-2 gap-2">
        {defects.map((defect) => (
          <div
            key={defect.name}
            className={`p-2.5 rounded-lg border ${getDefectColor(defect.value)} transition-all duration-300`}
          >
            <div className="text-[10px] opacity-70 mb-1">
              {defect.label[currentLang] || defect.name}
            </div>
            <div className="text-base font-mono font-bold">
              {defect.value.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
