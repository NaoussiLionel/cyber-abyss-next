'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { GAME_STATES } from '@/types/game';

export default function SplashScreen() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(1);
  const setGameState = useGameStore((s) => s.setGameState);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setGameState(GAME_STATES.MENU);
          return 100;
        }
        return p + 2;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [setGameState]);

  useEffect(() => {
    const glowInterval = setInterval(() => {
      setGlowIntensity((g) => (g === 1 ? 1.5 : 1));
    }, 800);
    return () => clearInterval(glowInterval);
  }, []);

  useEffect(() => {
    const handleKey = () => setGameState(GAME_STATES.MENU);
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setGameState]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a14] z-50">
      <h1
        className="text-6xl md:text-8xl font-bold tracking-[0.3em] text-[#00e5ff] mb-12 select-none"
        style={{
          textShadow: `0 0 ${20 * glowIntensity}px #00e5ff, 0 0 ${40 * glowIntensity}px #00e5ff, 0 0 ${60 * glowIntensity}px #0088aa`,
        }}
      >
        CYBER ABYSS
      </h1>

      <div className="w-80 h-1 bg-[#1a1a2e] border border-[#00e5ff33] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#00e5ff] to-[#ff00ff] transition-all duration-100"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>

      <p className="mt-8 text-[#00e5ff88] text-sm tracking-widest font-mono animate-pulse">
        PRESS ANY KEY TO SKIP
      </p>

      <div className="absolute bottom-8 text-[#ffffff22] text-xs tracking-widest font-mono">
        v0.1.0 // SYSTEM INITIALIZING
      </div>
    </div>
  );
}
