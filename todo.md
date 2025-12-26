# TODO - Casa DF

## Fase 1: Schema do Banco de Dados e Estrutura Inicial

- [x] Criar tabela de imóveis (properties)
- [x] Criar tabela de leads/clientes (leads)
- [x] Criar tabela de interações/histórico (interactions)
- [x] Criar tabela de blog posts (blog_posts)
- [x] Criar tabela de categorias de blog (blog_categories)
- [x] Criar tabela de configurações do site (site_settings)
- [x] Executar migrations do banco de dados

## Fase 2: Front-end Premium Estilo Christie's

- [x] Configurar paleta de cores premium (preto, branco, dourado)
- [x] Adicionar fontes serifadas (Playfair Display) e sans-serif (Inter)
- [x] Criar Hero Section com busca integrada
- [x] Criar Header/Navbar premium
- [x] Criar Footer elegante
- [x] Criar página Home com seções principais
- [ ] Criar página Quem Somos
- [ ] Criar página de Contato
- [ ] Criar vitrine de imóveis (grid premium)
- [ ] Criar página de detalhes do imóvel
- [ ] Criar seção de Blog
- [ ] Criar página individual de post do blog
- [ ] Implementar responsividade mobile-first

## Fase 3: CRM Completo

- [x] Criar helpers do banco de dados para todas as tabelas
- [x] Criar routers tRPC para imóveis
- [x] Criar routers tRPC para leads
- [x] Criar routers tRPC para interações
- [x] Criar routers tRPC para blog
- [x] Criar routers tRPC para configurações
- [x] Criar dashboard administrativo
- [x] Implementar gestão de imóveis (CRUD)
- [ ] Implementar upload de fotos de imóveis
- [x] Implementar gestão de leads (CRUD)
- [x] Criar pipeline de vendas (Kanban)
- [x] Criar layout do admin com sidebar
- [x] Implementar histórico de interações
- [x] Criar formulário de captura de leads
- [ ] Implementar notificações de novos leads
- [x] Criar relatórios e dashboards
- [x] Implementar filtros avançados de busca

## Fase 4: Funcionalidades Avançadas

- [ ] Integrar chatbot com IA
- [ ] Criar webhooks para N8N
- [ ] Implementar integração com portais (ZAP, VivaReal)
- [ ] Criar módulo financeiro (propostas, comissões)
- [ ] Implementar sistema de tags para imóveis
- [ ] Criar sistema de favoritos
- [ ] Implementar compartilhamento social
- [ ] Adicionar Google Maps para localização
- [ ] Criar tour virtual 360° (opcional)
- [ ] Implementar busca por voz (opcional)

## Fase 5: Testes e Qualidade

- [x] Criar testes unitários para procedures principais
- [x] Testar fluxo completo de captura de leads
- [x] Testar CRUD de imóveis
- [ ] Testar responsividade em diferentes dispositivos
- [ ] Validar acessibilidade
- [ ] Otimizar performance de imagens
- [x] Popular banco de dados com dados de exemplo
- [x] Criar checkpoint final

## Melhorias Futuras (Backlog)

- [ ] Sistema de agendamento de visitas
- [ ] Integração com WhatsApp Business API
- [ ] Sistema de avaliação de imóveis
- [ ] Calculadora de financiamento
- [ ] Área do cliente (portal)
- [ ] Sistema de referências/indicações
- [ ] Integração com CRM externo (RD Station, HubSpot)

## Correções Urgentes (Solicitadas pelo Usuário)

- [x] Trocar fontes Playfair Display para Montserrat/Poppins
- [x] Adicionar logotipo do Casa DF no header
- [x] Corrigir headers duplicados
- [x] Melhorar dashboard administrativo com análise de clientes
- [x] Criar níveis de análise de clientes (perfis)
- [x] Organizar clientes por categorias para análise de IA
- [x] Testar todas as correções
- [x] Criar checkpoint com correções

## Novos Ajustes Solicitados

