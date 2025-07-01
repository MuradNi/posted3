import { Play, Square, Edit, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getStatusBadgeColor, formatRelativeTime } from "@/lib/utils";
import type { DiscordBot } from "@shared/schema";

interface BotStatusCardProps {
  bot: DiscordBot;
  onStart: () => void;
  onStop: () => void;
  onEdit: () => void;
  isLoading?: boolean;
}

export function BotStatusCard({ bot, onStart, onStop, onEdit, isLoading }: BotStatusCardProps) {
  const isOnline = bot.status === "online";
  const statusClass = `bot-status-${bot.status}`;

  return (
    <div className={cn(
      "relative p-4 rounded-lg border border-discord-dark transition-all group",
      "hover:border-discord-green/50",
      bot.status === "offline" && "hover:border-discord-red/50",
      bot.status === "pending" && "hover:border-discord-yellow/50"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={`https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1614741118887-7a4ee193a5fa' : '1605379399642-870262d3d051'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40`} />
            <AvatarFallback className="bg-discord-blurple text-white">
              {bot.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className={cn("font-medium relative pl-3", statusClass)}>
              {bot.name}
            </h4>
            <p className="text-sm text-discord-text-muted">
              {bot.serverName || "Unknown Server"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={cn("text-xs font-medium", getStatusBadgeColor(bot.status))}>
            {bot.status.charAt(0).toUpperCase() + bot.status.slice(1)}
          </Badge>
          <div className="flex space-x-1">
            {isOnline ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onStop}
                disabled={isLoading}
                className="p-1 rounded hover:bg-discord-dark transition-colors"
              >
                <Square className="w-4 h-4 text-discord-red" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={onStart}
                disabled={isLoading}
                className="p-1 rounded hover:bg-discord-dark transition-colors"
              >
                <Play className="w-4 h-4 text-discord-green" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="p-1 rounded hover:bg-discord-dark transition-colors"
            >
              <Edit className="w-4 h-4 text-discord-text-muted" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-lg font-semibold">{bot.messagesSent || 0}</p>
          <p className="text-xs text-discord-text-muted">Messages</p>
        </div>
        <div>
          <p className="text-lg font-semibold">{bot.channelsConnected || 0}</p>
          <p className="text-xs text-discord-text-muted">Channels</p>
        </div>
        <div>
          {bot.status === "online" && bot.lastSeen ? (
            <>
              <p className="text-lg font-semibold text-discord-green flex items-center justify-center">
                <Clock className="w-3 h-3 mr-1" />
                Online
              </p>
              <p className="text-xs text-discord-text-muted">
                {formatRelativeTime(new Date(bot.lastSeen))}
              </p>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold text-discord-red">Offline</p>
              <p className="text-xs text-discord-text-muted">Uptime</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
