import { useState } from "react";
import { Play, Square, PlayCircle, Bot, Server, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BotStatusCard } from "@/components/bot-status-card";
import { useDiscordBots, useBotActions, useDashboardStats } from "@/hooks/use-discord-bots";
import { Skeleton } from "@/components/ui/skeleton";

export default function ControlCenter() {
  const { data: bots, isLoading: botsLoading } = useDiscordBots();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { startBot, stopBot } = useBotActions();

  const handleStartAllBots = async () => {
    if (!bots) return;
    const offlineBots = bots.filter(bot => bot.status === "offline" || bot.status === "pending");
    for (const bot of offlineBots) {
      startBot.mutate(bot.id);
    }
  };

  const handleStopAllBots = async () => {
    if (!bots) return;
    const onlineBots = bots.filter(bot => bot.status === "online");
    for (const bot of onlineBots) {
      stopBot.mutate(bot.id);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-discord-darker border-b border-discord-dark p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-discord-text">Control Center</h2>
            <p className="text-discord-text-muted text-sm">Centralized bot management and control</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleStartAllBots}
              disabled={startBot.isPending}
              className="bg-discord-green hover:bg-discord-green/80 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Play className="w-4 h-4 mr-2" />
              Start All
            </Button>
            <Button
              onClick={handleStopAllBots}
              disabled={stopBot.isPending}
              variant="outline"
              className="border-discord-red text-discord-red hover:bg-discord-red/10 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop All
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-effect border-discord-dark">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-discord-text-muted flex items-center">
                <Bot className="w-4 h-4 mr-2" />
                Total Bots
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16 bg-discord-dark" />
              ) : (
                <p className="text-2xl font-bold text-discord-text">{stats?.totalBots || 0}</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-effect border-discord-dark">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-discord-text-muted flex items-center">
                <PlayCircle className="w-4 h-4 mr-2 text-discord-green" />
                Active Bots
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16 bg-discord-dark" />
              ) : (
                <p className="text-2xl font-bold text-discord-green">{stats?.activeBots || 0}</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-effect border-discord-dark">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-discord-text-muted flex items-center">
                <Server className="w-4 h-4 mr-2 text-purple-400" />
                Servers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16 bg-discord-dark" />
              ) : (
                <p className="text-2xl font-bold text-discord-text">{stats?.serversConnected || 0}</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass-effect border-discord-dark">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-discord-text-muted flex items-center">
                <MessageCircle className="w-4 h-4 mr-2 text-discord-yellow" />
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16 bg-discord-dark" />
              ) : (
                <p className="text-2xl font-bold text-discord-text">{stats?.messagesSent || 0}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bot Management Grid */}
        <Card className="glass-effect border-discord-dark">
          <CardHeader>
            <CardTitle className="text-discord-text flex items-center justify-between">
              <span>Bot Management</span>
              <div className="flex items-center space-x-2 text-sm font-normal text-discord-text-muted">
                <Clock className="w-4 h-4" />
                <span>Real-time monitoring</span>
                <div className="w-2 h-2 bg-discord-green rounded-full animate-pulse"></div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {botsLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-32 bg-discord-dark" />
                ))}
              </div>
            ) : bots && bots.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {bots.map((bot) => (
                  <BotStatusCard
                    key={bot.id}
                    bot={bot}
                    onStart={() => startBot.mutate(bot.id)}
                    onStop={() => stopBot.mutate(bot.id)}
                    onEdit={() => console.log("Edit bot", bot.id)}
                    isLoading={startBot.isPending || stopBot.isPending}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 mx-auto text-discord-text-muted mb-4" />
                <h3 className="text-lg font-semibold text-discord-text mb-2">No Bots Configured</h3>
                <p className="text-discord-text-muted mb-6">Add your first Discord bot to start managing them from the control center.</p>
                <Button className="bg-discord-blurple hover:bg-discord-blurple/80">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Add First Bot
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Operations */}
        {bots && bots.length > 0 && (
          <Card className="glass-effect border-discord-dark">
            <CardHeader>
              <CardTitle className="text-discord-text">Bulk Operations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={handleStartAllBots}
                  disabled={startBot.isPending}
                  variant="outline"
                  className="flex items-center justify-center space-x-2 p-4 h-auto border-discord-dark hover:border-discord-green hover:bg-discord-green/10 transition-all"
                >
                  <Play className="w-5 h-5 text-discord-green" />
                  <div className="text-left">
                    <p className="font-medium text-discord-text">Start All Offline</p>
                    <p className="text-sm text-discord-text-muted">
                      {bots.filter(bot => bot.status !== "online").length} bots
                    </p>
                  </div>
                </Button>

                <Button
                  onClick={handleStopAllBots}
                  disabled={stopBot.isPending}
                  variant="outline"
                  className="flex items-center justify-center space-x-2 p-4 h-auto border-discord-dark hover:border-discord-red hover:bg-discord-red/10 transition-all"
                >
                  <Square className="w-5 h-5 text-discord-red" />
                  <div className="text-left">
                    <p className="font-medium text-discord-text">Stop All Online</p>
                    <p className="text-sm text-discord-text-muted">
                      {bots.filter(bot => bot.status === "online").length} bots
                    </p>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-center space-x-2 p-4 h-auto border-discord-dark hover:border-discord-blurple hover:bg-discord-blurple/10 transition-all"
                >
                  <Bot className="w-5 h-5 text-discord-blurple" />
                  <div className="text-left">
                    <p className="font-medium text-discord-text">Restart All</p>
                    <p className="text-sm text-discord-text-muted">Sequential restart</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
