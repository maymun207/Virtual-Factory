import { useFactoryStore } from '../../store/factoryStore';

export const Playbook = () => {
    const { activeModal, setModal, currentLang } = useFactoryStore();

    if (activeModal !== 'playbook') return null;

    const content = {
        tr: {
            title: '🤖 ArAI Chat With Your Factory - Aksiyon Önerisi',
            question: 'Soru: "Neden FTQ düştü?"',
            rootCause: 'Fırın Zon-5\'te +18°C sapma tespit edildi (14:32). Bu durum siyah çekirdek ve pişme kusuru oranlarını artırıyor.',
            actions: [
                { title: '1. Acil Müdahale', desc: '🔧 Fırın Zon-5 gaz valfi kalibrasyonu', impact: '📊 Etki: FTQ +%2.1 beklenen iyileşme' },
                { title: '2. Hız Optimizasyonu', desc: '⚡ Konveyör hızını %3 azalt (1.8 → 1.75 m/dk)', impact: '📊 Etki: Pişme homojenliği +%1.5' },
                { title: '3. Preskriptif Bakım', desc: '🔄 Sır viskozite ayarı (45sn → 42sn)', impact: '📊 Etki: Glaze akması -%0.4' }
            ]
        },
        en: {
            title: '🤖 ArAI Chat With Your Factory - Action Suggestion',
            question: 'Question: "Why did FTQ drop?"',
            rootCause: '+18°C deviation detected in Kiln Zone-5 (14:32). This increases black core and firing defect rates.',
            actions: [
                { title: '1. Immediate Intervention', desc: '🔧 Kiln Zone-5 gas valve calibration', impact: '📊 Impact: FTQ +2.1% expected improvement' },
                { title: '2. Speed Optimization', desc: '⚡ Reduce conveyor speed by 3% (1.8 → 1.75 m/min)', impact: '📊 Impact: Firing homogeneity +1.5%' },
                { title: '3. Prescriptive Maintenance', desc: '🔄 Glaze viscosity adjustment (45s → 42s)', impact: '📊 Impact: Glaze flow -0.4%' }
            ]
        }
    };

    const t = content[currentLang];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#0f1115] border-2 border-[#00ff88]/50 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(0,255,136,0.2)] overflow-hidden relative">
                <button
                    onClick={() => setModal(null)}
                    className="absolute top-4 right-4 text-white/50 hover:text-white text-2xl transition-colors"
                >
                    &times;
                </button>

                <div className="p-6 border-b border-white/10 bg-[#00ff88]/5">
                    <h2 className="text-[#00ff88] font-bold text-lg pr-8">{t.title}</h2>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div>
                        <h3 className="text-[#00d4ff] font-semibold mb-2">{t.question}</h3>
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <p className="text-white/80 text-sm leading-relaxed">{t.rootCause}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {t.actions.map((action, i) => (
                            <div key={i} className="bg-[#00ff88]/5 border border-[#00ff88]/20 rounded-lg p-3 hover:bg-[#00ff88]/10 transition-colors cursor-pointer group">
                                <h4 className="text-[#00ff88] font-semibold text-sm mb-1 group-hover:translate-x-1 transition-transform">{action.title}</h4>
                                <p className="text-white/70 text-xs mb-2 pl-4 border-l-2 border-[#00ff88]/30">{action.desc}</p>
                                <p className="text-[#00d4ff] text-xs font-medium pl-4">{action.impact}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 border-t border-white/10 bg-white/5 flex gap-3">
                    <button
                        onClick={() => setModal(null)}
                        className="flex-1 py-3 rounded-xl bg-[#00ff88]/20 text-[#00ff88] font-bold text-sm hover:bg-[#00ff88]/30 transition-all border border-[#00ff88]/30"
                    >
                        {currentLang === 'tr' ? 'Uygula ve Kapat' : 'Apply and Close'}
                    </button>
                </div>
            </div>
        </div>
    );
};
