import { useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockLancamentos as lancamentosData } from "./Lancamentos";
import { ChevronDown, ChevronRight } from "lucide-react";

type DreGroupKey =
  | "receitas_operacionais"
  | "despesas_operacionais"
  | "despesas_venda_marketing"
  | "despesas_administrativas"
  | "despesas_pessoal"
  | "receitas_financeiras"
  | "outras_receitas"
  | "despesas_financeiras"
  | "investimentos"
  | "impostos_lucro";

const monthLabels = [
  "Jan/2025",
  "Fev/2025",
  "Mar/2025",
  "Abr/2025",
  "Mai/2025",
  "Jun/2025",
  "Jul/2025",
  "Ago/2025",
  "Set/2025",
  "Out/2025",
  "Nov/2025",
  "Dez/2025",
];

const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
const formatPercent = (value: number) => new Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);

// Mapeamento das categorias (values) -> linhas de DRE
const categoryToDreLine: Record<string, { group: DreGroupKey; line: string }> = {
  // Receitas operacionais
  venda_produtos: { group: "receitas_operacionais", line: "Venda de produtos" },
  venda_servicos: { group: "receitas_operacionais", line: "Venda de serviços" },
  outras_receitas_operacionais: { group: "receitas_operacionais", line: "Outras receitas operacionais" },

  // Despesas operacionais (custos e despesas diretas)
  custo_mercadorias_vendidas: { group: "despesas_operacionais", line: "Custo de mercadorias vendidas" },
  custo_servicos_prestados: { group: "despesas_operacionais", line: "Custo dos serviços prestados" },
  impostos_sobre_vendas: { group: "despesas_operacionais", line: "Impostos sobre vendas" },
  logistica_vendas: { group: "despesas_operacionais", line: "Logística de vendas" },
  taxas_sobre_vendas: { group: "despesas_operacionais", line: "Taxas sobre vendas" },
  outras_despesas_diretas: { group: "despesas_operacionais", line: "Outras despesas diretas" },

  // Despesas de vendas e marketing
  marketing_publicidade: { group: "despesas_venda_marketing", line: "Marketing e publicidade" },
  descontos_comerciais: { group: "despesas_venda_marketing", line: "Descontos comerciais e promoções" },
  comissoes_vendas: { group: "despesas_venda_marketing", line: "Comissões sobre vendas" },
  brindes_promocionais: { group: "despesas_venda_marketing", line: "Brindes promocionais" },
  publicidade_anuncios: { group: "despesas_venda_marketing", line: "Publicidade e anúncios" },
  eventos_patrocinios: { group: "despesas_venda_marketing", line: "Eventos e patrocínios" },
  viagens_deslocamentos: { group: "despesas_venda_marketing", line: "Viagens e deslocamentos" },
  pesquisa_mercado: { group: "despesas_venda_marketing", line: "Pesquisa de mercado" },
  outras_despesas_venda_marketing: { group: "despesas_venda_marketing", line: "Outras despesas de venda e marketing" },

  // Despesas administrativas
  agua_esgoto: { group: "despesas_administrativas", line: "Água e esgoto" },
  alugueis_condominio: { group: "despesas_administrativas", line: "Aluguéis, condomínios e IPTU" },
  servicos_contabilidade: { group: "despesas_administrativas", line: "Serviços de contabilidade" },
  assessorias_consultorias: { group: "despesas_administrativas", line: "Assessorias e consultorias" },
  servicos_juridicos: { group: "despesas_administrativas", line: "Serviços jurídicos" },
  documentacao_registros: { group: "despesas_administrativas", line: "Documentação e registros" },
  energia_eletrica: { group: "despesas_administrativas", line: "Energia elétrica" },
  entidades_associacoes: { group: "despesas_administrativas", line: "Entidades e associações" },
  lanches_refeicoes: { group: "despesas_administrativas", line: "Lanches e refeições" },
  limpeza_conservacao: { group: "despesas_administrativas", line: "Limpeza e conservação" },
  manutencao_equipamentos: { group: "despesas_administrativas", line: "Manutenção de equipamentos" },
  material_escritorio: { group: "despesas_administrativas", line: "Material de escritório" },
  servicos_terceirizados: { group: "despesas_administrativas", line: "Serviços terceirizados" },
  seguranca_patrimonial: { group: "despesas_administrativas", line: "Segurança patrimonial" },
  software_ferramentas: { group: "despesas_administrativas", line: "Software e ferramentas digitais" },
  taxas_licencas: { group: "despesas_administrativas", line: "Taxas e licenças" },
  telefonia_internet: { group: "despesas_administrativas", line: "Telefonia e internet" },
  transporte_combustiveis: { group: "despesas_administrativas", line: "Transporte e combustíveis" },
  outras_despesas_administrativas: { group: "despesas_administrativas", line: "Outras despesas administrativas" },

  // Despesas com pessoal
  salarios_ordenados: { group: "despesas_pessoal", line: "Salários e ordenados" },
  pro_labore: { group: "despesas_pessoal", line: "Pró-labore" },
  ferias_beneficios: { group: "despesas_pessoal", line: "Férias e benefícios" },
  encargos_trabalhistas: { group: "despesas_pessoal", line: "Encargos trabalhistas" },
  cursos_treinamentos: { group: "despesas_pessoal", line: "Cursos e treinamentos" },
  recrutamento_selecao: { group: "despesas_pessoal", line: "Recrutamento e seleção" },
  outras_despesas_pessoal: { group: "despesas_pessoal", line: "Outras despesas com pessoal" },

  // Receitas financeiras
  emprestimos_captados: { group: "receitas_financeiras", line: "Empréstimos captados" },
  receita_aplicacoes: { group: "receitas_financeiras", line: "Receita de aplicações financeiras" },
  aportes_capital: { group: "receitas_financeiras", line: "Aportes de capital" },
  multas_juros_recebidos: { group: "receitas_financeiras", line: "Multas e juros recebidos" },
  descontos_obtidos: { group: "receitas_financeiras", line: "Descontos obtidos" },
  transferencia_interna_entrada: { group: "receitas_financeiras", line: "Receitas financeiras" },
  outras_receitas_financeiras: { group: "receitas_financeiras", line: "Outras receitas financeiras" },

  // Outras receitas
  reembolso_despesas: { group: "outras_receitas", line: "Reembolso de despesas" },
  venda_ativos: { group: "outras_receitas", line: "Venda de ativos imobilizados" },
  outras_receitas_diversas: { group: "outras_receitas", line: "Outras receitas diversas" },

  // Despesas financeiras
  multas_juros_pagos: { group: "despesas_financeiras", line: "Multas e juros pagos" },
  descontos_concedidos: { group: "despesas_financeiras", line: "Descontos concedidos" },
  tarifas_bancarias: { group: "despesas_financeiras", line: "Tarifas bancárias" },
  transferencia_interna_saida: { group: "despesas_financeiras", line: "Despesas financeiras" },
  faturas_cartao_credito: { group: "despesas_financeiras", line: "Despesas financeiras" },
  outras_despesas_financeiras: { group: "despesas_financeiras", line: "Outras despesas financeiras" },

  // Investimentos
  amortizacao_emprestimos: { group: "investimentos", line: "Amortização de empréstimos" },
  aquisicao_tecnologias: { group: "investimentos", line: "Aquisição de tecnologias" },
  pesquisa_desenvolvimento: { group: "investimentos", line: "Pesquisa e desenvolvimento" },
  moveis_utensilios: { group: "investimentos", line: "Móveis e utensílios" },
  obras_reformas: { group: "investimentos", line: "Obras, reformas e benfeitorias" },
  aquisicao_ativos: { group: "investimentos", line: "Aquisição de ativos" },
  outros_investimentos: { group: "investimentos", line: "Outros investimentos" },

  // Impostos sobre o lucro
  csll: { group: "impostos_lucro", line: "CSLL" },
  irpj: { group: "impostos_lucro", line: "IRPJ" },
};

