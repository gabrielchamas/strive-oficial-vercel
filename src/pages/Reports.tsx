import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, FileText, Calendar, TrendingUp, TrendingDown, DollarSign, AlertTriangle } from "lucide-react";

const Reports = () => {
  const availableReports = [
    {
      title: "DRE - Demonstração do Resultado",
      description: "Receitas, despesas e resultado do período",
      period: "Janeiro 2024",
      status: "ready",
      lastGenerated: "15/01/2024 09:30"
    },
    {
      title: "Relatório de VAT/ICMS",
      description: "Impostos sobre vendas e serviços",
      period: "Janeiro 2024",
      status: "ready",
      lastGenerated: "15/01/2024 08:45"
    },
    {
      title: "Fluxo de Caixa",
      description: "Entradas e saídas detalhadas",
      period: "Janeiro 2024",
      status: "processing",
      lastGenerated: "Processando..."
    },
    {
      title: "Balancete de Verificação",
      description: "Saldos de todas as contas contábeis",
      period: "Janeiro 2024",
      status: "ready",
      lastGenerated: "14/01/2024 16:20"
    },
    {
      title: "Relatório ISS",
      description: "Imposto sobre serviços prestados",
      period: "Janeiro 2024",
      status: "pending",
      lastGenerated: "Aguardando dados"
    }
  ];

  const kpis = [
    {
      title: "Receita Total",
      value: "R$ 145.670,00",
      change: "+12,5%",
      trend: "up",
      period: "vs mês anterior"
    },
    {
      title: "Despesas Totais",
      value: "R$ 89.320,00",
      change: "+5,2%",
      trend: "up",
      period: "vs mês anterior"
    },
    {
      title: "Resultado Líquido",
      value: "R$ 56.350,00",
      change: "+28,3%",
      trend: "up",
      period: "vs mês anterior"
    },
    {
      title: "Margem Líquida",
      value: "38,7%",
      change: "+3,1%",
      trend: "up",
      period: "vs mês anterior"
    }
  ];

  const upcomingTaxes = [
    {
      tax: "ICMS - Janeiro/2024",
      dueDate: "20/02/2024",
      amount: "R$ 12.450,00",
      status: "pending",
      daysLeft: 5
    },
    {
      tax: "ISS - Janeiro/2024",
      dueDate: "15/02/2024",
      amount: "R$ 3.780,00",
      status: "overdue",
      daysLeft: -1
    },
    {
      tax: "COFINS - Janeiro/2024",
      dueDate: "25/02/2024",
      amount: "R$ 8.920,00",
      status: "pending",
      daysLeft: 10
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-success/10 text-success border-success/20">Pronto</Badge>;
      case "processing":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Processando</Badge>;
      case "pending":
        return <Badge className="bg-muted text-muted-foreground">Pendente</Badge>;
      default:
        return null;
    }
  };

  const getTaxStatusBadge = (status: string, daysLeft: number) => {
    if (status === "overdue") {
      return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Vencido</Badge>;
    }
    if (daysLeft <= 5) {
      return <Badge className="bg-warning/10 text-warning border-warning/20">Urgente</Badge>;
    }
    return <Badge className="bg-muted text-muted-foreground">Pendente</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">Dashboards e relatórios fiscais automatizados</p>
          </div>
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Período: Janeiro 2024
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{kpi.value}</p>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-medium ${
                    kpi.trend === "up" ? "text-success" : "text-destructive"
                  }`}>
                    {kpi.change}
                  </span>
                  <span className="text-xs text-muted-foreground">{kpi.period}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Available Reports */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Relatórios Disponíveis</CardTitle>
              <CardDescription>Relatórios gerados automaticamente pela IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableReports.map((report, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{report.title}</h4>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {report.period} • {report.lastGenerated}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {getStatusBadge(report.status)}
                      
                      <div className="flex items-center gap-2">
                        {report.status === "ready" && (
                          <>
                            <Button variant="ghost" size="icon">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {report.status === "processing" && (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Gerar Período Customizado
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Baixar Todos (ZIP)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Taxes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Impostos a Pagar
              </CardTitle>
              <CardDescription>Próximos vencimentos fiscais</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTaxes.map((tax, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-border bg-background-alt"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{tax.tax}</h4>
                        <p className="text-xs text-muted-foreground">Venc: {tax.dueDate}</p>
                      </div>
                      {getTaxStatusBadge(tax.status, tax.daysLeft)}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">{tax.amount}</span>
                      <Button variant="ghost" size="sm">
                        Pagar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4">
                Ver Calendário Fiscal Completo
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Evolução Financeira</CardTitle>
            <CardDescription>Receitas, despesas e resultado dos últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-background-alt rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  Gráficos Interativos em Desenvolvimento
                </p>
                <p className="text-sm text-muted-foreground max-w-md">
                  Em breve você terá dashboards avançados com visualizações em tempo real 
                  dos seus dados financeiros e contábeis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;