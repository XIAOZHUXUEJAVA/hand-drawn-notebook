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
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "backOut" }}
        className="flex items-center gap-4 px-6 py-2 rounded-lg relative"
        style={{
          backgroundColor: '#fdfdf8', // Paper white
          boxShadow: '2px 3px 10px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.05)',
          border: '1px solid #e5e5e5',
        }}
      >
        {/* Paper texture overlay */}
        <div className="absolute inset-0 rounded-lg pointer-events-none" 
             style={{ 
               boxShadow: 'inset 0 0 15px rgba(0,0,0,0.01)',
               background: 'linear-gradient(to bottom right, rgba(255,255,255,0.5), rgba(255,255,255,0))'
             }} 
        />

        {/* Previous Button */}
        <motion.button
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className={`
            w-10 h-10 flex items-center justify-center rounded-full
            transition-colors duration-200 relative z-10
            ${canGoPrevious ? 'cursor-pointer hover:bg-stone-100' : 'cursor-not-allowed opacity-20'}
          `}
          whileHover={canGoPrevious ? { scale: 1.1, rotate: -5 } : {}}
          whileTap={canGoPrevious ? { scale: 0.9 } : {}}
        >
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-700">
             <path d="M19 12H5M12 19l-7-7 7-7" />
           </svg>
        </motion.button>

        {/* Page Indicator */}
        <div className="flex items-center gap-2 px-2 relative z-10 select-none">
          <span
            className="text-2xl font-bold"
            style={{ fontFamily: "'Caveat', cursive", color: '#2c2c2c' }}
          >
            Page {currentPage + 1}
          </span>
          <span className="text-stone-400 text-xl" style={{ fontFamily: "'Caveat', cursive" }}>/</span>
          <span
            className="text-xl text-stone-500"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            {totalPages}
          </span>
        </div>

        {/* Next Button */}
        <motion.button
          onClick={handleNext}
          disabled={!canGoNext}
          className={`
            w-10 h-10 flex items-center justify-center rounded-full
            transition-colors duration-200 relative z-10
            ${canGoNext ? 'cursor-pointer hover:bg-stone-100' : 'cursor-not-allowed opacity-20'}
          `}
          whileHover={canGoNext ? { scale: 1.1, rotate: 5 } : {}}
          whileTap={canGoNext ? { scale: 0.9 } : {}}
        >
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-700">
             <path d="M5 12h14M12 5l7 7-7 7" />
           </svg>
        </motion.button>
      </motion.div>

      {/* Page Dots - Sketched circles */}
      {totalPages <= 10 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <motion.button
              key={index}
              onClick={() => onPageChange(index)}
              className="relative w-3 h-3 flex items-center justify-center group"
              whileHover={{ scale: 1.2 }}
            >
              {index === currentPage ? (
                // Filled rough circle (Active)
                <svg viewBox="0 0 12 12" className="w-full h-full text-stone-800 fill-current drop-shadow-sm">
                   <path d="M6,1 C8.76142375,1 11,3.23857625 11,6 C11,8.76142375 8.76142375,11 6,11 C3.23857625,11 1,8.76142375 1,6 C1,3.23857625 3.23857625,1 6,1 Z" />
                </svg>
              ) : (
                // Empty rough circle (Inactive)
                <svg viewBox="0 0 12 12" className="w-full h-full text-stone-400 stroke-current fill-none group-hover:text-stone-600 transition-colors" strokeWidth="1.5">
                   <path d="M6,1.5 C8.48528137,1.5 10.5,3.51471863 10.5,6 C10.5,8.48528137 8.48528137,10.5 6,10.5 C3.51471863,10.5 1.5,8.48528137 1.5,6 C1.5,3.51471863 3.51471863,1.5 6,1.5 Z" strokeLinecap="round" strokeDasharray="20 2" />
                </svg>
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};
