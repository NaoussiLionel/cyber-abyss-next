import * as THREE from 'three';
import { ARENA_BOUNDS } from '@/lib/constants';
import type { Mission, WaveConfig, EnemyType } from '@/types/game';
import type { Enemy, EnemyFactory } from './EnemySystem';

export class WaveSystem {
  private waveDelayTimer = 0;
  private isCountingDown = false;

  spawnWave(
    mission: Mission,
    waveIndex: number,
    enemyFactory: EnemyFactory
  ): Enemy[] {
    const waveConfig = mission.waves[waveIndex];
    if (!waveConfig) return [];

    const enemies: Enemy[] = [];
    const mapSize = mission.map.size;

    let spawnIndex = 0;

    if (waveConfig.crawlers) {
      for (let i = 0; i < waveConfig.crawlers; i++) {
        const pos = this.getSpawnPosition(mapSize, spawnIndex++);
        enemies.push(enemyFactory.create('crawler', pos));
      }
    }

    if (waveConfig.drifters) {
      for (let i = 0; i < waveConfig.drifters; i++) {
        const pos = this.getSpawnPosition(mapSize, spawnIndex++);
        pos.y = 3;
        enemies.push(enemyFactory.create('drifter', pos));
      }
    }

    if (waveConfig.juggernauts) {
      for (let i = 0; i < waveConfig.juggernauts; i++) {
        const pos = this.getSpawnPosition(mapSize, spawnIndex++);
        enemies.push(enemyFactory.create('juggernaut', pos));
      }
    }

    if (waveConfig.sentinels) {
      for (let i = 0; i < waveConfig.sentinels; i++) {
        const pos = this.getSpawnPosition(mapSize, spawnIndex++);
        enemies.push(enemyFactory.create('sentinel', pos));
      }
    }

    if (waveConfig.boss) {
      const bossPos = new THREE.Vector3(0, 0, -mapSize * 0.5);
      enemies.push(enemyFactory.create(waveConfig.boss as string, bossPos));
    }

    this.waveDelayTimer = 0;
    this.isCountingDown = false;

    return enemies;
  }

  getSpawnPosition(size: number, index: number): THREE.Vector3 {
    const perimeter = size * 2 * 4;
    const spacing = perimeter / 12;
    const dist = index * spacing;

    const halfSize = size * 0.85;
    let x = 0;
    let z = 0;

    if (dist < size * 2) {
      x = -halfSize + dist;
      z = -halfSize;
    } else if (dist < size * 4) {
      x = halfSize;
      z = -halfSize + (dist - size * 2);
    } else if (dist < size * 6) {
      x = halfSize - (dist - size * 4);
      z = halfSize;
    } else {
      x = -halfSize;
      z = halfSize - (dist - size * 6);
    }

    x += (Math.random() - 0.5) * 3;
    z += (Math.random() - 0.5) * 3;

    return new THREE.Vector3(x, 0, z);
  }

  checkWaveComplete(enemies: Enemy[]): boolean {
    if (enemies.length === 0) return true;
    return enemies.every((e) => e.hp <= 0);
  }

  nextWaveOrComplete(
    mission: Mission,
    currentWave: number,
    store: { getState: () => { setGameState: (s: number) => void }; setState: (p: Record<string, any>) => void }
  ): { nextWave: number; complete: boolean } {
    if (currentWave + 1 >= mission.waves.length) {
      return { nextWave: currentWave, complete: true };
    }

    this.isCountingDown = true;
    this.waveDelayTimer = mission.waves[currentWave + 1]?.delay ?? 3;

    return { nextWave: currentWave + 1, complete: false };
  }

  delayedSpawn(waveDelay: number, delta: number): boolean {
    if (!this.isCountingDown) return true;

    this.waveDelayTimer -= delta;
    if (this.waveDelayTimer <= 0) {
      this.isCountingDown = false;
      return true;
    }
    return false;
  }
}
