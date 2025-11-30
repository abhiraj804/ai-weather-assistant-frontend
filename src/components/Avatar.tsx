// src/components/Avatar.tsx
import React from 'react';
import { motion } from 'framer-motion';
import type { AvatarState } from '../types';

interface AvatarProps {
  avatarState: AvatarState;
  className?: string; // Allows us to position it fixed in the parent
}

const Avatar: React.FC<AvatarProps> = ({ avatarState, className = '' }) => {
  
  // Logic to determine which accessories to draw on the Egg
  const renderAccessory = () => {
    switch (avatarState) {
      case 'wearing_sunglasses':
        return (
          <g id="sunglasses">
            <rect x="60" y="60" width="35" height="20" rx="10" fill="#1a1a1a" />
            <rect x="105" y="60" width="35" height="20" rx="10" fill="#1a1a1a" />
            <line x1="95" y1="70" x2="105" y2="70" stroke="#1a1a1a" strokeWidth="3" />
          </g>
        );
      case 'wearing_scarf':
      case 'shivering':
        return (
          <g id="scarf">
            <ellipse cx="100" cy="140" rx="50" ry="15" fill="#ff6b6b" />
            <rect x="75" y="135" width="15" height="40" fill="#ff6b6b" />
            <rect x="110" y="135" width="15" height="40" fill="#ff6b6b" />
          </g>
        );
      case 'holding_umbrella':
      case 'raining':
        return (
          <g id="umbrella">
            <path d="M100,40 Q70,20 50,40 Q70,50 100,40 Q130,50 150,40 Q130,20 100,40" fill="#4169e1" />
            <line x1="100" y1="40" x2="100" y2="100" stroke="#8b4513" strokeWidth="3" />
          </g>
        );
      case 'sad':
        return (
          <g id="sad-face">
            <circle cx="75" cy="70" r="5" fill="#1a1a1a" />
            <circle cx="125" cy="70" r="5" fill="#1a1a1a" />
            <path d="M70,110 Q100,100 130,110" stroke="#1a1a1a" strokeWidth="3" fill="none" />
          </g>
        );
      case 'shocked':
      case 'surprised':
        return (
          <g id="shocked-face">
            <circle cx="75" cy="70" r="8" fill="#1a1a1a" />
            <circle cx="125" cy="70" r="8" fill="#1a1a1a" />
            <circle cx="100" cy="105" r="12" fill="#1a1a1a" />
          </g>
        );
      case 'happy':
      default:
        // Default Happy Face
        return (
          <g id="happy-face">
            <circle cx="75" cy="70" r="5" fill="#1a1a1a" />
            <circle cx="125" cy="70" r="5" fill="#1a1a1a" />
            <path d="M70,95 Q100,115 130,95" stroke="#1a1a1a" strokeWidth="3" fill="none" />
          </g>
        );
    }
  };

  return (
    <motion.div
      // Entrance Animation
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className={className}
    >
      <motion.svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        // Floating Animation (The Bounce)
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="drop-shadow-2xl w-full h-full"
      >
        {/* Shadow floor */}
        <ellipse cx="100" cy="180" rx="40" ry="8" fill="#00000020" />

        {/* The Egg Body (Specific Path) */}
        <path
          d="M40.2,77.5C40.2,77.5,23,124.5,49,150.5C75,176.5,125,176.5,151,150.5C177,124.5,159.8,77.5,159.8,77.5C159.8,77.5,138.5,25.5,100,25.5C61.5,25.5,40.2,77.5,40.2,77.5Z"
          fill="white"
          stroke="#e0e0e0"
          strokeWidth="2"
        />
        
        {/* Render Face/Items */}
        {renderAccessory()}
      </motion.svg>
    </motion.div>
  );
};

export default Avatar;