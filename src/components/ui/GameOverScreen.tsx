'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

export default function GameOverScreen() {
  const { setGameState } = useGameStore();
  const [glowIntensity, setGlowIntensity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity((g) => (g === 1 ? 1.6 : 1));
    }, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') setGameState('mainMenu');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setGameState]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 font-mono overflow-hidden">
      {/* Red tint overlay */}
      <div className="absolute inset-0 bg-[#ff000011] pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, #ff000022 100%)',
        }}
      />

      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #ff000011 2px, #ff000011 4px)',
        }}
      />

      <h1
        className="text-5xl md:text-7xl font-bold tracking-[0.3em] text-[#ff3333] mb-6 select-none relative z-10"
        style={{
          textShadow: `0 0 ${20 * glowIntensity}px #ff3333, 0 0 ${40 * glowIntensity}px #ff0000, 0 0 ${60 * glowIntensity}px #aa0000`,
        }}
      >
        SYSTEM FAILURE
      </h1>

      <p className="text-[#ff666688] text-lg tracking-[0.2em] mb-12 relative z-10">
        YOU HAVE BEEN DESTROYED
      </p>

      <button
        onClick={() => setGameState('mainMenu')}
        className="relative z-10 px-8 py-3 border border-[#ff333366] text-[#ff3333] tracking-[0.2em] text-sm hover:bg-[#ff333322] hover:border-[#ff3333] hover:shadow-[0_0_20px_#ff333344] transition-all duration-200"
      >
        REBOOT SEQUENCE
      </button>

      <div className="absolute bottom-8 text-[#ff333333] text-xs tracking-widest relative z-10">
        ERR_CODE: 0xDEAD // CORE_DUMP_PENDING
      </div>
    </div>
  );
}
