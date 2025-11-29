"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Notebook, Section } from "@/types";
import { useToast } from "./Toast";

interface SidebarProps {
  notebooks: Notebook[];
  activeNotebook: string | null;
  activeSection: string | null;
  onNotebookSelect: (notebookId: string) => void;
  onSectionSelect: (sectionId: string) => void;
  onCreateNotebook: (name: string, color: string) => Promise<void>;
  onCreateSection: (
    notebookId: string,
    name: string,
    color: string
  ) => Promise<void>;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notebooks,
  activeNotebook,
  activeSection,
  onNotebookSelect,
  onSectionSelect,
  onCreateNotebook,
  onCreateSection,
  isOpen,
  onToggle,
}) => {
  const [showNewNotebook, setShowNewNotebook] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState("");
  const [newNotebookColor, setNewNotebookColor] = useState("#3b82f6");
  const [isCreating, setIsCreating] = useState(false);
  const toast = useToast();

  const notebookColors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#06b6d4", // cyan
    "#84cc16", // lime
  ];

  const handleCreateNotebook = async () => {
    if (!newNotebookName.trim()) {
      toast.error("Please enter a notebook name");
      return;
    }
    setIsCreating(true);
    try {
      await onCreateNotebook(newNotebookName.trim(), newNotebookColor);
      setNewNotebookName("");
      setShowNewNotebook(false);
      toast.success("Notebook created!");
    } catch {
      toast.error("Failed to create notebook");
    } finally {
      setIsCreating(false);
    }
  };

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
              width: "60px",
              height: "60px",
              perspective: "1000px",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="relative w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:-rotate-6"
              style={{
                background: "linear-gradient(135deg, #8b4513 0%, #a0522d 100%)",
                borderRadius: "8px 4px 4px 8px",
                boxShadow:
                  "2px 4px 8px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.2)",
                border: "1px solid #6d3710",
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
              mass: 1.2,
            }}
            className="fixed left-4 top-4 bottom-4 w-[320px] z-40"
            style={{
              perspective: "2000px",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Main Cardstock Body */}
            <div
              className="relative h-full overflow-hidden flex flex-col rounded-xl"
              style={{
                background: "#f2eecb", // Manilla folder color
                backgroundImage: `
                  url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E"),
                  linear-gradient(to right, rgba(0,0,0,0.05) 0%, transparent 5%, transparent 95%, rgba(0,0,0,0.02) 100%)
                `,
                boxShadow:
                  "10px 0 25px rgba(0,0,0,0.15), 2px 0 5px rgba(0,0,0,0.1)",
                borderRight: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              {/* Close Button */}
              <button
                onClick={onToggle}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-gray-800 transition-all duration-200 hover:scale-110 z-20 rounded-full hover:bg-white/50"
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

              {/* Content Area - 重构的布局 */}
              <div
                className="flex-1 overflow-y-auto"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#8b4513 rgba(0,0,0,0.1)",
                }}
              >
                <div className="px-5 pt-14 pb-6">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="relative inline-block">
                      <h2
                        className="text-2xl text-[#2c2c2c] relative z-10"
                        style={{
                          fontFamily: "'Caveat', cursive",
                          fontWeight: 700,
                          transform: "rotate(-2deg)",
                        }}
                      >
                        My Notebooks
                      </h2>
                      {/* Highlighter effect */}
                      <div
                        className="absolute bottom-1 left-0 w-[110%] h-3 -z-0 -rotate-1 opacity-60"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, #ffeb3b 10%, #ffeb3b 90%, transparent 100%)",
                          borderRadius: "4px",
                          filter: "blur(1px)",
                        }}
                      />
                    </div>
                    <p
                      className="mt-2 text-gray-500 text-sm"
                      style={{ fontFamily: "'Indie Flower', cursive" }}
                    >
                      Select a collection to start writing...
                    </p>
                  </div>

                  {/* Notebooks List */}
                  <div className="flex flex-col gap-3 pb-4">
                    {notebooks.map((notebook, nbIndex) => (
                      <NotebookItem
                        key={notebook.id}
                        notebook={notebook}
                        isActive={activeNotebook === notebook.id}
                        onSelect={onNotebookSelect}
                        activeSection={activeSection}
                        onSectionSelect={onSectionSelect}
                        onCreateSection={onCreateSection}
                        index={nbIndex}
                      />
                    ))}

                    {/* Add Notebook Button / Form */}
                    <div className="mt-6">
                      <AnimatePresence mode="wait">
                        {showNewNotebook ? (
                          <motion.div
                            key="form"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 bg-white rounded-xl shadow-md border border-gray-200"
                          >
                            <input
                              type="text"
                              value={newNotebookName}
                              onChange={(e) =>
                                setNewNotebookName(e.target.value)
                              }
                              placeholder="Notebook name..."
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none mb-3"
                              style={{ fontFamily: "'Kalam', cursive" }}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleCreateNotebook();
                                if (e.key === "Escape")
                                  setShowNewNotebook(false);
                              }}
                            />
                            {/* Color picker */}
                            <div className="flex gap-2 mb-3 flex-wrap">
                              {notebookColors.map((color) => (
                                <button
                                  key={color}
                                  onClick={() => setNewNotebookColor(color)}
                                  className={`w-6 h-6 rounded-full transition-transform ${
                                    newNotebookColor === color
                                      ? "scale-125 ring-2 ring-offset-1 ring-gray-400"
                                      : ""
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCreateNotebook}
                                disabled={isCreating}
                                className="flex-1 py-2 rounded-lg text-white font-medium disabled:opacity-50"
                                style={{
                                  backgroundColor: newNotebookColor,
                                  fontFamily: "'Patrick Hand', cursive",
                                }}
                              >
                                {isCreating ? "Creating..." : "Create"}
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowNewNotebook(false)}
                                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600"
                                style={{
                                  fontFamily: "'Patrick Hand', cursive",
                                }}
                              >
                                Cancel
                              </motion.button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.button
                            key="button"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowNewNotebook(true)}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full px-5 py-2.5 border-2 border-dashed border-gray-400 rounded-lg text-gray-500 hover:border-gray-600 hover:text-gray-700 transition-colors flex items-center justify-center gap-2 hover:bg-white/50"
                            style={{
                              fontFamily: "'Patrick Hand', cursive",
                              fontSize: "0.95rem",
                            }}
                          >
                            <span className="text-lg">+</span>
                            <span>Create New Notebook</span>
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plastic Tab on the right edge (Visual flair) */}
            <div
              className="absolute -right-3 top-24 w-4 h-16 rounded-r-md opacity-80"
              style={{
                background: "linear-gradient(90deg, #ff6b6b, #ee5253)",
                boxShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                zIndex: -1,
              }}
            />
            <div
              className="absolute -right-3 top-44 w-4 h-16 rounded-r-md opacity-80"
              style={{
                background: "linear-gradient(90deg, #4ecdc4, #45b7d1)",
                boxShadow: "2px 2px 4px rgba(0,0,0,0.2)",
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
  onCreateSection: (
    notebookId: string,
    name: string,
    color: string
  ) => Promise<void>;
  index: number;
}

const NotebookItem: React.FC<NotebookItemProps> = ({
  notebook,
  isActive,
  onSelect,
  activeSection,
  onSectionSelect,
  onCreateSection,
  index,
}) => {
  const [showNewSection, setShowNewSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionColor, setNewSectionColor] = useState("#60a5fa");
  const [isCreating, setIsCreating] = useState(false);
  const toast = useToast();

  const sectionColors = [
    "#60a5fa",
    "#34d399",
    "#fbbf24",
    "#f87171",
    "#a78bfa",
    "#f472b6",
    "#22d3ee",
    "#a3e635",
  ];

  const handleCreateSection = async () => {
    if (!newSectionName.trim()) {
      toast.error("Please enter a section name");
      return;
    }
    setIsCreating(true);
    try {
      await onCreateSection(
        notebook.id,
        newSectionName.trim(),
        newSectionColor
      );
      setNewSectionName("");
      setShowNewSection(false);
      toast.success("Section created!");
    } catch {
      toast.error("Failed to create section");
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* The Notebook "Cover" / Folder Tab */}
      <div
        onClick={() => onSelect(notebook.id)}
        className="cursor-pointer relative z-10"
      >
        <div
          className="relative px-4 py-3.5 rounded-xl border border-black/10 overflow-hidden transition-all duration-300"
          style={{
            background: isActive ? notebook.coverColor : "white",
            boxShadow: isActive
              ? "0 8px 24px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)"
              : "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          {/* Paper texture overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] mix-blend-multiply pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            {/* Icon Container */}
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/30 shadow-inner border border-white/20 flex-shrink-0">
              {/* Notebook Icon SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-4 h-4 text-gray-700"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>

            <div className="flex-1 overflow-hidden min-w-0">
              <h3
                className={`text-lg font-bold leading-tight mb-0.5 truncate ${
                  isActive ? "text-white" : "text-gray-800"
                }`}
                style={{
                  fontFamily: "'Caveat', cursive",
                  textShadow: isActive ? "1px 1px 0 rgba(0,0,0,0.1)" : "none",
                }}
              >
                {notebook.name}
              </h3>
              <p
                className={`text-xs ${
                  isActive ? "text-white/75" : "text-gray-500"
                } truncate`}
                style={{ fontFamily: "'Indie Flower', cursive" }}
              >
                {notebook.sections.length} sections •{" "}
                {notebook.sections.reduce((acc, s) => acc + s.notes.length, 0)}{" "}
                notes
              </p>
            </div>

            {/* Chevron */}
            <motion.div
              animate={{ rotate: isActive ? 90 : 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.5,
              }}
              style={{ willChange: "transform" }}
              className={`flex-shrink-0 ${
                isActive ? "text-white" : "text-gray-400"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
            background: "rgba(255,255,255,0.6)",
            transform: "rotate(-2deg)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            backdropFilter: "blur(2px)",
          }}
        />
      </div>

      {/* Sections List (The "Pages" inside) */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{
              maxHeight: 500,
              opacity: 1,
              transition: {
                maxHeight: {
                  type: "spring",
                  stiffness: 400,
                  damping: 35,
                  mass: 0.6,
                },
                opacity: {
                  duration: 0.15,
                  ease: "easeOut",
                },
              },
            }}
            exit={{
              maxHeight: 0,
              opacity: 0,
              transition: {
                maxHeight: {
                  type: "spring",
                  stiffness: 400,
                  damping: 35,
                  mass: 0.6,
                },
                opacity: {
                  duration: 0.1,
                  ease: "easeIn",
                },
              },
            }}
            style={{
              overflow: "hidden",
              willChange: "max-height, opacity",
              transform: "translateZ(0)", // 强制 GPU 加速
            }}
            className="mt-3"
          >
            <div className="py-1 ml-4 pl-4 border-l-2 border-dashed border-gray-300">
              <div className="flex flex-col gap-2">
                {notebook.sections.map((section, sIndex) => (
                  <SectionItem
                    key={section.id}
                    section={section}
                    isActive={activeSection === section.id}
                    onClick={() => onSectionSelect(section.id)}
                    index={sIndex}
                  />
                ))}

                {/* Add Section Button / Form */}
                <AnimatePresence mode="wait">
                  {showNewSection ? (
                    <motion.div
                      key="section-form"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="p-3 bg-white rounded-lg shadow-sm border border-gray-200"
                    >
                      <input
                        type="text"
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        placeholder="Section name..."
                        className="w-full px-2 py-1.5 rounded border border-gray-300 focus:border-blue-500 focus:outline-none text-sm mb-2"
                        style={{ fontFamily: "'Indie Flower', cursive" }}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCreateSection();
                          if (e.key === "Escape") setShowNewSection(false);
                        }}
                      />
                      <div className="flex gap-1.5 mb-2 flex-wrap">
                        {sectionColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setNewSectionColor(color)}
                            className={`w-5 h-5 rounded-full transition-transform ${
                              newSectionColor === color
                                ? "scale-125 ring-2 ring-offset-1 ring-gray-300"
                                : ""
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCreateSection}
                          disabled={isCreating}
                          className="flex-1 py-1.5 rounded text-white text-sm font-medium disabled:opacity-50"
                          style={{
                            backgroundColor: newSectionColor,
                            fontFamily: "'Patrick Hand', cursive",
                          }}
                        >
                          {isCreating ? "..." : "Add"}
                        </button>
                        <button
                          onClick={() => setShowNewSection(false)}
                          className="px-3 py-1.5 rounded bg-gray-200 text-gray-600 text-sm"
                          style={{ fontFamily: "'Patrick Hand', cursive" }}
                        >
                          ✕
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="section-button"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowNewSection(true)}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors"
                      style={{ fontFamily: "'Indie Flower', cursive" }}
                    >
                      <span className="text-lg">+</span>
                      <span className="text-sm">Add section</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
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

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  isActive,
  onClick,
  index,
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      className="group text-left"
    >
      <div
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
          isActive ? "bg-white shadow-sm" : "hover:bg-white/40"
        }`}
      >
        {/* Color Tag */}
        <div
          className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
          style={{
            background: section.color,
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        />

        <span
          className={`text-base ${
            isActive
              ? "font-semibold text-gray-800"
              : "text-gray-600 group-hover:text-gray-800"
          }`}
          style={{ fontFamily: "'Indie Flower', cursive" }}
        >
          {section.name}
        </span>

        {section.notes.length > 0 && (
          <span className="text-sm text-gray-400 font-mono ml-auto">
            {section.notes.length}
          </span>
        )}
      </div>
    </motion.button>
  );
};
