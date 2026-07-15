'use client';

import { useGameStore } from '@/stores/gameStore';

type CrosshairStyle = 'dot' | 'cross' | 'circle';

export default function HUD() {
  const {
    missionCodename = 'PHANTOM GRID',
    wave = 3,
    totalWaves = 5,
    health = 72,
    maxHealth = 100,
    shieldHits = 2,
    maxShieldHits = 3,
    repulseCooldown = 0.4,
    activeBuffs = [],
    crosshairStyle = 'cross',
  } = useGameStore();

  const healthPct = Math.max(0, Math.min(100, (health / maxHealth) * 100));
  const healthColor =
    healthPct > 60 ? '#00ff88' : healthPct > 30 ? '#ffaa00' : '#ff3333';

  const cooldownAngle = repulseCooldown * 360;
  const circumference = 2 * Math.PI * 18;
  const dashOffset = circumference * (1 - repulseCooldown);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 font-mono">
      {/* Top Left: Mission Info */}
      <div className="absolute top-4 left-4">
        <div className="text-[#00e5ff] text-sm tracking-[0.2em] font-bold">
          {missionCodename}
        </div>
        <div className="text-[#00e5ff88] text-xs tracking-widest mt-1">
          WAVE {wave}/{totalWaves}
        </div>
      </div>

      {/* Top Right: Health & Shield */}
      <div className="absolute top-4 right-4 flex items-start gap-4">
        {/* Shield */}
        <div className="flex flex-col items-center">
          <div
            className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold"
            style={{
              borderColor: shieldHits > 0 ? '#4488ff' : '#333',
              boxShadow: shieldHits > 0 ? '0 0 10px #4488ff66' : 'none',
              color: shieldHits > 0 ? '#4488ff' : '#333',
            }}
          >
            {shieldHits}
          </div>
          <span className="text-[#4488ff88] text-[10px] mt-1 tracking-wider">
            SHIELD
          </span>
        </div>

        {/* Health Bar */}
        <div className="flex flex-col items-end">
          <div className="w-48 h-3 bg-[#1a1a2e] border border-[#ffffff11] overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${healthPct}%`,
                background: `linear-gradient(90deg, ${healthColor}, ${
                  healthPct > 60 ? '#00ff88' : healthPct > 30 ? '#ffcc00' : '#ff3333'
                })`,
                boxShadow: `0 0 8px ${healthColor}66`,
              }}
            />
          </div>
          <div className="text-[10px] text-[#ffffff66] mt-1 tracking-wider">
            {health}/{maxHealth}
          </div>
        </div>
      </div>

      {/* Bottom Center: Repulse Cooldown + Buffs */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
        {/* Buff Indicators */}
        {activeBuffs.includes('damage') && (
          <div className="text-[#ff00ff] text-xl" title="Damage Boost">
            &#9876;
          </div>
        )}
        {activeBuffs.includes('speed') && (
          <div className="text-[#ffaa00] text-xl" title="Speed Boost">
            &#9889;
          </div>
        )}

        {/* Repulse Cooldown Ring */}
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="#1a1a2e"
              strokeWidth="3"
            />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke={repulseCooldown >= 1 ? '#00e5ff' : '#ff00ff'}
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.1s' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[#ffffff88] font-mono">
            E
          </div>
        </div>
      </div>

      {/* Center: Crosshair */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Crosshair style={crosshairStyle} />
      </div>
    </div>
  );
}

function Crosshair({ style }: { style: CrosshairStyle }) {
  if (style === 'dot') {
    return (
      <div className="w-2 h-2 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff]" />
    );
  }
  if (style === 'cross') {
    return (
      <div className="relative w-6 h-6">
        <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 bg-[#00e5ff] shadow-[0_0_4px_#00e5ff]" />
        <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-[#00e5ff] shadow-[0_0_4px_#00e5ff]" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full border-2 border-[#00e5ff] shadow-[0_0_6px_#00e5ff]">
      <div className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 bg-[#00e5ff] rounded-full" />
    </div>
  );
}
