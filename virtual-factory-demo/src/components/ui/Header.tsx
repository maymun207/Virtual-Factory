import { useFactoryStore } from '../../store/factoryStore';

export const Header = () => {
    const { currentLang, setLanguage } = useFactoryStore();

    return (
        <div className="absolute top-0 left-0 right-0 z-50 p-5 bg-black/30 backdrop-blur-md border-b border-white/10 flex justify-between items-center flex-wrap gap-4">
            <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-transparent bg-clip-text">
                    {currentLang === 'tr' ? '🏭 Seramik Üretim Hattı - Dijital İkiz' : '🏭 Ceramic Production Line - Digital Twin'}
                </h1>
                <p className="text-white/70 text-sm">IoT-Ignite + ArMES/MOM + ArAI {currentLang === 'tr' ? 'Entegrasyonu' : 'Integration'}</p>
            </div>

            <div className="flex gap-2 bg-white/10 rounded-full p-1 border border-white/20">
                <button
                    onClick={() => setLanguage('tr')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentLang === 'tr'
                            ? 'bg-gradient-to-br from-[#00ff88]/30 to-[#00ff88]/20 text-white shadow-[0_2px_10px_rgba(0,255,136,0.3)]'
                            : 'text-white/70 hover:bg-white/10'
                        }`}
                >
                    TR 🇹🇷
                </button>
                <button
                    onClick={() => setLanguage('en')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentLang === 'en'
                            ? 'bg-gradient-to-br from-[#00ff88]/30 to-[#00ff88]/20 text-white shadow-[0_2px_10px_rgba(0,255,136,0.3)]'
                            : 'text-white/70 hover:bg-white/10'
                        }`}
                >
                    EN 🇬🇧
                </button>
            </div>
        </div>
    );
};