const linhasPrincipais: Array<{ grupo: DreGroupKey | "metric:margem" | "metric:ebitda" | "metric:lucro"; titulo: string; sublinhas?: string[]; showPercentAfter?: boolean }> = [
  { grupo: "receitas_operacionais", titulo: "Receitas operacionais", sublinhas: [
    "Venda de produtos",
    "Venda de serviços",
    "Outras receitas operacionais",
  ] },
  { grupo: "despesas_operacionais", titulo: "Despesas operacionais", sublinhas: [
    "Custo de mercadorias vendidas",
    "Custo dos serviços prestados",
    "Impostos sobre vendas",
    "Logística de vendas",
    "Taxas sobre vendas",
    "Outras despesas diretas",
  ] },
  { grupo: "despesas_venda_marketing", titulo: "Despesas de vendas e marketing", sublinhas: [
    "Marketing e publicidade",
    "Descontos comerciais e promoções",
    "Comissões sobre vendas",
    "Brindes promocionais",
    "Publicidade e anúncios",
    "Eventos e patrocínios",
    "Viagens e deslocamentos",
    "Pesquisa de mercado",
    "Outras despesas de venda e marketing",
  ] },
  { grupo: "metric:margem", titulo: "Margem de contribuição", showPercentAfter: true },
  { grupo: "despesas_administrativas", titulo: "Despesas administrativas", sublinhas: [
    "Água e esgoto",
    "Aluguéis, condomínios e IPTU",
    "Serviços de contabilidade",
    "Assessorias e consultorias",
    "Serviços jurídicos",
    "Documentação e registros",
    "Energia elétrica",
    "Entidades e associações",
    "Lanches e refeições",
    "Limpeza e conservação",
    "Manutenção de equipamentos",
    "Material de escritório",
    "Serviços terceirizados",
    "Segurança patrimonial",
    "Software e ferramentas digitais",
    "Taxas e licenças",
    "Telefonia e internet",
    "Transporte e combustíveis",
    "Outras despesas administrativas",
  ] },
  { grupo: "despesas_pessoal", titulo: "Despesas com pessoal", sublinhas: [
    "Salários e ordenados",
    "Pró-labore",
    "Férias e benefícios",
    "Encargos trabalhistas",
    "Cursos e treinamentos",
    "Recrutamento e seleção",
    "Outras despesas com pessoal",
  ] },
  { grupo: "metric:ebitda", titulo: "EBITDA", showPercentAfter: true },
  { grupo: "receitas_financeiras", titulo: "Receitas financeiras", sublinhas: [
    "Empréstimos captados",
    "Receita de aplicações financeiras",
    "Aportes de capital",
    "Multas e juros recebidos",
    "Descontos obtidos",
    "Outras receitas financeiras",
  ] },
  { grupo: "outras_receitas", titulo: "Outras receitas", sublinhas: [
    "Reembolso de despesas",
    "Venda de ativos imobilizados",
    "Outras receitas diversas",
  ] },
  { grupo: "despesas_financeiras", titulo: "Despesas financeiras", sublinhas: [
    "Multas e juros pagos",
    "Descontos concedidos",
    "Tarifas bancárias",
    "Outras despesas financeiras",
  ] },
  { grupo: "investimentos", titulo: "Investimentos", sublinhas: [
    "Amortização de empréstimos",
    "Aquisição de tecnologias",
    "Pesquisa e desenvolvimento",
    "Móveis e utensílios",
    "Obras, reformas e benfeitorias",
    "Aquisição de ativos",
    "Outros investimentos",
  ] },
  { grupo: "impostos_lucro", titulo: "Impostos sobre o lucro", sublinhas: [
    "CSLL",
    "IRPJ",
  ] },
  { grupo: "metric:lucro", titulo: "Lucro líquido", showPercentAfter: true },
];

