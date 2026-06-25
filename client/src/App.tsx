import { useEffect, useState, type MouseEvent } from 'react';
import Lenis from 'lenis';
import TargetCursor from './components/TargetCursor';
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Portfolio from "@/pages/portfolio";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";

import Projects from '@/pages/projects';

function Router({
  onToggleTheme,
  currentTheme,
}: {
  onToggleTheme: (event?: MouseEvent<HTMLButtonElement>) => void;
  currentTheme: string;
}) {
  return (
    <Switch>
      <Route path="/">
        <Portfolio onToggleTheme={onToggleTheme} currentTheme={currentTheme} />
      </Route>
      <Route path="/projects">
        <Projects onToggleTheme={onToggleTheme} currentTheme={currentTheme} />
      </Route>
      {/* Admin routes */}
      <Route path="/admin">
        <AdminLogin />
      </Route>
      <Route path="/admin/dashboard">
        <AdminDashboard />
      </Route>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.035, // Adjusted for even smoother momentum
      wheelMultiplier: 1.5,
      smoothWheel: true,
      syncTouch: false, // Disabled to allow accurate native scrolling on mobile
    });

    let animationFrameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = window.requestAnimationFrame(raf);
    };

    animationFrameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  const toggleTheme = (event?: MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    if (!document.startViewTransition || !event) {
      setTheme(nextTheme);
      return;
    }

    const { clientX, clientY } = event;
    const endRadius = Math.hypot(
      Math.max(clientX, window.innerWidth - clientX),
      Math.max(clientY, window.innerHeight - clientY),
    );

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${clientX}px ${clientY}px)`,
            `circle(${endRadius}px at ${clientX}px ${clientY}px)`,
          ],
        },
        {
          duration: 650,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ConditionalCursor />
        <Router onToggleTheme={toggleTheme} currentTheme={theme} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function ConditionalCursor() {
  const [location] = useLocation();
  if (location.startsWith('/admin')) return null;
  return (
    <TargetCursor
      targetSelector=".cta-button, .outline-button, .btn-primary, .tech-tab, .carousel-control:not(:disabled), .social-icon, .nav-link, .mobile-nav-link, .logomark-link, .theme-toggle"
      spinDuration={2}
      hideDefaultCursor={true}
      parallaxOn={true}
    />
  );
}

export default App;
