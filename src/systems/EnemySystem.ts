import * as THREE from 'three';
import { ENEMY_HP, ENEMY_SPEED, ENEMY_DAMAGE } from '@/lib/constants';

export interface Enemy {
  mesh: THREE.Group;
  type: string;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  userData: any;
}

let enemyIdCounter = 0;

export class EnemyFactory {
  create(type: string, position: THREE.Vector3): Enemy {
    const group = new THREE.Group();
    group.position.copy(position);

    const hp = ENEMY_HP[type] ?? 30;
    const speed = ENEMY_SPEED[type] ?? 3;
    const damage = ENEMY_DAMAGE[type] ?? 10;

    const userData: any = {
      id: ++enemyIdCounter,
      attackTimer: 0,
      fireTimer: 0,
      slamCooldown: 0,
      phase: 1,
      phaseTimer: 0,
      attached: false,
      orbitAngle: 0,
      currentPath: null,
    };

    switch (type) {
      case 'crawler':
        this.buildCrawler(group);
        break;
      case 'drifter':
        this.buildDrifter(group);
        break;
      case 'juggernaut':
        this.buildJuggernaut(group);
        break;
      case 'sentinel':
        this.buildSentinel(group);
        break;
      case 'corruption':
        this.buildCorruption(group);
        break;
    }

    return { mesh: group, type, hp, maxHp: hp, speed, damage, userData };
  }

  private buildCrawler(group: THREE.Group): void {
    const bodyGeo = new THREE.BoxGeometry(0.8, 0.5, 0.8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xcc2222 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.25;
    body.castShadow = true;
    group.add(body);

    const eyeGeo = new THREE.SphereGeometry(0.08, 6, 6);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xff0000, emissiveIntensity: 2 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.2, 0.4, -0.35);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.2, 0.4, -0.35);
    group.add(rightEye);
  }

  private buildDrifter(group: THREE.Group): void {
    const geo = new THREE.IcosahedronGeometry(1.0, 0);
    const mat = new THREE.MeshStandardMaterial({ color: 0x4488ff, wireframe: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 3;
    group.add(mesh);

    const glowGeo = new THREE.IcosahedronGeometry(0.6, 0);
    const glowMat = new THREE.MeshStandardMaterial({
      color: 0x44aaff,
      emissive: 0x2266ff,
      emissiveIntensity: 1,
      transparent: true,
      opacity: 0.5,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.y = 3;
    group.add(glow);

    group.userData.isFlying = true;
  }

  private buildJuggernaut(group: THREE.Group): void {
    const bodyGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x884400 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.25;
    body.castShadow = true;
    group.add(body);

    const weakGeo = new THREE.SphereGeometry(0.5, 12, 12);
    const weakMat = new THREE.MeshStandardMaterial({
      color: 0xff8800,
      emissive: 0xff4400,
      emissiveIntensity: 1,
    });
    const weakSpot = new THREE.Mesh(weakGeo, weakMat);
    weakSpot.position.set(0, 2.5, 0);
    weakSpot.name = 'weakSpot';
    group.add(weakSpot);
  }

  private buildSentinel(group: THREE.Group): void {
    const baseGeo = new THREE.BoxGeometry(1.2, 0.8, 1.2);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x555577 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.4;
    base.castShadow = true;
    group.add(base);

    const barrelGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.4, 8);
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0x888899 });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.9, -0.7);
    barrel.name = 'barrel';
    group.add(barrel);

    const lightGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2 });
    const light = new THREE.Mesh(lightGeo, lightMat);
    light.position.set(0, 0.9, -1.3);
    light.name = 'muzzleFlash';
    group.add(light);
  }

  private buildCorruption(group: THREE.Group): void {
    const torsoGeo = new THREE.BoxGeometry(1.8, 2.2, 1);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0x220033 });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 3;
    torso.castShadow = true;
    group.add(torso);

    const headGeo = new THREE.BoxGeometry(0.9, 0.9, 0.9);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x330044, emissive: 0x220033, emissiveIntensity: 0.5 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 4.5, 0);
    group.add(head);

    const eyeGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 3 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.2, 4.6, -0.4);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat.clone());
    rightEye.position.set(0.2, 4.6, -0.4);
    group.add(rightEye);

    const armGeo = new THREE.BoxGeometry(0.5, 2, 0.5);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x330055 });
    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-1.4, 2.8, 0);
    leftArm.name = 'leftArm';
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, armMat.clone());
    rightArm.position.set(1.4, 2.8, 0);
    rightArm.name = 'rightArm';
    group.add(rightArm);

    const legGeo = new THREE.BoxGeometry(0.6, 1.5, 0.6);
    const leftLeg = new THREE.Mesh(legGeo, armMat.clone());
    leftLeg.position.set(-0.5, 0.75, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeo, armMat.clone());
    rightLeg.position.set(0.5, 0.75, 0);
    group.add(rightLeg);

    const coreGeo = new THREE.SphereGeometry(0.4, 12, 12);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff, emissiveIntensity: 2 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 3.2, 0);
    core.name = 'coreNode';
    group.add(core);

    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const nodeGeo = new THREE.OctahedronGeometry(0.3, 0);
      const nodeMat = new THREE.MeshStandardMaterial({ color: 0xcc00cc, emissive: 0xaa00aa, emissiveIntensity: 1 });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * 2.5, 2, Math.sin(angle) * 2.5);
      node.name = `bossNode_${i}`;
      node.userData.nodeHealth = 100;
      group.add(node);
    }

    group.userData.phase = 1;
    group.userData.phaseTimer = 0;
    group.userData.nodeCount = 3;
  }
}

