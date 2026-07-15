'use client';
import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

declare global {
  interface Window {
    _appliedSensitivity: number;
    _normalFOV: number;
  }
}

function applySettings(settings: { sensitivity: number; fov: number }) {
  if (typeof window === 'undefined') return;
  window._appliedSensitivity = settings.sensitivity;
  window._normalFOV = settings.fov;
}

export function useSettings() {
  const settings = useGameStore((s) => s.settings);

  useEffect(() => {
    const stored = localStorage.getItem('cyber_abyss_settings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        useGameStore.getState().updateSettings(parsed);
        applySettings(parsed);
      } catch {
        applySettings(settings);
      }
    } else {
      applySettings(settings);
    }
  }, []);

  useEffect(() => {
    applySettings(settings);
  }, [settings.sensitivity, settings.fov]);
}
