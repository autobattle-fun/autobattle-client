import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfileRecentHistory } from "@/components/profile/ProfileRecentHistory";
import { ProfilePerformanceCards } from "@/components/profile/ProfilePerformanceCards";
import { API_BASE_URL } from "@/lib/config";

async function getProfile() {
  try {
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
      return null;
    }

    const payload = await response.json();
    return payload || null;
  } catch {
    return null;
  }
}

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col items-center pb-12 pt-8">
      <ProfileHero profile={profile?.user} metadata={profile?.metadata} />
      <ProfileActions />
      <ProfilePerformanceCards />
      <ProfileRecentHistory />
    </div>
  );
}
