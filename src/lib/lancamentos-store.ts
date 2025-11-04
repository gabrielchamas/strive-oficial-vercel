import { mockLancamentos as lancamentosIniciais } from "@/pages/lancamentos-data";

export interface Lancamento {
  id: string;
  tipo: "entrada" | "saida" | "padrao" | "parcelado" | "recorrente";
  descricao: string;
  vencimento: string;
  valor: number;
  status: "concluido" | "em_aberto";
  categoria: string;
  contato: string;
  parcela?: string;
  numeroParcelas?: number;
  frequencia?: string;
  diaRepeticao?: number;
  conclusaoAutomatica?: boolean;
  apenasDiasUteis?: boolean;
  atrasado?: boolean;
}

const STORAGE_KEY = "strive_lancamentos";

// Função para carregar lançamentos do localStorage ou retornar os dados iniciais
export const loadLancamentos = (): Lancamento[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const lancamentos = JSON.parse(stored);
      // Filtra apenas lançamentos de 2025 para garantir consistência
      const lancamentos2025 = lancamentos.filter((l: Lancamento) => {
        const [d, m, y] = l.vencimento.split("/").map(Number);
        return d && m && y && y === 2025;
      });
      // Se houver lançamentos filtrados (ou seja, removidos), salva novamente
      if (lancamentos2025.length !== lancamentos.length) {
        console.warn(`Removidos ${lancamentos.length - lancamentos2025.length} lançamentos que não são de 2025`);
        saveLancamentos(lancamentos2025);
      }
      return lancamentos2025;
    }
    // Se não há dados salvos, inicializa com os dados mock e salva
    saveLancamentos(lancamentosIniciais);
    return lancamentosIniciais;
  } catch (error) {
    console.error("Erro ao carregar lançamentos do localStorage:", error);
    return lancamentosIniciais;
  }
};

// Função para salvar lançamentos no localStorage
export const saveLancamentos = (lancamentos: Lancamento[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lancamentos));
  } catch (error) {
    console.error("Erro ao salvar lançamentos no localStorage:", error);
  }
};

// Função para adicionar um novo lançamento
export const addLancamento = (lancamento: Lancamento): void => {
  // Validação: garantir que o lançamento seja de 2025
  const [d, m, y] = lancamento.vencimento.split("/").map(Number);
  if (!d || !m || !y || y !== 2025) {
    console.error(`Erro: Lançamento deve ser do ano 2025. Recebido: ${lancamento.vencimento}`);
    throw new Error("Apenas lançamentos do ano de 2025 são permitidos");
  }

  const lancamentos = loadLancamentos();
  const novosLancamentos = [lancamento, ...lancamentos];
  saveLancamentos(novosLancamentos);
  
  // Dispara evento customizado para atualizar componentes na mesma aba
  window.dispatchEvent(new CustomEvent("lancamentos-updated"));
};

// Função para obter todos os lançamentos (atualizados)
export const getAllLancamentos = (): Lancamento[] => {
  return loadLancamentos();
};
