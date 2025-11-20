import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import LibrePassage from "./pages/LibrePassage";
import About from "./pages/About";
import ClientSpace from "./pages/ClientSpace";
import Pricing from "./pages/Pricing";
import Talentis from "./pages/Talentis";
import Durabilis from "./pages/Durabilis";
import Synergis from "./pages/Synergis";
import Contact from "./pages/Contact";
import ProtectionJuridique from "./pages/ProtectionJuridique";
import Questionnaire from "./pages/Questionnaire";
import Signature from "./pages/Signature";
import Paiement from "./pages/Paiement";
import Merci from "./pages/Merci";
import Header from "./components/Header";
import Footer from "./components/Footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/libre-passage" component={LibrePassage} />
          <Route path="/protection-juridique" component={ProtectionJuridique} />
          <Route path="/tarifs" component={Pricing} />
          <Route path="/concepts/talentis" component={Talentis} />
          <Route path="/concepts/durabilis" component={Durabilis} />
          <Route path="/concepts/synergis" component={Synergis} />
          <Route path="/a-propos" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/espace-client" component={ClientSpace} />
          <Route path="/questionnaire-info" component={Questionnaire} />
          <Route path="/signature" component={Signature} />
          <Route path="/paiement" component={Paiement} />
          <Route path="/merci" component={Merci} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
