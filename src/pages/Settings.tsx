import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, User, CreditCard, Settings as SettingsIcon, Link, Shield, Bell, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const integrations = [
    {
      name: "Google Drive",
      description: "Sincronize documentos automaticamente",
      status: "connected",
      icon: "🗃️"
    },
    {
      name: "Dropbox",
      description: "Backup de documentos na nuvem",
      status: "disconnected",
      icon: "📦"
    },
    {
      name: "Banco do Brasil",
      description: "Importação automática de extratos",
      status: "connected",
      icon: "🏦"
    },
    {
      name: "Itaú",
      description: "Sincronização de transações",
      status: "pending",
      icon: "🏦"
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "Gratuito",
      description: "Ideal para começar",
      features: ["50 documentos/mês", "Classificação básica", "Relatórios simples"],
      current: true
    },
    {
      name: "Pro",
      price: "R$ 297/mês",
      description: "Para escritórios em crescimento",
      features: ["1.000 documentos/mês", "IA avançada", "Reconciliação bancária", "Suporte prioritário"],
      current: false
    },
    {
      name: "Enterprise",
      price: "Personalizado",
      description: "Solução completa",
      features: ["Documentos ilimitados", "IA personalizada", "Suporte dedicado", "Integrações customizadas"],
      current: false
    }
  ];

  const getIntegrationStatus = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-success/10 text-success border-success/20">Conectado</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pendente</Badge>;
      case "disconnected":
        return <Badge className="bg-muted text-muted-foreground">Desconectado</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Gerencie sua conta, empresa e integrações</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Company Profile */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Perfil da Empresa
              </CardTitle>
              <CardDescription>Informações da sua empresa para relatórios fiscais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Razão Social</Label>
                  <Input id="companyName" defaultValue="Silva Contabilidade Ltda" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tradingName">Nome Fantasia</Label>
                  <Input id="tradingName" defaultValue="Silva Contabilidade" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ie">Inscrição Estadual</Label>
                  <Input id="ie" defaultValue="123.456.789.012" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" defaultValue="Rua das Flores, 123 - Centro - São Paulo/SP" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRegime">Regime Tributário</Label>
                  <Input id="taxRegime" defaultValue="Simples Nacional" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountant">Contador Responsável</Label>
                  <Input id="accountant" defaultValue="João Silva - CRC 123456" />
                </div>
              </div>

              <Button variant="outline">
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>

          {/* User Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Perfil do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-xl font-semibold text-primary-foreground mx-auto mb-4">
                  JS
                </div>
                <h3 className="font-semibold text-foreground">João Silva</h3>
                <p className="text-sm text-muted-foreground">joao@silvacontabilidade.com.br</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="userName">Nome</Label>
                <Input id="userName" defaultValue="João Silva" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userEmail">E-mail</Label>
                <Input id="userEmail" defaultValue="joao@silvacontabilidade.com.br" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userPhone">Telefone</Label>
                <Input id="userPhone" defaultValue="(11) 99999-9999" />
              </div>

              <Button variant="outline" className="w-full">
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Integrações
            </CardTitle>
            <CardDescription>Conecte suas ferramentas favoritas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{integration.icon}</div>
                    <div>
                      <h4 className="font-medium text-foreground">{integration.name}</h4>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getIntegrationStatus(integration.status)}
                    <Button 
                      variant={integration.status === "connected" ? "outline" : "outline"} 
                      size="sm"
                    >
                      {integration.status === "connected" ? "Desconectar" : "Conectar"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>Configure como você quer ser notificado</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Documentos Processados</h4>
                <p className="text-sm text-muted-foreground">Notificar quando documentos forem classificados</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Reconciliação Bancária</h4>
                <p className="text-sm text-muted-foreground">Alertas sobre transações não conciliadas</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Vencimentos Fiscais</h4>
                <p className="text-sm text-muted-foreground">Lembrar sobre impostos próximos do vencimento</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">Relatórios Prontos</h4>
                <p className="text-sm text-muted-foreground">Notificar quando relatórios estiverem disponíveis</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Plano de Assinatura
            </CardTitle>
            <CardDescription>Gerencie sua assinatura e planos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    plan.current 
                      ? "border-primary bg-primary/5" 
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    {plan.current && (
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        Atual
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-lg font-bold text-foreground mb-1">{plan.price}</p>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  
                  <ul className="space-y-1 mb-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.current ? "outline" : "outline"} 
                    size="sm" 
                    className="w-full"
                    disabled={plan.current}
                  >
                    {plan.current ? "Plano Atual" : "Upgrade"}
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-accent/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-accent" />
                <div>
                  <h4 className="font-medium text-foreground">Uso do Plano Free</h4>
                  <p className="text-sm text-muted-foreground">
                    Você usou 12 de 50 documentos este mês. Upgrade para processar mais documentos.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;