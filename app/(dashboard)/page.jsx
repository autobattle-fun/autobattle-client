import { LeftSidebar } from '@/components/dashboard/LeftSidebar';
import { RightSidebar } from '@/components/dashboard/RightSidebar';
import { ArenaView } from '@/components/dashboard/ArenaView';

export default function DashboardPage() {
  return (
    <>
      <LeftSidebar />
      <ArenaView />
      <RightSidebar />
    </>
  );
}
