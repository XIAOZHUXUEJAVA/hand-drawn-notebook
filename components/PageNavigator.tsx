'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageNavigatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PageNavigator: React.FC<PageNavigatorProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const handlePrevious = () => {
    if (canGoPrevious) {
      onPageChange(currentPage - 1);
      playPageSound();
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      onPageChange(currentPage + 1);
      playPageSound();
    }
  };

  const playPageSound = () => {
    // Create a subtle page-turning sound effect
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 200;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center gap-6 px-8 py-4 rounded-full shadow-deep"
        style={{
          background: 'linear-gradient(135deg, #fdfdf8 0%, #faf8f3 100%)',
          border: '2px solid rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Previous Button */}
        <motion.button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            transition-all duration-200
            ${canGoPrevious ? 'cursor-pointer' : 'cursor-not-allowed opacity-30'}
          `}
          style={{
            background: canGoPrevious
              ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
              : '#e5e7eb',
            boxShadow: canGoPrevious ? '0 4px 12px rgba(30, 58, 138, 0.3)' : 'none',
          }}
          whileHover={canGoPrevious ? { scale: 1.1, x: -2 } : {}}
          whileTap={canGoPrevious ? { scale: 0.95 } : {}}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>

        {/* Page Indicator */}
        <div className="flex items-center gap-3">
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "'Caveat', cursive", color: 'var(--ink-black)' }}
          >
            Page {currentPage + 1}
          </span>
          <span className="text-gray-400">/</span>
          <span
            className="text-xl opacity-60"
            style={{ fontFamily: "'Caveat', cursive", color: 'var(--ink-gray)' }}
          >
            {totalPages}
          </span>
        </div>

        {/* Next Button */}
        <motion.button
          onClick={handleNext}
          disabled={!canGoNext}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center
            transition-all duration-200
            ${canGoNext ? 'cursor-pointer' : 'cursor-not-allowed opacity-30'}
          `}
          style={{
            background: canGoNext
              ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
              : '#e5e7eb',
            boxShadow: canGoNext ? '0 4px 12px rgba(30, 58, 138, 0.3)' : 'none',
          }}
          whileHover={canGoNext ? { scale: 1.1, x: 2 } : {}}
          whileTap={canGoNext ? { scale: 0.95 } : {}}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </motion.div>

      {/* Page Dots */}
      {totalPages <= 10 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => onPageChange(index)}
              className="w-2 h-2 rounded-full transition-all duration-200"
              style={{
                backgroundColor: index === currentPage ? 'var(--ink-blue)' : 'var(--line-gray)',
                transform: index === currentPage ? 'scale(1.5)' : 'scale(1)',
              }}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 1.2 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
