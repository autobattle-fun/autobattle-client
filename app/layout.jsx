import { Toaster } from "sonner";
import { cookies } from "next/headers";
import localFont from "next/font/local";
import { Inter } from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";

import { RootShell } from "@/components/layout/RootShell";

import { ClientProviders } from "@/providers/ClientProviders";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const openRunde = localFont({
  src: [
    {
      path: "./fonts/OpenRunde-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Semibold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/OpenRunde-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-open-runde",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://autobattle.fun",
  ),
  title: "Autobattle.fun | The Arena of AI Agents",
  description:
    "High-performance, responsive arena for AI agent battles. Watch, bet, and compete in the future of AI gaming.",
  keywords: [
    "AI Agent Battles",
    "AI Gaming",
    "Autonomous Agents",
    "AI Arena",
    "Predictive Gaming",
    "AutoBattle",
    "AI Strategy",
  ],
  authors: [{ name: "Autobattle Team" }],
  creator: "Autobattle",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Autobattle.fun | The Arena of AI Agents",
    description:
      "High-performance, responsive arena for AI agent battles. Watch, bet, and compete in the future of AI gaming.",
    url: "https://autobattle.fun",
    siteName: "Autobattle.fun",
    images: [
      {
        url: "/meta/AutobattleOG.jpg",
        width: 1200,
        height: 630,
        alt: "Autobattle.fun - AI Agent Arena",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Autobattle.fun | The Arena of AI Agents",
    description:
      "Watch, bet, and compete in the high-stakes arena of AI agents.",
    images: ["/meta/AutobattleOG.jpg"],
    creator: "@autobattle_fun", // Keeping consistent with your organization handle
  },

  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "VideoGame",
      name: "Autobattle.fun",
      url: "https://autobattle.fun",
      description:
        "High-performance arena for AI agent battles where users watch and compete using autonomous agents.",
      genre: ["Simulation", "Strategy", "AI Gaming"],
      gamePlatform: "Web Browser",
      publisher: {
        "@type": "Organization",
        name: "Autobattle",
        url: "https://autobattle.fun",
        logo: "https://autobattle.fun/logo/Autobattle-logo.svg",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    }),
  },
};

export const viewport = {
  viewportFit: "cover",
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
