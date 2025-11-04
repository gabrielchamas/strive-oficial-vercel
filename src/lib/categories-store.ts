import { CATEGORIAS_ENTRADAS, CATEGORIAS_SAIDAS, type Category } from "@/types/categories";

export interface CustomCategory {
  id: string;
  value: string;
  label: string;
  tipo: "entrada" | "saida";
  parentCategory?: string; // ID da categoria pai, se for subcategoria
  isCustom: boolean;
}

const STORAGE_KEY = "strive_custom_categories";

// Carrega categorias customizadas do localStorage
export const loadCustomCategories = (): CustomCategory[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error("Erro ao carregar categorias customizadas:", error);
    return [];
  }
};

// Salva categorias customizadas no localStorage
export const saveCustomCategories = (categories: CustomCategory[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent("categories-updated"));
  } catch (error) {
    console.error("Erro ao salvar categorias customizadas:", error);
  }
};

// Adiciona uma nova categoria customizada
export const addCustomCategory = (category: Omit<CustomCategory, "id" | "isCustom">): void => {
  const categories = loadCustomCategories();
  const newCategory: CustomCategory = {
    ...category,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    isCustom: true,
  };
  
  // Verifica se já existe categoria com o mesmo value e tipo
  const exists = categories.some(
    (c) => c.value === category.value && c.tipo === category.tipo
  );
  
  if (exists) {
    throw new Error("Já existe uma categoria com esse valor e tipo");
  }
  
  saveCustomCategories([...categories, newCategory]);
};

// Atualiza uma categoria customizada
export const updateCustomCategory = (id: string, updates: Partial<Omit<CustomCategory, "id" | "isCustom">>): void => {
  const categories = loadCustomCategories();
  const updated = categories.map((cat) =>
    cat.id === id ? { ...cat, ...updates } : cat
  );
  
  // Verifica duplicatas (exceto a própria categoria sendo editada)
  const duplicate = updated.find(
    (c, index) =>
      updated.findIndex(
        (other) => other.value === c.value && other.tipo === c.tipo && other.id !== c.id
      ) !== -1
  );
  
  if (duplicate) {
    throw new Error("Já existe outra categoria com esse valor e tipo");
  }
  
  saveCustomCategories(updated);
};

// Remove uma categoria customizada
export const removeCustomCategory = (id: string): void => {
  const categories = loadCustomCategories();
  saveCustomCategories(categories.filter((cat) => cat.id !== id));
};

// Obtém todas as categorias (padrão + customizadas)
export const getAllCategoriesWithCustom = (tipo: "entrada" | "saida"): Category[] => {
  const baseCategories = tipo === "entrada" ? CATEGORIAS_ENTRADAS : CATEGORIAS_SAIDAS;
  const customCategories = loadCustomCategories().filter((c) => c.tipo === tipo);
  
  // Converte categorias customizadas para o formato Category
  const customCategoriesFormatted: Category[] = customCategories
    .filter((c) => !c.parentCategory) // Apenas categorias principais (sem pai)
    .map((c) => {
      const subcategories = customCategories
        .filter((sub) => sub.parentCategory === c.id)
        .map((sub) => ({
          value: sub.value,
          label: sub.label,
        }));
      
      return {
        value: c.value,
        label: c.label,
        ...(subcategories.length > 0 && { subcategories }),
      };
    });
  
  // Adiciona subcategorias customizadas às categorias padrão que correspondem
  const merged = baseCategories.map((cat) => {
    const customSubs = customCategories
      .filter((c) => c.parentCategory && customCategories.find((p) => p.id === c.parentCategory)?.value === cat.value)
      .map((c) => ({
        value: c.value,
        label: c.label,
      }));
    
    if (customSubs.length > 0) {
      return {
        ...cat,
        subcategories: [...(cat.subcategories || []), ...customSubs],
      };
    }
    return cat;
  });
  
  return [...merged, ...customCategoriesFormatted];
};

// Obtém todas as subcategorias (padrão + customizadas) como array simples
export const getAllSubcategories = (tipo: "entrada" | "saida"): Array<{ value: string; label: string; isCustom: boolean }> => {
  const baseCategories = tipo === "entrada" ? CATEGORIAS_ENTRADAS : CATEGORIAS_SAIDAS;
  const customCategories = loadCustomCategories().filter((c) => c.tipo === tipo);
  
  const result: Array<{ value: string; label: string; isCustom: boolean }> = [];
  
  // Adiciona subcategorias padrão
  baseCategories.forEach((cat) => {
    if (cat.subcategories) {
      cat.subcategories.forEach((sub) => {
        result.push({ value: sub.value, label: sub.label, isCustom: false });
      });
    }
  });
  
  // Adiciona categorias customizadas (como subcategorias, pois são o nível final)
  customCategories.forEach((cat) => {
    if (!cat.parentCategory) {
      // Se não tem pai, adiciona como subcategoria direta
      result.push({ value: cat.value, label: cat.label, isCustom: true });
    } else {
      // Se tem pai, adiciona como subcategoria
      result.push({ value: cat.value, label: cat.label, isCustom: true });
    }
  });
  
  return result;
};
