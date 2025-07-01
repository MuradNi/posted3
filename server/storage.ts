import { 
  type DiscordBot, 
  type InsertDiscordBot,
  type AutoPosterConfig,
  type InsertAutoPosterConfig,
  type AutoResponderRule,
  type InsertAutoResponderRule,
  type ActivityLog,
  type InsertActivityLog,
  type MessageTemplate,
  type InsertMessageTemplate,
  type User,
  type InsertUser
} from "@shared/schema";
import fs from "fs";
import path from "path";

export interface IStorage {
  // User methods (legacy)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Discord Bot methods
  getBots(): Promise<DiscordBot[]>;
  getBot(id: number): Promise<DiscordBot | undefined>;
  createBot(bot: InsertDiscordBot): Promise<DiscordBot>;
  updateBot(id: number, updates: Partial<DiscordBot>): Promise<DiscordBot>;
  deleteBot(id: number): Promise<void>;

  // Auto Poster methods
  getAutoPosterConfigs(botId?: number): Promise<AutoPosterConfig[]>;
  createAutoPosterConfig(config: InsertAutoPosterConfig): Promise<AutoPosterConfig>;
  updateAutoPosterConfig(id: number, updates: Partial<AutoPosterConfig>): Promise<AutoPosterConfig>;
  deleteAutoPosterConfig(id: number): Promise<void>;

  // Auto Responder methods
  getAutoResponderRules(botId?: number): Promise<AutoResponderRule[]>;
  createAutoResponderRule(rule: InsertAutoResponderRule): Promise<AutoResponderRule>;
  updateAutoResponderRule(id: number, updates: Partial<AutoResponderRule>): Promise<AutoResponderRule>;
  deleteAutoResponderRule(id: number): Promise<void>;

  // Activity Log methods
  getActivityLogs(botId?: number, limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;

  // Message Template methods
  getMessageTemplates(): Promise<MessageTemplate[]>;
  createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate>;
  updateMessageTemplate(id: number, updates: Partial<MessageTemplate>): Promise<MessageTemplate>;
  deleteMessageTemplate(id: number): Promise<void>;
}

interface JsonDatabase {
  users: User[];
  discordBots: DiscordBot[];
  autoPosterConfigs: AutoPosterConfig[];
  autoResponderRules: AutoResponderRule[];
  activityLogs: ActivityLog[];
  messageTemplates: MessageTemplate[];
  nextIds: {
    users: number;
    discordBots: number;
    autoPosterConfigs: number;
    autoResponderRules: number;
    activityLogs: number;
    messageTemplates: number;
  };
}

export class JsonStorage implements IStorage {
  private dataFile = path.join(process.cwd(), "data.json");
  private data: JsonDatabase = {} as JsonDatabase;

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    if (fs.existsSync(this.dataFile)) {
      try {
        const fileContent = fs.readFileSync(this.dataFile, "utf-8");
        this.data = JSON.parse(fileContent);
      } catch (error) {
        console.error("Error loading data file:", error);
        this.initializeData();
      }
    } else {
      this.initializeData();
    }
  }

  private initializeData(): void {
    this.data = {
      users: [],
      discordBots: [],
      autoPosterConfigs: [],
      autoResponderRules: [],
      activityLogs: [],
      messageTemplates: [],
      nextIds: {
        users: 1,
        discordBots: 1,
        autoPosterConfigs: 1,
        autoResponderRules: 1,
        activityLogs: 1,
        messageTemplates: 1,
      },
    };
    this.saveData();
  }

