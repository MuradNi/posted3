import { useState } from "react";
import { Plus, Bell, Bot, PlayCircle, MessageCircle, Server, Play, Square, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BotStatusCard } from "@/components/bot-status-card";
import { AddBotModal } from "@/components/add-bot-modal";
import { useDiscordBots, useBotActions, useDashboardStats, useActivityLogs } from "@/hooks/use-discord-bots";
import { formatRelativeTime } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [isAddBotModalOpen, setIsAddBotModalOpen] = useState(false);
  const { data: bots, isLoading: botsLoading } = useDiscordBots();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: activityLogs, isLoading: logsLoading } = useActivityLogs();
  const { startBot, stopBot } = useBotActions();

  const handleStartAllBots = async () => {
    if (!bots) return;
    const offlineBots = bots.filter(bot => bot.status === "offline");
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
            <h2 className="text-xl font-semibold text-discord-text">Dashboard</h2>
            <p className="text-discord-text-muted text-sm">Monitor and manage your Discord bots</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative p-2 rounded-lg hover:bg-discord-dark transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-discord-red rounded-full text-xs flex items-center justify-center text-white">
                3
              </span>
            </Button>
            <Button
              onClick={() => setIsAddBotModalOpen(true)}
              className="bg-discord-blurple hover:bg-discord-blurple/80 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Bot
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-effect border-discord-dark animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-discord-text-muted text-sm">Total Bots</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16 bg-discord-dark" />
                  ) : (
                    <p className="text-2xl font-bold text-discord-text">{stats?.totalBots || 0}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-discord-blurple/20 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-discord-blurple" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-discord-dark animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-discord-text-muted text-sm">Active Bots</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16 bg-discord-dark" />
                  ) : (
                    <p className="text-2xl font-bold text-discord-green">{stats?.activeBots || 0}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-discord-green/20 rounded-lg flex items-center justify-center">
                  <PlayCircle className="w-6 h-6 text-discord-green" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-discord-dark animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-discord-text-muted text-sm">Messages Sent</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16 bg-discord-dark" />
                  ) : (
                    <p className="text-2xl font-bold text-discord-text">{stats?.messagesSent || 0}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-discord-yellow/20 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-discord-yellow" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-discord-dark animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-discord-text-muted text-sm">Servers Connected</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16 bg-discord-dark" />
                  ) : (
                    <p className="text-2xl font-bold text-discord-text">{stats?.serversConnected || 0}</p>
                  )}
                </div>
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Server className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass-effect border-discord-dark animate-slide-up">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-discord-text">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleStartAllBots}
                variant="outline"
                className="flex items-center space-x-3 p-4 h-auto border-discord-dark hover:border-discord-green hover:bg-discord-green/10 transition-all group"
                disabled={startBot.isPending}
              >
                <div className="w-10 h-10 bg-discord-green/20 group-hover:bg-discord-green/30 rounded-lg flex items-center justify-center transition-colors">
                  <Play className="w-5 h-5 text-discord-green" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-discord-text">Start All Bots</p>
                  <p className="text-sm text-discord-text-muted">Activate all configured bots</p>
                </div>
              </Button>

              <Button
                onClick={handleStopAllBots}
                variant="outline"
                className="flex items-center space-x-3 p-4 h-auto border-discord-dark hover:border-discord-red hover:bg-discord-red/10 transition-all group"
                disabled={stopBot.isPending}
              >
                <div className="w-10 h-10 bg-discord-red/20 group-hover:bg-discord-red/30 rounded-lg flex items-center justify-center transition-colors">
                  <Square className="w-5 h-5 text-discord-red" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-discord-text">Stop All Bots</p>
                  <p className="text-sm text-discord-text-muted">Deactivate all running bots</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="flex items-center space-x-3 p-4 h-auto border-discord-dark hover:border-discord-blurple hover:bg-discord-blurple/10 transition-all group"
              >
                <div className="w-10 h-10 bg-discord-blurple/20 group-hover:bg-discord-blurple/30 rounded-lg flex items-center justify-center transition-colors">
                  <Settings className="w-5 h-5 text-discord-blurple" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-discord-text">Bulk Configure</p>
                  <p className="text-sm text-discord-text-muted">Configure multiple bots</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bot Status Overview */}
        <Card className="glass-effect border-discord-dark animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-discord-text">Bot Status Overview</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-discord-text-muted">Auto-refresh</span>
                <div className="w-10 h-6 bg-discord-dark rounded-full relative">
                  <div className="w-4 h-4 bg-discord-green rounded-full absolute top-1 right-1 transition-all duration-300"></div>
                </div>
              </div>
            </div>

            {botsLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 bg-discord-dark" />
                ))}
              </div>
            ) : bots && bots.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
              <div className="text-center py-8">
                <Bot className="w-12 h-12 mx-auto text-discord-text-muted mb-4" />
                <p className="text-discord-text-muted">No bots configured yet</p>
                <Button
                  onClick={() => setIsAddBotModalOpen(true)}
                  className="mt-4 bg-discord-blurple hover:bg-discord-blurple/80"
                >
                  Add Your First Bot
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-effect border-discord-dark animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-discord-text">Recent Activity</h3>
            <div className="space-y-3">
              {logsLoading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3">
                    <Skeleton className="w-2 h-2 rounded-full bg-discord-dark mt-2" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 bg-discord-dark w-3/4" />
                      <Skeleton className="h-3 bg-discord-dark w-1/2" />
                    </div>
                  </div>
                ))
              ) : activityLogs && activityLogs.length > 0 ? (
                activityLogs.slice(0, 5).map((log, index) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-discord-dark/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      log.type === "status_change" ? "bg-discord-green animate-pulse-slow" :
                      log.type === "error" ? "bg-discord-red" :
                      log.type === "message_sent" ? "bg-discord-yellow" :
                      "bg-discord-blurple"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-discord-text">{log.message}</p>
                      <p className="text-xs text-discord-text-muted">
                        {formatRelativeTime(new Date(log.createdAt!))}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-discord-text-muted">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <AddBotModal open={isAddBotModalOpen} onOpenChange={setIsAddBotModalOpen} />
    </div>
  );
}
