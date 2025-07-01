import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";
import Dashboard from "@/pages/dashboard";
import ControlCenter from "@/pages/control-center";
import BotConfig from "@/pages/bot-config";
import AutoPoster from "@/pages/auto-poster";
import AutoResponder from "@/pages/auto-responder";
import MultiAccount from "@/pages/multi-account";
import Analytics from "@/pages/analytics";
import Templates from "@/pages/templates";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/control-center" component={ControlCenter} />
          <Route path="/bot-config" component={BotConfig} />
          <Route path="/auto-poster" component={AutoPoster} />
          <Route path="/auto-responder" component={AutoResponder} />
          <Route path="/multi-account" component={MultiAccount} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/templates" component={Templates} />
          <Route component={NotFound} />
        </Switch>
      </SidebarInset>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-discord-darkest text-discord-text">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
