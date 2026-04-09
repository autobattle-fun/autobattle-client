import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen flex flex-col bg-background text-white overflow-hidden">
      <DashboardHeader />
      <div className="flex-1 flex overflow-hidden">{children}</div>
    </div>
  );
}
