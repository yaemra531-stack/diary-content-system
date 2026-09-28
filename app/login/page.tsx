"use client";

import React, { useState } from "react";
import { BookOpen, KeyRound, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    if (key.trim() === "gas") {
      setLoading(true);
      // Set 1-year persistent cookie
      document.cookie = "gas_auth=curry; path=/; max-age=31536000; SameSite=Lax";
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("return_to") || "/";
      window.location.href = returnTo;
    } else {
      setError("口令不正确，请输入瓦斯站长口令");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fbf9f5] text-[#2c2621]">
      <div className="w-full max-w-sm p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-[#e8dfd3] text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#f0eae1] flex items-center justify-center text-[#7a5a3a]">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-medium mb-1 tracking-tight">学间 · 雅思日记</h1>
        <p className="text-sm text-[#8c7e72] mb-6">瓦斯自用学习手记工作台</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#a89b8f]" />
            <input
              type="password"
              placeholder="输入站长口令 (默认 gas)"
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError("");
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf7f2] border border-[#e2d8cb] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#c49a6c] transition-all"
              autoFocus
            />
          </div>

          {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#2c2621] hover:bg-[#3f3730] text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#e0b98f]" />
            {loading ? "正在开启..." : "开启手记"}
          </button>
        </form>

        <p className="text-xs text-[#a89b8f] mt-6">
          努力进步，不求完美 · 0报班0外教AI自学实验
        </p>
      </div>
    </div>
  );
}
