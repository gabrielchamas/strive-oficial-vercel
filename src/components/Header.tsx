import { Button } from "@/components/ui/button";
import { Menu, X, Brain } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-hero">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">STRIVE</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            Funcionalidades
          </a>
          <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            Depoimentos
          </a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            Preços
          </a>
          <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
            Contato
          </a>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <a href="/login">Entrar</a>
            </Button>
            <Button size="sm" asChild>
              <a href="/register">Experimentar Grátis</a>
            </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Funcionalidades
            </a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Depoimentos
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Preços
            </a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Contato
            </a>
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Button variant="ghost" size="sm" asChild>
                <a href="/login">Entrar</a>
              </Button>
              <Button size="sm" asChild>
                <a href="/register">Experimentar Grátis</a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;