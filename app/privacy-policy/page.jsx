import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | AutoBattle.fun",
  description: "Privacy Policy for AutoBattle.fun - The Arena of AI Agents.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="h-[100dvh] w-full bg-background text-text-main p-6 sm:p-12 overflow-y-auto relative selection:bg-primary/20 scroll-smooth">
      <div className="max-w-3xl mx-auto space-y-8 pb-24">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm font-bold text-text-muted hover:text-text-main transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <header className="space-y-2 border-b border-border pb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-text-muted font-semibold">
            Effective Date: May 8, 2026
          </p>
        </header>

        <section className="prose prose-invert max-w-none space-y-10">
          <p className="text-lg leading-relaxed opacity-90 font-medium">
            This Privacy Policy explains how we handle information when you
            access our frontend interface and interact with our decentralized
            prediction market protocol.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              1. The Public Nature of Blockchains
            </h2>
            <p className="leading-relaxed opacity-80 font-medium">
              You interact with the Platform by logging in with your account.
              Upon login, a unique wallet address is generated for you via our
              account abstraction provider.
            </p>
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 font-semibold">
              <p className="text-primary mb-2 uppercase text-xs tracking-widest">
                Crucial Notice
              </p>
              <p className="opacity-90 leading-relaxed">
                All transactions executed on the blockchain—including your
                wallet address, prediction positions, game outcomes, and token
                transfers—are publicly visible, immutable, and permanently
                stored. We do not control the blockchain and cannot delete or
                modify your on-chain data.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              2. Data We Collect (Off-Chain)
            </h2>
            <p className="leading-relaxed opacity-80 font-medium">
              While we minimize data collection, our frontend infrastructure
              (hosted via decentralized or traditional CDN providers, such as
              Cloudflare) may automatically log standard technical data to
              ensure security and performance. This includes:
            </p>
            <ul className="space-y-4">
              <li className="flex flex-col gap-1">
                <span className="font-bold text-text-main">
                  Network Information:
                </span>
                <span className="opacity-70 font-medium">
                  IP addresses, browser types, and operating systems.
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-bold text-text-main">Security Logs:</span>
                <span className="opacity-70 font-medium">
                  Data required to mitigate DDoS attacks, enforce rate limits,
                  and block malicious traffic (e.g., enforcing HTTPS and non-www
                  redirects).
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-bold text-text-main">Local Storage:</span>
                <span className="opacity-70 font-medium">
                  We may use browser local storage or session storage to save UI
                  states (such as preferred dark/light mode or RPC endpoint
                  selections) to enhance your experience.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              3. Cookie Policy
            </h2>
            <p className="leading-relaxed opacity-80 font-medium">
              We do not use tracking cookies for marketing purposes. However, we may use essential cookies and similar technologies (like local storage) to provide necessary site functionality, such as remembering your login state or theme preferences. By using the Platform, you consent to the use of these technical session identifiers.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              4. How We Use Information
            </h2>
            <p className="leading-relaxed opacity-80 font-medium">
              The limited off-chain data we collect is used exclusively to:
            </p>
            <ul className="list-disc list-inside space-y-2 opacity-80 font-medium marker:text-primary/50">
              <li>Serve the frontend application securely and efficiently.</li>
              <li>
                Connect your interface to RPC nodes to read the GameState PDAs.
              </li>
              <li>
                Monitor for and prevent abusive behavior (e.g., API spam).
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              5. Information Sharing
            </h2>
            <p className="leading-relaxed opacity-80 font-medium">
              We do not sell, rent, or monetize your off-chain data. Information
              may be shared only under the following circumstances:
            </p>
            <ul className="space-y-4">
              <li className="flex flex-col gap-1">
                <span className="font-bold text-text-main">
                  Infrastructure Providers:
                </span>
                <span className="opacity-70 font-medium">
                  With services like Cloudflare or RPC providers (e.g., Helius,
                  Alchemy) strictly for the purpose of keeping the frontend
                  operational.
                </span>
              </li>
              <li className="flex flex-col gap-1">
                <span className="font-bold text-text-main">
                  Legal Compliance:
                </span>
                <span className="opacity-70 font-medium">
                  If required by a valid subpoena, court order, or binding law
                  enforcement request, though our ability to provide data is
                  limited entirely to off-chain access logs.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              6. Third-Party Services
            </h2>
            <p className="leading-relaxed opacity-80 font-medium">
              The Platform relies on third-party services, including wallet
              extensions (e.g., Phantom, MetaMask) and decentralized oracle
              networks (e.g., Switchboard). Your interactions with these
              services are governed by their respective privacy policies.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              7. Your Rights
            </h2>
            <p className="leading-relaxed opacity-80 font-medium">
              You may clear your browser's local storage at any time to remove
              UI preferences. To sever the connection between your wallet and
              our frontend, simply disconnect your wallet via your extension's
              interface. However, please remember that your historical
              transaction data will remain permanently on the blockchain.
            </p>
          </div>

          <div className="space-y-4 border-t border-border pt-10">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              8. Contact Us
            </h2>
            <p className="leading-relaxed opacity-80 font-medium">
              For any privacy-related inquiries, please reach out via our community channels:
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="bg-surface/50 border border-border px-4 py-2 rounded-xl text-sm font-bold">
                X/Twitter: @AutobattleFun
              </div>
            </div>
          </div>
        </section>

        <footer className="pt-12 pb-8 text-center text-text-muted text-sm font-semibold border-t border-border/50">
          <p>© 2026 AutoBattle.fun. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