export class EnemyBehavior {
  static update(
    enemy: Enemy,
    delta: number,
    playerPosition: THREE.Vector3,
    enemies: Enemy[]
  ): { projectile?: { origin: THREE.Vector3; direction: THREE.Vector3 } } | void {
    enemy.userData.attackTimer = (enemy.userData.attackTimer ?? 0) + delta;
    enemy.userData.fireTimer = (enemy.userData.fireTimer ?? 0) + delta;
    enemy.userData.slamCooldown = (enemy.userData.slamCooldown ?? 0) + delta;

    switch (enemy.type) {
      case 'crawler':
        return EnemyBehavior.updateCrawler(enemy, delta, playerPosition);
      case 'drifter':
        return EnemyBehavior.updateDrifter(enemy, delta, playerPosition);
      case 'juggernaut':
        return EnemyBehavior.updateJuggernaut(enemy, delta, playerPosition);
      case 'sentinel':
        return EnemyBehavior.updateSentinel(enemy, delta, playerPosition);
      case 'corruption':
        return EnemyBehavior.updateCorruption(enemy, delta, playerPosition, enemies);
    }
  }

  private static updateCrawler(
    enemy: Enemy,
    delta: number,
    playerPosition: THREE.Vector3
  ): { projectile?: { origin: THREE.Vector3; direction: THREE.Vector3 } } | void {
    const dir = new THREE.Vector3().subVectors(playerPosition, enemy.mesh.position);
    dir.y = 0;
    const dist = dir.length();
    dir.normalize();

    enemy.mesh.position.x += dir.x * enemy.speed * delta;
    enemy.mesh.position.z += dir.z * enemy.speed * delta;

    enemy.mesh.lookAt(
      new THREE.Vector3(playerPosition.x, enemy.mesh.position.y, playerPosition.z)
    );

    if (dist < 1.5 && enemy.userData.attackTimer > 1.0) {
      enemy.userData.attached = true;
      enemy.userData.attackTimer = 0;
    }
  }