- [x] Colocar background preto no hero section
- [x] Colocar fundo preto no header
- [x] Garantir que todos os títulos usem fonte Montserrat
- [x] Adicionar foto do Casa DF na página
- [x] Adicionar link para Dashboard CRM no header
- [x] Testar ajustes
- [x] Criar checkpoint final

## Sistema de Upload de Imóveis com Galeria

- [x] Criar tabela de imagens de imóveis no schema
- [x] Adicionar routers tRPC para upload de imagens
- [x] Integrar com S3 para armazenamento
- [x] Criar interface de upload múltiplo no admin
- [x] Implementar galeria de fotos com preview
- [x] Adicionar funcionalidade de deletar imagens
- [x] Definir imagem principal/destaque
- [x] Criar carrossel de fotos na página pública
- [x] Testar upload e visualização
- [x] Criar checkpoint final

## Página de Detalhes do Imóvel

- [x] Criar página de detalhes com rota dinâmica
- [x] Implementar galeria de fotos com lightbox
- [x] Adicionar seção de características do imóvel
- [x] Integrar mapa de localização (Google Maps)
- [x] Criar formulário de agendamento de visita
- [x] Salvar agendamentos como leads no CRM
- [x] Adicionar botões de compartilhamento social
- [ ] Implementar carrossel de imóveis relacionados
- [x] Criar testes para a nova funcionalidade
- [x] Criar checkpoint final

## Página de Vitrine de Imóveis

- [x] Criar página de vitrine com listagem completa
- [x] Implementar filtros por tipo de imóvel
- [x] Implementar filtros por bairro
- [x] Implementar filtros por finalidade (venda/locação)
- [x] Adicionar ordenação por preço
- [x] Criar visualização em grid responsivo
- [ ] Adicionar paginação
- [x] Mostrar contador de resultados
- [x] Adicionar botão de limpar filtros
- [x] Criar testes para filtros
- [x] Criar checkpoint final

## Sistema de Blog

- [x] Criar página de listagem de posts do blog
- [x] Implementar filtro por categorias
- [x] Adicionar busca por palavras-chave
- [x] Criar página individual de artigo
- [x] Adicionar compartilhamento social nos artigos
- [ ] Mostrar posts relacionados
- [ ] Criar área administrativa para gerenciar posts
- [ ] Implementar CRUD de posts no admin
- [ ] Implementar CRUD de categorias no admin
- [ ] Adicionar editor de texto rico para posts
- [x] Criar testes para o blog
- [x] Criar checkpoint final

## CRM Completo e Profissional

### Schema e Backend
- [x] Atualizar schema de leads com novos campos (clientType, qualification, leadSource, propertyInterest)
- [x] Adicionar enum para tipo de cliente (Comprador, Locatário, Proprietário)
- [x] Adicionar enum para qualificação (Quente, Morno, Frio, Não Qualificado)
- [x] Adicionar enum para origem do lead (WhatsApp, Site, Campanha, Indicação)
- [x] Adicionar campos de análise (budgetRange, preferredNeighborhoods, urgencyLevel)
- [ ] Atualizar routers com novos filtros e análises

### Dashboard e Funil
- [x] Criar funil visual de vendas (Kanban melhorado)
- [x] Implementar etapas: Novo Lead → Contato Inicial → Qualificação → Visita → Proposta → Negociação → Fechado/Perdido
- [x] Criar cards de análise por perfil de cliente
- [x] Mostrar distribuição por qualificação (Quente/Morno/Frio)
- [x] Criar gráficos de origem dos leads
- [ ] Implementar filtros por tipo de cliente e qualificação

### Gestão de Leads Avançada
- [x] Criar formulário completo de cadastro de lead com todos os campos
- [x] Implementar edição de perfil do cliente
- [x] Adicionar histórico de interações detalhado
- [x] Criar sistema de tags/etiquetas
- [ ] Implementar busca avançada por múltiplos critérios
- [x] Adicionar notas e observações por lead

