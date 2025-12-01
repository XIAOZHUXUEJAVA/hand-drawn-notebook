"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "./Toast";
import type { User } from "@supabase/supabase-js";

export const UserButton: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();
  const toast = useToast();

  useEffect(() => {
    // 获取当前用户
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    toast.success("Signed out successfully. See you next time!");
    router.push("/login");
  };

  if (loading) {
    return (
      <div
        className="w-12 h-12 rounded-full animate-pulse"
        style={{ backgroundColor: "rgba(139, 69, 19, 0.3)" }}
      />
    );
  }

  // 未登录状态
  if (!user) {
    return (
      <Link href="/login">
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 pl-4 pr-5 py-2.5 rounded-full"
          style={{
            background: "linear-gradient(135deg, #8b4513 0%, #d2691e 100%)",
            boxShadow:
              "0 3px 10px rgba(139, 69, 19, 0.3), inset 0 1px 2px rgba(255,255,255,0.2), 0 0 0 1px rgba(139, 69, 19, 0.4)",
          }}
        >
          <span className="text-lg">🔑</span>
          <span
            className="text-white text-lg"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Sign In
          </span>
        </motion.button>
      </Link>
    );
  }

  // 已登录状态
  const displayName =
    user.user_metadata?.display_name || user.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-full"
        style={{
          background:
            "linear-gradient(135deg, var(--paper-cream) 0%, var(--paper-aged) 100%)",
          boxShadow: "var(--shadow-medium)",
          border: "2px solid rgba(139, 69, 19, 0.3)",
        }}
      >
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold"
          style={{
            background: "linear-gradient(135deg, #8b4513 0%, #d2691e 100%)",
            fontFamily: "'Caveat', cursive",
            fontSize: "1.25rem",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {initial}
        </div>
        {/* Name */}
        <span
          className="hidden sm:block max-w-24 truncate"
          style={{
            fontFamily: "'Kalam', cursive",
            color: "var(--ink-black)",
          }}
        >
          {displayName}
        </span>
        {/* Dropdown arrow */}
        <motion.span
          animate={{ rotate: menuOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm opacity-60"
        >
          ▼
        </motion.span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-lg overflow-hidden z-50"
            style={{
              background: "var(--paper-cream)",
              boxShadow: "var(--shadow-deep)",
              border: "2px solid rgba(139, 69, 19, 0.2)",
            }}
          >
            {/* Paper texture overlay */}
            <div className="paper-texture">
              {/* User info */}
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: "rgba(139, 69, 19, 0.15)" }}
              >
                <p
                  className="font-medium truncate"
                  style={{
                    fontFamily: "'Caveat', cursive",
                    fontSize: "1.25rem",
                    color: "var(--ink-black)",
                  }}
                >
                  {displayName}
                </p>
                <p
                  className="text-sm truncate opacity-60"
                  style={{
                    fontFamily: "'Kalam', cursive",
                    color: "var(--ink-gray)",
                  }}
                >
                  {user.email}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-2">
                {/* Profile link - 可以后续添加 */}
                {/* <MenuItem icon="👤" label="My Profile" onClick={() => {}} /> */}

                {/* Sign out */}
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-black/5 transition-colors"
                >
                  <span className="text-lg">🚪</span>
                  <span
                    style={{
                      fontFamily: "'Kalam', cursive",
                      color: "var(--ink-black)",
                    }}
                  >
                    Sign Out
                  </span>
                </button>
              </div>

              {/* Decorative bottom */}
              <div
                className="h-2"
                style={{
                  background:
                    "linear-gradient(90deg, #8b4513 0%, #d2691e 50%, #8b4513 100%)",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
