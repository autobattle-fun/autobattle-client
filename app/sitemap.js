export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = "https://autobattle.fun";

  const staticRoutes = [
    "", // Home page (root page.jsx)
    "/predictions", // Betting/Prediction market
    "/history", // Past battle logs
    "/games", // Game directory
    "/login", // Auth
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "/" || route === "/predictions" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/history" ? 0.9 : 0.7,
  }));

  return [...staticRoutes];
}
