import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "97",
      description: "Perfeito para micro e pequenas empresas",
      features: [
        "Até 200 lançamentos por mês",
        "Upload inteligente de documentos",
        "Radar financeiro básico",
        "Relatórios essenciais",
        "Suporte por email",
        "1 usuário",
        "Integração com 2 bancos"
      ],
      limitations: [
        "Sem Open Banking automático",
        "Sem previsões avançadas"
      ],
      cta: "Começar com Starter",
      popular: false
    },
    {
      name: "Pro",
      price: "297",
      description: "Ideal para PMEs que querem eliminar planilhas",
      features: [
        "Lançamentos ilimitados",
        "Upload inteligente completo (CSV/XLSX/PDF)",
        "Radar financeiro com IA avançada",
        "Conciliação bancária automatizada",
        "Open Banking integrado",
        "Relatórios e DRE completos",
        "Previsões de fluxo de caixa",
        "Suporte prioritário",
        "Até 5 usuários",
        "API para integrações"
      ],
      limitations: [],
      cta: "Experimentar Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Personalizado",
      description: "Solução completa para empresas maiores",
      features: [
        "Tudo do Pro incluído",
        "Multi-CNPJ ilimitado",
        "IA personalizada para seu negócio",
        "Integrações customizadas (ERP/Contabilidade)",
        "Copiloto multicanal (WhatsApp/Email/Slack)",
        "Suporte dedicado 24/7",
        "Usuários ilimitados",
        "SLA garantido 99.9%",
        "Consultoria estratégica mensal",
        "Onboarding assistido"
      ],
      limitations: [],
      cta: "Falar com Vendas",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-background-alt">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent mb-4">
            Planos e Preços
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Escolha o plano ideal{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              para sua empresa
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transforme sua gestão financeira com planos flexíveis. 
            Teste por 15 dias grátis, sem compromisso.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-card border rounded-2xl p-8 ${
                plan.popular 
                  ? 'border-primary shadow-custom-xl scale-105' 
                  : 'border-border hover:shadow-custom-lg'
              } transition-all duration-300`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center gap-1 rounded-full bg-gradient-hero px-4 py-2 text-sm font-semibold text-primary-foreground shadow-custom-md">
                    <Star className="h-4 w-4" />
                    Mais Popular
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-card-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  {plan.price === "Personalizado" ? (
                    <div className="text-3xl font-bold text-primary">
                      {plan.price}
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-sm text-muted-foreground">R$</span>
                      <span className="text-4xl font-bold text-primary">{plan.price}</span>
                      {plan.price !== "0" && (
                        <span className="text-sm text-muted-foreground">/mês</span>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-card-foreground">{feature}</span>
                  </div>
                ))}
                
                {plan.limitations.map((limitation, limitationIndex) => (
                  <div key={limitationIndex} className="flex items-start gap-3 opacity-60">
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground line-through">{limitation}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button 
                variant={plan.popular ? "default" : "outline"} 
                size="lg" 
                className="w-full"
              >
                {plan.popular && <Zap className="h-4 w-4" />}
                {plan.cta}
              </Button>

              {/* Background gradient for popular plan */}
              {plan.popular && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            15 dias de teste grátis • Sem taxas de setup • Cancele a qualquer momento
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;