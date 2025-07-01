import { BarChart3, TrendingUp, Activity, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Analytics() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-discord-darker border-b border-discord-dark p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-discord-text">Analytics</h2>
            <p className="text-discord-text-muted text-sm">Monitor bot performance and usage statistics</p>
          </div>
          <Button className="bg-discord-blurple hover:bg-discord-blurple/80 px-4 py-2 rounded-lg font-medium transition-colors">
            <Eye className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Coming Soon */}
        <Card className="glass-effect border-discord-dark">
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-16 h-16 mx-auto text-discord-yellow mb-4" />
            <h3 className="text-xl font-semibold text-discord-text mb-2">Analytics Dashboard</h3>
            <p className="text-discord-text-muted mb-6">
              Get detailed insights into your bot performance, message statistics, user engagement, and server activity.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 border border-discord-dark rounded-lg">
                <TrendingUp className="w-8 h-8 text-discord-green mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Performance Metrics</h4>
                <p className="text-sm text-discord-text-muted">Response times and uptime tracking</p>
              </div>
              <div className="p-4 border border-discord-dark rounded-lg">
                <Activity className="w-8 h-8 text-discord-blurple mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Usage Statistics</h4>
                <p className="text-sm text-discord-text-muted">Message counts and user interactions</p>
              </div>
              <div className="p-4 border border-discord-dark rounded-lg">
                <BarChart3 className="w-8 h-8 text-discord-red mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Custom Reports</h4>
                <p className="text-sm text-discord-text-muted">Export and share analytics data</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
