import { useFactoryStore } from '../../store/factoryStore';

export const KPIContainer = () => {
    const { kpis, currentLang } = useFactoryStore();

    return (
        <div className="absolute top-24 right-4 z-30 flex flex-col gap-3 w-48 md:w-56 pointer-events-auto">
            {kpis.map((kpi) => (
                <div
                    key={kpi.id}
                    className="relative group bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-3 overflow-hidden transition-all duration-300 hover:bg-white/10 hover:translate-x-[-5px] hover:shadow-[0_0_20px_rgba(0,255,136,0.2)] cursor-pointer"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/0 via-[#00ff88]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">{kpi.label[currentLang]}</span>
                        <span className={`text-[10px] flex items-center gap-1 ${kpi.trendDirection === 'up' ? 'text-[#00ff88]' : 'text-[#ff4444]'}`}>
                            {kpi.trend[currentLang]}
                        </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-bold ${kpi.status === 'warning' ? 'text-[#ffaa00]' : kpi.status === 'error' ? 'text-[#ff4444]' : 'text-[#00ff88]'}`}>
                            {kpi.value}
                        </span>
                        <span className="text-xs text-white/60">{kpi.unit}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
