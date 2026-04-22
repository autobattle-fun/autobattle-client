import { cookies } from "next/headers";
import localFont from "next/font/local";

import "./globals.css";

import { RootShell } from "@/components/layout/RootShell";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { PrivyProviderClient } from "@/providers/PrivyProvider";
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
      className={cn(openRunde.variable, "font-sans", inter.variable)}
    >
      <body className="bg-background text-text-main font-sans antialiased min-h-screen overflow-hidden">
        <PrivyProviderClient>
          <ThemeProvider>
            <RootShell initialLoggedIn={hasServerSession}>{children}</RootShell>
            <Toaster
              position="bottom-right"
              richColors
              toastOptions={{
                className: `flex items-center justify-center text-center border ${openRunde.className}`,
                style: {
                  backgroundColor: "var(--background)",
                  color: "var(--text-main)",
                  borderColor: "var(--foreground)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  padding: "15px",
                  fontWeight: 700,
                },
              }}
            />
          </ThemeProvider>
        </PrivyProviderClient>
      </body>
    </html>
  );
}
