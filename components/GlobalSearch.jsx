"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, Loader2, User, Swords, History, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { API_BASE_URL } from "@/lib/config";
import { toast } from "sonner";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({ matches: [], users: [] });
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  const performSearch = useCallback(async (searchQuery) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setResults({ matches: [], users: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const isNumeric = /^\d+$/.test(trimmed);

    try {
      const fetchPromises = [
        fetch(`${API_BASE_URL}/games/search/${trimmed}`).then((r) =>
          r.ok ? r.json() : { data: [] },
        ),
      ];

      // Only search for users if it's not purely numeric (optional optimization)
      if (!isNumeric) {
        fetchPromises.push(
          fetch(`${API_BASE_URL}/user/search/${trimmed}`).then((r) =>
            r.ok ? r.json() : { data: [] },
          ),
        );
      }

      const responses = await Promise.all(fetchPromises);

      const matches = responses[0].data || [];
      const users = responses[1]?.data || [];

      setResults({ matches, users });
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (query.trim().length >= 2) {
      debounceTimer.current = setTimeout(() => {
        performSearch(query);
      }, 400);
    } else {
      setResults({ matches: [], users: [] });
      setShowResults(false);
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, performSearch]);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    const totalResults = results.matches.length + results.users.length;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalResults - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        // Navigate to selected item
        const allResults = [
          ...results.matches.map((m) => ({ ...m, type: "match" })),
          ...results.users.map((u) => ({ ...u, type: "user" })),
        ];
        const selected = allResults[selectedIndex];
        if (selected.type === "match") {
          handleSelect("match", selected.gameId);
        } else {
          handleSelect("user", selected.username);
        }
      } else if (query.trim()) {
        // If no selection but enter pressed, try to navigate if there's a result, or show toast
        if (results.matches.length === 1 && results.users.length === 0) {
          handleSelect("match", results.matches[0].gameId);
        } else if (results.users.length === 1 && results.matches.length === 0) {
          handleSelect("user", results.users[0].username);
        } else if (totalResults === 0 && !isLoading) {
          toast.error("No matches or users found for your search.");
        }
      }
    } else if (e.key === "Escape") {
      setShowResults(false);
    }
  };

  const handleSelect = (type, value) => {
    if (type === "match") {
      router.push(`/history/${value}`);
    } else {
      router.push(`/profile/${value}`);
    }
    setQuery("");
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const hasResults = results.matches.length > 0 || results.users.length > 0;
  const allResultsCount = results.matches.length + results.users.length;

  return (
    <div
      ref={searchRef}
      className="relative flex-1 md:w-full md:max-w-md shrink flex justify-center min-w-0 z-50"
    >
      <div className="relative flex items-center w-full border border-border shadow-inner h-9 md:h-10 rounded-full bg-element px-3 md:px-4 transition-all focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 min-w-0">
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-primary mr-2 shrink-0 animate-spin" />
        ) : (
          <Search className="w-4 h-4 text-text-muted mr-2 shrink-0" />
        )}
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setShowResults(true)}
          aria-label="Search by game ID, player, or username"
          placeholder="Search matches or users..."
          className="h-auto bg-transparent px-0 py-0 text-sm shadow-none border-0 focus-visible:ring-0! w-full min-w-0 truncate placeholder:text-text-muted/60"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults({ matches: [], users: [] });
              setShowResults(false);
            }}
            className="p-1 hover:bg-element-hover rounded-full transition-colors ml-1"
          >
            <X className="w-3 h-3 text-text-muted" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface backdrop-blur-xl border border-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden z-100 max-h-[450px] flex flex-col animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="overflow-y-auto p-2 scrollbar-hide">
            {!hasResults && !isLoading ? (
              <div className="p-8 text-center flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-element flex items-center justify-center mb-1">
                  <Search className="w-5 h-5 text-text-muted" />
                </div>
                <p className="text-sm font-semibold text-text-main">
                  No results found
                </p>
                <p className="text-xs text-text-muted">
                  Try searching for something else
                </p>
              </div>
            ) : (
              <>
                {results.matches.length > 0 && (
                  <div className="mb-2">
                    <div className="px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center opacity-70">
                      <Swords className="w-3 h-3 mr-2" />
                      Matches
                    </div>
                    {results.matches.map((match, idx) => (
                      <button
                        key={match.id}
                        onClick={() => handleSelect("match", match.gameId)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left px-3 py-3 rounded-xl transition-all flex items-center justify-between group ${
                          selectedIndex === idx
                            ? "bg-primary/10 border-primary/20"
                            : "hover:bg-element border-transparent"
                        } border`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              match.status === "RESOLVED"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-blue-500/10 text-blue-500"
                            }`}
                          >
                            <History className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-text-main truncate">
                              {match.redName}{" "}
                              <span className="text-text-muted font-medium mx-1">
                                vs
                              </span>{" "}
                              {match.blueName}
                            </span>
                            <span className="text-[10px] text-text-muted font-medium flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.5 bg-element rounded text-primary">
                                #{match.gameId}
                              </span>
                              <span>•</span>
                              <span
                                className={
                                  match.status === "RESOLVED"
                                    ? "text-green-500/80"
                                    : "text-blue-500/80"
                                }
                              >
                                {match.status}
                              </span>
                            </span>
                          </div>
                        </div>
                        <Search
                          className={`w-3.5 h-3.5 text-primary transition-all duration-300 ${
                            selectedIndex === idx
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-2"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {results.users.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest flex items-center opacity-70 border-t border-border/40 mt-1 pt-3">
                      <User className="w-3 h-3 mr-2" />
                      Users
                    </div>
                    {results.users.map((user, idx) => {
                      const absoluteIdx = results.matches.length + idx;
                      return (
                        <button
                          key={user.id}
                          onClick={() => handleSelect("user", user.username)}
                          onMouseEnter={() => setSelectedIndex(absoluteIdx)}
                          className={`w-full text-left px-3 py-3 rounded-xl transition-all flex items-center justify-between group ${
                            selectedIndex === absoluteIdx
                              ? "bg-primary/10 border-primary/20"
                              : "hover:bg-element border-transparent"
                          } border`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-text-main truncate">
                                @{user.username}
                              </span>
                              <span className="text-[10px] text-text-muted font-medium mt-0.5">
                                {user.walletAddress?.slice(0, 6)}...
                                {user.walletAddress?.slice(-4)}
                              </span>
                            </div>
                          </div>
                          <Search
                            className={`w-3.5 h-3.5 text-primary transition-all duration-300 ${
                              selectedIndex === absoluteIdx
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-2"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="p-3 bg-element/50 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface border border-border text-[9px] font-bold text-text-muted">
                <span className="text-[11px]">↑↓</span> to navigate
              </div>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface border border-border text-[9px] font-bold text-text-muted">
                <span className="text-[11px]">↵</span> to select
              </div>
            </div>
            <div className="text-[10px] font-medium text-text-muted italic">
              {allResultsCount} results found
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
