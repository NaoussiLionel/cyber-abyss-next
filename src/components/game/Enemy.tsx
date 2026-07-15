'use client';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { EnemyType } from '@/types/game';

interface EnemyProps {
  type: EnemyType;
  position: [number, number, number];
  hp: number;
  maxHp: number;
  rotation?: number;
  phase?: number;
  id: number;
}

const HEALTH_BAR_WIDTH = 1.2;
const HEALTH_BAR_HEIGHT = 0.12;

export default function Enemy({
  type,
  position,
  hp,
  maxHp,
  rotation = 0,
  phase = 1,
  id,
}: EnemyProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const weakSpotRef = useRef<THREE.Mesh>(null!);
  const healthBarFillRef = useRef<THREE.Mesh>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const leftArmRef = useRef<THREE.Mesh>(null!);
  const rightArmRef = useRef<THREE.Mesh>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  const healthRatio = maxHp > 0 ? hp / maxHp : 0;
  const healthColor = useMemo(() => {
    if (healthRatio > 0.6) return new THREE.Color(0x00ff44);
    if (healthRatio > 0.3) return new THREE.Color(0xffcc00);
    return new THREE.Color(0xff2222);
  }, [healthRatio]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    groupRef.current.position.set(...position);
    groupRef.current.rotation.y = rotation;

    if (weakSpotRef.current) {
      weakSpotRef.current.rotation.y += delta * 2;
      weakSpotRef.current.rotation.x += delta * 1.5;
    }

    if (healthBarFillRef.current) {
      healthBarFillRef.current.scale.x = Math.max(healthRatio, 0);
      (healthBarFillRef.current.material as THREE.MeshBasicMaterial).color.copy(healthColor);
    }

    if (type === 'corruption') {
      if (coreRef.current) {
        coreRef.current.rotation.y += delta * 3;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(Date.now() * 0.003) * 0.4;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = Math.sin(Date.now() * 0.003 + 1) * 0.4;
      }
    }

    if (type === 'drifter') {
      if (outerRef.current) {
        outerRef.current.rotation.y += delta * 0.8;
        outerRef.current.rotation.z += delta * 0.3;
      }
      if (glowRef.current) {
        const scale = 1 + Math.sin(Date.now() * 0.004) * 0.15;
        glowRef.current.scale.setScalar(scale);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {type === 'crawler' && <CrawlerMesh />}
      {type === 'drifter' && (
        <DrifterMesh outerRef={outerRef} glowRef={glowRef} />
      )}
      {type === 'juggernaut' && <JuggernautMesh weakSpotRef={weakSpotRef} />}
      {type === 'sentinel' && <SentinelMesh />}
      {type === 'corruption' && (
        <CorruptionMesh
          coreRef={coreRef}
          leftArmRef={leftArmRef}
          rightArmRef={rightArmRef}
          phase={phase}
        />
      )}

      <group position={[0, type === 'corruption' ? 6 : 2, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT]} />
          <meshBasicMaterial color={0x222222} />
        </mesh>
        <mesh
          ref={healthBarFillRef}
          position={[-(HEALTH_BAR_WIDTH * (1 - healthRatio)) / 2, 0, 0]}
        >
          <planeGeometry args={[HEALTH_BAR_WIDTH, HEALTH_BAR_HEIGHT]} />
          <meshBasicMaterial color={healthColor} />
        </mesh>
      </group>
    </group>
  );
}

function CrawlerMesh() {
  return (
    <group>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.8, 0.5, 0.8]} />
        <meshStandardMaterial color={0xcc2222} roughness={0.6} />
      </mesh>
      <mesh position={[-0.2, 0.4, -0.35]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color={0xff4444} emissive={0xff0000} emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.2, 0.4, -0.35]}>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color={0xff4444} emissive={0xff0000} emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function DrifterMesh({
  outerRef,
  glowRef,
}: {
  outerRef: React.RefObject<THREE.Mesh | null>;
  glowRef: React.RefObject<THREE.Mesh | null>;
}) {
  return (
    <group>
      <mesh ref={outerRef} position={[0, 3, 0]}>
        <icosahedronGeometry args={[1.0, 0]} />
        <meshStandardMaterial color={0x4488ff} wireframe />
      </mesh>
      <mesh ref={glowRef} position={[0, 3, 0]}>
        <icosahedronGeometry args={[0.6, 0]} />
        <meshStandardMaterial
          color={0x44aaff}
          emissive={0x2266ff}
          emissiveIntensity={1}
          transparent
          opacity={0.5}
        />
      </mesh>
      <pointLight color={0x4488ff} intensity={0.6} distance={6} position={[0, 3, 0]} />
    </group>
  );
}

function JuggernautMesh({
  weakSpotRef,
}: {
  weakSpotRef: React.RefObject<THREE.Mesh | null>;
}) {
  return (
    <group>
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[2.5, 2.5, 2.5]} />
        <meshStandardMaterial color={0x884400} roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh ref={weakSpotRef} position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshStandardMaterial
          color={0xff8800}
          emissive={0xff4400}
          emissiveIntensity={1}
        />
      </mesh>
      <pointLight color={0xff8800} intensity={0.5} distance={4} position={[0, 3, 0]} />
    </group>
  );
}

