import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MessageCircle, Bot, User, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WhatsAppTimelineProps {
  phone?: string;
  sessionId?: string;
}

export function WhatsAppTimeline({ phone, sessionId }: WhatsAppTimelineProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Buscar histórico de mensagens
  const { data: messages, isLoading } = trpc.integration.getHistory.useQuery(
    {
      phone: phone || undefined,
      sessionId: sessionId || undefined,
      limit: 100,
    },
    {
      enabled: !!(phone || sessionId),
    }
  );

  // Filtrar mensagens por termo de busca
  const filteredMessages = messages?.filter((msg) =>
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!phone && !sessionId) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>Nenhum telefone ou sessão fornecida</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando mensagens...</p>
        </CardContent>
      </Card>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <MessageCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
          <p>Nenhuma mensagem encontrada</p>
          <p className="text-sm mt-2">
            As conversas do WhatsApp aparecerão aqui quando houver interações
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Histórico WhatsApp
            <Badge variant="secondary">{messages.length} mensagens</Badge>
          </CardTitle>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mensagens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {filteredMessages?.map((msg, index) => {
              const isAI = msg.role === "assistant";
              const isSystem = msg.role === "system";

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    isAI ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isAI
                        ? "bg-primary/10 text-primary"
                        : isSystem
                        ? "bg-muted text-muted-foreground"
                        : "bg-accent text-accent-foreground"
                    }`}
                  >
                    {isAI ? (
                      <Bot className="h-5 w-5" />
                    ) : isSystem ? (
                      <Clock className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`flex-1 max-w-[70%] ${
                      isAI ? "text-left" : "text-right"
                    }`}
                  >
                    <div
                      className={`inline-block rounded-lg px-4 py-3 ${
                        isAI
                          ? "bg-muted text-foreground"
                          : isSystem
                          ? "bg-muted/50 text-muted-foreground text-sm italic"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {/* Role Label */}
                      <div className="text-xs font-semibold mb-1 opacity-70">
                        {isAI ? "Lívia (IA)" : isSystem ? "Sistema" : "Cliente"}
                      </div>

                      {/* Message Content */}
                      <div className="whitespace-pre-wrap break-words">
                        {msg.message}
                      </div>

                      {/* Timestamp */}
                      <div
                        className={`text-xs mt-2 opacity-60 ${
                          isAI ? "text-left" : "text-right"
                        }`}
                      >
                        {format(new Date(msg.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </div>
                    </div>

                    {/* Session ID Badge */}
                    {msg.sessionId && (
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          Sessão: {msg.sessionId.slice(0, 8)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMessages && filteredMessages.length === 0 && searchTerm && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Nenhuma mensagem encontrada com "{searchTerm}"</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
