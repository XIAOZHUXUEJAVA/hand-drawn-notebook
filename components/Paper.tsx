'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PaperProps {
  children: React.ReactNode;
  color?: 'white' | 'cream' | 'yellow' | 'aged';
  lineStyle?: 'blue' | 'gray' | 'none';
  className?: string;
  showMargin?: boolean;
  animate?: boolean;
  style?: React.CSSProperties;
}

const colorMap = {
  white: '#fdfdf8',
  cream: '#faf8f3',
  yellow: '#fffacd',
  aged: '#f4f1e8',
};

export const Paper: React.FC<PaperProps> = ({
  children,
  color = 'white',
  lineStyle = 'blue',
  className = '',
  showMargin = true,
  animate = true,
  style = {},
}) => {
  const lineClass = lineStyle === 'blue' ? 'ruled-lines' : lineStyle === 'gray' ? 'ruled-lines-gray' : '';

  const paperVariants = {
    initial: { 
      opacity: 0, 
      rotateY: -15,
      scale: 0.95,
    },
    animate: { 
      opacity: 1, 
      rotateY: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      }
    },
    exit: { 
      opacity: 0, 
      rotateY: 15,
      scale: 0.95,
      transition: {
        duration: 0.4,
      }
    },
    hover: {
      y: -4,
      boxShadow: '4px 4px 16px rgba(0, 0, 0, 0.2), -2px -2px 8px rgba(255, 255, 255, 0.6)',
      transition: {
        duration: 0.2,
      }
    }
  };

  const Component = animate ? motion.div : 'div';
  const animationProps = animate ? {
    variants: paperVariants,
    initial: "initial",
    animate: "animate",
    exit: "exit",
    whileHover: "hover",
  } : {};

  return (
    <Component
      className={`
        paper-texture ${lineClass}
        relative rounded-sm
        ${className}
      `}
      style={{
        backgroundColor: colorMap[color],
        boxShadow: 'var(--shadow-page)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        ...style,
      }}
      {...animationProps}
    >
      {/* Paper edge shadow for depth */}
      <div 
        className="absolute inset-0 pointer-events-none rounded-sm"
        style={{
          boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.02)',
        }}
      />
      
      {/* Subtle corner fold */}
      <div 
        className="absolute top-0 right-0 w-8 h-8 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.03) 50%)',
          borderTopRightRadius: '2px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
};
