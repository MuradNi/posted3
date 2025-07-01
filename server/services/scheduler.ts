import { CronJob } from "cron";
import { storage } from "../storage";
import { discordBotManager } from "./discord-bot";
import type { AutoPosterConfig } from "@shared/schema";

class AutoPosterScheduler {
  private jobs: Map<number, CronJob> = new Map();

  async scheduleAutoPoster(config: AutoPosterConfig): Promise<void> {
    try {
      // Stop existing job if any
      this.unscheduleAutoPoster(config.id);

      if (!config.isActive) {
        return;
      }

      const job = new CronJob(
        config.interval,
        async () => {
          try {
            const success = await discordBotManager.sendMessage(
              config.botId!,
              config.channelId,
              config.message
            );

            if (success) {
              await storage.updateAutoPosterConfig(config.id, {
                lastSent: new Date(),
              });
            }
          } catch (error) {
            console.error(`Auto-poster job failed for config ${config.id}:`, error);
            
            await storage.createActivityLog({
              botId: config.botId!,
              type: "error",
              message: `Auto-poster failed: ${error.message}`,
              channelId: config.channelId,
              channelName: config.channelName || undefined,
            });
          }
        },
        null,
        true // Start immediately
      );

      this.jobs.set(config.id, job);
      console.log(`Scheduled auto-poster for config ${config.id}`);

      await storage.createActivityLog({
        botId: config.botId!,
        type: "status_change",
        message: `Auto-poster scheduled for #${config.channelName || config.channelId}`,
        channelId: config.channelId,
        channelName: config.channelName || undefined,
      });
    } catch (error) {
      console.error(`Failed to schedule auto-poster for config ${config.id}:`, error);
    }
  }

  unscheduleAutoPoster(configId: number): void {
    const job = this.jobs.get(configId);
    if (job) {
      job.stop();
      this.jobs.delete(configId);
      console.log(`Unscheduled auto-poster for config ${configId}`);
    }
  }

  async loadAllActiveConfigs(): Promise<void> {
    try {
      const configs = await storage.getAutoPosterConfigs();
      const activeConfigs = configs.filter(config => config.isActive);

      for (const config of activeConfigs) {
        await this.scheduleAutoPoster(config);
      }

      console.log(`Loaded ${activeConfigs.length} active auto-poster configurations`);
    } catch (error) {
      console.error("Failed to load auto-poster configurations:", error);
    }
  }

  getActiveJobsCount(): number {
    return this.jobs.size;
  }

  stopAllJobs(): void {
    this.jobs.forEach((job, configId) => {
      job.stop();
      console.log(`Stopped auto-poster job for config ${configId}`);
    });
    this.jobs.clear();
  }
}

export const scheduler = new AutoPosterScheduler();

// Load active configurations on startup
scheduler.loadAllActiveConfigs();
