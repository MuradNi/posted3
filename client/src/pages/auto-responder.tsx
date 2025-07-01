import { MessageCircle, Plus, Zap, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AutoResponder() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-discord-darker border-b border-discord-dark p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-discord-text">Auto Responder</h2>
            <p className="text-discord-text-muted text-sm">Set up automated message responses</p>
          </div>
          <Button className="bg-discord-blurple hover:bg-discord-blurple/80 px-4 py-2 rounded-lg font-medium transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Coming Soon */}
        <Card className="glass-effect border-discord-dark">
          <CardContent className="p-12 text-center">
            <MessageCircle className="w-16 h-16 mx-auto text-discord-green mb-4" />
            <h3 className="text-xl font-semibold text-discord-text mb-2">Auto Responder</h3>
            <p className="text-discord-text-muted mb-6">
              Create intelligent auto-response rules that trigger based on message content, user mentions, or keywords.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 border border-discord-dark rounded-lg">
                <Zap className="w-8 h-8 text-discord-yellow mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Smart Triggers</h4>
                <p className="text-sm text-discord-text-muted">Keyword, mention, and regex patterns</p>
              </div>
              <div className="p-4 border border-discord-dark rounded-lg">
                <MessageCircle className="w-8 h-8 text-discord-blurple mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Custom Responses</h4>
                <p className="text-sm text-discord-text-muted">Dynamic and personalized replies</p>
              </div>
              <div className="p-4 border border-discord-dark rounded-lg">
                <Filter className="w-8 h-8 text-discord-red mx-auto mb-2" />
                <h4 className="font-semibold text-discord-text mb-1">Advanced Filtering</h4>
                <p className="text-sm text-discord-text-muted">Channel and role-based rules</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
