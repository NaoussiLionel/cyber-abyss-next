'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

type GameMode = 'FFA' | '2v2' | '3v1';
type MapName = 'NEON' | 'GRID' | 'CRUCIBLE' | 'ABYSS';
type PlayerStatus = 'EMPTY' | 'WAITING' | 'CONNECTED' | 'READY';

interface Player {
  name: string;
  status: PlayerStatus;
  color: string;
}

const TEAM_A_COLORS = ['#00e5ff', '#00ff88'];
const TEAM_B_COLORS = ['#ff00ff', '#ffaa00'];

export default function Lobby() {
  const {
    isHost = false,
    gameMode = 'FFA',
    selectedMap = 'NEON',
    setGameState,
    updateSettings,
  } = useGameStore();

  const [teamA, setTeamA] = useState<Player[]>([
    { name: 'PLAYER 1', status: 'READY', color: TEAM_A_COLORS[0] },
    { name: '', status: 'EMPTY', color: TEAM_A_COLORS[1] },
  ]);
  const [teamB, setTeamB] = useState<Player[]>([
    { name: '', status: 'EMPTY', color: TEAM_B_COLORS[0] },
    { name: '', status: 'EMPTY', color: TEAM_B_COLORS[1] },
  ]);

  const allReady = [...teamA, ...teamB]
    .filter((p) => p.status !== 'EMPTY')
    .every((p) => p.status === 'READY');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGameState('vsMenu');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setGameState]);

  return (
    <div className="fixed inset-0 flex flex-col items-center bg-[#0a0a14] z-50 font-mono p-6">
      <h2
        className="text-2xl font-bold tracking-[0.3em] text-[#00e5ff] mb-6"
        style={{ textShadow: '0 0 15px #00e5ff66' }}
      >
        LOBBY
      </h2>

      {/* Game Mode Selector */}
      <div className="flex gap-2 mb-6">
        {(['FFA', '2v2', '3v1'] as GameMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => updateSettings({ gameMode: mode })}
            className={`px-6 py-2 text-xs tracking-[0.2em] border transition-all duration-200 ${
              gameMode === mode
                ? 'bg-[#00e5ff] text-[#0a0a14] border-[#00e5ff]'
                : 'text-[#00e5ff88] border-[#00e5ff44] hover:border-[#00e5ff88]'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Team Columns */}
      <div className="flex gap-8 mb-6 w-full max-w-2xl">
        {/* Team A */}
        <div className="flex-1">
          <div className="text-[#00e5ff] text-xs tracking-[0.2em] mb-3 text-center border-b border-[#00e5ff22] pb-2">
            TEAM A
          </div>
          <div className="space-y-3">
            {teamA.map((player, i) => (
              <PlayerCard key={i} player={player} />
            ))}
          </div>
        </div>

        {/* Team B */}
        <div className="flex-1">
          <div className="text-[#ff00ff] text-xs tracking-[0.2em] mb-3 text-center border-b border-[#ff00ff22] pb-2">
            TEAM B
          </div>
          <div className="space-y-3">
            {teamB.map((player, i) => (
              <PlayerCard key={i} player={player} />
            ))}
          </div>
        </div>
      </div>

      {/* Map Selector */}
      <div className="mb-6">
        <div className="text-[#ffffff66] text-[10px] tracking-widest mb-2 text-center">MAP</div>
        <div className="flex gap-2">
          {(['NEON', 'GRID', 'CRUCIBLE', 'ABYSS'] as MapName[]).map((map) => (
            <button
              key={map}
              onClick={() => updateSettings({ selectedMap: map })}
              className={`px-4 py-1 text-xs tracking-widest border transition-all duration-200 ${
                selectedMap === map
                  ? 'bg-[#ff00ff] text-[#0a0a14] border-[#ff00ff]'
                  : 'text-[#ff00ff88] border-[#ff00ff44] hover:border-[#ff00ff88]'
              }`}
            >
              {map}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            setTeamA((prev) =>
              prev.map((p) => (p.status !== 'EMPTY' ? { ...p, status: 'READY' as const } : p))
            );
          }}
          className="px-8 py-3 border border-[#00ff8866] text-[#00ff88] tracking-[0.2em] text-sm hover:bg-[#00ff8822] hover:border-[#00ff88] transition-all duration-200"
        >
          READY
        </button>

        {isHost && (
          <button
            disabled={!allReady}
            onClick={() => setGameState('playing')}
            className={`px-8 py-3 border tracking-[0.2em] text-sm transition-all duration-200 ${
              allReady
                ? 'border-[#00e5ff66] text-[#00e5ff] hover:bg-[#00e5ff22] hover:border-[#00e5ff] hover:shadow-[0_0_20px_#00e5ff22]'
                : 'border-[#333] text-[#333] cursor-not-allowed'
            }`}
          >
            START MATCH
          </button>
        )}
      </div>

      <button
        onClick={() => setGameState('vsMenu')}
        className="absolute bottom-6 text-[#ffffff44] text-sm tracking-widest hover:text-[#ff3333] transition-colors"
      >
        LEAVE
      </button>
    </div>
  );
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <div
      className={`p-3 border transition-all duration-200 ${
        player.status === 'EMPTY'
          ? 'border-[#222] bg-[#0d0d1a] opacity-40'
          : player.status === 'READY'
          ? 'border-[#00ff8866] bg-[#00ff8808]'
          : 'border-[#ffffff11] bg-[#0d0d1a]'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: player.status !== 'EMPTY' ? player.color : '#333',
            boxShadow: player.status !== 'EMPTY' ? `0 0 8px ${player.color}66` : 'none',
          }}
        />
        <span
          className={`text-xs tracking-widest ${
            player.status === 'EMPTY' ? 'text-[#333]' : 'text-[#ffffff88]'
          }`}
        >
          {player.name || 'EMPTY SLOT'}
        </span>
      </div>
      <div
        className={`text-[10px] tracking-widest mt-1 ml-6 ${
          player.status === 'READY'
            ? 'text-[#00ff88]'
            : player.status === 'CONNECTED'
            ? 'text-[#ffaa00]'
            : player.status === 'WAITING'
            ? 'text-[#00e5ff88]'
            : 'text-[#333]'
        }`}
      >
        {player.status}
      </div>
    </div>
  );
}
