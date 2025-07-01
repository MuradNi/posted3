import { useState } from "react";
import { Calendar, Plus, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AutoPoster() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-discord-darker border-b border-discord-dark p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-discord-text">Auto Poster</h2>
            <p className="text-discord-text-muted text-sm">Schedule automated message posting</p>
          </div>
          <Button className="bg-discord-blurple hover:bg-discord-blurple/80 px-4 py-2 rounded-lg font-medium transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Schedule
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Coming Soon */}
        <Card className="glass-effect border-discord-dark">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto text-discord-blurple mb-4" />
            <h3 className="text-xl font-semibold text-discord-text mb-2">Auto Poster</h3>
            <p className="text-discord-text-muted mb-6">
              Schedule automated message posting across your Discord servers. Set up recurring messages, announcements, and reminders.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 border border-discord-dark rounded-lg">
                <Clock className="w-8 h-8 text-discord-green mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Flexible Scheduling</h4>
                <p className="text-sm text-discord-text-muted">Set custom intervals and timing</p>
              </div>
              <div className="p-4 border border-discord-dark rounded-lg">
                <MessageSquare className="w-8 h-8 text-discord-yellow mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Rich Messages</h4>
                <p className="text-sm text-discord-text-muted">Support for embeds and formatting</p>
              </div>
              <div className="p-4 border border-discord-dark rounded-lg">
                <Calendar className="w-8 h-8 text-discord-blurple mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Multiple Channels</h4>
                <p className="text-sm text-discord-text-muted">Post to multiple channels simultaneously</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
