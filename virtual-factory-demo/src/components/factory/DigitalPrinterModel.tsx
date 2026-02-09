import { useTexture } from '@react-three/drei';
import React from 'react';

export function DigitalPrinterModel(props: React.JSX.IntrinsicElements['group']) {
    const texture = useTexture('/digitalPrinter.png');

    return (
        <group {...props} dispose={null}>
            {/* 
                Digital Printer represented as a large industrial machine.
                We use a Box geometry and map the printer texture to it.
            */}
            <mesh castShadow receiveShadow position={[0, 1, 0]}>
                <boxGeometry args={[3, 2, 3]} />
                <meshStandardMaterial
                    map={texture}
                    roughness={0.3}
                    metalness={0.8}
                    color="white"
                />
            </mesh>

            {/* Add a status light or detail to make it pop */}
            <pointLight position={[0, 2, 1.5]} intensity={1} color="#00d4ff" distance={3} />
        </group>
    );
}

useTexture.preload('/digitalPrinter.png');
