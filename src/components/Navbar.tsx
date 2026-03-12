import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';
import { LogIn, LogOut, Plus, Search, Layout as LayoutIcon } from 'lucide-react';
import { cn } from '../lib/utils';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white font-bold text-xl">
            K
          </div>
          <span className="text-xl font-bold tracking-tight text-black">Kwizzy</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="hidden text-sm font-medium text-black/60 transition-colors hover:text-black sm:block"
          >
            Discover
          </Link>
          {user ? (
            <>
              <Link
                to="/create"
                className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                <span>Create</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/5"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
