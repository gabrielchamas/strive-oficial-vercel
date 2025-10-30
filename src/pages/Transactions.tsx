import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Search, Filter, CheckCircle2, Clock, Link, ArrowDownLeft, ArrowUpRight } from "lucide-react";

const Transactions = () => {
  const transactions = [
    {
      id: 1,
      date: "15/01/2024",
      description: "RECEBIMENTO PIX - CLIENTE ABC LTDA",
      value: 2500.00,
      type: "credit",
      account: "Conta Corrente - Banco do Brasil",
      aiMatch: {
        document: "NF 12345 - Cliente ABC",
        confidence: 98,
        status: "matched"
      }
    },
    {
      id: 2,
      date: "14/01/2024",
      description: "PAGAMENTO BOLETO - ENERGIA ELETRICA",
      value: -485.67,
      type: "debit",
      account: "Conta Corrente - Banco do Brasil",
      aiMatch: {
        document: "Fatura Energia Elétrica Jan/24",
        confidence: 96,
        status: "matched"
      }
    },
    {
      id: 3,
      date: "13/01/2024",
      description: "TRANSFERENCIA DOC - FORNECEDOR XYZ",
      value: -1200.00,
      type: "debit",
      account: "Conta Corrente - Banco do Brasil",
      aiMatch: {
        document: "Sugestão: Pagamento Fornecedor XYZ",
        confidence: 85,
        status: "suggested"
      }
    },
    {
      id: 4,
      date: "12/01/2024",
      description: "PIX RECEBIDO - CLIENTE DEF SA",
      value: 3750.50,
      type: "credit",
      account: "Conta Corrente - Banco do Brasil",
      aiMatch: {
        document: "Pendente de classificação",
        confidence: 0,
        status: "pending"
      }
    },
    {
      id: 5,
      date: "11/01/2024",
      description: "PAGAMENTO ALUGUEL - JANEIRO/2024",
      value: -2800.00,
      type: "debit",
      account: "Conta Corrente - Banco do Brasil",
      aiMatch: {
        document: "Recibo Aluguel Janeiro",
        confidence: 94,
        status: "matched"
      }
    }
  ];

  const getMatchStatusBadge = (status: string, confidence: number) => {
    switch (status) {
      case "matched":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Conciliado ({confidence}%)
          </Badge>
        );
      case "suggested":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <Clock className="h-3 w-3 mr-1" />
            Sugerido ({confidence}%)
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-muted text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transações</h1>
            <p className="text-muted-foreground">Reconciliação bancária inteligente com IA</p>
          </div>
          <Button className="gap-2">
            <Link className="h-4 w-4" />
            Sincronizar Bancos
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conciliadas</p>
                  <p className="text-2xl font-bold text-success">89</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-warning">12</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Entradas</p>
                  <p className="text-2xl font-bold text-success">R$ 45.670</p>
                </div>
                <ArrowDownLeft className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Saídas</p>
                  <p className="text-2xl font-bold text-destructive">R$ 32.120</p>
                </div>
                <ArrowUpRight className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Extrato Bancário</CardTitle>
                <CardDescription>Transações com sugestões de conciliação da IA</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar transações..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>

            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'credit' 
                        ? 'bg-success/10' 
                        : 'bg-destructive/10'
                    }`}>
                      {transaction.type === 'credit' ? (
                        <ArrowDownLeft className="h-5 w-5 text-success" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{transaction.description}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{transaction.date}</span>
                        <span>•</span>
                        <span>{transaction.account}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`font-semibold ${
                        transaction.type === 'credit' ? 'text-success' : 'text-destructive'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.value)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {transaction.aiMatch.document}
                      </div>
                    </div>

                    {getMatchStatusBadge(transaction.aiMatch.status, transaction.aiMatch.confidence)}

                    <div className="flex items-center gap-2">
                      {transaction.aiMatch.status === "suggested" && (
                        <>
                          <Button variant="ghost" size="sm" className="text-success hover:text-success">
                            Aceitar
                          </Button>
                          <Button variant="ghost" size="sm">
                            Revisar
                          </Button>
                        </>
                      )}
                      {transaction.aiMatch.status === "pending" && (
                        <Button variant="outline" size="sm">
                          Classificar
                        </Button>
                      )}
                      {transaction.aiMatch.status === "matched" && (
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Mostrando 5 de 101 transações
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Anterior
                </Button>
                <Button variant="outline" size="sm">
                  Próximo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;