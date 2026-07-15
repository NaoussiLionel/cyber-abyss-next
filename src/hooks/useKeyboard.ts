'use client';
import { useEffect, useRef } from 'react';

interface KeyboardState {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  shift: boolean;
  space: boolean;
  e: boolean;
  enter: boolean;
  escape: boolean;
  arrowUp: boolean;
  arrowDown: boolean;
}

const GAME_KEYS = new Set([
  'Space',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'KeyE',
]);

export function useKeyboard() {
  const keys = useRef<KeyboardState>({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
    space: false,
    e: false,
    enter: false,
    escape: false,
    arrowUp: false,
    arrowDown: false,
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (GAME_KEYS.has(e.code)) {
        e.preventDefault();
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.w = true;
          if (e.code === 'ArrowUp') keys.current.arrowUp = true;
          break;
        case 'KeyA':
          keys.current.a = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.s = true;
          if (e.code === 'ArrowDown') keys.current.arrowDown = true;
          break;
        case 'KeyD':
          keys.current.d = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.shift = true;
          break;
        case 'Space':
          keys.current.space = true;
          break;
        case 'KeyE':
          keys.current.e = true;
          break;
        case 'Enter':
          keys.current.enter = true;
          break;
        case 'Escape':
          keys.current.escape = true;
          break;
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.w = false;
          if (e.code === 'ArrowUp') keys.current.arrowUp = false;
          break;
        case 'KeyA':
          keys.current.a = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.s = false;
          if (e.code === 'ArrowDown') keys.current.arrowDown = false;
          break;
        case 'KeyD':
          keys.current.d = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.shift = false;
          break;
        case 'Space':
          keys.current.space = false;
          break;
        case 'KeyE':
          keys.current.e = false;
          break;
        case 'Enter':
          keys.current.enter = false;
          break;
        case 'Escape':
          keys.current.escape = false;
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
}
