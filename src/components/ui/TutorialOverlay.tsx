'use client';

import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { GAME_STATES } from '@/types/game';

const STEPS = [
  { key: 'WASD', instruction: 'Use WASD to move' },
  { key: 'MOUSE', instruction: 'Move mouse to aim' },
  { key: 'LMB', instruction: 'Left click to shoot' },
  { key: 'RMB', instruction: 'Right click to aim down sights' },
  { key: 'E', instruction: 'Press E to activate repulse' },
  { key: 'SHIFT', instruction: 'Hold Shift to sprint' },
  { key: 'ENTER', instruction: 'Hold Enter to skip tutorial' },
];

export default function TutorialOverlay() {
  const [currentStep, setCurrentStep] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const setGameState = useGameStore((s) => s.setGameState);

  const nextStep = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setGameState(GAME_STATES.PLAYING);
    }
  }, [currentStep, setGameState]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setHoldProgress((p) => {
          if (p >= 100) {
            setGameState(GAME_STATES.PLAYING);
            return 0;
          }
          return p + 5;
        });
      } else if (e.key === ' ' || e.key === 'Escape') {
        nextStep();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setHoldProgress(0);
      }
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nextStep, setGameState]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHoldProgress((p) => (p > 0 ? Math.min(p + 2, 100) : 0));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a14cc] z-50 font-mono backdrop-blur-sm">
      <div className="text-[#ffffff33] text-xs tracking-widest mb-2">
        STEP {currentStep + 1} / {STEPS.length}
      </div>

      <div className="w-64 h-1 bg-[#1a1a2e] mb-8 overflow-hidden">
        <div
          className="h-full bg-[#00e5ff] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-[#00e5ff] text-3xl font-bold tracking-[0.3em] mb-4">
        [{step.key}]
      </div>

      <div className="text-[#ffffffcc] text-lg tracking-wider mb-12">
        {step.instruction}
      </div>

      <div className="flex gap-4">
        <button
          onClick={nextStep}
          className="px-6 py-2 border border-[#00e5ff44] text-[#00e5ff] text-sm tracking-widest hover:bg-[#00e5ff22] transition-colors"
        >
          NEXT
        </button>
        <button
          onClick={() => setGameState(GAME_STATES.PLAYING)}
          className="px-6 py-2 text-[#ffffff44] text-sm tracking-widest hover:text-[#ffffff88] transition-colors"
        >
          SKIP ALL
        </button>
      </div>

      <div className="absolute bottom-8 w-48">
        <div className="text-[10px] text-[#ffffff33] tracking-widest mb-1 text-center">
          HOLD ENTER TO SKIP TUTORIAL
        </div>
        <div className="h-1 bg-[#1a1a2e] overflow-hidden">
          <div
            className="h-full bg-[#ff00ff] transition-all duration-100"
            style={{ width: `${holdProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
