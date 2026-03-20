import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, AtSign, FileText, Check } from 'lucide-react';
import { cn } from '../lib/utils';

const DEFAULT_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Milo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
];

export const ProfileSetup: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || DEFAULT_AVATARS[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;
    
    setLoading(true);
    try {
      await updateProfile({
        username: username.startsWith('@') ? username : `@${username}`,
        description,
        photoURL,
        isProfileComplete: true,
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-black/5 bg-white p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold tracking-tight text-black">Complete your profile</h1>
        <p className="mt-2 text-black/60">Tell us a bit about yourself before you start creating.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <div className="space-y-4">
            <label className="text-sm font-semibold uppercase tracking-wider text-black/40">Choose an Avatar</label>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
              {DEFAULT_AVATARS.map((url) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setPhotoURL(url)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-2xl border-2 transition-all hover:scale-105",
                    photoURL === url ? "border-black" : "border-transparent"
                  )}
                >
                  <img src={url} alt="Avatar" className="h-full w-full object-cover" />
                  {photoURL === url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-black/40">
              <AtSign className="h-4 w-4" />
              <span>Username</span>
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourname"
              className="w-full rounded-2xl border border-black/10 bg-white px-6 py-4 text-xl font-bold focus:border-black focus:outline-none"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-black/40">
              <FileText className="h-4 w-4" />
              <span>Bio</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about yourself..."
              className="h-32 w-full rounded-2xl border border-black/10 bg-white px-6 py-4 text-lg focus:border-black focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !username}
            className="w-full rounded-full bg-black py-4 text-lg font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Start Kwizzing"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
