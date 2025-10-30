import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  RefreshCw, Plus, Search, MoreHorizontal, AlertTriangle, 
  Edit, Copy, Archive, ExternalLink, Filter, X, ChevronLeft, ChevronRight,
  ArrowUpDown, ArrowUp, ArrowDown, User, Calendar, DollarSign, Tag, FileText, File
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { CreateLancamentoDialog } from "@/components/CreateLancamentoDialog";
import { FilterLancamentosDialog, FilterState } from "@/components/FilterLancamentosDialog";
import { getCategoryLabel } from "@/types/categories";
import { mockLancamentos as lancamentosGerados } from "./lancamentos-data";

type LancamentoType = "entrada" | "saida" | "recorrente" | "parcelado";
type StatusType = "em_aberto" | "concluido";

interface Lancamento {
  id: string;
  tipo: LancamentoType;
  descricao: string;
  vencimento: string;
  valor: number;
  status: StatusType;
  categoria: string;
  contato: string;
  parcela?: string;
  atrasado?: boolean;
}

export const mockLancamentos: Lancamento[] = lancamentosGerados;

/*
// Dados antigos - substituídos por gerador em lancamentos-data.ts
export const mockLancamentos: Lancamento[] = [
  // Entradas operacionais (MRR de clientes SaaS)
  { id: "oct-001", tipo: "entrada", descricao: "MRR - Cliente Alpha (Plano Pro)", vencimento: "02/10/2025", valor: 1490.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Alpha" },
  { id: "oct-002", tipo: "entrada", descricao: "MRR - Cliente Beta (Plano Business)", vencimento: "03/10/2025", valor: 2990.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Beta" },
  { id: "oct-003", tipo: "entrada", descricao: "MRR - Cliente Gamma (Plano Starter)", vencimento: "03/10/2025", valor: 490.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Gamma" },
  { id: "oct-004", tipo: "entrada", descricao: "MRR - Cliente Delta (Plano Pro)", vencimento: "04/10/2025", valor: 1490.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Delta" },
  { id: "oct-005", tipo: "entrada", descricao: "MRR - Cliente Epsilon (Plano Business)", vencimento: "04/10/2025", valor: 2990.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Epsilon" },
  { id: "oct-006", tipo: "entrada", descricao: "Onboarding - Cliente Zeta (setup)", vencimento: "05/10/2025", valor: 1200.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Zeta" },
  { id: "oct-007", tipo: "entrada", descricao: "MRR - Cliente Theta (Plano Pro)", vencimento: "06/10/2025", valor: 1490.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Theta" },
  { id: "oct-008", tipo: "entrada", descricao: "MRR - Cliente Iota (Plano Starter)", vencimento: "06/10/2025", valor: 490.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Iota" },
  { id: "oct-009", tipo: "entrada", descricao: "Upgrade de plano - Cliente Gamma (diferença)", vencimento: "09/10/2025", valor: 300.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Gamma" },
  { id: "oct-010", tipo: "entrada", descricao: "MRR - Cliente Kappa (Plano Business)", vencimento: "10/10/2025", valor: 2990.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Kappa" },
  { id: "oct-011", tipo: "entrada", descricao: "MRR - Cliente Lambda (Plano Pro)", vencimento: "12/10/2025", valor: 1490.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Lambda" },
  { id: "oct-012", tipo: "entrada", descricao: "MRR - Cliente Mu (Plano Starter)", vencimento: "13/10/2025", valor: 490.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Mu" },
  { id: "oct-013", tipo: "entrada", descricao: "Serviço adicional - Treinamento (2h)", vencimento: "17/10/2025", valor: 600.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Beta" },
  { id: "oct-014", tipo: "entrada", descricao: "MRR - Cliente Nu (Plano Pro)", vencimento: "20/10/2025", valor: 1490.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Nu" },
  { id: "oct-015", tipo: "entrada", descricao: "MRR - Cliente Xi (Plano Business)", vencimento: "22/10/2025", valor: 2990.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Xi" },
  { id: "oct-016", tipo: "entrada", descricao: "MRR - Cliente Omicron (Plano Starter)", vencimento: "24/10/2025", valor: 490.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Omicron" },
  { id: "oct-017", tipo: "entrada", descricao: "Reativação - Cliente Alpha (pró-rata)", vencimento: "27/10/2025", valor: 350.00, status: "concluido", categoria: "venda_servicos", contato: "Cliente Alpha" },

  // Deduções diretas de vendas (taxas e descontos)
  { id: "oct-101", tipo: "saida", descricao: "Taxas do gateway (2,49% + R$0,39)", vencimento: "05/10/2025", valor: -420.75, status: "concluido", categoria: "taxas_sobre_vendas", contato: "Gateway Pagamentos" },
  { id: "oct-102", tipo: "saida", descricao: "Descontos promocionais concedidos", vencimento: "08/10/2025", valor: -300.00, status: "concluido", categoria: "descontos_comerciais", contato: "Campanha Outubro" },
  { id: "oct-103", tipo: "saida", descricao: "Chargeback (1 transação)", vencimento: "15/10/2025", valor: -299.00, status: "concluido", categoria: "taxas_sobre_vendas", contato: "Adquirente" },

  // Custo dos serviços (infra e terceiros)
  { id: "oct-201", tipo: "saida", descricao: "AWS - EC2/RDS/S3 (setembro/competência)", vencimento: "07/10/2025", valor: -2350.40, status: "concluido", categoria: "custo_servicos_prestados", contato: "AWS" },
  { id: "oct-202", tipo: "saida", descricao: "Cloudflare - CDN e WAF", vencimento: "08/10/2025", valor: -210.00, status: "concluido", categoria: "custo_servicos_prestados", contato: "Cloudflare" },
  { id: "oct-203", tipo: "saida", descricao: "SendGrid - E-mails transacionais", vencimento: "09/10/2025", valor: -140.00, status: "concluido", categoria: "custo_servicos_prestados", contato: "SendGrid" },

  // Despesas administrativas
  { id: "oct-301", tipo: "recorrente", descricao: "Google Workspace", vencimento: "01/10/2025", valor: -120.00, status: "concluido", categoria: "software_ferramentas", contato: "Google" },
  { id: "oct-302", tipo: "recorrente", descricao: "Figma", vencimento: "01/10/2025", valor: -75.00, status: "concluido", categoria: "software_ferramentas", contato: "Figma" },
  { id: "oct-303", tipo: "recorrente", descricao: "GitHub", vencimento: "02/10/2025", valor: -45.00, status: "concluido", categoria: "software_ferramentas", contato: "GitHub" },
  { id: "oct-304", tipo: "saida", descricao: "Contabilidade - Honorários", vencimento: "10/10/2025", valor: -650.00, status: "concluido", categoria: "servicos_contabilidade", contato: "Escritório Contábil" },
  { id: "oct-305", tipo: "saida", descricao: "Internet escritório", vencimento: "11/10/2025", valor: -199.90, status: "concluido", categoria: "telefonia_internet", contato: "Operadora" },
  { id: "oct-306", tipo: "saida", descricao: "Energia elétrica escritório", vencimento: "18/10/2025", valor: -480.30, status: "concluido", categoria: "energia_eletrica", contato: "Concessionária" },

  // Pessoal
  { id: "oct-401", tipo: "saida", descricao: "Folha - Salários (time produto)", vencimento: "05/10/2025", valor: -28000.00, status: "concluido", categoria: "salarios_ordenados", contato: "Equipe" },
  { id: "oct-402", tipo: "saida", descricao: "Pró-labore sócios", vencimento: "05/10/2025", valor: -8000.00, status: "concluido", categoria: "pro_labore", contato: "Diretoria" },
  { id: "oct-403", tipo: "saida", descricao: "Encargos trabalhistas (GPS/FGTS)", vencimento: "07/10/2025", valor: -7800.00, status: "concluido", categoria: "encargos_trabalhistas", contato: "Gov" },

  // Vendas e marketing
  { id: "oct-501", tipo: "saida", descricao: "Meta Ads", vencimento: "09/10/2025", valor: -3500.00, status: "concluido", categoria: "marketing_publicidade", contato: "Meta" },
  { id: "oct-502", tipo: "saida", descricao: "Google Ads", vencimento: "16/10/2025", valor: -4200.00, status: "concluido", categoria: "publicidade_anuncios", contato: "Google" },
  { id: "oct-503", tipo: "saida", descricao: "Ferramenta CRM (HubSpot)", vencimento: "12/10/2025", valor: -950.00, status: "concluido", categoria: "software_ferramentas", contato: "HubSpot" },
  { id: "oct-504", tipo: "saida", descricao: "Comissões SDR", vencimento: "28/10/2025", valor: -2200.00, status: "concluido", categoria: "comissoes_vendas", contato: "Equipe Comercial" },

  // Despesas financeiras
  { id: "oct-601", tipo: "saida", descricao: "Tarifas bancárias", vencimento: "14/10/2025", valor: -145.90, status: "concluido", categoria: "tarifas_bancarias", contato: "Banco" },
  { id: "oct-602", tipo: "saida", descricao: "Juros antecipação de recebíveis", vencimento: "21/10/2025", valor: -380.00, status: "concluido", categoria: "outras_despesas_financeiras", contato: "Banco" },

  // Investimentos e parcelamentos
  { id: "oct-701", tipo: "parcelado", descricao: "Notebook dev - 2/10", vencimento: "13/10/2025", valor: -520.00, status: "concluido", categoria: "aquisicao_tecnologias", contato: "Fornecedor Y", parcela: "2/10" },
  { id: "oct-702", tipo: "saida", descricao: "Pesquisa e desenvolvimento (LLM fine-tuning)", vencimento: "19/10/2025", valor: -3200.00, status: "concluido", categoria: "pesquisa_desenvolvimento", contato: "Fornecedor IA" },

  // Impostos sobre vendas (ex.: DAS/Simples competência setembro)
  { id: "oct-801", tipo: "saida", descricao: "Impostos sobre vendas (competência set/25)", vencimento: "20/10/2025", valor: -5400.00, status: "concluido", categoria: "impostos_sobre_vendas", contato: "SEFAZ" },

  // Outras receitas financeiras
  { id: "oct-901", tipo: "entrada", descricao: "Receita aplicações financeiras", vencimento: "30/10/2025", valor: 260.00, status: "concluido", categoria: "receita_aplicacoes", contato: "Banco" },

  // Alguns itens em aberto no fim do mês para testes de filtros
  { id: "oct-950", tipo: "entrada", descricao: "MRR - Cliente Pi (Plano Pro)", vencimento: "29/10/2025", valor: 1490.00, status: "em_aberto", categoria: "venda_servicos", contato: "Cliente Pi" },
  { id: "oct-951", tipo: "saida", descricao: "Assinatura Notion", vencimento: "29/10/2025", valor: -120.00, status: "em_aberto", categoria: "software_ferramentas", contato: "Notion" },
  { id: "oct-952", tipo: "saida", descricao: "Aluguel escritório (out/25)", vencimento: "30/10/2025", valor: -3500.00, status: "em_aberto", categoria: "alugueis_condominio", contato: "Imobiliária" },
  { id: "oct-953", tipo: "saida", descricao: "Limpeza e conservação", vencimento: "30/10/2025", valor: -380.00, status: "em_aberto", categoria: "limpeza_conservacao", contato: "Prestador Z" },
  { id: "oct-954", tipo: "saida", descricao: "Brindes promocionais (evento SaaS Week)", vencimento: "31/10/2025", valor: -600.00, status: "em_aberto", categoria: "brindes_promocionais", contato: "Fornecedor Brindes" },
  { id: "oct-955", tipo: "entrada", descricao: "MRR - Cliente Rho (Plano Business)", vencimento: "31/10/2025", valor: 2990.00, status: "em_aberto", categoria: "venda_servicos", contato: "Cliente Rho" },
];
*/

