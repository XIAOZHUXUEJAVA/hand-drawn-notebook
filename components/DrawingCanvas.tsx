'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Tool } from '@/types';

interface DrawingCanvasProps {
  activeTool: Tool;
  isEditing: boolean;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ activeTool, isEditing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      
      // Save current content before resizing
      const imageData = imageDataRef.current;
      
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Restore content after resizing
      if (imageData) {
        ctx.putImageData(imageData, 0, 0);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    setContext(ctx);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Save canvas content periodically
  useEffect(() => {
    if (!context || !canvasRef.current) return;
    
    const saveContent = () => {
      try {
        imageDataRef.current = context.getImageData(
          0, 
          0, 
          canvasRef.current!.width, 
          canvasRef.current!.height
        );
      } catch (e) {
        // Ignore errors
      }
    };

    const interval = setInterval(saveContent, 100);
    return () => clearInterval(interval);
  }, [context]);

  const getToolSettings = (tool: Tool) => {
    switch (tool) {
      case 'pen':
        return { 
          color: '#0f172a',  // Very dark blue-black (slate-900)
          lineWidth: 4,       // Thicker line
          globalAlpha: 1,     // Fully opaque
          lineCap: 'round' as CanvasLineCap,
          lineJoin: 'round' as CanvasLineJoin,
        };
      case 'ink':
        return { 
          color: '#1a1a1a',  // Deep black
          lineWidth: 3,       // Medium line
          globalAlpha: 1,     // Fully opaque
          lineCap: 'round' as CanvasLineCap,
          lineJoin: 'round' as CanvasLineJoin,
        };
      case 'pencil':
        return { 
          color: '#94a3b8',  // Light gray (slate-400)
          lineWidth: 2,       // Thinner line
          globalAlpha: 0.5,   // More transparent
          lineCap: 'round' as CanvasLineCap,
          lineJoin: 'round' as CanvasLineJoin,
        };
      case 'highlighter':
      case 'eraser':
        return { 
          color: '#fdfdf8',  // Paper white color
          lineWidth: 35,      // Extra thick
          globalAlpha: 1,     // Fully opaque
          lineCap: 'round' as CanvasLineCap,
          lineJoin: 'round' as CanvasLineJoin,
        };
      default:
        return { 
          color: '#000000', 
          lineWidth: 2, 
          globalAlpha: 1,
          lineCap: 'round' as CanvasLineCap,
          lineJoin: 'round' as CanvasLineJoin,
        };
    }
  };

  const applyToolSettings = React.useCallback(() => {
    if (!context) return;
    const settings = getToolSettings(activeTool);
    context.strokeStyle = settings.color;
    context.lineWidth = settings.lineWidth;
    context.globalAlpha = settings.globalAlpha;
    context.lineCap = settings.lineCap;
    context.lineJoin = settings.lineJoin;
  }, [context, activeTool]);

  // Apply tool settings whenever the active tool changes
  useEffect(() => {
    applyToolSettings();
  }, [applyToolSettings]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || activeTool === 'select' || isEditing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    applyToolSettings();
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || activeTool === 'select' || isEditing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    if (!context) return;
    context.closePath();
    setIsDrawing(false);
  };

  const getCursorStyle = () => {
    if (isEditing) return 'text';
    
    switch (activeTool) {
      case 'pen':
        return 'url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M3 21L12 3L21 21L12 18L3 21Z\' fill=\'%230f172a\' stroke=\'%23000\' stroke-width=\'0.5\'/%3E%3C/svg%3E") 12 12, crosshair';
      case 'ink':
        return 'url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12 2L2 22h20L12 2z\' fill=\'%231a1a1a\' stroke=\'%23000\' stroke-width=\'0.5\'/%3E%3C/svg%3E") 12 12, crosshair';
      case 'pencil':
        return 'url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M3 21L12 3L21 21L12 18L3 21Z\' fill=\'%2394a3b8\' stroke=\'%23000\' stroke-width=\'0.5\'/%3E%3C/svg%3E") 12 12, crosshair';
      case 'highlighter':
        return 'url("data:image/svg+xml,%3Csvg width=\'32\' height=\'32\' viewBox=\'0 0 32 32\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect x=\'8\' y=\'12\' width=\'16\' height=\'8\' fill=\'%23fbbf24\' opacity=\'0.5\'/%3E%3C/svg%3E") 16 16, crosshair';
      case 'eraser':
        return 'url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect x=\'6\' y=\'10\' width=\'12\' height=\'8\' rx=\'2\' fill=\'%23ef4444\' stroke=\'%23000\' stroke-width=\'1\'/%3E%3C/svg%3E") 12 12, crosshair';
      case 'select':
        return 'default';
      default:
        return 'crosshair';
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        cursor: getCursorStyle(),
        zIndex: (isEditing || activeTool === 'select') ? 0 : 15,
        pointerEvents: (isEditing || activeTool === 'select') ? 'none' : 'auto',
      }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
};
