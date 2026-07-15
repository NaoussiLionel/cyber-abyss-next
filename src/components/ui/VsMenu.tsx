'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export default function VsMenu() {
  const setGameState = useGameStore((s) => s.setGameState);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGameState('mainMenu');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setGameState]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a14] z-50 font-mono">
      <h2
        className="text-3xl font-bold tracking-[0.3em] text-[#00e5ff] mb-12"
        style={{ textShadow: '0 0 15px #00e5ff66' }}
      >
        VS PLAYER
      </h2>

      <div className="flex flex-col gap-4 w-72">
        <button
          onClick={() => setGameState('connectScreen')}
          className="relative px-8 py-4 border border-[#00e5ff44] text-[#00e5ff] tracking-[0.2em] text-sm font-bold hover:bg-[#00e5ff22] hover:border-[#00e5ff88] hover:shadow-[0_0_20px_#00e5ff22] transition-all duration-200"
        >
          ONLINE
          <span className="absolute top-1 right-2 text-[10px] text-[#00e5ff66]">LIVE</span>
        </button>

        <button
          onClick={() => setGameState('connectScreen')}
          className="relative px-8 py-4 border border-[#ff00ff44] text-[#ff00ff] tracking-[0.2em] text-sm font-bold hover:bg-[#ff00ff22] hover:border-[#ff00ff88] hover:shadow-[0_0_20px_#ff00ff22] transition-all duration-200"
        >
          LOCAL NETWORK
          <span className="absolute top-1 right-2 text-[10px] text-[#ff00ff66]">LAN</span>
        </button>
      </div>

      <div className="mt-10 flex flex-col gap-3 w-72">
        <button
          onClick={() => setGameState('connectScreen')}
          className="px-6 py-2 border border-[#00e5ff22] text-[#00e5ff88] tracking-widest text-xs hover:border-[#00e5ff44] hover:text-[#00e5ff] transition-all duration-200"
        >
          CREATE ROOM
        </button>
        <button
          onClick={() => setGameState('connectScreen')}
          className="px-6 py-2 border border-[#00e5ff22] text-[#00e5ff88] tracking-widest text-xs hover:border-[#00e5ff44] hover:text-[#00e5ff] transition-all duration-200"
        >
          JOIN ROOM
        </button>
      </div>

      <button
        onClick={() => setGameState('mainMenu')}
        className="absolute bottom-8 text-[#ffffff44] text-sm tracking-widest hover:text-[#00e5ff] transition-colors"
      >
        &#9664; BACK
      </button>
    </div>
  );
}
