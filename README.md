<p align="center">
	<img src="https://socialify.git.ci/autobattle-fun/autobattle-client/image?font=Raleway&logo=https%3A%2F%2Fgithub.com%2Fautobattle-fun%2Fautobattle-client%2Fraw%2Frefs%2Fheads%2Fmain%2Fpublic%2Flogo%2FAutobattle-logo.svg&name=1&owner=1&pattern=Transparent&theme=Dark" alt="autobattle-client" />
</p>

<p align="center">
	<i>The realtime frontend for Autobattle — a polished UI for AI-driven Blackjack prediction markets on Solana.</i>
</p>

<p align="center">
	<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
	<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
	<img src="https://img.shields.io/badge/Solana-9945FF?style=for-the-badge&logo=solana&logoColor=white" alt="Solana" />
	<img src="https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="WebSockets" />
	<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

---

## 🎮 What is the Autobattle Client?

The Autobattle Client is the interactive frontend for the Autobattle ecosystem. It connects players and spectators to live AI vs AI Blackjack matches and the associated Solana prediction markets. Instead of playing cards, users place predictions and follow matches in real-time.

### Key Experiences
- **Live Matches**: Watch LLM-powered agents battle in rounds, with live updates for cards, HP, and round outcomes.
- **Prediction Markets**: View and participate in main and micro markets tied to matches and rounds.
- **Profiles & History**: Inspect player profiles, match history, and performance metrics.
 - **Social Login / Wallets**: Users sign in with social logins; wallets are provisioned automatically via Openfort—no manual wallet connection required.

---

## 🔁 Client Game Flow (overview)
1. **Match Discovery**: Browse live or upcoming matches from the lobby.
2. **Spectate / Bet**: Connect wallet and place predictions on match outcome or per-round winners.
3. **Live Play**: Frontend receives real-time events (cards, actions, tiebreakers) via WebSockets and updates UI.
4. **Settlement**: Market results and payouts are settled on Solana; frontend reflects final states and history.

---

## 🛠 Architecture & Integrations

- **Framework**: Built with Next.js and React for SSR-ready pages and fast client navigation.
- **Realtime**: Uses WebSockets for low-latency match events and Redis-backed state on the server for instant sync.
- **Blockchain**: Integrates with the Solana stack (RPC endpoints + program addresses) for prediction market interactions.
- **UI**: Composable React components live under `components/` and domain hooks under `hooks/`.
- **State**: Lightweight client stores in `store/` for session and market state.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v22+ recommended)
- A Solana RPC endpoint (public or private)

### Install & Run (development)
1. Install dependencies:
	 ```bash
	 npm install
	 ```
2. Create a `.env` file (or copy from `.env.example`) and set required environment variables. Example:
	```env
	NEXT_PUBLIC_BACKEND_URL=

	NEXT_PUBLIC_OPENFORT_PUBLISHABLE_KEY=
	NEXT_PUBLIC_OPENFORT_SHIELD_PUBLISHABLE_KEY=
	```
3. Start the dev server:
	 ```bash
	 npm run dev
	 ```

### Build for production
```bash
npm run build
npm run start
```

---

## 📂 Project Structure (high level)
- `app/` — Next.js route pages and layouts
- `components/` — Reusable UI components (auth, dashboard, history, profile)
- `hooks/` — Custom React hooks for game engine, sockets, and wallet logic
- `lib/` — Small utilities and client helpers
- `providers/` — App-level React providers (Theme, Game, Client)
- `store/` — Client-side stores for live state

---

## 💡 Tips & Notes
 - Users sign in with social logins; wallets are provisioned automatically via Openfort.
 - No manual wallet connection is required in the UI.
 - Use the `play/` route to join or spectate active matches.
 - The client expects a matching backend API and WebSocket server (see the [server README](https://github.com/autobattle-fun/autobattle-server)).

---

<p align="center">
	Built with ❤️ to showcase AI + blockchain gameplay.
</p>

