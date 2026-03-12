import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

interface WordleGameProps {
  secretWord: string;
  onWin: () => void;
  onLoss: () => void;
}

export const WordleGame: React.FC<WordleGameProps> = ({ secretWord, onWin, onLoss }) => {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameOver) return;

    if (e.key === 'Enter') {
      if (currentGuess.length === secretWord.length) {
        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        setCurrentGuess('');

        if (currentGuess === secretWord) {
          setGameOver(true);
          setTimeout(onWin, 1500);
        } else if (newGuesses.length >= 6) {
          setGameOver(true);
          setTimeout(onLoss, 1500);
        }
      }
    } else if (e.key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (e.key.length === 1 && e.key.match(/[a-z]/i) && currentGuess.length < secretWord.length) {
      setCurrentGuess(prev => (prev + e.key).toUpperCase());
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentGuess, guesses, gameOver]);

  const getLetterClass = (letter: string, index: number, guess: string) => {
    if (letter === secretWord[index]) return 'bg-emerald-500 text-white border-emerald-500';
    if (secretWord.includes(letter)) return 'bg-amber-500 text-white border-amber-500';
    return 'bg-black/40 text-white border-black/40';
  };

  return (
    <div className="flex flex-col items-center gap-2 py-8">
      {[...Array(6)].map((_, i) => {
        const guess = guesses[i] || (i === guesses.length ? currentGuess : '');
        const isSubmitted = i < guesses.length;

        return (
          <div key={i} className="flex gap-2">
            {[...Array(secretWord.length)].map((_, j) => {
              const letter = guess[j] || '';
              return (
                <div
                  key={j}
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-xl border-2 text-2xl font-black transition-all duration-500",
                    isSubmitted 
                      ? getLetterClass(letter, j, guess)
                      : letter 
                        ? "border-black/20 scale-105" 
                        : "border-black/5"
                  )}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
      
      <div className="mt-8 text-sm font-medium text-black/40">
        Type to guess, press Enter to submit
      </div>
    </div>
  );
};
