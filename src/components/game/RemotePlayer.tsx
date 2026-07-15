'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RemotePlayerProps {
  id: number;
  name: string;
  position: [number, number, number];
  rotation: number;
  color: string;
  alive: boolean;
}

export default function RemotePlayer({
  id,
  name,
  position,
  rotation,
  color,
  alive,
}: RemotePlayerProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const targetPos = useRef(new THREE.Vector3(...position));
  const targetRot = useRef(rotation);
  const currentColor = useMemo(() => new THREE.Color(color), [color]);

  useMemo(() => {
    targetPos.current.set(...position);
    targetRot.current = rotation;
  }, [position, rotation]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const clampedDelta = Math.min(delta, 0.05);

    groupRef.current.position.lerp(targetPos.current, 8 * clampedDelta);

    const currentY = groupRef.current.rotation.y;
    const diff = targetRot.current - currentY;
    const wrappedDiff = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
    groupRef.current.rotation.y += wrappedDiff * 8 * clampedDelta;

    groupRef.current.visible = alive;
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={currentColor}
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>

      <mesh position={[0, 0.3, -0.42]} castShadow>
        <boxGeometry args={[0.7, 0.4, 0.05]} />
        <meshStandardMaterial
          color={currentColor}
          emissive={currentColor}
          emissiveIntensity={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>

      <pointLight color={currentColor} intensity={0.3} distance={4} />

      {name && (
        <group position={[0, 1.2, 0]}>
          <sprite scale={[2, 0.3, 1]}>
            <spriteMaterial
              color={0x000000}
              transparent
              opacity={0.6}
            />
          </sprite>
        </group>
      )}
    </group>
  );
}
