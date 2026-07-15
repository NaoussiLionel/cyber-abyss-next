'use client';
import { useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';
import {
  NORMAL_FOV,
  AIM_FOV,
  TOPDOWN_HEIGHT,
  TOPDOWN_FOV,
  SIDESCROLL_FOV,
  TURRET_FOV,
  NORMAL_OFFSET,
  AIM_OFFSET,
} from '@/lib/constants';

export default function CameraController() {
  const { camera } = useThree();
  const perspCam = camera as THREE.PerspectiveCamera;

  const cameraMode = useGameStore((s) => s.cameraMode);
  const isAiming = useGameStore((s) => s.isAiming);
  const localPlayer = useGameStore((s) => s.localPlayer);
  const cameraRecoil = useGameStore((s) => s.cameraRecoil);
  const gameState = useGameStore((s) => s.gameState);

  const requestPointerLock = useCallback(() => {
    if (gameState === 1 || gameState === 8) {
      document.body.requestPointerLock();
    }
  }, [gameState]);

  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('click', requestPointerLock);
      return () => canvas.removeEventListener('click', requestPointerLock);
    }
  }, [requestPointerLock]);

  useEffect(() => {
    perspCam.near = 0.1;
    perspCam.far = 500;
    perspCam.updateProjectionMatrix();
  }, [perspCam]);

  useFrame(() => {
    const playerPos = localPlayer.position;
    if (!playerPos) return;

    const targetFov = isAiming ? AIM_FOV : getFovForMode(cameraMode);
    perspCam.fov = THREE.MathUtils.lerp(perspCam.fov, targetFov, 0.1);
    perspCam.updateProjectionMatrix();

    const offset = getCameraOffset(cameraMode, isAiming);
    const targetPos = new THREE.Vector3(
      playerPos.x + offset.x,
      playerPos.y + offset.y,
      playerPos.z + offset.z
    );

    perspCam.position.lerp(targetPos, 0.1);

    const lookAt = getLookAtTarget(cameraMode, playerPos);
    perspCam.lookAt(lookAt);

    if (cameraRecoil > 0) {
      perspCam.rotation.x -= cameraRecoil * 0.01;
    }
  });

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (e.button === 2) {
        const store = useGameStore.getState();
        store.setIsAiming(!store.isAiming);
      }
    }
    window.addEventListener('mousedown', handleMouseDown);
    return () => window.removeEventListener('mousedown', handleMouseDown);
  }, []);

  return null;
}

function getFovForMode(mode: string): number {
  switch (mode) {
    case 'topDown':
      return TOPDOWN_FOV;
    case 'sideScroll':
      return SIDESCROLL_FOV;
    case 'turret':
      return TURRET_FOV;
    case 'thirdPerson':
    default:
      return NORMAL_FOV;
  }
}

function getCameraOffset(
  mode: string,
  isAiming: boolean
): { x: number; y: number; z: number } {
  if (mode === 'topDown') {
    return { x: 0, y: TOPDOWN_HEIGHT, z: 5 };
  }
  if (mode === 'sideScroll') {
    return { x: -10, y: 3, z: 15 };
  }
  if (mode === 'turret') {
    return { x: 0.5, y: 1.5, z: -3 };
  }

  const base = isAiming ? AIM_OFFSET : NORMAL_OFFSET;
  return { x: base.x, y: base.y, z: base.z };
}

function getLookAtTarget(
  mode: string,
  playerPos: THREE.Vector3
): THREE.Vector3 {
  if (mode === 'sideScroll') {
    return new THREE.Vector3(playerPos.x + 5, playerPos.y + 1, 0);
  }
  return new THREE.Vector3(playerPos.x, playerPos.y, playerPos.z);
}
