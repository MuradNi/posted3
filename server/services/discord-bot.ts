import { Client, GatewayIntentBits, Message } from "discord.js";
import { storage } from "../storage";
import type { DiscordBot, AutoResponderRule } from "@shared/schema";

interface BotInstance {
  client: Client;
  bot: DiscordBot;
}

class DiscordBotManager {
  private bots: Map<number, BotInstance> = new Map();

  async startBot(bot: DiscordBot): Promise<boolean> {
    try {
      // Stop existing instance if running
      await this.stopBot(bot.id);

      const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ],
      });

      // Set up event handlers
      client.once("ready", async () => {
        console.log(`Bot ${bot.name} is ready!`);
        
        // Update bot status and server info
        const guild = client.guilds.cache.get(bot.serverId);
        if (guild) {
          await storage.updateBot(bot.id, {
            status: "online",
            serverName: guild.name,
            channelsConnected: guild.channels.cache.size,
            lastSeen: new Date(),
          });

          await storage.createActivityLog({
            botId: bot.id,
            type: "status_change",
            message: `Connected to server "${guild.name}"`,
          });
        }
      });

      client.on("messageCreate", async (message: Message) => {
        if (message.author.bot) return;

        // Handle auto-responder rules
        await this.handleAutoResponder(bot.id, message);
        
        // Log message activity
        await storage.createActivityLog({
          botId: bot.id,
          type: "message_sent",
          message: `Received message in #${message.channel.name || message.channelId}`,
          channelId: message.channelId,
          channelName: message.channel.name || undefined,
        });
      });

      client.on("error", async (error) => {
        console.error(`Bot ${bot.name} error:`, error);
        
        await storage.updateBot(bot.id, { status: "offline" });
        await storage.createActivityLog({
          botId: bot.id,
          type: "error",
          message: `Discord client error: ${error.message}`,
        });
      });

      // Login to Discord
      await client.login(bot.token);
      
      this.bots.set(bot.id, { client, bot });
      return true;
    } catch (error) {
      console.error(`Failed to start bot ${bot.name}:`, error);
      
      await storage.createActivityLog({
        botId: bot.id,
        type: "error",
        message: `Failed to start: ${error.message}`,
      });
      
      return false;
    }
  }

  async stopBot(botId: number): Promise<void> {
    const instance = this.bots.get(botId);
    if (instance) {
      try {
        await instance.client.destroy();
        this.bots.delete(botId);
        
        await storage.updateBot(botId, { status: "offline" });
        console.log(`Bot ${instance.bot.name} stopped`);
      } catch (error) {
        console.error(`Error stopping bot ${botId}:`, error);
      }
    }
  }

  async sendMessage(botId: number, channelId: string, message: string): Promise<boolean> {
    const instance = this.bots.get(botId);
    if (!instance) {
      return false;
    }

    try {
      const channel = await instance.client.channels.fetch(channelId);
      if (channel?.isTextBased()) {
        await channel.send(message);
        
        // Update message count
        const currentBot = await storage.getBot(botId);
        if (currentBot) {
          await storage.updateBot(botId, {
            messagesSent: (currentBot.messagesSent || 0) + 1,
            lastSeen: new Date(),
          });
        }

        await storage.createActivityLog({
          botId,
          type: "message_sent",
          message: `Auto-posted message to #${channel.name || channelId}`,
          channelId,
          channelName: channel.name || undefined,
        });

        return true;
      }
    } catch (error) {
      console.error(`Failed to send message for bot ${botId}:`, error);
      
      await storage.createActivityLog({
        botId,
        type: "error",
        message: `Failed to send message: ${error.message}`,
        channelId,
      });
    }

    return false;
  }

  private async handleAutoResponder(botId: number, message: Message): Promise<void> {
    try {
      const rules = await storage.getAutoResponderRules(botId);
      const activeRules = rules.filter(rule => rule.isActive);

      for (const rule of activeRules) {
        let shouldRespond = false;

        switch (rule.matchType) {
          case "exact":
            shouldRespond = message.content.toLowerCase() === rule.trigger.toLowerCase();
            break;
          case "contains":
            shouldRespond = message.content.toLowerCase().includes(rule.trigger.toLowerCase());
            break;
          case "regex":
            try {
              const regex = new RegExp(rule.trigger, "i");
              shouldRespond = regex.test(message.content);
            } catch (error) {
              console.error("Invalid regex pattern:", rule.trigger);
            }
            break;
        }

        if (shouldRespond) {
          await message.reply(rule.response);
          
          await storage.createActivityLog({
            botId,
            type: "response_triggered",
            message: `Auto-responded to trigger "${rule.trigger}" in #${message.channel.name || message.channelId}`,
            channelId: message.channelId,
            channelName: message.channel.name || undefined,
            metadata: { ruleId: rule.id, trigger: rule.trigger },
          });

          break; // Only respond to the first matching rule
        }
      }
    } catch (error) {
      console.error("Error handling auto-responder:", error);
    }
  }

  getBotStatus(botId: number): string {
    const instance = this.bots.get(botId);
    return instance ? "online" : "offline";
  }

  getAllBotStatuses(): Record<number, string> {
    const statuses: Record<number, string> = {};
    this.bots.forEach((instance, botId) => {
      statuses[botId] = "online";
    });
    return statuses;
  }
}

export const discordBotManager = new DiscordBotManager();
