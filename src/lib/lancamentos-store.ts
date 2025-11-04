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
const DATA_VERSION_KEY = "strive_lancamentos_version";
// Versão atual dos dados - incrementar quando houver mudanças significativas
const CURRENT_DATA_VERSION = "3.0.0";

// Função para calcular um hash simples dos dados iniciais (baseado na quantidade e soma dos valores)
const getDataHash = (lancamentos: Lancamento[]): string => {
  const total = lancamentos.length;
  const somaValores = lancamentos.reduce((sum, l) => sum + Math.abs(l.valor), 0);
  return `${total}-${Math.round(somaValores)}`;
};

// Função para verificar se os dados precisam ser atualizados
const shouldUpdateData = (): boolean => {
  try {
    const storedVersion = localStorage.getItem(DATA_VERSION_KEY);
    const storedHash = localStorage.getItem("strive_lancamentos_hash");
    const currentHash = getDataHash(lancamentosIniciais);
    
    // Se não há versão salva, ou a versão é diferente, ou o hash mudou, precisa atualizar
    if (!storedVersion || storedVersion !== CURRENT_DATA_VERSION) {
      return true;
    }
    
    if (!storedHash || storedHash !== currentHash) {
      return true;
    }
    
    return false;
  } catch {
    return true;
  }
};

// Função para carregar lançamentos do localStorage ou retornar os dados iniciais
export const loadLancamentos = (): Lancamento[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    // Verifica se precisa atualizar os dados iniciais
    if (shouldUpdateData()) {
      console.log("Atualizando dados iniciais com novos lançamentos...");
      
      let lancamentosExistentes: Lancamento[] = [];
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Filtra apenas lançamentos de 2025
          lancamentosExistentes = parsed.filter((l: Lancamento) => {
            const [d, m, y] = l.vencimento.split("/").map(Number);
            return d && m && y && y === 2025;
          });
        } catch {
          lancamentosExistentes = [];
        }
      }
      
      // Identifica quais lançamentos são dos dados iniciais (IDs gerados automaticamente)
      // e quais foram criados manualmente pelo usuário
      const idsIniciais = new Set(lancamentosIniciais.map(l => l.id));
      
      // Mantém apenas os lançamentos criados manualmente (não estão nos dados iniciais)
      const lancamentosPersonalizados = lancamentosExistentes.filter(
        (l: Lancamento) => !idsIniciais.has(l.id)
      );
      
      // Combina: novos dados iniciais + lançamentos personalizados do usuário
      const lancamentosAtualizados = [...lancamentosIniciais, ...lancamentosPersonalizados];
      
      // Salva os dados atualizados
      saveLancamentos(lancamentosAtualizados);
      // Atualiza a versão e o hash
      localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
      localStorage.setItem("strive_lancamentos_hash", getDataHash(lancamentosIniciais));
      
      return lancamentosAtualizados;
    }
    
    // Se não precisa atualizar, retorna os dados salvos normalmente
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
    localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
    localStorage.setItem("strive_lancamentos_hash", getDataHash(lancamentosIniciais));
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
    // Atualiza o hash quando salva
    localStorage.setItem("strive_lancamentos_hash", getDataHash(lancamentos));
  } catch (error) {
    console.error("Erro ao salvar lançamentos no localStorage:", error);
  }
};

// Função para forçar reset aos dados iniciais (útil para desenvolvimento/testes)
export const resetToInitialData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DATA_VERSION_KEY);
  localStorage.removeItem("strive_lancamentos_hash");
  saveLancamentos(lancamentosIniciais);
  localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION);
  localStorage.setItem("strive_lancamentos_hash", getDataHash(lancamentosIniciais));
  window.dispatchEvent(new CustomEvent("lancamentos-updated"));
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