const Lancamentos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeSegment, setActiveSegment] = useState("todos");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedLancamento, setSelectedLancamento] = useState<Lancamento | null>(null);
  const [sortColumn, setSortColumn] = useState<"vencimento" | "valor" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>(mockLancamentos);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>({
    direcao: "todos",
    status: "todos",
    conciliacao: "todos",
  });
  const [dateRange, setDateRange] = useState("");

  const filterChips = [
    { id: "entradas", label: "Entradas" },
    { id: "saidas", label: "Saídas" },
    { id: "em_aberto", label: "Em aberto" },
    { id: "concluidos", label: "Concluídos" },
    { id: "hoje", label: "Hoje" },
    { id: "essa_semana", label: "Essa semana" },
    { id: "esse_mes", label: "Esse mês" },
    { id: "atrasados", label: "Atrasados" },
  ];

  const segmentChips = [
    { id: "todos", label: "Todos" },
    { id: "lancamentos", label: "Lançamentos" },
    { id: "recorrente", label: "Recorrências" },
    { id: "parcelado", label: "Parcelamentos" },
  ];

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => {
      const isActive = prev.includes(filterId);
      let newFilters = isActive
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId];
      
      // Sync with advanced filters
      const newAdvancedFilters = { ...advancedFilters };
      
      if (filterId === "entradas") {
        newAdvancedFilters.direcao = isActive ? "todos" : "entradas";
      } else if (filterId === "saidas") {
        newAdvancedFilters.direcao = isActive ? "todos" : "saidas";
      } else if (filterId === "em_aberto") {
        newAdvancedFilters.status = isActive ? "todos" : "em_aberto";
      } else if (filterId === "concluidos") {
        newAdvancedFilters.status = isActive ? "todos" : "concluidos";
      } else if (["hoje", "essa_semana", "esse_mes"].includes(filterId)) {
        // Região exclusiva entre rápido de datas
        const dateQuick = ["hoje", "essa_semana", "esse_mes"] as const;
        if (!isActive) {
          newFilters = [...prev.filter(id => !dateQuick.includes(id as any)), filterId];
        }

        const now = new Date();
        let start: Date | undefined;
        let end: Date | undefined;

        if (isActive) {
          start = undefined;
          end = undefined;
        } else if (filterId === "hoje") {
          start = new Date(now);
          end = new Date(now);
        } else if (filterId === "essa_semana") {
          const day = now.getDay(); // 0(dom) - 6(sab)
          const diffToMonday = (day + 6) % 7; // seg=0
          start = new Date(now);
          start.setDate(now.getDate() - diffToMonday);
          end = new Date(start);
          end.setDate(start.getDate() + 6);
        } else if (filterId === "esse_mes") {
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        }

        if (start && end) {
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          newAdvancedFilters.dataVencimentoInicio = start;
          newAdvancedFilters.dataVencimentoFim = end;
          const inicio = start.toLocaleDateString("pt-BR");
          const fim = end.toLocaleDateString("pt-BR");
          setDateRange(`${inicio} à ${fim}`);
        } else {
          delete newAdvancedFilters.dataVencimentoInicio;
          delete newAdvancedFilters.dataVencimentoFim;
          setDateRange("");
        }
      }
      
      setAdvancedFilters(newAdvancedFilters);
      return newFilters;
    });
  };

  const toggleSegment = (segmentId: string) => {
    setActiveSegment(segmentId);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setActiveSegment("todos");
    setAdvancedFilters(prev => {
      const next = { ...prev, direcao: "todos", status: "todos", conciliacao: "todos" } as FilterState;
      delete next.dataVencimentoInicio;
      delete next.dataVencimentoFim;
      delete next.categoria;
      delete next.contato;
      return next;
    });
    setSearchTerm("");
    setDateRange("");
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredLancamentos.map(item => item.id);
    setSelectedItems(prev =>
      prev.length === allIds.length ? [] : allIds
    );
  };

  const handleSort = (column: "vencimento" | "valor") => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const openDetails = (lancamento: Lancamento) => {
    setSelectedLancamento(lancamento);
    setDetailsOpen(true);
  };

  const handleCreateLancamento = (novoLancamento: Lancamento) => {
    setLancamentos(prev => [novoLancamento, ...prev]);
  };

  const handleApplyFilters = (filters: FilterState) => {
    setAdvancedFilters(filters);
    
    // Sync quick filters with advanced filters
    const newActiveFilters: string[] = [];
    
    if (filters.direcao === "entradas") {
      newActiveFilters.push("entradas");
    } else if (filters.direcao === "saidas") {
      newActiveFilters.push("saidas");
    }
    
    if (filters.status === "em_aberto") {
      newActiveFilters.push("em_aberto");
    } else if (filters.status === "concluidos") {
      newActiveFilters.push("concluidos");
    }
    
    setActiveFilters(newActiveFilters);
    
    if (filters.dataVencimentoInicio && filters.dataVencimentoFim) {
      const inicio = filters.dataVencimentoInicio.toLocaleDateString("pt-BR");
      const fim = filters.dataVencimentoFim.toLocaleDateString("pt-BR");
      setDateRange(`${inicio} à ${fim}`);
    }
  };

  const clearDateRange = () => {
    setAdvancedFilters(prev => {
      const next = { ...prev } as FilterState;
      delete next.dataVencimentoInicio;
      delete next.dataVencimentoFim;
      return next;
    });
    setActiveFilters(prev => prev.filter(id => !["hoje", "essa_semana", "esse_mes"].includes(id)));
    setDateRange("");
  };

  const exportToCSV = () => {
    const headers = ["Tipo", "Descrição", "Vencimento", "Valor", "Status", "Categoria", "Contato"];
    const csvData = filteredLancamentos.map(item => [
      getTipoLabel(item.tipo),
      item.descricao + (item.parcela ? ` (${item.parcela})` : ""),
      item.vencimento,
      formatCurrency(item.valor),
      item.status === "em_aberto" ? "Em aberto" : "Concluído",
      getCategoryLabel(item.categoria, item.tipo === "entrada" ? "entrada" : "saida"),
      item.contato,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `lancamentos_${dateRange.replace(/\s/g, "_")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Lançamentos exportados em CSV com sucesso!");
  };

  const exportToExcel = () => {
    const headers = ["Tipo", "Descrição", "Vencimento", "Valor", "Status", "Categoria", "Contato"];
    const csvData = filteredLancamentos.map(item => [
      getTipoLabel(item.tipo),
      item.descricao + (item.parcela ? ` (${item.parcela})` : ""),
      item.vencimento,
      item.valor,
      item.status === "em_aberto" ? "Em aberto" : "Concluído",
      getCategoryLabel(item.categoria, item.tipo === "entrada" ? "entrada" : "saida"),
      item.contato,
    ]);

    const csvContent = [
      headers.join("\t"),
      ...csvData.map(row => row.join("\t"))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `lancamentos_${dateRange.replace(/\s/g, "_")}.xls`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Lançamentos exportados em Excel com sucesso!");
  };

  const filteredLancamentos = lancamentos.filter(item => {
    // Direção (entrada/saída) - unified from both quick and advanced filters
    if (advancedFilters.direcao === "entradas" && item.tipo !== "entrada") return false;
    if (advancedFilters.direcao === "saidas" && !["saida", "parcelado", "recorrente"].includes(item.tipo)) return false;

    // Status (em aberto/concluído) - unified from both quick and advanced filters
    if (advancedFilters.status === "em_aberto" && item.status !== "em_aberto") return false;
    if (advancedFilters.status === "concluidos" && item.status !== "concluido") return false;

    // Category filter (advanced only)
    if (advancedFilters.categoria && advancedFilters.categoria !== "__all__") {
      if (item.categoria !== advancedFilters.categoria) return false;
    }

    // Contact filter (advanced only)
    if (advancedFilters.contato) {
      const contatoMap: Record<string, string> = {
        "cliente-x": "Cliente X",
        "fornecedor-y": "Fornecedor Y",
        "nao-identificado": "Não identificado",
      };
      if (item.contato !== contatoMap[advancedFilters.contato]) return false;
    }

    // Date range filter (advanced only) — permite início OU fim
    if (advancedFilters.dataVencimentoInicio || advancedFilters.dataVencimentoFim) {
      const [dStr, mStr, yStr] = item.vencimento.split("/");
      const itemDate = new Date(Number(yStr), Number(mStr) - 1, Number(dStr));
      const startDate = advancedFilters.dataVencimentoInicio ? new Date(advancedFilters.dataVencimentoInicio) : null;
      const endDate = advancedFilters.dataVencimentoFim ? new Date(advancedFilters.dataVencimentoFim) : null;
      if (startDate) startDate.setHours(0, 0, 0, 0);
      if (endDate) endDate.setHours(23, 59, 59, 999);
      if (startDate && itemDate < startDate) return false;
      if (endDate && itemDate > endDate) return false;
    }

    // Segment filter (todos/lançamentos/recorrente/parcelado)
    if (activeSegment !== "todos") {
      if (activeSegment === "lancamentos" && ["recorrente", "parcelado"].includes(item.tipo)) return false;
      if (activeSegment === "recorrente" && item.tipo !== "recorrente") return false;
      if (activeSegment === "parcelado" && item.tipo !== "parcelado") return false;
    }

    // Quick filters (atrasados and date-based)
    if (activeFilters.includes("atrasados") && !item.atrasado) return false;

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.descricao.toLowerCase().includes(searchLower) ||
        item.categoria.toLowerCase().includes(searchLower) ||
        item.contato.toLowerCase().includes(searchLower)
      );
    }

    return true;
  }).sort((a, b) => {
    if (!sortColumn) return 0;
    
    if (sortColumn === "vencimento") {
      const [da, ma, ya] = a.vencimento.split("/");
      const [db, mb, yb] = b.vencimento.split("/");
      const dateA = new Date(Number(ya), Number(ma) - 1, Number(da));
      const dateB = new Date(Number(yb), Number(mb) - 1, Number(db));
      return sortDirection === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }
    
    if (sortColumn === "valor") {
      return sortDirection === "asc" ? a.valor - b.valor : b.valor - a.valor;
    }
    
    return 0;
  });

  // URL <-> State sync
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    const seg = params.get("seg") || "todos";
    const dir = params.get("dir") as FilterState["direcao"] | null;
    const st = params.get("st") as FilterState["status"] | null;
    const cat = params.get("cat") || undefined;
    const contato = params.get("cont") || undefined;
    const from = params.get("from");
    const to = params.get("to");
    const atras = params.get("atras") === "1";
    const quick = params.get("quick"); // hoje|essa_semana|esse_mes

    const nextFilters: FilterState = {
      direcao: dir || "todos",
      status: st || "todos",
      conciliacao: "todos",
      categoria: cat,
      contato,
    };

    if (from && to) {
      const [df, mf, yf] = from.split("-").map(Number);
      const [dt, mt, yt] = to.split("-").map(Number);
      const start = new Date(yf!, (mf! - 1), df!);
      const end = new Date(yt!, (mt! - 1), dt!);
      nextFilters.dataVencimentoInicio = start;
      nextFilters.dataVencimentoFim = end;
      setDateRange(`${start.toLocaleDateString("pt-BR")} à ${end.toLocaleDateString("pt-BR")}`);
    }

    setAdvancedFilters(prev => ({ ...prev, ...nextFilters }));
    setSearchTerm(q);
    setActiveSegment(seg);

    const quickList: string[] = [];
    if (nextFilters.direcao === "entradas") quickList.push("entradas");
    if (nextFilters.direcao === "saidas") quickList.push("saidas");
    if (nextFilters.status === "em_aberto") quickList.push("em_aberto");
    if (nextFilters.status === "concluidos") quickList.push("concluidos");
    if (atras) quickList.push("atrasados");
    if (quick && ["hoje","essa_semana","esse_mes"].includes(quick)) quickList.push(quick);
    setActiveFilters(quickList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (searchTerm) params.set("q", searchTerm); else params.delete("q");
    if (activeSegment && activeSegment !== "todos") params.set("seg", activeSegment); else params.delete("seg");

    // Advanced filters
    if (advancedFilters.direcao && advancedFilters.direcao !== "todos") params.set("dir", advancedFilters.direcao); else params.delete("dir");
    if (advancedFilters.status && advancedFilters.status !== "todos") params.set("st", advancedFilters.status); else params.delete("st");
    if (advancedFilters.categoria && advancedFilters.categoria !== "__all__") params.set("cat", advancedFilters.categoria); else params.delete("cat");
    if (advancedFilters.contato) params.set("cont", advancedFilters.contato!); else params.delete("cont");
    if (advancedFilters.dataVencimentoInicio && advancedFilters.dataVencimentoFim) {
      const s = advancedFilters.dataVencimentoInicio;
      const e = advancedFilters.dataVencimentoFim;
      const toIso = (d: Date) => `${d.getDate().toString().padStart(2,"0")}-${(d.getMonth()+1).toString().padStart(2,"0")}-${d.getFullYear()}`;
      params.set("from", toIso(s));
      params.set("to", toIso(e));
    } else {
      params.delete("from");
      params.delete("to");
    }

    // Quick flags
    params.set("atras", activeFilters.includes("atrasados") ? "1" : "0");
    const quick = ["hoje","essa_semana","esse_mes"].find(q => activeFilters.includes(q));
    if (quick) params.set("quick", quick); else params.delete("quick");

    const newSearch = params.toString();
    const current = location.search.replace(/^\?/, "");
    if (newSearch !== current) {
      navigate({ search: newSearch ? `?${newSearch}` : "" }, { replace: true });
    }
  }, [searchTerm, activeSegment, activeFilters, advancedFilters, location.search, navigate]);

  const getTipoIcon = (tipo: LancamentoType) => {
    switch (tipo) {
      case "entrada":
        return <div className="w-2 h-2 rounded-full bg-green-500" />;
      case "saida":
        return <div className="w-2 h-2 rounded-full bg-red-500" />;
      case "recorrente":
        return <div className="w-2 h-2 rounded-full bg-blue-500" />;
      case "parcelado":
        return <div className="w-2 h-2 rounded-full bg-purple-500" />;
    }
  };

  const getTipoLabel = (tipo: LancamentoType) => {
    switch (tipo) {
      case "entrada":
        return "Entrada";
      case "saida":
        return "Saída";
      case "recorrente":
        return "Recorrente";
      case "parcelado":
        return "Parcelado";
      default:
        return "Padrão";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Math.abs(value));
  };

  const getStatusBadge = (status: StatusType) => {
    return status === "em_aberto" ? (
      <Badge variant="outline" className="text-yellow-600 border-yellow-600/20 bg-yellow-600/10">
        Em aberto
      </Badge>
    ) : (
      <Badge variant="outline" className="text-green-600 border-green-600/20 bg-green-600/10">
        Concluído
      </Badge>
    );
  };

  const bulkActions = [
    { id: "archive", label: "Arquivar", icon: Archive },
    { id: "mark_paid", label: "Marcar como pago", icon: DollarSign },
    { id: "tag", label: "Aplicar tag", icon: Tag },
    { id: "export", label: "Exportar CSV", icon: ExternalLink },
  ];

  const handleBulkAction = (actionId: string) => {
    toast.success(`Ação "${actionId}" executada para ${selectedItems.length} itens (mock)`);
    setSelectedItems([]);
  };

  const resumoFinanceiro = {
    entradas: filteredLancamentos.filter(item => item.valor > 0).reduce((sum, item) => sum + item.valor, 0),
    saidas: filteredLancamentos.filter(item => item.valor < 0).reduce((sum, item) => sum + Math.abs(item.valor), 0),
  };
  
  const resultado = resumoFinanceiro.entradas - resumoFinanceiro.saidas;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          {/* Filters skeleton */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20" />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </div>
          </div>

          {/* Table skeleton */}
          <div className="border rounded-lg">
            <div className="border-b p-4">
              <div className="flex items-center gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-20" />
                ))}
              </div>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border-b last:border-b-0 p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (filteredLancamentos.length === 0 && (activeFilters.length > 0 || activeSegment !== "todos" || searchTerm)) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Início › Financeiro › Lançamentos</p>
              <h1 className="text-2xl font-semibold">Lançamentos</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar lançamento
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtros</span>
              {(advancedFilters.dataVencimentoInicio || advancedFilters.dataVencimentoFim) && (
                <Badge variant="outline" className="text-xs">
                  {advancedFilters.dataVencimentoInicio && advancedFilters.dataVencimentoFim
                    ? `${advancedFilters.dataVencimentoInicio.toLocaleDateString("pt-BR")} à ${advancedFilters.dataVencimentoFim.toLocaleDateString("pt-BR")}`
                    : advancedFilters.dataVencimentoInicio
                    ? `≥ ${advancedFilters.dataVencimentoInicio.toLocaleDateString("pt-BR")}`
                    : `≤ ${advancedFilters.dataVencimentoFim!.toLocaleDateString("pt-BR")}`}
                </Badge>
              )}
              <Button variant="link" size="sm" className="text-xs h-auto p-0" onClick={clearAllFilters}>
                Limpar todos
              </Button>
            </div>
            
          <div className="flex items-center gap-2 flex-wrap">
            {filterChips.map((chip) => (
              <Button
                key={chip.id}
                variant={activeFilters.includes(chip.id) ? "secondary" : "outline"}
                size="sm"
                className="h-9 min-w-[100px]"
                onClick={() => toggleFilter(chip.id)}
              >
                {chip.label}
              </Button>
            ))}
          </div>

            <div className="flex items-center gap-2">
              {segmentChips.map((segment) => (
                <Button
                  key={segment.id}
                  variant={activeSegment === segment.id ? "secondary" : "outline"}
                  size="sm"
                  className="h-8"
                  onClick={() => toggleSegment(segment.id)}
                >
                  {segment.label}
                </Button>
              ))}
            </div>
          </div>

          {/* No Results */}
          <div className="border rounded-lg p-12">
            <div className="text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum lançamento corresponde aos filtros selecionados</h3>
              <p className="text-muted-foreground mb-4">Tente ajustar os filtros ou limpar a busca para ver mais resultados.</p>
              <Button onClick={clearAllFilters}>Limpar filtros</Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (filteredLancamentos.length === 0) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Início › Financeiro › Lançamentos</p>
              <h1 className="text-2xl font-semibold">Lançamentos</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
              <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar lançamento
              </Button>
            </div>
          </div>

          {/* Empty State */}
          <div className="border rounded-lg p-12">
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum lançamento encontrado</h3>
              <p className="text-muted-foreground mb-4">Comece criando seu primeiro lançamento financeiro.</p>
              <div className="flex items-center justify-center gap-3">
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar lançamento
                </Button>
                <Button variant="outline">Como funciona</Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Início › Financeiro › Lançamentos</p>
            <h1 className="text-2xl font-semibold">Lançamentos</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setLoading(true)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar lançamento
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background">
                <DropdownMenuItem onClick={exportToCSV}>
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportToExcel}>
                  <File className="h-4 w-4 mr-2" />
                  Exportar Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b">
          <div className="flex items-center gap-2 flex-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterDialogOpen(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            
            {(advancedFilters.dataVencimentoInicio || advancedFilters.dataVencimentoFim) && (
              <Badge variant="outline" className="text-xs flex items-center gap-1 px-2 py-1">
                {dateRange || (
                  advancedFilters.dataVencimentoInicio && advancedFilters.dataVencimentoFim
                    ? `${advancedFilters.dataVencimentoInicio.toLocaleDateString("pt-BR")} à ${advancedFilters.dataVencimentoFim.toLocaleDateString("pt-BR")}`
                    : advancedFilters.dataVencimentoInicio
                    ? `≥ ${advancedFilters.dataVencimentoInicio.toLocaleDateString("pt-BR")}`
                    : `≤ ${advancedFilters.dataVencimentoFim!.toLocaleDateString("pt-BR")}`
                )}
                <X className="h-3 w-3 cursor-pointer hover:opacity-70" onClick={clearDateRange} />
              </Badge>
            )}
            
            <Button variant="link" size="sm" className="text-xs h-auto p-0" onClick={clearAllFilters}>
              Limpar todos
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {filterChips.map((chip) => (
            <Button
              key={chip.id}
              variant={activeFilters.includes(chip.id) ? "secondary" : "outline"}
              size="sm"
              className="h-9 min-w-[100px]"
              onClick={() => toggleFilter(chip.id)}
            >
              {chip.label}
            </Button>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-muted/50 border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedItems.length} selecionados
              </span>
              <div className="flex items-center gap-2">
                {bulkActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction(action.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="border rounded-lg">
          {/* Table Header */}
          <div className="border-b bg-muted/30">
            <div className="flex items-center h-12 px-4 text-sm font-medium text-muted-foreground gap-3">
              <div className="w-10 flex items-center justify-center flex-shrink-0">
                <Checkbox
                  checked={selectedItems.length === filteredLancamentos.length}
                  onCheckedChange={handleSelectAll}
                />
              </div>
              <div className="w-24 flex-shrink-0">Tipo</div>
              <div className="flex-1 min-w-[180px]">Descrição</div>
              <div className="w-28 flex-shrink-0 flex items-center gap-1 cursor-pointer" onClick={() => handleSort("vencimento")}>
                Vencimento
                {sortColumn === "vencimento" && (
                  sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                )}
                {sortColumn !== "vencimento" && <ArrowUpDown className="h-3 w-3" />}
              </div>
              <div className="w-32 flex-shrink-0 text-right flex items-center justify-end gap-1 cursor-pointer" onClick={() => handleSort("valor")}>
                Valor
                {sortColumn === "valor" && (
                  sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                )}
                {sortColumn !== "valor" && <ArrowUpDown className="h-3 w-3" />}
              </div>
              <div className="w-28 flex-shrink-0">Status</div>
              <div className="w-36 flex-shrink-0">Categoria</div>
              <div className="w-32 flex-shrink-0">Contato</div>
              <div className="w-20 flex-shrink-0"></div>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {filteredLancamentos.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center h-14 px-4 border-b last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors gap-3"
                onClick={() => openDetails(item)}
              >
                <div className="w-10 flex items-center justify-center flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleSelectItem(item.id)}
                  />
                </div>
                <div className="w-24 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    {getTipoIcon(item.tipo)}
                    <span className="text-sm">{getTipoLabel(item.tipo)}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-[180px]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{item.descricao}</span>
                    {item.parcela && (
                      <Badge variant="outline" className="text-xs flex-shrink-0">{item.parcela}</Badge>
                    )}
                  </div>
                </div>
                <div className="w-28 flex-shrink-0">
                  <div className="flex items-center gap-1 text-sm">
                    {item.atrasado && <AlertTriangle className="h-3 w-3 text-yellow-500 flex-shrink-0" />}
                    <span className={item.atrasado ? "text-yellow-600" : ""}>{item.vencimento}</span>
                  </div>
                </div>
                <div className="w-32 flex-shrink-0 text-right">
                  <span className={`text-sm font-medium ${item.valor > 0 ? "text-green-600" : "text-red-600"}`}>
                    {item.valor < 0 ? "- " : "+ "}{formatCurrency(item.valor)}
                  </span>
                </div>
                <div className="w-28 flex-shrink-0">
                  {getStatusBadge(item.status)}
                </div>
                <div className="w-36 flex-shrink-0">
                  <span className="text-sm text-muted-foreground truncate block">
                    {getCategoryLabel(item.categoria, item.tipo === "entrada" ? "entrada" : "saida")}
                  </span>
                </div>
                <div className="w-32 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">{item.contato}</span>
                  </div>
                </div>
                <div className="w-20 flex-shrink-0 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Archive className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredLancamentos.length} / {filteredLancamentos.length}
          </div>
          
          {/* Financial Summary */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="text-sm">
                <span className="text-muted-foreground">Entradas</span>
                <div className="font-medium text-green-600">
                  {formatCurrency(resumoFinanceiro.entradas)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="text-sm">
                <span className="text-muted-foreground">Saídas</span>
                <div className="font-medium text-red-600">
                  {formatCurrency(resumoFinanceiro.saidas)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
              <div className="text-sm">
                <span className="text-muted-foreground">Resultado</span>
                <div className={`font-medium ${resultado >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(resultado)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Sheet */}
        <Sheet open={detailsOpen} onOpenChange={setDetailsOpen}>
          <SheetContent className="w-96">
            {selectedLancamento && (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    {selectedLancamento.descricao}
                    {getStatusBadge(selectedLancamento.status)}
                  </SheetTitle>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicar
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Criar cobrança
                    </Button>
                    <Button size="sm" variant="outline">
                      <Archive className="h-4 w-4 mr-2" />
                      Arquivar
                    </Button>
                  </div>

                  {/* Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Informações principais</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Valor</label>
                        <p className={`font-medium ${selectedLancamento.valor > 0 ? "text-green-600" : "text-red-600"}`}>
                          {formatCurrency(selectedLancamento.valor)}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground">Vencimento</label>
                        <p className="font-medium">{selectedLancamento.vencimento}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm text-muted-foreground">Tipo</label>
                        <p className="font-medium capitalize">{selectedLancamento.tipo.replace("_", " ")}</p>
                      </div>
                      
                      {selectedLancamento.parcela && (
                        <div>
                          <label className="text-sm text-muted-foreground">Parcela</label>
                          <p className="font-medium">{selectedLancamento.parcela}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category & Tags */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Categoria & Tags</h4>
                    <div>
                      <Badge variant="secondary">
                        {getCategoryLabel(selectedLancamento.categoria, selectedLancamento.tipo === "entrada" ? "entrada" : "saida")}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Contato</h4>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedLancamento.contato}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Notas</h4>
                    <p className="text-sm text-muted-foreground">Nenhuma nota adicionada.</p>
                  </div>

                  {/* Attachments */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Anexos</h4>
                    <p className="text-sm text-muted-foreground">Nenhum anexo adicionado.</p>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Create Lancamento Dialog */}
        <CreateLancamentoDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          onCreateLancamento={handleCreateLancamento}
        />

        {/* Filter Dialog */}
        <FilterLancamentosDialog
          open={filterDialogOpen}
          onOpenChange={setFilterDialogOpen}
          onApplyFilters={handleApplyFilters}
        />
      </div>
    </DashboardLayout>
  );
};

export default Lancamentos;
