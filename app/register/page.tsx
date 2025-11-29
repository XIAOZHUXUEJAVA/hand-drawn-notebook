"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Ambient lighting */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{
              background:
                "radial-gradient(circle, #10b981 0%, transparent 70%)",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="paper-texture relative rounded-sm p-12 text-center max-w-md"
          style={{
            backgroundColor: "var(--paper-cream)",
            boxShadow: "var(--shadow-deep)",
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-7xl mb-6"
          >
            🎉
          </motion.div>
          <h1
            className="text-3xl mb-4"
            style={{
              fontFamily: "'Caveat', cursive",
              color: "var(--ink-blue)",
            }}
          >
            Notebook Created!
          </h1>
          <p
            className="text-lg mb-6"
            style={{ fontFamily: "'Kalam', cursive", color: "var(--ink-gray)" }}
          >
            Check your email to confirm your account, then you can start
            writing!
          </p>
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full text-xl"
              style={{
                fontFamily: "'Caveat', cursive",
                background: "linear-gradient(135deg, #8b4513 0%, #d2691e 100%)",
                color: "white",
                boxShadow: "0 4px 12px rgba(139, 69, 19, 0.3)",
              }}
            >
              📖 Go to Login
            </motion.button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Ambient lighting */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, #10b981 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Register Card - Notebook Style */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Notebook binding */}
        <div
          className="absolute -left-4 top-8 bottom-8 w-8 rounded-l-lg z-20"
          style={{
            background:
              "linear-gradient(90deg, #2d5a27 0%, #3d7a37 50%, #2d5a27 100%)",
            boxShadow:
              "inset -2px 0 4px rgba(0,0,0,0.3), 2px 0 8px rgba(0,0,0,0.2)",
          }}
        >
          {/* Binding rings */}
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 w-5 h-3 rounded-full"
              style={{
                top: `${12 + i * 11}%`,
                background:
                  "linear-gradient(180deg, #c0c0c0 0%, #a0a0a0 50%, #808080 100%)",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>

        {/* Paper */}
        <div
          className="paper-texture ruled-lines relative rounded-sm p-8 pl-12"
          style={{
            backgroundColor: "var(--paper-white)",
            boxShadow: "var(--shadow-deep), 4px 4px 0 rgba(0,0,0,0.1)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            minHeight: "580px",
          }}
        >
          {/* Paper edge shadow */}
          <div
            className="absolute inset-0 pointer-events-none rounded-sm"
            style={{ boxShadow: "inset 0 0 30px rgba(0, 0, 0, 0.03)" }}
          />

          {/* Corner fold */}
          <div
            className="absolute top-0 right-0 w-12 h-12 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, transparent 50%, rgba(0, 0, 0, 0.04) 50%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="text-5xl mb-3"
              >
                ✨
              </motion.div>
              <h1
                className="text-3xl mb-1"
                style={{
                  fontFamily: "'Caveat', cursive",
                  color: "var(--ink-blue)",
                }}
              >
                Create Your Notebook
              </h1>
              <p
                className="text-base opacity-70"
                style={{
                  fontFamily: "'Kalam', cursive",
                  color: "var(--ink-gray)",
                }}
              >
                Start your writing journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Display Name */}
              <div>
                <label
                  className="block text-base mb-1"
                  style={{
                    fontFamily: "'Patrick Hand', cursive",
                    color: "var(--ink-black)",
                  }}
                >
                  👤 Your Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-dashed focus:border-solid focus:outline-none transition-all"
                  style={{
                    fontFamily: "'Kalam', cursive",
                    fontSize: "1rem",
                    backgroundColor: "rgba(255,255,255,0.5)",
                    borderColor: "var(--ink-gray)",
                    color: "var(--ink-black)",
                  }}
                  placeholder="What should we call you?"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className="block text-base mb-1"
                  style={{
                    fontFamily: "'Patrick Hand', cursive",
                    color: "var(--ink-black)",
                  }}
                >
                  ✉️ Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-dashed focus:border-solid focus:outline-none transition-all"
                  style={{
                    fontFamily: "'Kalam', cursive",
                    fontSize: "1rem",
                    backgroundColor: "rgba(255,255,255,0.5)",
                    borderColor: "var(--ink-gray)",
                    color: "var(--ink-black)",
                  }}
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-base mb-1"
                  style={{
                    fontFamily: "'Patrick Hand', cursive",
                    color: "var(--ink-black)",
                  }}
                >
                  🔑 Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-dashed focus:border-solid focus:outline-none transition-all"
                  style={{
                    fontFamily: "'Kalam', cursive",
                    fontSize: "1rem",
                    backgroundColor: "rgba(255,255,255,0.5)",
                    borderColor: "var(--ink-gray)",
                    color: "var(--ink-black)",
                  }}
                  placeholder="At least 6 characters"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className="block text-base mb-1"
                  style={{
                    fontFamily: "'Patrick Hand', cursive",
                    color: "var(--ink-black)",
                  }}
                >
                  🔐 Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-dashed focus:border-solid focus:outline-none transition-all"
                  style={{
                    fontFamily: "'Kalam', cursive",
                    fontSize: "1rem",
                    backgroundColor: "rgba(255,255,255,0.5)",
                    borderColor: "var(--ink-gray)",
                    color: "var(--ink-black)",
                  }}
                  placeholder="Type it again"
                />
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    fontFamily: "'Kalam', cursive",
                    color: "#b91c1c",
                  }}
                >
                  ⚠️ {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-full text-xl font-medium transition-all disabled:opacity-50 mt-2"
                style={{
                  fontFamily: "'Caveat', cursive",
                  background:
                    "linear-gradient(135deg, #2d5a27 0%, #3d7a37 100%)",
                  color: "white",
                  boxShadow:
                    "0 4px 12px rgba(45, 90, 39, 0.3), inset 0 2px 4px rgba(255,255,255,0.2)",
                  border: "2px solid rgba(45, 90, 39, 0.3)",
                }}
              >
                {loading ? "✍️ Creating..." : "📓 Create My Notebook"}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div
                className="flex-1 h-px"
                style={{ background: "var(--line-gray)" }}
              />
              <span
                className="px-4 text-sm"
                style={{
                  fontFamily: "'Kalam', cursive",
                  color: "var(--ink-gray)",
                }}
              >
                or
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "var(--line-gray)" }}
              />
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p
                style={{
                  fontFamily: "'Kalam', cursive",
                  color: "var(--ink-gray)",
                }}
              >
                Already have a notebook?
              </p>
              <Link href="/login">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-block mt-1 text-xl underline decoration-wavy decoration-2 underline-offset-4"
                  style={{
                    fontFamily: "'Caveat', cursive",
                    color: "var(--ink-blue)",
                    textDecorationColor: "var(--ink-blue)",
                  }}
                >
                  📖 Sign in here
                </motion.span>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, rotate: 20 }}
          animate={{ opacity: 1, rotate: 12 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-4 -right-4 text-3xl"
          style={{ filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))" }}
        >
          🖊️
        </motion.div>
        <motion.div
          initial={{ opacity: 0, rotate: -20 }}
          animate={{ opacity: 1, rotate: -8 }}
          transition={{ delay: 0.6 }}
          className="absolute -bottom-3 -right-2 text-2xl"
          style={{ filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))" }}
        >
          📌
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="absolute top-1/2 -left-10 text-2xl"
          style={{ filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))" }}
        >
          🔖
        </motion.div>
      </motion.div>
    </div>
  );
}
