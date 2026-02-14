/**
 * SimulationControls — Play/Stop/Reset buttons.
 */
import { Play, Square, RotateCcw } from "lucide-react";
import { useSimulationStore } from "../../store/simulationStore";
import { COLORS } from "../../lib/params";

export const SimulationControls = () => {
  const isDataFlowing = useSimulationStore((s) => s.isDataFlowing);
  const toggleDataFlow = useSimulationStore((s) => s.toggleDataFlow);
  const resetFactory = useSimulationStore((s) => s.resetFactory);

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3">
      {/* Play / Stop */}
      <button
        onClick={toggleDataFlow}
        className={`group relative flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 border ${
          isDataFlowing
            ? `bg-[${COLORS.error}]/20 text-[${COLORS.error}] border border-[${COLORS.error}]/50 hover:bg-[${COLORS.error}] hover:text-white hover:shadow-[0_0_20px_rgba(255,68,68,0.6)]`
            : `bg-[${COLORS.primary}]/20 text-[${COLORS.primary}] border border-[${COLORS.primary}]/50 hover:bg-[${COLORS.primary}] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,136,0.6)]`
        }`}
      >
        {isDataFlowing ? (
          <>
            <Square size={16} />
            Stop
          </>
        ) : (
          <>
            <Play size={16} />
            Start
          </>
        )}
      </button>

      {/* Reset */}
      <button
        onClick={resetFactory}
        className="flex items-center gap-2 px-4 py-3 rounded-full font-medium text-sm transition-all duration-300 border border-white/20 text-white/60 hover:border-white/50 hover:text-white hover:bg-white/10"
      >
        <RotateCcw size={16} />
        Reset
      </button>
    </div>
  );
};
