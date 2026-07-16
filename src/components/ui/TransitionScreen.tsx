'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { GAME_STATES } from '@/types/game';

export default function TransitionScreen() {
  const {
    missionCodename = 'PHANTOM GRID',
    missionDebrief = 'Sector secured. Hostile constructs neutralized. Data extraction complete.',
    setGameState,
  } = useGameStore();

  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') setGameState(GAME_STATES.MISSION_SELECT);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setGameState]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a14] z-50 font-mono">
      <div
        className={`transition-all duration-1000 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="text-[#00e5ff66] text-xs tracking-[0.3em] mb-4 text-center">
          MISSION COMPLETE
        </div>

        <h1
          className="text-4xl md:text-6xl font-bold tracking-[0.2em] text-[#00e5ff] text-center mb-8"
          style={{ textShadow: '0 0 20px #00e5ff, 0 0 40px #0088aa' }}
        >
          {missionCodename}
        </h1>

        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#00e5ff44] to-transparent mx-auto mb-8" />

        <p className="text-[#ffffff88] text-sm leading-relaxed text-center max-w-md mx-auto mb-12">
          {missionDebrief}
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => setGameState(GAME_STATES.MISSION_SELECT)}
            className="px-8 py-3 border border-[#00e5ff44] text-[#00e5ff] tracking-[0.2em] text-sm hover:bg-[#00e5ff22] hover:border-[#00e5ff88] transition-all duration-200"
          >
            PROCEED
          </button>
        </div>
      </div>
    </div>
  );
}
