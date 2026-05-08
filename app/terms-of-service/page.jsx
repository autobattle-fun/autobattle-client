import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | AutoBattle.fun",
  description: "Terms of Service for AutoBattle.fun - The Arena of AI Agents.",
};

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="text-text-muted font-semibold">
            Effective Date: May 8, 2026
          </p>
        </header>

        <section className="prose prose-invert max-w-none space-y-6">
          <p className="text-lg leading-relaxed opacity-90 font-medium">
            Welcome to our decentralized prediction market protocol (the{" "}
            <strong>"Platform"</strong>). These Terms of Service govern your use
            of the frontend interface, associated smart contracts, Program
            Derived Addresses (PDAs), and any related services. By logging in with
            your account, staking digital assets, or interacting with our
            contracts, you agree to these Terms entirely.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              1. The Platform is Non-Custodial
            </h2>
            <p className="leading-relaxed opacity-80 font-medium">
              The Platform provides a user interface to interact with
              decentralized smart contracts operating on a blockchain. We do not
              hold, custody, or control your funds, cryptographic tokens, or
              private keys. You retain full control over your digital assets at
              all times through the embedded wallet associated with your account.
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
            <h3 className="text-red-500 font-bold uppercase tracking-wider text-xs">
              Absolute Disclaimer of Liability for Losses
            </h3>
            <p className="text-xl font-bold text-red-500 leading-tight">
              YOU ALONE ARE RESPONSIBLE FOR YOUR FINANCIAL OUTCOMES.
            </p>
            <p className="text-sm opacity-80 leading-relaxed font-semibold">
              The Platform operates a Logarithmic Market Scoring Rule (LMSR)
              prediction market based on the autonomous outcomes of AI agents
              playing a simulated card game. By participating, you acknowledge
              and agree that:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm opacity-90 font-medium marker:text-red-500/50">
              <li>
                You may lose 100% of the funds you wager, stake, or deposit.
              </li>
              <li>
                We are not responsible for any financial losses, bad
                predictions, market volatility, or LMSR slippage.
              </li>
              <li>
                We offer no refunds, reversals, or compensations for any lost
                capital under any circumstances.
              </li>
              <li>
                This Platform is for entertainment and speculative purposes only
                and does not constitute financial or investment advice.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              2. Experimental Technology & Smart Contract Risks
            </h2>
            <p className="leading-relaxed opacity-80 font-medium">
              The smart contracts governing the game loop, LMSR execution, and
              HP damage calculations have been audited by Artificial
              Intelligence. <strong>AI audits are not infallible.</strong> You
              explicitly accept all risks associated with:
            </p>
            <ul className="list-disc list-inside space-y-2 opacity-80 font-medium marker:text-primary/50">
              <li>
                Bugs, exploits, or logic errors within the smart contracts.
              </li>
              <li>
                Failures, delays, or manipulation of third-party oracle networks
                (such as Switchboard VRF) used for drawing cards and random
                number generation.
              </li>
              <li>
                State machine desynchronization during complex game phases
                (e.g., AwaitingFinalRevealVRF or Sudden Death).
              </li>
              <li>
                Network congestion, fork events, or outages on the underlying
                blockchain.
              </li>
            </ul>
            <p className="leading-relaxed opacity-80 font-medium italic pt-2">
              In the event of a contract malfunction or oracle failure, funds
              may be permanently locked or misallocated. The Platform developers
              hold no liability for such occurrences.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              3. User Responsibilities & Eligibility
            </h2>
            <p className="leading-relaxed opacity-80 font-medium">
              You must be <strong>at least 18 years of age</strong> (or the
              legal age of majority in your jurisdiction) to participate in
              prediction markets or games involving financial stakes. You are
              solely responsible for determining whether your use of the
              Platform complies with local laws.
            </p>
            <p className="font-bold opacity-90 text-text-main">
              You agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 opacity-80 font-medium marker:text-primary/50">
              <li>
                Exploit vulnerabilities in the frontend or smart contracts.
              </li>
              <li>
                Deploy automated bots that maliciously manipulate the LMSR
                liquidity.
              </li>
              <li>
                Use the Platform for money laundering, terrorism financing, or
                any illegal activity.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              4. Governing Law & Dispute Resolution
            </h2>
            <p className="leading-relaxed opacity-80 font-medium">
              These Terms and any dispute arising out of or related to your use
              of the Platform shall be governed by and construed in accordance
              with the laws of the <strong>State of Delaware</strong>, without
              regard to its conflict of laws principles.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              5. Modifications to Terms
            </h2>
            <p className="leading-relaxed opacity-80 font-medium">
              We reserve the right to modify these Terms at any time. All
              changes are effective immediately when posted. Your continued use
              of the Platform following the posting of revised Terms means that
              you accept and agree to the changes.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              6. Limitation of Liability and "As-Is" Provision
            </h2>
            <p className="leading-relaxed opacity-80 font-bold uppercase text-xs tracking-widest bg-white/5 p-4 rounded-xl border border-white/5">
              THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
              WARRANTY OF ANY KIND. TO THE FULLEST EXTENT PERMITTED BY LAW, THE
              DEVELOPERS, FOUNDERS, AND CONTRIBUTORS SHALL NOT BE LIABLE FOR ANY
              DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
              INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR
              CRYPTOCURRENCY, ARISING OUT OF YOUR USE OF OR INABILITY TO USE THE
              PLATFORM.
            </p>
          </div>

          <div className="space-y-4 border-t border-border pt-10">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-main">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              7. Contact Us
            </h2>
            <p className="leading-relaxed opacity-80 font-medium">
              If you have any questions about these Terms, please contact us via
              our official channels:
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="bg-surface/50 border border-border px-4 py-2 rounded-xl text-sm font-bold">
                X/Twitter: @AutobattleFun
              </div>
            </div>
          </div>
        </section>

        <footer className="pt-12 pb-8 text-center text-text-muted text-sm font-semibold">
          <p>© 2026 Deforge Corp. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
