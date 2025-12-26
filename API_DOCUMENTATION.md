# Documentação Completa de APIs - Casa DF

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Imóveis (Properties)](#imóveis-properties)
4. [Leads/Clientes](#leadsclientes)
5. [Proprietários (Owners)](#proprietários-owners)
6. [Blog](#blog)
7. [Webhooks N8N](#webhooks-n8n)
8. [Exemplos de Integração](#exemplos-de-integração)

---

## Visão Geral

**Base URL:** `https://casadf.com.br/api/trpc`

**Protocolo:** tRPC (Type-safe RPC)

**Formato:** JSON

**Banco de Dados:** MySQL/TiDB (gerenciado automaticamente)

---

## Autenticação

### Sistema de Autenticação

O sistema usa **Manus OAuth** para autenticação. Usuários podem ter dois papéis:

- `user`: Acesso básico
- `admin`: Acesso completo ao dashboard

### Rotas de Autenticação

#### `auth.me` (Query)
Retorna informações do usuário logado.

**Acesso:** Público

**Resposta:**
```json
{
  "id": 1,
  "name": "Casa DF",
  "email": "contato@casadf.com.br",
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### `auth.logout` (Mutation)
Faz logout do usuário.

**Acesso:** Público

**Resposta:**
```json
{
  "success": true
}
```

---

## Imóveis (Properties)

### Listar Imóveis

#### `properties.list` (Query)
Lista todos os imóveis com filtros opcionais.

**Acesso:** Público

**Parâmetros:**
```typescript
{
  status?: string;              // "disponivel" | "vendido" | "alugado" | "reservado"
  transactionType?: string;     // "venda" | "locacao" | "ambos"
  propertyType?: string;        // "casa" | "apartamento" | "cobertura" | "terreno" | "comercial" | "rural" | "lancamento"
  neighborhood?: string;        // Ex: "Lago Sul"
  minPrice?: number;            // Em centavos
  maxPrice?: number;            // Em centavos
  minArea?: number;             // Em m²
  maxArea?: number;             // Em m²
  bedrooms?: number;
  bathrooms?: number;
}
```

**Exemplo de Requisição:**
```typescript
const imoveis = await trpc.properties.list.query({
  transactionType: "venda",
  neighborhood: "Lago Sul",
  minPrice: 100000000,  // R$ 1.000.000
  maxPrice: 500000000,  // R$ 5.000.000
  bedrooms: 4
});
```

**Resposta:**
```json
[
  {
    "id": 1,
    "title": "Mansão de Luxo no Lago Sul",
    "description": "Magnífica mansão...",
    "propertyType": "casa",
    "transactionType": "venda",
    "salePrice": 850000000,
    "bedrooms": 6,
    "bathrooms": 8,
    "parkingSpaces": 6,
    "totalArea": 1200,
    "address": "SHIS QL 10 Conjunto 5",
    "neighborhood": "Lago Sul",
    "city": "Brasília",
    "state": "DF",
    "zipCode": "71630-055",
    "status": "disponivel",
    "isFeatured": true,
    "mainImage": "https://...",
    "referenceCode": "LS-001"
  }
]
```

### Imóveis em Destaque

#### `properties.featured` (Query)
Lista imóveis marcados como destaque.

**Acesso:** Público

**Parâmetros:**
```typescript
{
  limit?: number;  // Padrão: 6
}
```

### Buscar Imóvel por ID

#### `properties.getById` (Query)
Retorna detalhes completos de um imóvel.

**Acesso:** Público

**Parâmetros:**
```typescript
{
  id: number;
}
```

### Criar Imóvel

#### `properties.create` (Mutation)
Cria um novo imóvel no sistema.

**Acesso:** Admin apenas

**Parâmetros:**
```typescript
{
  title: string;
  description?: string;
  propertyType: "casa" | "apartamento" | "cobertura" | "terreno" | "comercial" | "rural" | "lancamento";
  transactionType: "venda" | "locacao" | "ambos";
  salePrice?: number;      // Em centavos
  rentPrice?: number;      // Em centavos
  bedrooms?: number;
  bathrooms?: number;
  suites?: number;
  parkingSpaces?: number;
  totalArea?: number;      // Em m²
  builtArea?: number;      // Em m²
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  mainImage?: string;
  images?: string;         // JSON array de URLs
  videoUrl?: string;
  virtualTourUrl?: string;
  features?: string;       // JSON array
  status?: string;
  isFeatured?: boolean;
  referenceCode?: string;
}
```

**Exemplo:**
```typescript
const novoImovel = await trpc.properties.create.mutate({
  title: "Cobertura Duplex no Sudoeste",
  description: "Cobertura de alto padrão...",
  propertyType: "cobertura",
  transactionType: "venda",
  salePrice: 420000000,  // R$ 4.200.000
  bedrooms: 4,
  bathrooms: 5,
  parkingSpaces: 4,
  totalArea: 450,
  address: "SQSW 300 Bloco A",
  neighborhood: "Sudoeste",
  city: "Brasília",
  state: "DF",
  status: "disponivel",
  isFeatured: true,
  mainImage: "https://..."
});
```

### Atualizar Imóvel

#### `properties.update` (Mutation)
Atualiza informações de um imóvel existente.

**Acesso:** Admin apenas

**Parâmetros:**
```typescript
{
  id: number;
  data: {
    // Mesmos campos do create, todos opcionais
  }
}
```

### Deletar Imóvel

#### `properties.delete` (Mutation)
Remove um imóvel do sistema.

**Acesso:** Admin apenas

**Parâmetros:**
```typescript
{
  id: number;
}
```

---

## Leads/Clientes

### Listar Leads

#### `leads.list` (Query)
Lista todos os leads/clientes do CRM.

**Acesso:** Protegido

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "61999999999",
    "whatsapp": "61999999999",
    "source": "whatsapp",
    "stage": "contato_inicial",
    "qualification": "quente",
    "clientType": "comprador",
    "buyerProfile": "investidor",
    "urgencyLevel": "alta",
    "budgetMin": 50000000,
    "budgetMax": 100000000,
    "preferredNeighborhoods": "Lago Sul, Park Way",
    "preferredPropertyTypes": "casa, cobertura",
    "notes": "Cliente interessado em imóveis de luxo",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Criar Lead

#### `leads.create` (Mutation)
Adiciona um novo lead ao CRM.

**Acesso:** Protegido

**Parâmetros:**
```typescript
{
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  source?: string;              // "site" | "whatsapp" | "instagram" | "facebook" | "indicacao" | "telefone" | "email" | "outro"
  stage?: string;               // "novo" | "contato_inicial" | "qualificado" | ...
  qualification?: string;       // "quente" | "morno" | "frio" | "nao_qualificado"
  clientType?: string;          // "comprador" | "locatario" | "proprietario"
  buyerProfile?: string;        // "investidor" | "primeira_casa" | "upgrade" | "curioso" | "indeciso"
  urgencyLevel?: string;        // "baixa" | "media" | "alta" | "urgente"
  budgetMin?: number;           // Em centavos
  budgetMax?: number;           // Em centavos
  preferredNeighborhoods?: string;
  preferredPropertyTypes?: string;
  notes?: string;
}
```

### Buscar Imóveis Compatíveis

#### `leads.matchProperties` (Query)
Retorna imóveis compatíveis com o perfil do lead.

**Acesso:** Protegido

**Parâmetros:**
```typescript
{
  leadId: number;
}
```

**Resposta:**
```json
{
  "lead": {
    "id": 1,
    "name": "João Silva",
    "qualification": "quente"
  },
  "properties": [
    // Array de imóveis compatíveis (até 5)
  ]
}
```

### Leads Inativos (Follow-up)

#### `leads.getInactiveHotLeads` (Query)
Retorna clientes quentes sem contato há mais de 3 dias.

**Acesso:** Protegido

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "João Silva",
    "phone": "61999999999",
    "qualification": "quente",
    "daysSinceLastContact": 5,
    "lastContactDate": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## Proprietários (Owners)

### Listar Proprietários

#### `owners.list` (Query)
Lista todos os proprietários cadastrados.

**Acesso:** Protegido

**Resposta:**
```json
[
  {
    "id": 1,
    "name": "Maria Santos",
    "cpfCnpj": "123.456.789-00",
    "email": "maria@example.com",
    "phone": "61988888888",
    "whatsapp": "61988888888",
    "address": "SQN 308 Bloco A",
    "city": "Brasília",
    "state": "DF",
    "bankName": "Banco do Brasil",
    "bankAgency": "1234-5",
    "bankAccount": "12345-6",
    "pixKey": "maria@example.com",
    "notes": "Proprietária de 3 imóveis",
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Criar Proprietário

#### `owners.create` (Mutation)
Cadastra um novo proprietário.

**Acesso:** Admin apenas

**Parâmetros:**
```typescript
{
  name: string;
  cpfCnpj?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  bankName?: string;
  bankAgency?: string;
  bankAccount?: string;
  pixKey?: string;
  notes?: string;
  active?: boolean;
}
```

---

## Blog

### Listar Posts Publicados

#### `blog.published` (Query)
Lista posts publicados no blog.

**Acesso:** Público

**Parâmetros:**
```typescript
{
  limit?: number;  // Padrão: 10
}
```

**Resposta:**
```json
[
  {
    "id": 1,
    "title": "Guia Completo para Investir em Imóveis de Luxo",
    "slug": "guia-completo-investir-imoveis-luxo",
    "excerpt": "Descubra as melhores estratégias...",
    "content": "# Introdução\n\nConteúdo completo...",
    "featuredImage": "https://...",
    "published": true,
    "publishedAt": "2024-03-15T00:00:00.000Z",
    "views": 1250,
    "createdAt": "2024-03-14T00:00:00.000Z"
  }
]
```

### Buscar Post por Slug

#### `blog.getPostBySlug` (Query)
Retorna post específico pela URL amigável.

**Acesso:** Público

**Parâmetros:**
```typescript
{
  slug: string;
}
```

### Criar Post

#### `blog.create` (Mutation)
Cria um novo post no blog.

**Acesso:** Admin apenas

**Parâmetros:**
```typescript
{
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  categoryId?: number;
  metaTitle?: string;
  metaDescription?: string;
  published?: boolean;
  publishedAt?: Date;
}
```

---

## Webhooks N8N

### Receber Mensagem do WhatsApp

#### `integration.whatsappWebhook` (Mutation)
Endpoint para N8N enviar mensagens recebidas do WhatsApp.

**Acesso:** Público

**URL:** `POST /api/trpc/integration.whatsappWebhook`

**Parâmetros:**
```typescript
{
  phone: string;           // Ex: "5561999999999"
  messageId: string;       // ID único da mensagem
  content: string;         // Texto da mensagem
  type: "incoming" | "outgoing";
  timestamp?: string;      // ISO 8601
}
```

**Exemplo de Payload:**
```json
{
  "phone": "5561999999999",
  "messageId": "wamid.HBgNNTU2MTk5OTk5OTk5ORUCABIYIDNBNEE1RjY3QjQzMjQ1NzA4QjY3RkY2RjY3RjY3RjY3AA==",
  "content": "Olá, tenho interesse em imóveis no Lago Sul",
  "type": "incoming",
  "timestamp": "2024-03-15T10:30:00.000Z"
}
```

**Resposta:**
```json
{
  "success": true,
  "messageId": 123
}
```

### Salvar Lead do WhatsApp

#### `integration.saveLeadFromWhatsApp` (Mutation)
Cria ou atualiza lead a partir de conversa do WhatsApp.

**Acesso:** Público

**URL:** `POST /api/trpc/integration.saveLeadFromWhatsApp`

**Parâmetros:**
```typescript
{
  name: string;
  phone: string;
  email?: string;
  message?: string;
  propertyInterest?: string;
  budgetRange?: string;
}
```

**Exemplo de Payload:**
```json
{
  "name": "João Silva",
  "phone": "5561999999999",
  "email": "joao@example.com",
  "message": "Interessado em casas no Lago Sul",
  "propertyInterest": "casa",
  "budgetRange": "R$ 2M - R$ 5M"
}
```

**Resposta:**
```json
{
  "success": true,
  "lead": {
    "id": 1,
    "name": "João Silva",
    "phone": "5561999999999",
    "stage": "novo",
    "qualification": "nao_qualificado"
  }
}
```

### Buscar Imóveis para Cliente (Matching)

#### `integration.matchPropertiesForClient` (Mutation)
Busca imóveis compatíveis com perfil do cliente para envio via WhatsApp.

**Acesso:** Público

**URL:** `POST /api/trpc/integration.matchPropertiesForClient`

**Parâmetros:**
```typescript
{
  phone: string;
  transactionType?: "venda" | "locacao" | "ambos";
  propertyType?: string;
  budgetMin?: number;
  budgetMax?: number;
  neighborhood?: string;
  limit?: number;  // Padrão: 5
}
```

**Exemplo de Payload:**
```json
{
  "phone": "5561999999999",
  "transactionType": "venda",
  "propertyType": "casa",
  "budgetMin": 200000000,
  "budgetMax": 500000000,
  "neighborhood": "Lago Sul",
  "limit": 3
}
```

**Resposta:**
```json
{
  "success": true,
  "lead": {
    "id": 1,
    "name": "João Silva",
    "phone": "5561999999999",
    "qualification": "quente"
  },
  "properties": [
    {
      "id": 1,
      "title": "Mansão de Luxo no Lago Sul",
      "description": "Magnífica mansão...",
      "propertyType": "casa",
      "transactionType": "venda",
      "salePrice": 420000000,
      "bedrooms": 6,
      "bathrooms": 8,
      "totalArea": 1200,
      "address": "SHIS QL 10 Conjunto 5",
      "neighborhood": "Lago Sul",
      "mainImage": "https://...",
      "referenceCode": "LS-001",
      "url": "https://casadf.com.br/imovel/1"
    }
  ]
}
```

### Atualizar Qualificação do Lead

#### `integration.updateLeadQualification` (Mutation)
Atualiza qualificação do lead baseado em análise da IA.

**Acesso:** Público

**URL:** `POST /api/trpc/integration.updateLeadQualification`

**Parâmetros:**
```typescript
{
  phone: string;
  qualification: "quente" | "morno" | "frio" | "nao_qualificado";
  buyerProfile?: "investidor" | "primeira_casa" | "upgrade" | "curioso" | "indeciso";
  urgencyLevel?: "baixa" | "media" | "alta" | "urgente";
  notes?: string;
}
```

**Exemplo de Payload:**
```json
{
  "phone": "5561999999999",
  "qualification": "quente",
  "buyerProfile": "investidor",
  "urgencyLevel": "alta",
  "notes": "Cliente demonstrou forte interesse em imóveis de alto padrão. Mencionou orçamento de R$ 5M. Quer visitar imóveis esta semana."
}
```

**Resposta:**
```json
{
  "success": true,
  "leadId": 1
}
```

### Salvar Contexto de IA

#### `integration.saveAiContext` (Mutation)
Salva histórico de conversa para análise da IA.

**Acesso:** Público

**Parâmetros:**
```typescript
{
  sessionId: string;
  phone: string;
  message: string;  // JSON: {type: 'ai'|'user', content: string}
  role: "user" | "assistant" | "system";
}
```

### Buscar Histórico de Conversa

#### `integration.getHistory` (Query)
Retorna histórico de mensagens para contexto da IA.

**Acesso:** Público

**Parâmetros:**
```typescript
{
  sessionId?: string;
  phone?: string;
  limit?: number;  // Padrão: 50
}
```

---

## Exemplos de Integração

### Exemplo 1: Workflow N8N - Captura de Lead

```javascript
// 1. Receber mensagem do WhatsApp
const message = {
  phone: "5561999999999",
  messageId: "unique-id-123",
  content: "Olá, quero comprar uma casa no Lago Sul",
  type: "incoming"
};

await fetch('https://casadf.com.br/api/trpc/integration.whatsappWebhook', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(message)
});

// 2. Salvar lead
const leadData = {
  name: "João Silva",
  phone: "5561999999999",
  message: "Quero comprar uma casa no Lago Sul",
  propertyInterest: "casa",
  budgetRange: "R$ 2M - R$ 5M"
};

await fetch('https://casadf.com.br/api/trpc/integration.saveLeadFromWhatsApp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(leadData)
});

// 3. Buscar imóveis compatíveis
const matchRequest = {
  phone: "5561999999999",
  transactionType: "venda",
  propertyType: "casa",
  neighborhood: "Lago Sul",
  limit: 3
};

const response = await fetch('https://casadf.com.br/api/trpc/integration.matchPropertiesForClient', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(matchRequest)
});

const { properties } = await response.json();

// 4. Enviar imóveis via WhatsApp (usar API do WhatsApp Business)
for (const property of properties) {
  const message = `
🏠 *${property.title}*

📍 ${property.neighborhood}, ${property.city}
💰 R$ ${(property.salePrice / 100).toLocaleString('pt-BR')}
🛏️ ${property.bedrooms} quartos | 🚿 ${property.bathrooms} banheiros
📐 ${property.totalArea}m²

${property.description}

🔗 Ver mais: ${property.url}
  `;
  
  // Enviar via WhatsApp Business API
  await sendWhatsAppMessage(property.phone, message, property.mainImage);
}
```

### Exemplo 2: Workflow N8N - Qualificação Automática

```javascript
// 1. Analisar histórico de mensagens
const history = await fetch('https://casadf.com.br/api/trpc/integration.getHistory?phone=5561999999999');
const messages = await history.json();

// 2. Usar IA para analisar perfil
const analysis = await analyzeWithAI(messages);

// 3. Atualizar qualificação
const qualificationData = {
  phone: "5561999999999",
  qualification: analysis.qualification,  // "quente"
  buyerProfile: analysis.buyerProfile,    // "investidor"
  urgencyLevel: analysis.urgencyLevel,    // "alta"
  notes: analysis.notes
};

await fetch('https://casadf.com.br/api/trpc/integration.updateLeadQualification', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(qualificationData)
});
```

### Exemplo 3: Cadastrar Imóvel via API

```typescript
// Usando tRPC client
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from './server/routers';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'https://casadf.com.br/api/trpc',
    }),
  ],
});

// Criar imóvel
const novoImovel = await trpc.properties.create.mutate({
  title: "Casa Moderna no Park Way",
  description: "Residência contemporânea...",
  propertyType: "casa",
  transactionType: "venda",
  salePrice: 620000000,  // R$ 6.200.000
  bedrooms: 5,
  bathrooms: 6,
  parkingSpaces: 5,
  totalArea: 850,
  address: "Condomínio Park Way",
  neighborhood: "Park Way",
  city: "Brasília",
  state: "DF",
  status: "disponivel",
  isFeatured: true,
  mainImage: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
  referenceCode: "PW-003"
});

console.log('Imóvel criado:', novoImovel.id);
// Imóvel aparece automaticamente na home!
```

---

## 🔐 Segurança

- Rotas protegidas requerem autenticação via Manus OAuth
- Rotas admin requerem `role: "admin"`
- Webhooks públicos registram logs para auditoria
- Todas as operações são registradas no banco de dados

## 📊 Logs e Monitoramento

Todos os webhooks são registrados na tabela `webhook_logs`:

```typescript
{
  source: "n8n" | "whatsapp",
  event: string,
  payload: string,  // JSON
  response: string, // JSON
  status: "success" | "error" | "pending",
  errorMessage?: string,
  createdAt: Date
}
```

Acesse logs via: `integration.getWebhookLogs.query({ limit: 100 })`

---

## 🚀 Próximos Passos

1. Configure seus workflows N8N usando os endpoints acima
2. Teste os webhooks com payloads de exemplo
3. Monitore os logs para garantir funcionamento correto
4. Ajuste a qualificação automática conforme necessário

**Suporte:** Para dúvidas sobre integração, consulte o código-fonte em `/server/routers.ts`
