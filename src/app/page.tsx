'use client';

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from '@/stores/gameStore';
import { GAME_STATES } from '@/types/game';

import Scene from '@/components/game/Scene';
import GameLoop from '@/components/game/GameLoop';
import CameraController from '@/components/game/CameraController';

import SplashScreen from '@/components/ui/SplashScreen';
import MainMenu from '@/components/ui/MainMenu';
import MissionSelect from '@/components/ui/MissionSelect';
import DialoguePanel from '@/components/ui/DialoguePanel';
import TutorialOverlay from '@/components/ui/TutorialOverlay';
import TransitionScreen from '@/components/ui/TransitionScreen';
import GameOverScreen from '@/components/ui/GameOverScreen';
import VictoryScreen from '@/components/ui/VictoryScreen';
import OptionsScreen from '@/components/ui/OptionsScreen';
import HelpScreen from '@/components/ui/HelpScreen';
import VsMenu from '@/components/ui/VsMenu';
import ConnectScreen from '@/components/ui/ConnectScreen';
import Lobby from '@/components/ui/Lobby';
import HUD from '@/components/ui/HUD';
import PausedOverlay from '@/components/ui/PausedOverlay';
import ExitConfirmDialog from '@/components/ui/ExitConfirmDialog';

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#00e5ff" />
    </mesh>
  );
}

export default function GamePage() {
  const gameState = useGameStore((s) => s.gameState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-[#0a0a14]">
        <div className="text-[#00e5ff] text-2xl tracking-[6px] animate-pulse">
          LOADING...
        </div>
      </div>
    );
  }

  const showCanvas =
    gameState === GAME_STATES.PLAYING ||
    gameState === GAME_STATES.VS_PLAYING ||
    gameState === GAME_STATES.DIALOGUE ||
    gameState === GAME_STATES.PAUSED;

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[#0a0a14]">
      {/* 3D Canvas */}
      {showCanvas && (
        <Canvas
          shadows
          camera={{ fov: 75, near: 0.1, far: 300, position: [1.2, 1.5, 4.0] }}
          className="absolute inset-0 z-0"
          gl={{ antialias: true }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <Scene />
            <GameLoop />
            <CameraController />
          </Suspense>
        </Canvas>
      )}

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="pointer-events-auto w-full h-full">
          {gameState === GAME_STATES.SPLASH && <SplashScreen />}
          {gameState === GAME_STATES.MENU && <MainMenu />}
          {gameState === GAME_STATES.MISSION_SELECT && <MissionSelect />}
          {gameState === GAME_STATES.OPTIONS && <OptionsScreen />}
          {gameState === GAME_STATES.HELP && <HelpScreen />}
          {gameState === GAME_STATES.VS_MENU && <VsMenu />}
          {gameState === GAME_STATES.CONNECT && <ConnectScreen />}
          {gameState === GAME_STATES.LOBBY && <Lobby />}
          {gameState === GAME_STATES.DIALOGUE && <DialoguePanel />}
          {gameState === GAME_STATES.PLAYING && <HUD />}
          {gameState === GAME_STATES.VS_PLAYING && <HUD />}
          {gameState === GAME_STATES.TRANSITION && <TransitionScreen />}
          {gameState === GAME_STATES.GAMEOVER && <GameOverScreen />}
          {gameState === GAME_STATES.VICTORY && <VictoryScreen />}
          {gameState === GAME_STATES.PAUSED && <PausedOverlay />}
          {gameState === GAME_STATES.EXIT_CONFIRM && <ExitConfirmDialog />}
        </div>
      </div>
    </div>
  );
}
