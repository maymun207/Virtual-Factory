export const translations = {
    header: {
        title: { tr: '🏭 Seramik Üretim Hattı - Dijital İkiz', en: '🏭 Ceramic Production Line - Digital Twin' },
        subtitle: { tr: 'IoT-Ignite + ArMES/MOM + ArAI Entegrasyonu', en: 'IoT-Ignite + ArMES/MOM + ArAI Integration' }
    },
    controlPanel: {
        title: { tr: '🎮 Kontrol & Aksiyonlar', en: '🎮 Control & Actions' },
        start: { tr: '🔄 Veri Akışını Başlat', en: '🔄 Start Data Flow' },
        stop: { tr: '⏸️ Veri Akışını Durdur', en: '⏸️ Stop Data Flow' },
        passport: { tr: '📔 Tile Passport Detayı', en: '📔 Tile Passport Details' },
        playbook: { tr: '🤖 ArAI Playbook Önerisi', en: '🤖 ArAI Playbook Suggestion' },
        critical: { tr: '⚠️ Kritik Olay Simülasyonu', en: '⚠️ Critical Event Simulation' },
        heatmap: { tr: '🔥 Defekt Haritası Güncelle', en: '🔥 Update Defect Heatmap' },
        conveyorSpeed: { tr: 'Konveyör Hızı', en: 'Conveyor Speed' }
    },
    tilePassport: {
        title: { tr: '📔 Tile Passport - Canlı İzleme', en: '📔 Tile Passport - Live Tracking' },
        tileId: { tr: 'Karo ID', en: 'Tile ID' },
        lot: { tr: 'Parti', en: 'Lot' },
        order: { tr: 'Sipariş', en: 'Order' },
        recipe: { tr: 'Reçete', en: 'Recipe' },
        location: { tr: '📍 Mevcut Konum', en: '📍 Current Location' },
        quality: { tr: 'Kalite: A', en: 'Quality: A' },
        tracking: { tr: 'Canlı İzleme Aktif', en: 'Live Tracking Active' }
    },
    playbook: {
        title: { tr: '🤖 ArAI Chat With Your Factory - Aksiyon Önerisi', en: '🤖 ArAI Chat With Your Factory - Action Suggestion' },
        question: { tr: 'Soru: "Neden FTQ düştü?"', en: 'Question: "Why did FTQ drop?"' },
        rootCause: {
            tr: 'Fırın Zon-5\'te +18°C sapma tespit edildi (14:32). Bu durum siyah çekirdek ve pişme kusuru oranlarını artırıyor.',
            en: '+18°C deviation detected in Kiln Zone-5 (14:32). This increases black core and firing defect rates.'
        },
        actions: [
            {
                title: { tr: '1. Acil Müdahale', en: '1. Immediate Intervention' },
                desc: { tr: '🔧 Fırın Zon-5 gaz valfi kalibrasyonu', en: '🔧 Kiln Zone-5 gas valve calibration' },
                impact: { tr: '📊 Etki: FTQ +%2.1 beklenen iyileşme', en: '📊 Impact: FTQ +2.1% expected improvement' }
            },
            {
                title: { tr: '2. Hız Optimizasyonu', en: '2. Speed Optimization' },
                desc: { tr: '⚡ Konveyör hızını %3 azalt (1.8 → 1.75 m/dk)', en: '⚡ Reduce conveyor speed by 3% (1.8 → 1.75 m/min)' },
                impact: { tr: '📊 Etki: Pişme homojenliği +%1.5', en: '📊 Impact: Firing homogeneity +1.5%' }
            },
            {
                title: { tr: '3. Preskriptif Bakım', en: '3. Prescriptive Maintenance' },
                desc: { tr: '🔄 Sır viskozite ayarı (45sn → 42sn)', en: '🔄 Glaze viscosity adjustment (45s → 42s)' },
                impact: { tr: '📊 Etki: Glaze akması -%0.4', en: '📊 Impact: Glaze flow -0.4%' }
            }
        ],
        applyAndClose: { tr: 'Uygula ve Kapat', en: 'Apply and Close' }
    },
    defects: {
        heatmapTitle: { tr: 'FTQ & Defekt Isı Haritası', en: 'FTQ & Defect Heatmap' }
    },
    kpiPane: {
        title: { tr: '📊 Anahtar Performans Göstergeleri', en: '📊 Key Performance Indicators' }
    }
};
