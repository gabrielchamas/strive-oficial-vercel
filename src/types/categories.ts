export interface Category {
  value: string;
  label: string;
  subcategories?: Category[];
}

export const CATEGORIAS_SAIDAS: Category[] = [
  {
    value: "custos_despesas_diretas",
    label: "Custos e despesas diretas",
    subcategories: [
      { value: "custo_mercadorias_vendidas", label: "Custo de mercadorias vendidas" },
      { value: "custo_servicos_prestados", label: "Custo dos serviços prestados" },
      { value: "impostos_sobre_vendas", label: "Impostos sobre vendas" },
      { value: "logistica_vendas", label: "Logística de vendas" },
      { value: "taxas_sobre_vendas", label: "Taxas sobre vendas" },
      { value: "outras_despesas_diretas", label: "Outras despesas diretas" },
    ],
  },
  {
    value: "despesas_venda_marketing",
    label: "Despesas de venda e marketing",
    subcategories: [
      { value: "marketing_publicidade", label: "Marketing e publicidade" },
      { value: "descontos_comerciais", label: "Descontos comerciais e promoções" },
      { value: "comissoes_vendas", label: "Comissões sobre vendas" },
      { value: "brindes_promocionais", label: "Brindes promocionais" },
      { value: "publicidade_anuncios", label: "Publicidade e anúncios" },
      { value: "eventos_patrocinios", label: "Eventos e patrocínios" },
      { value: "viagens_deslocamentos", label: "Viagens e deslocamentos" },
      { value: "pesquisa_mercado", label: "Pesquisa de mercado" },
      { value: "outras_despesas_venda_marketing", label: "Outras despesas de venda e marketing" },
    ],
  },
  {
    value: "despesas_administrativas",
    label: "Despesas administrativas",
    subcategories: [
      { value: "agua_esgoto", label: "Água e esgoto" },
      { value: "alugueis_condominio", label: "Aluguéis, condomínios e IPTU" },
      { value: "servicos_contabilidade", label: "Serviços de contabilidade" },
      { value: "assessorias_consultorias", label: "Assessorias e consultorias" },
      { value: "servicos_juridicos", label: "Serviços jurídicos" },
      { value: "documentacao_registros", label: "Documentação e registros" },
      { value: "energia_eletrica", label: "Energia elétrica" },
      { value: "entidades_associacoes", label: "Entidades e associações" },
      { value: "lanches_refeicoes", label: "Lanches e refeições" },
      { value: "limpeza_conservacao", label: "Limpeza e conservação" },
      { value: "manutencao_equipamentos", label: "Manutenção de equipamentos" },
      { value: "material_escritorio", label: "Material de escritório" },
      { value: "servicos_terceirizados", label: "Serviços terceirizados" },
      { value: "seguranca_patrimonial", label: "Segurança patrimonial" },
      { value: "software_ferramentas", label: "Software e ferramentas digitais" },
      { value: "taxas_licencas", label: "Taxas e licenças" },
      { value: "telefonia_internet", label: "Telefonia e internet" },
      { value: "transporte_combustiveis", label: "Transporte e combustíveis" },
      { value: "outras_despesas_administrativas", label: "Outras despesas administrativas" },
    ],
  },
  {
    value: "despesas_pessoal",
    label: "Despesas de pessoal",
    subcategories: [
      { value: "salarios_ordenados", label: "Salários e ordenados" },
      { value: "pro_labore", label: "Pró-labore" },
      { value: "ferias_beneficios", label: "Férias e benefícios" },
      { value: "encargos_trabalhistas", label: "Encargos trabalhistas" },
      { value: "cursos_treinamentos", label: "Cursos e treinamentos" },
      { value: "recrutamento_selecao", label: "Recrutamento e seleção" },
      { value: "outras_despesas_pessoal", label: "Outras despesas com pessoal" },
    ],
  },
  {
    value: "despesas_financeiras",
    label: "Despesas financeiras",
    subcategories: [
      { value: "multas_juros_pagos", label: "Multas e juros pagos" },
      { value: "descontos_concedidos", label: "Descontos concedidos" },
      { value: "tarifas_bancarias", label: "Tarifas bancárias" },
      { value: "transferencia_interna_saida", label: "Transferência interna de saída (Oculta)" },
      { value: "faturas_cartao_credito", label: "Faturas de cartão de crédito (Oculta)" },
      { value: "outras_despesas_financeiras", label: "Outras despesas financeiras" },
    ],
  },
  {
    value: "investimentos",
    label: "Investimentos",
    subcategories: [
      { value: "amortizacao_emprestimos", label: "Amortização de empréstimos" },
      { value: "aquisicao_tecnologias", label: "Aquisição de tecnologias" },
      { value: "pesquisa_desenvolvimento", label: "Pesquisa e desenvolvimento" },
      { value: "moveis_utensilios", label: "Móveis e utensílios" },
      { value: "obras_reformas", label: "Obras, reformas e benfeitorias" },
      { value: "aquisicao_ativos", label: "Aquisição de ativos" },
      { value: "outros_investimentos", label: "Outros investimentos" },
    ],
  },
  {
    value: "impostos_lucro",
    label: "Impostos sobre o lucro",
    subcategories: [
      { value: "csll", label: "CSLL" },
      { value: "irpj", label: "IRPJ" },
    ],
  },
];

export const CATEGORIAS_ENTRADAS: Category[] = [
  {
    value: "receitas_operacionais",
    label: "Receitas operacionais",
    subcategories: [
      { value: "venda_produtos", label: "Venda de produtos" },
      { value: "venda_servicos", label: "Venda de serviços" },
      { value: "outras_receitas_operacionais", label: "Outras receitas operacionais" },
    ],
  },
  {
    value: "receitas_financeiras",
    label: "Receitas financeiras",
    subcategories: [
      { value: "emprestimos_captados", label: "Empréstimos captados" },
      { value: "receita_aplicacoes", label: "Receita de aplicações financeiras" },
      { value: "aportes_capital", label: "Aportes de capital" },
      { value: "multas_juros_recebidos", label: "Multas e juros recebidos" },
      { value: "descontos_obtidos", label: "Descontos obtidos" },
      { value: "transferencia_interna_entrada", label: "Transferência interna de entrada (Oculta)" },
      { value: "outras_receitas_financeiras", label: "Outras receitas financeiras" },
    ],
  },
  {
    value: "outras_receitas",
    label: "Outras receitas",
    subcategories: [
      { value: "reembolso_despesas", label: "Reembolso de despesas" },
      { value: "venda_ativos", label: "Venda de ativos imobilizados" },
      { value: "outras_receitas_diversas", label: "Outras receitas diversas" },
    ],
  },
];

export const getAllCategories = (tipo: "entrada" | "saida"): string[] => {
  const categories = tipo === "entrada" ? CATEGORIAS_ENTRADAS : CATEGORIAS_SAIDAS;
  const result: string[] = [];
  
  categories.forEach(cat => {
    if (cat.subcategories) {
      cat.subcategories.forEach(sub => {
        result.push(sub.label);
      });
    } else {
      result.push(cat.label);
    }
  });
  
  return result;
};

export const getCategoryLabel = (value: string, tipo: "entrada" | "saida"): string => {
  const categories = tipo === "entrada" ? CATEGORIAS_ENTRADAS : CATEGORIAS_SAIDAS;
  
  for (const cat of categories) {
    if (cat.subcategories) {
      const found = cat.subcategories.find(sub => sub.value === value);
      if (found) return found.label;
    } else if (cat.value === value) {
      return cat.label;
    }
  }
  
  return value;
};
