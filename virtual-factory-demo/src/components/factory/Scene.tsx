import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Environment } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFactoryStore } from '../../store/factoryStore';

// Simple Station Component
const Station = ({ position, color, label, isActive }: { position: [number, number, number], color: string, label: string, isActive: boolean }) => {
    return (
        <group position={position}>
            {/* Base */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[2, 1, 2]} />
                <meshStandardMaterial color="#333" roughness={0.5} metalness={0.8} />
            </mesh>

            {/* Machine Body */}
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

            {/* Status Light */}
            <mesh position={[0, 2.5, 0]}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color={isActive ? "#00ff88" : "#ff4444"} />
            </mesh>
        </group>
    );
};

// Moving Tile Component
const MovingTile = () => {
    const { tilePosition, isDataFlowing } = useFactoryStore();
    const tileRef = useRef<THREE.Group>(null);

    // Station positions (aligned with the stations in Scene)
    const stationPositions = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => [(i - 3) * 4, 1.2, 0] as [number, number, number]);
    }, []);

    useFrame((state, delta) => {
        if (!tileRef.current) return;

        const targetPos = stationPositions[tilePosition];

        // Simple lerp for smooth movement
        tileRef.current.position.x = THREE.MathUtils.lerp(tileRef.current.position.x, targetPos[0], delta * 2);
        tileRef.current.position.y = THREE.MathUtils.lerp(tileRef.current.position.y, targetPos[1], delta * 2);
        tileRef.current.position.z = THREE.MathUtils.lerp(tileRef.current.position.z, targetPos[2], delta * 2);

        // Rotate tile
        if (isDataFlowing) {
            tileRef.current.rotation.y += delta;
        }
    });

    return (
        <group ref={tileRef}>
            <mesh castShadow>
                <boxGeometry args={[0.8, 0.1, 0.8]} />
                <meshStandardMaterial color="#fff" roughness={0.4} />
            </mesh>
        </group>
    );
};

// Main Scene Component
export const Scene = () => {
    const { stations, tilePosition } = useFactoryStore();

    // Colors for different station types
    const stationColors = [
        '#00ff88', // Press
        '#ffaa00', // Drying
        '#00d4ff', // Glaze
        '#ff00ff', // Print
        '#ff4444', // Kiln
        '#aa00ff', // Sorting
        '#ffffff'  // Packaging
    ];

    return (
        <Canvas shadows className="w-full h-full bg-black">
            <PerspectiveCamera makeDefault position={[0, 8, 15]} fov={50} />
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
            {stations.map((station, index) => (
                <Station
                    key={station.id}
                    position={[(index - 3) * 4, 0, 0]}
                    color={stationColors[index]}
                    label={station.name.en}
                    isActive={tilePosition === index}
                />
            ))}

            {/* Moving Tile */}
            <MovingTile />

            {/* Connection Lines (Conveyor) */}
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[28, 1]} />
                <meshStandardMaterial color="#111" />
            </mesh>

        </Canvas>
    );
};
