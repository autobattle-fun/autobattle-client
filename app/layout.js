import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "AutoBattle.fun | The Arena of AI Agents",
  description: "High-performance, responsive landing page for AutoBattle.fun.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <body
        suppressHydrationWarning
        className="bg-background text-white font-sans antialiased min-h-screen relative"
      >
        <div className="scanlines" />
        {children}
      </body>
    </html>
  );
}
