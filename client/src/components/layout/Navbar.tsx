import { Home, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary text-white p-1.5 rounded-lg">
            <Home className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-primary tracking-tight">NestQuest</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Buy</a>
          <a href="#" className="text-primary font-semibold">Rent</a>
          <a href="#" className="hover:text-primary transition-colors">Resources</a>
          <a href="#" className="hover:text-primary transition-colors">About Us</a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden md:flex text-muted-foreground">
            List a Property
          </Button>
          <Button variant="outline" size="sm" className="rounded-full px-4 gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
