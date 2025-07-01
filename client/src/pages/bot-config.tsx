import { useState } from "react";
import { Plus, Search, Filter, Settings, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AddBotModal } from "@/components/add-bot-modal";
import { useDiscordBots, useBotActions } from "@/hooks/use-discord-bots";
import { getStatusBadgeColor } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function BotConfig() {
  const [isAddBotModalOpen, setIsAddBotModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: bots, isLoading } = useDiscordBots();
  const { deleteBot } = useBotActions();

  const filteredBots = bots?.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.serverName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-discord-darker border-b border-discord-dark p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-discord-text">Bot Configuration</h2>
            <p className="text-discord-text-muted text-sm">Create and manage your Discord bots</p>
          </div>
          <Button
            onClick={() => setIsAddBotModalOpen(true)}
            className="bg-discord-blurple hover:bg-discord-blurple/80 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Bot
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Search and Filters */}
        <Card className="glass-effect border-discord-dark">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-discord-text-muted w-4 h-4" />
                <Input
                  placeholder="Search bots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-discord-dark border-discord-dark focus:border-discord-blurple"
                />
              </div>
              <Button
                variant="outline"
                className="border-discord-dark hover:bg-discord-dark"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bot List */}
        <Card className="glass-effect border-discord-dark">
          <CardHeader>
            <CardTitle className="text-discord-text">Bot Management</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-discord-dark rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-12 h-12 rounded-full bg-discord-dark" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32 bg-discord-dark" />
                        <Skeleton className="h-3 w-24 bg-discord-dark" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-16 bg-discord-dark" />
                      <Skeleton className="h-8 w-8 bg-discord-dark" />
                      <Skeleton className="h-8 w-8 bg-discord-dark" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBots && filteredBots.length > 0 ? (
              <div className="space-y-4">
                {filteredBots.map((bot) => (
                  <div
                    key={bot.id}
                    className="flex items-center justify-between p-4 border border-discord-dark rounded-lg hover:border-discord-blurple/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-discord-blurple rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {bot.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-discord-text">{bot.name}</h3>
                        <p className="text-sm text-discord-text-muted">
                          {bot.serverName || "Unknown Server"} • {bot.channelsConnected || 0} channels
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusBadgeColor(bot.status)}>
                        {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 hover:bg-discord-dark transition-colors"
                        >
                          <Edit className="w-4 h-4 text-discord-text-muted" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 hover:bg-discord-dark transition-colors"
                        >
                          <Settings className="w-4 h-4 text-discord-text-muted" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteBot.mutate(bot.id)}
                          disabled={deleteBot.isPending}
                          className="p-2 hover:bg-discord-dark transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-discord-red" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Settings className="w-16 h-16 mx-auto text-discord-text-muted mb-4" />
                <h3 className="text-lg font-semibold text-discord-text mb-2">
                  {searchQuery ? "No matching bots found" : "No bots configured"}
                </h3>
                <p className="text-discord-text-muted mb-6">
                  {searchQuery
                    ? "Try adjusting your search criteria"
                    : "Add your first Discord bot to get started with automated management"}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setIsAddBotModalOpen(true)}
                    className="bg-discord-blurple hover:bg-discord-blurple/80"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Bot
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuration Guide */}
        <Card className="glass-effect border-discord-dark">
          <CardHeader>
            <CardTitle className="text-discord-text">Configuration Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-discord-dark rounded-lg">
                <h4 className="font-semibold text-discord-text mb-2">Getting Bot Token</h4>
                <ol className="text-sm text-discord-text-muted space-y-1 list-decimal list-inside">
                  <li>Go to Discord Developer Portal</li>
                  <li>Create a new application</li>
                  <li>Navigate to Bot section</li>
                  <li>Copy the bot token</li>
                </ol>
              </div>
              <div className="p-4 border border-discord-dark rounded-lg">
                <h4 className="font-semibold text-discord-text mb-2">Finding Server ID</h4>
                <ol className="text-sm text-discord-text-muted space-y-1 list-decimal list-inside">
                  <li>Enable Developer Mode in Discord</li>
                  <li>Right-click on your server</li>
                  <li>Select "Copy Server ID"</li>
                  <li>Paste the ID in the form</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <AddBotModal open={isAddBotModalOpen} onOpenChange={setIsAddBotModalOpen} />
    </div>
  );
}
