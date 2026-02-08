import { useState, useRef, useEffect } from 'react';
import { useFactoryStore } from '../../store/factoryStore';

export const ControlPanel = () => {
    const { isDataFlowing, toggleDataFlow, setModal, currentLang, conveyorSpeed, setConveyorSpeed, conveyorStatus, setConveyorStatus } = useFactoryStore();
    const [collapsed, setCollapsed] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 220, y: window.innerHeight - 300 });
    const isDragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging.current) {
                setPosition({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y
                });
            }
        };

        const handleMouseUp = () => {
            isDragging.current = false;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        // Initial position
        setPosition({ x: window.innerWidth - 270, y: window.innerHeight - 350 });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const translations = {
        title: { tr: '🎮 Kontrol & Aksiyonlar', en: '🎮 Control & Actions' },
        start: { tr: '🔄 Veri Akışını Başlat', en: '🔄 Start Data Flow' },
        stop: { tr: '⏸️ Veri Akışını Durdur', en: '⏸️ Stop Data Flow' },
        passport: { tr: '📔 Tile Passport Detayı', en: '📔 Tile Passport Details' },
        playbook: { tr: '🤖 ArAI Playbook Önerisi', en: '🤖 ArAI Playbook Suggestion' },
        critical: { tr: '⚠️ Kritik Olay Simülasyonu', en: '⚠️ Critical Event Simulation' },
        heatmap: { tr: '🔥 Defekt Haritası Güncelle', en: '🔥 Update Defect Heatmap' },
        cta: { tr: '📞 Sizi Arayalım', en: '📞 We Call You' }
    };

    const t = (key: keyof typeof translations) => translations[key][currentLang];

    return (
        <div
            style={{ left: position.x, top: position.y }}
            className={`fixed z-50 w-64 bg-black/90 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden transition-all duration-300 shadow-2xl ${collapsed ? 'h-auto' : ''}`}
        >
            <div
                onMouseDown={handleMouseDown}
                className="p-3 bg-white/5 border-b border-white/10 flex justify-between items-center cursor-move select-none hover:bg-white/10 transition-colors"
            >
                <div className="flex items-center gap-2 text-sm font-semibold text-white/90">
                    <span className="text-[10px] tracking-widest text-white/40">⋮⋮</span>
                    {t('title')}
                </div>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`text-white/60 hover:text-white transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
                >
                    ▼
                </button>
            </div>

            <div className={`p-4 space-y-2 transition-all duration-300 ${collapsed ? 'max-h-0 opacity-0 p-0 overflow-hidden' : 'max-h-[500px] opacity-100'}`}>
                <button
                    onClick={toggleDataFlow}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 ${isDataFlowing
                        ? 'bg-gradient-to-r from-[#00d4ff]/30 to-[#00d4ff]/20 border border-[#00d4ff]/50 shadow-[0_0_15px_rgba(0,212,255,0.3)]'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }`}
                >
                    {isDataFlowing ? t('stop') : t('start')}
                </button>

                <button
                    onClick={() => console.log('Show Tile Details')}
                    className="w-full py-2 px-3 rounded-lg text-xs text-left text-white/80 bg-white/5 border border-white/10 hover:bg-[#00ff88]/20 hover:border-[#00ff88]/30 hover:text-white transition-all duration-300 hover:translate-x-1"
                >
                    {t('passport')}
                </button>

                <button
                    onClick={() => setModal('playbook')}
                    className="w-full py-2 px-3 rounded-lg text-xs text-left text-white/80 bg-white/5 border border-white/10 hover:bg-[#00ff88]/20 hover:border-[#00ff88]/30 hover:text-white transition-all duration-300 hover:translate-x-1"
                >
                    {t('playbook')}
                </button>

                <button
                    onClick={() => console.log('Simulate Critical Event')}
                    className="w-full py-2 px-3 rounded-lg text-xs text-left text-white/80 bg-white/5 border border-white/10 hover:bg-[#ff4444]/20 hover:border-[#ff4444]/30 hover:text-white transition-all duration-300 hover:translate-x-1"
                >
                    {t('critical')}
                </button>

                <button
                    onClick={() => console.log('Update Heatmap')}
                    className="w-full py-2 px-3 rounded-lg text-xs text-left text-white/80 bg-white/5 border border-white/10 hover:bg-[#ffaa00]/20 hover:border-[#ffaa00]/30 hover:text-white transition-all duration-300 hover:translate-x-1"
                >
                    {t('heatmap')}
                </button>

                <button
                    onClick={() => console.log('Call CTA')}
                    className="w-full py-2.5 px-3 mt-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#00ff88]/80 to-[#00d4ff]/80 hover:from-[#00ff88] hover:to-[#00d4ff] shadow-lg hover:shadow-[#00ff88]/40 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                    {t('cta')}
                </button>

                <div className="h-px bg-white/10 my-2" />

                {/* Conveyor Controls */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-white/80">
                        <span>Conveyor Speed: {conveyorSpeed}x</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.1"
                        value={conveyorSpeed}
                        onChange={(e) => setConveyorSpeed(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#00ff88] [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />

                    <div className="grid grid-cols-3 gap-1">
                        {(['running', 'stopped', 'jammed'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setConveyorStatus(status)}
                                className={`text-[10px] py-1 rounded border transition-colors ${conveyorStatus === status
                                    ? status === 'running' ? 'bg-green-500/20 border-green-500 text-green-400'
                                        : status === 'stopped' ? 'bg-gray-500/20 border-gray-500 text-gray-400'
                                            : 'bg-red-500/20 border-red-500 text-red-400'
                                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                                    }`}
                            >
                                {status.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
