import { Header } from './Header';
import { TilePassport } from './TilePassport';
import { KPIContainer } from './KPIContainer';
import { ControlPanel } from './ControlPanel';
import { Playbook } from './Playbook';
import { DefectHeatmap } from './DefectHeatmap';

export const Dashboard = () => {
    return (
        <>
            <Header />
            <TilePassport />
            <KPIContainer />
            <ControlPanel />
            <Playbook />

            <div className="absolute bottom-4 left-4 z-20 pointer-events-auto">
                <DefectHeatmap />
            </div>
        </>
    );
};
