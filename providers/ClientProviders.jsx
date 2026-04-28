"use client";

import { ThemeProvider } from "./ThemeProvider";
import { PrivyProviderClient } from "./PrivyProvider";

export function ClientProviders({ children }) {
  return (
    <PrivyProviderClient>
      <ThemeProvider>{children}</ThemeProvider>
    </PrivyProviderClient>
  );
}
