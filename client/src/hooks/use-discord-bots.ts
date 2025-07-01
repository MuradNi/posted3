import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { DiscordBot } from "@shared/schema";

export function useDiscordBots() {
  return useQuery<DiscordBot[]>({
    queryKey: ["/api/bots"],
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });
}

export function useDiscordBot(id: number) {
  return useQuery<DiscordBot>({
    queryKey: ["/api/bots", id],
    enabled: !!id,
  });
}

export function useBotActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startBot = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/bots/${id}/start`);
      return response.json();
    },
    onSuccess: (_, id) => {
      toast({
        title: "Success",
        description: "Bot started successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bots", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to start bot",
        variant: "destructive",
      });
    },
  });

  const stopBot = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/bots/${id}/stop`);
      return response.json();
    },
    onSuccess: (_, id) => {
      toast({
        title: "Success",
        description: "Bot stopped successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bots", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to stop bot",
        variant: "destructive",
      });
    },
  });

  const deleteBot = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/bots/${id}`);
      return response.json();
    },
    onSuccess: (_, id) => {
      toast({
        title: "Success",
        description: "Bot deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete bot",
        variant: "destructive",
      });
    },
  });

  return {
    startBot,
    stopBot,
    deleteBot,
  };
}

export function useDashboardStats() {
  return useQuery<{
    totalBots: number;
    activeBots: number;
    messagesSent: number;
    serversConnected: number;
  }>({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 5000,
  });
}

export function useActivityLogs(botId?: number) {
  return useQuery({
    queryKey: ["/api/activity-logs", { botId }],
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}
