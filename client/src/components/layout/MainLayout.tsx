import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Gamepad2, Wrench, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";

export function AdPlaceholder({ className, label = "Ad Space" }: { className?: string, label?: string }) {
  return (
    <div className={`bg-muted/50 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center text-muted-foreground text-sm font-medium min-h-[100px] ${className}`}>
      {label}
    </div>
  );
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">Play & Tools</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/games" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Gamepad2 className="h-4 w-4" /> Games
            </Link>
            <Link href="/tools" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Wrench className="h-4 w-4" /> Tools
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-b bg-background p-4 space-y-2">
          <Link href="/games" onClick={() => setIsMenuOpen(false)}>
            <div className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
              <Gamepad2 className="h-5 w-5" />
              <span className="font-medium">Games</span>
            </div>
          </Link>
          <Link href="/tools" onClick={() => setIsMenuOpen(false)}>
            <div className="flex items-center gap-2 p-2 hover:bg-muted rounded-md">
              <Wrench className="h-5 w-5" />
              <span className="font-medium">Tools</span>
            </div>
          </Link>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Play & Tools</h3>
            <p className="text-sm text-muted-foreground">
              Your one-stop destination for fun mini-games and useful developer tools. Free forever.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Games</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/games/2048">2048</Link></li>
              <li><Link href="/games/snake">Snake</Link></li>
              <li><Link href="/games/flappy-bird">Flappy Bird</Link></li>
              <li><Link href="/games">View All Games</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tools/json-formatter">JSON Formatter</Link></li>
              <li><Link href="/tools/word-counter">Word Counter</Link></li>
              <li><Link href="/tools/age-calculator">Age Calculator</Link></li>
              <li><Link href="/tools">View All Tools</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          © 2025 Play & Tools. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
