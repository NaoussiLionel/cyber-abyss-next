import * as THREE from 'three';

export const GAME_STATES = {
  SPLASH: -1,
  MENU: 0,
  PLAYING: 1,
  TRANSITION: 2,
  GAMEOVER: 3,
  VICTORY: 4,
  OPTIONS: 5,
  HELP: 6,
  LOBBY: 7,
  VS_PLAYING: 8,
  PAUSED: 9,
  EXIT_CONFIRM: 10,
  VS_MENU: 11,
  CONNECT: 12,
  MISSION_SELECT: 13,
  DIALOGUE: 14,
  PVP_LOBBY: 15,
  PVP_MAP_SELECT: 16,
} as const;

export type GameState = (typeof GAME_STATES)[keyof typeof GAME_STATES];

export const CAMERA_MODES = {
  THIRD_PERSON: 'thirdPerson',
  TOP_DOWN: 'topDown',
  SIDE_SCROLL: 'sideScroll',
  TURRET: 'turret',
} as const;

export type CameraMode = (typeof CAMERA_MODES)[keyof typeof CAMERA_MODES];

export const MOVEMENT_MODES = {
  FULL_3D: 'full3D',
  TOP_DOWN: 'topDown',
  SIDE_SCROLL: 'sideScroll',
  STATIONARY: 'stationary',
} as const;

export type MovementMode = (typeof MOVEMENT_MODES)[keyof typeof MOVEMENT_MODES];

export const ENEMY_TYPES = {
  CRAWLER: 'crawler',
  DRIFTER: 'drifter',
  JUGGERNAUT: 'juggernaut',
  SENTINEL: 'sentinel',
  CORRUPTION_BOSS: 'corruption',
} as const;

export type EnemyType = (typeof ENEMY_TYPES)[keyof typeof ENEMY_TYPES];

export const POWERUP_TYPES = {
  HEALTH: 'health',
  SHIELD: 'shield',
  DAMAGE: 'damage',
  SPEED: 'speed',
} as const;

export type PowerUpType = (typeof POWERUP_TYPES)[keyof typeof POWERUP_TYPES];

export interface WaveConfig {
  crawlers?: number;
  drifters?: number;
  juggernauts?: number;
  sentinels?: number;
  boss?: EnemyType;
  delay?: number;
}

export interface PowerUpConfig {
  type: PowerUpType;
  pos: [number, number, number];
}

export interface MapConfig {
  size: number;
  floor: number;
  grid: number;
  fog: number;
  ambient: number;
  dirColor: number;
  walls?: boolean;
  pillars?: number;
  centralPillar?: boolean;
  corridors?: boolean;
  rings?: number;
  dark?: boolean;
  floating?: boolean;
  corrupted?: boolean;
  conveyors?: boolean;
  cathedral?: boolean;
  vertigo?: boolean;
  collapsing?: boolean;
  lightning?: boolean;
  tiers?: number;
  corridor?: boolean;
  boss?: boolean;
  figure8?: boolean;
  mirror?: boolean;
}

export interface Mission {
  id: number;
  codename: string;
  act: number;
  diff: number;
  mode?: 'standard' | 'topdown' | 'sideScroll' | 'turret';
  map: MapConfig;
  waves: WaveConfig[];
  powerups: PowerUpConfig[];
  briefing: string;
  midMission: string[];
  debrief: string;
}

export interface PvpMap {
  id: string;
  name: string;
  size: number;
  floor: number;
  grid: number;
  fog: number;
  ambient: number;
  dirColor: number;
  layout: 'neonArena' | 'cyberGrid' | 'crucible' | 'abyssMaw';
  powerups: PowerUpConfig[];
}

export interface PlayerState {
  id: number;
  name: string;
  health: number;
  maxHealth: number;
  hasShield: boolean;
  shieldHits: number;
  hasDamageBuff: boolean;
  damageBuffTimer: number;
  hasSpeedBuff: boolean;
  speedBuffTimer: number;
  position: THREE.Vector3;
  rotation: number;
  team: 'A' | 'B';
  color: string;
  alive: boolean;
  kills: number;
  deaths: number;
}

export interface NetworkPlayer {
  id: number;
  name: string;
  ready: boolean;
  team: 'A' | 'B';
}

export interface SettingsState {
  sensitivity: number;
  crosshair: string;
  quality: string;
  volume: number;
  fov: number;
}
