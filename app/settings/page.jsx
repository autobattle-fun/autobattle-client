"use client";

import { Card } from "@/components/ui/card";
import { ChevronRight, Moon, Power, Sun } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useOpenfort } from "@openfort/react";
import { useUserStore } from "@/store/userStore";

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { logout } = useOpenfort();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      window.dispatchEvent(
        new CustomEvent("autobattle-auth-changed", {
          detail: { isAuthenticated: false },
        }),
      );
      router.push("/login");
    }
  }

  return (
    <div className="max-w-xl mx-auto h-full flex flex-col pt-16 px-4">
      <h1 className="text-4xl font-bold mb-2">Settings</h1>
      <p className="text-text-muted text-sm mb-6">
        Manage your preferences and settings
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Card
            className="w-full bg-element rounded-2xl p-5 flex items-center justify-between border border-border hover:bg-element-hover transition-colors cursor-pointer shadow-none"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <div className="flex items-center gap-2">
              <div className="font-semibold text-normal mb-0.5">Display</div>
            </div>
            <div className="text-right space-y-2">
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <Moon className="w-5 h-5 text-text-main" />
                ) : (
                  <Sun className="w-5 h-5 text-text-main" />
                )
              ) : (
                <Sun className="w-5 h-5 text-text-main" />
              )}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <Link href={"https://x.com/autobattle_fun"} target="_blank">
            <Card className="w-full bg-element rounded-2xl p-5 flex items-center justify-between border border-border hover:bg-element-hover transition-colors cursor-pointer shadow-none">
              <div className="flex items-center gap-2">
                <div className="font-semibold text-normal mb-0.5">
                  follow @autobattle_fun on X
                </div>
              </div>
              <div className="text-right space-y-2">
                <ChevronRight className="w-5 h-5 text-text-main" />
              </div>
            </Card>
          </Link>
        </div>

        {user ? (
          <div className="flex flex-col gap-2">
            <Card
              className="w-full bg-element rounded-2xl p-5 flex items-center justify-between border border-border hover:bg-element-hover transition-colors cursor-pointer shadow-none"
              onClick={handleLogout}
            >
              <div className="flex items-center gap-2">
                <div className="font-semibold text-normal mb-0.5">Sign out</div>
              </div>
              <div className="text-right space-y-2">
                <Power className="w-5 h-5 text-text-main" />
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Card
              className="w-full bg-element rounded-2xl p-5 flex items-center justify-between border border-border hover:bg-element-hover transition-colors cursor-pointer shadow-none"
              onClick={() => router.push("/login")}
            >
              <div className="flex items-center gap-2">
                <div className="font-semibold text-normal mb-0.5">Sign In</div>
              </div>
              <div className="text-right space-y-2">
                <ChevronRight className="w-5 h-5 text-text-main" />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
