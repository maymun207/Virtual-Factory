import { Plane } from '@react-three/drei';
import { usePlane } from '@react-three/cannon';
import { Mesh } from 'three';
import { useRef } from 'react';

export const Floor = () => {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, -2, 0] }), useRef<Mesh>(null));

    return (
        <Plane ref={ref as React.RefObject<Mesh>} args={[100, 100]} receiveShadow>
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.5} />
            <gridHelper args={[100, 20, 0x444444, 0x222222]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} />
        </Plane>
    );
};
