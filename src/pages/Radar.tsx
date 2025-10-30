import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  RefreshCw,
  Settings,
  Filter,
  Search,
  Mail,
  MessageCircle,
  Building2,
  Archive,
  Link,
  FileText,
  MoreVertical,
  CheckSquare,
  Inbox
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RadarItem {
  id: string;
  channel: 'whatsapp' | 'email' | 'banco';
  contactName: string;
  preview: string;
  fullText: string;
  detectedValue?: string;
  date: string;
  status: 'pendente' | 'vinculado' | 'arquivado';
  attachments?: string[];
}

// Mock data
const mockItems: RadarItem[] = [
  {
    id: '1',
    channel: 'whatsapp',
    contactName: 'João Silva',
    preview: 'Oi, preciso do boleto da mensalidade de março...',
    fullText: 'Oi, boa tarde! Preciso do boleto da mensalidade de março. Pode me enviar por favor? Obrigado!',
    detectedValue: 'R$ 1.200,00',
    date: '2024-01-15T14:30:00Z',
    status: 'pendente',
  },
  {
    id: '2',
    channel: 'email',
    contactName: 'maria@empresa.com',
    preview: 'Fatura em anexo - Serviços prestados',
    fullText: 'Segue em anexo a fatura dos serviços prestados no mês de dezembro.',
    detectedValue: 'R$ 5.500,00',
    date: '2024-01-15T10:15:00Z',
    status: 'pendente',
    attachments: ['fatura_dezembro.pdf']
  },
  {
    id: '3',
    channel: 'banco',
    contactName: 'Banco Central',
    preview: 'PIX recebido - Pedro Oliveira',
    fullText: 'PIX recebido de Pedro Oliveira no valor de R$ 850,00',
    detectedValue: 'R$ 850,00',
    date: '2024-01-15T09:45:00Z',
    status: 'vinculado',
  }
];

const Radar = () => {
  const [items, setItems] = useState<RadarItem[]>(mockItems);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<RadarItem | null>(null);
  const [showIntegrations, setShowIntegrations] = useState(false);

  const filterChips = [
    { id: 'whatsapp', label: 'WhatsApp', count: 1 },
    { id: 'email', label: 'Email', count: 1 },
    { id: 'pendentes', label: 'Pendentes', count: 2 },
    { id: 'vinculados', label: 'Vinculados', count: 1 },
    { id: 'arquivados', label: 'Arquivados', count: 0 },
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'banco':
        return <Building2 className="h-4 w-4" />;
      default:
        return <Inbox className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pendente</Badge>;
      case 'vinculado':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Vinculado</Badge>;
      case 'arquivado':
        return <Badge variant="secondary" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Arquivado</Badge>;
      default:
        return null;
    }
  };

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: "Ação executada",
      description: `${action} aplicado a ${selectedItems.length} item(s)`,
    });
    setSelectedItems([]);
  };

  const filteredItems = items.filter(item => {
    if (searchQuery && !item.contactName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.preview.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (activeFilters.length > 0) {
      const matchesChannel = activeFilters.includes(item.channel);
      const matchesStatus = activeFilters.includes(item.status);
      return matchesChannel || matchesStatus;
    }
    
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumbs e Actions */}
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Início</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/financeiro">Financeiro</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Radar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => toast({ title: "Atualizando...", description: "Sincronizando dados" })}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowIntegrations(true)}>
              <Settings className="h-4 w-4" />
              Gerenciar integrações
            </Button>
          </div>
        </div>

        {/* Barra de Filtros */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
            
            {filterChips.map((chip) => (
              <Button
                key={chip.id}
                variant={activeFilters.includes(chip.id) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter(chip.id)}
                className="h-8"
              >
                {chip.label}
                {chip.count > 0 && (
                  <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                    {chip.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por contato, valor ou texto..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <Card className="p-4 bg-muted/50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedItems.length} item(s) selecionado(s)
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('Arquivar')}>
                  <Archive className="h-4 w-4 mr-2" />
                  Arquivar
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('Vincular')}>
                  <Link className="h-4 w-4 mr-2" />
                  Vincular
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction('Criar cobrança')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Criar cobrança
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de Items */}
        {filteredItems.length === 0 ? (
          // Empty State
          <Card className="p-12">
            <div className="text-center">
              <Inbox className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum item encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Não há mensagens ou emails no radar no momento para o filtro selecionado.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" onClick={() => toast({ title: "Atualizando..." })}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
                <Button variant="outline" onClick={() => setShowIntegrations(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Gerenciar integrações
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/30 cursor-pointer group"
                  onClick={() => setSelectedItem(item)}
                >
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => toggleItemSelection(item.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-muted">
                      {getChannelIcon(item.channel)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{item.contactName}</p>
                      {getStatusBadge(item.status)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{item.preview}</p>
                  </div>

                  <div className="text-right">
                    {item.detectedValue && (
                      <p className="font-medium text-sm">{item.detectedValue}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Drawer de Detalhes */}
        <Sheet open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <SheetContent className="w-full sm:max-w-2xl">
            {selectedItem && (
              <>
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    {getChannelIcon(selectedItem.channel)}
                    {selectedItem.contactName}
                    {getStatusBadge(selectedItem.status)}
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* Ações */}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Link className="h-4 w-4 mr-2" />
                      Vincular
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Criar cobrança
                    </Button>
                    <Button variant="outline" size="sm">
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Criar lançamento
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4 mr-2" />
                      Arquivar
                    </Button>
                  </div>

                  {/* Conversa */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Conversa completa</h4>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm">{selectedItem.fullText}</p>
                    </div>
                  </div>

                  {/* Metadados */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Dados detectados</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedItem.detectedValue && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Valor detectado</label>
                          <p className="text-sm font-medium">{selectedItem.detectedValue}</p>
                          <p className="text-xs text-muted-foreground">Confiança: 92%</p>
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Data</label>
                        <p className="text-sm">{new Date(selectedItem.date).toLocaleString('pt-BR')}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Canal</label>
                        <p className="text-sm capitalize">{selectedItem.channel}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Status</label>
                        <p className="text-sm capitalize">{selectedItem.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Anexos */}
                  {selectedItem.attachments && selectedItem.attachments.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Anexos</h4>
                      <div className="space-y-2">
                        {selectedItem.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <FileText className="h-4 w-4" />
                            <span className="text-sm">{attachment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Modal de Integrações */}
        <Dialog open={showIntegrations} onOpenChange={setShowIntegrations}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gerenciar integrações</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-medium">WhatsApp</h4>
                        <p className="text-sm text-muted-foreground">Conectar via API</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Conectar</Button>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">E-mail</h4>
                        <p className="text-sm text-muted-foreground">IMAP/SMTP</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Conectar</Button>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-8 w-8 text-purple-600" />
                      <div>
                        <h4 className="font-medium">Banco</h4>
                        <p className="text-sm text-muted-foreground">Open Banking / OFX</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Conectar</Button>
                  </div>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Radar;