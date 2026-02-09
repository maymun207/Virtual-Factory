import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFactoryStore } from '../../store/factoryStore';
import React from 'react';

export function KilnModel(props: React.JSX.IntrinsicElements['group']) {
    const { scene } = useGLTF('/kiln.glb');
    const group = useRef<THREE.Group>(null);
    const { isDataFlowing } = useFactoryStore((state) => state);

    // Clone the scene to avoid issues with multiple instances (though we only have one kiln)
    const clone = scene.clone();

    useFrame(() => {
        if (group.current && isDataFlowing) {
            // Optional: Add subtle vibration or emission pulse when active
            // group.current.rotation.y += delta * 0.05; 
        }
    });

    return (
        <group ref={group} {...props} dispose={null}>
            {/* 
          Adjust scale and position as needed based on the model's raw size.
          Models often come in different scales (meters vs. millimeters).
      */}
            <primitive
                object={clone}
                scale={[0.5, 0.5, 0.5]} // Initial guess, might need tuning
                position={[0, 0, 0]}
                rotation={[0, Math.PI, 0]} // Rotate to face conveyor if needed
            />

            {/* Add a light source inside the kiln for effect */}
            <pointLight position={[0, 2, 0]} intensity={2} color="#ffaa00" distance={5} />
        </group>
    );
}

useGLTF.preload('/kiln.glb');
