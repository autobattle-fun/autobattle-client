import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileActions } from "@/components/profile/ProfileActions";
import { ProfileRecentHistory } from "@/components/profile/ProfileRecentHistory";
import { ProfilePerformanceCards } from "@/components/profile/ProfilePerformanceCards";
import { API_BASE_URL } from "@/lib/config";
import { Pagination } from "@/components/ui/pagination";

async function getProfile() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(`${API_BASE_URL}/user/me`, {
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

async function getPredictions(page = 1) {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(
      `${API_BASE_URL}/user/predictions?page=${page}&limit=10`,
      {
        headers: {
          cookie: cookieHeader,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return { predictions: [], pagination: { total: 0, totalPages: 0 } };
    }

    const payload = await response.json();
    return payload;
  } catch {
    return { predictions: [], pagination: { total: 0, totalPages: 0 } };
  }
}

export default async function ProfilePage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const [profile, predictionData] = await Promise.all([
    getProfile(),
    getPredictions(page),
  ]);

  const predictions = predictionData.predictions || [];
  const pagination = predictionData.pagination || { total: 0, totalPages: 0 };

  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col items-center pb-12 pt-8 px-4">
      <ProfileHero profile={profile?.user} metadata={profile?.metadata} />
      <ProfileActions />
      <ProfilePerformanceCards />
      
      <div className="w-full mt-8">
        <ProfileRecentHistory predictions={predictions} />
        
        {pagination.total > 10 && (
          <div className="mt-6">
            <Pagination 
              currentPage={page} 
              totalPages={pagination.totalPages} 
              baseUrl="/profile" 
            />
          </div>
        )}
        
        {predictions.length > 0 && (
          <Link 
            href="/predictions" 
            className="mt-4 block text-center text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-main transition-colors"
          >
            View Full History ↗
          </Link>
        )}
      </div>
    </div>
  );
}

