'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toolbar, NotePage, Sidebar, PageNavigator } from '@/components';
import { Note, Tool } from '@/types';
import { sampleNotebooks, sampleNotes } from '@/data/sampleData';

export default function NotebookApp() {
  const [notebooks] = useState(sampleNotebooks);
  const [activeNotebook, setActiveNotebook] = useState<string | null>('nb1');
  const [activeSection, setActiveSection] = useState<string | null>('sec1');
  const [currentNotes, setCurrentNotes] = useState<Note[]>(sampleNotes);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [activeTool, setActiveTool] = useState<Tool>('pen');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageDirection, setPageDirection] = useState<'forward' | 'backward'>('forward');

  // Update notes when section changes
  useEffect(() => {
    if (activeNotebook && activeSection) {
      const notebook = notebooks.find((nb) => nb.id === activeNotebook);
      const section = notebook?.sections.find((sec) => sec.id === activeSection);
      if (section) {
        setCurrentNotes(section.notes);
        setCurrentPageIndex(0);
      }
    }
  }, [activeNotebook, activeSection, notebooks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // New note with 'N' key
      if (e.key === 'n' || e.key === 'N') {
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          handleNewNote();
        }
      }
      // Navigate with arrow keys
      if (e.key === 'ArrowLeft') {
        if (currentPageIndex > 0) {
          handlePageChange(currentPageIndex - 1);
        }
      }
      if (e.key === 'ArrowRight') {
        if (currentPageIndex < currentNotes.length - 1) {
          handlePageChange(currentPageIndex + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, currentNotes.length]);

  const currentNote = currentNotes[currentPageIndex];

  const handlePageChange = (newIndex: number) => {
    setPageDirection(newIndex > currentPageIndex ? 'forward' : 'backward');
    setCurrentPageIndex(newIndex);
  };

  const handleNoteUpdate = (updatedNote: Note) => {
    const updatedNotes = currentNotes.map((note) =>
      note.id === updatedNote.id ? updatedNote : note
    );
    setCurrentNotes(updatedNotes);
  };

  const handleNewNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'New Note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      color: 'white',
      lineStyle: 'blue',
      bookmarked: false,
      attachments: [],
      checkboxes: [],
    };
    setCurrentNotes([...currentNotes, newNote]);
    setCurrentPageIndex(currentNotes.length);
  };

  const handleDeleteNote = () => {
    if (currentNotes.length > 1 && currentNote) {
      const confirmed = window.confirm(`Delete "${currentNote.title}"?`);
      if (confirmed) {
        const updatedNotes = currentNotes.filter((note) => note.id !== currentNote.id);
        setCurrentNotes(updatedNotes);
        setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
      }
    }
  };

  const pageVariants = {
    enter: (direction: 'forward' | 'backward') => ({
      rotateY: direction === 'forward' ? 90 : -90,
      opacity: 0,
      scale: 0.8,
      x: direction === 'forward' ? 100 : -100,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      x: 0,
    },
    exit: (direction: 'forward' | 'backward') => ({
      rotateY: direction === 'forward' ? -90 : 90,
      opacity: 0,
      scale: 0.8,
      x: direction === 'forward' ? -100 : 100,
    }),
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient lighting effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        notebooks={notebooks}
        activeNotebook={activeNotebook}
        activeSection={activeSection}
        onNotebookSelect={setActiveNotebook}
        onSectionSelect={setActiveSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Toolbar */}
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onNewNote={handleNewNote}
        onDeleteNote={handleDeleteNote}
      />

      {/* Main Content Area */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-8 py-32">
        <div className="w-full max-w-5xl">
          {currentNotes.length > 0 && currentNote ? (
            <AnimatePresence mode="wait" custom={pageDirection}>
              <motion.div
                key={currentNote.id}
                custom={pageDirection}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  rotateY: { type: 'spring', stiffness: 100, damping: 20 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                  x: { type: 'spring', stiffness: 100, damping: 20 },
                }}
                style={{
                  perspective: '2000px',
                  transformStyle: 'preserve-3d',
                }}
              >
                <NotePage
                  note={currentNote}
                  onUpdate={handleNoteUpdate}
                  activeTool={activeTool}
                />
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32"
            >
              <div className="text-6xl mb-4">📓</div>
              <h2
                className="text-3xl mb-4"
                style={{ fontFamily: "'Caveat', cursive", color: 'var(--paper-white)' }}
              >
                No notes yet
              </h2>
              <p
                className="text-lg opacity-60 mb-8"
                style={{ fontFamily: "'Kalam', cursive", color: 'var(--paper-cream)' }}
              >
                Click the "New Note" button to create your first note
              </p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Page Navigator */}
      {currentNotes.length > 0 && (
        <PageNavigator
          currentPage={currentPageIndex}
          totalPages={currentNotes.length}
          onPageChange={handlePageChange}
        />
      )}

      {/* Floating Help Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl z-50"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
          border: '2px solid rgba(139, 92, 246, 0.3)',
        }}
        title="Help & Tips"
      >
        ❓
      </motion.button>

      {/* Keyboard Shortcuts Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="fixed bottom-24 right-8 px-4 py-2 rounded-lg shadow-md text-xs z-40"
        style={{
          background: 'rgba(253, 253, 248, 0.95)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          fontFamily: "'Indie Flower', cursive",
        }}
      >
        <div className="space-y-1">
          <div><kbd className="px-2 py-1 bg-gray-200 rounded">←</kbd> Previous page</div>
          <div><kbd className="px-2 py-1 bg-gray-200 rounded">→</kbd> Next page</div>
          <div><kbd className="px-2 py-1 bg-gray-200 rounded">N</kbd> New note</div>
        </div>
      </motion.div>
    </div>
  );
}
