import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, Edit, Trash2, ArrowDown, ArrowUp, Tag, Save, X 
} from "lucide-react";
import { toast } from "sonner";
import {
  loadCustomCategories,
  addCustomCategory,
  updateCustomCategory,
  removeCustomCategory,
  type CustomCategory,
} from "@/lib/categories-store";
import { CATEGORIAS_ENTRADAS, CATEGORIAS_SAIDAS } from "@/types/categories";

const Categorias = () => {
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [tipoAtivo, setTipoAtivo] = useState<"entrada" | "saida">("entrada");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<CustomCategory | null>(null);
  const [formLabel, setFormLabel] = useState("");
  const [formValue, setFormValue] = useState("");

  // Carrega categorias customizadas
  const loadCategories = () => {
    setCustomCategories(loadCustomCategories());
  };

  useEffect(() => {
    loadCategories();

    // Listener para mudanças nas categorias
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "strive_custom_categories") {
        loadCategories();
      }
    };

    const handleCustomEvent = () => {
      loadCategories();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("categories-updated", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("categories-updated", handleCustomEvent);
    };
  }, []);

  // Filtra categorias por tipo
  const categoriasFiltradas = customCategories.filter((cat) => cat.tipo === tipoAtivo);

  // Abre dialog para adicionar nova categoria
  const handleAdd = () => {
    setEditingCategory(null);
    setFormLabel("");
    setFormValue("");
    setDialogOpen(true);
  };

  // Abre dialog para editar categoria
  const handleEdit = (category: CustomCategory) => {
    setEditingCategory(category);
    setFormLabel(category.label);
    setFormValue(category.value);
    setDialogOpen(true);
  };

  // Salva categoria (adiciona ou atualiza)
  const handleSave = () => {
    if (!formLabel.trim() || !formValue.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    // Normaliza o value (sem espaços, em minúsculas, com underscores)
    const normalizedValue = formValue
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");

    if (!normalizedValue) {
      toast.error("O valor da categoria deve conter apenas letras, números e underscores");
      return;
    }

    try {
      if (editingCategory) {
        // Atualiza categoria existente
        updateCustomCategory(editingCategory.id, {
          label: formLabel.trim(),
          value: normalizedValue,
          tipo: tipoAtivo,
        });
        toast.success("Categoria atualizada com sucesso!");
      } else {
        // Adiciona nova categoria
        addCustomCategory({
          label: formLabel.trim(),
          value: normalizedValue,
          tipo: tipoAtivo,
        });
        toast.success("Categoria adicionada com sucesso!");
      }
      setDialogOpen(false);
      loadCategories();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar categoria");
    }
  };

  // Abre dialog de confirmação para deletar
  const handleDeleteClick = (category: CustomCategory) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  // Confirma e deleta categoria
  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      removeCustomCategory(categoryToDelete.id);
      toast.success("Categoria removida com sucesso!");
      setCategoryToDelete(null);
      setDeleteDialogOpen(false);
      loadCategories();
    }
  };

  // Obtém todas as categorias padrão para exibir
  const getCategoriasPadrao = (tipo: "entrada" | "saida") => {
    return tipo === "entrada" ? CATEGORIAS_ENTRADAS : CATEGORIAS_SAIDAS;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
            <p className="text-muted-foreground">
              Gerencie as categorias de entradas e saídas
            </p>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Categoria
          </Button>
        </div>

        {/* Tabs para Entradas e Saídas */}
        <Tabs value={tipoAtivo} onValueChange={(v) => setTipoAtivo(v as "entrada" | "saida")}>
          <TabsList>
            <TabsTrigger value="entrada" className="gap-2">
              <ArrowUp className="h-4 w-4" />
              Entradas
            </TabsTrigger>
            <TabsTrigger value="saida" className="gap-2">
              <ArrowDown className="h-4 w-4" />
              Saídas
            </TabsTrigger>
          </TabsList>

          {/* Tab Entradas */}
          <TabsContent value="entrada" className="space-y-4">
            {/* Categorias Padrão */}
            <Card>
              <CardHeader>
                <CardTitle>Categorias Padrão</CardTitle>
                <CardDescription>
                  Categorias pré-definidas do sistema (não podem ser editadas)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getCategoriasPadrao("entrada").map((category) => (
                    <div key={category.value} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{category.label}</span>
                          <Badge variant="outline" className="text-xs">
                            Padrão
                          </Badge>
                        </div>
                      </div>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="mt-2 ml-6 space-y-1">
                          {category.subcategories.map((sub) => (
                            <div key={sub.value} className="text-sm text-muted-foreground">
                              • {sub.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categorias Customizadas */}
            <Card>
              <CardHeader>
                <CardTitle>Categorias Customizadas</CardTitle>
                <CardDescription>
                  Suas categorias personalizadas (podem ser editadas ou removidas)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {categoriasFiltradas.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Tag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma categoria customizada</p>
                    <p className="text-sm">Clique em "Adicionar Categoria" para criar uma nova</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categoriasFiltradas.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Tag className="h-4 w-4 text-primary" />
                          <div>
                            <div className="font-medium">{category.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {category.value}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Customizada
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(category)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(category)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Saídas */}
          <TabsContent value="saida" className="space-y-4">
            {/* Categorias Padrão */}
            <Card>
              <CardHeader>
                <CardTitle>Categorias Padrão</CardTitle>
                <CardDescription>
                  Categorias pré-definidas do sistema (não podem ser editadas)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getCategoriasPadrao("saida").map((category) => (
                    <div key={category.value} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{category.label}</span>
                          <Badge variant="outline" className="text-xs">
                            Padrão
                          </Badge>
                        </div>
                      </div>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="mt-2 ml-6 space-y-1">
                          {category.subcategories.map((sub) => (
                            <div key={sub.value} className="text-sm text-muted-foreground">
                              • {sub.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categorias Customizadas */}
            <Card>
              <CardHeader>
                <CardTitle>Categorias Customizadas</CardTitle>
                <CardDescription>
                  Suas categorias personalizadas (podem ser editadas ou removidas)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {categoriasFiltradas.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Tag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma categoria customizada</p>
                    <p className="text-sm">Clique em "Adicionar Categoria" para criar uma nova</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {categoriasFiltradas.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Tag className="h-4 w-4 text-primary" />
                          <div>
                            <div className="font-medium">{category.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {category.value}
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Customizada
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(category)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(category)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog para Adicionar/Editar */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Editar Categoria" : "Adicionar Categoria"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Altere os dados da categoria abaixo"
                  : `Crie uma nova categoria para ${tipoAtivo === "entrada" ? "entradas" : "saídas"}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="label" className="text-sm font-medium">
                  Nome da Categoria
                </label>
                <Input
                  id="label"
                  placeholder="Ex: Serviços de Consultoria"
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="value" className="text-sm font-medium">
                  Valor (identificador)
                </label>
                <Input
                  id="value"
                  placeholder="Ex: servicos_consultoria"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Apenas letras, números e underscores (será convertido automaticamente)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {editingCategory ? "Salvar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Confirmação para Deletar */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja remover a categoria "{categoryToDelete?.label}"?
                Esta ação não pode ser desfeita. Lançamentos que usam esta categoria
                continuarão funcionando, mas a categoria não estará mais disponível
                para novos lançamentos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default Categorias;