const Demonstrativo = () => {
  const [ano, setAno] = useState("2025");

  const matrizValores = useMemo(() => {
    // estrutura: { [linha]: number[12] }
    const base: Record<string, number[]> = {};
    const ensure = (key: string) => (base[key] ||= Array(12).fill(0));

    lancamentosData.forEach((l) => {
      const [d, m, y] = l.vencimento.split("/").map(Number);
      if (!d || !m || !y) return;
      if (String(y) !== ano) return;
      const idx = m - 1;

      // valor positivo para entradas, negativo para saídas
      const valor = l.valor;

      // mapear categoria
      const map = categoryToDreLine[l.categoria];
      if (!map) {
        return;
      }

      // Receitas entram positivas; despesas negativas
      const isDespesa = [
        "despesas_operacionais",
        "despesas_venda_marketing",
        "despesas_administrativas",
        "despesas_pessoal",
        "despesas_financeiras",
      ].includes(map.group);

      const sinal = isDespesa ? -1 : 1;

      // linhas detalhadas (quando existirem)
      const linha = map.line;
      ensure(linha)[idx] += Math.abs(valor) * sinal;

      // somatório por grupo principal
      ensure(map.group)[idx] += Math.abs(valor) * sinal;
    });

    // cálculos derivados
    for (let i = 0; i < 12; i++) {
      const receitasOper = base["receitas_operacionais"]?.[i] || 0;
      const despesasOper = base["despesas_operacionais"]?.[i] || 0;
      const vendasMkt = base["despesas_venda_marketing"]?.[i] || 0;
      const margemContrib = receitasOper + despesasOper + vendasMkt; // despesas já negativas
      ensure("Margem de contribuição")[i] = margemContrib;

      const despAdm = base["despesas_administrativas"]?.[i] || 0;
      const despPessoal = base["despesas_pessoal"]?.[i] || 0;
      const ebitda = margemContrib + despAdm + despPessoal;
      ensure("EBITDA")[i] = ebitda;

      const receitasFin = base["receitas_financeiras"]?.[i] || 0;
      const outrasRec = base["outras_receitas"]?.[i] || 0;
      const despesasFin = base["despesas_financeiras"]?.[i] || 0;
      const investimentos = base["investimentos"]?.[i] || 0;
      const impostosLucro = base["impostos_lucro"]?.[i] || 0;
      const lucro = ebitda + receitasFin + outrasRec + despesasFin + investimentos + impostosLucro;
      ensure("Lucro líquido")[i] = lucro;
    }

    return base;
  }, [ano]);

  const totalColuna = (key: string) => (matrizValores[key] || Array(12).fill(0));
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Início › Relatórios › Demonstrativo</p>
          <h1 className="text-2xl font-semibold">Demonstrativo</h1>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={"Mensal"}>
                <SelectTrigger className="w-36 h-8">
                  <SelectValue placeholder="Periodicidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ano} onValueChange={setAno}>
                <SelectTrigger className="w-28 h-8">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>

              <Badge variant="outline" className="h-8 px-2">Data de vencimento</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="border rounded-lg overflow-auto">
          <div className="min-w-[1000px]">
            <div className="grid" style={{ gridTemplateColumns: "380px repeat(12, 150px) 160px" }}>
              <div className="bg-muted/30 p-3 font-medium text-muted-foreground">&nbsp;</div>
              {monthLabels.map((m, idx) => (
                <div key={m} className={`p-3 text-sm font-medium text-muted-foreground text-right tabular-nums whitespace-nowrap ${idx % 2 === 0 ? "bg-muted/30" : "bg-background"}`}>{m}</div>
              ))}
              <div className="bg-muted/30 p-3 text-sm font-medium text-muted-foreground text-right tabular-nums whitespace-nowrap border-l">Total</div>
              {linhasPrincipais.map((linha, idx) => {
                if (linha.grupo.startsWith("metric:")) {
                  const metricKey = linha.grupo === "metric:margem" ? "Margem de contribuição" : linha.grupo === "metric:ebitda" ? "EBITDA" : "Lucro líquido";
                  const valores = totalColuna(metricKey);
                  const receitas = totalColuna("receitas_operacionais");
                  const isExpanded = !!expanded[linha.titulo];
                  const hasPercent = linha.showPercentAfter;
                  return (
                    <>
                      <div key={linha.titulo+idx} className="p-3 font-medium cursor-pointer" onClick={() => hasPercent && toggle(linha.titulo)}>
                        <div className="flex items-center gap-2">
                          {hasPercent ? (
                            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                          ) : (
                            <span className="inline-flex items-center justify-center w-4 h-4" />
                          )}
                          {linha.titulo}
                        </div>
                      </div>
                      {valores.map((v, i) => (
                        <div key={linha.titulo+"-"+i} className={`p-3 text-right tabular-nums whitespace-nowrap ${i % 2 === 0 ? "bg-muted/30" : "bg-background"} ${v >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(v)}</div>
                      ))}
                      <div className={`p-3 text-right tabular-nums whitespace-nowrap border-l font-medium bg-muted/30 ${valores.reduce((a, b) => a + b, 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatCurrency(valores.reduce((a, b) => a + b, 0))}
                      </div>
                      {hasPercent && isExpanded && (
                        <>
                          <div className="p-3 pl-8 text-sm text-muted-foreground">{linha.titulo} %</div>
                          {valores.map((v, i) => {
                            const base = receitas[i] || 0;
                            const pct = base !== 0 ? v / base : 0;
                            return (
                              <div key={linha.titulo+"-%-"+i} className={`p-3 text-right tabular-nums whitespace-nowrap text-muted-foreground ${i % 2 === 0 ? "bg-muted/30" : "bg-background"}`}>{formatPercent(pct)}</div>
                            );
                          })}
                          <div className="p-3 text-right tabular-nums whitespace-nowrap text-muted-foreground border-l bg-muted/30">
                            {(() => {
                              const totalValores = valores.reduce((a, b) => a + b, 0);
                              const totalReceitas = receitas.reduce((a, b) => a + b, 0);
                              const pct = totalReceitas !== 0 ? totalValores / totalReceitas : 0;
                              return formatPercent(pct);
                            })()}
                          </div>
                        </>
                      )}
                    </>
                  );
                }

                const valoresGrupo = totalColuna(typeof linha.grupo === "string" ? linha.grupo : "");
                const isExpanded = !!expanded[linha.titulo];
                const hasChildren = (linha.sublinhas && linha.sublinhas.length > 0);
                return (
                  <>
                    <div key={linha.titulo+idx} className="p-3 font-medium cursor-pointer" onClick={() => hasChildren && toggle(linha.titulo)}>
                      <div className="flex items-center gap-2">
                        {hasChildren ? (
                          isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                        ) : (
                          <span className="inline-flex items-center justify-center w-4 h-4" />
                        )}
                        {linha.titulo}
                      </div>
                    </div>
                    {valoresGrupo.map((v, i) => (
                      <div key={linha.titulo+"-"+i} className={`p-3 text-right tabular-nums whitespace-nowrap ${i % 2 === 0 ? "bg-muted/30" : "bg-background"}`}>{formatCurrency(v)}</div>
                    ))}
                    <div className="p-3 text-right tabular-nums whitespace-nowrap border-l font-medium bg-muted/30">
                      {formatCurrency(valoresGrupo.reduce((a, b) => a + b, 0))}
                    </div>

                    {hasChildren && isExpanded && linha.sublinhas!.map((sub) => {
                      const valoresSub = totalColuna(sub);
                      return (
                        <>
                          <div key={linha.titulo+sub} className="p-3 pl-8 text-sm text-muted-foreground">{sub}</div>
                          {valoresSub.map((v, i) => (
                            <div key={linha.titulo+sub+"-"+i} className={`p-3 text-right text-muted-foreground tabular-nums whitespace-nowrap ${i % 2 === 0 ? "bg-muted/30" : "bg-background"}`}>{formatCurrency(v || 0)}</div>
                          ))}
                          <div className="p-3 text-right text-muted-foreground tabular-nums whitespace-nowrap border-l bg-muted/30">
                            {formatCurrency(valoresSub.reduce((a, b) => a + b, 0))}
                          </div>
                        </>
                      );
                    })}
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Demonstrativo;
