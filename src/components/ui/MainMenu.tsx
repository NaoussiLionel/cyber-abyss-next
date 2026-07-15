'use client';

import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';

const MENU_ITEMS = [
  { label: 'ARCADE', action: 'missionSelect' as const },
  { label: 'VS PLAYER', action: 'vsMenu' as const },
  { label: 'OPTIONS', action: 'options' as const },
  { label: 'HELP', action: 'help' as const },
  { label: 'EXIT', action: 'exitConfirm' as const },
];

export default function MainMenu() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [glowIndex, setGlowIndex] = useState<number | null>(null);
  const setGameState = useGameStore((s) => s.setGameState);

  const handleSelect = useCallback(
    (index: number) => {
      setGameState(MENU_ITEMS[index].action);
    },
    [setGameState]
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSelectedIndex((i) => (i - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex((i) => (i + 1) % MENU_ITEMS.length);
      } else if (e.key === 'Enter') {
        handleSelect(selectedIndex);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedIndex, handleSelect]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a14] z-50">
      <h1
        className="text-5xl md:text-7xl font-bold tracking-[0.3em] text-[#00e5ff] mb-16 select-none"
        style={{ textShadow: '0 0 20px #00e5ff, 0 0 40px #0088aa' }}
      >
        CYBER ABYSS
      </h1>

      <div className="flex flex-col gap-3 w-72">
        {MENU_ITEMS.map((item, i) => (
          <button
            key={item.label}
            onClick={() => handleSelect(i)}
            onMouseEnter={() => { setSelectedIndex(i); setGlowIndex(i); }}
            onMouseLeave={() => setGlowIndex(null)}
            className={`
              relative px-8 py-3 text-lg tracking-[0.25em] font-mono font-bold
              border transition-all duration-200
              ${i === selectedIndex
                ? 'text-[#0a0a14] bg-[#00e5ff] border-[#00e5ff] shadow-[0_0_20px_#00e5ff,0_0_40px_#00e5ff44]'
                : 'text-[#00e5ff] bg-transparent border-[#00e5ff44] hover:border-[#00e5ff88]'
              }
              ${glowIndex === i && i !== selectedIndex ? 'border-[#00e5ff88] shadow-[0_0_15px_#00e5ff33]' : ''}
            `}
          >
            {item.label}
            {i === selectedIndex && (
              <span className="absolute left-2 text-[#0a0a14]">&#9654;</span>
            )}
          </button>
        ))}
      </div>

      <div className="absolute bottom-8 text-[#ffffff33] text-xs tracking-widest font-mono">
        &#9650; &#9660; NAVIGATE &nbsp; &#9166; SELECT
      </div>
    </div>
  );
}