### Testes e Entrega
- [x] Criar testes para novos campos e funcionalidades
- [x] Testar funil completo
- [x] Criar checkpoint final

## Integração WhatsApp + N8N + IA

### Análise e Planejamento
- [x] Analisar workflow Lívia 3.0 (atendente IA)
- [x] Analisar workflow Google Calendar
- [x] Analisar workflow Escalar Humano
- [x] Analisar workflow Enviar Agendamento
- [x] Analisar workflow Salvar no Banco
- [x] Analisar workflow Buscar Histórico
- [x] Planejar arquitetura de integração

### Endpoints e Webhooks
- [x] Criar endpoint webhook para receber mensagens do WhatsApp
- [x] Criar endpoint para salvar leads do N8N
- [x] Criar endpoint para salvar interações/mensagens
- [x] Criar endpoint para buscar histórico do cliente
- [x] Criar endpoint para atualizar status do lead
- [x] Criar endpoint para agendamento de visitas

### Sistema de Interações
- [x] Criar tabela de mensagens/conversas no banco
- [x] Implementar histórico completo de interações
- [ ] Criar visualização de conversas no CRM
- [ ] Adicionar timeline de atividades por lead

### Interface de Configuração
- [ ] Criar página de configurações de integração
- [ ] Adicionar campos para tokens e credenciais
- [ ] Criar documentação de integração
- [ ] Adicionar logs de webhooks

### Testes e Entrega
- [x] Testar webhook do WhatsApp
- [x] Testar salvamento automático de leads
- [x] Testar busca de histórico
- [x] Criar checkpoint final


## Visualização de Mensagens WhatsApp no CRM

- [x] Criar componente de timeline de mensagens
- [x] Implementar distinção visual entre mensagens do cliente e da IA
- [x] Adicionar timestamps e metadados
- [x] Integrar timeline na página de edição de lead
- [x] Adicionar busca de mensagens
- [x] Mostrar contexto de IA associado
- [x] Criar testes
- [x] Criar checkpoint final

## Formulário de Cadastro de Imóveis

- [x] Criar página de novo imóvel com formulário completo
- [x] Adicionar campos: título, descrição, tipo, finalidade, preço, quartos, banheiros, metragem, endereço, bairro
- [x] Implementar upload de múltiplas imagens com preview
- [x] Adicionar validação de campos obrigatórios
- [x] Criar botão "Novo Imóvel" na página de listagem
- [x] Testar cadastro completo de imóvel

## Classificação Automática de Clientes

- [x] Melhorar algoritmo de classificação automática por perfil
- [x] Implementar análise inteligente de qualificação (Quente/Morno/Frio)
- [x] Adicionar sugestões de ação para cada tipo de cliente
- [x] Criar indicadores visuais de prioridade

## Sistema de Destaques e Automação

- [x] Adicionar checkbox "Imóvel em Destaque" no formulário de cadastro
- [x] Garantir que imóveis cadastrados apareçam automaticamente na home
- [x] Criar seção de imóveis em destaque na página principal

## Painel CRM Avançado para Gestão de Clientes

- [x] Criar página de gestão de clientes com segmentação (Novos/Antigos)
- [x] Implementar filtros por temperatura (Quente/Morno/Frio)
- [x] Adicionar seção de clientes para envio programado de mensagens
- [x] Criar sistema de matching automático (perfil do cliente x imóveis disponíveis)
- [x] Implementar painel de ações da IA (análise e envio automatizado)
- [x] Adicionar dashboard de acompanhamento de interações

## Sistema de Follow-up Automático

- [x] Criar endpoint backend para identificar clientes quentes sem interação há 3+ dias
- [x] Implementar cálculo de dias desde última interação
- [x] Criar painel de Follow-up Automático no CRM
- [x] Adicionar lista de clientes que precisam de atenção urgente
- [x] Implementar botão de ação rápida para enviar follow-up
- [x] Criar sistema de alertas visuais no dashboard
- [x] Adicionar badge de notificação no menu lateral
- [x] Preparar integração com webhook N8N para disparo automático

