import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Search, Filter, Download, Eye, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

const Documents = () => {
  const [dragActive, setDragActive] = useState(false);

  const documents = [
    {
      id: 1,
      name: "Nota Fiscal 12345.pdf",
      category: "Receita",
      aiSuggestion: "Receita de Serviços",
      status: "Processado",
      confidence: 98,
      uploadDate: "2024-01-15",
      size: "245 KB"
    },
    {
      id: 2,
      name: "Recibo Aluguel Jan.pdf",
      category: "Despesa",
      aiSuggestion: "Despesa com Aluguel",
      status: "Pendente",
      confidence: 85,
      uploadDate: "2024-01-14",
      size: "180 KB"
    },
    {
      id: 3,
      name: "Fatura Energia.pdf",
      category: "Despesa",
      aiSuggestion: "Despesa com Energia Elétrica",
      status: "Processado",
      confidence: 96,
      uploadDate: "2024-01-13",
      size: "320 KB"
    },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop logic here
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Documentos</h2>
            <p className="text-muted-foreground">
              Gerencie e classifique seus documentos com IA
            </p>
          </div>
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Fazer Upload
          </Button>
        </div>

        {/* Upload Area */}
        <Card className="border-dashed border-2">
          <CardContent className="p-8">
            <div
              className={`text-center transition-colors ${
                dragActive ? "bg-accent/50" : ""
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Arraste e solte seus documentos aqui
              </h3>
              <p className="text-muted-foreground mb-4">
                ou clique para selecionar arquivos (PDF, JPG, PNG)
              </p>
              <Button variant="outline">
                Selecionar Arquivos
              </Button>
              <div className="mt-4 text-xs text-muted-foreground">
                Máximo 10MB por arquivo • Suporta PDF, JPG, PNG
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos Processados</CardTitle>
            <CardDescription>Histórico de documentos classificados pela IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar documentos..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>

            {/* Documents Table */}
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{doc.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{doc.uploadDate}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium text-sm">{doc.aiSuggestion}</div>
                      <div className="text-xs text-muted-foreground">
                        {doc.confidence}% de confiança
                      </div>
                    </div>

                    <Badge variant={doc.status === "Processado" ? "default" : "secondary"}>
                      <div className="flex items-center gap-1">
                        {doc.status === "Processado" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {doc.status}
                      </div>
                    </Badge>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando 3 de 127 documentos
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Revisar Pendentes
                </Button>
                <Button size="sm">
                  Exportar Lista
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Documents;