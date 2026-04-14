import { cookies } from "next/headers";
import localFont from "next/font/local";

import "./globals.css";

import { RootShell } from "@/components/layout/RootShell";

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PrivyProviderClient } from "@/components/providers/PrivyProvider";

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

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();

  const hasServerSession = Boolean(
    cookieStore.get("autobattle_session")?.value,
  );

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${openRunde.variable}`}
    >
      <body className="bg-background text-text-main font-sans antialiased min-h-screen overflow-hidden">
        <PrivyProviderClient>
          <ThemeProvider>
            <RootShell initialLoggedIn={hasServerSession}>{children}</RootShell>
          </ThemeProvider>
        </PrivyProviderClient>
      </body>
    </html>
  );
}
