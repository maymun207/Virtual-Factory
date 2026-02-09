import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Environment, Text } from '@react-three/drei';
import { useFactoryStore } from '../../store/factoryStore';
import { ConveyorBelt } from './ConveyorBelt';


// Simple Station Component
const Station = ({ position, color, label, isActive, children, renderDefault = true }: { position: [number, number, number], color: string, label: string, isActive: boolean, children?: React.ReactNode, renderDefault?: boolean }) => {
    return (
        <group position={position}>
            {/* Base */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[2, 1, 2]} />
                <meshStandardMaterial color="#333" roughness={0.5} metalness={0.8} />
            </mesh>

            {/* Machine Body & Status Light (Default Only) */}
            {renderDefault && (
                <>
                    <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                        <boxGeometry args={[1.8, 1, 1.8]} />
                        <meshStandardMaterial
                            color={isActive ? color : '#555'}
                            emissive={isActive ? color : '#000'}
                            emissiveIntensity={isActive ? 0.5 : 0}
                            roughness={0.2}
                            metalness={0.8}
                            transparent
                            opacity={0.9}
                        />
                    </mesh>

                    <mesh position={[0, 2.5, 0]}>
                        <sphereGeometry args={[0.2, 16, 16]} />
                        <meshBasicMaterial color={isActive ? "#00ff88" : "#ff4444"} />
                    </mesh>
                </>
            )}

            {/* Station Label */}
            <Text
                position={[0, 4, 0]}
                fontSize={0.5}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="#000000"
            >
                {label}
            </Text>

            {/* Custom Model Content */}
            {children}
        </group>
    );
};



// Main Scene Component
export const Scene = () => {
    const { stations, tilePosition } = useFactoryStore((state) => state);

    // Colors for different station types
    const stationColors = [
        '#00ff88', // Press
        '#0077ff', // Drying
        '#00d4ff', // Glaze
        '#ff00ff', // Print
        '#ff4444', // Kiln
        '#aa00ff', // Sorting
        '#ffffff'  // Packaging
    ];

    return (
        <Canvas shadows className="w-full h-full bg-black">
            <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={50} />
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 2.2}
                maxDistance={30}
            />

            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />
            <pointLight position={[-10, 5, -5]} intensity={0.5} color="#00d4ff" />

            {/* Environment */}
            <Environment preset="city" />
            <fog attach="fog" args={['#050505', 10, 50]} />

            {/* Floor Grid */}
            <Grid
                position={[0, 0, 0]}
                args={[60, 60]}
                cellSize={1}
                cellThickness={0.5}
                cellColor="#202020"
                sectionSize={5}
                sectionThickness={1}
                sectionColor="#00ff88"
                fadeDistance={30}
                fadeStrength={1}
            />

            {/* Stations */}
            {stations.map((station, index) => {
                return (
                    <Station
                        key={station.id}
                        position={[(index - 3) * 4, 0, 0]}
                        color={stationColors[index]}
                        label={station.name.en}
                        isActive={tilePosition === index}
                    />
                );
            })}

            {/* Conveyor Belt System */}
            <ConveyorBelt />

        </Canvas>
    );
};
