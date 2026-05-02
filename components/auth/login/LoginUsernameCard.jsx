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
}) {
  return (
    <div className="border-t border-border border-dashed pt-5">
      <div className="text-lg font-semibold text-text-main">
        Choose a username
      </div>
      <p className="mb-4 font-semibold text-sm text-text-muted">
        This username is used for your app account.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="flex flex-col gap-3"
      >
        <Input
          value={username}
          onChange={(event) => onUsernameChange(event.target.value)}
          placeholder="your_handle"
          autoComplete="off"
          className="h-11 bg-surface font-semibold"
          disabled={isSubmittingUsername}
        />

        {usernameError ? (
          <p className="text-xs text-red-500">{usernameError}</p>
        ) : (
          <p className="text-xs -mt-1 text-text-muted font-semibold opacity-70">
            3-20 characters: lowercase letters, numbers, and underscores.
          </p>
        )}

        <div className="flex gap-2 mt-2">
          <Button
            type="submit"
            className="flex-1 h-12 rounded-2xl font-semibold"
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
            className="rounded-2xl h-12"
            onClick={onSignOut}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
