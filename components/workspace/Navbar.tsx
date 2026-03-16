'use client';

import { useState } from 'react';
import { Menu, User } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function Navbar({ 
  onOpenHistory, 
  onOpenLogin,
  userData
}: { 
  onOpenHistory: () => void;
  onOpenLogin: () => void;
  userData?: any;
}) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-40 glass border-b border-white/10 px-4 md:px-8 h-16 flex items-center justify-between">
      <div className="w-12 flex justify-start">
        <button 
          onClick={onOpenHistory}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex justify-center items-center">
        <span className="font-display font-bold text-lg tracking-tight">
          PLANIX <span className="text-gradient">NOVA</span>
        </span>
      </div>

      <div className="flex justify-end relative">
        <button 
          onClick={() => setShowProfile(!showProfile)}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5 flex items-center gap-2"
        >
          <User className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-48 glass-card border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(0,112,243,0.4)]">
                <span className="text-white font-bold text-lg">
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <p className="text-white font-medium text-sm text-center mb-1">
                {userData?.name || 'Explorer'}
              </p>
              <p className="text-gray-400 text-xs text-center mb-1">
                {userData?.role || 'User'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
