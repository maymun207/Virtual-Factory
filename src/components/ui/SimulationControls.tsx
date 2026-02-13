import { Play, Square, RotateCcw } from "lucide-react";
import { useFactoryStore } from "../../store/factoryStore";

export const SimulationControls = () => {
  const { isDataFlowing, toggleDataFlow, resetFactory } = useFactoryStore();

  const handleStart = () => {
    if (!isDataFlowing) {
      toggleDataFlow();
    }
  };

  const handleStop = () => {
    if (isDataFlowing) {
      toggleDataFlow();
    }
  };

  const handleReset = () => {
    resetFactory();
  };

  return (
    <div className="fixed bottom-8 right-8 flex items-center gap-4 z-50">
      <div className="flex gap-2 p-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <button
          onClick={handleStart}
          disabled={isDataFlowing}
          className={`group relative p-4 rounded-xl transition-all duration-300 ${
            isDataFlowing
              ? "bg-white/5 text-white/20 cursor-not-allowed"
              : "bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/50 hover:bg-[#00ff88] hover:text-black hover:shadow-[0_0_20px_rgba(0,255,136,0.6)]"
          }`}
          title="Start"
        >
          <Play
            size={24}
            fill={!isDataFlowing ? "currentColor" : "none"}
            className={!isDataFlowing ? "ml-1" : ""}
          />
        </button>

        <button
          onClick={handleStop}
          disabled={!isDataFlowing}
          className={`group relative p-4 rounded-xl transition-all duration-300 ${
            !isDataFlowing
              ? "bg-white/5 text-white/20 cursor-not-allowed"
              : "bg-[#ff4444]/20 text-[#ff4444] border border-[#ff4444]/50 hover:bg-[#ff4444] hover:text-white hover:shadow-[0_0_20px_rgba(255,68,68,0.6)]"
          }`}
          title="Stop"
        >
          <Square size={24} fill={isDataFlowing ? "currentColor" : "none"} />
        </button>

        <div className="w-px bg-white/10 mx-1" />

        <button
          onClick={handleReset}
          className="group relative p-4 rounded-xl bg-white/5 text-white/80 border border-white/10 hover:bg-white/20 hover:text-white hover:border-white/30 transition-all duration-300"
          title="Reset"
        >
          <RotateCcw
            size={24}
            className="group-hover:-rotate-180 transition-transform duration-500"
          />
        </button>
      </div>
    </div>
  );
};
