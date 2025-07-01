import { Users, Plus, Settings, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MultiAccount() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-discord-darker border-b border-discord-dark p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-discord-text">Multi-Account</h2>
            <p className="text-discord-text-muted text-sm">Manage multiple bots across different servers</p>
          </div>
          <Button className="bg-discord-blurple hover:bg-discord-blurple/80 px-4 py-2 rounded-lg font-medium transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Coming Soon */}
        <Card className="glass-effect border-discord-dark">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-discord-blurple mb-4" />
            <h3 className="text-xl font-semibold text-discord-text mb-2">Multi-Account Management</h3>
            <p className="text-discord-text-muted mb-6">
              Efficiently manage multiple Discord bots across different servers with bulk operations and unified controls.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 border border-discord-dark rounded-lg">
                <PlayCircle className="w-8 h-8 text-discord-green mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Bulk Operations</h4>
                <p className="text-sm text-discord-text-muted">Start, stop, and configure multiple bots</p>
              </div>
              <div className="p-4 border border-discord-dark rounded-lg">
                <Settings className="w-8 h-8 text-discord-yellow mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Unified Config</h4>
                <p className="text-sm text-discord-text-muted">Apply settings across all bots</p>
              </div>
              <div className="p-4 border border-discord-dark rounded-lg">
                <Users className="w-8 h-8 text-discord-red mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Server Groups</h4>
                <p className="text-sm text-discord-text-muted">Organize bots by server categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
