'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { GAME_STATES } from '@/types/game';

export default function VictoryScreen() {
  const {
    missionCodename = 'THE ABYSS',
    finalDebrief = 'All sectors secured. The Quantum Grid is stable. Humanity endures.',
    setGameState,
  } = useGameStore();

  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') setGameState(GAME_STATES.MENU);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setGameState]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 font-mono overflow-hidden">
      {/* Green tint overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, #00ff8811 100%)',
        }}
      />

      <div
        className={`transition-all duration-1000 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h1
          className="text-5xl md:text-7xl font-bold tracking-[0.3em] text-[#00ff88] mb-6 select-none text-center"
          style={{ textShadow: '0 0 20px #00ff88, 0 0 40px #00aa44, 0 0 60px #006622' }}
        >
          MISSION COMPLETE
        </h1>

        <div className="text-[#00ff8866] text-xs tracking-[0.3em] mb-6 text-center">
          {missionCodename}
        </div>

        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#00ff8844] to-transparent mx-auto mb-8" />

        <p className="text-[#ffffff88] text-sm leading-relaxed text-center max-w-lg mx-auto mb-12 px-4">
          {finalDebrief}
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => setGameState(GAME_STATES.MENU)}
            className="px-8 py-3 border border-[#00ff8866] text-[#00ff88] tracking-[0.2em] text-sm hover:bg-[#00ff8822] hover:border-[#00ff88] hover:shadow-[0_0_20px_#00ff8844] transition-all duration-200"
          >
            RETURN TO MENU
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 text-[#00ff8833] text-xs tracking-widest">
        STATUS: OPTIMAL // RANK: S+
      </div>
    </div>
  );
}
