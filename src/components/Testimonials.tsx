import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Carlos Eduardo Santos",
      role: "CEO",
      company: "Santos Distribuidora Ltda",
      content: "A STRIVE eliminou completamente nossas planilhas. Antes levávamos dias para fechar o mês, agora fazemos em horas. O Radar financeiro é revolucionário.",
      rating: 5,
      avatar: "CS"
    },
    {
      name: "Marina Oliveira",
      role: "Gestora Financeira",
      company: "Oliveira & Cia Comércio",
      content: "Incrível como a IA consegue categorizar nossos lançamentos automaticamente. Economizamos 75% do tempo que gastávamos organizando documentos e fazendo conciliações.",
      rating: 5,
      avatar: "MO"
    },
    {
      name: "Roberto Mendes",
      role: "Proprietário",
      company: "Mendes Autopeças",
      content: "O upload inteligente transformou nossa rotina. Arrasto os extratos e a STRIVE faz tudo sozinha. Agora tenho tempo para focar no crescimento da empresa.",
      rating: 5,
      avatar: "RM"
    }
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent mb-4">
            Depoimentos
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            O que nossos clientes{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              dizem sobre nós
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            PMEs de todo o Brasil já eliminaram suas planilhas com a STRIVE. 
            Veja os resultados impressionantes que nossos clientes alcançaram.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-custom-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-card-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-hero text-sm font-semibold text-primary-foreground">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Hover gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">1.200+</div>
            <div className="text-sm text-muted-foreground">PMEs Transformadas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">97%</div>
            <div className="text-sm text-muted-foreground">Precisão na Classificação</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">75%</div>
            <div className="text-sm text-muted-foreground">Redução de Tempo</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">15-30min</div>
            <div className="text-sm text-muted-foreground">Setup Inicial</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;