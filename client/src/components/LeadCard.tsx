import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Phone,
  Mail,
  MessageCircle,
  MoreVertical,
  Edit,
  Trash2,
  TrendingUp,
} from "lucide-react";

interface Lead {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  stage: string;
  qualification: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  score: number | null;
  priority: string | null;
  urgencyLevel: string | null;
  preferredNeighborhoods: string | null;
  notes: string | null;
}

interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onDelete?: (id: number) => void;
}

const qualificationColors = {
  hot: "bg-red-500/10 text-red-700 border-red-200",
  warm: "bg-orange-500/10 text-orange-700 border-orange-200",
  cold: "bg-blue-500/10 text-blue-700 border-blue-200",
};

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

export function LeadCard({ lead, onEdit, onDelete }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatCurrency = (value: number | null) => {
    if (!value) return "N/A";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const qualificationColor =
    qualificationColors[lead.qualification as keyof typeof qualificationColors] ||
    "bg-gray-500/10 text-gray-700 border-gray-200";

  const priorityColor =
    priorityColors[lead.priority as keyof typeof priorityColors] || "bg-gray-500";

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-4 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow bg-white border-l-4"
      style={{
        ...style,
        borderLeftColor:
          lead.qualification === "hot"
            ? "#ef4444"
            : lead.qualification === "warm"
            ? "#f97316"
            : "#3b82f6",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{lead.name}</h3>
          {lead.qualification && (
            <Badge
              variant="outline"
              className={`text-xs ${qualificationColor}`}
            >
              {lead.qualification.toUpperCase()}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Score Badge */}
          {lead.score !== null && (
            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
              <TrendingUp className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-semibold text-blue-600">
                {lead.score}
              </span>
            </div>
          )}
          {/* Priority Indicator */}
          {lead.priority && (
            <div
              className={`w-2 h-2 rounded-full ${priorityColor}`}
              title={`Prioridade: ${lead.priority}`}
            />
          )}
          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(lead)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(lead.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-1 mb-3">
        {lead.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-3 h-3" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-3 h-3" />
            <span>{lead.phone}</span>
          </div>
        )}
      </div>

      {/* Budget */}
      {(lead.budgetMin || lead.budgetMax) && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <p className="text-xs text-gray-500 mb-1">Orçamento:</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(lead.budgetMin)} - {formatCurrency(lead.budgetMax)}
          </p>
        </div>
      )}

      {/* Neighborhoods */}
      {lead.preferredNeighborhoods && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Bairros de interesse:</p>
          <p className="text-xs text-gray-700 line-clamp-2">
            {lead.preferredNeighborhoods}
          </p>
        </div>
      )}

      {/* Notes Preview */}
      {lead.notes && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Observações:</p>
          <p className="text-xs text-gray-700 line-clamp-2">{lead.notes}</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2 pt-3 border-t">
        {lead.whatsapp && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://wa.me/${lead.whatsapp?.replace(/\D/g, "")}`, "_blank");
            }}
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            WhatsApp
          </Button>
        )}
        {lead.phone && (
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${lead.phone}`;
            }}
          >
            <Phone className="w-3 h-3 mr-1" />
            Ligar
          </Button>
        )}
      </div>
    </Card>
  );
}
