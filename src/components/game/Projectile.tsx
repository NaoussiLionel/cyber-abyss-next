'use client';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProjectileProps {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
  color?: number;
  lifetime?: number;
  speed?: number;
  onExpire?: (id: number) => void;
}

export default function Projectile({
  id,
  position,
  velocity,
  color = 0xff4444,
  lifetime = 5,
  speed = 20,
  onExpire,
}: ProjectileProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);
  const timeRef = useRef(0);
  const posRef = useRef(new THREE.Vector3(...position));
  const velRef = useRef(new THREE.Vector3(...velocity).normalize().multiplyScalar(speed));

  useEffect(() => {
    posRef.current.set(...position);
    velRef.current.set(...velocity).normalize().multiplyScalar(speed);
    timeRef.current = 0;
  }, [position, velocity, speed]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const clampedDelta = Math.min(delta, 0.05);
    timeRef.current += clampedDelta;

    posRef.current.add(velRef.current.clone().multiplyScalar(clampedDelta));
    meshRef.current.position.copy(posRef.current);

    if (lightRef.current) {
      lightRef.current.position.copy(posRef.current);
    }

    if (timeRef.current >= lifetime) {
      if (onExpire) {
        onExpire(id);
      }
    }
  });

  return (
    <>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        color={color}
        intensity={0.8}
        distance={4}
        position={position}
      />
    </>
  );
}
