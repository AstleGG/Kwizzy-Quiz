/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { CreateQuiz } from './pages/CreateQuiz';
import { PlayQuiz } from './pages/PlayQuiz';
import { ProfileSetup } from './pages/ProfileSetup';
import { useAuth } from './AuthContext';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFDFD]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-black selection:bg-black selection:text-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/setup" 
            element={user ? <ProfileSetup /> : <Navigate to="/" />} 
          />
          <Route 
            path="/create" 
            element={user?.isProfileComplete ? <CreateQuiz /> : <Navigate to={user ? "/setup" : "/"} />} 
          />
          <Route path="/play/:id" element={<PlayQuiz />} />
          <Route 
            path="*" 
            element={user && !user.isProfileComplete ? <Navigate to="/setup" /> : <Navigate to="/" />} 
          />
        </Routes>
      </main>
      <footer className="border-t border-black/5 py-12 text-center text-sm text-black/40">
        <p>&copy; {new Date().getFullYear()} Kwizzy. Built for quiz lovers.</p>
      </footer>
    </div>
  );
}
