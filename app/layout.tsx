import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "学间 · 学习手记",
  description: "随手留下学习中的小发现，再慢慢整理成日记。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
