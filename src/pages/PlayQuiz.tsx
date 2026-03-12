import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, doc, getDoc, updateDoc } from '../firebase';
import { Quiz } from '../types';
import { WordleGame } from '../components/WordleGame';
import { ListGame } from '../components/ListGame';
import { Trophy, Share2, ArrowLeft, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PlayQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'published_quizzes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuiz({ id: docSnap.id, ...docSnap.data() } as Quiz);
          // Increment play count
          await updateDoc(docRef, {
            playCount: (docSnap.data().playCount || 0) + 1
          });
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching quiz', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, navigate]);

  const handleWin = (finalScore?: number) => {
    setGameState('won');
    if (finalScore !== undefined) setScore(finalScore);
  };

  const handleLoss = () => {
    setGameState('lost');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent" />
      </div>
    );
  }

  if (!quiz) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium text-black/60 transition-colors hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Discover</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>

      <div className="mb-12 text-center">
        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-black/40">
          {quiz.templateType}
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-black">{quiz.title}</h1>
        <p className="mt-2 text-black/60">by {quiz.creatorName}</p>
      </div>

      <div className="relative rounded-3xl border border-black/5 bg-white p-8 shadow-xl">
        <AnimatePresence mode="wait">
          {gameState === 'playing' ? (
            <motion.div
              key="playing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              {quiz.templateType === 'wordle' && quiz.config.wordle && (
                <WordleGame secretWord={quiz.config.wordle.secretWord} onWin={handleWin} onLoss={handleLoss} />
              )}
              {quiz.templateType === 'list' && quiz.config.list && (
                <ListGame prompt={quiz.config.list.prompt} answers={quiz.config.list.answers} onComplete={handleWin} />
              )}
              {quiz.templateType === 'map' && (
                <div className="py-24 text-center">
                  <p className="text-xl font-bold">Map template coming soon!</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-12 text-center"
            >
              <div className="mb-6 rounded-full bg-black p-6 text-white">
                <Trophy className="h-12 w-12" />
              </div>
              <h2 className="text-4xl font-bold text-black">
                {gameState === 'won' ? "You Won!" : "Game Over"}
              </h2>
              <p className="mt-4 text-xl text-black/60">
                {gameState === 'won' 
                  ? `Great job! You completed the quiz.` 
                  : `Better luck next time!`}
              </p>
              {score > 0 && (
                <div className="mt-8 text-6xl font-black text-black">{score}%</div>
              )}
              <div className="mt-12 flex gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 rounded-full bg-black px-8 py-4 font-bold text-white transition-all hover:scale-105 active:scale-95"
                >
                  <RefreshCcw className="h-5 w-5" />
                  <span>Play Again</span>
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="rounded-full border border-black/10 px-8 py-4 font-bold transition-colors hover:bg-black/5"
                >
                  Discover More
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
