import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

export default function PropertyOwners() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    documentType: "cpf" as "cpf" | "cnpj",
    documentNumber: "",
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    state: "DF",
    zipCode: "",
    bankName: "",
    bankAgency: "",
    bankAccount: "",
    bankAccountType: "corrente" as "corrente" | "poupanca",
    pixKey: "",
    notes: "",
  });

  const { data: owners, isLoading, refetch } = trpc.propertyOwners.list.useQuery();
  const createOwner = trpc.propertyOwners.create.useMutation({
    onSuccess: () => {
      toast.success("Proprietário cadastrado com sucesso!");
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao cadastrar proprietário: ${error.message}`);
    },
  });

  const updateOwner = trpc.propertyOwners.update.useMutation({
    onSuccess: () => {
      toast.success("Proprietário atualizado com sucesso!");
      setIsDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar proprietário: ${error.message}`);
    },
  });

  const deleteOwner = trpc.propertyOwners.delete.useMutation({
    onSuccess: () => {
      toast.success("Proprietário removido com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao remover proprietário: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      documentType: "cpf",
      documentNumber: "",
      email: "",
      phone: "",
      whatsapp: "",
      address: "",
      city: "",
      state: "DF",
      zipCode: "",
      bankName: "",
      bankAgency: "",
      bankAccount: "",
      bankAccountType: "corrente",
      pixKey: "",
      notes: "",
    });
    setEditingOwner(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOwner) {
      updateOwner.mutate({ id: editingOwner.id, ...formData });
    } else {
      createOwner.mutate(formData);
    }
  };

  const handleEdit = (owner: any) => {
    setEditingOwner(owner);
    setFormData({
      name: owner.name || "",
      documentType: owner.documentType || "cpf",
      documentNumber: owner.documentNumber || "",
      email: owner.email || "",
      phone: owner.phone || "",
      whatsapp: owner.whatsapp || "",
      address: owner.address || "",
      city: owner.city || "",
      state: owner.state || "DF",
      zipCode: owner.zipCode || "",
      bankName: owner.bankName || "",
      bankAgency: owner.bankAgency || "",
      bankAccount: owner.bankAccount || "",
      bankAccountType: owner.bankAccountType || "corrente",
      pixKey: owner.pixKey || "",
      notes: owner.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este proprietário?")) {
      deleteOwner.mutate({ id });
    }
  };

  const filteredOwners = owners?.filter((owner: any) =>
    owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.documentNumber.includes(searchTerm)
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proprietários</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os proprietários de imóveis
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Proprietário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOwner ? "Editar Proprietário" : "Novo Proprietário"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do proprietário
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados Pessoais */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dados Pessoais</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="documentType">Tipo de Documento *</Label>
                    <Select
                      value={formData.documentType}
                      onValueChange={(value: "cpf" | "cnpj") =>
                        setFormData({ ...formData, documentType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpf">CPF</SelectItem>
                        <SelectItem value="cnpj">CNPJ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="documentNumber">
                      {formData.documentType === "cpf" ? "CPF" : "CNPJ"} *
                    </Label>
                    <Input
                      id="documentNumber"
                      value={formData.documentNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, documentNumber: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Endereço</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      maxLength={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Dados Bancários */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Dados Bancários</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="bankName">Banco</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankAgency">Agência</Label>
                    <Input
                      id="bankAgency"
                      value={formData.bankAgency}
                      onChange={(e) => setFormData({ ...formData, bankAgency: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankAccount">Conta</Label>
                    <Input
                      id="bankAccount"
                      value={formData.bankAccount}
                      onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankAccountType">Tipo de Conta</Label>
                    <Select
                      value={formData.bankAccountType}
                      onValueChange={(value: "corrente" | "poupanca") =>
                        setFormData({ ...formData, bankAccountType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corrente">Corrente</SelectItem>
                        <SelectItem value="poupanca">Poupança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pixKey">Chave PIX</Label>
                    <Input
                      id="pixKey"
                      value={formData.pixKey}
                      onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingOwner ? "Atualizar" : "Cadastrar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Contatos</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Banco</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredOwners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum proprietário encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredOwners.map((owner: any) => (
                <TableRow key={owner.id}>
                  <TableCell className="font-medium">{owner.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">
                        {owner.documentType.toUpperCase()}
                      </div>
                      <div className="text-muted-foreground">
                        {owner.documentNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      {owner.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {owner.phone}
                        </div>
                      )}
                      {owner.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {owner.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{owner.city || "-"}</TableCell>
                  <TableCell>
                    {owner.bankName ? (
                      <div className="text-sm">
                        <div>{owner.bankName}</div>
                        <div className="text-muted-foreground">
                          Ag: {owner.bankAgency} / Cc: {owner.bankAccount}
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(owner)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(owner.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
