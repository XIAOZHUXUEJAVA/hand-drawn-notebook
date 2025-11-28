'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tool } from '@/types';

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  onNewNote: () => void;
  onDeleteNote: () => void;
  onAddImage: (file: File) => void;
}

const tools: { id: Tool; label: string; icon: string; color: string }[] = [
  { id: 'pen', label: 'Pen', icon: '🖊️', color: '#1e3a8a' },
  { id: 'ink', label: 'Ink', icon: '✒️', color: '#000000' },
  { id: 'pencil', label: 'Pencil', icon: '✏️', color: '#6b7280' },
  { id: 'highlighter', label: 'Highlighter', icon: '🖍️', color: '#fbbf24' },
  { id: 'eraser', label: 'Eraser', icon: '🧹', color: '#ef4444' },
  { id: 'select', label: 'Select', icon: '👆', color: '#8b5cf6' },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  onToolChange,
  onNewNote,
  onDeleteNote,
  onAddImage,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddImage(file);
    }
    // Reset input so same file can be selected again
    if (e.target) e.target.value = '';
  };

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="flex items-center gap-2 px-6 py-3 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 100%)',
          boxShadow: 'inset 0 0 0 2px rgba(139, 69, 19, 0.3), var(--shadow-deep)',
        }}
      >
        {/* New Note Button */}
        <ToolButton
          icon="📝"
          label="New Note"
          onClick={onNewNote}
          color="#10b981"
        />

        <div className="w-px h-8 bg-white/20 mx-2" />

        {/* Tools */}
        {tools.map((tool) => (
          <ToolButton
            key={tool.id}
            icon={tool.icon}
            label={tool.label}
            onClick={() => onToolChange(tool.id)}
            isActive={activeTool === tool.id}
            color={tool.color}
          />
        ))}

        <div className="w-px h-8 bg-white/20 mx-2" />

        {/* Image Upload Button */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <ToolButton
          icon="🖼️"
          label="Add Image"
          onClick={() => fileInputRef.current?.click()}
          color="#3b82f6"
        />

        {/* Delete Button */}
        <ToolButton
          icon="🗑️"
          label="Delete"
          onClick={onDeleteNote}
          color="#ef4444"
        />
      </motion.div>
    </div>
  );
};

interface ToolButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  color?: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  icon,
  label,
  onClick,
  isActive = false,
  color = '#6b7280',
}) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative group
        w-12 h-12 rounded-full
        flex items-center justify-center
        text-2xl
        transition-all duration-200
        ${isActive ? 'shadow-lg' : 'shadow-md'}
      `}
      style={{
        backgroundColor: isActive ? color : '#fdfdf8',
        border: `2px solid ${isActive ? 'white' : 'rgba(0, 0, 0, 0.1)'}`,
        boxShadow: isActive 
          ? `0 4px 12px ${color}40, inset 0 2px 4px rgba(255, 255, 255, 0.3)`
          : '0 2px 8px rgba(0, 0, 0, 0.15)',
      }}
      title={label}
    >
      <span className={`filter ${isActive ? 'brightness-0 invert' : ''}`}>
        {icon}
      </span>

      {/* Tooltip */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {label}
        </div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="activeToolIndicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
};
