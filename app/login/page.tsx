"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/api/auth";
import { useToast } from "@/components";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn({ email, password });

    if (error) {
      toast.error(error);
      setLoading(false);
    } else {
      toast.success("Welcome back! Opening your notebook...");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient lighting */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-15"
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Login Card - Notebook Style */}
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
              "linear-gradient(90deg, #6b4423 0%, #8b5a2b 50%, #6b4423 100%)",
            boxShadow:
              "inset -2px 0 4px rgba(0,0,0,0.3), 2px 0 8px rgba(0,0,0,0.2)",
          }}
        >
          {/* Binding rings */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 w-5 h-3 rounded-full"
              style={{
                top: `${15 + i * 14}%`,
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
          className="paper-texture relative rounded-sm p-8 pl-12"
          style={{
            backgroundColor: "var(--paper-cream)",
            boxShadow: "var(--shadow-deep), 4px 4px 0 rgba(0,0,0,0.1)",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            minHeight: "500px",
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
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="text-6xl mb-4"
              >
                📓
              </motion.div>
              <h1
                className="text-4xl mb-2"
                style={{
                  fontFamily: "'Caveat', cursive",
                  color: "var(--ink-blue)",
                }}
              >
                Welcome Back!
              </h1>
              <p
                className="text-lg opacity-70"
                style={{
                  fontFamily: "'Kalam', cursive",
                  color: "var(--ink-gray)",
                }}
              >
                Sign in to your notebook
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  className="block text-lg mb-2"
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
                  className="w-full px-4 py-3 rounded-lg border-2 border-dashed focus:border-solid focus:outline-none transition-all"
                  style={{
                    fontFamily: "'Kalam', cursive",
                    fontSize: "1.1rem",
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
                  className="block text-lg mb-2"
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
                  className="w-full px-4 py-3 rounded-lg border-2 border-dashed focus:border-solid focus:outline-none transition-all"
                  style={{
                    fontFamily: "'Kalam', cursive",
                    fontSize: "1.1rem",
                    backgroundColor: "rgba(255,255,255,0.5)",
                    borderColor: "var(--ink-gray)",
                    color: "var(--ink-black)",
                  }}
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-full text-xl font-medium transition-all disabled:opacity-50"
                style={{
                  fontFamily: "'Caveat', cursive",
                  background:
                    "linear-gradient(135deg, #8b4513 0%, #d2691e 100%)",
                  color: "white",
                  boxShadow:
                    "0 4px 12px rgba(139, 69, 19, 0.3), inset 0 2px 4px rgba(255,255,255,0.2)",
                  border: "2px solid rgba(139, 69, 19, 0.3)",
                }}
              >
                {loading ? "✍️ Signing in..." : "📖 Open My Notebook"}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div
                className="flex-1 h-px bg-gray-300"
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

            {/* Register Link */}
            <div className="text-center">
              <p
                style={{
                  fontFamily: "'Kalam', cursive",
                  color: "var(--ink-gray)",
                }}
              >
                Don&apos;t have a notebook yet?
              </p>
              <Link href="/register">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className="inline-block mt-2 text-xl underline decoration-wavy decoration-2 underline-offset-4"
                  style={{
                    fontFamily: "'Caveat', cursive",
                    color: "var(--ink-blue)",
                    textDecorationColor: "var(--ink-blue)",
                  }}
                >
                  ✨ Create a new one!
                </motion.span>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, rotate: -20 }}
          animate={{ opacity: 1, rotate: -12 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-6 -right-6 text-4xl"
          style={{ filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))" }}
        >
          ✏️
        </motion.div>
        <motion.div
          initial={{ opacity: 0, rotate: 20 }}
          animate={{ opacity: 1, rotate: 15 }}
          transition={{ delay: 0.6 }}
          className="absolute -bottom-4 -left-2 text-3xl"
          style={{ filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))" }}
        >
          📎
        </motion.div>
      </motion.div>
    </div>
  );
}
