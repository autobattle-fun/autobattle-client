import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    let backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8080";

    // Ensure we use 127.0.0.1 instead of localhost for more reliable local fetching in edge runtime
    if (backendUrl.includes("localhost")) {
      backendUrl = backendUrl.replace("localhost", "127.0.0.1");
    }

    const response = await fetch(`${backendUrl}/api/games/${id}/details`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 0 }, // Don't cache the fetch in dev
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(`Backend Error: ${response.status}`, { status: 500 });
    }

    const payload = await response.json();
    const match = payload?.data?.match;

    if (!match) {
      return new Response("Match not found", { status: 404 });
    }

    const date = new Date(match.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const isResolved =
      match.status === "COMPLETED" || match.status === "RESOLVED";

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#f3f4f6",
          padding: "40px",
          fontFamily: 'Inter, "sans-serif"',
        }}
      >
        {/* Inner Purple Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: "#6C47FF",
            borderRadius: "32px",
            padding: "60px",
            color: "white",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "60px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg
                width="50"
                height="50"
                viewBox="0 0 476 533"
                style={{ marginRight: "16px" }}
              >
                <path
                  d="M288.532,279.454l154.935,-101.219c16.835,-12.294 32.212,-1.542 32.212,24.502l0,155.022c0,26.044 -15.377,56.756 -32.212,67.464l-154.935,102.804c-16.92,12.294 -32.212,0 -32.212,-24.545l0,-156.437c0,-26.129 15.292,-55.257 32.212,-67.594l0,0.002Zm-87.469,-35.21l-141.184,-90.596c-21.46,-12.251 -19.918,-35.253 3.041,-50.588l138.146,-90.51c22.96,-15.334 58.298,-16.92 78.259,-3.084l141.14,90.51c21.46,12.294 19.918,35.339 -3.041,50.631l-138.102,90.51c-21.545,15.377 -58.341,16.877 -78.259,3.127l0,-0Zm-15.42,35.21l-153.389,-101.219c-16.877,-12.294 -32.255,-1.542 -32.255,24.502l0,155.022c0,26.044 15.334,56.756 32.255,67.464l153.389,102.804c18.462,12.294 32.212,0 32.212,-24.545l0.043,-156.437c0,-26.129 -13.793,-55.257 -32.255,-67.594l-0,0.002Z"
                  fill="white"
                />
              </svg>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 900,
                  color: "white",
                  letterSpacing: "-1px",
                }}
              >
                AutoBattle.fun
              </div>
            </div>
            {isResolved && (
              <div
                style={{
                  display: "flex",
                  backgroundColor: "#10D960",
                  padding: "12px 24px",
                  borderRadius: "30px",
                  fontSize: "18px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Resolved
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.7)",
                marginBottom: "12px",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "10px" }}
              >
                <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
                <path d="M13 19l6-6" />
                <path d="M16 16l4 4" />
                <path d="M19 21l2-2" />
                <path d="M8.5 6.5L10 8" />
                <path d="M6.5 8.5L8 10" />
                <path d="M15 11.5l1.5-1.5M11.5 15l-1.5 1.5" />
              </svg>
              Match Details
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "72px",
                fontWeight: 800,
                marginBottom: "24px",
                lineHeight: 1,
                letterSpacing: "-1px",
              }}
            >
              Match #{id}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "10px 20px",
                borderRadius: "12px",
                fontSize: "20px",
                fontWeight: 600,
                width: "fit-content",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "10px", opacity: 0.8 }}
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              {date}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              height: "1px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              marginBottom: "40px",
            }}
          />

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "flex-end",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "16px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Red Agent
              </div>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                }}
              >
                {match.redName || "Unknown"}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                position: "absolute",
                left: "50%",
                bottom: "10px",
                transform: "translateX(-50%)",
                fontSize: "36px",
                fontWeight: 900,
                color: "rgba(255, 255, 255, 0.2)",
                letterSpacing: "2px",
              }}
            >
              VS
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "16px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Blue Agent
              </div>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                }}
              >
                {match.blueName || "Unknown"}
              </div>
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e) {
    return new Response("Failed to generate image", { status: 500 });
  }
}
