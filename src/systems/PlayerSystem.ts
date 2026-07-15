import * as THREE from 'three';
import {
  PLAYER_SPEED_WALK,
  PLAYER_SPEED_SPRINT,
  PLAYER_SPEED_AIM,
  GRAVITY,
  JUMP_FORCE,
  PITCH_LIMIT,
  NORMAL_FOV,
  AIM_FOV,
  NORMAL_OFFSET,
  AIM_OFFSET,
  TOPDOWN_HEIGHT,
  TOPDOWN_FOV,
  SIDESCROLL_JETPACK_THRUST,
  SIDESCROLL_GRAVITY,
  SIDESCROLL_MAX_FALL,
  SIDESCROLL_SPEED,
  SIDESCROLL_FOV,
  TURRET_FOV,
  SPEED_BUFF_MULTIPLIER,
  ARENA_BOUNDS,
} from '@/lib/constants';

interface GameStore {
  getState: () => {
    hasSpeedBuff: boolean;
    speedBuffTimer: number;
  };
}

export class PlayerSystem {
  private playerObject: THREE.Group;
  private yawObject: THREE.Object3D;
  private pitchObject: THREE.Object3D;
  private camera: THREE.PerspectiveCamera;
  private store: GameStore;

  private velocity = new THREE.Vector3();
  private isOnGround = true;
  private jetpackFuel = 100;
  private recoilOffset = 0;

  constructor(
    playerObject: THREE.Group,
    yawObject: THREE.Object3D,
    pitchObject: THREE.Object3D,
    camera: THREE.PerspectiveCamera,
    store: GameStore
  ) {
    this.playerObject = playerObject;
    this.yawObject = yawObject;
    this.pitchObject = pitchObject;
    this.camera = camera;
    this.store = store;
  }

  update(
    delta: number,
    keys: Record<string, boolean>,
    isAiming: boolean,
    cameraMode: string,
    movementMode: string
  ): void {
    switch (movementMode) {
      case 'full3D':
        this.updateFull3D(delta, keys, isAiming);
        break;
      case 'topDown':
        this.updateTopDown(delta, keys);
        break;
      case 'sideScroll':
        this.updateSideScroll(delta, keys);
        break;
      case 'stationary':
        break;
    }

    this.clampToArena();
    this.updateCamera(cameraMode, isAiming);
  }

  private updateFull3D(delta: number, keys: Record<string, boolean>, isAiming: boolean): void {
    const state = this.store.getState();
    const hasSpeedBuff = state.hasSpeedBuff;
    const speed = isAiming ? PLAYER_SPEED_AIM : keys['ShiftLeft'] ? PLAYER_SPEED_SPRINT : PLAYER_SPEED_WALK;
    const finalSpeed = hasSpeedBuff ? speed * SPEED_BUFF_MULTIPLIER : speed;

    const direction = new THREE.Vector3();
    if (keys['KeyW']) direction.z -= 1;
    if (keys['KeyS']) direction.z += 1;
    if (keys['KeyA']) direction.x -= 1;
    if (keys['KeyD']) direction.x += 1;
    direction.normalize();

    direction.applyQuaternion(this.yawObject.quaternion);

    this.velocity.x = direction.x * finalSpeed;
    this.velocity.z = direction.z * finalSpeed;

    if (keys['Space'] && this.isOnGround) {
      this.velocity.y = JUMP_FORCE;
      this.isOnGround = false;
    }

    this.velocity.y -= GRAVITY * delta;

    this.playerObject.position.x += this.velocity.x * delta;
    this.playerObject.position.y += this.velocity.y * delta;
    this.playerObject.position.z += this.velocity.z * delta;

    if (this.playerObject.position.y <= 0) {
      this.playerObject.position.y = 0;
      this.velocity.y = 0;
      this.isOnGround = true;
    }
  }

  private updateTopDown(delta: number, keys: Record<string, boolean>): void {
    const state = this.store.getState();
    const hasSpeedBuff = state.hasSpeedBuff;
    const speed = hasSpeedBuff ? PLAYER_SPEED_WALK * SPEED_BUFF_MULTIPLIER : PLAYER_SPEED_WALK;

    const direction = new THREE.Vector3();
    if (keys['KeyW']) direction.z -= 1;
    if (keys['KeyS']) direction.z += 1;
    if (keys['KeyA']) direction.x -= 1;
    if (keys['KeyD']) direction.x += 1;
    direction.normalize();

    this.playerObject.position.x += direction.x * speed * delta;
    this.playerObject.position.z += direction.z * speed * delta;
    this.playerObject.position.y = 0;

    this.velocity.set(0, 0, 0);
  }

