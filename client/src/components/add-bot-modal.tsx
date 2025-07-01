import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertDiscordBotSchema, type InsertDiscordBot } from "@shared/schema";

interface AddBotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBotModal({ open, onOpenChange }: AddBotModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertDiscordBot>({
    resolver: zodResolver(insertDiscordBotSchema),
    defaultValues: {
      name: "",
      token: "",
      serverId: "",
      serverName: "",
      status: "offline",
    },
  });

  const createBotMutation = useMutation({
    mutationFn: async (data: InsertDiscordBot) => {
      const response = await apiRequest("POST", "/api/bots", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bot created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create bot",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertDiscordBot) => {
    createBotMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-effect border-discord-dark">
        <DialogHeader>
          <DialogTitle className="text-discord-text">Add New Bot</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-discord-text">Bot Name</Label>
            <Input
              id="name"
              placeholder="Enter bot name"
              className="bg-discord-dark border-discord-dark focus:border-discord-blurple"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-discord-red">{form.formState.errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="token" className="text-discord-text">Bot Token</Label>
            <Input
              id="token"
              type="password"
              placeholder="Enter Discord bot token"
              className="bg-discord-dark border-discord-dark focus:border-discord-blurple"
              {...form.register("token")}
            />
            <p className="text-xs text-discord-text-muted">
              Get your token from Discord Developer Portal
            </p>
            {form.formState.errors.token && (
              <p className="text-xs text-discord-red">{form.formState.errors.token.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serverId" className="text-discord-text">Server ID</Label>
            <Input
              id="serverId"
              placeholder="Enter Discord server ID"
              className="bg-discord-dark border-discord-dark focus:border-discord-blurple"
              {...form.register("serverId")}
            />
            {form.formState.errors.serverId && (
              <p className="text-xs text-discord-red">{form.formState.errors.serverId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="serverName" className="text-discord-text">Server Name (Optional)</Label>
            <Input
              id="serverName"
              placeholder="Enter server name"
              className="bg-discord-dark border-discord-dark focus:border-discord-blurple"
              {...form.register("serverName")}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-discord-dark hover:bg-discord-dark"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-discord-blurple hover:bg-discord-blurple/80"
              disabled={createBotMutation.isPending}
            >
              {createBotMutation.isPending ? "Creating..." : "Create Bot"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
