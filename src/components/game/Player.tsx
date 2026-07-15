'use client';
import { useRef, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useMouse } from '@/hooks/useMouse';
import { PlayerSystem } from '@/systems/PlayerSystem';
import {
  NORMAL_FOV,
  AIM_FOV,
  PITCH_LIMIT,
  SENSITIVITY_DEFAULT,
} from '@/lib/constants';

export default function Player() {
  const groupRef = useRef<THREE.Group>(null!);
  const yawRef = useRef<THREE.Object3D>(null!);
  const pitchRef = useRef<THREE.Object3D>(null!);
  const facePlateRef = useRef<THREE.Mesh>(null!);
  const systemRef = useRef<PlayerSystem | null>(null);

  const { camera } = useThree();
  const keys = useKeyboard();
  const { mouse, requestLock, resetAccumulated } = useMouse();

  const store = useGameStore;
  const gameState = useGameStore((s) => s.gameState);
  const cameraMode = useGameStore((s) => s.cameraMode);
  const movementMode = useGameStore((s) => s.movementMode);
  const isAiming = useGameStore((s) => s.isAiming);
  const setIsAiming = useGameStore((s) => s.setIsAiming);
  const setLocalPlayer = useGameStore((s) => s.setLocalPlayer);
  const setCameraRecoil = useGameStore((s) => s.setCameraRecoil);

  const keysMapRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const group = groupRef.current;
    const yaw = yawRef.current;
    const pitch = pitchRef.current;

    group.position.set(0, 0.5, 0);
    yaw.add(pitch);
    group.add(yaw);

    const cam = camera as THREE.PerspectiveCamera;
    cam.near = 0.1;
    cam.far = 500;
    cam.fov = NORMAL_FOV;
    cam.updateProjectionMatrix();

    systemRef.current = new PlayerSystem(group, yaw, pitch, cam, store);
  }, [camera, store]);

  useEffect(() => {
    const k = keys.current;
    keysMapRef.current = {
      KeyW: k.w,
      KeyA: k.a,
      KeyS: k.s,
      KeyD: k.d,
      ShiftLeft: k.shift,
      Space: k.space,
    };
  });

  const handlePointerLock = useCallback(() => {
    if (gameState === 1 || gameState === 8) {
      requestLock(document.body);
    }
  }, [gameState, requestLock]);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.button === 2) {
        const currentAiming = store.getState().isAiming;
        setIsAiming(!currentAiming);
      }
    },
    [setIsAiming, store]
  );

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown);
    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, [handleMouseDown]);

  useFrame((_, delta) => {
    const system = systemRef.current;
    if (!system) return;
    if (gameState !== 1 && gameState !== 8) return;

    const clampedDelta = Math.min(delta, 0.05);

    if (document.pointerLockElement) {
      const sensitivity = SENSITIVITY_DEFAULT;
      const mx = mouse.current.movementX * sensitivity;
      const my = mouse.current.movementY * sensitivity;

      yawRef.current.rotation.y -= mx;

      pitchRef.current.rotation.x = THREE.MathUtils.clamp(
        pitchRef.current.rotation.x - my,
        -PITCH_LIMIT,
        PITCH_LIMIT
      );

      resetAccumulated();
    }

    const currentKeys = keysMapRef.current;
    const currentAiming = store.getState().isAiming;
    const currentCameraMode = store.getState().cameraMode;
    const currentMovementMode = store.getState().movementMode;

    system.update(clampedDelta, currentKeys, currentAiming, currentCameraMode, currentMovementMode);

    const pos = groupRef.current.position;
    const yaw = yawRef.current.rotation.y;

    setLocalPlayer({
      position: new THREE.Vector3(pos.x, pos.y, pos.z),
      rotation: yaw,
    });

    const isMoving =
      currentKeys.KeyW || currentKeys.KeyA || currentKeys.KeyS || currentKeys.KeyD;
    if (facePlateRef.current) {
      facePlateRef.current.position.y = Math.sin(Date.now() * 0.005) * (isMoving ? 0.06 : 0.02);
    }
  });

  return (
    <group ref={groupRef}>
      <object3D ref={yawRef}>
        <object3D ref={pitchRef} />
      </object3D>

      <mesh ref={facePlateRef} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={0x00e5ff}
          emissive={0x003344}
          emissiveIntensity={0.4}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      <mesh position={[0, 0.3, -0.42]} castShadow>
        <boxGeometry args={[0.7, 0.4, 0.05]} />
        <meshStandardMaterial
          color={0x00ffff}
          emissive={0x00ffff}
          emissiveIntensity={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      <pointLight color={0x00e5ff} intensity={0.4} distance={5} />
    </group>
  );
}
