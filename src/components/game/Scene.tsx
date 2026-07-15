'use client';
import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { MapConfig } from '@/types/game';

interface SceneProps {
  mapConfig?: MapConfig;
  children?: React.ReactNode;
}

const DEFAULT_MAP: MapConfig = {
  size: 100,
  floor: 0x050515,
  grid: 0x00ffff,
  fog: 0.012,
  ambient: 0.2,
  dirColor: 0x00aaff,
};

export default function Scene({ mapConfig, children }: SceneProps) {
  const config = mapConfig ?? DEFAULT_MAP;
  const { scene } = useThree();
  const floorRef = useRef<THREE.Mesh>(null);

  const floorColor = useMemo(() => new THREE.Color(config.floor), [config.floor]);
  const gridColor = useMemo(() => new THREE.Color(config.grid), [config.grid]);
  const fogNear = config.size * 0.4;
  const fogFar = config.size * 0.9;

  useMemo(() => {
    scene.background = floorColor.clone().multiplyScalar(0.8);
    scene.fog = new THREE.Fog(config.floor, fogNear, fogFar);
  }, [scene, floorColor, config.floor, fogNear, fogFar]);

  return (
    <>
      <ambientLight intensity={config.ambient} />
      <directionalLight
        color={config.dirColor}
        position={[20, 30, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-config.size / 2}
        shadow-camera-right={config.size / 2}
        shadow-camera-top={config.size / 2}
        shadow-camera-bottom={-config.size / 2}
      />
      <hemisphereLight
        color={config.dirColor}
        groundColor={0x000000}
        intensity={0.15}
      />

      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[config.size * 2, config.size * 2]} />
        <meshStandardMaterial color={config.floor} roughness={0.9} metalness={0.1} />
      </mesh>

      <gridHelper
        args={[config.size * 2, config.grid, gridColor, gridColor]}
        position={[0, 0.005, 0]}
      />

      {children}
    </>
  );
}
