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
const clientesAdicionais = ["InnovativeTech", "GlobalSolutions", "TechLeaders", "DigitalMinds", "FutureSystems", "SmartStart", "GlobalInnovations", "TechVision", "InnovativeSolutions", "DigitalLeaders"];
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
    // MRR recorrente (todos os meses, dia 5) - AUMENTADO de 8 para 12 clientes
    [...clientes.slice(0, 8), ...clientesAdicionais.slice(0, 4)].forEach((cliente, idx) => {
      const planoKeys = Object.keys(planos);
      const plano = planoKeys[idx % planoKeys.length] as keyof typeof planos;
      // Meses mais avançados têm mais clientes Enterprise
      const planoIndex = mes >= 6 ? Math.min(idx % planoKeys.length + 1, planoKeys.length - 1) : idx % planoKeys.length;
      const planoFinal = planoKeys[planoIndex] as keyof typeof planos;
      lancamentos.push({
        id: createId(`rec-${mes}`),
        tipo: "recorrente",
        descricao: `MRR - ${cliente} (Plano ${planoFinal})`,
        vencimento: formatDate(5, mes),
        valor: planos[planoFinal],
        status: "concluido",
        categoria: "venda_servicos",
        contato: cliente,
      });
    });

    // MRR adicional - mais clientes Enterprise (a partir do mês 2)
    if (mes >= 2) {
      for (let i = 0; i < 6; i++) {
        const clienteIdx = (mes * 2 + i) % clientesAdicionais.length;
        const cliente = clientesAdicionais[clienteIdx];
        // Mais clientes Enterprise conforme avança o ano
        const planoIdx = mes >= 6 ? 3 : (mes >= 4 ? 2 : 1);
        const plano = Object.keys(planos)[planoIdx] as keyof typeof planos;
        lancamentos.push({
          id: createId(`rec2-${mes}-${i}`),
          tipo: "recorrente",
          descricao: `MRR - ${cliente} (Plano ${plano})`,
          vencimento: formatDate(6 + i, mes),
          valor: planos[plano],
          status: "concluido",
          categoria: "venda_servicos",
          contato: cliente,
        });
      }
    }

    // Novos clientes (distribuídos ao longo do mês) - AUMENTADO
    // Primeiro semestre: 5 novos clientes por mês
    // Segundo semestre: 4 novos clientes por mês
    const novosClientesPorMes = mes <= 6 ? 5 : 4;
    for (let i = 0; i < novosClientesPorMes; i++) {
      const clienteIdx = (mes * novosClientesPorMes + i) % clientesAdicionais.length;
      const cliente = clientesAdicionais[clienteIdx] || clientes[i % clientes.length];
      const planoKeys = Object.keys(planos);
      // Tendência de planos maiores ao longo do ano
      const planoIdx = mes >= 6 ? Math.min(i % planoKeys.length + 1, planoKeys.length - 1) : i % planoKeys.length;
      const plano = planoKeys[planoIdx] as keyof typeof planos;
      lancamentos.push({
        id: createId(`nov-${mes}`),
        tipo: "entrada",
        descricao: `Onboarding - ${cliente} (Plano ${plano})`,
        vencimento: formatDate(8 + i * 4, mes),
        valor: planos[plano],
        status: "concluido",
        categoria: "venda_servicos",
        contato: cliente,
      });
    }

    // Upgrade de plano - AUMENTADO para mais frequente
    if (mes % 2 === 0 || mes % 3 === 0) {
      const cliente = [...clientes, ...clientesAdicionais][mes % (clientes.length + clientesAdicionais.length)];
      lancamentos.push({
        id: createId(`upg-${mes}`),
        tipo: "entrada",
        descricao: `Upgrade de plano - ${cliente}`,
        vencimento: formatDate(12, mes),
        valor: 1200 + mes * 150,
        status: "concluido",
        categoria: "venda_servicos",
        contato: cliente,
      });
    }

    // Upgrades adicionais mensais (a partir do mês 2)
    if (mes >= 2) {
      for (let i = 0; i < 3; i++) {
        const cliente = clientes[(mes + i) % clientes.length];
        lancamentos.push({
          id: createId(`upg2-${mes}-${i}`),
          tipo: "entrada",
          descricao: `Upgrade de plano - ${cliente}`,
          vencimento: formatDate(10 + i * 3, mes),
          valor: 1500 + mes * 200 + i * 300,
          status: "concluido",
          categoria: "venda_servicos",
          contato: cliente,
        });
      }
    }

    // Serviços adicionais (consultoria, treinamento) - AUMENTADO
    // Agora mensal com valores maiores
    for (let i = 0; i < 2; i++) {
      const cliente = clientes[(mes + i) % clientes.length];
      lancamentos.push({
        id: createId(`svc-${mes}-${i}`),
        tipo: "entrada",
        descricao: `Serviço adicional - Consultoria ${cliente} (${8 + i * 4}h)`,
        vencimento: formatDate(15 + i * 5, mes),
        valor: 1500 + mes * 100 + i * 500,
        status: "concluido",
        categoria: "venda_servicos",
        contato: cliente,
      });
    }

    // Serviços premium mensais (a partir do mês 2)
    if (mes >= 2) {
      for (let i = 0; i < 4; i++) {
        const cliente = clientesAdicionais[(mes + i) % clientesAdicionais.length];
        lancamentos.push({
          id: createId(`svc-prem-${mes}-${i}`),
          tipo: "entrada",
          descricao: `Serviço premium - Consultoria estratégica ${cliente} (${12 + i * 4}h)`,
          vencimento: formatDate(14 + i * 4, mes),
          valor: 3500 + mes * 250 + i * 800,
          status: "concluido",
          categoria: "venda_servicos",
          contato: cliente,
        });
      }
    }

    // Treinamentos especializados (bimestral, valores maiores)
    if (mes % 2 === 0) {
      lancamentos.push({
        id: createId(`trn-${mes}`),
        tipo: "entrada",
        descricao: `Treinamento especializado - ${clientes[mes % clientes.length]}`,
        vencimento: formatDate(22, mes),
        valor: 3500 + mes * 200,
        status: "concluido",
        categoria: "venda_servicos",
        contato: clientes[mes % clientes.length],
      });
    }

    // Treinamentos corporativos mensais (a partir do mês 2)
    if (mes >= 2) {
      for (let i = 0; i < 2; i++) {
        const cliente = clientesAdicionais[(mes + i * 2) % clientesAdicionais.length];
        lancamentos.push({
          id: createId(`trn-corp-${mes}-${i}`),
          tipo: "entrada",
          descricao: `Treinamento corporativo - ${cliente}`,
          vencimento: formatDate(18 + i * 5, mes),
          valor: 5500 + mes * 300 + i * 1000,
          status: "concluido",
          categoria: "venda_servicos",
          contato: cliente,
        });
      }
    }

    // Novos produtos/serviços (trimestral)
    if (mes % 3 === 0) {
      lancamentos.push({
        id: createId(`prod-${mes}`),
        tipo: "entrada",
        descricao: `Venda de produto adicional - Licenças Enterprise`,
        vencimento: formatDate(18, mes),
        valor: 8000 + mes * 1000,
        status: "concluido",
        categoria: "venda_produtos",
        contato: "Vendas Diretas",
      });
    }

    // Vendas de produtos mensais (a partir do mês 2)
    if (mes >= 2) {
      for (let i = 0; i < 3; i++) {
        lancamentos.push({
          id: createId(`prod-mensal-${mes}-${i}`),
          tipo: "entrada",
          descricao: `Venda de licenças adicionais - Cliente ${clientesAdicionais[(mes + i) % clientesAdicionais.length]}`,
          vencimento: formatDate(16 + i * 4, mes),
          valor: 4500 + mes * 400 + i * 1500,
          status: "concluido",
          categoria: "venda_produtos",
          contato: clientesAdicionais[(mes + i) % clientesAdicionais.length],
        });
      }
    }

    // Parcerias e comissões recebidas (mensal a partir do mês 3)
    if (mes >= 3) {
      lancamentos.push({
        id: createId(`parc-${mes}`),
        tipo: "entrada",
        descricao: `Comissões de parcerias estratégicas`,
        vencimento: formatDate(25, mes),
        valor: 2500 + mes * 300,
        status: "concluido",
        categoria: "outras_receitas_operacionais",
        contato: "Parceiros",
      });
    }

    // Parcerias adicionais (a partir do mês 2)
    if (mes >= 2) {
      for (let i = 0; i < 2; i++) {
        lancamentos.push({
          id: createId(`parc2-${mes}-${i}`),
          tipo: "entrada",
          descricao: `Receita de parcerias - ${["Revendas", "Integrações"][i]}`,
          vencimento: formatDate(23 + i * 2, mes),
          valor: 4000 + mes * 500 + i * 2000,
          status: "concluido",
          categoria: "outras_receitas_operacionais",
          contato: "Parceiros Estratégicos",
        });
      }
    }

    // Contratos de suporte premium (mensal a partir do mês 2)
    if (mes >= 2) {
      for (let i = 0; i < 5; i++) {
        const cliente = clientesAdicionais[(mes + i) % clientesAdicionais.length];
        lancamentos.push({
          id: createId(`sup-prem-${mes}-${i}`),
          tipo: "entrada",
          descricao: `Suporte premium - ${cliente}`,
          vencimento: formatDate(5 + i * 5, mes),
          valor: 2200 + mes * 200 + i * 500,
          status: "concluido",
          categoria: "venda_servicos",
          contato: cliente,
        });
      }
    }

    // Implementação e setup de projetos (mensal)
    if (mes >= 2) {
      for (let i = 0; i < 2; i++) {
        const cliente = clientes[(mes + i) % clientes.length];
        lancamentos.push({
          id: createId(`impl-${mes}-${i}`),
          tipo: "entrada",
          descricao: `Implementação projeto - ${cliente}`,
          vencimento: formatDate(11 + i * 7, mes),
          valor: 8500 + mes * 600 + i * 3000,
          status: "concluido",
          categoria: "venda_servicos",
          contato: cliente,
        });
      }
    }

    // Receitas extras para o primeiro mês garantir lucratividade desde o início
    if (mes === 1) {
      // Contratos iniciais de suporte
      for (let i = 0; i < 5; i++) {
        const cliente = clientesAdicionais[i % clientesAdicionais.length];
        lancamentos.push({
          id: createId(`sup-init-${i}`),
          tipo: "entrada",
          descricao: `Suporte premium - ${cliente}`,
          vencimento: formatDate(7 + i * 5, mes),
          valor: 2400 + i * 500,
          status: "concluido",
          categoria: "venda_servicos",
          contato: cliente,
        });
      }
      
      // Implementações iniciais
      for (let i = 0; i < 2; i++) {
        const cliente = clientes[i % clientes.length];
        lancamentos.push({
          id: createId(`impl-init-${i}`),
          tipo: "entrada",
          descricao: `Implementação projeto - ${cliente}`,
          vencimento: formatDate(15 + i * 7, mes),
          valor: 9000 + i * 3000,
          status: "concluido",
          categoria: "venda_servicos",
          contato: cliente,
        });
      }
      
      // Serviços premium iniciais
      for (let i = 0; i < 4; i++) {
        const cliente = clientesAdicionais[i % clientesAdicionais.length];
        lancamentos.push({
          id: createId(`svc-init-${i}`),
          tipo: "entrada",
          descricao: `Serviço premium - Consultoria estratégica ${cliente}`,
          vencimento: formatDate(12 + i * 4, mes),
          valor: 3750 + i * 800,
          status: "concluido",
          categoria: "venda_servicos",
          contato: cliente,
        });
      }
      
      // Treinamentos iniciais
      for (let i = 0; i < 2; i++) {
        const cliente = clientesAdicionais[i % clientesAdicionais.length];
        lancamentos.push({
          id: createId(`trn-init-${i}`),
          tipo: "entrada",
          descricao: `Treinamento corporativo - ${cliente}`,
          vencimento: formatDate(20 + i * 5, mes),
          valor: 5800 + i * 1000,
          status: "concluido",
          categoria: "venda_servicos",
          contato: cliente,
        });
      }
      
      // Vendas de produtos iniciais
      for (let i = 0; i < 3; i++) {
        lancamentos.push({
          id: createId(`prod-init-${i}`),
          tipo: "entrada",
          descricao: `Venda de licenças adicionais - Cliente ${clientesAdicionais[i % clientesAdicionais.length]}`,
          vencimento: formatDate(18 + i * 4, mes),
          valor: 4900 + i * 1500,
          status: "concluido",
          categoria: "venda_produtos",
          contato: clientesAdicionais[i % clientesAdicionais.length],
        });
      }
      
      // Parcerias iniciais
      for (let i = 0; i < 2; i++) {
        lancamentos.push({
          id: createId(`parc-init-${i}`),
          tipo: "entrada",
          descricao: `Receita de parcerias - ${["Revendas", "Integrações"][i]}`,
          vencimento: formatDate(25 + i * 2, mes),
          valor: 4500 + i * 2000,
          status: "concluido",
          categoria: "outras_receitas_operacionais",
          contato: "Parceiros Estratégicos",
        });
      }
      
      // Upgrades iniciais
      for (let i = 0; i < 3; i++) {
        const cliente = clientes[i % clientes.length];
        lancamentos.push({
          id: createId(`upg-init-${i}`),
          tipo: "entrada",
          descricao: `Upgrade de plano - ${cliente}`,
          vencimento: formatDate(10 + i * 3, mes),
          valor: 1700 + i * 300,
          status: "concluido",
          categoria: "venda_servicos",
          contato: cliente,
        });
      }
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
    // Receita de aplicações financeiras - AUMENTADO
    lancamentos.push({
      id: createId(`rfin-${mes}`),
      tipo: "entrada",
      descricao: "Receita aplicações financeiras",
      vencimento: formatDate(30, mes),
      valor: 800 + mes * 150,
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

    // Receitas financeiras adicionais (juros recebidos, descontos obtidos)
    // Mensal desde o primeiro mês
    lancamentos.push({
      id: createId(`jrs-rec-${mes}`),
      tipo: "entrada",
      descricao: "Juros e rendimentos de aplicações",
      vencimento: formatDate(28, mes),
      valor: mes === 1 ? 1400 : 1200 + mes * 200,
      status: "concluido",
      categoria: "outras_receitas_financeiras",
      contato: "Banco",
    });

    // Reembolsos e outras receitas (mensal desde o primeiro mês)
    lancamentos.push({
      id: createId(`remb-${mes}`),
      tipo: "entrada",
      descricao: "Reembolso de despesas e ajustes",
      vencimento: formatDate(27, mes),
      valor: mes === 1 ? 1750 : 1500 + mes * 250,
      status: "concluido",
      categoria: "reembolso_despesas",
      contato: "Fornecedores",
    });

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
    // Lucro estimado ajustado para refletir as novas receitas significativas
    if (mes > 1) {
      // Lucro crescente ao longo do ano devido ao aumento de receitas
      const lucroEstimado = mes <= 3 ? 30000 + mes * 5000 : (mes <= 6 ? 50000 + mes * 3000 : 80000 + mes * 4000);
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

