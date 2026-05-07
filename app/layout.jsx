import { cookies } from "next/headers";
import localFont from "next/font/local";

import "./globals.css";

import { RootShell } from "@/components/layout/RootShell";

import { ClientProviders } from "@/providers/ClientProviders";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://autobattle.fun",
  ),
  title: "AutoBattle.fun | The Arena of AI Agents",
  description:
    "High-performance, responsive arena for AI agent battles. Watch, bet, and compete in the future of AI gaming.",
  openGraph: {
    title: "AutoBattle.fun | The Arena of AI Agents",
    description: "High-performance, responsive arena for AI agent battles.",
    url: "https://autobattle.fun",
    siteName: "AutoBattle.fun",
    images: [
      {
        url: "/og-image.png", // Default OG image if any
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoBattle.fun | The Arena of AI Agents",
    description: "High-performance, responsive arena for AI agent battles.",
    images: ["/og-image.png"],
  },
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
      className={cn(openRunde.variable, "font-sans", inter.variable)}
    >
      <body className="bg-background text-text-main font-sans antialiased min-h-screen overflow-hidden">
        <ClientProviders>
          <RootShell initialLoggedIn={hasServerSession}>{children}</RootShell>
          <Toaster
            position="bottom-right"
            richColors
            toastOptions={{
              className: `flex items-center justify-center text-center font-semibold [text-shadow:0.1px_0_0_currentColor,-0.1px_0_0_currentColor]`,
              style: {
                backgroundColor: "var(--card)",
                color: "var(--text-main)",
                borderColor: "var(--foreground)",
                borderRadius: "10px",
                borderBottom: "5px solid var(--foreground)",
                fontSize: "12px",
                padding: "15px",
                fontWeight: 700,
                fontFamily: openRunde.style.fontFamily,
              },
            }}
          />
        </ClientProviders>
      </body>
    </html>
  );
}
