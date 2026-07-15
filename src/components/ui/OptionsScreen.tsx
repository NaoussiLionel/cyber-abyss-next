'use client';

import { useState, useCallback } from 'react';
import { useGameStore } from '@/stores/gameStore';

type CrosshairStyle = 'DOT' | 'CROSS' | 'CIRCLE';
type GraphicsQuality = 'LOW' | 'MED' | 'HIGH';

export default function OptionsScreen() {
  const {
    mouseSensitivity = 5,
    crosshairStyle = 'CROSS',
    graphicsQuality = 'HIGH',
    masterVolume = 7,
    fieldOfView = 90,
    setGameState,
    updateSettings,
  } = useGameStore();

  const handleSave = useCallback(
    (key: string, value: number | string) => {
      updateSettings({ [key]: value });
      const saved = JSON.parse(localStorage.getItem('cyberAbyssSettings') || '{}');
      saved[key] = value;
      localStorage.setItem('cyberAbyssSettings', JSON.stringify(saved));
    },
    [updateSettings]
  );

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0a0a14] z-50 font-mono">
      <h2
        className="text-3xl font-bold tracking-[0.3em] text-[#00e5ff] mb-10"
        style={{ textShadow: '0 0 15px #00e5ff66' }}
      >
        OPTIONS
      </h2>

      <div className="w-full max-w-lg space-y-6">
        {/* Mouse Sensitivity */}
        <div className="flex items-center justify-between">
          <label className="text-[#ffffff88] text-sm tracking-widest">MOUSE SENSITIVITY</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={10}
              value={mouseSensitivity}
              onChange={(e) => handleSave('mouseSensitivity', Number(e.target.value))}
              className="w-32 accent-[#00e5ff]"
            />
            <span className="text-[#00e5ff] text-sm w-6 text-right">{mouseSensitivity}</span>
          </div>
        </div>

        {/* Crosshair Style */}
        <div className="flex items-center justify-between">
          <label className="text-[#ffffff88] text-sm tracking-widest">CROSSHAIR STYLE</label>
          <div className="flex gap-2">
            {(['DOT', 'CROSS', 'CIRCLE'] as CrosshairStyle[]).map((style) => (
              <button
                key={style}
                onClick={() => handleSave('crosshairStyle', style)}
                className={`
                  px-4 py-1 text-xs tracking-widest border transition-all duration-200
                  ${crosshairStyle === style
                    ? 'bg-[#00e5ff] text-[#0a0a14] border-[#00e5ff]'
                    : 'text-[#00e5ff88] border-[#00e5ff44] hover:border-[#00e5ff88]'
                  }
                `}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Graphics Quality */}
        <div className="flex items-center justify-between">
          <label className="text-[#ffffff88] text-sm tracking-widest">GRAPHICS QUALITY</label>
          <div className="flex gap-2">
            {(['LOW', 'MED', 'HIGH'] as GraphicsQuality[]).map((quality) => (
              <button
                key={quality}
                onClick={() => handleSave('graphicsQuality', quality)}
                className={`
                  px-4 py-1 text-xs tracking-widest border transition-all duration-200
                  ${graphicsQuality === quality
                    ? 'bg-[#00e5ff] text-[#0a0a14] border-[#00e5ff]'
                    : 'text-[#00e5ff88] border-[#00e5ff44] hover:border-[#00e5ff88]'
                  }
                `}
              >
                {quality}
              </button>
            ))}
          </div>
        </div>

        {/* Master Volume */}
        <div className="flex items-center justify-between">
          <label className="text-[#ffffff88] text-sm tracking-widest">MASTER VOLUME</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={10}
              value={masterVolume}
              onChange={(e) => handleSave('masterVolume', Number(e.target.value))}
              className="w-32 accent-[#00e5ff]"
            />
            <span className="text-[#00e5ff] text-sm w-6 text-right">{masterVolume}</span>
          </div>
        </div>

        {/* Field of View */}
        <div className="flex items-center justify-between">
          <label className="text-[#ffffff88] text-sm tracking-widest">FIELD OF VIEW</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={60}
              max={120}
              value={fieldOfView}
              onChange={(e) => handleSave('fieldOfView', Number(e.target.value))}
              className="w-32 accent-[#00e5ff]"
            />
            <span className="text-[#00e5ff] text-sm w-8 text-right">{fieldOfView}°</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => setGameState('mainMenu')}
        className="mt-10 px-8 py-3 border border-[#00e5ff44] text-[#00e5ff] tracking-[0.2em] text-sm hover:bg-[#00e5ff22] hover:border-[#00e5ff88] transition-all duration-200"
      >
        BACK
      </button>
    </div>
  );
}
