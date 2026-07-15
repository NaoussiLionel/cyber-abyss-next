'use client';
import { useRef, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';
import {
  REPULSE_COOLDOWN,
  DAMAGE_BUFF_DURATION,
  SPEED_BUFF_DURATION,
  ENEMY_HP,
  ENEMY_SPEED,
  ENEMY_DAMAGE,
} from '@/lib/constants';
import type { EnemyType, PowerUpType } from '@/types/game';

interface EnemyData {
  id: number;
  type: EnemyType;
  position: THREE.Vector3;
  rotation: number;
  hp: number;
  maxHp: number;
  phase: number;
  speed: number;
  damage: number;
  userData: Record<string, any>;
}

interface ProjectileData {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: number;
  lifetime: number;
  speed: number;
  damage: number;
}

interface PowerUpData {
  id: number;
  type: PowerUpType;
  position: [number, number, number];
  collected: boolean;
}

export default function GameLoop() {
  const timeRef = useRef(0);
  const lastEnemySpawnRef = useRef(0);

  const gameState = useGameStore((s) => s.gameState);
  const movementMode = useGameStore((s) => s.movementMode);

  const setPlayerHealth = useGameStore((s) => s.setPlayerHealth);
  const setHasShield = useGameStore((s) => s.setHasShield);
  const setShieldHits = useGameStore((s) => s.setShieldHits);
  const setHasDamageBuff = useGameStore((s) => s.setHasDamageBuff);
  const setDamageBuffTimer = useGameStore((s) => s.setDamageBuffTimer);
  const setHasSpeedBuff = useGameStore((s) => s.setHasSpeedBuff);
  const setSpeedBuffTimer = useGameStore((s) => s.setSpeedBuffTimer);
  const setRepulseCooldown = useGameStore((s) => s.setRepulseCooldown);
  const setWaveDelay = useGameStore((s) => s.setWaveDelay);
  const setCurrentWave = useGameStore((s) => s.setCurrentWave);
  const setLocalPlayer = useGameStore((s) => s.setLocalPlayer);

  const updateBuffTimers = useCallback(
    (delta: number) => {
      const state = useGameStore.getState();

      if (state.hasDamageBuff) {
        const newTimer = state.damageBuffTimer - delta;
        if (newTimer <= 0) {
          setHasDamageBuff(false);
          setDamageBuffTimer(0);
        } else {
          setDamageBuffTimer(newTimer);
        }
      }

      if (state.hasSpeedBuff) {
        const newTimer = state.speedBuffTimer - delta;
        if (newTimer <= 0) {
          setHasSpeedBuff(false);
          setSpeedBuffTimer(0);
        } else {
          setSpeedBuffTimer(newTimer);
        }
      }

      if (state.repulseCooldown > 0) {
        setRepulseCooldown(Math.max(0, state.repulseCooldown - delta));
      }
    },
    [
      setHasDamageBuff,
      setDamageBuffTimer,
      setHasSpeedBuff,
      setSpeedBuffTimer,
      setRepulseCooldown,
    ]
  );

  const updateWaveDelay = useCallback(
    (delta: number) => {
      const state = useGameStore.getState();
      if (state.waveDelay > 0) {
        const newDelay = state.waveDelay - delta;
        if (newDelay <= 0) {
          setWaveDelay(0);
          setCurrentWave(state.currentWave + 1);
        } else {
          setWaveDelay(newDelay);
        }
      }
    },
    [setWaveDelay, setCurrentWave]
  );

  const updatePlayerPosition = useCallback(
    (delta: number) => {
      const state = useGameStore.getState();
      const pos = state.localPlayer.position;

      if (movementMode === 'topDown') {
        const speed = state.hasSpeedBuff ? 6 * 1.5 : 6;
        const keys = getKeyState();
        const dir = new THREE.Vector3();
        if (keys.w) dir.z -= 1;
        if (keys.s) dir.z += 1;
        if (keys.a) dir.x -= 1;
        if (keys.d) dir.x += 1;
        if (dir.lengthSq() > 0) {
          dir.normalize();
          setLocalPlayer({
            position: new THREE.Vector3(
              pos.x + dir.x * speed * delta,
              pos.y,
              pos.z + dir.z * speed * delta
            ),
          });
        }
      }
    },
    [movementMode, setLocalPlayer]
  );

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.05);
    timeRef.current += clampedDelta;

    if (gameState === 1) {
      updateBuffTimers(clampedDelta);
      updateWaveDelay(clampedDelta);
      updatePlayerPosition(clampedDelta);
    }

    if (gameState === 8) {
      updateBuffTimers(clampedDelta);
      updatePlayerPosition(clampedDelta);
    }
  });

  return null;
}

function getKeyState(): { w: boolean; a: boolean; s: boolean; d: boolean } {
  if (typeof window === 'undefined') {
    return { w: false, a: false, s: false, d: false };
  }
  return {
    w: !!document.querySelector('[data-key="w"]') || false,
    a: false,
    s: false,
    d: false,
  };
}

export type { EnemyData, ProjectileData, PowerUpData };
