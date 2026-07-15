import * as THREE from 'three';
import type { MapConfig, PvpMap } from '@/types/game';

export class MapBuilder {
  private scene: THREE.Scene;
  private createdObjects: THREE.Object3D[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  build(missionMap: MapConfig): void {
    this.clear();

    const floorGeo = new THREE.PlaneGeometry(missionMap.size * 2, missionMap.size * 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: missionMap.floor,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
    this.createdObjects.push(floor);

    const gridHelper = new THREE.GridHelper(missionMap.size * 2, missionMap.grid, 0x444444, 0x222222);
    gridHelper.position.y = 0.01;
    this.scene.add(gridHelper);
    this.createdObjects.push(gridHelper);

    this.scene.fog = new THREE.FogExp2(missionMap.fog, 0.015);
    this.scene.background = new THREE.Color(missionMap.fog);

    const ambient = new THREE.AmbientLight(missionMap.ambient, 0.6);
    this.scene.add(ambient);
    this.createdObjects.push(ambient);

    const dirLight = new THREE.DirectionalLight(missionMap.dirColor, 1);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -missionMap.size;
    dirLight.shadow.camera.right = missionMap.size;
    dirLight.shadow.camera.top = missionMap.size;
    dirLight.shadow.camera.bottom = -missionMap.size;
    this.scene.add(dirLight);
    this.createdObjects.push(dirLight);

    const halfSize = missionMap.size;

    if (missionMap.walls) this.addWalls(halfSize);
    if (missionMap.pillars) this.addPillars(missionMap.pillars, halfSize);
    if (missionMap.centralPillar) this.addCentralPillar();
    if (missionMap.corridors) this.addCorridors(halfSize);
    if (missionMap.rings) this.addRings(missionMap.rings, halfSize);
    if (missionMap.dark) this.addDark();
    if (missionMap.floating) this.addFloatingPlatforms(halfSize);
    if (missionMap.corrupted) this.addCorruptionEffects(halfSize);
    if (missionMap.conveyors) this.addConveyors(halfSize);
    if (missionMap.cathedral) this.addCathedral(halfSize);
    if (missionMap.vertigo) this.addVertigoFloor(halfSize);
    if (missionMap.collapsing) this.addCollapsingFloor(halfSize);
    if (missionMap.lightning) this.addLightningTowers(halfSize);
    if (missionMap.tiers) this.addTiers(missionMap.tiers, halfSize);
    if (missionMap.corridor) this.addGauntletCorridor(halfSize);
    if (missionMap.boss) this.addBossArena(halfSize);
    if (missionMap.figure8) this.addFigure8(halfSize);
    if (missionMap.mirror) this.addMirrorFloor(halfSize);
  }

  buildPvPMap(mapConfig: PvpMap): void {
    this.clear();

    const floorGeo = new THREE.PlaneGeometry(mapConfig.size * 2, mapConfig.size * 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: mapConfig.floor,
      roughness: 0.7,
      metalness: 0.3,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
    this.createdObjects.push(floor);

    const gridHelper = new THREE.GridHelper(mapConfig.size * 2, mapConfig.grid, 0x444444, 0x222222);
    gridHelper.position.y = 0.01;
    this.scene.add(gridHelper);
    this.createdObjects.push(gridHelper);

    this.scene.fog = new THREE.FogExp2(mapConfig.fog, 0.015);
    this.scene.background = new THREE.Color(mapConfig.fog);

    const ambient = new THREE.AmbientLight(mapConfig.ambient, 0.6);
    this.scene.add(ambient);
    this.createdObjects.push(ambient);

    const dirLight = new THREE.DirectionalLight(mapConfig.dirColor, 1);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    this.scene.add(dirLight);
    this.createdObjects.push(dirLight);

    switch (mapConfig.layout) {
      case 'neonArena':
        this.buildNeonArena(mapConfig);
        break;
      case 'cyberGrid':
        this.buildCyberGrid(mapConfig);
        break;
      case 'crucible':
        this.buildCrucible(mapConfig);
        break;
      case 'abyssMaw':
        this.buildAbyssMaw(mapConfig);
        break;
    }
  }

  clear(): void {
    for (const obj of this.createdObjects) {
      this.scene.remove(obj);
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }
    this.createdObjects = [];
  }

  private addBox(
    w: number,
    h: number,
    d: number,
    color: number,
    x: number,
    y: number,
    z: number,
    emissive?: number
  ): THREE.Mesh {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: emissive ?? color,
      emissiveIntensity: emissive ? 0.3 : 0,
      roughness: 0.6,
      metalness: 0.4,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    this.createdObjects.push(mesh);
    return mesh;
  }

  private addWalls(size: number): void {
    const wallH = 6;
    const wallT = 1;
    this.addBox(size * 2, wallH, wallT, 0x333344, 0, wallH / 2, -size);
    this.addBox(size * 2, wallH, wallT, 0x333344, 0, wallH / 2, size);
    this.addBox(wallT, wallH, size * 2, 0x333344, -size, wallH / 2, 0);
    this.addBox(wallT, wallH, size * 2, 0x333344, size, wallH / 2, 0);
  }

  private addPillars(count: number, size: number): void {
    const radius = size * 0.6;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      this.addBox(1.5, 8, 1.5, 0x555566, x, 4, z);
    }
  }

  private addCentralPillar(): void {
    this.addBox(3, 12, 3, 0x666688, 0, 6, 0);
    this.addBox(1.5, 1, 1.5, 0x884400, 0, 12.5, 0, 0xff6600);
  }

  private addCorridors(size: number): void {
    const wallH = 5;
    this.addBox(2, wallH, size, 0x444455, -size / 2, wallH / 2, 0);
    this.addBox(2, wallH, size, 0x444455, size / 2, wallH / 2, 0);
    this.addBox(size, wallH, 2, 0x444455, 0, wallH / 2, -size / 3);
    this.addBox(size, wallH, 2, 0x444455, 0, wallH / 2, size / 3);
  }

  private addRings(count: number, size: number): void {
    for (let i = 0; i < count; i++) {
      const r = size * (0.3 + (i / count) * 0.5);
      const ringGeo = new THREE.TorusGeometry(r, 0.3, 8, 32);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x666688, metalness: 0.6, roughness: 0.4 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 2 + i * 2;
      this.scene.add(ring);
      this.createdObjects.push(ring);
    }
  }

  private addDark(): void {
    const ambient = new THREE.AmbientLight(0x111122, 0.15);
    this.scene.add(ambient);
    this.createdObjects.push(ambient);

    const point1 = new THREE.PointLight(0xff4400, 2, 15);
    point1.position.set(5, 3, 0);
    this.scene.add(point1);
    this.createdObjects.push(point1);

    const point2 = new THREE.PointLight(0x4400ff, 2, 15);
    point2.position.set(-5, 3, 0);
    this.scene.add(point2);
    this.createdObjects.push(point2);
  }

  private addFloatingPlatforms(size: number): void {
    const positions = [
      [size * 0.4, 4, size * 0.3],
      [-size * 0.3, 6, -size * 0.4],
      [0, 8, size * 0.5],
      [-size * 0.5, 5, size * 0.2],
      [size * 0.2, 7, -size * 0.3],
    ];
    for (const [x, y, z] of positions) {
      this.addBox(4, 0.5, 4, 0x556677, x, y, z);
    }
  }

  private addCorruptionEffects(size: number): void {
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * size * 0.7;
      const z = Math.sin(angle) * size * 0.7;
      const pillar = this.addBox(0.8, 4, 0.8, 0x330033, x, 2, z, 0x660066);
      const light = new THREE.PointLight(0x990099, 1, 6);
      light.position.set(x, 4, z);
      this.scene.add(light);
      this.createdObjects.push(light);
    }

    const fogMat = new THREE.MeshStandardMaterial({
      color: 0x220022,
      emissive: 0x440044,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.3,
    });
    const fogGeo = new THREE.BoxGeometry(size * 1.5, 0.5, size * 1.5);
    const fogMesh = new THREE.Mesh(fogGeo, fogMat);
    fogMesh.position.y = 0.25;
    this.scene.add(fogMesh);
    this.createdObjects.push(fogMesh);
  }

  private addConveyors(size: number): void {
    for (let i = 0; i < 3; i++) {
      const z = (i - 1) * 8;
      this.addBox(size * 0.6, 0.2, 3, 0x446644, 0, 0.1, z);
      const arrowGeo = new THREE.ConeGeometry(0.3, 0.8, 4);
      const arrowMat = new THREE.MeshStandardMaterial({ color: 0x88ff88, emissive: 0x44ff44, emissiveIntensity: 1 });
      for (let j = 0; j < 5; j++) {
        const arrow = new THREE.Mesh(arrowGeo, arrowMat.clone());
        arrow.rotation.z = Math.PI;
        arrow.position.set(-size * 0.2 + j * 3, 0.5, z);
        this.scene.add(arrow);
        this.createdObjects.push(arrow);
      }
    }
  }

  private addCathedral(size: number): void {
    const pillarCount = 6;
    for (let i = 0; i < pillarCount; i++) {
      const x = (i - pillarCount / 2 + 0.5) * 6;
      this.addBox(1.5, 15, 1.5, 0x444455, x, 7.5, -size * 0.8);
      this.addBox(1.5, 15, 1.5, 0x444455, x, 7.5, size * 0.8);
    }

    this.addBox(size, 0.5, size * 0.3, 0x555566, 0, 15, 0);
  }

  private addVertigoFloor(size: number): void {
    for (let i = 0; i < 5; i++) {
      const y = -i * 4;
      this.addBox(size * 2, 0.3, size * 2, 0x333344 - i * 0x050505, 0, y, 0);

      const edgeGeo = new THREE.BoxGeometry(size * 2, 0.1, 0.3);
      const edgeMat = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x0044ff, emissiveIntensity: 1 });
      const edge = new THREE.Mesh(edgeGeo, edgeMat);
      edge.position.set(0, y + 0.2, size);
      this.scene.add(edge);
      this.createdObjects.push(edge);
    }
  }

  private addCollapsingFloor(size: number): void {
    const tileSize = 4;
    const cols = Math.floor((size * 2) / tileSize);
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < cols; z++) {
        const posX = (x - cols / 2) * tileSize + tileSize / 2;
        const posZ = (z - cols / 2) * tileSize + tileSize / 2;
        const tile = this.addBox(tileSize - 0.2, 0.3, tileSize - 0.3, 0x555544, posX, 0.15, posZ);
        tile.userData.collapsing = true;
        tile.userData.collapseDelay = Math.random() * 3 + 1;
      }
    }
  }

  private addLightningTowers(size: number): void {
    const towerPositions = [
      [size * 0.7, 0, size * 0.7],
      [-size * 0.7, 0, size * 0.7],
      [size * 0.7, 0, -size * 0.7],
      [-size * 0.7, 0, -size * 0.7],
    ];
    for (const [x, _, z] of towerPositions) {
      const tower = this.addBox(2, 10, 2, 0x445566, x, 5, z);
      const light = new THREE.PointLight(0x4488ff, 2, 12);
      light.position.set(x, 10, z);
      this.scene.add(light);
      this.createdObjects.push(light);
    }
  }

  private addTiers(count: number, size: number): void {
    for (let i = 0; i < count; i++) {
      const tierSize = size * (1 - i * 0.2);
      const y = i * 3;
      this.addBox(tierSize * 2, 0.5, tierSize * 2, 0x445566, 0, y, 0);
    }
  }

  private addGauntletCorridor(size: number): void {
    this.addBox(size * 1.5, 6, 1.5, 0x555566, 0, 3, -size * 0.7);
    this.addBox(size * 1.5, 6, 1.5, 0x555566, 0, 3, size * 0.7);

    for (let i = 0; i < 5; i++) {
      const x = (i - 2) * (size * 0.3);
      this.addBox(0.5, 4, 0.5, 0x774422, x, 2, -size * 0.35);
      this.addBox(0.5, 4, 0.5, 0x774422, x, 2, size * 0.35);
    }
  }

  private addBossArena(size: number): void {
    this.addBox(size * 2, 0.5, size * 2, 0x332244, 0, 0.25, 0);

    const arenaWallH = 8;
    this.addBox(size * 2, arenaWallH, 1, 0x442255, 0, arenaWallH / 2, -size);
    this.addBox(size * 2, arenaWallH, 1, 0x442255, 0, arenaWallH / 2, size);
    this.addBox(1, arenaWallH, size * 2, 0x442255, -size, arenaWallH / 2, 0);
    this.addBox(1, arenaWallH, size * 2, 0x442255, size, arenaWallH / 2, 0);

    const light = new THREE.PointLight(0xff00ff, 3, size);
    light.position.set(0, 8, 0);
    this.scene.add(light);
    this.createdObjects.push(light);

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const x = Math.cos(angle) * size * 0.6;
      const z = Math.sin(angle) * size * 0.6;
      this.addBox(2, 0.3, 2, 0x553366, x, 0.15, z, 0x7744aa);
    }
  }

  private addFigure8(size: number): void {
    const points: THREE.Vector3[] = [];
    const segments = 48;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      const x = Math.sin(t) * size * 0.5;
      const z = Math.sin(t) * Math.cos(t) * size;
      points.push(new THREE.Vector3(x, 0.3, z));
    }

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const len = p1.distanceTo(p2);
      const angle = Math.atan2(p2.x - p1.x, p2.z - p1.z);
      const wall = this.addBox(0.4, 2, len + 0.1, 0x556677, mid.x, 1, mid.z);
      wall.rotation.y = angle;
    }
  }

  private addMirrorFloor(size: number): void {
    const mirrorGeo = new THREE.PlaneGeometry(size * 2, size * 2);
    const mirrorMat = new THREE.MeshStandardMaterial({
      color: 0x888899,
      metalness: 0.9,
      roughness: 0.1,
    });
    const mirrorFloor = new THREE.Mesh(mirrorGeo, mirrorMat);
    mirrorFloor.rotation.x = -Math.PI / 2;
    mirrorFloor.position.y = 0.02;
    this.scene.add(mirrorFloor);
    this.createdObjects.push(mirrorFloor);
  }

  private buildNeonArena(map: PvpMap): void {
    const s = map.size;
    this.addWalls(s);

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const x = Math.cos(angle) * s * 0.5;
      const z = Math.sin(angle) * s * 0.5;
      this.addBox(2, 6, 2, 0x334455, x, 3, z);

      const light = new THREE.PointLight(0x00ccff, 1.5, 10);
      light.position.set(x, 6, z);
      this.scene.add(light);
      this.createdObjects.push(light);
    }

    const edgeMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, emissive: 0x00ffcc, emissiveIntensity: 1 });
    const edgePoints = [
      new THREE.Vector3(-s, 0.1, -s),
      new THREE.Vector3(s, 0.1, -s),
      new THREE.Vector3(s, 0.1, s),
      new THREE.Vector3(-s, 0.1, s),
      new THREE.Vector3(-s, 0.1, -s),
    ];
    const edgeGeo = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(edgePoints),
      32, 0.1, 4, true
    );
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    this.scene.add(edge);
    this.createdObjects.push(edge);
  }

  private buildCyberGrid(map: PvpMap): void {
    const s = map.size;

    for (let i = -5; i <= 5; i++) {
      this.addBox(0.1, 0.1, s * 2, 0x00ff88, i * 4, 0.05, 0);
      this.addBox(s * 2, 0.1, 0.1, 0x00ff88, 0, 0.05, i * 4);
    }

    const pillarPositions = [
      [s * 0.5, 0, s * 0.5],
      [-s * 0.5, 0, s * 0.5],
      [s * 0.5, 0, -s * 0.5],
      [-s * 0.5, 0, -s * 0.5],
    ];
    for (const [x, _, z] of pillarPositions) {
      this.addBox(2, 4, 2, 0x224433, x, 2, z);
      const light = new THREE.PointLight(0x00ff88, 1, 8);
      light.position.set(x, 4.5, z);
      this.scene.add(light);
      this.createdObjects.push(light);
    }

    this.addBox(s * 0.8, 0.3, 0.5, 0x00ff88, 0, 0.15, 0);
  }

  private buildCrucible(map: PvpMap): void {
    const s = map.size;

    const pitSize = s * 0.5;
    this.addBox(pitSize * 2, 0.2, pitSize * 2, 0x331111, 0, -0.1, 0);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * s * 0.7;
      const z = Math.sin(angle) * s * 0.7;
      this.addBox(1.5, 3, 1.5, 0x664433, x, 1.5, z);
    }

    this.addBox(s * 2, 1, 1, 0x884422, 0, 0.5, -s);
    this.addBox(s * 2, 1, 1, 0x884422, 0, 0.5, s);
    this.addBox(1, 1, s * 2, 0x884422, -s, 0.5, 0);
    this.addBox(1, 1, s * 2, 0x884422, s, 0.5, 0);

    const lavaLight = new THREE.PointLight(0xff4400, 3, s);
    lavaLight.position.set(0, -2, 0);
    this.scene.add(lavaLight);
    this.createdObjects.push(lavaLight);
  }

  private buildAbyssMaw(map: PvpMap): void {
    const s = map.size;

    const gap = s * 0.15;
    this.addBox(s * 2, 0.5, s - gap, 0x221133, 0, 0.25, -(s + gap) / 2);
    this.addBox(s * 2, 0.5, s - gap, 0x221133, 0, 0.25, (s + gap) / 2);

    this.addBox(s * 2, 2, 0.5, 0x332244, 0, 1, -s);
    this.addBox(s * 2, 2, 0.5, 0x332244, 0, 1, s);

    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * s * 0.4;
      this.addBox(3, 0.5, 3, 0x443355, x, 3, 0);
    }

    const abyssLight = new THREE.PointLight(0x6600aa, 4, s * 1.5);
    abyssLight.position.set(0, -5, 0);
    this.scene.add(abyssLight);
    this.createdObjects.push(abyssLight);

    const edgeLight1 = new THREE.PointLight(0xff00ff, 2, 10);
    edgeLight1.position.set(-s * 0.5, 2, -s * 0.5);
    this.scene.add(edgeLight1);
    this.createdObjects.push(edgeLight1);

    const edgeLight2 = new THREE.PointLight(0xff00ff, 2, 10);
    edgeLight2.position.set(s * 0.5, 2, s * 0.5);
    this.scene.add(edgeLight2);
    this.createdObjects.push(edgeLight2);
  }
}
