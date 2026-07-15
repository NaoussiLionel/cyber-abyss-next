import { PvpMap } from '@/types/game';

export const PVP_MAPS: PvpMap[] = [
  {
    id: 'neonArena',
    name: 'NEON ARENA',
    size: 80,
    floor: 0x050515,
    grid: 0x00ffff,
    fog: 0.012,
    ambient: 0.2,
    dirColor: 0x00aaff,
    layout: 'neonArena',
    powerups: [
      { type: 'health', position: [0, 0.5, 0] },
      { type: 'shield', position: [25, 0.5, 0] },
      { type: 'shield', position: [-25, 0.5, 0] },
      { type: 'damage', position: [0, 0.5, 25] },
      { type: 'damage', position: [0, 0.5, -25] },
    ],
  },
  {
    id: 'cyberGrid',
    name: 'CYBER GRID',
    size: 100,
    floor: 0x0a0520,
    grid: 0x8800ff,
    fog: 0.01,
    ambient: 0.18,
    dirColor: 0x6600cc,
    layout: 'cyberGrid',
    powerups: [
      { type: 'shield', position: [35, 0.5, 35] },
      { type: 'shield', position: [-35, 0.5, -35] },
      { type: 'damage', position: [35, 0.5, -35] },
      { type: 'damage', position: [-35, 0.5, 35] },
      { type: 'health', position: [20, 0.5, 0] },
      { type: 'health', position: [-20, 0.5, 0] },
    ],
  },
  {
    id: 'crucible',
    name: 'THE CRUCIBLE',
    size: 90,
    floor: 0x150a05,
    grid: 0xff6600,
    fog: 0.011,
    ambient: 0.16,
    dirColor: 0xcc5500,
    layout: 'crucible',
    powerups: [
      { type: 'damage', position: [0, 8.5, 0] },
      { type: 'shield', position: [20, 3, 0] },
      { type: 'shield', position: [-20, 3, 0] },
      { type: 'health', position: [0, 0.5, 20] },
      { type: 'health', position: [0, 0.5, -20] },
    ],
  },
  {
    id: 'abyssMaw',
    name: 'ABYSS MAW',
    size: 100,
    floor: 0x0a0510,
    grid: 0xaa00ff,
    fog: 0.01,
    ambient: 0.15,
    dirColor: 0x8800cc,
    layout: 'abyssMaw',
    powerups: [
      { type: 'health', position: [35, 0.5, 0] },
      { type: 'health', position: [-35, 0.5, 0] },
      { type: 'shield', position: [0, 0.5, 35] },
      { type: 'shield', position: [0, 0.5, -35] },
      { type: 'damage', position: [25, 0.5, 25] },
      { type: 'damage', position: [-25, 0.5, -25] },
    ],
  },
];

export const PVP_TEAM_MODES = {
  FFA: 'ffa',
  TWO_V_TWO: '2v2',
  THREE_V_ONE: '3v1',
} as const;

export const PVP_PLAYER_COLORS = ['#00e5ff', '#ff4444', '#00ff88', '#ffaa00'];
