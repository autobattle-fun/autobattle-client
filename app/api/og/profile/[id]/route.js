import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    let backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8080";

    if (backendUrl.includes("localhost")) {
      backendUrl = backendUrl.replace("localhost", "127.0.0.1");
    }

    const response = await fetch(`${backendUrl}/api/user/profile/${id}`, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return new Response(`Backend Error: ${response.status}`, { status: 500 });
    }

    const payload = await response.json();
    const user = payload?.data;

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const winRate =
      user.totalPredictions > 0
        ? ((user.totalWins / user.totalPredictions) * 100).toFixed(1)
        : "0";

    // Load fonts using fs for Node.js runtime
    const semiboldFont = await readFile(
      join(process.cwd(), "app/fonts/OpenRunde-Semibold.woff"),
    );

    const boldFont = await readFile(
      join(process.cwd(), "app/fonts/OpenRunde-Bold.woff"),
    );

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          backgroundColor: "#f3f4f6",
          padding: "40px",
          fontFamily: "OpenRunde",
        }}
      >
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <svg
                width="50"
                height="50"
                viewBox="0 0 476 533"
                style={{ display: "flex", marginRight: "16px" }}
              >
                <path
                  d="M288.532,279.454l154.935,-101.219c16.835,-12.294 32.212,-1.542 32.212,24.502l0,155.022c0,26.044 -15.377,56.756 -32.212,67.464l-154.935,102.804c-16.92,12.294 -32.212,0 -32.212,-24.545l0,-156.437c0,-26.129 15.292,-55.257 32.212,-67.594l0,0.002Zm-87.469,-35.21l-141.184,-90.596c-21.46,-12.251 -19.918,-35.253 3.041,-50.588l138.146,-90.51c22.96,-15.334 58.298,-16.92 78.259,-3.084l141.14,90.51c21.46,12.294 19.918,35.339 -3.041,50.631l-138.102,90.51c-21.545,15.377 -58.341,16.877 -78.259,3.127l0,-0Zm-15.42,35.21l-153.389,-101.219c-16.877,-12.294 -32.255,-1.542 -32.255,24.502l0,155.022c0,26.044 15.334,56.756 32.255,67.464l153.389,102.804c18.462,12.294 32.212,0 32.212,-24.545l0.043,-156.437c0,-26.129 -13.793,-55.257 -32.255,-67.594l-0,0.002Z"
                  fill="white"
                />
              </svg>
              <div
                style={{
                  display: "flex",
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "-1px",
                }}
              >
                Autobattle.fun
              </div>
            </div>
            <div
              style={{
                display: "flex",
                backgroundColor: "#10D960",
                padding: "12px 24px",
                borderRadius: "30px",
                fontSize: "18px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Player Profile
            </div>
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
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "20px",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.7)",
                    marginBottom: "10px",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ display: "flex", marginRight: "10px" }}
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Combatant identified
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "84px",
                    fontWeight: 700,
                    lineHeight: 1,
                    letterSpacing: "-2px",
                  }}
                >
                  {user.username}
                </div>
              </div>
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
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "18px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Total Predictions
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "64px",
                    fontWeight: 700,
                    color: "#FFF",
                    lineHeight: 1,
                  }}
                >
                  {user.totalPredictions || 0}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Victories
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "64px",
                  fontWeight: 700,
                  color: "#10D960",
                  lineHeight: 1,
                }}
              >
                {user.totalWins || 0}
              </div>
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
                  display: "flex",
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Win Rate
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "64px",
                  fontWeight: 700,
                  color: "#F59E0B",
                  lineHeight: 1,
                }}
              >
                {winRate}%
              </div>
            </div>
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "OpenRunde",
            data: await semiboldFont,
            weight: 600,
            style: "normal",
          },
          {
            name: "OpenRunde",
            data: await boldFont,
            weight: 700,
            style: "normal",
          },
        ],
      },
    );
  } catch (e) {
    return new Response("Failed to generate image", { status: 500 });
  }
}
