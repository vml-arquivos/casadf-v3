import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Pencil, Trash2, Eye, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function PropertiesAdmin() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: properties, refetch } = trpc.properties.list.useQuery();
  const deleteMutation = trpc.properties.delete.useMutation({
    onSuccess: () => {
      toast.success("Imóvel excluído com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir imóvel: ${error.message}`);
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este imóvel?")) {
      deleteMutation.mutate({ id });
    }
  };

  const filteredProperties = properties?.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.referenceCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      disponivel: "bg-green-100 text-green-700",
      reservado: "bg-yellow-100 text-yellow-700",
      vendido: "bg-red-100 text-red-700",
      alugado: "bg-blue-100 text-blue-700",
      inativo: "bg-gray-100 text-gray-700",
    };
    return variants[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Imóveis</h1>
            <p className="text-muted-foreground">
              Gerencie todos os imóveis cadastrados
            </p>
          </div>
          <Button onClick={() => setLocation("/admin/properties/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Imóvel
          </Button>
        </div>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título, bairro ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProperties && filteredProperties.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProperties.map((property) => (
                      <TableRow key={property.id}>
                        <TableCell className="font-mono text-sm">
                          {property.referenceCode || `#${property.id}`}
                        </TableCell>
                        <TableCell className="font-medium">
                          {property.title}
                        </TableCell>
                        <TableCell className="capitalize">
                          {property.propertyType}
                        </TableCell>
                        <TableCell>
                          {property.neighborhood}, {property.city}
                        </TableCell>
                        <TableCell>
                          {property.salePrice
                            ? `R$ ${(property.salePrice / 100).toLocaleString('pt-BR')}`
                            : property.rentPrice
                            ? `R$ ${(property.rentPrice / 100).toLocaleString('pt-BR')}/mês`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(property.status)}>
                            {property.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setLocation(`/imoveis/${property.id}`)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setLocation(`/admin/properties/${property.id}`)
                                }
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(property.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {searchTerm
                    ? "Nenhum imóvel encontrado com esses critérios"
                    : "Nenhum imóvel cadastrado ainda"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setLocation("/admin/properties/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar Primeiro Imóvel
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