  private static updateDrifter(
    enemy: Enemy,
    delta: number,
    playerPosition: THREE.Vector3
  ): { projectile?: { origin: THREE.Vector3; direction: THREE.Vector3 } } | void {
    enemy.userData.orbitAngle += delta * 0.5;

    const dist = enemy.mesh.position.distanceTo(playerPosition);

    if (dist < 8) {
      const away = new THREE.Vector3().subVectors(enemy.mesh.position, playerPosition).normalize();
      enemy.mesh.position.x += away.x * enemy.speed * delta;
      enemy.mesh.position.z += away.z * enemy.speed * delta;
    } else if (dist > 12) {
      const toward = new THREE.Vector3().subVectors(playerPosition, enemy.mesh.position).normalize();
      enemy.mesh.position.x += toward.x * enemy.speed * delta;
      enemy.mesh.position.z += toward.z * enemy.speed * delta;
    } else {
      const orbitCenter = new THREE.Vector3(playerPosition.x, 3, playerPosition.z);
      const orbitDir = new THREE.Vector3(
        Math.cos(enemy.userData.orbitAngle),
        0,
        Math.sin(enemy.userData.orbitAngle)
      );
      enemy.mesh.position.x += orbitDir.x * enemy.speed * delta;
      enemy.mesh.position.z += orbitDir.z * enemy.speed * delta;
    }

    enemy.mesh.position.y = 3 + Math.sin(enemy.userData.orbitAngle * 2) * 0.5;

    enemy.mesh.lookAt(
      new THREE.Vector3(playerPosition.x, enemy.mesh.position.y, playerPosition.z)
    );

    if (enemy.userData.fireTimer >= 3.0) {
      enemy.userData.fireTimer = 0;
      const dir = new THREE.Vector3().subVectors(playerPosition, enemy.mesh.position).normalize();
      return {
        projectile: {
          origin: enemy.mesh.position.clone(),
          direction: dir,
        },
      };
    }
  }

  private static updateJuggernaut(
    enemy: Enemy,
    delta: number,
    playerPosition: THREE.Vector3
  ): { projectile?: { origin: THREE.Vector3; direction: THREE.Vector3 } } | void {
    const weakSpot = enemy.mesh.getObjectByName('weakSpot') as THREE.Mesh;
    if (weakSpot) {
      weakSpot.rotation.y += delta * 2;
      weakSpot.rotation.x += delta * 1.5;
    }

    const dir = new THREE.Vector3().subVectors(playerPosition, enemy.mesh.position);
    dir.y = 0;
    const dist = dir.length();
    dir.normalize();

    enemy.mesh.position.x += dir.x * enemy.speed * delta;
    enemy.mesh.position.z += dir.z * enemy.speed * delta;

    enemy.mesh.lookAt(
      new THREE.Vector3(playerPosition.x, enemy.mesh.position.y, playerPosition.z)
    );

    if (dist < 3 && enemy.userData.slamCooldown >= 2.5) {
      enemy.userData.slamCooldown = 0;
    }
  }

  private static updateSentinel(
    enemy: Enemy,
    delta: number,
    playerPosition: THREE.Vector3
  ): { projectile?: { origin: THREE.Vector3; direction: THREE.Vector3 } } | void {
    const dir = new THREE.Vector3().subVectors(playerPosition, enemy.mesh.position);
    dir.y = 0;
    dir.normalize();

    const targetAngle = Math.atan2(dir.x, dir.z);
    enemy.mesh.rotation.y = THREE.MathUtils.lerp(
      enemy.mesh.rotation.y,
      targetAngle,
      5 * delta
    );

    if (enemy.userData.fireTimer >= 4.0) {
      enemy.userData.fireTimer = 0;
      const barrel = enemy.mesh.getObjectByName('barrel') as THREE.Mesh;
      const muzzlePos = barrel
        ? new THREE.Vector3().setFromMatrixPosition(barrel.matrixWorld)
        : enemy.mesh.position.clone().add(new THREE.Vector3(0, 0.9, -1.3));

      const shots: { projectile?: { origin: THREE.Vector3; direction: THREE.Vector3 } }[] = [];
      for (let i = 0; i < 3; i++) {
        const spread = (i - 1) * 0.15;
        const shotDir = dir.clone();
        shotDir.x += spread;
        shotDir.normalize();
        shots.push({
          projectile: {
            origin: muzzlePos.clone(),
            direction: shotDir,
          },
        });
      }
      return shots[0];
    }
  }

