import React, { useEffect, useState } from 'react';
import { db, collection, query, orderBy, onSnapshot } from '../firebase';
import { Quiz } from '../types';
import { Link } from 'react-router-dom';
import { Play, User, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'published_quizzes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const quizData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Quiz[];
      setQuizzes(quizData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-black sm:text-5xl">
          Discover Quizzes
        </h1>
        <p className="mt-4 text-lg text-black/60">
          Play community-created quizzes or create your own.
        </p>
      </header>

      {quizzes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/5 py-24 text-center">
          <TrendingUp className="mb-4 h-12 w-12 text-black/20" />
          <h3 className="text-xl font-semibold text-black">No quizzes yet</h3>
          <p className="mt-2 text-black/60">Be the first to create a quiz!</p>
          <Link
            to="/create"
            className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Create a Quiz
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/play/${quiz.id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white p-6 transition-all hover:border-black/10 hover:shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-medium text-black/60 uppercase tracking-wider">
                    {quiz.templateType}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-black/40">
                    <Play className="h-3 w-3" />
                    <span>{quiz.playCount || 0} plays</span>
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-black group-hover:text-black/80">
                  {quiz.title}
                </h3>
                <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-4">
                  <div className="flex items-center gap-2 text-sm text-black/60">
                    <User className="h-4 w-4" />
                    <span>{quiz.creatorName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-black/40">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(quiz.createdAt?.toDate()).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
