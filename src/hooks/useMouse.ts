'use client';
import { useEffect, useRef, useCallback } from 'react';

interface MouseState {
  movementX: number;
  movementY: number;
  leftButton: boolean;
  rightButton: boolean;
  accumulatedX: number;
  accumulatedY: number;
}

export function useMouse() {
  const mouse = useRef<MouseState>({
    movementX: 0,
    movementY: 0,
    leftButton: false,
    rightButton: false,
    accumulatedX: 0,
    accumulatedY: 0,
  });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (document.pointerLockElement) {
        mouse.current.movementX = e.movementX;
        mouse.current.movementY = e.movementY;
        mouse.current.accumulatedX += e.movementX;
        mouse.current.accumulatedY += e.movementY;
      } else {
        mouse.current.movementX = 0;
        mouse.current.movementY = 0;
      }
    }

    function handleMouseDown(e: MouseEvent) {
      if (e.button === 0) mouse.current.leftButton = true;
      if (e.button === 2) mouse.current.rightButton = true;
    }

    function handleMouseUp(e: MouseEvent) {
      if (e.button === 0) mouse.current.leftButton = false;
      if (e.button === 2) mouse.current.rightButton = false;
    }

    function handleContextMenu(e: MouseEvent) {
      e.preventDefault();
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const requestLock = useCallback((element?: HTMLElement) => {
    const target = element || document.body;
    target.requestPointerLock();
  }, []);

  const exitLock = useCallback(() => {
    document.exitPointerLock();
  }, []);

  const resetAccumulated = useCallback(() => {
    mouse.current.accumulatedX = 0;
    mouse.current.accumulatedY = 0;
  }, []);

  return {
    mouse,
    requestLock,
    exitLock,
    resetAccumulated,
  };
}
