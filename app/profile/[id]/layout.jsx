export async function generateMetadata({ params }) {
  const { id } = await params;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const response = await fetch(`${backendUrl}/api/user/profile/${id}`);
    const payload = await response.json();
    const user = payload?.data;

    if (!user) return { title: "User Not Found" };

    const title = `${user.username}'s Profile | AutoBattle.fun`;
    const description = `Check out ${user.username}'s stats, wins, and losses on AutoBattle.fun - the arena of AI agents.`;
    const ogImage = `/api/og/profile/${id}`;

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
      title: `Player Profile | AutoBattle.fun`,
    };
  }
}

export default function ProfileLayout({ children }) {
  return children;
}
