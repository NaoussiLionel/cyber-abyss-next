import { create } from 'zustand';
import {
  GAME_STATES,
  CAMERA_MODES,
  MOVEMENT_MODES,
  type GameState,
  type CameraMode,
  type MovementMode,
  type SettingsState,
  type PlayerState,
  type NetworkPlayer,
  type PvpMap,
  type Mission,
} from '@/types/game';
import * as THREE from 'three';

interface GameStore {
  gameState: GameState;
  setGameState: (state: GameState) => void;

  cameraMode: CameraMode;
  setCameraMode: (mode: CameraMode) => void;
  movementMode: MovementMode;
  setMovementMode: (mode: MovementMode) => void;

  currentMissionIndex: number;
  setCurrentMissionIndex: (index: number) => void;
  currentWave: number;
  setCurrentWave: (wave: number) => void;
  waveDelay: number;
  setWaveDelay: (delay: number) => void;
  missionComplete: boolean;
  setMissionComplete: (complete: boolean) => void;

  playerHealth: number;
  setPlayerHealth: (health: number) => void;
  maxPlayerHealth: number;
  hasShield: boolean;
  setHasShield: (has: boolean) => void;
  shieldHits: number;
  setShieldHits: (hits: number) => void;
  hasDamageBuff: boolean;
  setHasDamageBuff: (has: boolean) => void;
  damageBuffTimer: number;
  setDamageBuffTimer: (timer: number) => void;
  hasSpeedBuff: boolean;
  setHasSpeedBuff: (has: boolean) => void;
  speedBuffTimer: number;
  setSpeedBuffTimer: (timer: number) => void;
  repulseCooldown: number;
  setRepulseCooldown: (cd: number) => void;

  completedMissions: Record<number, boolean>;
  setCompletedMission: (id: number, completed: boolean) => void;

  settings: SettingsState;
  updateSettings: (settings: Partial<SettingsState>) => void;

  isAiming: boolean;
  setIsAiming: (aiming: boolean) => void;

  dialogueText: string;
  setDialogueText: (text: string) => void;
  dialogueQueue: string[];
  setDialogueQueue: (queue: string[]) => void;

  tutorialStep: number;
  setTutorialStep: (step: number) => void;
  tutorialDone: boolean;
  setTutorialDone: (done: boolean) => void;

  // PvP
  pvpTeamMode: string;
  setPvpTeamMode: (mode: string) => void;
  pvpSelectedMap: PvpMap | null;
  setPvpSelectedMap: (map: PvpMap | null) => void;
  connectedPlayers: NetworkPlayer[];
  setConnectedPlayers: (players: NetworkPlayer[]) => void;

  // Player state
  localPlayer: PlayerState;
  setLocalPlayer: (player: Partial<PlayerState>) => void;
  remotePlayers: Record<number, PlayerState>;
  setRemotePlayer: (id: number, player: Partial<PlayerState>) => void;
  removeRemotePlayer: (id: number) => void;

  // Mission select
  selectedMissionIndex: number;
  setSelectedMissionIndex: (index: number) => void;

  // Camera
  cameraRecoil: number;
  setCameraRecoil: (recoil: number) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: GAME_STATES.SPLASH,
  setGameState: (gameState) => set({ gameState }),

  cameraMode: CAMERA_MODES.THIRD_PERSON,
  setCameraMode: (cameraMode) => set({ cameraMode }),
  movementMode: MOVEMENT_MODES.FULL_3D,
  setMovementMode: (movementMode) => set({ movementMode }),

  currentMissionIndex: 0,
  setCurrentMissionIndex: (currentMissionIndex) => set({ currentMissionIndex }),
  currentWave: 0,
  setCurrentWave: (currentWave) => set({ currentWave }),
  waveDelay: 0,
  setWaveDelay: (waveDelay) => set({ waveDelay }),
  missionComplete: false,
  setMissionComplete: (missionComplete) => set({ missionComplete }),