  private updateSideScroll(delta: number, keys: Record<string, boolean>): void {
    const state = this.store.getState();
    const hasSpeedBuff = state.hasSpeedBuff;
    const speed = hasSpeedBuff ? SIDESCROLL_SPEED * SPEED_BUFF_MULTIPLIER : SIDESCROLL_SPEED;

    this.playerObject.position.x += speed * delta;

    if (keys['Space'] && this.jetpackFuel > 0) {
      this.velocity.y += SIDESCROLL_JETPACK_THRUST * delta;
      this.jetpackFuel = Math.max(0, this.jetpackFuel - 30 * delta);
    } else {
      this.jetpackFuel = Math.min(100, this.jetpackFuel + 10 * delta);
    }

    this.velocity.y -= SIDESCROLL_GRAVITY * delta;
    this.velocity.y = Math.max(SIDESCROLL_MAX_FALL, this.velocity.y);

    this.playerObject.position.y += this.velocity.y * delta;

    if (this.playerObject.position.y <= 0) {
      this.playerObject.position.y = 0;
      this.velocity.y = 0;
    }
  }

  private updateCamera(cameraMode: string, isAiming: boolean): void {
    const offset = isAiming ? AIM_OFFSET : NORMAL_OFFSET;
    const fov = isAiming ? AIM_FOV : NORMAL_FOV;

    switch (cameraMode) {
      case 'thirdPerson': {
        const cameraOffset = new THREE.Vector3(offset.x, offset.y, offset.z);
        cameraOffset.applyQuaternion(this.yawObject.quaternion);

        const targetPos = this.playerObject.position.clone().add(cameraOffset);
        this.camera.position.lerp(targetPos, 0.1);
        this.camera.lookAt(this.playerObject.position);
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, fov, 0.1);
        this.camera.updateProjectionMatrix();
        break;
      }
      case 'topDown': {
        const topPos = new THREE.Vector3(
          this.playerObject.position.x,
          this.playerObject.position.y + TOPDOWN_HEIGHT,
          this.playerObject.position.z + 5
        );
        this.camera.position.lerp(topPos, 0.1);
        this.camera.lookAt(this.playerObject.position);
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, TOPDOWN_FOV, 0.1);
        this.camera.updateProjectionMatrix();
        break;
      }
      case 'sideScroll': {
        const sidePos = new THREE.Vector3(
          this.playerObject.position.x - 10,
          this.playerObject.position.y + 3,
          15
        );
        this.camera.position.lerp(sidePos, 0.1);
        this.camera.lookAt(
          new THREE.Vector3(this.playerObject.position.x + 5, this.playerObject.position.y + 1, 0)
        );
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, SIDESCROLL_FOV, 0.1);
        this.camera.updateProjectionMatrix();
        break;
      }
      case 'turret': {
        const turretOffset = new THREE.Vector3(0.5, 1.5, -3);
        turretOffset.applyQuaternion(this.yawObject.quaternion);
        const turretPos = this.playerObject.position.clone().add(turretOffset);
        this.camera.position.lerp(turretPos, 0.1);
        const lookDir = new THREE.Vector3(0, 0, -1);
        lookDir.applyQuaternion(this.pitchObject.quaternion);
        lookDir.applyQuaternion(this.yawObject.quaternion);
        this.camera.lookAt(this.playerObject.position.clone().add(lookDir.multiplyScalar(10)));
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, TURRET_FOV, 0.1);
        this.camera.updateProjectionMatrix();
        break;
      }
    }
  }

  applyCameraRecoil(amount: number): void {
    this.recoilOffset += amount;
    this.pitchObject.rotation.x = THREE.MathUtils.clamp(
      this.pitchObject.rotation.x - amount,
      -PITCH_LIMIT,
      PITCH_LIMIT
    );
  }

  reset(position: THREE.Vector3): void {
    this.playerObject.position.copy(position);
    this.yawObject.rotation.set(0, 0, 0);
    this.pitchObject.rotation.set(0, 0, 0);
    this.velocity.set(0, 0, 0);
    this.jetpackFuel = 100;
    this.isOnGround = true;
    this.recoilOffset = 0;
  }

  private clampToArena(): void {
    const p = this.playerObject.position;
    p.x = THREE.MathUtils.clamp(p.x, -ARENA_BOUNDS, ARENA_BOUNDS);
    p.z = THREE.MathUtils.clamp(p.z, -ARENA_BOUNDS, ARENA_BOUNDS);
  }
}
