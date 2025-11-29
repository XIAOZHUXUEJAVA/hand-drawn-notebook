"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Toolbar,
  NotePage,
  PageNavigator,
  Sidebar,
  UserButton,
  useToast,
} from "@/components";
import { Note, Tool, Notebook } from "@/types";
import { sampleNotebooks, sampleNotes } from "@/data/sampleData";
import { updateNotes } from "@/lib/api/notes";
import { createClient } from "@/lib/supabase/client";
import {
  createNotebook,
  createSection,
  getNotebooks,
} from "@/lib/api/notebooks";

export default function NotebookApp() {
  const [notebooks, setNotebooks] = useState<Notebook[]>(sampleNotebooks);
  const [activeNotebook, setActiveNotebook] = useState<string | null>("nb1");
  const [activeSection, setActiveSection] = useState<string | null>("sec1");
  // Initialize state with function to avoid hydration mismatch, or use useEffect
  const [currentNotes, setCurrentNotes] = useState<Note[]>(sampleNotes);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [activeTool, setActiveTool] = useState<Tool>("pen");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageDirection, setPageDirection] = useState<"forward" | "backward">(
    "forward"
  );
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const toast = useToast();

  // localStorage 中存储的 Note 类型（日期为字符串）
  interface StoredNote {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    color: "white" | "cream" | "yellow" | "aged";
    lineStyle: "blue" | "gray" | "none";
    bookmarked: boolean;
    attachments: Note["attachments"];
    checkboxes: Note["checkboxes"];
  }

  // Load notes from local storage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("notebook_notes");
    if (savedNotes) {
      try {
        const parsed: StoredNote[] = JSON.parse(savedNotes);
        // Convert date strings back to Date objects
        const hydratedNotes: Note[] = parsed.map((note) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setCurrentNotes(hydratedNotes);
      } catch (e) {
        console.error("Failed to load notes", e);
      }
    }
  }, []);

  // Update notes when section changes
  useEffect(() => {
    if (activeNotebook && activeSection) {
      const notebook = notebooks.find((nb) => nb.id === activeNotebook);
      const section = notebook?.sections.find(
        (sec) => sec.id === activeSection
      );
      if (section) {
        setCurrentNotes(section.notes);
        setCurrentPageIndex(0);
      }
    }
  }, [activeNotebook, activeSection, notebooks]);

  const currentNote = currentNotes[currentPageIndex];

  const handlePageChange = (newIndex: number) => {
    setPageDirection(newIndex > currentPageIndex ? "forward" : "backward");
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
      title: "New Note",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      color: "white",
      lineStyle: "blue",
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
        const updatedNotes = currentNotes.filter(
          (note) => note.id !== currentNote.id
        );
        setCurrentNotes(updatedNotes);
        setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
      }
    }
  };

  const handleAddImage = (file: File) => {
    if (!currentNote) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setPendingImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const pageVariants = {
    enter: (direction: "forward" | "backward") => ({
      rotateY: direction === "forward" ? 90 : -90,
      opacity: 0,
      scale: 0.8,
      x: direction === "forward" ? 100 : -100,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      x: 0,
    },
    exit: (direction: "forward" | "backward") => ({
      rotateY: direction === "forward" ? -90 : 90,
      opacity: 0,
      scale: 0.8,
      x: direction === "forward" ? -100 : 100,
    }),
  };

  const handleNotebookSelect = (notebookId: string) => {
    // 如果点击的是已经激活的 notebook，则收起它
    if (activeNotebook === notebookId) {
      setActiveNotebook(null);
      setActiveSection(null);
    } else {
      // 否则展开新的 notebook
      setActiveNotebook(notebookId);
      const notebook = notebooks.find((nb) => nb.id === notebookId);
      if (notebook && notebook.sections.length > 0) {
        setActiveSection(notebook.sections[0].id);
      }
    }
  };

  const handleSectionSelect = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  // 刷新 notebooks 数据（从 Supabase 或使用本地数据）
  const refreshNotebooks = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { notebooks: dbNotebooks, error } = await getNotebooks();
      if (!error && dbNotebooks.length > 0) {
        setNotebooks(dbNotebooks);
        // 如果当前没有选中的 notebook，选中第一个
        if (!activeNotebook && dbNotebooks.length > 0) {
          setActiveNotebook(dbNotebooks[0].id);
          if (dbNotebooks[0].sections.length > 0) {
            setActiveSection(dbNotebooks[0].sections[0].id);
          }
        }
      }
    }
  };

  // 创建 Notebook
  const handleCreateNotebook = async (name: string, color: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in to create notebooks");
      return;
    }

    const { notebook, error } = await createNotebook(name, color);
    if (error) {
      throw new Error(error);
    }

    if (notebook) {
      setNotebooks((prev) => [...prev, notebook]);
      setActiveNotebook(notebook.id);
      setActiveSection(null);
    }
  };

  // 创建 Section
  const handleCreateSection = async (
    notebookId: string,
    name: string,
    color: string
  ) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please sign in to create sections");
      return;
    }

    const { section, error } = await createSection(notebookId, name, color);
    if (error) {
      throw new Error(error);
    }

    if (section) {
      setNotebooks((prev) =>
        prev.map((nb) => {
          if (nb.id === notebookId) {
            return { ...nb, sections: [...nb.sections, section] };
          }
          return nb;
        })
      );
      setActiveSection(section.id);
    }
  };

  // 初始化时加载 notebooks
  useEffect(() => {
    refreshNotebooks();
  }, []);

  const handleSaveNote = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // 未登录时保存到 localStorage
      localStorage.setItem("notebook_notes", JSON.stringify(currentNotes));
      toast.info("Saved locally. Sign in to sync to cloud.");
      return;
    }

    // 已登录时保存到 Supabase
    const { success, error } = await updateNotes(currentNotes);

    if (success) {
      toast.success("Notes saved to cloud!");
    } else {
      // 失败时回退到 localStorage
      localStorage.setItem("notebook_notes", JSON.stringify(currentNotes));
      toast.error(`Cloud save failed: ${error}. Saved locally.`);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient lighting effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          }}
        />
      </div>

      {/* User Button - 右上角 */}
      <div className="fixed top-6 right-6 z-50">
        <UserButton />
      </div>

      {/* Sidebar */}
      <Sidebar
        notebooks={notebooks}
        activeNotebook={activeNotebook}
        activeSection={activeSection}
        onNotebookSelect={handleNotebookSelect}
        onSectionSelect={handleSectionSelect}
        onCreateNotebook={handleCreateNotebook}
        onCreateSection={handleCreateSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Toolbar */}
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onNewNote={handleNewNote}
        onDeleteNote={handleDeleteNote}
        onSaveNote={handleSaveNote}
        onAddImage={handleAddImage}
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
                  rotateY: { type: "spring", stiffness: 100, damping: 20 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                  x: { type: "spring", stiffness: 100, damping: 20 },
                }}
                style={{
                  perspective: "2000px",
                  transformStyle: "preserve-3d",
                }}
              >
                <NotePage
                  note={currentNote}
                  onUpdate={handleNoteUpdate}
                  activeTool={activeTool}
                  pendingImage={pendingImage}
                  onImageInserted={() => setPendingImage(null)}
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
                style={{
                  fontFamily: "'Caveat', cursive",
                  color: "var(--paper-white)",
                }}
              >
                No notes yet
              </h2>
              <p
                className="text-lg opacity-60 mb-8"
                style={{
                  fontFamily: "'Kalam', cursive",
                  color: "var(--paper-cream)",
                }}
              >
                Click the &quot;New Note&quot; button to create your first note
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
          background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
          border: "2px solid rgba(139, 92, 246, 0.3)",
        }}
        title="Help & Tips"
      >
        ❓
      </motion.button>
    </div>
  );
}