  playerHealth: 100,
  setPlayerHealth: (playerHealth) => set({ playerHealth }),
  maxPlayerHealth: 100,
  hasShield: false,
  setHasShield: (hasShield) => set({ hasShield }),
  shieldHits: 0,
  setShieldHits: (shieldHits) => set({ shieldHits }),
  hasDamageBuff: false,
  setHasDamageBuff: (hasDamageBuff) => set({ hasDamageBuff }),
  damageBuffTimer: 0,
  setDamageBuffTimer: (damageBuffTimer) => set({ damageBuffTimer }),
  hasSpeedBuff: false,
  setHasSpeedBuff: (hasSpeedBuff) => set({ hasSpeedBuff }),
  speedBuffTimer: 0,
  setSpeedBuffTimer: (speedBuffTimer) => set({ speedBuffTimer }),
  repulseCooldown: 0,
  setRepulseCooldown: (repulseCooldown) => set({ repulseCooldown }),

  completedMissions: (() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem('cyber_abyss_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  })(),
  setCompletedMission: (id, completed) =>
    set((state) => {
      const updated = { ...state.completedMissions, [id]: completed };
      if (typeof window !== 'undefined') {
        localStorage.setItem('cyber_abyss_progress', JSON.stringify(updated));
      }
      return { completedMissions: updated };
    }),

  settings: {
    sensitivity: 5,
    crosshair: 'dot',
    quality: 'medium',
    volume: 7,
    fov: 75,
  },
  updateSettings: (partial) =>
    set((state) => {
      const updated = { ...state.settings, ...partial };
      if (typeof window !== 'undefined') {
        localStorage.setItem('cyber_abyss_settings', JSON.stringify(updated));
      }
      return { settings: updated };
    }),

  isAiming: false,
  setIsAiming: (isAiming) => set({ isAiming }),

  dialogueText: '',
  setDialogueText: (dialogueText) => set({ dialogueText }),
  dialogueQueue: [],
  setDialogueQueue: (dialogueQueue) => set({ dialogueQueue }),

  tutorialStep: 0,
  setTutorialStep: (tutorialStep) => set({ tutorialStep }),
  tutorialDone: (() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('cyber_abyss_tutorial_done');
  })(),
  setTutorialDone: (done) => {
    set({ tutorialDone: done });
    if (typeof window !== 'undefined' && done) {
      localStorage.setItem('cyber_abyss_tutorial_done', '1');
    }
  },

  pvpTeamMode: 'ffa',
  setPvpTeamMode: (pvpTeamMode) => set({ pvpTeamMode }),
  pvpSelectedMap: null,
  setPvpSelectedMap: (pvpSelectedMap) => set({ pvpSelectedMap }),
  connectedPlayers: [],
  setConnectedPlayers: (connectedPlayers) => set({ connectedPlayers }),

  localPlayer: {
    id: 0,
    name: 'HOST',
    health: 100,
    maxHealth: 100,
    hasShield: false,
    shieldHits: 0,
    hasDamageBuff: false,
    damageBuffTimer: 0,
    hasSpeedBuff: false,
    speedBuffTimer: 0,
    position: new THREE.Vector3(0, 0.5, 0),
    rotation: 0,
    team: 'A',
    color: '#00e5ff',
    alive: true,
    kills: 0,
    deaths: 0,
  },
  setLocalPlayer: (partial) =>
    set((state) => ({
      localPlayer: { ...state.localPlayer, ...partial },
    })),

  remotePlayers: {},
  setRemotePlayer: (id, partial) =>
    set((state) => ({
      remotePlayers: {
        ...state.remotePlayers,
        [id]: { ...state.remotePlayers[id], ...partial } as any,
      },
    })),
  removeRemotePlayer: (id) =>
    set((state) => {
      const updated = { ...state.remotePlayers };
      delete updated[id];
      return { remotePlayers: updated };
    }),

  selectedMissionIndex: 0,
  setSelectedMissionIndex: (selectedMissionIndex) => set({ selectedMissionIndex }),

  cameraRecoil: 0,
  setCameraRecoil: (cameraRecoil) => set({ cameraRecoil }),
}));
