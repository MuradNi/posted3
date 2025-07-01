import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const discordBots = pgTable("discord_bots", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  token: text("token").notNull(),
  serverId: text("server_id").notNull(),
  serverName: text("server_name"),
  status: text("status").notNull().default("offline"), // online, offline, pending
  lastSeen: timestamp("last_seen"),
  messagesSent: integer("messages_sent").default(0),
  channelsConnected: integer("channels_connected").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const autoPosterConfigs = pgTable("auto_poster_configs", {
  id: serial("id").primaryKey(),
  botId: integer("bot_id").references(() => discordBots.id, { onDelete: "cascade" }),
  channelId: text("channel_id").notNull(),
  channelName: text("channel_name"),
  message: text("message").notNull(),
  interval: text("interval").notNull(), // cron expression
  isActive: boolean("is_active").default(true),
  lastSent: timestamp("last_sent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const autoResponderRules = pgTable("auto_responder_rules", {
  id: serial("id").primaryKey(),
  botId: integer("bot_id").references(() => discordBots.id, { onDelete: "cascade" }),
  trigger: text("trigger").notNull(),
  response: text("response").notNull(),
  isActive: boolean("is_active").default(true),
  matchType: text("match_type").default("exact"), // exact, contains, regex
  createdAt: timestamp("created_at").defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  botId: integer("bot_id").references(() => discordBots.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // message_sent, response_triggered, status_change, error
  message: text("message").notNull(),
  channelId: text("channel_id"),
  channelName: text("channel_name"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messageTemplates = pgTable("message_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull(),
  category: text("category").default("general"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const discordBotsRelations = relations(discordBots, ({ many }) => ({
  autoPosterConfigs: many(autoPosterConfigs),
  autoResponderRules: many(autoResponderRules),
  activityLogs: many(activityLogs),
}));

export const autoPosterConfigsRelations = relations(autoPosterConfigs, ({ one }) => ({
  bot: one(discordBots, {
    fields: [autoPosterConfigs.botId],
    references: [discordBots.id],
  }),
}));

export const autoResponderRulesRelations = relations(autoResponderRules, ({ one }) => ({
  bot: one(discordBots, {
    fields: [autoResponderRules.botId],
    references: [discordBots.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  bot: one(discordBots, {
    fields: [activityLogs.botId],
    references: [discordBots.id],
  }),
}));

// Insert schemas
export const insertDiscordBotSchema = createInsertSchema(discordBots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastSeen: true,
  messagesSent: true,
  channelsConnected: true,
});

export const insertAutoPosterConfigSchema = createInsertSchema(autoPosterConfigs).omit({
  id: true,
  createdAt: true,
  lastSent: true,
});

export const insertAutoResponderRuleSchema = createInsertSchema(autoResponderRules).omit({
  id: true,
  createdAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

export const insertMessageTemplateSchema = createInsertSchema(messageTemplates).omit({
  id: true,
  createdAt: true,
});

// Types
export type DiscordBot = typeof discordBots.$inferSelect;
export type InsertDiscordBot = z.infer<typeof insertDiscordBotSchema>;
export type AutoPosterConfig = typeof autoPosterConfigs.$inferSelect;
export type InsertAutoPosterConfig = z.infer<typeof insertAutoPosterConfigSchema>;
export type AutoResponderRule = typeof autoResponderRules.$inferSelect;
export type InsertAutoResponderRule = z.infer<typeof insertAutoResponderRuleSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type MessageTemplate = typeof messageTemplates.$inferSelect;
export type InsertMessageTemplate = z.infer<typeof insertMessageTemplateSchema>;

// Legacy user schema for compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
