import { useFactoryStore } from '../../store/factoryStore';
import { translations } from '../../lib/translations';

export const Header = () => {
    const { currentLang, setLanguage } = useFactoryStore();
    const t = translations.header;

    return (
        <div className="absolute top-0 left-0 right-0 z-50 p-5 bg-black/30 backdrop-blur-md border-b border-white/10 flex justify-between items-center flex-wrap gap-4">
            <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#00ff88] to-[#00d4ff] text-transparent bg-clip-text">
                    {t.title[currentLang]}
                </h1>
                <p className="text-white/70 text-sm">{t.subtitle[currentLang]}</p>
            </div>

            <div className="flex gap-1 bg-white/5 rounded-full p-0.5 border border-white/10 relative -top-[30px]">
                <button
                    onClick={() => setLanguage('tr')}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all duration-300 ${currentLang === 'tr'
                        ? 'bg-gradient-to-br from-[#00ff88]/40 to-[#00ff88]/20 text-white shadow-[0_1px_5px_rgba(0,255,136,0.2)]'
                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    TR 🇹🇷
                </button>
                <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all duration-300 ${currentLang === 'en'
                        ? 'bg-gradient-to-br from-[#00ff88]/40 to-[#00ff88]/20 text-white shadow-[0_1px_5px_rgba(0,255,136,0.2)]'
                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    EN 🇬🇧
                </button>
            </div>
        </div>
    );
};
