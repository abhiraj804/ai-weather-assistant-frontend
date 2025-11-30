// src/components/ChatBubble.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, Loader2 } from 'lucide-react'; // Added Loader2 for loading state
import axios from 'axios';
import type { Message } from '../types';

interface Props {
  message: Message;
  isUser: boolean;
  currentLang: 'en' | 'ja';
  backendUrl: string;
}

// Global variable to track current playing audio
let currentAudio: HTMLAudioElement | null = null;

const ChatBubble: React.FC<Props> = ({ message, isUser, currentLang, backendUrl }) => {
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Listen for audio started events to reset playing state
  useEffect(() => {
    const handleAudioStarted = () => {
      setIsPlaying(false);
    };
    window.addEventListener('audioStarted', handleAudioStarted);
    return () => window.removeEventListener('audioStarted', handleAudioStarted);
  }, []);

  // 1. Determine which text to show based on GLOBAL language state
  const displayText = isUser
    ? message.text || ''
    : currentLang === 'en'
      ? message.english_text || ''
      : message.japanese_text || '';

  // 2. Play Audio Function (Fetches on demand)
  const handlePlayAudio = async () => {
    if (loadingAudio) return;
    
    if (isPlaying) {
      // Stop the current audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
      }
      setIsPlaying(false);
      return;
    }
    
    // Dispatch event to reset other components' playing state
    window.dispatchEvent(new CustomEvent('audioStarted'));
    
    setLoadingAudio(true);

    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
      }

      // Call backend to generate audio for the CURRENT language text
      const response = await axios.post(`${backendUrl}/tts`, {
        text: displayText,
        language: currentLang
      }, { responseType: 'blob' });

      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      currentAudio = audio;
      audio.onended = () => {
        setIsPlaying(false);
        currentAudio = null;
      };
      audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio playback failed", error);
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md text-[15px] leading-relaxed relative 
          ${isUser 
            ? 'bg-[#d9fdd3] text-gray-800 rounded-br-none' 
            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100' 
          }`}
      >
        {/* Show ONLY the selected language text */}
        <p>{displayText}</p>
        
        {/* Play Audio Button (Only for AI) */}
        {!isUser && (
          <button
            onClick={handlePlayAudio}
            disabled={loadingAudio}
            className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-semibold bg-blue-50 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
          >
            {loadingAudio ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Volume2 size={14} />
            )}
            <span>
              {loadingAudio ? 'Loading...' : isPlaying ? 'Stop Audio' : 'Play Audio'}
            </span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ChatBubble;