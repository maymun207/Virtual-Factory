import { useFactoryStore } from '../../store/factoryStore';
import { translations } from '../../lib/translations';

export const DefectHeatmap = () => {
    const { defects, currentLang } = useFactoryStore();
    const t = translations.defects;

    return (
        <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-4 w-full max-w-sm pointer-events-auto">
            <h3 className="text-sm font-bold text-white/90 mb-3 flex items-center gap-2">
                <span className="text-lg">🔥</span>
                {t.heatmapTitle[currentLang]}
            </h3>

            <div className="grid grid-cols-4 gap-2">
                {defects.map((defect) => {
                    let colorClass = 'text-[#00ff88]';
                    if (defect.value >= 2) colorClass = 'text-[#ff4444]';
                    else if (defect.value >= 1) colorClass = 'text-[#ffaa00]';

                    return (
                        <div key={defect.name} className="bg-white/5 rounded-lg p-2 flex flex-col items-center justify-center text-center border border-white/5 hover:border-white/20 transition-all">
                            <span className="text-[9px] text-white/50 mb-1 leading-tight h-6 flex items-center justify-center w-full overflow-hidden text-ellipsis">
                                {defect.label[currentLang]}
                            </span>
                            <span className={`text-sm font-bold ${colorClass}`}>
                                {defect.value}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
