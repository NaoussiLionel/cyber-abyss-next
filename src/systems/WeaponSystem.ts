import * as THREE from 'three';
import {
  WEAPON_DAMAGE,
  WEAPON_RANGE,
  DAMAGE_BUFF_MULTIPLIER,
} from '@/lib/constants';

export interface Projectile {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  damage: number;
  lifetime: number;
  id: number;
}

let projectileIdCounter = 0;

export class WeaponSystem {
  private raycaster = new THREE.Raycaster();

  shoot(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    damage: number,
    enemies: { mesh: THREE.Group; hp: number; userData: any }[]
  ): { hit: boolean; position: THREE.Vector3; enemyId?: number } {
    this.raycaster.set(origin, direction.normalize());
    this.raycaster.far = WEAPON_RANGE;

    const enemyMeshes = enemies.map((e) => e.mesh);
    const intersects = this.raycaster.intersectObjects(enemyMeshes, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      let hitEnemy: { mesh: THREE.Group; hp: number; userData: any } | null = null;

      let obj: THREE.Object3D | null = hit.object;
      while (obj) {
        const found = enemies.find((e) => e.mesh === obj || e.mesh === obj?.parent);
        if (found) {
          hitEnemy = found;
          break;
        }
        obj = obj.parent;
      }

      return {
        hit: true,
        position: hit.point,
        enemyId: hitEnemy?.userData?.id,
      };
    }

    const endPoint = origin.clone().add(direction.clone().multiplyScalar(WEAPON_RANGE));
    return { hit: false, position: endPoint };
  }

  createProjectile(
    position: THREE.Vector3,
    direction: THREE.Vector3,
    speed: number,
    color: number
  ): Projectile {
    const geo = new THREE.SphereGeometry(0.15, 6, 6);
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 2,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(position);
    mesh.castShadow = false;

    return {
      mesh,
      velocity: direction.normalize().multiplyScalar(speed),
      damage: WEAPON_DAMAGE,
      lifetime: 5,
      id: ++projectileIdCounter,
    };
  }

  updateProjectiles(
    delta: number,
    projectiles: Projectile[],
    playerPosition: THREE.Vector3
  ): boolean[] {
    const hitResults: boolean[] = [];

    for (let i = projectiles.length - 1; i >= 0; i--) {
      const proj = projectiles[i];
      proj.mesh.position.add(proj.velocity.clone().multiplyScalar(delta));
      proj.lifetime -= delta;

      const distToPlayer = proj.mesh.position.distanceTo(playerPosition);
      const hitPlayer = distToPlayer < 1.2;
      hitResults.push(hitPlayer);

      if (proj.lifetime <= 0 || hitPlayer) {
        proj.mesh.geometry.dispose();
        (proj.mesh.material as THREE.Material).dispose();
      }
    }

    return hitResults;
  }

  calculateDamage(
    baseDamage: number,
    hasDamageBuff: boolean,
    isWeakSpot: boolean,
    isBossNode: boolean,
    isHeadshot: boolean
  ): number {
    let damage = baseDamage;

    if (hasDamageBuff) {
      damage *= DAMAGE_BUFF_MULTIPLIER;
    }

    if (isWeakSpot) {
      damage *= 2;
    }

    if (isBossNode) {
      damage *= 1.5;
    }

    if (isHeadshot) {
      damage *= 1.75;
    }

    return Math.round(damage);
  }
}
