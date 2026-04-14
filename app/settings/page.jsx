import { Card } from "@/components/ui/card";
import { ChevronRight, Power, Sun } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-xl mx-auto h-full flex flex-col pt-16">
      <h1 className="text-4xl font-bold mb-2">Settings</h1>
      <p className="text-text-muted text-sm mb-6">
        Manage your preferences and settings
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Card className="w-full bg-element rounded-2xl p-5 flex items-center justify-between border border-border hover:bg-element-hover transition-colors cursor-pointer shadow-none">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-normal mb-0.5">
                Edit Profile
              </div>
            </div>
            <div className="text-right space-y-2">
              <ChevronRight className="w-5 h-5 text-text-main" />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <Card className="w-full bg-element rounded-2xl p-5 flex items-center justify-between border border-border hover:bg-element-hover transition-colors cursor-pointer shadow-none">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-normal mb-0.5">Display</div>
            </div>
            <div className="text-right space-y-2">
              <Sun className="w-5 h-5 text-text-main" />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <Card className="w-full bg-element rounded-2xl p-5 flex items-center justify-between border border-border hover:bg-element-hover transition-colors cursor-pointer shadow-none">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-normal mb-0.5">
                follow @autobattle_fun on X
              </div>
            </div>
            <div className="text-right space-y-2">
              <ChevronRight className="w-5 h-5 text-text-main" />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <Card className="w-full bg-element rounded-2xl p-5 flex items-center justify-between border border-border hover:bg-element-hover transition-colors cursor-pointer shadow-none">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-normal mb-0.5">Sign out</div>
            </div>
            <div className="text-right space-y-2">
              <Power className="w-5 h-5 text-text-main" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
