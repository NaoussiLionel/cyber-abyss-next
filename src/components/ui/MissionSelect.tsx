'use client';

import { useEffect, useState, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { GAME_STATES } from '@/types/game';

const MISSIONS = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  codename: [
    'PHANTOM GRID', 'NEON DESCENT', 'CIRCUIT BREAK', 'VOID WALKER',
    'SIGNAL LOST', 'PIXEL STORM', 'DATASTREAM', 'GHOST PROTOCOL',
    'ZERO DAY', 'FLASHPOINT', 'NEXUS CORE', 'DARK MATTER',
    'QUANTUM LEAP', 'SHADOW NET', 'PULSE WIDTH', 'FREQUENCY',
    'STATIC BURST', 'DECODER RING', 'ROOT ACCESS', 'BACK DOOR',
    'STACK OVERFLOW', 'DEAD PIXEL', 'BLUE SCREEN', 'FIREWALL',
    'MALWARE', 'TROJAN HORSE', 'KERNEL PANIC', 'FINAL FORM',
  ][i],
  difficulty: Math.min(5, Math.floor(i / 5) + 1),
}));

const COLS = 4;
const ROWS = 7;

export default function MissionSelect() {
  const { unlockedMissions = [1], completedMissions = [], setGameState } = useGameStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedMission, setSelectedMission] = useState(MISSIONS[0]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setSelectedIndex((i) => Math.min(i + 1, MISSIONS.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex((i) => Math.min(i + COLS, MISSIONS.length - 1));
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex((i) => Math.max(i - COLS, 0));
      } else if (e.key === 'Enter') {
        const m = MISSIONS[selectedIndex];
        if (unlockedMissions.includes(m.id)) {
          setGameState(GAME_STATES.PLAYING);
        }
      } else if (e.key === 'Escape') {
        setGameState(GAME_STATES.MENU);
      }
    },
    [selectedIndex, unlockedMissions, setGameState]
  );

  useEffect(() => {
    setSelectedMission(MISSIONS[selectedIndex]);
  }, [selectedIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getMissionState = (id: number) => {
    if (completedMissions.includes(id)) return 'completed';
    if (unlockedMissions.includes(id)) return 'unlocked';
    return 'locked';
  };

  return (
    <div className="fixed inset-0 flex bg-[#0a0a14] z-50 font-mono">
      {/* Mission Grid */}
      <div className="flex-1 flex flex-col p-6">
        <h2
          className="text-2xl font-bold tracking-[0.3em] text-[#00e5ff] mb-6"
          style={{ textShadow: '0 0 10px #00e5ff66' }}
        >
          SELECT MISSION
        </h2>

        <div className="grid grid-cols-4 gap-3 max-w-2xl">
          {MISSIONS.map((mission, i) => {
            const state = getMissionState(mission.id);
            const isSelected = i === selectedIndex;

            return (
              <button
                key={mission.id}
                onClick={() => setSelectedIndex(i)}
                onDoubleClick={() => {
                  if (state !== 'locked') setGameState(GAME_STATES.PLAYING);
                }}
                disabled={state === 'locked'}
                className={`
                  relative p-3 border text-left transition-all duration-200
                  ${state === 'locked' ? 'opacity-30 cursor-not-allowed border-[#333] bg-[#0d0d1a]' : ''}
                  ${state === 'unlocked' && !isSelected ? 'border-[#00e5ff44] bg-[#0d0d1a] hover:border-[#00e5ff88]' : ''}
                  ${state === 'completed' ? 'border-[#00ff88] bg-[#0d0d1a]' : ''}
                  ${isSelected ? 'border-[#00e5ff] shadow-[0_0_15px_#00e5ff44] bg-[#0d0d1a]' : ''}
                `}
              >
                <div className="text-[#00e5ff66] text-[10px] tracking-widest">
                  {String(mission.id).padStart(2, '0')}
                </div>
                <div className={`text-xs mt-1 ${isSelected ? 'text-[#00e5ff]' : 'text-[#ffffff88]'}`}>
                  {mission.codename}
                </div>
                <div className="text-[#ffaa00] text-[10px] mt-1 tracking-wider">
                  {'★'.repeat(mission.difficulty)}{'☆'.repeat(5 - mission.difficulty)}
                </div>
                {state === 'completed' && (
                  <div className="absolute top-1 right-1 text-[#00ff88] text-xs">✓</div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setGameState(GAME_STATES.MENU)}
          className="mt-6 text-[#ffffff44] text-sm tracking-widest hover:text-[#00e5ff] transition-colors"
        >
          &#9664; BACK
        </button>
      </div>

      {/* Mission Detail Panel */}
      <div className="w-80 border-l border-[#00e5ff22] p-6 bg-[#0d0d1a]">
        <div className="text-[#00e5ff66] text-[10px] tracking-widest mb-2">
          MISSION {String(selectedMission.id).padStart(2, '0')}
        </div>
        <h3 className="text-lg font-bold tracking-[0.2em] text-[#00e5ff]">
          {selectedMission.codename}
        </h3>
        <div className="text-[#ffaa00] text-sm mt-2 tracking-wider">
          {'★'.repeat(selectedMission.difficulty)}{'☆'.repeat(5 - selectedMission.difficulty)}
        </div>
        <div className="mt-4 text-[#ffffff66] text-xs leading-relaxed">
          Infiltrate the {selectedMission.codename.toLowerCase()} sector and neutralize all hostile
          constructs. Eliminate the core node to secure the area.
        </div>
        <div className="mt-6 text-[#ffffff33] text-[10px] tracking-widest">
          {getMissionState(selectedMission.id) === 'completed'
            ? '✓ COMPLETED'
            : getMissionState(selectedMission.id) === 'locked'
            ? '🔒 LOCKED'
            : '▶ READY'}
        </div>
      </div>
    </div>
  );
}
