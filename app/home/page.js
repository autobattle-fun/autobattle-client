import { Ticker } from "@/components/Ticker";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AgentGrid } from "@/components/AgentGrid";
import { BettingTable } from "@/components/BettingTable";
import { ArenaStats } from "@/components/ArenaStats";
import { TwitterWall } from "@/components/TwitterWall";
import { CommunitySection } from "@/components/CommunitySection";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col relative">
      <BackgroundEffects />
      <Ticker />
      <Navbar />
      <Hero />
      <AgentGrid />
      <BettingTable />
      <ArenaStats />
      <CommunitySection />
      <TwitterWall />
      <Footer />
    </main>
  );
}
