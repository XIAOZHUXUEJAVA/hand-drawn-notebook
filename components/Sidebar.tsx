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
  const currentNotebook = notebooks.find((nb) => nb.id === activeNotebook);

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={onToggle}
        className="fixed top-8 left-8 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl"
        style={{
          background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
          border: '2px solid rgba(139, 69, 19, 0.3)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? '📕' : '📖'}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 h-full w-80 z-40 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #3e2723 0%, #5d4037 100%)',
              boxShadow: '4px 0 24px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Leather texture overlay */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Binding rings */}
            <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-evenly items-center py-8">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, #e0e0e0, #a0a0a0)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(255, 255, 255, 0.3)',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative h-full overflow-y-auto pl-16 pr-6 py-8">
              {/* Header */}
              <h2
                className="text-3xl mb-6 text-amber-100"
                style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
              >
                My Notebooks
              </h2>

              {/* Notebooks List */}
              <div className="space-y-4">
                {notebooks.map((notebook) => (
                  <div key={notebook.id} className="space-y-2">
                    {/* Notebook */}
                    <motion.button
                      onClick={() => onNotebookSelect(notebook.id)}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg
                        transition-all duration-200
                        ${activeNotebook === notebook.id ? 'shadow-lg' : 'shadow-md'}
                      `}
                      style={{
                        background: activeNotebook === notebook.id
                          ? notebook.coverColor
                          : `${notebook.coverColor}cc`,
                        border: '2px solid rgba(0, 0, 0, 0.2)',
                      }}
                      whileHover={{ x: 4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📓</span>
                        <span
                          className="font-semibold text-white"
                          style={{ fontFamily: "'Patrick Hand', cursive", fontSize: '18px' }}
                        >
                          {notebook.name}
                        </span>
                      </div>
                    </motion.button>

                    {/* Sections (Tabs) */}
                    {activeNotebook === notebook.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-4 space-y-1 overflow-hidden"
                      >
                        {notebook.sections.map((section, index) => (
                          <SectionTab
                            key={section.id}
                            section={section}
                            isActive={activeSection === section.id}
                            onClick={() => onSectionSelect(section.id)}
                            index={index}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Notebook Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 w-full px-4 py-3 rounded-lg border-2 border-dashed border-amber-200/30 text-amber-100 flex items-center justify-center gap-2"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                <span className="text-2xl">➕</span>
                <span>New Notebook</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/20 z-30"
          />
        )}
      </AnimatePresence>
    </>
  );
};

interface SectionTabProps {
  section: Section;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

const SectionTab: React.FC<SectionTabProps> = ({ section, isActive, onClick, index }) => {
  return (
    <motion.button
      onClick={onClick}
      className="relative w-full group"
      whileHover={{ x: 8 }}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* Tab shape */}
      <div
        className={`
          relative px-4 py-2 rounded-r-lg
          transition-all duration-200
          ${isActive ? 'pr-6' : 'pr-4'}
        `}
        style={{
          background: section.color,
          boxShadow: isActive
            ? '2px 2px 8px rgba(0, 0, 0, 0.3)'
            : '1px 1px 4px rgba(0, 0, 0, 0.2)',
          borderLeft: '4px solid rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="flex items-center gap-2">
          {section.icon && <span className="text-lg">{section.icon}</span>}
          <span
            className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/80'}`}
            style={{ fontFamily: "'Indie Flower', cursive" }}
          >
            {section.name}
          </span>
          <span className="text-xs text-white/60 ml-auto">
            {section.notes.length}
          </span>
        </div>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeSectionIndicator"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white"
          />
        )}
      </div>
    </motion.button>
  );
};
