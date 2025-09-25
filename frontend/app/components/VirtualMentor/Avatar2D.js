'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Avatar2D({
  mentorType = 'engineer',
  isListening = false,
  isSpeaking = false,
  emotion = 'neutral',
  className = ''
}) {
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const avatarRef = useRef(null);

  // Mentor configurations with better styling
  const mentorConfig = {
    engineer: {
      name: 'Alex Chen',
      avatar: '👨‍💻',
      colors: {
        primary: '#4F46E5',
        secondary: '#818CF8',
        accent: '#C7D2FE'
      },
      accessories: ['💻', '⚙️', '🔧'],
      backgroundGradient: 'from-blue-400 to-indigo-600'
    },
    doctor: {
      name: 'Dr. Sarah Patel',
      avatar: '👩‍⚕️',
      colors: {
        primary: '#EF4444',
        secondary: '#FCA5A5',
        accent: '#FEE2E2'
      },
      accessories: ['🩺', '💊', '🏥'],
      backgroundGradient: 'from-red-400 to-pink-600'
    },
    teacher: {
      name: 'Prof. Michael Kumar',
      avatar: '👨‍🏫',
      colors: {
        primary: '#059669',
        secondary: '#6EE7B7',
        accent: '#D1FAE5'
      },
      accessories: ['📚', '✏️', '🎓'],
      backgroundGradient: 'from-green-400 to-emerald-600'
    },
    artist: {
      name: 'Maya Sharma',
      avatar: '👩‍🎨',
      colors: {
        primary: '#7C3AED',
        secondary: '#C4B5FD',
        accent: '#EDE9FE'
      },
      accessories: ['🎨', '🖌️', '🌈'],
      backgroundGradient: 'from-purple-400 to-pink-600'
    },
    business: {
      name: 'Raj Patel',
      avatar: '👨‍💼',
      colors: {
        primary: '#1F2937',
        secondary: '#9CA3AF',
        accent: '#F3F4F6'
      },
      accessories: ['💼', '📊', '💰'],
      backgroundGradient: 'from-gray-600 to-slate-800'
    }
  };

  const config = mentorConfig[mentorType] || mentorConfig.engineer;

  // Animation variants for different states
  const avatarVariants = {
    idle: {
      scale: [1, 1.02, 1],
      rotate: [0, 1, -1, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    listening: {
      scale: [1, 1.1, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    speaking: {
      scale: [1, 1.05, 1.1, 1],
      y: [0, -5, 0, -3, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    idle: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    listening: {
      scale: [1, 1.5, 1],
      opacity: [0.5, 0.9, 0.5],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    speaking: {
      scale: [1, 1.3, 1.1, 1],
      opacity: [0.4, 0.8, 0.6, 0.4],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Update animation based on state
  useEffect(() => {
    if (isSpeaking) {
      setCurrentAnimation('speaking');
    } else if (isListening) {
      setCurrentAnimation('listening');
    } else {
      setCurrentAnimation('idle');
    }
  }, [isListening, isSpeaking]);

  // Emotion-based effects
  const getEmotionEffects = (emotion) => {
    const effects = {
      happy: {
        filter: 'brightness(1.2) saturate(1.3)',
        shadow: '0 0 30px rgba(255, 215, 0, 0.6)'
      },
      excited: {
        filter: 'brightness(1.3) saturate(1.4)',
        shadow: '0 0 40px rgba(255, 165, 0, 0.8)'
      },
      concerned: {
        filter: 'brightness(0.9) saturate(0.8)',
        shadow: '0 0 20px rgba(100, 100, 255, 0.5)'
      },
      encouraging: {
        filter: 'brightness(1.1) saturate(1.2)',
        shadow: '0 0 25px rgba(0, 255, 100, 0.6)'
      },
      neutral: {
        filter: 'brightness(1) saturate(1)',
        shadow: '0 0 20px rgba(255, 255, 255, 0.3)'
      }
    };
    return effects[emotion] || effects.neutral;
  };

  const emotionEffects = getEmotionEffects(emotion);

  return (
    <div className={`relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.backgroundGradient}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10"></div>

        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white bg-opacity-30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, -200],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Avatar Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">

        {/* Pulse Ring */}
        <motion.div
          className="absolute rounded-full border-4 border-white border-opacity-50"
          style={{
            width: '200px',
            height: '200px',
          }}
          variants={pulseVariants}
          animate={currentAnimation}
        />

        {/* Secondary Pulse Ring */}
        <motion.div
          className="absolute rounded-full border-2 border-white border-opacity-30"
          style={{
            width: '250px',
            height: '250px',
          }}
          variants={pulseVariants}
          animate={currentAnimation}
          transition={{ delay: 0.2 }}
        />

        {/* Avatar Circle */}
        <motion.div
          ref={avatarRef}
          className="relative z-20 w-32 h-32 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-full flex items-center justify-center shadow-2xl border-4 border-white border-opacity-30"
          variants={avatarVariants}
          animate={currentAnimation}
          style={{
            filter: emotionEffects.filter,
            boxShadow: `${emotionEffects.shadow}, inset 0 0 20px rgba(255,255,255,0.3)`
          }}
        >
          {/* Main Avatar Emoji */}
          <motion.div
            className="text-6xl"
            animate={isSpeaking ? {
              scale: [1, 1.1, 0.95, 1.05, 1],
              rotate: [0, 2, -1, 1, 0]
            } : {}}
            transition={{
              duration: 0.5,
              repeat: isSpeaking ? Infinity : 0
            }}
          >
            {config.avatar}
          </motion.div>

          {/* Status Indicator */}
          <motion.div
            className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
              isListening
                ? 'bg-green-500 animate-pulse'
                : isSpeaking
                ? 'bg-blue-500 animate-bounce'
                : 'bg-gray-400'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500 }}
          >
            {isListening ? '👂' : isSpeaking ? '💬' : '😊'}
          </motion.div>
        </motion.div>

        {/* Floating Accessories */}
        <div className="absolute inset-0 pointer-events-none">
          {config.accessories.map((accessory, index) => (
            <motion.div
              key={index}
              className="absolute text-2xl"
              style={{
                left: `${20 + index * 25}%`,
                top: `${60 + index * 10}%`,
              }}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 3 + index,
                repeat: Infinity,
                delay: index * 0.5,
                ease: "easeInOut"
              }}
            >
              {accessory}
            </motion.div>
          ))}
        </div>

        {/* Name Label */}
        <motion.div
          className="mt-8 bg-white bg-opacity-90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-gray-800 font-bold text-lg text-center">
            {config.name}
          </h3>
        </motion.div>

        {/* Status Text */}
        <motion.div
          className="mt-3 text-center bg-black bg-opacity-30 backdrop-blur-sm px-4 py-2 rounded-full"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-white text-sm font-medium shadow-text">
            {isListening && "👂 I'm listening..."}
            {isSpeaking && "💬 Speaking..."}
            {!isListening && !isSpeaking && "😊 Ready to help!"}
          </p>
        </motion.div>

        {/* Emotion Indicator */}
        {emotion !== 'neutral' && (
          <motion.div
            className="absolute top-4 right-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-white/50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <span className="text-sm font-medium text-gray-800">
              {emotion === 'happy' && '😊 Happy'}
              {emotion === 'excited' && '🤩 Excited'}
              {emotion === 'concerned' && '😌 Concerned'}
              {emotion === 'encouraging' && '💪 Encouraging'}
            </span>
          </motion.div>
        )}

        {/* Audio Waves (when speaking) */}
        {isSpeaking && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white rounded-full"
                  animate={{
                    height: [10, 30, 10],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Listening Visualization */}
        {isListening && (
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
            <motion.div
              className="w-4 h-4 bg-green-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}