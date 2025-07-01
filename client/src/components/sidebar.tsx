import { Bot, LayoutDashboard, PlayCircle, Settings, Calendar, MessageCircle, Users, BarChart3, FileText, LogOut, User, Bell } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Control Center", href: "/control-center", icon: PlayCircle },
  { name: "Bot Configuration", href: "/bot-config", icon: Settings },
  { name: "Auto Poster", href: "/auto-poster", icon: Calendar },
  { name: "Auto Responder", href: "/auto-responder", icon: MessageCircle },
  { name: "Multi-Account", href: "/multi-account", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Templates", href: "/templates", icon: FileText },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar className="border-r border-discord-dark bg-discord-darker">
      <SidebarHeader className="p-4 border-b border-discord-dark">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-discord-blurple rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-discord-text">Bot Manager</h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "w-full justify-start px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-discord-blurple text-white"
                      : "text-discord-text-muted hover:bg-discord-dark hover:text-discord-text"
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-discord-dark">
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=32&h=32" />
            <AvatarFallback className="bg-discord-blurple text-white">JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-discord-text">John Developer</p>
            <p className="text-xs text-discord-text-muted truncate">john@example.com</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 rounded hover:bg-discord-dark transition-colors text-discord-text-muted hover:text-discord-text"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
