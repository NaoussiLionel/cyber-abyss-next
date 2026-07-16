'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { GAME_STATES } from '@/types/game';

const CONTROLS = {
  MOVEMENT: [
    { key: 'W A S D', action: 'Move' },
    { key: 'SPACE', action: 'Jump' },
    { key: 'SHIFT', action: 'Sprint' },
  ],
  COMBAT: [
    { key: 'LMB', action: 'Shoot' },
    { key: 'RMB', action: 'Aim' },
    { key: 'E', action: 'Repulse' },
  ],
  UI: [
    { key: '↑ ↓ ← →', action: 'Navigate' },
    { key: 'ENTER', action: 'Select' },
    { key: 'ESC', action: 'Pause' },
  ],
};

const GAME_MODES = [
  { name: 'STANDARD', color: '#00e5ff', desc: 'Classic arcade experience' },
  { name: 'TOP-DOWN', color: '#00ff88', desc: 'Bird\'s eye view combat' },
  { name: 'SIDE-SCROLL', color: '#ffaa00', desc: '2D platformer action' },
  { name: 'TURRET', color: '#ff3333', desc: 'Fixed position defense' },
];

export default function HelpScreen() {
  const setGameState = useGameStore((s) => s.setGameState);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGameState(GAME_STATES.MENU);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setGameState]);

  return (
    <div className="fixed inset-0 flex flex-col items-center bg-[#0a0a14] z-50 font-mono overflow-y-auto">
      <div className="w-full max-w-3xl p-8">
        <h2
          className="text-3xl font-bold tracking-[0.3em] text-[#00e5ff] mb-10 text-center"
          style={{ textShadow: '0 0 15px #00e5ff66' }}
        >
          CONTROLS
        </h2>

        {/* Controls Grid */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {Object.entries(CONTROLS).map(([category, bindings]) => (
            <div key={category}>
              <h3 className="text-[#00e5ff88] text-xs tracking-[0.2em] mb-3 border-b border-[#00e5ff22] pb-2">
                {category}
              </h3>
              <div className="space-y-2">
                {bindings.map((binding) => (
                  <div key={binding.key} className="flex justify-between items-center">
                    <span className="text-[#00e5ff] text-xs tracking-wider px-2 py-0.5 border border-[#00e5ff44] bg-[#00e5ff0a]">
                      {binding.key}
                    </span>
                    <span className="text-[#ffffff66] text-xs">{binding.action}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Game Modes */}
        <h2
          className="text-2xl font-bold tracking-[0.3em] text-[#00e5ff] mb-6 text-center"
          style={{ textShadow: '0 0 15px #00e5ff66' }}
        >
          GAME MODES
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-10">
          {GAME_MODES.map((mode) => (
            <div
              key={mode.name}
              className="p-4 border border-[#ffffff11] bg-[#0d0d1a]"
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-3 py-1 text-xs font-bold tracking-widest"
                  style={{
                    color: mode.color,
                    border: `1px solid ${mode.color}66`,
                    background: `${mode.color}11`,
                  }}
                >
                  {mode.name}
                </span>
              </div>
              <p className="text-[#ffffff66] text-xs">{mode.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => setGameState(GAME_STATES.MENU)}
          className="w-full py-3 border border-[#00e5ff44] text-[#00e5ff] tracking-[0.2em] text-sm hover:bg-[#00e5ff22] hover:border-[#00e5ff88] transition-all duration-200"
        >
          &#9664; BACK
        </button>
      </div>
    </div>
  );
}
