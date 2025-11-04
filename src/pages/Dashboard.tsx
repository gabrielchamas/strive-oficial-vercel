import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, CreditCard, AlertTriangle, TrendingUp, Upload, 
  CheckCircle2, Clock, AlertCircle, ArrowDown, ArrowUp, DollarSign 
} from "lucide-react";
import { getAllLancamentos, type Lancamento } from "@/lib/lancamentos-store";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, startOfQuarter, endOfQuarter } from "date-fns";
import { ptBR } from "date-fns/locale";

type Periodo = "mes_atual" | "mes_anterior" | "trimestre_atual" | "ano_atual" | "personalizado";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const Dashboard = () => {
  const [lancamentosData, setLancamentosData] = useState<Lancamento[]>(getAllLancamentos());
  const [periodo, setPeriodo] = useState<Periodo>("mes_atual");
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFim, setDataFim] = useState<Date | null>(null);

  // Atualiza os lançamentos quando a página é montada ou quando há mudanças
  useEffect(() => {
    const atualizarLancamentos = () => {
      setLancamentosData(getAllLancamentos());
    };
    
    atualizarLancamentos();
    
    // Listener para mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "strive_lancamentos") {
        atualizarLancamentos();
      }
    };
    
    // Listener para eventos customizados (mesma aba)
    const handleCustomStorage = () => {
      atualizarLancamentos();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("lancamentos-updated", handleCustomStorage);
    
    // Verificação periódica como fallback
    const interval = setInterval(atualizarLancamentos, 2000);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("lancamentos-updated", handleCustomStorage);
      clearInterval(interval);
    };
  }, []);

  // Calcula as datas do período selecionado
  const periodoDatas = useMemo(() => {
    const hoje = new Date();
    let inicio: Date;
    let fim: Date;

    switch (periodo) {
      case "mes_atual":
        inicio = startOfMonth(hoje);
        fim = endOfMonth(hoje);
        break;
      case "mes_anterior":
        const mesAnterior = subMonths(hoje, 1);
        inicio = startOfMonth(mesAnterior);
        fim = endOfMonth(mesAnterior);
        break;
      case "trimestre_atual":
        inicio = startOfQuarter(hoje);
        fim = endOfQuarter(hoje);
        break;
      case "ano_atual":
        inicio = startOfYear(hoje);
        fim = endOfYear(hoje);
        break;
      case "personalizado":
        if (dataInicio && dataFim) {
          inicio = dataInicio;
          fim = dataFim;
        } else {
          inicio = startOfMonth(hoje);
          fim = endOfMonth(hoje);
        }
        break;
      default:
        inicio = startOfMonth(hoje);
        fim = endOfMonth(hoje);
    }

    return { inicio, fim };
  }, [periodo, dataInicio, dataFim]);

  // Filtra lançamentos do período selecionado
  const lancamentosPeriodo = useMemo(() => {
    const { inicio, fim } = periodoDatas;
    
    return lancamentosData.filter((l) => {
      const [d, m, y] = l.vencimento.split("/").map(Number);
      if (!d || !m || !y) return false;
      
      const dataVencimento = new Date(y, m - 1, d);
      return dataVencimento >= inicio && dataVencimento <= fim;
    });
  }, [lancamentosData, periodoDatas]);

  // Calcula as estatísticas
  const estatisticas = useMemo(() => {
    const receitas = lancamentosPeriodo
      .filter(l => l.valor > 0)
      .reduce((sum, l) => sum + l.valor, 0);
    
    const despesas = lancamentosPeriodo
      .filter(l => l.valor < 0)
      .reduce((sum, l) => sum + Math.abs(l.valor), 0);
    
    const resultado = receitas - despesas;
    
    const emAberto = lancamentosPeriodo.filter(l => l.status === "em_aberto").length;
    const concluidos = lancamentosPeriodo.filter(l => l.status === "concluido").length;
    const totalLancamentos = lancamentosPeriodo.length;
    
    // Calcular comparação com período anterior
    const hoje = new Date();
    let periodoAnteriorInicio: Date;
    let periodoAnteriorFim: Date;
    
    switch (periodo) {
      case "mes_atual":
        periodoAnteriorInicio = startOfMonth(subMonths(hoje, 1));
        periodoAnteriorFim = endOfMonth(subMonths(hoje, 1));
        break;
      case "trimestre_atual":
        const trimestreAnterior = subMonths(hoje, 3);
        periodoAnteriorInicio = startOfQuarter(trimestreAnterior);
        periodoAnteriorFim = endOfQuarter(trimestreAnterior);
        break;
      default:
        periodoAnteriorInicio = startOfMonth(subMonths(hoje, 1));
        periodoAnteriorFim = endOfMonth(subMonths(hoje, 1));
    }
    
    const lancamentosAnterior = lancamentosData.filter((l) => {
      const [d, m, y] = l.vencimento.split("/").map(Number);
      if (!d || !m || !y) return false;
      const dataVencimento = new Date(y, m - 1, d);
      return dataVencimento >= periodoAnteriorInicio && dataVencimento <= periodoAnteriorFim;
    });
    
    const receitasAnterior = lancamentosAnterior
      .filter(l => l.valor > 0)
      .reduce((sum, l) => sum + l.valor, 0);
    
    const variacaoReceita = receitasAnterior > 0 
      ? ((receitas - receitasAnterior) / receitasAnterior) * 100 
      : 0;

    return {
      receitas,
      despesas,
      resultado,
      emAberto,
      concluidos,
      totalLancamentos,
      variacaoReceita,
    };
  }, [lancamentosPeriodo, lancamentosData, periodo]);

  // Formata o label do período
  const periodoLabel = useMemo(() => {
    const { inicio, fim } = periodoDatas;
    switch (periodo) {
      case "mes_atual":
        return format(inicio, "MMMM 'de' yyyy", { locale: ptBR });
      case "mes_anterior":
        return format(inicio, "MMMM 'de' yyyy", { locale: ptBR });
      case "trimestre_atual":
        return `${format(inicio, "MMM", { locale: ptBR })} - ${format(fim, "MMM 'de' yyyy", { locale: ptBR })}`;
      case "ano_atual":
        return `Ano ${format(inicio, "yyyy")}`;
      case "personalizado":
        return `${format(inicio, "dd/MM/yyyy")} - ${format(fim, "dd/MM/yyyy")}`;
      default:
        return format(inicio, "MMMM 'de' yyyy", { locale: ptBR });
    }
  }, [periodo, periodoDatas]);

  const stats = [
    {
      title: "Receita Total",
      value: formatCurrency(estatisticas.receitas),
      description: estatisticas.variacaoReceita >= 0
        ? `+${estatisticas.variacaoReceita.toFixed(1)}% em relação ao período anterior`
        : `${estatisticas.variacaoReceita.toFixed(1)}% em relação ao período anterior`,
      icon: CreditCard,
      trend: estatisticas.variacaoReceita >= 0 ? "up" : "down",
    },
    {
      title: "Despesas Total",
      value: formatCurrency(estatisticas.despesas),
      description: `${estatisticas.totalLancamentos} lançamentos no período`,
      icon: ArrowDown,
      trend: "neutral",
    },
    {
      title: "Resultado",
      value: formatCurrency(estatisticas.resultado),
      description: estatisticas.resultado >= 0 ? "Lucro" : "Prejuízo",
      icon: TrendingUp,
      trend: estatisticas.resultado >= 0 ? "up" : "down",
    },
    {
      title: "Em Aberto",
      value: estatisticas.emAberto.toString(),
      description: `${estatisticas.concluidos} concluídos`,
      icon: Clock,
      trend: "neutral",
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
            <p className="text-muted-foreground">
              Resumo dos seus lançamentos financeiros
            </p>
          </div>
          
          {/* Filtro de Período */}
          <div className="flex items-center gap-3">
            <Select value={periodo} onValueChange={(value) => setPeriodo(value as Periodo)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes_atual">Mês Atual</SelectItem>
                <SelectItem value="mes_anterior">Mês Anterior</SelectItem>
                <SelectItem value="trimestre_atual">Trimestre Atual</SelectItem>
                <SelectItem value="ano_atual">Ano Atual (2025)</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="px-3 py-1">
              {periodoLabel}
            </Badge>
          </div>
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
                  <Icon className={`h-4 w-4 ${
                    stat.title === "Receita Total" || stat.title === "Despesas Total" 
                      ? "text-foreground" 
                      : stat.trend === "up" ? "text-green-600" :
                        stat.trend === "down" ? "text-red-600" :
                        "text-muted-foreground"
                  }`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${
                    stat.title === "Receita Total" || stat.title === "Despesas Total" 
                      ? "text-foreground" 
                      : stat.trend === "up" ? "text-green-600" :
                        stat.trend === "down" ? "text-red-600" :
                        ""
                  }`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
          {/* Resumo de Lançamentos */}
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Resumo de Lançamentos</CardTitle>
              <CardDescription>
                Distribuição de lançamentos no período selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total de Lançamentos</span>
                    <span className="text-sm font-bold">{estatisticas.totalLancamentos}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${estatisticas.totalLancamentos > 0 ? 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Concluídos</span>
                      <span className="text-sm font-bold text-green-600">
                        {estatisticas.concluidos}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${estatisticas.totalLancamentos > 0 
                            ? (estatisticas.concluidos / estatisticas.totalLancamentos) * 100 
                            : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Em Aberto</span>
                      <span className="text-sm font-bold text-yellow-600">
                        {estatisticas.emAberto}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all"
                        style={{ 
                          width: `${estatisticas.totalLancamentos > 0 
                            ? (estatisticas.emAberto / estatisticas.totalLancamentos) * 100 
                            : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>

                {estatisticas.totalLancamentos === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Nenhum lançamento encontrado no período selecionado
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Visão Geral Financeira */}
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Visão Geral Financeira</CardTitle>
              <CardDescription>Receitas vs Despesas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Receitas</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {formatCurrency(estatisticas.receitas)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ 
                        width: `${(estatisticas.receitas + estatisticas.despesas) > 0 
                          ? (estatisticas.receitas / (estatisticas.receitas + estatisticas.despesas)) * 100 
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Despesas</span>
                    </div>
                    <span className="text-sm font-bold text-red-600">
                      {formatCurrency(estatisticas.despesas)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div 
                      className="bg-red-600 h-3 rounded-full transition-all"
                      style={{ 
                        width: `${(estatisticas.receitas + estatisticas.despesas) > 0 
                          ? (estatisticas.despesas / (estatisticas.receitas + estatisticas.despesas)) * 100 
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Resultado</span>
                    <span className={`text-lg font-bold ${
                      estatisticas.resultado >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {formatCurrency(estatisticas.resultado)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {estatisticas.resultado >= 0 ? "Lucro líquido" : "Prejuízo líquido"}
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