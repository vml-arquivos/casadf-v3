# 🎯 Imobiliária SaaS - Guia de Setup e Demo

## 📋 Etapas Concluídas

### ✅ ETAPA 1: UPGRADE DO BANCO DE DADOS
- Adicionadas tabelas `contracts` (contratos de aluguel)
- Adicionada tabela `leadInsights` (inteligência de leads)
- Schema atualizado em `drizzle/schema.ts`

### ✅ ETAPA 2: BACKEND (Rotas e Webhooks)
- API Financeira: `GET /api/financial/stats` (totais de receita/despesa)
- API Financeira: `GET /api/financial/transactions` (últimas movimentações)
- Rotas adicionadas ao `financialRouter` em `server/routers.ts`

### ✅ ETAPA 3: FRONTEND (Dashboards e Navegação)
- **Dashboard Financeiro** (`/admin/financial`):
  - Gráfico de Barras: Receita x Repasses x Despesas
  - Tabela de Transações Recentes com badges de status
  - Cards de resumo (Receita, Despesas, Repasses, Lucro Líquido)
  
- **Sidebar Atualizado** (AdminLayout):
  - Link para "Financeiro" com ícone de DollarSign
  - Links claros para: Site, CRM (Leads), Imóveis, Financeiro, Configurações

- **Portal do Proprietário** (`/proprietario`):
  - Visualização de imóveis do proprietário
  - Extrato de transações
  - Resumo de renda mensal

### ✅ ETAPA 4: POPULAÇÃO DE DADOS
- Script de seed: `scripts/seed-full-demo.ts`
- **3 Usuários**:
  - Admin: `admin@imob.com` / `admin123456`
  - Proprietário: `dono@teste.com` / `dono123456`
  - Inquilino: `inquilino@teste.com` / `inquilino123456`

- **6 Imóveis**:
  - 3 para Venda (Apartamento, Casa, Cobertura)
  - 3 para Aluguel (Apartamento, Kitnet, Casa Comercial)

- **10 Leads** com status variados:
  - Novo, Qualificado, Em Negociação, Fechado, etc.

- **2 Contratos Ativos**:
  - Geram transações mensais automaticamente

- **6 Meses de Transações**:
  - Receitas de aluguel
  - Despesas de manutenção
  - Repasses ao proprietário
  - Dados preenchidos para visualização em gráficos

- **3 Insights de Leads** com IA

## 🚀 Como Executar

### 1. Instalar Dependências
```bash
cd /home/ubuntu/imobiliaria-saas-main
pnpm install
```

### 2. Configurar Banco de Dados
```bash
# Criar banco de dados MySQL
mysql -u root -e "CREATE DATABASE IF NOT EXISTS imobiliaria_saas;"

# Executar migrações
pnpm run db:push
```

### 3. Popular Banco com Dados de Demo
```bash
pnpm run db:seed
# ou
pnpm run seed
```

### 4. Iniciar Servidor Backend
```bash
# Terminal 1 - Backend (porta 5000)
pnpm run dev
```

### 5. Iniciar Cliente Frontend
```bash
# Terminal 2 - Frontend (porta 5173)
cd client
pnpm run dev
```

## 🌐 URLs de Acesso

### Site Principal (Vitrine)
- **URL**: http://localhost:5173
- Visualize imóveis, blog, informações

### Painel Admin
- **URL**: http://localhost:5173/admin
- **Login**: admin@imob.com / admin123456
- **Funcionalidades**:
  - Dashboard com métricas
  - Gestão de Imóveis
  - CRM de Leads
  - **Dashboard Financeiro** (novo!) → http://localhost:5173/admin/financial
  - Analytics
  - Blog
  - Configurações

### Portal do Proprietário
- **URL**: http://localhost:5173/proprietario
- **Login**: dono@teste.com / dono123456
- Visualize seus imóveis e extrato

## 📊 Dashboard Financeiro

O novo Dashboard Financeiro oferece:

### Visualizações
1. **Cards de Resumo**:
   - Receita Total
   - Despesas
   - Repasses
   - Lucro Líquido

2. **Gráfico de Barras**:
   - Comparação de Receita x Repasses x Despesas
   - Dados dos últimos 6 meses

3. **Tabela de Transações**:
   - Últimas 10 transações
   - Status (Pendente, Pago, Cancelado)
   - Tipo (Receita, Despesa, Repasse)
   - Data e valor

### Dados de Exemplo
- **Receita Mensal**: R$ 8.000 (aluguel de 2 imóveis)
- **Despesas**: R$ 500 (manutenção)
- **Repasses**: R$ 6.400 (80% da receita ao proprietário)
- **Lucro Líquido**: R$ 1.100

## 🔐 Credenciais de Teste

| Usuário | Email | Senha | Acesso |
|---------|-------|-------|--------|
| Admin | admin@imob.com | admin123456 | Painel Completo |
| Proprietário | dono@teste.com | dono123456 | Portal Proprietário |
| Inquilino | inquilino@teste.com | inquilino123456 | Contatos |

## 📁 Arquivos Modificados

### Backend
- `drizzle/schema.ts` - Novas tabelas (contracts, leadInsights)
- `server/routers.ts` - Novas rotas financeiras
- `package.json` - Scripts de seed

### Frontend
- `client/src/pages/admin/FinancialDashboard.tsx` - Dashboard Financeiro (novo)
- `client/src/pages/OwnerPortal.tsx` - Portal do Proprietário (novo)
- `client/src/components/AdminLayout.tsx` - Link para Financeiro
- `client/src/App.tsx` - Rotas para Financial e OwnerPortal

### Scripts
- `scripts/seed-full-demo.ts` - Script de população de dados (novo)

## 🎬 Próximas Etapas (Opcional)

1. **Webhooks N8N**: Implementar integração com N8N para automação
2. **Relatórios PDF**: Gerar relatórios financeiros em PDF
3. **Exportação Excel**: Exportar transações e relatórios
4. **Notificações**: Alertas de transações pendentes
5. **Agendamento**: Agendamento automático de transações recorrentes

## 📝 Notas

- O banco de dados usa MySQL com Drizzle ORM
- Todas as senhas de teste são hash com bcrypt
- Os dados de seed são gerados com datas realistas
- Gráficos usam Recharts para visualização
- Interface usa Tailwind CSS e componentes Shadcn/UI

## ❓ Troubleshooting

### Erro de Conexão MySQL
```bash
# Verifique se MySQL está rodando
sudo systemctl start mysql

# Ou use Docker
docker-compose up -d mysql
```

### Erro de Migração
```bash
# Regenerar migrações
pnpm run db:push --force
```

### Porta Já em Uso
```bash
# Mudar porta no .env
PORT=5001
```

---

**Status**: ✅ Pronto para Demo
**Data**: 26 de Dezembro de 2025
**Versão**: 1.0.0
