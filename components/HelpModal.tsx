"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40, rotate: 2 }}
            className="fixed inset-0 flex items-center justify-center z-[70] pointer-events-none p-4"
          >
            <div className="pointer-events-auto relative w-full max-w-3xl">
              {/* The Manual Book Look */}
              <div
                className="relative bg-[#fdfbf7] rounded-lg overflow-hidden shadow-2xl"
                style={{
                  boxShadow:
                    "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0,0,0,0.05)",
                }}
              >
                {/* Book Binding (Left side) */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#3e2723] z-20 flex flex-col items-center py-6 space-y-4 shadow-lg">
                  {/* Stitching */}
                  <div className="w-0.5 h-full border-l-2 border-dashed border-[#5d4037] opacity-50 absolute left-2" />

                  {/* Metal Rings */}
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full bg-[#d7ccc8] shadow-inner border border-[#8d6e63] relative z-10"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
                    </div>
                  ))}
                </div>

                {/* Content Area */}
                <div className="pl-12 min-h-[600px] flex flex-col">
                  {/* Header - Tape Style */}
                  <div className="relative pt-8 pb-6 px-8 border-b border-[#e0e0e0] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                    <div className="absolute top-[-10px] left-[40%] w-32 h-8 bg-[#f0f4c3]/80 rotate-[-2deg] shadow-sm backdrop-blur-[1px]" />

                    <h2
                      className="text-4xl font-bold text-[#2d3436] relative z-10 transform -rotate-1"
                      style={{ fontFamily: "'Caveat', cursive" }}
                    >
                      How to use your Notebook
                    </h2>
                    <div className="absolute right-6 top-6">
                      <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-400 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Body */}
                  <div className="flex-1 overflow-y-auto p-8 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <GuideCard
                        icon="📚"
                        title="Notebooks"
                        color="#e3f2fd"
                        rotate={-1}
                        text="Start by creating a Notebook in the sidebar. Give it a name and pick a cover color!"
                      />

                      <GuideCard
                        icon="📑"
                        title="Sections"
                        color="#f3e5f5"
                        rotate={1}
                        text="Organize your notes into Sections (like chapters). Add them inside your notebooks."
                      />

                      <GuideCard
                        icon="✏️"
                        title="Writing Tools"
                        color="#fff3e0"
                        rotate={-1.5}
                        text="Switch tools in the toolbar: Pen for sketching, Text for typing, and Highlighter for... highlighting!"
                      />

                      <GuideCard
                        icon="💾"
                        title="Saving"
                        color="#e8f5e9"
                        rotate={0.5}
                        text="Notes auto-save locally. Sign In (top right) to sync everything to the cloud securely."
                      />
                    </div>

                    {/* Pro Tip Note */}
                    <div className="mt-8 mx-4 p-4 bg-[#fff9c4] shadow-md transform rotate-1 relative rounded-sm">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-4 bg-[#ffcc80]/60 shadow-sm" />
                      <h4
                        className="text-lg font-bold text-[#f57f17] mb-1"
                        style={{ fontFamily: "'Patrick Hand', cursive" }}
                      >
                        💡 Pro Tip:
                      </h4>
                      <p
                        className="text-gray-700"
                        style={{ fontFamily: "'Kalam', cursive" }}
                      >
                        You can drag images directly onto the page to add them
                        to your notes! Try pasting screenshots too.
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-[#f5f5f5] border-t border-gray-200 text-center">
                    <p
                      className="text-gray-400 text-sm"
                      style={{ fontFamily: "'Indie Flower', cursive" }}
                    >
                      Tap anywhere outside to close this manual
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

interface GuideCardProps {
  icon: string;
  title: string;
  text: string;
  color: string;
  rotate: number;
}

const GuideCard: React.FC<GuideCardProps> = ({
  icon,
  title,
  text,
  color,
  rotate,
}) => (
  <motion.div
    whileHover={{ scale: 1.02, rotate: 0 }}
    className="p-5 rounded-lg shadow-sm border border-black/5 relative group"
    style={{
      backgroundColor: color,
      transform: `rotate(${rotate}deg)`,
    }}
  >
    {/* Pin */}
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#ef5350] shadow-sm border border-[#c62828] z-10" />

    <div className="flex items-center gap-3 mb-2">
      <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <h3
        className="text-xl font-bold text-gray-800"
        style={{ fontFamily: "'Patrick Hand', cursive" }}
      >
        {title}
      </h3>
    </div>
    <p
      className="text-gray-600 leading-relaxed text-sm md:text-base"
      style={{ fontFamily: "'Kalam', cursive" }}
    >
      {text}
    </p>
  </motion.div>
);
