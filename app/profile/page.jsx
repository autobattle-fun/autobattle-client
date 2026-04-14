import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfilePerformanceCards } from "@/components/profile/ProfilePerformanceCards";
import { ProfileRecentHistory } from "@/components/profile/ProfileRecentHistory";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

async function getProfile() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 404) {
    redirect("/login");
  }

  if (!response.ok) {
    throw new Error("Could not load profile.");
  }

  const payload = await response.json();
  return payload.user;
}

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col gap-4 pb-12 pt-8">
      <ProfileHero profile={profile} />
      <ProfileActions />
      <ProfilePerformanceCards />
      <ProfileRecentHistory />
    </div>
  );
}
