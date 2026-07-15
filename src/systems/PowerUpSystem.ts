import * as THREE from 'three';
import {
  POWERUP_RESPAWN,
  SHIELD_MAX_HITS,
  DAMAGE_BUFF_DURATION,
  SPEED_BUFF_DURATION,
} from '@/lib/constants';
import type { PowerUpType } from '@/types/game';

export interface PowerUpEntity {
  type: PowerUpType;
  mesh: THREE.Group;
  light: THREE.PointLight;
  collected: boolean;
  respawnTimer: number;
  bobOffset: number;
  respawnDuration: number;
}

interface GameStore {
  getState: () => {
    health: number;
    maxHealth: number;
    hasShield: boolean;
    shieldHits: number;
    hasDamageBuff: boolean;
    damageBuffTimer: number;
    hasSpeedBuff: boolean;
    speedBuffTimer: number;
  };
  setState: (partial: Record<string, any>) => void;
}

const POWERUP_COLORS: Record<PowerUpType, number> = {
  health: 0x00ff44,
  shield: 0x4488ff,
  damage: 0xff4400,
  speed: 0xffcc00,
};

export function createPowerUp(type: PowerUpType, position: THREE.Vector3): PowerUpEntity {
  const color = POWERUP_COLORS[type];

  const group = new THREE.Group();
  group.position.copy(position);

  const sphereGeo = new THREE.SphereGeometry(0.5, 12, 12);
  const sphereMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.9,
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.castShadow = true;
  group.add(sphere);

  const ringGeo = new THREE.TorusGeometry(0.65, 0.05, 8, 24);
  const ringMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 1,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const light = new THREE.PointLight(color, 1.5, 8);
  light.position.set(0, 1, 0);
  group.add(light);

  const respawnDuration = POWERUP_RESPAWN[type] ?? 15;

  return {
    type,
    mesh: group,
    light,
    collected: false,
    respawnTimer: 0,
    bobOffset: Math.random() * Math.PI * 2,
    respawnDuration,
  };
}

export class PowerUpSystem {
  update(
    entity: PowerUpEntity,
    delta: number,
    playerPosition: THREE.Vector3,
    isPvP: boolean,
    store: GameStore
  ): void {
    if (entity.collected) {
      if (isPvP) {
        this.respawn(entity, delta);
      }
      return;
    }

    entity.bobOffset += delta * 2;
    const baseY = entity.mesh.position.y;
    entity.mesh.position.y += Math.sin(entity.bobOffset) * delta * 0.8;

    const ring = entity.mesh.children[1] as THREE.Mesh | undefined;
    if (ring) {
      ring.rotation.z += delta * 1.5;
    }

    const dist = entity.mesh.position.distanceTo(playerPosition);
    if (dist < 2) {
      this.collect(entity, store);
    }
  }

  collect(entity: PowerUpEntity, store: GameStore): void {
    entity.collected = true;
    entity.mesh.visible = false;
    entity.light.visible = false;
    entity.respawnTimer = entity.respawnDuration;

    const state = store.getState();

    switch (entity.type) {
      case 'health':
        store.setState({
          health: Math.min(state.health + 40, state.maxHealth),
        });
        break;
      case 'shield':
        store.setState({
          hasShield: true,
          shieldHits: SHIELD_MAX_HITS,
        });
        break;
      case 'damage':
        store.setState({
          hasDamageBuff: true,
          damageBuffTimer: DAMAGE_BUFF_DURATION,
        });
        break;
      case 'speed':
        store.setState({
          hasSpeedBuff: true,
          speedBuffTimer: SPEED_BUFF_DURATION,
        });
        break;
    }
  }

  respawn(entity: PowerUpEntity, delta: number): void {
    if (!entity.collected) return;

    entity.respawnTimer -= delta;
    if (entity.respawnTimer <= 0) {
      entity.collected = false;
      entity.mesh.visible = true;
      entity.light.visible = true;
    }
  }
}
