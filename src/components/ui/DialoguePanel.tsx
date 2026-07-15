'use client';

import { useEffect, useState, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';

export default function DialoguePanel() {
  const {
    dialogueText = 'The Quantum Grid is destabilizing. We need you to reach the core before it collapses.',
    dialogueSpeaker = 'AXIOM-9',
    onDialogueComplete,
  } = useGameStore();

  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayedText('');
    indexRef.current = 0;
    setIsComplete(false);

    const interval = setInterval(() => {
      if (indexRef.current < dialogueText.length) {
        setDisplayedText(dialogueText.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [dialogueText]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!isComplete) {
          setDisplayedText(dialogueText);
          setIsComplete(true);
        } else {
          onDialogueComplete?.();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isComplete, dialogueText, onDialogueComplete]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 font-mono">
      <div className="mx-auto max-w-3xl mb-8">
        <div
          className="relative bg-[#0a0a14ee] border border-[#00e5ff44] p-6 backdrop-blur-sm"
          style={{ boxShadow: '0 0 20px #00e5ff11' }}
        >
          <div className="text-[#00e5ff] text-sm font-bold tracking-[0.2em] mb-2">
            {dialogueSpeaker}:
          </div>
          <div className="text-[#ffffffcc] text-sm leading-relaxed min-h-[3rem]">
            {displayedText}
            {!isComplete && (
              <span className="inline-block w-2 h-4 bg-[#00e5ff] ml-1 animate-pulse" />
            )}
          </div>

          <div className="absolute bottom-2 right-4 text-[#ffffff33] text-[10px] tracking-widest">
            {isComplete ? 'PRESS ENTER TO CONTINUE' : 'PRESS ENTER TO SKIP'}
          </div>
        </div>
      </div>
    </div>
  );
}
