import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ListGameProps {
  prompt: string;
  answers: string[];
  onComplete: (score: number) => void;
}

export const ListGame: React.FC<ListGameProps> = ({ prompt, answers, onComplete }) => {
  const [input, setInput] = useState('');
  const [foundAnswers, setFoundAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  useEffect(() => {
    if (timeLeft > 0 && foundAnswers.length < answers.length) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || foundAnswers.length === answers.length) {
      const score = Math.round((foundAnswers.length / answers.length) * 100);
      onComplete(score);
    }
  }, [timeLeft, foundAnswers, answers, onComplete]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    const normalizedVal = val.trim().toLowerCase();
    const matchIndex = answers.findIndex(a => a.toLowerCase() === normalizedVal);

    if (matchIndex !== -1 && !foundAnswers.includes(answers[matchIndex])) {
      setFoundAnswers([...foundAnswers, answers[matchIndex]]);
      setInput('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 py-4">
      <div className="flex items-center justify-between rounded-2xl bg-black/5 p-6">
        <div className="text-left">
          <p className="text-sm font-bold uppercase tracking-widest text-black/40">Progress</p>
          <p className="text-3xl font-black text-black">
            {foundAnswers.length} <span className="text-black/20">/ {answers.length}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold uppercase tracking-widest text-black/40">Time Left</p>
          <p className={cn("text-3xl font-black", timeLeft < 30 ? "text-red-500 animate-pulse" : "text-black")}>
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={handleInput}
          placeholder="Type an answer..."
          className="w-full rounded-2xl border-2 border-black/5 bg-white px-8 py-6 text-2xl font-bold focus:border-black focus:outline-none"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {answers.map((answer, i) => {
          const isFound = foundAnswers.includes(answer);
          return (
            <div
              key={i}
              className={cn(
                "flex h-12 items-center justify-center rounded-xl border px-4 text-sm font-bold transition-all",
                isFound 
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700" 
                  : "border-black/5 bg-black/5 text-transparent"
              )}
            >
              {isFound ? answer : '???'}
            </div>
          );
        })}
      </div>
    </div>
  );
};
