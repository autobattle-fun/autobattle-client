import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfilePerformanceCards } from "@/components/profile/ProfilePerformanceCards";
import Predictions from "@/components/profile/Predictions";

export default async function ProfilePage() {
  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col items-center pb-12 pt-8 px-4">
      <ProfileHero />
      <ProfileActions />
      <ProfilePerformanceCards />
      <Predictions />
    </div>
  );
}