function SentinelMesh() {
  return (
    <group>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.8, 1.2]} />
        <meshStandardMaterial color={0x555577} roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.9, -0.7]}>
        <cylinderGeometry args={[0.12, 0.12, 1.4, 8]} />
        <meshStandardMaterial color={0x888899} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.9, -1.3]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={0xff0000} emissive={0xff0000} emissiveIntensity={2} />
      </mesh>
      <pointLight color={0xff0000} intensity={0.4} distance={5} position={[0, 1, 0]} />
    </group>
  );
}

function CorruptionMesh({
  coreRef,
  leftArmRef,
  rightArmRef,
  phase,
}: {
  coreRef: React.RefObject<THREE.Mesh | null>;
  leftArmRef: React.RefObject<THREE.Mesh | null>;
  rightArmRef: React.RefObject<THREE.Mesh | null>;
  phase: number;
}) {
  return (
    <group>
      <mesh position={[0, 3, 0]} castShadow>
        <boxGeometry args={[1.8, 2.2, 1]} />
        <meshStandardMaterial color={0x220033} roughness={0.5} />
      </mesh>

      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color={0x330044} emissive={0x220033} emissiveIntensity={0.5} />
      </mesh>

      <mesh position={[-0.2, 4.6, -0.4]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color={0xff00ff} emissive={0xff00ff} emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.2, 4.6, -0.4]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color={0xff00ff} emissive={0xff00ff} emissiveIntensity={3} />
      </mesh>

      <mesh ref={leftArmRef} position={[-1.4, 2.8, 0]}>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshStandardMaterial color={0x330055} />
      </mesh>
      <mesh ref={rightArmRef} position={[1.4, 2.8, 0]}>
        <boxGeometry args={[0.5, 2, 0.5]} />
        <meshStandardMaterial color={0x330055} />
      </mesh>

      <mesh position={[-0.5, 0.75, 0]}>
        <boxGeometry args={[0.6, 1.5, 0.6]} />
        <meshStandardMaterial color={0x330055} />
      </mesh>
      <mesh position={[0.5, 0.75, 0]}>
        <boxGeometry args={[0.6, 1.5, 0.6]} />
        <meshStandardMaterial color={0x330055} />
      </mesh>

      <mesh ref={coreRef} position={[0, 3.2, 0]}>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial color={0xff00ff} emissive={0xff00ff} emissiveIntensity={2} />
      </mesh>

      {phase >= 1 &&
        [0, 1, 2].map((i) => {
          const angle = (i / 3) * Math.PI * 2;
          return (
            <mesh
              key={`node-${i}`}
              position={[Math.cos(angle) * 2.5, 2, Math.sin(angle) * 2.5]}
            >
              <octahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial
                color={0xcc00cc}
                emissive={0xaa00aa}
                emissiveIntensity={1}
              />
            </mesh>
          );
        })}

      <pointLight color={0xff00ff} intensity={0.8} distance={8} position={[0, 3, 0]} />
    </group>
  );
}
