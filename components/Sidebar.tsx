'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Notebook, Section } from '@/types';

interface SidebarProps {
  notebooks: Notebook[];
  activeNotebook: string | null;
  activeSection: string | null;
  onNotebookSelect: (notebookId: string) => void;
  onSectionSelect: (sectionId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notebooks,
  activeNotebook,
  activeSection,
  onNotebookSelect,
  onSectionSelect,
  isOpen,
  onToggle,
}) => {
  return (
    <>
      {/* Toggle Button - Only visible when sidebar is closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            onClick={onToggle}
            className="fixed top-8 left-8 z-50 flex items-center justify-center group"
            style={{
              width: '60px',
              height: '60px',
              perspective: '1000px',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div 
              className="relative w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:-rotate-6"
              style={{
                background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
                borderRadius: '8px 4px 4px 8px',
                boxShadow: '2px 4px 8px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.2)',
                border: '1px solid #6d3710',
              }}
            >
              {/* Stitching effect */}
              <div className="absolute inset-1 border-2 border-dashed border-[#d2b48c] opacity-60 rounded-[6px_3px_3px_6px]" />
              
              {/* Metal eyelet */}
              <div className="absolute left-2 w-3 h-3 rounded-full bg-[#d4af37] shadow-inner border border-[#b8860b]" />

              {/* Book Icon SVG */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="w-8 h-8 text-white drop-shadow-md transform transition-transform duration-300 group-hover:scale-110"
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar - Realistic Separator Page */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -480, rotateY: 15 }}
            animate={{ x: 0, rotateY: 0 }}
            exit={{ x: -480, rotateY: 15 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 1.2 
            }}
            className="fixed left-0 top-0 h-full w-[380px] z-40"
            style={{
              perspective: '2000px',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Main Cardstock Body */}
            <div 
              className="relative h-full w-full overflow-hidden flex flex-col"
              style={{
                background: '#f2eecb', // Manilla folder color
                backgroundImage: `
                  url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E"),
                  linear-gradient(to right, rgba(0,0,0,0.05) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.02) 100%)
                `,
                boxShadow: '10px 0 25px rgba(0,0,0,0.15), 2px 0 5px rgba(0,0,0,0.1)',
                borderRight: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              {/* Close Button */}
              <button
                onClick={onToggle}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-gray-800 transition-colors z-20"
                aria-label="Close sidebar"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {/* Content Area */}
              <div className="flex-1 px-10 py-12 overflow-y-auto custom-scrollbar">
                {/* Header */}
                <div className="mb-14 pl-2 mt-4">
                  <div className="relative inline-block">
                    <h2
                      className="text-5xl text-[#2c2c2c] relative z-10"
                      style={{ 
                        fontFamily: "'Caveat', cursive", 
                        fontWeight: 700,
                        transform: 'rotate(-2deg)',
                      }}
                    >
                      My Notebooks
                    </h2>
                    {/* Highlighter effect */}
                    <div 
                      className="absolute bottom-2 left-0 w-[110%] h-4 -z-0 -rotate-1 opacity-60"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, #ffeb3b 10%, #ffeb3b 90%, transparent 100%)',
                        borderRadius: '4px',
                        filter: 'blur(1px)',
                      }}
                    />
                  </div>
                  <p 
                    className="mt-2 text-gray-500 text-lg"
                    style={{ fontFamily: "'Indie Flower', cursive" }}
                  >
                    Select a collection to start writing...
                  </p>
                </div>

                {/* Notebooks List */}
                <div className="space-y-24 pb-20">
                  {notebooks.map((notebook, nbIndex) => (
                    <NotebookItem
                      key={notebook.id}
                      notebook={notebook}
                      isActive={activeNotebook === notebook.id}
                      onSelect={onNotebookSelect}
                      activeSection={activeSection}
                      onSectionSelect={onSectionSelect}
                      index={nbIndex}
                    />
                  ))}

                  {/* Add Notebook Button */}
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-8 p-4 border-2 border-dashed border-gray-400 rounded-lg text-gray-500 hover:border-gray-600 hover:text-gray-700 transition-colors flex items-center justify-center gap-3"
                    style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '1.2rem' }}
                  >
                    <span className="text-2xl">+</span>
                    <span>Create New Notebook</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Plastic Tab on the right edge (Visual flair) */}
            <div 
              className="absolute -right-3 top-24 w-4 h-16 rounded-r-md opacity-80"
              style={{
                background: 'linear-gradient(90deg, #ff6b6b, #ee5253)',
                boxShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                zIndex: -1,
              }}
            />
             <div 
              className="absolute -right-3 top-44 w-4 h-16 rounded-r-md opacity-80"
              style={{
                background: 'linear-gradient(90deg, #4ecdc4, #45b7d1)',
                boxShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                zIndex: -1,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-[#1a1a1a]/40 z-30 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>
    </>
  );
};

// Notebook Item Component
interface NotebookItemProps {
  notebook: Notebook;
  isActive: boolean;
  onSelect: (id: string) => void;
  activeSection: string | null;
  onSectionSelect: (id: string) => void;
  index: number;
}

const NotebookItem: React.FC<NotebookItemProps> = ({
  notebook,
  isActive,
  onSelect,
  activeSection,
  onSectionSelect,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      {/* The Notebook "Cover" / Folder Tab */}
      <div 
        onClick={() => onSelect(notebook.id)}
        className="cursor-pointer relative z-10 transition-transform duration-300"
        style={{
          transform: isActive ? 'translateX(10px)' : 'translateX(0)',
        }}
      >
        <div
          className="relative p-2.5 rounded-lg border-2 border-black/5 overflow-hidden"
          style={{
            background: isActive ? notebook.coverColor : 'white',
            boxShadow: isActive 
              ? '0 8px 20px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.1)' 
              : '0 2px 5px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Paper texture overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] mix-blend-multiply pointer-events-none" />
          
          <div className="flex items-center gap-2.5 relative z-10">
            {/* Icon Container */}
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center text-2xl bg-white/30 shadow-inner border border-white/20 flex-shrink-0"
            >
              {/* Notebook Icon SVG */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="w-6 h-6 text-gray-700"
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>

            <div className="flex-1 overflow-hidden">
              <h3 
                className={`text-lg font-bold leading-none mb-1 truncate ${isActive ? 'text-white' : 'text-gray-800'}`}
                style={{ 
                  fontFamily: "'Caveat', cursive",
                  textShadow: isActive ? '1px 1px 0 rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {notebook.name}
              </h3>
              <p 
                className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'} truncate`}
                style={{ fontFamily: "'Indie Flower', cursive" }}
              >
                {notebook.sections.length} sections • {notebook.sections.reduce((acc, s) => acc + s.notes.length, 0)} notes
              </p>
            </div>

            {/* Chevron */}
            <motion.div
              animate={{ rotate: isActive ? 90 : 0 }}
              className={`text-xl ${isActive ? 'text-white' : 'text-gray-400'}`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </motion.div>
          </div>
        </div>

        {/* Decorative Tape (Visual detail) */}
        <div 
          className="absolute -top-3 left-8 w-24 h-6 opacity-40 z-20"
          style={{
            background: 'rgba(255,255,255,0.6)',
            transform: 'rotate(-2deg)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(2px)',
          }}
        />
      </div>

      {/* Sections List (The "Pages" inside) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-8 pr-4 pt-6 pb-4"
          >
            <div 
              className="relative border-l-2 border-dashed border-gray-300 pl-8 py-4 space-y-6"
            >
              {notebook.sections.map((section, sIndex) => (
                <SectionItem
                  key={section.id}
                  section={section}
                  isActive={activeSection === section.id}
                  onClick={() => onSectionSelect(section.id)}
                  index={sIndex}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Section Item Component
interface SectionItemProps {
  section: Section;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

const SectionItem: React.FC<SectionItemProps> = ({ section, isActive, onClick, index }) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ x: -10, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="w-full relative group"
    >
      <div
        className="flex items-center gap-4 px-5 py-4 rounded-md transition-all duration-200"
        style={{
          background: isActive ? 'white' : 'transparent',
          boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
          transform: isActive ? 'scale(1.02) rotate(1deg)' : 'scale(1)',
        }}
      >
        {/* Color Tag */}
        <div 
          className="w-3 h-3 rounded-full shadow-sm"
          style={{ background: section.color, border: '1px solid rgba(0,0,0,0.1)' }}
        />
        
        <span 
          className={`flex-1 text-left text-base ${isActive ? 'font-bold text-gray-800' : 'text-gray-600 group-hover:text-gray-800'} truncate`}
          style={{ fontFamily: "'Indie Flower', cursive" }}
        >
          {section.name}
        </span>

        {section.notes.length > 0 && (
          <span className="text-xs text-gray-400 font-mono">
            {section.notes.length}
          </span>
        )}
      </div>
      
      {/* Underline for non-active items on hover */}
      {!isActive && (
        <div 
          className="absolute bottom-2 left-4 right-4 h-px bg-gray-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-30"
        />
      )}
    </motion.button>
  );
};
