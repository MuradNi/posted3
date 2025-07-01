import { FileText, Plus, Copy, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Templates() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-discord-darker border-b border-discord-dark p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-discord-text">Templates</h2>
            <p className="text-discord-text-muted text-sm">Manage reusable message templates</p>
          </div>
          <Button className="bg-discord-blurple hover:bg-discord-blurple/80 px-4 py-2 rounded-lg font-medium transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Coming Soon */}
        <Card className="glass-effect border-discord-dark">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 mx-auto text-discord-green mb-4" />
            <h3 className="text-xl font-semibold text-discord-text mb-2">Message Templates</h3>
            <p className="text-discord-text-muted mb-6">
              Create and manage reusable message templates for auto-posting, responses, and announcements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 border border-discord-dark rounded-lg">
                <Edit className="w-8 h-8 text-discord-yellow mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Rich Editor</h4>
                <p className="text-sm text-discord-text-muted">Advanced formatting and embeds</p>
              </div>
              <div className="p-4 border border-discord-dark rounded-lg">
                <Copy className="w-8 h-8 text-discord-blurple mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Template Library</h4>
                <p className="text-sm text-discord-text-muted">Pre-built templates for common use cases</p>
              </div>
              <div className="p-4 border border-discord-dark rounded-lg">
                <FileText className="w-8 h-8 text-discord-red mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Variable Support</h4>
                <p className="text-sm text-discord-text-muted">Dynamic content with placeholders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
