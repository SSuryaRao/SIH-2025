'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceInterface({
  onUserSpeech,
  onMentorSpeak,
  onListeningChange,
  onSpeakingChange,
  mentorType = 'engineer'
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);

  // Voice settings for different mentors - memoized to prevent re-creation
  const mentorVoices = useMemo(() => ({
    engineer: { rate: 0.9, pitch: 1.1, voiceName: 'Alex' },
    doctor: { rate: 0.85, pitch: 0.9, voiceName: 'Samantha' },
    teacher: { rate: 0.8, pitch: 1.0, voiceName: 'Daniel' },
    artist: { rate: 0.95, pitch: 1.2, voiceName: 'Zira' },
    business: { rate: 0.9, pitch: 0.8, voiceName: 'David' }
  }), []);

  const startAudioVisualization = useCallback(async () => {
    try {
      if (typeof window === 'undefined') return;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Check if AudioContext is available
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        console.log('Web Audio API not supported');
        return;
      }

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);

      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average / 255);
          requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();
    } catch (error) {
      console.error('Error setting up audio visualization:', error);
      // Gracefully degrade without audio visualization
      setAudioLevel(0.5); // Set a default level
    }
  }, [isListening]);

  const stopAudioVisualization = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const setupSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      startAudioVisualization();
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(interimTranscript || finalTranscript);

      if (finalTranscript) {
        console.log('Final transcript:', finalTranscript);
        onUserSpeech?.(finalTranscript.trim());
        setTranscript('');
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      stopAudioVisualization();

      switch(event.error) {
        case 'no-speech':
          console.log('No speech detected');
          break;
        case 'network':
          console.error('Speech recognition network error:', event.error);
          break;
        case 'not-allowed':
          console.error('Microphone permission denied:', event.error);
          alert('Microphone permission denied. Please enable microphone access.');
          break;
        case 'aborted':
          console.log('Speech recognition was aborted');
          // Don't show error for aborted - it's expected during cleanup
          break;
        default:
          console.error('Speech recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      stopAudioVisualization();
    };

    recognitionRef.current = recognition;
  }, [onUserSpeech, startAudioVisualization, stopAudioVisualization]);

  const setupSpeechSynthesis = useCallback(() => {
    synthRef.current = window.speechSynthesis;
  }, []);

  const cleanup = useCallback(() => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      stopAudioVisualization();
      setIsListening(false);
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }, [stopAudioVisualization]);

  useEffect(() => {
    // Check for Web Speech API support
    const speechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const synthesisSupported = 'speechSynthesis' in window;

    setIsSupported(speechSupported && synthesisSupported);

    if (speechSupported) {
      setupSpeechRecognition();
    }

    if (synthesisSupported) {
      setupSpeechSynthesis();
    }

    return () => {
      cleanup();
    };
  }, [setupSpeechRecognition, setupSpeechSynthesis, cleanup]);

  // Notify parent components of state changes
  useEffect(() => {
    onListeningChange?.(isListening);
  }, [isListening, onListeningChange]);

  useEffect(() => {
    onSpeakingChange?.(isSpeaking);
  }, [isSpeaking, onSpeakingChange]);


  const startListening = async () => {
    if (!isSupported || !recognitionRef.current) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    // Prevent multiple instances
    if (isListening) {
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Stop any existing recognition first
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      // Small delay to ensure cleanup
      setTimeout(() => {
        if (recognitionRef.current && !isListening) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error('Error starting recognition:', error);
            // If recognition is already running, ignore the error
            if (error.name !== 'InvalidStateError') {
              alert('Unable to start voice recognition. Please try again.');
            }
          }
        }
      }, 100);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
        // Force cleanup even if stop fails
        setIsListening(false);
        stopAudioVisualization();
      }
    }
  };

  const speak = useCallback((text, emotion = 'neutral') => {
    if (!synthRef.current || !text.trim()) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voiceSettings = mentorVoices[mentorType] || mentorVoices.engineer;

    // Configure voice settings
    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = 1;

    // Adjust settings based on emotion
    switch(emotion) {
      case 'excited':
        utterance.rate = Math.min(voiceSettings.rate * 1.2, 1.5);
        utterance.pitch = Math.min(voiceSettings.pitch * 1.1, 2);
        break;
      case 'concerned':
        utterance.rate = voiceSettings.rate * 0.8;
        utterance.pitch = voiceSettings.pitch * 0.9;
        break;
      case 'happy':
        utterance.pitch = Math.min(voiceSettings.pitch * 1.05, 2);
        break;
      case 'encouraging':
        utterance.rate = voiceSettings.rate * 0.9;
        utterance.volume = 0.9;
        break;
    }

    // Try to select appropriate voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice =>
      voice.name.includes(voiceSettings.voiceName) ||
      (voice.name.includes('Female') && ['doctor', 'artist'].includes(mentorType)) ||
      (voice.name.includes('Male') && ['engineer', 'teacher', 'business'].includes(mentorType))
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      console.log('Speech synthesis started');
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      console.log('Speech synthesis ended');
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };

    onMentorSpeak?.();
    synthRef.current.speak(utterance);
  }, [mentorType, onMentorSpeak, mentorVoices]);



  // Expose speak function to parent
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.mentorSpeak = speak;
    }
  }, [speak]);

  if (!isSupported) {
    return (
      <div className="voice-interface-container p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700 mb-2">Voice features not supported</p>
          <p className="text-red-600 text-sm">
            Your browser doesn&apos;t support speech recognition or synthesis.
            Please use Chrome, Edge, or Safari for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-interface-container p-4">
      {/* Voice Control Button */}
      <div className="flex justify-center mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? stopListening : startListening}
          disabled={isSpeaking}
          className={`relative px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 shadow-lg ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : isSpeaking
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          <div className="flex items-center space-x-3">
            {isListening ? (
              <>
                <div className="w-5 h-5 bg-white rounded-full animate-ping"></div>
                <span>Stop Listening</span>
              </>
            ) : isSpeaking ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Speaking...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span>Talk to Mentor</span>
              </>
            )}
          </div>
        </motion.button>
      </div>

      {/* Audio Level Visualization */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex justify-center mb-4"
          >
            <div className="flex items-center space-x-1">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-blue-500 rounded-full"
                  style={{
                    height: `${Math.max(4, audioLevel * 40 + Math.random() * 20)}px`,
                  }}
                  animate={{
                    height: [`${Math.max(4, audioLevel * 40)}px`, `${Math.max(4, audioLevel * 60)}px`],
                  }}
                  transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript Display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center"
          >
            <p className="text-blue-800 text-sm">
              <span className="font-medium">You&apos;re saying:</span> &quot;{transcript}&quot;
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="text-center text-sm text-gray-600 mt-4">
        <p>Click the button and speak naturally to your mentor</p>
        <p className="text-xs mt-1">
          🎤 Voice recognition • 🔊 AI responses •
          {mentorType && ` 👨‍💼 ${mentorType.charAt(0).toUpperCase() + mentorType.slice(1)} mode`}
        </p>
      </div>
    </div>
  );
}