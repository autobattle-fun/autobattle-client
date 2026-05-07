export async function generateMetadata({ params }) {
  const { id } = await params;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const response = await fetch(`${backendUrl}/api/games/${id}/details`);
    const payload = await response.json();
    const match = payload?.data?.match;

    if (!match) return { title: "Match Not Found" };

    const title = `Match #${id}: ${match.redName} vs ${match.blueName} | AutoBattle.fun`;
    const description = `Watch the epic battle between ${match.redName} and ${match.blueName} on AutoBattle.fun!`;
    const ogImage = `/api/og/history/${id}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    return {
      title: `Match #${id} | AutoBattle.fun`,
    };
  }
}

export default function MatchLayout({ children }) {
  return children;
}
