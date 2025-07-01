import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDiscordBotSchema, insertAutoPosterConfigSchema, insertAutoResponderRuleSchema, insertMessageTemplateSchema } from "@shared/schema";
import { discordBotManager } from "./services/discord-bot";
import { scheduler } from "./services/scheduler";

export async function registerRoutes(app: Express): Promise<Server> {
  // Bot Management Routes
  app.get("/api/bots", async (req, res) => {
    try {
      const bots = await storage.getBots();
      res.json(bots);
    } catch (error) {
      console.error("Error fetching bots:", error);
      res.status(500).json({ error: "Failed to fetch bots" });
    }
  });

  app.get("/api/bots/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bot = await storage.getBot(id);
      if (!bot) {
        return res.status(404).json({ error: "Bot not found" });
      }
      res.json(bot);
    } catch (error) {
      console.error("Error fetching bot:", error);
      res.status(500).json({ error: "Failed to fetch bot" });
    }
  });

  app.post("/api/bots", async (req, res) => {
    try {
      const botData = insertDiscordBotSchema.parse(req.body);
      const bot = await storage.createBot(botData);
      
      // Log bot creation
      await storage.createActivityLog({
        botId: bot.id,
        type: "status_change",
        message: `Bot "${bot.name}" created`,
      });

      res.status(201).json(bot);
    } catch (error) {
      console.error("Error creating bot:", error);
      res.status(400).json({ error: "Failed to create bot" });
    }
  });

  app.post("/api/bots/:id/start", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bot = await storage.getBot(id);
      
      if (!bot) {
        return res.status(404).json({ error: "Bot not found" });
      }

      // Start the Discord bot
      const success = await discordBotManager.startBot(bot);
      
      if (success) {
        await storage.updateBot(id, { 
          status: "online", 
          lastSeen: new Date() 
        });
        
        await storage.createActivityLog({
          botId: id,
          type: "status_change",
          message: `Bot "${bot.name}" started successfully`,
        });

        res.json({ message: "Bot started successfully" });
      } else {
        await storage.updateBot(id, { status: "offline" });
        
        await storage.createActivityLog({
          botId: id,
          type: "error",
          message: `Failed to start bot "${bot.name}"`,
        });

        res.status(500).json({ error: "Failed to start bot" });
      }
    } catch (error) {
      console.error("Error starting bot:", error);
      res.status(500).json({ error: "Failed to start bot" });
    }
  });

  app.post("/api/bots/:id/stop", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bot = await storage.getBot(id);
      
      if (!bot) {
        return res.status(404).json({ error: "Bot not found" });
      }

      // Stop the Discord bot
      await discordBotManager.stopBot(id);
      await storage.updateBot(id, { status: "offline" });
      
      await storage.createActivityLog({
        botId: id,
        type: "status_change",
        message: `Bot "${bot.name}" stopped`,
      });

      res.json({ message: "Bot stopped successfully" });
    } catch (error) {
      console.error("Error stopping bot:", error);
      res.status(500).json({ error: "Failed to stop bot" });
    }
  });

  app.delete("/api/bots/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const bot = await storage.getBot(id);
      
      if (!bot) {
        return res.status(404).json({ error: "Bot not found" });
      }

      // Stop bot if running
      await discordBotManager.stopBot(id);
      
      // Delete bot
      await storage.deleteBot(id);
      
      res.json({ message: "Bot deleted successfully" });
    } catch (error) {
      console.error("Error deleting bot:", error);
      res.status(500).json({ error: "Failed to delete bot" });
    }
  });

  // Auto Poster Routes
  app.get("/api/auto-poster", async (req, res) => {
    try {
      const botId = req.query.botId ? parseInt(req.query.botId as string) : undefined;
      const configs = await storage.getAutoPosterConfigs(botId);
      res.json(configs);
    } catch (error) {
      console.error("Error fetching auto-poster configs:", error);
      res.status(500).json({ error: "Failed to fetch auto-poster configs" });
    }
  });

  app.post("/api/auto-poster", async (req, res) => {
    try {
      const configData = insertAutoPosterConfigSchema.parse(req.body);
      const config = await storage.createAutoPosterConfig(configData);
      
      // Schedule the auto-poster
      await scheduler.scheduleAutoPoster(config);
      
      res.status(201).json(config);
    } catch (error) {
      console.error("Error creating auto-poster config:", error);
      res.status(400).json({ error: "Failed to create auto-poster config" });
    }
  });

  // Auto Responder Routes
  app.get("/api/auto-responder", async (req, res) => {
    try {
      const botId = req.query.botId ? parseInt(req.query.botId as string) : undefined;
      const rules = await storage.getAutoResponderRules(botId);
      res.json(rules);
    } catch (error) {
      console.error("Error fetching auto-responder rules:", error);
      res.status(500).json({ error: "Failed to fetch auto-responder rules" });
    }
  });

  app.post("/api/auto-responder", async (req, res) => {
    try {
      const ruleData = insertAutoResponderRuleSchema.parse(req.body);
      const rule = await storage.createAutoResponderRule(ruleData);
      res.status(201).json(rule);
    } catch (error) {
      console.error("Error creating auto-responder rule:", error);
      res.status(400).json({ error: "Failed to create auto-responder rule" });
    }
  });

  // Activity Logs Routes
  app.get("/api/activity-logs", async (req, res) => {
    try {
      const botId = req.query.botId ? parseInt(req.query.botId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getActivityLogs(botId, limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ error: "Failed to fetch activity logs" });
    }
  });

  // Message Templates Routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getMessageTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const templateData = insertMessageTemplateSchema.parse(req.body);
      const template = await storage.createMessageTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(400).json({ error: "Failed to create template" });
    }
  });

  // Dashboard Stats Route
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const bots = await storage.getBots();
      const activeBots = bots.filter(bot => bot.status === "online");
      const totalMessages = bots.reduce((sum, bot) => sum + (bot.messagesSent || 0), 0);
      const totalChannels = bots.reduce((sum, bot) => sum + (bot.channelsConnected || 0), 0);
      
      res.json({
        totalBots: bots.length,
        activeBots: activeBots.length,
        messagesSent: totalMessages,
        serversConnected: totalChannels,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
