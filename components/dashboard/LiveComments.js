"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Heart,
  Smile,
  ImageIcon,
  MoreHorizontal,
  ArrowUp,
  Shield,
  Loader2,
} from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { useMarketStore } from "@/store/marketStore";
import { useUserStore } from "@/store/userStore";
import { API_BASE_URL } from "@/lib/config";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@openfort/react";
import Avatar from "boring-avatars";
import { toast } from "sonner";

export default function LiveComments() {
  const { getAccessToken } = useUser();

  const [activeTab, setActiveTab] = useState("comments");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const logs = useGameStore((state) => state.logs) || [];
  const gameState = useGameStore((state) => state.gameState) || {};
  const market = useMarketStore((state) => state.market);
  const user = useUserStore((state) => state.user);

  const marketId = market?.mainMarket?.id;

  const fetchComments = useCallback(async () => {
    if (!marketId) return;
    setIsLoadingComments(true);

    try {
      const accessToken = await getAccessToken().catch(() => null);
      const headers = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/comments/market/${marketId}`,
        { headers },
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  }, [marketId, getAccessToken]);

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 60000);
    return () => clearInterval(interval);
  }, [fetchComments]);

  const likeTimeouts = useRef({});

  const handlePostComment = async () => {
    if (!user) {
      toast.warning("Please login to comment");
      return;
    }
    if (!newComment.trim() || !marketId || isPosting) return;

    setIsPosting(true);

    const accessToken = await getAccessToken();

    try {
      const response = await fetch(`${API_BASE_URL}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          marketId,
          comment: newComment,
        }),
        credentials: "include",
      });

      if (response.ok) {
        setNewComment("");
        fetchComments();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to post comment");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleToggleLike = async (commentId) => {
    if (!user) {
      toast.warning("Please login to like comments");
      return;
    }

    let targetLikedState = false;

    // 1. Optimistic Update
    setComments((prevComments) =>
      prevComments.map((c) => {
        if (c.id === commentId) {
          const wasLiked = c.isLiked;
          targetLikedState = !wasLiked;
          return {
            ...c,
            isLiked: targetLikedState,
            likes: Math.max(0, (c.likes || 0) + (targetLikedState ? 1 : -1)),
            _count: {
              ...c._count,
              commentLikes: Math.max(
                0,
                (c._count?.commentLikes || 0) + (targetLikedState ? 1 : -1),
              ),
            },
          };
        }
        return c;
      }),
    );

    // 2. Debounce the API call
    if (likeTimeouts.current[commentId]) {
      clearTimeout(likeTimeouts.current[commentId]);
    }

    likeTimeouts.current[commentId] = setTimeout(async () => {
      const accessToken = await getAccessToken();

      try {
        await fetch(`${API_BASE_URL}/api/comments/${commentId}/like`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ liked: targetLikedState }),
        });
      } catch (error) {
        console.error("Failed to toggle like:", error);
      } finally {
        delete likeTimeouts.current[commentId];
      }
    }, 500);
  };

  const getAvatarColor = (username) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const index =
      username.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  return (
    <div className="w-full mt-6 md:mt-10 backdrop-blur-md rounded-3xl flex flex-col relative shrink-0">
      {/* Header Tabs */}
      <div className="flex gap-4 md:gap-6 text-base md:text-xl font-semibold mb-4 md:mb-5 overflow-x-auto scrollbar-none whitespace-nowrap">
        <span
          onClick={() => setActiveTab("comments")}
          className={`cursor-pointer transition-colors ${
            activeTab === "comments"
              ? "text-zinc-900 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Comments ({comments.length})
        </span>
        <span
          onClick={() => setActiveTab("logs")}
          className={`cursor-pointer transition-colors ${
            activeTab === "logs"
              ? "text-zinc-900 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Logs
        </span>
      </div>

      {activeTab === "comments" ? (
        <>
          {/* Input Box */}
          <div className="relative w-full flex items-center bg-zinc-50 dark:bg-[#18181b] border border-foreground/10 rounded-xl p-1 md:p-2 mb-4 md:mb-5 transition-colors">
            <input
              type="text"
              placeholder={user ? "Add a comment..." : "Login to comment"}
              disabled={!user || isPosting}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePostComment()}
              className="flex-1 bg-transparent px-3 text-xs md:text-sm outline-none dark:text-zinc-200 text-zinc-900 placeholder:text-zinc-500"
            />
            <div className="flex items-center gap-2 md:gap-3 pr-1 text-zinc-400">
              <Smile className="w-4 h-4 md:w-5 md:h-5 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
              <ImageIcon className="w-4 h-4 md:w-5 md:h-5 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors" />
              <button
                onClick={handlePostComment}
                disabled={!user || isPosting || !newComment.trim()}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors text-white px-3 md:px-5 py-1.5 rounded-lg text-[10px] md:text-sm font-semibold ml-1 md:ml-2 flex items-center gap-2"
              >
                {isPosting && <Loader2 className="w-3 h-3 animate-spin" />}
                Post
              </button>
            </div>
          </div>

          {/* Filters & Warning */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 md:mb-6 text-sm">
            <div className="flex items-center gap-2 text-[10px] md:text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 px-3 py-1.5 rounded-full border dark:border-white/5 border-black/5">
              <Shield className="w-3.5 h-3.5" /> Beware of external links.
            </div>
          </div>

          {/* Comments List */}
          <div className="flex flex-col gap-4 md:gap-6 overflow-y-auto pr-2 pb-10 min-h-[400px] max-h-[400px] scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {isLoadingComments && comments.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-zinc-500 italic p-4 text-center text-sm">
                No comments yet. Be the first to say something!
              </div>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="flex gap-2 md:gap-3">
                  <Avatar name={c.user.username} size={40} />
                  <div className="flex-1 flex flex-col group pt-0.5">
                    <div className="flex justify-between items-start md:items-center mb-0.5 md:mb-1 relative">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs md:text-sm text-zinc-900 dark:text-zinc-200">
                          {c.user.username}
                        </span>
                        <span className="text-[10px] md:text-xs text-zinc-500">
                          {formatDistanceToNow(new Date(c.createdAt))} ago
                        </span>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pr-4 md:pr-6">
                      {c.comment}
                    </p>
                    <div
                      onClick={() => handleToggleLike(c.id)}
                      className="flex items-center gap-1.5 mt-2 md:mt-2.5 text-zinc-500 hover:text-red-500 cursor-pointer transition-colors w-fit"
                    >
                      <Heart
                        className={`w-3 h-3 md:w-4 md:h-4 ${c.isLiked ? "fill-red-500 text-red-500" : ""}`}
                      />
                      <span className="text-[10px] md:text-xs">
                        {c.likes || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Back to top button */}
            {comments.length > 5 && (
              <div className="flex justify-center mt-2 mb-2">
                <button
                  onClick={() =>
                    document
                      .querySelector(".overflow-y-auto")
                      ?.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-zinc-600 dark:text-zinc-300 transition-colors"
                >
                  Back to top <ArrowUp className="w-3 h-3 md:w-3.5 md:h-3.5" />
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 md:gap-6 overflow-y-auto min-h-[400px] pb-10 max-h-[400px] pr-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {logs.length === 0 ? (
            <div className="text-zinc-500 italic p-4 text-center text-sm">
              No logs recorded yet.
            </div>
          ) : (
            [...logs].reverse().map((log, index) => (
              <div key={index} className="flex gap-2 md:gap-3">
                <div className="w-7 h-7 md:w-10 md:h-10 rounded-full flex-shrink-0 bg-primary flex items-center justify-center text-white">
                  <Image
                    src="/logo/AutoBattle-logo.svg"
                    alt="Logo"
                    width={15}
                    height={15}
                    className="brightness-0 invert w-3 md:w-4"
                  />
                </div>
                <div className="flex-1 flex flex-col group pt-0.5">
                  <div className="flex justify-between items-start md:items-center mb-0.5 md:mb-1 relative">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs md:text-sm text-zinc-900 dark:text-zinc-200">
                        {log.role === "red"
                          ? gameState?.red?.name
                          : log.role === "blue"
                            ? gameState?.blue?.name
                            : "System"}
                      </span>
                      <span className="text-[10px] md:text-xs text-zinc-500">
                        {new Date(
                          log.timestamp || log.timeStamp,
                        ).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed pr-4 md:pr-6">
                    {log.log || log.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
