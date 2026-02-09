import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useFactoryStore } from '../../store/factoryStore';

const SLAT_COUNT = 100;

interface PartProps {
    curve: THREE.CatmullRomCurve3;
    speed: number;
    status: 'running' | 'stopped' | 'jammed';
}

function Part({ curve, speed, status, progress, label, onDestroy }: PartProps & { progress: number, label: string | number, onDestroy: () => void }) {
    const meshRef = useRef<THREE.Group>(null);
    const [t, setT] = useState(progress);

    useFrame((_, delta) => {
        if (status !== 'running') return;

        // Move along curve - using same logic as previous code
        const newT = t + (delta * speed * 0.05);

        if (newT >= 0.5) { // assuming 0.5 is the end of the top run
            onDestroy();
        } else {
            setT(newT);
        }

        if (meshRef.current) {
            const point = curve.getPointAt(t);
            const tangent = curve.getTangentAt(t);
            // Adjust tangent for orientation
            meshRef.current.position.copy(point);
            meshRef.current.position.y += 0.07; // Sit on top of slats (adjusted for larger tile)
            // Look along path
            const lookAtPos = point.clone().add(tangent);
            meshRef.current.lookAt(lookAtPos);
        }
    });

    return (
        <group ref={meshRef}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[0.9, 0.0625, 0.9]} />
                <meshStandardMaterial color="#e5e7eb" roughness={0.3} metalness={0.1} />
            </mesh>
            <Text
                position={[0, 0.04, 0]} // Slightly above the surface
                rotation={[-Math.PI / 2, 0, -Math.PI / 2]} // Rotated 180 degrees from previous 
                // Actually if the box looks along the path (Z axis), and we want text to be readable...
                // Let's try standard flat orientation.
                fontSize={0.4}
                color="black"
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        </group>
    );
}

function PartSpawner({ curve, speed, status }: PartProps) {
    const [parts, setParts] = useState<{ id: number, progress: number }[]>([]);
    const lastSpawnTime = useRef(0);
    const partCounter = useRef(1); // Start counting from 1

    useFrame(({ clock }) => {
        if (status !== 'running') return;

        const time = clock.elapsedTime;
        if (time - lastSpawnTime.current > 3) {
            const newId = partCounter.current++;
            setParts(prev => [...prev, { id: newId, progress: 0 }]);
            lastSpawnTime.current = time;
        }
    });

    const removePart = (id: number) => {
        setParts(prev => prev.filter(p => p.id !== id));
    };

    return (
        <group>
            {parts.map(part => (
                <Part
                    key={part.id}
                    curve={curve}
                    speed={speed}
                    status={status}
                    progress={part.progress}
                    label={part.id}
                    onDestroy={() => removePart(part.id)}
                />
            ))}
        </group>
    );
}

export const ConveyorBelt = () => {
    const { conveyorSpeed, conveyorStatus } = useFactoryStore();
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Create a closed loop path
    // Points go from left (-15) to right (15) then loop under
    const curve = useMemo(() => {
        const points = [
            new THREE.Vector3(-16, 0.1, 0),
            new THREE.Vector3(16, 0.1, 0),
            new THREE.Vector3(16, -1, 0),
            new THREE.Vector3(-16, -1, 0)
        ];
        return new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.1); // tension 0.1 for sharper turns
    }, []);

    // Initial offsets for slats spread evenly
    const offsets = useRef(Float32Array.from({ length: SLAT_COUNT }, (_, i) => i / SLAT_COUNT));

    useFrame((_, delta) => {
        if (!meshRef.current) return;

        // Move existing slats
        if (conveyorStatus === 'running') {
            for (let i = 0; i < SLAT_COUNT; i++) {
                // Determine speed factor. 
                // Speed 1 -> nice steady pace.
                offsets.current[i] = (offsets.current[i] + (delta * conveyorSpeed * 0.05)) % 1;
            }
        }

        // Update Instance Matrices
        for (let i = 0; i < SLAT_COUNT; i++) {
            const t = offsets.current[i];
            const point = curve.getPointAt(t);
            const tangent = curve.getTangentAt(t);

            dummy.position.copy(point);
            // Orient slat along the path
            // The slat is long in Z by default (args 0.4, 0.1, 1.5). 
            // We want the long side perpendicular to the path direction.
            // Tangent is X direction mostly.
            // lookAt sets Z axis to target.
            // If we lookAt(point + tangent), Z aligns with path. 
            // Box is 1.5 deep (Z). So it aligns with path.
            // We want it perpendicular. 
            // Rotate 90 deg around Y?

            dummy.lookAt(point.clone().add(tangent));
            dummy.rotateY(Math.PI / 2);

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    // Handle color change for jammed status
    const materialColor = conveyorStatus === 'jammed' ? '#ff4444' : '#222';

    return (
        <group>
            {/* The Belt */}
            <instancedMesh ref={meshRef} args={[undefined, undefined, SLAT_COUNT]} castShadow receiveShadow>
                <boxGeometry args={[0.3, 0.05, 2]} /> {/* Width along path, Thickness, Width across path */}
                <meshStandardMaterial color={materialColor} metalness={0.6} roughness={0.4} />
            </instancedMesh>

            {/* The Box Spawner */}
            <PartSpawner curve={curve} speed={conveyorSpeed} status={conveyorStatus} />
        </group>
    );
};
