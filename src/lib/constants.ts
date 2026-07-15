// Player
export const MAX_PLAYER_HEALTH = 100;
export const PLAYER_SPEED_WALK = 6;
export const PLAYER_SPEED_SPRINT = 12;
export const PLAYER_SPEED_AIM = 3;
export const GRAVITY = 40;
export const JUMP_FORCE = 15;
export const PITCH_LIMIT = Math.PI / 2.5;

// Camera
export const NORMAL_FOV = 75;
export const AIM_FOV = 45;
export const NORMAL_OFFSET = { x: 1.2, y: 1.5, z: 4.0 };
export const AIM_OFFSET = { x: 0.6, y: 1.2, z: 2.0 };
export const SENSITIVITY_DEFAULT = 0.002;

// Top-down camera
export const TOPDOWN_HEIGHT = 35;
export const TOPDOWN_FOV = 60;

// Side-scroll
export const SIDESCROLL_JETPACK_THRUST = 18;
export const SIDESCROLL_GRAVITY = 25;
export const SIDESCROLL_MAX_FALL = -15;
export const SIDESCROLL_SPEED = 8;
export const SIDESCROLL_FOV = 70;

// Turret
export const TURRET_FOV = 75;

// Combat
export const DAMAGE_BUFF_DURATION = 10;
export const DAMAGE_BUFF_MULTIPLIER = 2;
export const SPEED_BUFF_DURATION = 5;
export const SPEED_BUFF_MULTIPLIER = 1.5;
export const REPULSE_COOLDOWN = 3.0;
export const REPULSE_FORCE = 12;

// Shield
export const SHIELD_MAX_HITS = 3;

// PowerUp respawn (PvP)
export const POWERUP_RESPAWN = { health: 15, shield: 20, damage: 18, speed: 12 };

// Enemies
export const ENEMY_HP: Record<string, number> = {
  crawler: 30,
  drifter: 40,
  juggernaut: 150,
  sentinel: 60,
  corruption: 500,
};
export const ENEMY_SPEED: Record<string, number> = {
  crawler: 5,
  drifter: 4,
  juggernaut: 2,
  sentinel: 0,
  corruption: 3,
};
export const ENEMY_DAMAGE: Record<string, number> = {
  crawler: 8,
  drifter: 12,
  juggernaut: 25,
  sentinel: 10,
  corruption: 30,
};

// Weapon
export const WEAPON_DAMAGE = 20;
export const WEAPON_RANGE = 100;
export const FIRE_RATE = 0.15;

// Networking
export const NETWORK_TICK_RATE = 20;
export const MAX_PLAYERS = 4;

// Bounds
export const ARENA_BOUNDS = 95;

// PvP team modes
export const PVP_WIN_SCORE = 15;
export const PVP_TIME_LIMIT = 300;
export const PVP_BOSS_HP_MULTIPLIER = 3;
export const PVP_BOSS_DAMAGE_MULTIPLIER = 1.5;
