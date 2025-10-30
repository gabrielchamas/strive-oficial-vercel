import { Upload, Radar, RefreshCw, Brain, BarChart3, CreditCard } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Upload,
      title: "Upload Inteligente de Documentos",
      description: "Processe automaticamente CSV, XLSX e PDFs. Nossa IA detecta colunas, sugere categorias e mapeia contatos em segundos."
    },
    {
      icon: Radar,
      title: "Radar Financeiro",
      description: "Sua caixa de entrada inteligente centraliza extratos bancários, emails e documentos em um só lugar com sugestões automáticas."
    },
    {
      icon: RefreshCw,
      title: "Conciliação Automatizada",
      description: "Reconcilie lançamentos com transações bancárias automaticamente. Exceções são apresentadas para correção rápida."
    },
    {
      icon: Brain,
      title: "Lançamentos Inteligentes com IA",
      description: "Auto-preenchimento de categorias, tags e contatos. A IA aprende com suas correções e melhora continuamente."
    },
    {
      icon: BarChart3,
      title: "Relatórios e Indicadores",
      description: "Fluxo de caixa mensal, DRE simplificada e indicadores de performance. Exporte em PDF ou CSV quando necessário."
    },
    {
      icon: CreditCard,
      title: "Open Banking Integrado",
      description: "Conecte suas contas bancárias com segurança via Open Banking. Ingestão automática de extratos sem senhas."
    }
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-background-alt">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent mb-4">
            Funcionalidades Principais
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Transforme sua gestão financeira com{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              inteligência artificial
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra como nossa plataforma elimina planilhas e automatiza processos financeiros, 
            dando mais tempo para decisões estratégicas na sua empresa.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-custom-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero mb-6 group-hover:shadow-glow transition-all duration-300">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-card-foreground mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Pronto para eliminar as planilhas da sua empresa?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-hero px-8 py-4 text-base font-semibold text-primary-foreground shadow-custom-lg hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
              Começar Agora
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground px-8 py-4 text-base font-medium transition-all duration-300">
              Ver Demonstração
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;