  private saveData(): void {
    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error("Error saving data file:", error);
    }
  }

  // User methods (legacy)
  async getUser(id: number): Promise<User | undefined> {
    return this.data.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.data.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.data.nextIds.users++,
    };
    this.data.users.push(user);
    this.saveData();
    return user;
  }

  // Discord Bot methods
  async getBots(): Promise<DiscordBot[]> {
    return [...this.data.discordBots].sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getBot(id: number): Promise<DiscordBot | undefined> {
    return this.data.discordBots.find(bot => bot.id === id);
  }

  async createBot(insertBot: InsertDiscordBot): Promise<DiscordBot> {
    const bot: DiscordBot = {
      ...insertBot,
      id: this.data.nextIds.discordBots++,
      status: "offline",
      serverName: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSeen: null,
      messagesSent: 0,
      channelsConnected: 0,
    };
    this.data.discordBots.push(bot);
    this.saveData();
    return bot;
  }

  async updateBot(id: number, updates: Partial<DiscordBot>): Promise<DiscordBot> {
    const botIndex = this.data.discordBots.findIndex(bot => bot.id === id);
    if (botIndex === -1) {
      throw new Error("Bot not found");
    }
    
    this.data.discordBots[botIndex] = {
      ...this.data.discordBots[botIndex],
      ...updates,
      updatedAt: new Date(),
    };
    this.saveData();
    return this.data.discordBots[botIndex];
  }

  async deleteBot(id: number): Promise<void> {
    this.data.discordBots = this.data.discordBots.filter(bot => bot.id !== id);
    // Also delete related configs
    this.data.autoPosterConfigs = this.data.autoPosterConfigs.filter(config => config.botId !== id);
    this.data.autoResponderRules = this.data.autoResponderRules.filter(rule => rule.botId !== id);
    this.data.activityLogs = this.data.activityLogs.filter(log => log.botId !== id);
    this.saveData();
  }

  // Auto Poster methods
  async getAutoPosterConfigs(botId?: number): Promise<AutoPosterConfig[]> {
    if (botId) {
      return this.data.autoPosterConfigs.filter(config => config.botId === botId);
    }
    return [...this.data.autoPosterConfigs];
  }

  async createAutoPosterConfig(insertConfig: InsertAutoPosterConfig): Promise<AutoPosterConfig> {
    const config: AutoPosterConfig = {
      ...insertConfig,
      id: this.data.nextIds.autoPosterConfigs++,
      botId: insertConfig.botId || null,
      channelName: insertConfig.channelName || null,
      isActive: insertConfig.isActive || false,
      createdAt: new Date(),
      lastSent: null,
    };
    this.data.autoPosterConfigs.push(config);
    this.saveData();
    return config;
  }

  async updateAutoPosterConfig(id: number, updates: Partial<AutoPosterConfig>): Promise<AutoPosterConfig> {
    const configIndex = this.data.autoPosterConfigs.findIndex(config => config.id === id);
    if (configIndex === -1) {
      throw new Error("Config not found");
    }
    
    this.data.autoPosterConfigs[configIndex] = {
      ...this.data.autoPosterConfigs[configIndex],
      ...updates,
    };
    this.saveData();
    return this.data.autoPosterConfigs[configIndex];
  }

  async deleteAutoPosterConfig(id: number): Promise<void> {
    this.data.autoPosterConfigs = this.data.autoPosterConfigs.filter(config => config.id !== id);
    this.saveData();
  }

  // Auto Responder methods
  async getAutoResponderRules(botId?: number): Promise<AutoResponderRule[]> {
    if (botId) {
      return this.data.autoResponderRules.filter(rule => rule.botId === botId);
    }
    return [...this.data.autoResponderRules];
  }

  async createAutoResponderRule(insertRule: InsertAutoResponderRule): Promise<AutoResponderRule> {
    const rule: AutoResponderRule = {
      ...insertRule,
      id: this.data.nextIds.autoResponderRules++,
      botId: insertRule.botId || null,
      isActive: insertRule.isActive || false,
      matchType: insertRule.matchType || null,
      createdAt: new Date(),
    };
    this.data.autoResponderRules.push(rule);
    this.saveData();
    return rule;
  }

  async updateAutoResponderRule(id: number, updates: Partial<AutoResponderRule>): Promise<AutoResponderRule> {
    const ruleIndex = this.data.autoResponderRules.findIndex(rule => rule.id === id);
    if (ruleIndex === -1) {
      throw new Error("Rule not found");
    }
    
    this.data.autoResponderRules[ruleIndex] = {
      ...this.data.autoResponderRules[ruleIndex],
      ...updates,
    };
    this.saveData();
    return this.data.autoResponderRules[ruleIndex];
  }

  async deleteAutoResponderRule(id: number): Promise<void> {
    this.data.autoResponderRules = this.data.autoResponderRules.filter(rule => rule.id !== id);
    this.saveData();
  }

  // Activity Log methods
  async getActivityLogs(botId?: number, limit = 50): Promise<ActivityLog[]> {
    let logs = [...this.data.activityLogs];
    
    if (botId) {
      logs = logs.filter(log => log.botId === botId);
    }
    
    return logs
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, limit);
  }

  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const log: ActivityLog = {
      ...insertLog,
      id: this.data.nextIds.activityLogs++,
      botId: insertLog.botId || null,
      channelId: insertLog.channelId || null,
      channelName: insertLog.channelName || null,
      metadata: insertLog.metadata || null,
      createdAt: new Date(),
    };
    this.data.activityLogs.push(log);
    this.saveData();
    return log;
  }

  // Message Template methods
  async getMessageTemplates(): Promise<MessageTemplate[]> {
    return [...this.data.messageTemplates].sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createMessageTemplate(insertTemplate: InsertMessageTemplate): Promise<MessageTemplate> {
    const template: MessageTemplate = {
      ...insertTemplate,
      id: this.data.nextIds.messageTemplates++,
      category: insertTemplate.category || null,
      createdAt: new Date(),
    };
    this.data.messageTemplates.push(template);
    this.saveData();
    return template;
  }

  async updateMessageTemplate(id: number, updates: Partial<MessageTemplate>): Promise<MessageTemplate> {
    const templateIndex = this.data.messageTemplates.findIndex(template => template.id === id);
    if (templateIndex === -1) {
      throw new Error("Template not found");
    }
    
    this.data.messageTemplates[templateIndex] = {
      ...this.data.messageTemplates[templateIndex],
      ...updates,
    };
    this.saveData();
    return this.data.messageTemplates[templateIndex];
  }

  async deleteMessageTemplate(id: number): Promise<void> {
    this.data.messageTemplates = this.data.messageTemplates.filter(template => template.id !== id);
    this.saveData();
  }
}

export const storage = new JsonStorage();