## Expansão da Home e Landing Pages

- [x] Expandir seção de imóveis na home (mostrar mais cards)
- [x] Adicionar seção de blog na home com artigos recentes
- [x] Criar página individual de imóvel (/imovel/:id) como landing page
- [x] Implementar galeria de fotos na página do imóvel
- [x] Adicionar mapa de localização na página do imóvel
- [x] Criar formulário de contato na página do imóvel
- [x] Implementar SEO otimizado (meta tags, Open Graph, Schema.org)
- [x] Adicionar imóveis de exemplo com fotos fictícias
- [x] Garantir que cadastro de imóvel publique automaticamente na home
- [ ] Criar sistema de gestão de blog no dashboard admin

## Sistema Completo de Blog

- [x] Criar tabela blog_posts no banco de dados (schema)
- [x] Implementar rotas backend tRPC (create, update, delete, list, getById)
- [x] Criar página de listagem de posts no dashboard
- [x] Criar página de novo post no dashboard
- [x] Criar página de edição de post no dashboard
- [x] Implementar upload de imagem de capa
- [x] Adicionar sistema de categorias
- [x] Integrar posts automaticamente na home
- [x] Criar página pública de visualização de post (/blog/:slug)
- [x] Testar CRUD completo de blog

## Sistema de Cadastro de Proprietários

- [x] Criar tabela owners no banco de dados
- [x] Implementar rotas backend tRPC (create, update, delete, list, getById)
- [ ] Criar página de listagem de proprietários no dashboard
- [ ] Criar página de novo/editar proprietário
- [ ] Vincular proprietários aos imóveis
- [x] Testar CRUD completo de proprietários

## Webhooks N8N para Automação

- [x] Criar endpoint /api/webhook/lead-capture (receber novos leads)
- [x] Criar endpoint /api/webhook/message-received (histórico de mensagens)
- [x] Criar endpoint /api/webhook/send-properties (enviar imóveis compatíveis)
- [x] Implementar logs de webhook no banco
- [x] Criar sistema de qualificação automática por histórico
- [x] Testar webhooks com payloads de exemplo

## Documentação de Rotas

- [ ] Criar página /admin/api-docs no dashboard
- [x] Documentar todas as rotas de imóveis
- [x] Documentar todas as rotas de leads/clientes
- [x] Documentar webhooks N8N com exemplos
- [x] Adicionar exemplos de payloads JSON
- [x] Criar guia de integração passo a passo

## Sistema de Busca Funcional na Home

- [x] Implementar lógica de busca com query params na URL
- [x] Conectar filtros (Finalidade, Tipo, Bairro) ao backend tRPC
- [x] Adicionar estados de loading durante busca
- [x] Implementar resultados dinâmicos com atualização automática
- [x] Criar URLs compartilháveis para campanhas
- [x] Adicionar contador de resultados encontrados
- [x] Implementar estado vazio quando não há resultados
- [x] Testar busca com diferentes combinações de filtros

## Preparação para Deploy no GitHub

- [x] Criar README.md completo com instruções de instalação e deploy
- [x] Criar ENV_SETUP.md com todas as variáveis de ambiente necessárias
- [x] Criar DEPLOY.md com guia passo a passo para Vercel/Railway
- [x] Criar .gitignore adequado para o projeto
- [x] Documentar estrutura de pastas completa (PROJECT_STRUCTURE.md)
- [x] Criar guia de configuração do banco de dados
- [x] Adicionar scripts de inicialização no package.json
- [x] Verificar que todos os arquivos essenciais estão presentes

## Correções Finais

- [x] Corrigir import da tabela owners no db.ts
- [x] Garantir que todos os testes principais passem (28/28 passando)
- [x] Verificar que todas as rotas backend estão funcionando
- [x] Confirmar integração frontend ↔ backend ↔ database

