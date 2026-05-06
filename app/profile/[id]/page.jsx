"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, XCircle, ChevronLeft } from "lucide-react";

import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfilePerformanceCards } from "@/components/profile/ProfilePerformanceCards";
import Predictions from "@/components/profile/Predictions";

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();

  // Extract id from the dynamic route (e.g., /profile/123)
  const { id } = params;

  const [user, setUser] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const controller = new AbortController();

    async function fetchUserProfile() {
      setLoading(true);
      try {
        // Fetch using the new controller route you created
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile/${id}`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const payload = await response.json();

        if (isMounted) {
          // Adjust based on your API response structure (e.g., payload.data)
          setUser(payload?.data);
          setMetadata(payload?.metadata);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted && err.name !== "AbortError") {
          console.error("Failed to fetch user:", err);
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchUserProfile();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
        <XCircle className="h-12 w-12 text-red-500" />
        <p className="text-text-main font-semibold">User not found</p>
        <button
          onClick={() => router.back()}
          className="text-primary hover:underline font-medium"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col items-center pb-12 pt-8 px-4">
      {/* Optional: Add a back button if they navigated here from a leaderboard or search */}
      <div className="w-full flex justify-start mb-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      </div>

      <ProfileHero user={user} metadata={metadata} />

      <ProfilePerformanceCards user={user} />

      {/* Pass the fetched user's username to the Predictions component */}
      <Predictions username={user.username} />
    </div>
  );
}