  private static updateCorruption(
    enemy: Enemy,
    delta: number,
    playerPosition: THREE.Vector3,
    enemies: Enemy[]
  ): { projectile?: { origin: THREE.Vector3; direction: THREE.Vector3 } } | void {
    enemy.userData.phaseTimer += delta;

    const phase = enemy.userData.phase ?? 1;

    switch (phase) {
      case 1: {
        const dir = new THREE.Vector3().subVectors(playerPosition, enemy.mesh.position);
        dir.y = 0;
        dir.normalize();
        enemy.mesh.lookAt(
          new THREE.Vector3(playerPosition.x, enemy.mesh.position.y, playerPosition.z)
        );

        if (enemy.userData.fireTimer >= 2.0) {
          enemy.userData.fireTimer = 0;
          const core = enemy.mesh.getObjectByName('coreNode');
          if (core) {
            const corePos = new THREE.Vector3().setFromMatrixPosition(core.matrixWorld);
            return {
              projectile: {
                origin: corePos,
                direction: dir.clone(),
              },
            };
          }
        }

        const totalNodeHp = enemy.mesh.children.reduce((sum, child) => {
          return sum + (child.userData.nodeHealth ?? 0);
        }, 0);
        if (totalNodeHp <= 0) {
          enemy.userData.phase = 2;
          enemy.userData.phaseTimer = 0;
          enemy.userData.fireTimer = 0;
        }
        break;
      }
      case 2: {
        if (enemy.userData.fireTimer >= 1.5) {
          enemy.userData.fireTimer = 0;
          const dir = new THREE.Vector3().subVectors(playerPosition, enemy.mesh.position).normalize();
          return {
            projectile: {
              origin: enemy.mesh.position.clone().add(new THREE.Vector3(0, 3, 0)),
              direction: dir,
            },
          };
        }

        enemy.mesh.rotation.y += delta * 1.5;

        if (enemy.hp <= enemy.maxHp * 0.35) {
          enemy.userData.phase = 3;
          enemy.userData.phaseTimer = 0;
          enemy.speed = ENEMY_SPEED['corruption'] * 1.8;
        }
        break;
      }
      case 3: {
        const dir = new THREE.Vector3().subVectors(playerPosition, enemy.mesh.position);
        dir.y = 0;
        const dist = dir.length();
        dir.normalize();

        enemy.mesh.position.x += dir.x * enemy.speed * delta;
        enemy.mesh.position.z += dir.z * enemy.speed * delta;

        enemy.mesh.lookAt(
          new THREE.Vector3(playerPosition.x, enemy.mesh.position.y, playerPosition.z)
        );

        const rightArm = enemy.mesh.getObjectByName('rightArm');
        if (rightArm) {
          rightArm.rotation.x = Math.sin(enemy.userData.phaseTimer * 4) * 0.5;
        }

        if (dist < 4 && enemy.userData.slamCooldown >= 2.0) {
          enemy.userData.slamCooldown = 0;
        }

        if (enemy.userData.fireTimer >= 1.0) {
          enemy.userData.fireTimer = 0;
          const shotDir = dir.clone();
          shotDir.x += (Math.random() - 0.5) * 0.3;
          shotDir.z += (Math.random() - 0.5) * 0.3;
          shotDir.normalize();
          return {
            projectile: {
              origin: enemy.mesh.position.clone().add(new THREE.Vector3(0, 3, 0)),
              direction: shotDir,
            },
          };
        }
        break;
      }
    }
  }
}
