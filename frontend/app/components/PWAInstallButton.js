'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isInstalling) return; // Prevent multiple clicks

    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }

    setIsInstalling(true);

    try {
      console.log('Starting PWA installation...');
      const result = await deferredPrompt.prompt();
      console.log('Install prompt result:', result);

      if (result.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const dismissPrompt = () => {
    setShowInstallPrompt(false);
    // Hide for 24 hours
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Check if prompt was recently dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (now - dismissedTime < twentyFourHours) {
        setShowInstallPrompt(false);
      }
    }
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('PWA Install Button State:', {
      isInstalled,
      showInstallPrompt,
      isIOS,
      isInstalling,
      deferredPrompt: !!deferredPrompt,
      shouldShow: !isInstalled && (showInstallPrompt || isIOS)
    });
  }, [isInstalled, showInstallPrompt, isIOS, isInstalling, deferredPrompt]);

  // Don't show if already installed
  if (isInstalled) return null;

  return (
    <>
      {/* Install Button */}
      <AnimatePresence>
        {(showInstallPrompt || isIOS || true) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.button
              onClick={handleInstallClick}
              disabled={isInstalling}
              whileHover={!isInstalling ? { scale: 1.05 } : {}}
              whileTap={!isInstalling ? { scale: 0.95 } : {}}
              className={`relative group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 ${
                isInstalling ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3">
                {isInstalling ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download size={20} className="group-hover:animate-bounce" />
                )}
                <span className="font-semibold">
                  {isInstalling ? 'Installing...' : 'Install App'}
                </span>
              </div>

              {!isIOS && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissPrompt();
                  }}
                  className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      dismissPrompt();
                    }
                  }}
                >
                  <X size={16} />
                </div>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Instructions Modal */}
      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowIOSInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="text-indigo-600" size={32} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Install on iOS
                </h3>

                <div className="text-left space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-indigo-600 text-sm font-bold">1</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Tap the share button <span className="font-semibold">⬆️</span> in Safari
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-indigo-600 text-sm font-bold">2</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Scroll down and tap <span className="font-semibold">&quot;Add to Home Screen&quot;</span>
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-indigo-600 text-sm font-bold">3</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Tap <span className="font-semibold">&quot;Add&quot;</span> to install the app
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowIOSInstructions(false)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-colors"
                >
                  Got it!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install Banner for Desktop */}
      <AnimatePresence>
        {showInstallPrompt && !isIOS && window.innerWidth >= 768 && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 z-40"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Monitor className="text-white/90" size={24} />
                <div>
                  <h4 className="font-semibold">Install Digital Guidance Platform</h4>
                  <p className="text-white/90 text-sm">Get quick access with our desktop app</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleInstallClick}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Install
                </button>
                <button
                  onClick={dismissPrompt}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}