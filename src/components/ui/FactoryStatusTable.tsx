import { useFactoryStore } from "../../store/factoryStore";

export const FactoryStatusTable = () => {
  const { stations, statusMatrix, currentLang } = useFactoryStore();

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-40 bg-black/80 backdrop-blur-md border border-[#00ff88]/30 rounded-xl p-4 shadow-[0_0_30px_rgba(0,255,136,0.1)] overflow-hidden max-w-[90vw]">
      <div className="flex flex-col gap-2">
        <h3 className="text-[#00ff88] text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">
          Live Production Status Matrix
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-2 py-1 border border-white/10 text-[9px] text-white/40 uppercase">
                  Tick
                </th>
                {stations.map((station) => (
                  <th
                    key={station.id}
                    className="px-4 py-1 border border-white/10 text-[10px] text-white font-bold whitespace-nowrap"
                    style={{ color: station.color }}
                  >
                    {station.name[currentLang]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {statusMatrix.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  className={rIdx === 0 ? "bg-[#00ff88]/5" : "opacity-60"}
                >
                  <td className="px-2 py-1 border border-white/5 text-[9px] text-white/30 text-center font-mono">
                    P_clk -{rIdx + 1}
                  </td>
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`px-4 py-2 border border-white/5 text-[11px] text-center min-w-[100px] transition-all duration-500 ${cell ? "text-white font-bold" : "text-white/5 italic"}`}
                    >
                      {cell || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ambient background effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff88]/20 to-transparent" />
    </div>
  );
};
