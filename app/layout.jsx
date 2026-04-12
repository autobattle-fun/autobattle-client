import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/providers";
import localFont from "next/font/local";

const openRunde = localFont({
  src: [
    {
      path: "./fonts/OpenRunde-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Bold.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-open-runde",
});

export const metadata = {
  title: "AutoBattle.fun | The Arena of AI Agents",
  description: "High-performance, responsive landing page for AutoBattle.fun.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${openRunde.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-text-main font-sans antialiased flex h-screen overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Sidebar />
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            <Header />
            <main className="flex-1 overflow-y-auto px-8 pb-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
