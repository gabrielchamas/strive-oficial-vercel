// Gerador de dados de lançamentos para 2025
// Esta função gera lançamentos distribuídos ao longo do ano

export interface Lancamento {
  id: string;
  tipo: "entrada" | "saida" | "recorrente" | "parcelado";
  descricao: string;
  vencimento: string;
  valor: number;
  status: "em_aberto" | "concluido";
  categoria: string;
  contato: string;
  parcela?: string;
  atrasado?: boolean;
}

const clientes = ["TechCorp", "StartupXYZ", "EmpresaABC", "InovaçãoBR", "DigitalPlus", "CloudSys", "DataFlow", "NextGen", "SmartSol", "FutureTech"];
const planos = { Starter: 490, Pro: 1490, Business: 2990, Enterprise: 4990 };

function gerarLancamentos(): Lancamento[] {
  const lancamentos: Lancamento[] = [];
  let idCounter = 1;

  // Função auxiliar para formatar data
  const formatDate = (dia: number, mes: number) => `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/2025`;

  // Função auxiliar para criar ID
  const createId = (prefix: string) => `${prefix}-${String(idCounter++).padStart(3, "0")}`;

  // Para cada mês (1-12)
  for (let mes = 1; mes <= 12; mes++) {
    const diasNoMes = new Date(2025, mes, 0).getDate();

    // ===== RECEITAS OPERACIONAIS =====
    // MRR recorrente (todos os meses, dia 5)
    clientes.slice(0, 8).forEach((cliente, idx) => {
      const planoKeys = Object.keys(planos);
      const plano = planoKeys[idx % planoKeys.length] as keyof typeof planos;
      lancamentos.push({
        id: createId(`rec-${mes}`),
        tipo: "recorrente",
        descricao: `MRR - ${cliente} (Plano ${plano})`,
        vencimento: formatDate(5, mes),
        valor: planos[plano],
        status: "concluido",
        categoria: "venda_servicos",
        contato: cliente,
      });
    });

    // Novos clientes (distribuídos ao longo do mês)
    if (mes <= 6) {
      // Primeiro semestre: mais novos clientes
      for (let i = 0; i < 3; i++) {
        const cliente = clientes[i % clientes.length];
        const planoKeys = Object.keys(planos);
        const plano = planoKeys[i % planoKeys.length] as keyof typeof planos;
        lancamentos.push({
          id: createId(`nov-${mes}`),
          tipo: "entrada",
          descricao: `Onboarding - ${cliente} (Plano ${plano})`,
          vencimento: formatDate(10 + i * 5, mes),
          valor: planos[plano],
          status: "concluido",
          categoria: "venda_servicos",
          contato: cliente,
        });
      }
    }

    // Upgrade de plano (aleatório, 1-2 por mês)
    if (mes % 2 === 0) {
      const cliente = clientes[mes % clientes.length];
      lancamentos.push({
        id: createId(`upg-${mes}`),
        tipo: "entrada",
        descricao: `Upgrade de plano - ${cliente}`,
        vencimento: formatDate(15, mes),
        valor: 1000 + mes * 100,
        status: "concluido",
        categoria: "venda_servicos",
        contato: cliente,
      });
    }

    // Serviços adicionais (consultoria, treinamento)
    if (mes % 3 === 0) {
      lancamentos.push({
        id: createId(`svc-${mes}`),
        tipo: "entrada",
        descricao: `Serviço adicional - Treinamento (${clientes[mes % clientes.length]})`,
        vencimento: formatDate(20, mes),
        valor: 800 + mes * 50,
        status: "concluido",
        categoria: "venda_servicos",
        contato: clientes[mes % clientes.length],
      });
    }

    // ===== DESPESAS OPERACIONAIS =====
    // Custo dos serviços prestados (infraestrutura)
    lancamentos.push({
      id: createId(`cst-${mes}`),
      tipo: "saida",
      descricao: `AWS - EC2/RDS/S3 (competência ${mes - 1 || 12}/25)`,
      vencimento: formatDate(7, mes),
      valor: -(1800 + mes * 150),
      status: "concluido",
      categoria: "custo_servicos_prestados",
      contato: "AWS",
    });

    lancamentos.push({
      id: createId(`cdn-${mes}`),
      tipo: "recorrente",
      descricao: "Cloudflare - CDN e WAF",
      vencimento: formatDate(8, mes),
      valor: -210,
      status: "concluido",
      categoria: "custo_servicos_prestados",
      contato: "Cloudflare",
    });

    lancamentos.push({
      id: createId(`eml-${mes}`),
      tipo: "recorrente",
      descricao: "SendGrid - E-mails transacionais",
      vencimento: formatDate(9, mes),
      valor: -(120 + mes * 10),
      status: "concluido",
      categoria: "custo_servicos_prestados",
      contato: "SendGrid",
    });

    // Impostos sobre vendas
    lancamentos.push({
      id: createId(`imp-${mes}`),
      tipo: "saida",
      descricao: `Impostos sobre vendas (competência ${mes - 1 || 12}/25)`,
      vencimento: formatDate(20, mes),
      valor: -(3500 + mes * 200),
      status: "concluido",
      categoria: "impostos_sobre_vendas",
      contato: "SEFAZ",
    });

    // Taxas sobre vendas (gateway)
    lancamentos.push({
      id: createId(`tax-${mes}`),
      tipo: "saida",
      descricao: `Taxas do gateway (${mes}/25)`,
      vencimento: formatDate(6, mes),
      valor: -(400 + mes * 30),
      status: "concluido",
      categoria: "taxas_sobre_vendas",
      contato: "Gateway Pagamentos",
    });

    // Descontos comerciais (campanhas)
    if (mes % 2 === 1) {
      lancamentos.push({
        id: createId(`dsc-${mes}`),
        tipo: "saida",
        descricao: `Descontos promocionais - Campanha ${mes}/25`,
        vencimento: formatDate(12, mes),
        valor: -(200 + mes * 20),
        status: "concluido",
        categoria: "descontos_comerciais",
        contato: "Campanha",
      });
    }

    // ===== DESPESAS DE VENDAS E MARKETING =====
    // Marketing e publicidade
    lancamentos.push({
      id: createId(`mkt-${mes}`),
      tipo: "saida",
      descricao: "Meta Ads",
      vencimento: formatDate(9, mes),
      valor: -(3000 + mes * 100),
      status: "concluido",
      categoria: "marketing_publicidade",
      contato: "Meta",
    });

    lancamentos.push({
      id: createId(`gad-${mes}`),
      tipo: "saida",
      descricao: "Google Ads",
      vencimento: formatDate(16, mes),
      valor: -(3800 + mes * 150),
      status: "concluido",
      categoria: "publicidade_anuncios",
      contato: "Google",
    });

    // Comissões sobre vendas
    lancamentos.push({
      id: createId(`com-${mes}`),
      tipo: "saida",
      descricao: "Comissões SDR",
      vencimento: formatDate(28, mes),
      valor: -(2000 + mes * 100),
      status: "concluido",
      categoria: "comissoes_vendas",
      contato: "Equipe Comercial",
    });

    // Eventos e patrocínios (trimestral)
    if (mes % 3 === 0) {
      lancamentos.push({
        id: createId(`evt-${mes}`),
        tipo: "saida",
        descricao: `Evento SaaS Week - ${mes}/25`,
        vencimento: formatDate(15, mes),
        valor: -5000,
        status: "concluido",
        categoria: "eventos_patrocinios",
        contato: "Organizador Evento",
      });
    }

    // Brindes promocionais
    if (mes % 4 === 0) {
      lancamentos.push({
        id: createId(`bri-${mes}`),
        tipo: "saida",
        descricao: "Brindes promocionais",
        vencimento: formatDate(18, mes),
        valor: -(600 + mes * 50),
        status: "concluido",
        categoria: "brindes_promocionais",
        contato: "Fornecedor Brindes",
      });
    }

    // ===== DESPESAS ADMINISTRATIVAS =====
    // Software e ferramentas digitais (recorrentes)
    const softwares = [
      { nome: "Google Workspace", valor: 120 },
      { nome: "Figma", valor: 75 },
      { nome: "GitHub", valor: 45 },
      { nome: "Notion", valor: 120 },
      { nome: "Slack", valor: 95 },
    ];
    softwares.forEach((sw, idx) => {
      lancamentos.push({
        id: createId(`sw-${mes}-${idx}`),
        tipo: "recorrente",
        descricao: sw.nome,
        vencimento: formatDate(1 + idx, mes),
        valor: -sw.valor,
        status: "concluido",
        categoria: "software_ferramentas",
        contato: sw.nome.split(" ")[0],
      });
    });

    // Serviços de contabilidade
    lancamentos.push({
      id: createId(`cnt-${mes}`),
      tipo: "saida",
      descricao: "Contabilidade - Honorários",
      vencimento: formatDate(10, mes),
      valor: -650,
      status: "concluido",
      categoria: "servicos_contabilidade",
      contato: "Escritório Contábil",
    });

    // Aluguéis, condomínios e IPTU
    lancamentos.push({
      id: createId(`alg-${mes}`),
      tipo: "saida",
      descricao: `Aluguel escritório (${mes}/25)`,
      vencimento: formatDate(5, mes),
      valor: -3500,
      status: mes === 12 ? "em_aberto" : "concluido",
      categoria: "alugueis_condominio",
      contato: "Imobiliária",
    });

    // Telefonia e internet
    lancamentos.push({
      id: createId(`tel-${mes}`),
      tipo: "recorrente",
      descricao: "Internet escritório",
      vencimento: formatDate(11, mes),
      valor: -199.9,
      status: "concluido",
      categoria: "telefonia_internet",
      contato: "Operadora",
    });

    // Energia elétrica
    lancamentos.push({
      id: createId(`eng-${mes}`),
      tipo: "saida",
      descricao: `Energia elétrica escritório`,
      vencimento: formatDate(18, mes),
      valor: -(450 + mes * 10),
      status: "concluido",
      categoria: "energia_eletrica",
      contato: "Concessionária",
    });

    // Limpeza e conservação
    lancamentos.push({
      id: createId(`lmp-${mes}`),
      tipo: "recorrente",
      descricao: "Limpeza e conservação",
      vencimento: formatDate(30, mes),
      valor: -380,
      status: mes === 12 ? "em_aberto" : "concluido",
      categoria: "limpeza_conservacao",
      contato: "Prestador Limpeza",
    });

    // ===== DESPESAS COM PESSOAL =====
    // Salários e ordenados
    lancamentos.push({
      id: createId(`sal-${mes}`),
      tipo: "saida",
      descricao: "Folha - Salários",
      vencimento: formatDate(5, mes),
      valor: -(25000 + mes * 500),
      status: "concluido",
      categoria: "salarios_ordenados",
      contato: "Equipe",
    });

    // Pró-labore
    lancamentos.push({
      id: createId(`plb-${mes}`),
      tipo: "saida",
      descricao: "Pró-labore sócios",
      vencimento: formatDate(5, mes),
      valor: -8000,
      status: "concluido",
      categoria: "pro_labore",
      contato: "Diretoria",
    });

    // Encargos trabalhistas
    lancamentos.push({
      id: createId(`enc-${mes}`),
      tipo: "saida",
      descricao: "Encargos trabalhistas (GPS/FGTS)",
      vencimento: formatDate(7, mes),
      valor: -(7000 + mes * 200),
      status: "concluido",
      categoria: "encargos_trabalhistas",
      contato: "Gov",
    });

    // Férias e benefícios (semestral)
    if (mes === 6 || mes === 12) {
      lancamentos.push({
        id: createId(`fer-${mes}`),
        tipo: "saida",
        descricao: "Férias e benefícios",
        vencimento: formatDate(15, mes),
        valor: -12000,
        status: "concluido",
        categoria: "ferias_beneficios",
        contato: "Equipe",
      });
    }

    // Cursos e treinamentos (bimestral)
    if (mes % 2 === 0) {
      lancamentos.push({
        id: createId(`cur-${mes}`),
        tipo: "saida",
        descricao: "Cursos e treinamentos",
        vencimento: formatDate(20, mes),
        valor: -(1500 + mes * 100),
        status: "concluido",
        categoria: "cursos_treinamentos",
        contato: "Plataforma Treinamento",
      });
    }

    // ===== RECEITAS FINANCEIRAS =====
    // Receita de aplicações financeiras
    lancamentos.push({
      id: createId(`rfin-${mes}`),
      tipo: "entrada",
      descricao: "Receita aplicações financeiras",
      vencimento: formatDate(30, mes),
      valor: 200 + mes * 20,
      status: mes === 12 ? "em_aberto" : "concluido",
      categoria: "receita_aplicacoes",
      contato: "Banco",
    });

    // Aportes de capital (trimestral)
    if (mes % 3 === 1 && mes <= 9) {
      lancamentos.push({
        id: createId(`apt-${mes}`),
        tipo: "entrada",
        descricao: `Aporte de capital - Rodada ${Math.floor(mes / 3) + 1}`,
        vencimento: formatDate(1, mes),
        valor: 100000 + mes * 5000,
        status: "concluido",
        categoria: "aportes_capital",
        contato: "Investidores",
      });
    }

    // ===== DESPESAS FINANCEIRAS =====
    // Tarifas bancárias
    lancamentos.push({
      id: createId(`tbf-${mes}`),
      tipo: "saida",
      descricao: "Tarifas bancárias",
      vencimento: formatDate(14, mes),
      valor: -145.9,
      status: "concluido",
      categoria: "tarifas_bancarias",
      contato: "Banco",
    });

    // Outras despesas financeiras
    if (mes % 2 === 0) {
      lancamentos.push({
        id: createId(`jrs-${mes}`),
        tipo: "saida",
        descricao: "Juros antecipação de recebíveis",
        vencimento: formatDate(21, mes),
        valor: -(300 + mes * 10),
        status: "concluido",
        categoria: "outras_despesas_financeiras",
        contato: "Banco",
      });
    }

    // ===== INVESTIMENTOS =====
    // Aquisição de tecnologias (trimestral)
    if (mes % 3 === 0) {
      lancamentos.push({
        id: createId(`inv-${mes}`),
        tipo: "saida",
        descricao: "Aquisição de tecnologias",
        vencimento: formatDate(25, mes),
        valor: -(5000 + mes * 500),
        status: "concluido",
        categoria: "aquisicao_tecnologias",
        contato: "Fornecedor TI",
      });
    }

    // Pesquisa e desenvolvimento (bimestral)
    if (mes % 2 === 1) {
      lancamentos.push({
        id: createId(`pd-${mes}`),
        tipo: "saida",
        descricao: "Pesquisa e desenvolvimento",
        vencimento: formatDate(19, mes),
        valor: -(3000 + mes * 200),
        status: "concluido",
        categoria: "pesquisa_desenvolvimento",
        contato: "Fornecedor IA",
      });
    }

    // ===== IMPOSTOS SOBRE O LUCRO =====
    // CSLL e IRPJ (mensal, dia 20)
    if (mes > 1) {
      const lucroEstimado = 15000 + mes * 1000;
      lancamentos.push({
        id: createId(`csll-${mes}`),
        tipo: "saida",
        descricao: `CSLL (competência ${mes - 1}/25)`,
        vencimento: formatDate(20, mes),
        valor: -(lucroEstimado * 0.09),
        status: "concluido",
        categoria: "csll",
        contato: "SEFAZ",
      });

      lancamentos.push({
        id: createId(`irpj-${mes}`),
        tipo: "saida",
        descricao: `IRPJ (competência ${mes - 1}/25)`,
        vencimento: formatDate(20, mes),
        valor: -(lucroEstimado * 0.15),
        status: "concluido",
        categoria: "irpj",
        contato: "SEFAZ",
      });
    }
  }

  return lancamentos;
}

export const mockLancamentos: Lancamento[] = gerarLancamentos();

