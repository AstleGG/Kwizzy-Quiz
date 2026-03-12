/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { CreateQuiz } from './pages/CreateQuiz';
import { PlayQuiz } from './pages/PlayQuiz';

export default function App() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-black selection:bg-black selection:text-white">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/play/:id" element={<PlayQuiz />} />
        </Routes>
      </main>
      <footer className="border-t border-black/5 py-12 text-center text-sm text-black/40">
        <p>&copy; {new Date().getFullYear()} Kwizzy. Built for quiz lovers.</p>
      </footer>
    </div>
  );
}
