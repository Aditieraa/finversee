import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FinQuest from "@/pages/finquest";
import NotFound from "@/pages/not-found";
import Pricing from "@/pages/pricing";
import Store from "@/pages/store";
import Courses from "@/pages/courses";
import SubscriptionDashboard from "@/pages/subscription-dashboard";
import BusinessDashboard from "@/pages/business-dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={FinQuest} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/store" component={Store} />
      <Route path="/courses" component={Courses} />
      <Route path="/subscription" component={SubscriptionDashboard} />
      <Route path="/business" component={BusinessDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
