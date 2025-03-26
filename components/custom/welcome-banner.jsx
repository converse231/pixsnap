"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function AnimatedButton({ children, onClick, className }) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-6 py-3 cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg shadow-lg overflow-hidden group ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
      <motion.div
        className="absolute inset-0 bg-white/20"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  );
}

function WelcomeBanner() {
  const [showContent, setShowContent] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Delay showing content to ensure everything is mounted properly
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = () => {
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          className="fixed inset-0 z-[9999999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100vh" }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <AnimatePresence>
            {showContent && (
              <motion.div
                className="flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <AnimatePresence>
                    <motion.h1
                      key="welcome"
                      className="text-4xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      Welcome to
                    </motion.h1>
                  </AnimatePresence>

                  <AnimatePresence>
                    <motion.h2
                      key="pixsnap"
                      className="text-8xl font-bold text-white"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.2,
                      }}
                    >
                      PixSnap
                    </motion.h2>
                  </AnimatePresence>

                  <AnimatePresence>
                    <motion.p
                      key="tagline"
                      className="text-white/80 mt-4 text-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.4,
                      }}
                    >
                      Your creative journey begins here
                    </motion.p>
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  <motion.div
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.6,
                    }}
                  >
                    <AnimatedButton
                      className="mt-5"
                      onClick={handleButtonClick}
                    >
                      Start snapping
                    </AnimatedButton>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default WelcomeBanner;
