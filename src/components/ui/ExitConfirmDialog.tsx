'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { GAME_STATES } from '@/types/game';

export default function ExitConfirmDialog() {
  const setGameState = useGameStore((s) => s.setGameState);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGameState(GAME_STATES.MENU);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setGameState]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 font-mono">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a0a14ee] backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative z-10 w-80 border border-[#ff333344] bg-[#0d0d1a] p-8">
        <h3
          className="text-xl font-bold tracking-[0.3em] text-[#ff3333] mb-3 text-center"
          style={{ textShadow: '0 0 10px #ff333366' }}
        >
          EXIT GAME?
        </h3>

        <p className="text-[#ffffff66] text-xs tracking-wider text-center mb-8">
          Your progress will not be saved
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.close();
              }
            }}
            className="flex-1 px-4 py-3 border border-[#ff333366] text-[#ff3333] tracking-[0.2em] text-sm font-bold hover:bg-[#ff333322] hover:border-[#ff3333] hover:shadow-[0_0_15px_#ff333322] transition-all duration-200"
          >
            QUIT
          </button>
          <button
            onClick={() => setGameState(GAME_STATES.MENU)}
            className="flex-1 px-4 py-3 border border-[#00e5ff44] text-[#00e5ff88] tracking-[0.2em] text-sm hover:bg-[#00e5ff11] hover:border-[#00e5ff88] hover:text-[#00e5ff] transition-all duration-200"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
