"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Toast 类型
type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// 图标和颜色配置
const toastConfig: Record<
  ToastType,
  { icon: string; bgColor: string; borderColor: string; iconBg: string }
> = {
  success: {
    icon: "✓",
    bgColor: "var(--paper-cream)",
    borderColor: "#2d5a27",
    iconBg: "linear-gradient(135deg, #2d5a27 0%, #3d7a37 100%)",
  },
  error: {
    icon: "✗",
    bgColor: "var(--paper-cream)",
    borderColor: "#b91c1c",
    iconBg: "linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)",
  },
  info: {
    icon: "i",
    bgColor: "var(--paper-cream)",
    borderColor: "#1e3a8a",
    iconBg: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
  },
  warning: {
    icon: "!",
    bgColor: "var(--paper-yellow)",
    borderColor: "#d97706",
    iconBg: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
  },
};

// Toast 单个项组件
const ToastItem: React.FC<{ toast: Toast; onClose: (id: string) => void }> = ({
  toast,
  onClose,
}) => {
  const config = toastConfig[toast.type];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="relative flex items-center gap-3 px-4 py-3 rounded-lg min-w-72 max-w-sm paper-texture"
      style={{
        backgroundColor: config.bgColor,
        boxShadow: "var(--shadow-deep), 3px 3px 0 rgba(0,0,0,0.1)",
        border: `2px solid ${config.borderColor}`,
      }}
    >
      {/* 左侧装饰条 */}
      <div
        className="absolute left-0 top-2 bottom-2 w-1 rounded-full"
        style={{ background: config.iconBg }}
      />

      {/* 图标 - 印章风格 */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
        style={{
          background: config.iconBg,
          boxShadow:
            "inset 0 2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.1)",
          fontFamily: "'Patrick Hand', cursive",
        }}
      >
        {config.icon}
      </div>

      {/* 消息内容 */}
      <p
        className="flex-1 text-base leading-snug"
        style={{
          fontFamily: "'Kalam', cursive",
          color: "var(--ink-black)",
        }}
      >
        {toast.message}
      </p>

      {/* 关闭按钮 */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm opacity-50 hover:opacity-100 transition-opacity"
        style={{
          fontFamily: "'Patrick Hand', cursive",
          color: "var(--ink-gray)",
        }}
      >
        ×
      </motion.button>

      {/* 纸张折角装饰 */}
      <div
        className="absolute top-0 right-0 w-4 h-4 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.05) 50%)",
        }}
      />
    </motion.div>
  );
};

// Toast Provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 3000) => {
      const id = `toast-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      setToasts((prev) => [...prev, { id, type, message, duration }]);
    },
    []
  );

  const success = useCallback(
    (message: string, duration?: number) =>
      showToast("success", message, duration),
    [showToast]
  );
  const error = useCallback(
    (message: string, duration?: number) =>
      showToast("error", message, duration),
    [showToast]
  );
  const info = useCallback(
    (message: string, duration?: number) =>
      showToast("info", message, duration),
    [showToast]
  );
  const warning = useCallback(
    (message: string, duration?: number) =>
      showToast("warning", message, duration),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}

      {/* Toast 容器 */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <ToastItem toast={toast} onClose={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

// Hook
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
