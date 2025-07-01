import { 
  discordBots, 
  autoPosterConfigs, 
  autoResponderRules, 
  activityLogs, 
  messageTemplates,
  users,
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
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // User methods (legacy)
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Discord Bot methods
  async getBots(): Promise<DiscordBot[]> {
    return await db.select().from(discordBots).orderBy(desc(discordBots.createdAt));
  }

  async getBot(id: number): Promise<DiscordBot | undefined> {
    const [bot] = await db.select().from(discordBots).where(eq(discordBots.id, id));
    return bot || undefined;
  }

  async createBot(bot: InsertDiscordBot): Promise<DiscordBot> {
    const [newBot] = await db
      .insert(discordBots)
      .values(bot)
      .returning();
    return newBot;
  }

  async updateBot(id: number, updates: Partial<DiscordBot>): Promise<DiscordBot> {
    const [updatedBot] = await db
      .update(discordBots)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(discordBots.id, id))
      .returning();
    return updatedBot;
  }

  async deleteBot(id: number): Promise<void> {
    await db.delete(discordBots).where(eq(discordBots.id, id));
  }

  // Auto Poster methods
  async getAutoPosterConfigs(botId?: number): Promise<AutoPosterConfig[]> {
    if (botId) {
      return await db.select().from(autoPosterConfigs).where(eq(autoPosterConfigs.botId, botId));
    }
    return await db.select().from(autoPosterConfigs);
  }

  async createAutoPosterConfig(config: InsertAutoPosterConfig): Promise<AutoPosterConfig> {
    const [newConfig] = await db
      .insert(autoPosterConfigs)
      .values(config)
      .returning();
    return newConfig;
  }

  async updateAutoPosterConfig(id: number, updates: Partial<AutoPosterConfig>): Promise<AutoPosterConfig> {
    const [updatedConfig] = await db
      .update(autoPosterConfigs)
      .set(updates)
      .where(eq(autoPosterConfigs.id, id))
      .returning();
    return updatedConfig;
  }

  async deleteAutoPosterConfig(id: number): Promise<void> {
    await db.delete(autoPosterConfigs).where(eq(autoPosterConfigs.id, id));
  }

  // Auto Responder methods
  async getAutoResponderRules(botId?: number): Promise<AutoResponderRule[]> {
    if (botId) {
      return await db.select().from(autoResponderRules).where(eq(autoResponderRules.botId, botId));
    }
    return await db.select().from(autoResponderRules);
  }

  async createAutoResponderRule(rule: InsertAutoResponderRule): Promise<AutoResponderRule> {
    const [newRule] = await db
      .insert(autoResponderRules)
      .values(rule)
      .returning();
    return newRule;
  }

  async updateAutoResponderRule(id: number, updates: Partial<AutoResponderRule>): Promise<AutoResponderRule> {
    const [updatedRule] = await db
      .update(autoResponderRules)
      .set(updates)
      .where(eq(autoResponderRules.id, id))
      .returning();
    return updatedRule;
  }

  async deleteAutoResponderRule(id: number): Promise<void> {
    await db.delete(autoResponderRules).where(eq(autoResponderRules.id, id));
  }

  // Activity Log methods
  async getActivityLogs(botId?: number, limit = 50): Promise<ActivityLog[]> {
    let query = db.select().from(activityLogs);
    
    if (botId) {
      query = query.where(eq(activityLogs.botId, botId));
    }
    
    return await query.orderBy(desc(activityLogs.createdAt)).limit(limit);
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [newLog] = await db
      .insert(activityLogs)
      .values(log)
      .returning();
    return newLog;
  }

  // Message Template methods
  async getMessageTemplates(): Promise<MessageTemplate[]> {
    return await db.select().from(messageTemplates).orderBy(desc(messageTemplates.createdAt));
  }

  async createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate> {
    const [newTemplate] = await db
      .insert(messageTemplates)
      .values(template)
      .returning();
    return newTemplate;
  }

  async updateMessageTemplate(id: number, updates: Partial<MessageTemplate>): Promise<MessageTemplate> {
    const [updatedTemplate] = await db
      .update(messageTemplates)
      .set(updates)
      .where(eq(messageTemplates.id, id))
      .returning();
    return updatedTemplate;
  }

  async deleteMessageTemplate(id: number): Promise<void> {
    await db.delete(messageTemplates).where(eq(messageTemplates.id, id));
  }
}

export const storage = new DatabaseStorage();
