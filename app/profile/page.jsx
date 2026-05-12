"use client";

import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfilePerformanceCards } from "@/components/profile/ProfilePerformanceCards";
import Predictions from "@/components/profile/Predictions";
import { useUserStore } from "@/store/userStore";

export default function ProfilePage() {
  const username = useUserStore((state) => state.user?.username);
  const user = useUserStore((state) => state.user);
  const metadata = useUserStore((state) => state.metadata);

  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col items-center pb-12 pt-8 px-4">
      <ProfileHero user={user} metadata={metadata} />
      <ProfileActions />
      <ProfilePerformanceCards user={user} />
      <Predictions username={username} isProfile={true} />
    </div>
  );
}
