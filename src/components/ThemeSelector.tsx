// src/components/ThemeSelector.tsx
import React from 'react';
import { motion } from 'framer-motion';
import type { ThemeOption } from '../types';
import type { ThemeId } from '../types';
import Avatar from './Avatar';

interface Props {
  onThemeSelect: (id: ThemeId) => void;
}

const ThemeSelector: React.FC<Props> = ({ onThemeSelect }) => {
  const themes: ThemeOption[] = [
    { id: 'Travel', icon: '✈️', gradient: 'from-blue-200 to-cyan-200' },
    { id: 'Fashion', icon: '👗', gradient: 'from-pink-200 to-rose-200' },
    { id: 'Agriculture', icon: '🌾', gradient: 'from-green-200 to-emerald-200' },
    { id: 'Sports', icon: '⚽', gradient: 'from-orange-200 to-amber-200' },
    { id: 'Music', icon: '🎵', gradient: 'from-purple-200 to-violet-200' },
    { id: 'Storyteller', icon: '📖', gradient: 'from-indigo-200 to-blue-200' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6"
    >
      <div className="max-w-4xl w-full">
        
        {/* Decor Avatar above heading (Fixed Happy State) */}
        <div className="flex justify-center mb-6">
           <div className="w-32 h-32 relative">
              <Avatar avatarState="happy" className="" />
           </div>
        </div>

        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-5xl font-bold text-gray-800 text-center mb-4"
        >
          TenkiGuide
        </motion.h1>
        <motion.p
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          className="text-gray-600 text-center mb-12 text-lg"
        >
          Choose your conversation theme
        </motion.p>
        
        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.03, 
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onThemeSelect(theme.id)}
              className="bg-white/40 backdrop-blur-lg rounded-4xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/60 text-left"
            >
              <div className={`w-20 h-20 mx-auto mb-4 bg-linear-to-br ${theme.gradient} rounded-full flex items-center justify-center text-4xl shadow-lg`}>
                {theme.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{theme.id}</h3>
              <p className="text-gray-600 text-sm">Explore {theme.id.toLowerCase()} topics</p>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ThemeSelector;