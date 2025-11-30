import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toasters } from "@/components/ui/toasters.tsx";
import { ThemeProvider } from "@/hooks/use-theme";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Games from "@/pages/Games";
import Tools from "@/pages/Tools";
import SingleGame from "@/pages/SingleGame";
import SingleTool from "@/pages/SingleTool";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/games" component={Games} />
      <Route path="/tools" component={Tools} />

      {/* Dynamic Routes for Games and Tools */}
      <Route path="/games/:id" component={SingleGame} />
      <Route path="/tools/:id" component={SingleTool} />

      {/* Legal Pages */}
      <Route path="/privacy-policy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/contact" component={Contact} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toasters />
        <Router />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
