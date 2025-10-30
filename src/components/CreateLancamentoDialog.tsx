import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDown, ArrowUp, CreditCard, Layers, RefreshCw, Sparkles, Upload, ChevronDown, CalendarIcon, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CATEGORIAS_ENTRADAS, CATEGORIAS_SAIDAS } from "@/types/categories";

type Lancamento = {
  id: string;
  tipo: "entrada" | "saida" | "padrao" | "parcelado" | "recorrente";
  descricao: string;
  vencimento: string;
  valor: number;
  status: "concluido" | "em_aberto";
  categoria: string;
  contato: string;
  // Campos opcionais por tipo
  parcela?: string;
  numeroParcelas?: number;
  frequencia?: string;
  diaRepeticao?: number;
  conclusaoAutomatica?: boolean;
  apenasDiasUteis?: boolean;
};

interface CreateLancamentoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateLancamento: (lancamento: Lancamento) => void;
}

export const CreateLancamentoDialog = ({ open, onOpenChange, onCreateLancamento }: CreateLancamentoDialogProps) => {
  const [tipoTransacao, setTipoTransacao] = useState<"entrada" | "saida">("entrada");
  const [tipoLancamento, setTipoLancamento] = useState<"padrao" | "parcelado" | "recorrente">("padrao");
  const [descricao, setDescricao] = useState("");
  const [dataVencimento, setDataVencimento] = useState<Date>();
  const [valor, setValor] = useState("");
  const [contato, setContato] = useState("");
  const [categoria, setCategoria] = useState("");
  const [concluido, setConcluido] = useState(false);
  const [maisPropriedades, setMaisPropriedades] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Campos específicos para Parcelado
  const [numeroParcelas, setNumeroParcelas] = useState("1");
  const [frequencia, setFrequencia] = useState("mensal");
  
  // Campos específicos para Recorrente
  const [diaRepeticao, setDiaRepeticao] = useState("24");
  const [conclusaoAutomatica, setConclusaoAutomatica] = useState(false);
  const [apenasDiasUteis, setApenasDiasUteis] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success("Arquivo carregado! Analisando com IA...");
      // Simulação de preenchimento com IA
      setTimeout(() => {
        setDescricao("Pagamento Netflix Assinatura");
        setCategoria("software");
        setValor("39.90");
        toast.success("Informações preenchidas automaticamente!");
      }, 1500);
    }
  };

  const handleCreate = () => {
    if (!descricao || !valor || !categoria) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const valorNumerico = parseFloat(valor.replace(",", "."));
    const valorFinal = tipoTransacao === "saida" ? -valorNumerico : valorNumerico;

    const contatoMapValueToLabel: Record<string, string> = {
      "cliente_x": "Cliente X",
      "fornecedor_y": "Fornecedor Y",
      "prestador_z": "Prestador Z",
      "nao-identificado": "Não identificado",
    };

    const baseLancamento = {
      id: Math.random().toString(36).substr(2, 9),
      tipo: tipoLancamento === "padrao" ? tipoTransacao : tipoLancamento,
      descricao,
      vencimento: dataVencimento ? format(dataVencimento, "dd/MM/yyyy") : format(new Date(), "dd/MM/yyyy"),
      valor: valorFinal,
      status: concluido ? "concluido" : "em_aberto",
      categoria: categoria,
      contato: contato ? (contatoMapValueToLabel[contato] || contato) : "Não identificado",
    };

    // Adicionar campos específicos por tipo
    const novoLancamento = {
      ...baseLancamento,
      ...(tipoLancamento === "parcelado" && {
        parcela: `1/${numeroParcelas}`,
        numeroParcelas: parseInt(numeroParcelas),
        frequencia,
      }),
      ...(tipoLancamento === "recorrente" && {
        frequencia,
        diaRepeticao: parseInt(diaRepeticao),
        conclusaoAutomatica,
        apenasDiasUteis,
      }),
    };

    onCreateLancamento(novoLancamento);
    toast.success("Lançamento criado com sucesso!");
    
    // Reset form
    setDescricao("");
    setValor("");
    setContato("");
    setCategoria("");
    setDataVencimento(undefined);
    setConcluido(false);
    setUploadedFile(null);
    setNumeroParcelas("1");
    setFrequencia("mensal");
    setDiaRepeticao("24");
    setConclusaoAutomatica(false);
    setApenasDiasUteis(false);
    onOpenChange(false);
  };

  const categorias = tipoTransacao === "entrada" ? CATEGORIAS_ENTRADAS : CATEGORIAS_SAIDAS;

  const valorFinal = valor ? parseFloat(valor.replace(",", ".")) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-5 w-5" />
            Novo Lançamento Financeiro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Criar lançamentos em lote */}
          <div className="flex items-center justify-between">
            <Button 
              variant="link" 
              className="h-auto p-0 text-sm underline"
              onClick={() => toast.info("Funcionalidade de lote em desenvolvimento")}
            >
              Criar lançamentos em lote
            </Button>
          </div>

          {/* Tipo de Transação */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={tipoTransacao === "entrada" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTipoTransacao("entrada")}
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Entrada
            </Button>
            <Button
              type="button"
              variant={tipoTransacao === "saida" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTipoTransacao("saida")}
            >
              <ArrowDown className="h-4 w-4 mr-2" />
              Saída
            </Button>
          </div>

          {/* Tipo de Lançamento */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={tipoLancamento === "padrao" ? "secondary" : "outline"}
              className="flex-1"
              size="sm"
              onClick={() => setTipoLancamento("padrao")}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Padrão
            </Button>
            <Button
              type="button"
              variant={tipoLancamento === "parcelado" ? "secondary" : "outline"}
              className="flex-1"
              size="sm"
              onClick={() => setTipoLancamento("parcelado")}
            >
              <Layers className="h-4 w-4 mr-2" />
              Parcelado
            </Button>
            <Button
              type="button"
              variant={tipoLancamento === "recorrente" ? "secondary" : "outline"}
              className="flex-1"
              size="sm"
              onClick={() => setTipoLancamento("recorrente")}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recorrente
            </Button>
          </div>

          {/* Auto-preenchimento com IA */}
          <div className="border border-primary/30 rounded-lg p-4 bg-primary/5">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">Auto-preenchimento com IA</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Selecione ou arraste um arquivo aqui para preencher as informações automaticamente
                </p>
                <label htmlFor="file-upload">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Upload className="h-5 w-5" />
                      <span className="text-sm">
                        {uploadedFile ? uploadedFile.name : "Clique para fazer upload"}
                      </span>
                    </div>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">
              Descrição <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="descricao"
              placeholder="Digite a descrição do lançamento"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="min-h-[60px] resize-none"
            />
          </div>

          {/* Data de Vencimento e Valor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vencimento">
                {tipoLancamento === "parcelado" 
                  ? "Data da 1ª parcela" 
                  : tipoLancamento === "recorrente" 
                  ? "Data da 1ª repetição"
                  : "Data de vencimento"} <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataVencimento && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataVencimento ? format(dataVencimento, "dd/MM/yyyy") : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataVencimento}
                    onSelect={setDataVencimento}
                    initialFocus
                    locale={ptBR}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">
                {tipoLancamento === "parcelado" 
                  ? "Valor total" 
                  : tipoLancamento === "recorrente"
                  ? "Valor médio"
                  : "Valor"} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  R$
                </span>
                <Input
                  id="valor"
                  type="text"
                  placeholder="0"
                  value={valor}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d,]/g, "");
                    setValor(value);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Contato e Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contato">Contato</Label>
              <Select value={contato} onValueChange={setContato}>
                <SelectTrigger id="contato">
                  <SelectValue placeholder="Selecione o contato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente_x">Cliente X</SelectItem>
                  <SelectItem value="fornecedor_y">Fornecedor Y</SelectItem>
                  <SelectItem value="prestador_z">Prestador Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">
                Categoria <span className="text-destructive">*</span>
              </Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {categorias.map((cat) => (
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
          </div>

          {/* Campos específicos para Parcelado */}
          {tipoLancamento === "parcelado" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="frequencia">
                  Frequência <span className="text-destructive">*</span>
                </Label>
                <Select value={frequencia} onValueChange={setFrequencia}>
                  <SelectTrigger id="frequencia">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="quinzenal">Quinzenal</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroParcelas">
                  Número de parcelas <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="numeroParcelas"
                  type="number"
                  min="1"
                  value={numeroParcelas}
                  onChange={(e) => setNumeroParcelas(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Campos específicos para Recorrente */}
          {tipoLancamento === "recorrente" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequenciaRecorrente">
                    Frequência <span className="text-destructive">*</span>
                  </Label>
                  <Select value={frequencia} onValueChange={setFrequencia}>
                    <SelectTrigger id="frequenciaRecorrente">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="quinzenal">Quinzenal</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diaRepeticao">
                    Dia da repetição no mês <span className="text-destructive">*</span>
                  </Label>
                  <Select value={diaRepeticao} onValueChange={setDiaRepeticao}>
                    <SelectTrigger id="diaRepeticao">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((dia) => (
                        <SelectItem key={dia} value={dia.toString()}>
                          {dia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <Label htmlFor="conclusaoAutomatica" className="cursor-pointer">
                    Conclusão automática
                  </Label>
                  <Switch
                    id="conclusaoAutomatica"
                    checked={conclusaoAutomatica}
                    onCheckedChange={setConclusaoAutomatica}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <Label htmlFor="apenasDiasUteis" className="cursor-pointer">
                    Apenas dias úteis
                  </Label>
                  <Switch
                    id="apenasDiasUteis"
                    checked={apenasDiasUteis}
                    onCheckedChange={setApenasDiasUteis}
                  />
                </div>
              </div>
            </>
          )}

          {/* Mais Propriedades */}
          <Collapsible open={maisPropriedades} onOpenChange={setMaisPropriedades}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start px-0">
                <ChevronDown className={cn("h-4 w-4 mr-2 transition-transform", maisPropriedades && "rotate-180")} />
                Mais propriedades
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-md bg-muted">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <Label htmlFor="concluido" className="cursor-pointer">Concluído</Label>
                </div>
                <Switch
                  id="concluido"
                  checked={concluido}
                  onCheckedChange={setConcluido}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Calcular parcelas - somente para Parcelado */}
          {tipoLancamento === "parcelado" && (
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => {
                const total = parseFloat(valor.replace(",", ".")) || 0;
                const parcelas = parseInt(numeroParcelas) || 1;
                const valorParcela = (total / parcelas).toFixed(2);
                toast.success(`Cada parcela será de R$ ${valorParcela.replace(".", ",")}`);
              }}
            >
              Calcular parcelas
            </Button>
          )}

          {/* Valor Final */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {tipoLancamento === "parcelado" ? "Valor total:" : "Valor final:"}
              </span>
              <span className="text-lg font-semibold">
                R$ {valorFinal.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate}>Criar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
