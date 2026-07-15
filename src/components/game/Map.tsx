'use client';
import { useMemo } from 'react';
import * as THREE from 'three';
import type { MapConfig } from '@/types/game';

interface MapProps {
  mapConfig: MapConfig;
}

interface WallDef {
  position: [number, number, number];
  size: [number, number, number];
}

export default function Map({ mapConfig }: MapProps) {
  const { size, floor, grid, walls, pillars, centralPillar, corridors, rings, dark, floating, corrupted, cathedral, tiers, figure8, mirror } = mapConfig;

  const floorColor = useMemo(() => new THREE.Color(floor), [floor]);
  const gridColor = useMemo(() => new THREE.Color(grid), [grid]);

  const wallDefs = useMemo<WallDef[]>(() => {
    const defs: WallDef[] = [];
    const half = size / 2;
    const wallHeight = dark ? 6 : 4;

    if (walls) {
      defs.push(
        { position: [0, wallHeight / 2, -half], size: [size, wallHeight, 1] },
        { position: [0, wallHeight / 2, half], size: [size, wallHeight, 1] },
        { position: [-half, wallHeight / 2, 0], size: [1, wallHeight, size] },
        { position: [half, wallHeight / 2, 0], size: [1, wallHeight, size] }
      );
    }

    if (corridors) {
      const corridorWidth = size * 0.3;
      defs.push(
        { position: [0, wallHeight / 2, -corridorWidth], size: [size, wallHeight, 1] },
        { position: [0, wallHeight / 2, corridorWidth], size: [size, wallHeight, 1] }
      );
    }

    if (cathedral) {
      const innerSize = size * 0.5;
      const innerHalf = innerSize / 2;
      defs.push(
        { position: [0, wallHeight / 2, -innerHalf], size: [innerSize, wallHeight, 1.5] },
        { position: [0, wallHeight / 2, innerHalf], size: [innerSize, wallHeight, 1.5] },
        { position: [-innerHalf, wallHeight / 2, 0], size: [1.5, wallHeight, innerSize] },
        { position: [innerHalf, wallHeight / 2, 0], size: [1.5, wallHeight, innerSize] }
      );
    }

    if (figure8) {
      const armWidth = size * 0.15;
      defs.push(
        { position: [-size * 0.25, wallHeight / 2, -armWidth], size: [size * 0.4, wallHeight, 1] },
        { position: [-size * 0.25, wallHeight / 2, armWidth], size: [size * 0.4, wallHeight, 1] },
        { position: [size * 0.25, wallHeight / 2, -armWidth], size: [size * 0.4, wallHeight, 1] },
        { position: [size * 0.25, wallHeight / 2, armWidth], size: [size * 0.4, wallHeight, 1] }
      );
    }

    return defs;
  }, [size, walls, corridors, cathedral, figure8, dark]);

  const pillarPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const count = pillars ?? 0;
    if (count <= 0) return positions;

    if (mirror) {
      const radius = size * 0.35;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        positions.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
      }
    } else {
      const spacing = size / (count + 1);
      for (let i = 1; i <= count; i++) {
        const x = -size / 2 + spacing * i;
        positions.push([x, 0, 0]);
        if (count > 4) {
          positions.push([0, 0, x]);
        }
      }
    }

    return positions;
  }, [size, pillars, mirror]);

  const ringPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    const count = rings ?? 0;
    if (count <= 0) return positions;

    const radius = size * 0.25;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      positions.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius]);
    }
    return positions;
  }, [size, rings]);

  const tierPositions = useMemo(() => {
    const levels: { y: number; scale: number }[] = [];
    const count = tiers ?? 0;
    for (let i = 0; i < count; i++) {
      levels.push({
        y: (i + 1) * 3,
        scale: 1 - i * 0.15,
      });
    }
    return levels;
  }, [tiers]);

  const wallColor = dark ? 0x111122 : corrupted ? 0x220033 : 0x222233;
  const pillarColor = dark ? 0x1a1a2e : corrupted ? 0x330044 : 0x333355;
  const tierColor = corrupted ? 0x220044 : 0x1a1a33;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[size * 2, size * 2]} />
        <meshStandardMaterial color={floor} roughness={0.9} metalness={0.1} />
      </mesh>

      <gridHelper
        args={[size * 2, grid, gridColor, gridColor]}
        position={[0, 0.005, 0]}
      />

      {wallDefs.map((wall, i) => (
        <mesh
          key={`wall-${i}`}
          position={wall.position}
          castShadow
          receiveShadow
        >
          <boxGeometry args={wall.size} />
          <meshStandardMaterial
            color={wallColor}
            roughness={0.7}
            metalness={0.3}
            emissive={corrupted ? 0x110022 : dark ? 0x050510 : 0x000000}
            emissiveIntensity={corrupted ? 0.3 : dark ? 0.2 : 0}
          />
        </mesh>
      ))}

      {pillarPositions.map((pos, i) => (
        <mesh
          key={`pillar-${i}`}
          position={[pos[0], dark ? 3 : corrupted ? 2.5 : 2, pos[2]]}
          castShadow
        >
          <cylinderGeometry args={[0.5, 0.6, dark ? 6 : corrupted ? 5 : 4, 8]} />
          <meshStandardMaterial
            color={pillarColor}
            roughness={0.5}
            metalness={0.5}
            emissive={corrupted ? 0x220033 : dark ? 0x0a0a1a : 0x000000}
            emissiveIntensity={corrupted ? 0.4 : dark ? 0.3 : 0}
          />
        </mesh>
      ))}

      {centralPillar && (
        <mesh position={[0, 3, 0]} castShadow>
          <cylinderGeometry args={[0.8, 1, 6, 8]} />
          <meshStandardMaterial
            color={corrupted ? 0x440066 : 0x444477}
            roughness={0.4}
            metalness={0.6}
            emissive={corrupted ? 0x330055 : 0x111133}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {ringPositions.map((pos, i) => (
        <mesh
          key={`ring-${i}`}
          position={[pos[0], corrupted ? 1.5 : 1, pos[2]]}
          castShadow
        >
          <torusGeometry args={[1.5, 0.3, 8, 12]} />
          <meshStandardMaterial
            color={corrupted ? 0x550088 : 0x555588}
            roughness={0.4}
            metalness={0.6}
            emissive={corrupted ? 0x330066 : 0x111133}
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}

      {floating && (
        <>
          <mesh position={[size * 0.2, 5, size * 0.2]} castShadow>
            <boxGeometry args={[3, 0.5, 3]} />
            <meshStandardMaterial
              color={0x333366}
              emissive={0x222244}
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[-size * 0.2, 4, -size * 0.2]} castShadow>
            <boxGeometry args={[4, 0.5, 4]} />
            <meshStandardMaterial
              color={0x333366}
              emissive={0x222244}
              emissiveIntensity={0.3}
            />
          </mesh>
        </>
      )}

      {tierPositions.map((tier, i) => (
        <mesh
          key={`tier-${i}`}
          position={[0, tier.y, 0]}
          receiveShadow
        >
          <cylinderGeometry args={[size * 0.15 * tier.scale, size * 0.15 * tier.scale, 0.3, 12]} />
          <meshStandardMaterial
            color={tierColor}
            roughness={0.6}
            metalness={0.4}
            emissive={corrupted ? 0x220044 : 0x0a0a22}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {corrupted && (
        <>
          <pointLight color={0xff00ff} intensity={0.3} distance={size * 0.5} position={[0, 5, 0]} />
          <pointLight color={0xaa00aa} intensity={0.2} distance={size * 0.3} position={[size * 0.3, 2, size * 0.3]} />
          <pointLight color={0xaa00aa} intensity={0.2} distance={size * 0.3} position={[-size * 0.3, 2, -size * 0.3]} />
        </>
      )}

      {dark && (
        <pointLight color={0x2222ff} intensity={0.15} distance={size * 0.4} position={[0, 8, 0]} />
      )}
    </group>
  );
}
