import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paper } from './Paper';
import { Note, Tool } from '@/types';

interface NotePageProps {
  note: Note;
  onUpdate: (note: Note) => void;
  activeTool: Tool;
}

export const NotePage: React.FC<NotePageProps> = ({
  note,
  onUpdate,
  activeTool,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const editorRef = React.useRef<HTMLDivElement>(null);
  const lastToolRef = React.useRef<Tool | undefined>(activeTool);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Legacy handler, kept for safety but not used by contentEditable
  };

  // Apply tool style when tool changes or editing starts
  React.useEffect(() => {
    if (!editorRef.current) return;

    // If tool hasn't changed, don't do anything (unless we just started editing)
    // But we want to ensure style is applied even if we just clicked to edit
    
    const applyStyle = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      
      // Check if we are inside the editor
      if (!editorRef.current?.contains(range.commonAncestorContainer)) return;

      // Attempt to break out of current span if we are at the end
      const container = range.commonAncestorContainer;
      const parentElement = container.nodeType === 3 ? container.parentElement : container as HTMLElement;

      // If we are inside a span that is inside the editor
      if (parentElement && parentElement.tagName === 'SPAN' && editorRef.current.contains(parentElement) && parentElement !== editorRef.current) {
          // Check if we are at the end of this span
          // Simple check: if container is a text node, and offset is length, and it's the last child
          const isAtEnd = (container.nodeType === 3 && range.endOffset === (container as Text).length && container === parentElement.lastChild) ||
                          (range.comparePoint(parentElement, parentElement.childNodes.length) === 0);
          
          if (isAtEnd) {
              // Move range to after the span
              range.setStartAfter(parentElement);
              range.collapse(true);
          }
      }

      // Create a span with the new style
      const span = document.createElement('span');
      const style = getTextStyleForTool(activeTool);
      
      Object.assign(span.style, style);

      if (!selection.isCollapsed) {
          // If text is selected, wrap it in the span
          const content = range.extractContents();
          span.appendChild(content);
          range.insertNode(span);
          
          // Select the new span content
          range.selectNodeContents(span);
      } else {
          // If no text is selected, insert an empty span for typing
          span.innerHTML = '&#8203;'; // Zero-width space
          range.insertNode(span);
          
          // Move cursor inside the span
          range.setStart(span, 1);
          range.setEnd(span, 1);
      }
      
      selection.removeAllRanges();
      selection.addRange(range);
    };

    // We need to wait for the selection to be available if we just switched to edit mode
    if (activeTool !== lastToolRef.current) {
        applyStyle();
        lastToolRef.current = activeTool;
    }
  }, [activeTool]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...note,
      title: e.target.value,
      updatedAt: new Date(),
    });
  };

  // Initialize editor content
  React.useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== note.content) {
         // Only update if content is significantly different (e.g. note switch)
         // or if we are not editing to avoid cursor jumps
         // For simplicity, we update when note.id changes
         editorRef.current.innerHTML = note.content || '';
      }
    }
  }, [note.id]); // Only re-run when note ID changes

  const toggleBookmark = () => {
    onUpdate({
      ...note,
      bookmarked: !note.bookmarked,
    });
  };

  // Get text style based on active tool
  const getTextStyleForTool = (tool: Tool) => {
    switch (tool) {
      case 'pen':
        return {
          color: '#0f172a',  // Dark blue-black
          fontWeight: 700,    // Bold
          opacity: 1,         // Fully opaque
          textShadow: 'none',
          background: 'transparent',
          WebkitTextStroke: '0.5px #0f172a', // Thicker stroke
        };
      case 'ink':
        return {
          color: '#1a1a1a',   // Deep black ink
          fontWeight: 500,     // Medium bold
          opacity: 1,          // Fully opaque
          textShadow: '0 0 1px rgba(0,0,0,0.1)', // Subtle bleed effect
          background: 'transparent',
          WebkitTextStroke: '0.2px #1a1a1a', // Slight stroke for definition
        };
      case 'pencil':
        return {
          color: '#64748b',  // Darker gray (slate-500)
          fontWeight: 500,    // Slightly heavier weight
          opacity: 0.9,       // More opaque
          textShadow: 'none',
          background: 'transparent',
          WebkitTextStroke: '0px',
        };
      case 'highlighter':
        return {
          color: 'inherit',   // Keep original text color
          fontWeight: 'inherit', // Keep original font weight
          opacity: 1,
          textShadow: 'none',
          background: 'rgba(255, 255, 0, 0.4)', // Classic yellow highlighter overlay
          WebkitTextStroke: '0px',
        };
      case 'eraser':
        return {
          color: '#4b5563',  // Dark gray (visible but distinct)
          fontWeight: 400,
          opacity: 0.8,       // Slightly faded
          textShadow: 'none',
          background: 'transparent',
          WebkitTextStroke: '0px',
          textDecoration: 'line-through', // Strikethrough effect
          textDecorationColor: 'currentColor',
        };
      default:
        return {
          color: 'var(--ink-black)',
          fontWeight: 400,
          opacity: 1,
          textShadow: 'none',
          background: 'transparent',
          WebkitTextStroke: '0px',
        };
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <Paper
        color={note.color}
        lineStyle={note.lineStyle}
        className="min-h-[800px]"
        animate={true}
        style={{ paddingLeft: '80px', paddingRight: '64px', paddingTop: '64px', paddingBottom: '64px' }}
      >
        {/* Bookmark Ribbon */}
        <AnimatePresence>
          {note.bookmarked && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="absolute -top-0 right-20 w-12 h-32 cursor-pointer z-20"
              onClick={toggleBookmark}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
                boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Bookmark Button (when not bookmarked) */}
        {!note.bookmarked && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleBookmark}
            className="absolute top-4 right-4 text-2xl opacity-40 hover:opacity-100 transition-opacity"
            title="Add Bookmark"
          >
            🔖
          </motion.button>
        )}

        {/* Title */}
        <div className="mb-8 relative z-10">
            <input
              type="text"
              value={note.title}
              onChange={handleTitleChange}
              className="w-full bg-transparent border-none outline-none text-4xl font-bold handwriting-cursor"
              style={{
                fontFamily: "'Caveat', cursive",
                color: 'var(--ink-black)',
                fontWeight: 700,
              }}
              placeholder="Untitled Note"
              autoFocus
            />
          
          {/* Hand-drawn underline */}
          <svg
            className="w-full h-2 mt-2"
            viewBox="0 0 400 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4 Q100 2, 200 4 T398 4"
              stroke="var(--ink-black)"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Date */}
        <div className="mb-6 text-sm opacity-60 relative z-10" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          {new Date(note.updatedAt).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>

        {/* Content Editor */}
        <div className="relative min-h-[600px] z-10">
          <div
            ref={editorRef}
            contentEditable={true}
            suppressContentEditableWarning
            className="w-full min-h-[600px] outline-none text-xl leading-relaxed handwriting-cursor"
            style={{
              fontFamily: "'Kalam', cursive",
              color: 'var(--ink-black)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
            onInput={(e) => {
              const content = e.currentTarget.innerHTML;
              onUpdate({ ...note, content: content, updatedAt: new Date() });
            }}
            onClick={(e) => {
              // Ensure we have a style applied when clicking to edit
              if (editorRef.current) {
                 const selection = window.getSelection();
                 if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    // Check if the cursor is inside a styled span
                    let parent = range.commonAncestorContainer;
                    if (parent.nodeType === 3) parent = parent.parentElement as Node;
                    
                    const isStyled = parent.nodeName === 'SPAN' && (parent as HTMLElement).style.length > 0;
                    
                    if (!isStyled && editorRef.current.contains(parent)) {
                       // If not inside a styled span, insert one
                       // But only if we are not selecting text
                       if (selection.isCollapsed) {
                           // Trigger style application
                           lastToolRef.current = undefined; // Force update
                           // We need to trigger the effect, but we can't easily force it from here without state
                           // So we'll manually call the logic if needed, or rely on tool change
                           // For now, let's just rely on the user selecting a tool or typing
                       }
                    }
                 }
              }
            }}
          />
          
          {/* Placeholder */}
          {!note.content && (
            <div 
              className="absolute top-0 left-0 pointer-events-none opacity-40 text-xl"
              style={{ fontFamily: "'Kalam', cursive" }}
            >
              Start writing...
            </div>
          )}
        </div>

        {/* Checkboxes */}
        {note.checkboxes && note.checkboxes.length > 0 && (
          <div className="mt-8 space-y-2 relative z-10">
            {note.checkboxes.map((checkbox) => (
              <div key={checkbox.id} className="flex items-center gap-3 group">
                <div 
                  className={`
                    w-5 h-5 border-2 rounded cursor-pointer transition-colors
                    ${checkbox.checked ? 'bg-green-500 border-green-500' : 'border-gray-400 hover:border-gray-600'}
                  `}
                  onClick={() => {
                    const updatedCheckboxes = note.checkboxes.map(cb => 
                      cb.id === checkbox.id ? { ...cb, checked: !cb.checked } : cb
                    );
                    onUpdate({ ...note, checkboxes: updatedCheckboxes });
                  }}
                >
                  {checkbox.checked && (
                    <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-current p-0.5">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  )}
                </div>
                <span 
                  className={`text-lg transition-all ${checkbox.checked ? 'line-through opacity-50' : ''}`}
                  style={{ fontFamily: "'Kalam', cursive" }}
                >
                  {checkbox.text}
                </span>
                <button 
                  onClick={() => {
                    const updatedCheckboxes = note.checkboxes.filter(cb => cb.id !== checkbox.id);
                    onUpdate({ ...note, checkboxes: updatedCheckboxes });
                  }}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Attachments */}
        {note.attachments && note.attachments.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
            {note.attachments.map((attachment) => (
              <div key={attachment.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                {attachment.type === 'image' && (
                  <img src={attachment.url} alt="Attachment" className="w-full h-auto" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => {
                      const updatedAttachments = note.attachments.filter(att => att.id !== attachment.id);
                      onUpdate({ ...note, attachments: updatedAttachments });
                    }}
                    className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Paper>
    </div>
  );
};
