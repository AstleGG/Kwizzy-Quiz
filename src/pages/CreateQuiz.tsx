import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { db, addDoc, collection, serverTimestamp } from '../firebase';
import { QuizTemplate, QuizConfig } from '../types';
import { MapEditor } from '../components/MapEditor';
import { Layout, MapPin, List, Grid3X3, ArrowRight, Save, CheckCircle2, Globe, Lock } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const CreateQuiz: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState<QuizTemplate | null>(null);
  const [config, setConfig] = useState<QuizConfig>({});
  const [isPublic, setIsPublic] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!user || !template || !title) return;

    setIsPublishing(true);
    try {
      const quizData = {
        title,
        creatorName: user.displayName,
        creatorUid: user.uid,
        templateType: template,
        config,
        createdAt: serverTimestamp(),
        playCount: 0,
        isPublic,
      };

      await addDoc(collection(db, 'published_quizzes'), quizData);
      navigate('/');
    } catch (error) {
      console.error('Failed to publish quiz', error);
      setIsPublishing(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold">Please login to create a quiz</h2>
        <p className="mt-2 text-black/60">You need an account to save and share your creations.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-12">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  step >= s ? "bg-black text-white" : "bg-black/5 text-black/40"
                )}
              >
                {s}
              </div>
              {s < 3 && <div className="h-0.5 w-8 bg-black/5" />}
            </div>
          ))}
        </div>
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-black">
          {step === 1 && "Choose a template"}
          {step === 2 && "Configure your quiz"}
          {step === 3 && "Review & Publish"}
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid gap-4 sm:grid-cols-3"
          >
            <TemplateCard
              icon={<Grid3X3 className="h-8 w-8" />}
              title="Wordle-style"
              description="Guess a secret word in 6 tries."
              selected={template === 'wordle'}
              onClick={() => {
                setTemplate('wordle');
                setStep(2);
              }}
            />
            <TemplateCard
              icon={<MapPin className="h-8 w-8" />}
              title="Map Guesser"
              description="Identify locations on a map."
              selected={template === 'map'}
              onClick={() => {
                setTemplate('map');
                setStep(2);
              }}
            />
            <TemplateCard
              icon={<List className="h-8 w-8" />}
              title="Classic List"
              description="List all items in a category."
              selected={template === 'list'}
              onClick={() => {
                setTemplate('list');
                setStep(2);
              }}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <label className="text-sm font-semibold uppercase tracking-wider text-black/40">Quiz Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., European Capitals"
                className="w-full rounded-2xl border border-black/10 bg-white px-6 py-4 text-xl font-bold focus:border-black focus:outline-none"
              />
            </div>

            {template === 'wordle' && (
              <div className="space-y-4">
                <label className="text-sm font-semibold uppercase tracking-wider text-black/40">Secret Word</label>
                <input
                  type="text"
                  maxLength={5}
                  placeholder="5 letters"
                  className="w-full rounded-2xl border border-black/10 bg-white px-6 py-4 text-xl font-bold uppercase focus:border-black focus:outline-none"
                  onChange={(e) => setConfig({ wordle: { secretWord: e.target.value.toUpperCase() } })}
                />
              </div>
            )}

            {template === 'list' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-semibold uppercase tracking-wider text-black/40">Prompt</label>
                  <input
                    type="text"
                    placeholder="e.g., Name all 50 US States"
                    className="w-full rounded-2xl border border-black/10 bg-white px-6 py-4 text-lg focus:border-black focus:outline-none"
                    onChange={(e) => setConfig({ ...config, list: { ...config.list!, prompt: e.target.value, answers: config.list?.answers || [] } })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-semibold uppercase tracking-wider text-black/40">Answers (Comma separated)</label>
                  <textarea
                    placeholder="Alabama, Alaska, Arizona..."
                    className="h-32 w-full rounded-2xl border border-black/10 bg-white px-6 py-4 text-lg focus:border-black focus:outline-none"
                    onChange={(e) => setConfig({ ...config, list: { ...config.list!, answers: e.target.value.split(',').map(s => s.trim()).filter(Boolean), prompt: config.list?.prompt || '' } })}
                  />
                </div>
              </div>
            )}

            {template === 'map' && (
              <MapEditor onUpdate={(mapConfig) => setConfig({ ...config, map: mapConfig })} />
            )}

            <div className="flex justify-between pt-8">
              <button
                onClick={() => setStep(1)}
                className="rounded-full border border-black/10 px-8 py-3 font-medium transition-colors hover:bg-black/5"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!title || (template === 'wordle' && !config.wordle?.secretWord) || (template === 'list' && (!config.list?.prompt || config.list.answers.length === 0)) || (template === 'map' && (!config.map?.locations || config.map.locations.length === 0))}
                className="flex items-center gap-2 rounded-full bg-black px-8 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-black/40">
                  {template}
                </span>
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold text-black">{title}</h2>
              <div className="mt-8 grid gap-4 text-sm text-black/60">
                <div className="flex justify-between border-b border-black/5 pb-2">
                  <span>Creator</span>
                  <span className="font-medium text-black">{user.displayName}</span>
                </div>
                {template === 'wordle' && (
                  <div className="flex justify-between border-b border-black/5 pb-2">
                    <span>Secret Word</span>
                    <span className="font-mono font-bold text-black">{config.wordle?.secretWord}</span>
                  </div>
                )}
                {template === 'list' && (
                  <div className="flex justify-between border-b border-black/5 pb-2">
                    <span>Answers</span>
                    <span className="font-bold text-black">{config.list?.answers.length} items</span>
                  </div>
                )}
                {template === 'map' && (
                  <div className="flex justify-between border-b border-black/5 pb-2">
                    <span>Locations</span>
                    <span className="font-bold text-black">{config.map?.locations.length} points</span>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-4">
                <label className="text-sm font-semibold uppercase tracking-wider text-black/40">Visibility</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsPublic(true)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 py-4 font-bold transition-all",
                      isPublic ? "border-black bg-black text-white" : "border-black/5 bg-white hover:border-black/20"
                    )}
                  >
                    <Globe className="h-5 w-5" />
                    <span>Public</span>
                  </button>
                  <button
                    onClick={() => setIsPublic(false)}
                    className={cn(
                      "flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 py-4 font-bold transition-all",
                      !isPublic ? "border-black bg-black text-white" : "border-black/5 bg-white hover:border-black/20"
                    )}
                  >
                    <Lock className="h-5 w-5" />
                    <span>Private</span>
                  </button>
                </div>
                <p className="text-center text-xs text-black/40">
                  {isPublic 
                    ? "Everyone can discover this quiz on the home page." 
                    : "Only people with the link can access this quiz."}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="rounded-full border border-black/10 px-8 py-3 font-medium transition-colors hover:bg-black/5"
              >
                Back
              </button>
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex items-center gap-2 rounded-full bg-black px-12 py-4 text-lg font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isPublishing ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Publish Quiz</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface TemplateCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ icon, title, description, selected, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center rounded-3xl border-2 p-8 text-center transition-all hover:scale-105",
      selected
        ? "border-black bg-black text-white shadow-xl"
        : "border-black/5 bg-white text-black hover:border-black/20"
    )}
  >
    <div className={cn("mb-4 rounded-2xl p-4", selected ? "bg-white/10" : "bg-black/5")}>
      {icon}
    </div>
    <h3 className="text-lg font-bold">{title}</h3>
    <p className={cn("mt-2 text-sm", selected ? "text-white/60" : "text-black/40")}>
      {description}
    </p>
  </button>
);
