'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/gameStore';

export default function ConnectScreen() {
  const {
    isHosting = false,
    roomCode = '',
    connectionStatus = 'disconnected',
    setGameState,
  } = useGameStore();

  const [joinCode, setJoinCode] = useState('');
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (connectionStatus === 'connecting' || isHosting) {
      const interval = setInterval(() => {
        setDots((d) => (d.length >= 3 ? '' : d + '.'));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [connectionStatus, isHosting]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGameState('vsMenu');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setGameState]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a14] z-50 font-mono">
      <h2
        className="text-2xl font-bold tracking-[0.3em] text-[#00e5ff] mb-10"
        style={{ textShadow: '0 0 15px #00e5ff66' }}
      >
        {isHosting ? 'HOSTING' : 'JOIN GAME'}
      </h2>

      {isHosting ? (
        <div className="flex flex-col items-center">
          <div className="text-[#ffffff66] text-xs tracking-widest mb-4">
            ROOM CODE
          </div>
          <div
            className="text-5xl font-bold tracking-[0.5em] text-[#00e5ff] px-8 py-4 border border-[#00e5ff44] bg-[#00e5ff0a] mb-8"
            style={{ textShadow: '0 0 20px #00e5ff44' }}
          >
            {roomCode || '------'}
          </div>
          <div className="text-[#00e5ff88] text-sm tracking-widest">
            Waiting for players{dots}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center w-80">
          <div className="text-[#ffffff66] text-xs tracking-widest mb-4">
            ENTER ROOM CODE
          </div>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
            maxLength={6}
            placeholder="------"
            className="w-full text-center text-3xl font-bold tracking-[0.4em] text-[#00e5ff] px-6 py-4 border border-[#00e5ff44] bg-[#0d0d1a] outline-none focus:border-[#00e5ff] focus:shadow-[0_0_15px_#00e5ff22] transition-all duration-200 placeholder-[#ffffff22] mb-6"
          />
          <button
            onClick={() => {
              if (joinCode.length === 6) {
                // Attempt connection
              }
            }}
            disabled={joinCode.length < 6}
            className={`w-full py-3 border tracking-[0.2em] text-sm font-bold transition-all duration-200 ${
              joinCode.length >= 6
                ? 'border-[#00e5ff66] text-[#00e5ff] hover:bg-[#00e5ff22] hover:border-[#00e5ff]'
                : 'border-[#333] text-[#333] cursor-not-allowed'
            }`}
          >
            CONNECT
          </button>
        </div>
      )}

      {/* Status Messages */}
      <div className="mt-8 w-80 text-center">
        {connectionStatus === 'connecting' && (
          <div className="text-[#ffaa00] text-xs tracking-widest">
            CONNECTING{dots}
          </div>
        )}
        {connectionStatus === 'connected' && (
          <div className="text-[#00ff88] text-xs tracking-widest">
            CONNECTION ESTABLISHED
          </div>
        )}
        {connectionStatus === 'error' && (
          <div className="text-[#ff3333] text-xs tracking-widest">
            CONNECTION FAILED — RETRY
          </div>
        )}
      </div>

      <button
        onClick={() => setGameState('vsMenu')}
        className="absolute bottom-8 text-[#ffffff44] text-sm tracking-widest hover:text-[#00e5ff] transition-colors"
      >
        &#9664; BACK
      </button>
    </div>
  );
}
