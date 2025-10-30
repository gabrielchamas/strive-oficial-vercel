import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CATEGORIAS_ENTRADAS, CATEGORIAS_SAIDAS } from "@/types/categories";

interface FilterLancamentosDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterState) => void;
}

export interface FilterState {
  direcao: "todos" | "entradas" | "saidas";
  status: "todos" | "em_aberto" | "concluidos";
  conciliacao: "todos" | "pendentes" | "conciliados";
  dataVencimentoInicio?: Date;
  dataVencimentoFim?: Date;
  contato?: string;
  categoria?: string;
  tags?: string[];
  dataCaixaInicio?: Date;
  dataCaixaFim?: Date;
}

export const FilterLancamentosDialog = ({
  open,
  onOpenChange,
  onApplyFilters,
}: FilterLancamentosDialogProps) => {
  const [filters, setFilters] = useState<FilterState>({
    direcao: "todos",
    status: "todos",
    conciliacao: "todos",
  });

  const handleApply = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleClear = () => {
    const clearedFilters: FilterState = {
      direcao: "todos",
      status: "todos",
      conciliacao: "todos",
    };
    setFilters(clearedFilters);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-background">
        <DialogHeader>
          <DialogTitle>Filtros de lançamentos</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Direção */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Direção</label>
            <div className="flex gap-2">
              <Button
                variant={filters.direcao === "todos" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setFilters({ ...filters, direcao: "todos" })}
              >
                Todos
              </Button>
              <Button
                variant={filters.direcao === "entradas" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setFilters({ ...filters, direcao: "entradas" })}
              >
                <ArrowUp className="h-4 w-4 mr-1" />
                Entradas
              </Button>
              <Button
                variant={filters.direcao === "saidas" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setFilters({ ...filters, direcao: "saidas" })}
              >
                <ArrowDown className="h-4 w-4 mr-1" />
                Saídas
              </Button>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <div className="flex gap-2">
              <Button
                variant={filters.status === "todos" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setFilters({ ...filters, status: "todos" })}
              >
                Todos
              </Button>
              <Button
                variant={filters.status === "em_aberto" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setFilters({ ...filters, status: "em_aberto" })}
              >
                Em aberto
              </Button>
              <Button
                variant={filters.status === "concluidos" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setFilters({ ...filters, status: "concluidos" })}
              >
                Concluídos
              </Button>
            </div>
          </div>

          {/* Conciliação */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Conciliação</label>
            <div className="flex gap-2">
              <Button
                variant={filters.conciliacao === "todos" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setFilters({ ...filters, conciliacao: "todos" })}
              >
                Todos
              </Button>
              <Button
                variant={filters.conciliacao === "pendentes" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setFilters({ ...filters, conciliacao: "pendentes" })}
              >
                Pendentes
              </Button>
              <Button
                variant={filters.conciliacao === "conciliados" ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setFilters({ ...filters, conciliacao: "conciliados" })}
              >
                Conciliados
              </Button>
            </div>
          </div>

          {/* Data de vencimento */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data de vencimento</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dataVencimentoInicio && !filters.dataVencimentoFim && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dataVencimentoInicio && filters.dataVencimentoFim ? (
                    <>
                      {format(filters.dataVencimentoInicio, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                      {format(filters.dataVencimentoFim, "dd/MM/yyyy", { locale: ptBR })}
                    </>
                  ) : (
                    <span>01/10/2025 - 31/10/2025</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: filters.dataVencimentoInicio,
                    to: filters.dataVencimentoFim,
                  }}
                  onSelect={(range) => {
                    setFilters({
                      ...filters,
                      dataVencimentoInicio: range?.from,
                      dataVencimentoFim: range?.to,
                    });
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Contato */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Contato</label>
            <Select value={filters.contato} onValueChange={(value) => setFilters({ ...filters, contato: value })}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione o contato" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="cliente-x">Cliente X</SelectItem>
                <SelectItem value="fornecedor-y">Fornecedor Y</SelectItem>
                <SelectItem value="nao-identificado">Não identificado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={filters.categoria} onValueChange={(value) => setFilters({ ...filters, categoria: value })}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent className="bg-background max-h-[300px]">
                <SelectItem value="__all__">Todas as categorias</SelectItem>
                {[...CATEGORIAS_ENTRADAS, ...CATEGORIAS_SAIDAS].map((cat) => (
                  cat.subcategories ? (
                    cat.subcategories.map((sub) => (
                      <SelectItem key={sub.value} value={sub.value}>
                        {cat.label} › {sub.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  )
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <Select>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione as tags" />
              </SelectTrigger>
              <SelectContent className="bg-background">
                <SelectItem value="tag1">Tag 1</SelectItem>
                <SelectItem value="tag2">Tag 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data de caixa */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data de caixa</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dataCaixaInicio && !filters.dataCaixaFim && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dataCaixaInicio && filters.dataCaixaFim ? (
                    <>
                      {format(filters.dataCaixaInicio, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                      {format(filters.dataCaixaFim, "dd/MM/yyyy", { locale: ptBR })}
                    </>
                  ) : (
                    <span>Selecione um período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: filters.dataCaixaInicio,
                    to: filters.dataCaixaFim,
                  }}
                  onSelect={(range) => {
                    setFilters({
                      ...filters,
                      dataCaixaInicio: range?.from,
                      dataCaixaFim: range?.to,
                    });
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="outline" onClick={handleClear}>
            Limpar
          </Button>
          <Button onClick={handleApply}>Aplicar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
