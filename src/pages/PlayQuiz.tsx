import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, doc, getDoc, updateDoc, deleteDoc } from '../firebase';
import { Quiz } from '../types';
import { WordleGame } from '../components/WordleGame';
import { ListGame } from '../components/ListGame';
import { MapGame } from '../components/MapGame';
import { useAuth } from '../AuthContext';
import { Trophy, Share2, ArrowLeft, RefreshCcw, Trash2, Globe, Lock, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const PlayQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [score, setScore] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const isCreator = user && quiz && user.uid === quiz.creatorUid;

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'published_quizzes', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Quiz;
          setQuiz({ id: docSnap.id, ...data });
          // Increment play count
          await updateDoc(docRef, {
            playCount: (data.playCount || 0) + 1
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

  const toggleVisibility = async () => {
    if (!quiz || !isCreator) return;
    const newVisibility = !quiz.isPublic;
    try {
      await updateDoc(doc(db, 'published_quizzes', quiz.id), { isPublic: newVisibility });
      setQuiz({ ...quiz, isPublic: newVisibility });
    } catch (error) {
      console.error('Failed to update visibility', error);
    }
  };

  const handleDelete = async () => {
    if (!quiz || !isCreator) return;
    if (!confirm('Are you sure you want to delete this quiz permanently?')) return;
    
    try {
      await deleteDoc(doc(db, 'published_quizzes', quiz.id));
      navigate('/');
    } catch (error) {
      console.error('Failed to delete quiz', error);
    }
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
        <div className="flex gap-2">
          {isCreator && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                showSettings ? "border-black bg-black text-white" : "border-black/10 hover:bg-black/5"
              )}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
          )}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSettings && isCreator && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-8 overflow-hidden rounded-3xl border border-black/5 bg-black/5 p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleVisibility}
                  className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm transition-all hover:scale-105"
                >
                  {quiz.isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  <span>{quiz.isPublic ? "Make Private" : "Make Public"}</span>
                </button>
                <p className="text-xs text-black/40">
                  {quiz.isPublic ? "Public: Visible on home page" : "Private: Only accessible via link"}
                </p>
              </div>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Quiz</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              {quiz.templateType === 'map' && quiz.config.map && (
                <MapGame mapType={quiz.config.map.mapType} locations={quiz.config.map.locations} onComplete={handleWin} />
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
