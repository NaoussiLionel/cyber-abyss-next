'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { GAME_STATES } from '@/types/game';

export default function PausedOverlay() {
  const setGameState = useGameStore((s) => s.setGameState);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGameState(GAME_STATES.PLAYING);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setGameState]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 font-mono">
      {/* Semi-transparent backdrop */}
      <div className="absolute inset-0 bg-[#0a0a14cc] backdrop-blur-sm" />

      <div className="relative z-10 flex flex-col items-center">
        <h2
          className="text-5xl font-bold tracking-[0.4em] text-[#00e5ff] mb-12 select-none"
          style={{ textShadow: '0 0 20px #00e5ff, 0 0 40px #0088aa' }}
        >
          PAUSED
        </h2>

        <div className="flex flex-col gap-3 w-56">
          <button
            onClick={() => setGameState(GAME_STATES.PLAYING)}
            className="px-6 py-3 border border-[#00e5ff66] text-[#00e5ff] tracking-[0.2em] text-sm font-bold hover:bg-[#00e5ff22] hover:border-[#00e5ff] hover:shadow-[0_0_15px_#00e5ff22] transition-all duration-200"
          >
            RESUME
          </button>
          <button
            onClick={() => setGameState(GAME_STATES.OPTIONS)}
            className="px-6 py-3 border border-[#00e5ff44] text-[#00e5ff88] tracking-[0.2em] text-sm hover:bg-[#00e5ff11] hover:border-[#00e5ff88] hover:text-[#00e5ff] transition-all duration-200"
          >
            OPTIONS
          </button>
          <button
            onClick={() => setGameState(GAME_STATES.MENU)}
            className="px-6 py-3 border border-[#ff333344] text-[#ff333388] tracking-[0.2em] text-sm hover:bg-[#ff333311] hover:border-[#ff333388] hover:text-[#ff3333] transition-all duration-200"
          >
            QUIT
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 text-[#ffffff22] text-[10px] tracking-widest z-10">
        ESC TO RESUME
      </div>
    </div>
  );
}
