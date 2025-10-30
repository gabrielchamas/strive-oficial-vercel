import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="flex flex-col space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent self-start">
              <CheckCircle className="h-4 w-4" />
              Gestão financeira inteligente para PMEs
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Elimine as{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  planilhas
                </span>{" "}
                do seu financeiro
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                A STRIVE centraliza, automatiza e inteligência no controle financeiro da sua empresa. Transforme dados em decisões estratégicas.
              </p>
            </div>

            {/* Features list */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-success" />
                Upload inteligente de extratos e documentos
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-success" />
                Radar financeiro - sua caixa de entrada inteligente
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-success" />
                Conciliação bancária automatizada com IA
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group" asChild>
                <a href="/register">
                  Experimentar Grátis
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Play className="h-5 w-5" />
                Agendar Demonstração
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-xs font-medium text-primary-foreground">A</div>
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-accent-foreground">B</div>
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground">C</div>
                </div>
                <span>+1.200 PMEs transformadas</span>
              </div>
            </div>
          </div>

          {/* Right column - Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-custom-xl">
              <img 
                src={heroImage} 
                alt="Dashboard da STRIVE mostrando gestão financeira inteligente para PMEs" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-xl p-4 shadow-custom-lg max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">Economia de 75%</p>
                  <p className="text-xs text-muted-foreground">no tempo de processamento financeiro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;