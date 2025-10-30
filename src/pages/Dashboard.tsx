import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard, AlertTriangle, TrendingUp, Upload, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Receita Total",
      value: "R$ 45.231,89",
      description: "+20,1% em relação ao mês anterior",
      icon: CreditCard,
    },
    {
      title: "Documentos",
      value: "127",
      description: "+12% em relação ao mês anterior",
      icon: FileText,
    },
    {
      title: "Processando",
      value: "89",
      description: "+8% em relação ao mês anterior",
      icon: Clock,
    },
    {
      title: "Ativos Agora",
      value: "32",
      description: "+15% em relação à última hora",
      icon: TrendingUp,
    }
  ];

  const recentDocuments = [
    { name: "Nota Fiscal 001.pdf", category: "Receita", status: "Processado", time: "2h atrás" },
    { name: "Recibo Aluguel.pdf", category: "Despesa", status: "Pendente", time: "4h atrás" },
    { name: "Fatura Energia.pdf", category: "Despesa", status: "Processado", time: "1 dia" },
    { name: "NF Serviços.pdf", category: "Receita", status: "Processado", time: "2 dias" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
          <p className="text-muted-foreground">
            Aqui está um resumo das suas atividades contábeis
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Documents */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Documentos Recentes</CardTitle>
              <CardDescription>
                Últimos documentos processados pela IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {recentDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-9 h-9 relative flex shrink-0 overflow-hidden rounded-full">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                        <FileText className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {doc.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {doc.category} • {doc.time}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {doc.status === "Processado" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overview */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Visão Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Gráficos serão exibidos aqui
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;