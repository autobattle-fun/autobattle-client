"use client";

import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginUsernameCard({
  username,
  onUsernameChange,
  usernameError,
  onSubmit,
  onSignOut,
  isSubmittingUsername,
  appUser,
  walletAddress,
}) {
  return (
    <Card className="rounded-3xl border-border bg-surface p-6 shadow-sm">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-text-muted">
        Step 2 of 2
      </div>
      <div className="mb-1 text-lg font-semibold text-text-main">
        Choose a username
      </div>
      <p className="mb-4 text-sm text-text-muted">
        This username is used for your app account.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <Input
          value={username}
          onChange={(event) => onUsernameChange(event.target.value)}
          placeholder="your_handle"
          autoComplete="off"
          className="h-11 bg-surface"
        />

        {usernameError ? (
          <p className="text-xs text-red-500">{usernameError}</p>
        ) : (
          <p className="text-xs text-text-muted">
            3-20 characters: lowercase letters, numbers, and underscores.
          </p>
        )}

        <div className="flex gap-2">
          <Button
            type="submit"
            className="flex-1 rounded-2xl"
            disabled={isSubmittingUsername}
          >
            {isSubmittingUsername ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              "Finish"
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="rounded-2xl"
            onClick={onSignOut}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {appUser ? (
          <p className="text-xs text-text-muted">
            Signed in as {appUser.privyUserId || "your account"}
          </p>
        ) : null}
        {walletAddress ? (
          <p className="text-xs text-text-muted">Wallet {walletAddress}</p>
        ) : null}
      </form>
    </Card>
  );
}