## Preparação Final para GitHub

- [x] Criar página Quem Somos completa com sobre a Casa DF
- [x] Verificar todas as conexões backend↔frontend
- [x] Criar guia GITHUB_UPLOAD.md com instruções passo a passo
- [x] Confirmar que projeto está pronto para download

## Sistema de Analytics e Métricas

- [x] Criar tabela analytics_events (rastreamento de ações)
- [x] Criar tabela campaign_sources (origem dos leads)
- [x] Criar tabela reviews (avaliações de clientes)
- [x] Implementar rotas backend de analytics
- [x] Criar dashboard de métricas no admin
- [x] Adicionar gráficos de ROI por campanha
- [x] Implementar relatórios de performance por imóvel
- [x] Criar análise de estágio do cliente

## Sistema Financeiro

- [x] Criar tabela transactions (transações financeiras)
- [x] Criar tabela commissions (comissões por venda)
- [x] Implementar rotas backend financeiras
- [x] Criar dashboard financeiro no admin
- [x] Adicionar relatórios de faturamento
- [x] Implementar previsão de receita (pipeline)
- [x] Criar histórico de pagamentos

## Melhorias no Frontend

- [x] Adicionar hero section premium com imagem de mansão
- [x] Criar seção de avaliações de clientes na home
- [x] Melhorar página de blog
- [x] Conectar formulário de contato ao CRM
- [x] Garantir que todas as páginas buscam dados do backend

## Correção de Erro e Melhorias Visuais

- [x] Corrigir erro do react-helmet-async (HelmetProvider não configurado)
- [x] Melhorar home com mais imóveis visíveis
- [x] Garantir que página de detalhes funciona ao clicar nos cards
- [x] Testar fluxo completo

## Correção de Imagens dos Imóveis

- [x] Verificar por que imagens não estão aparecendo nos cards
- [x] Corrigir renderização de imagens na home (mudado de backgroundImage para tag <img>)
- [x] Garantir que fotos do Unsplash carregam corretamente

## Melhorias de Layout e Otimização

- [ ] Limpar banco de dados deixando apenas 3-5 imóveis de exemplo
- [ ] Melhorar layout dos cards de imóveis (espaçamento, padding, margem)
- [ ] Garantir que imagens aparecem corretamente (não gradiente roxo)
- [ ] Otimizar página de detalhes com layout perfeito
- [ ] Corrigir layout do dashboard admin (padding e margem)
- [ ] Verificar conexão completa backend ↔ frontend ↔ banco

## Correções de Layout e Imagens (Sessão Atual)

- [x] Remover bordas vermelhas de debug do Dashboard
- [x] Remover bordas vermelhas dos cards de Follow-up
- [x] Melhorar espaçamento das páginas administrativas
- [x] Cadastrar 5 imóveis de exemplo no banco de dados
- [x] Corrigir renderização de imagens nos cards (usar array images quando mainImage não existir)
- [x] Testar visualização de imagens na home
- [x] Garantir que fotos do Unsplash aparecem corretamente
- [x] Criar checkpoint final com todas as correções

## Preparação Completa para Produção e GitHub

- [x] Criar Dockerfile otimizado para produção
- [x] Criar docker-compose.yml com todos os serviços (app, database)
- [x] Criar .dockerignore para otimizar build
- [x] Criar ENV_VARIABLES.md com todas as variáveis necessárias
- [x] Criar scripts de build (build.sh)
- [x] Criar scripts de deploy (deploy.sh)
- [x] Criar documentação DOCKER_DEPLOY.md
- [x] Atualizar README.md com instruções Docker
- [x] Verificar que todos os arquivos estão completos (sem mocks)
- [x] Verificar que todas as rotas tRPC estão implementadas
- [x] Verificar que todos os componentes React estão completos
- [x] Testar build do Docker localmente (Frontend: 1.28MB, Backend: 90KB)
- [x] Criar checkpoint final production-ready
