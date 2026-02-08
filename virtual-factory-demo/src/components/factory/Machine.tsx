import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import { useFactoryStore } from '../../store/factoryStore';

export const Machine = () => {
    const { isDataFlowing } = useFactoryStore((state) => state);
    const isRunning = isDataFlowing;
    const rpm = 120;
    const [ref] = useBox(() => ({ mass: 1, position: [0, 2, 0] }));
    const armRef = useRef<any>(null);

    useFrame((state, delta) => {
        if (isRunning && armRef.current) {
            // Rotate arm based on RPM (RPM / 60 = Multiplier)
            armRef.current.rotation.y += (rpm / 60) * delta * 0.1;
            armRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.5;
        }
    });

    return (
        <group>
            {/* Base Machine */}
            <mesh ref={ref as any} castShadow receiveShadow>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color={isRunning ? "#10b981" : "#ef4444"} emissive={isRunning ? "#10b981" : "#000000"} emissiveIntensity={0.5} />
            </mesh>

            {/* Rotating Arm */}
            <group position={[0, 1, 0]} ref={armRef}>
                <mesh position={[0, 1, 0]} castShadow>
                    <boxGeometry args={[0.5, 2, 0.5]} />
                    <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
                </mesh>
            </group>
        </group>
    );
};
