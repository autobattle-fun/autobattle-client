import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL } from "@/lib/config";
import { ProfileRecentHistory } from "@/components/profile/ProfileRecentHistory";
import { Pagination } from "@/components/ui/pagination";

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

    if (response.status === 401) {
      redirect("/login");
    }

    if (!response.ok) {
      return { predictions: [], pagination: { total: 0, totalPages: 0 } };
    }

    const payload = await response.json();
    return payload;
  } catch {
    return { predictions: [], pagination: { total: 0, totalPages: 0 } };
  }
}

export default async function PredictionsPage({ searchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const data = await getPredictions(page);

  return (
    <div className="mx-auto flex h-full w-full max-w-xl flex-col items-center pb-12 pt-8 px-4">
      <div className="w-full mb-6">
        <h1 className="text-2xl font-bold">Your Predictions</h1>
        <p className="text-sm text-text-muted">View all your historical match predictions</p>
      </div>

      <ProfileRecentHistory predictions={data.predictions} />

      {data.pagination.total > 10 && (
        <div className="mt-8 w-full">
          <Pagination
            currentPage={page}
            totalPages={data.pagination.totalPages}
            baseUrl="/predictions"
          />
        </div>
      )}
    </div>
  );
}
