'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PowerUpType } from '@/types/game';

interface PowerUpProps {
  id: number;
  type: PowerUpType;
  position: [number, number, number];
  collected: boolean;
  onCollect?: (id: number, type: PowerUpType) => void;
  playerPosition?: THREE.Vector3;
}

const POWERUP_COLORS: Record<PowerUpType, number> = {
  health: 0x00ff44,
  shield: 0x4488ff,
  damage: 0xff4400,
  speed: 0xffcc00,
};

export default function PowerUp({
  id,
  type,
  position,
  collected,
  onCollect,
  playerPosition,
}: PowerUpProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const sphereRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const bobRef = useRef(Math.random() * Math.PI * 2);
  const baseYRef = useRef(position[1]);
  const collectedRef = useRef(collected);

  const color = POWERUP_COLORS[type] ?? 0xffffff;
  const colorObj = useMemo(() => new THREE.Color(color), [color]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (collected) {
      groupRef.current.visible = false;
      collectedRef.current = true;
      return;
    }

    if (collectedRef.current && !collected) {
      collectedRef.current = false;
      groupRef.current.visible = true;
    }

    groupRef.current.visible = true;

    bobRef.current += delta * 2;
    const bobY = Math.sin(bobRef.current) * 0.15;
    groupRef.current.position.set(
      position[0],
      baseYRef.current + bobY,
      position[2]
    );

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.5;
      ringRef.current.rotation.x = Math.PI / 2;
    }

    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.5;
    }

    if (playerPosition && onCollect) {
      const groupPos = groupRef.current.position;
      const dx = playerPosition.x - groupPos.x;
      const dy = playerPosition.y - groupPos.y;
      const dz = playerPosition.z - groupPos.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 2) {
        onCollect(id, type);
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={sphereRef} castShadow>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.05, 8, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
        />
      </mesh>

      <pointLight
        ref={lightRef}
        color={color}
        intensity={1.5}
        distance={8}
        position={[0, 1, 0]}
      />
    </group>
  );
}
