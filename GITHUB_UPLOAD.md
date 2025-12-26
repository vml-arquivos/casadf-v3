# 📤 Guia Completo de Upload para GitHub

Este guia fornece instruções passo a passo para fazer upload do projeto **Casa DF** para o GitHub.

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter:

1. ✅ Conta no GitHub ([criar conta](https://github.com/signup))
2. ✅ Git instalado no seu computador ([baixar Git](https://git-scm.com/downloads))
3. ✅ Projeto baixado do painel Manus (botão "Code" → "Download all files")

---

## 📦 Passo 1: Criar Repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login
2. Clique no botão **"+"** no canto superior direito
3. Selecione **"New repository"**
4. Preencha os dados:
   - **Repository name:** `casadf`
   - **Description:** "Site profissional de imóveis de luxo em Brasília - Casa DF"
   - **Visibility:** Escolha **Private** (recomendado) ou **Public**
   - ⚠️ **NÃO** marque "Initialize this repository with a README"
5. Clique em **"Create repository"**

---

## 💻 Passo 2: Preparar Projeto Localmente

### 2.1. Extrair Arquivos

```bash
# Extrair o ZIP baixado do Manus
unzip casadf.zip
cd casadf
```

### 2.2. Verificar Estrutura

Certifique-se de que a estrutura está correta:

```
casadf/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas públicas e admin
│   │   ├── components/    # Componentes reutilizáveis
│   │   └── lib/           # Utilitários e tRPC
│   └── index.html
├── server/                 # Backend tRPC
│   ├── routers.ts         # Todas as rotas da API
│   ├── db.ts              # Funções do banco de dados
│   └── _core/             # Infraestrutura
├── drizzle/               # Schema do banco de dados
│   └── schema.ts
├── package.json
├── README.md
├── DEPLOY.md
├── API_DOCUMENTATION.md
└── .gitignore
```

---

## 🚀 Passo 3: Fazer Upload para GitHub

### 3.1. Inicializar Git

```bash
# Navegar até a pasta do projeto
cd casadf

# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "Initial commit: Sistema completo de imóveis de luxo"
```

### 3.2. Conectar ao Repositório Remoto

```bash
# Substituir SEU_USUARIO pelo seu username do GitHub
git remote add origin https://github.com/SEU_USUARIO/casadf.git

# Verificar se foi adicionado corretamente
git remote -v
```

### 3.3. Enviar Código para GitHub

```bash
# Renomear branch para main (se necessário)
git branch -M main

# Fazer push para o GitHub
git push -u origin main
```

---

## 🔐 Passo 4: Configurar Secrets (Opcional)

Se você quiser usar GitHub Actions para CI/CD, adicione os secrets:

1. No repositório do GitHub, vá em **Settings** → **Secrets and variables** → **Actions**
2. Clique em **"New repository secret"**
3. Adicione os seguintes secrets:

| Secret Name | Descrição |
|-------------|-----------|
| `DATABASE_URL` | URL de conexão do MySQL/TiDB |
| `JWT_SECRET` | Chave secreta para JWT |
| `AWS_ACCESS_KEY_ID` | Chave de acesso S3 |
| `AWS_SECRET_ACCESS_KEY` | Chave secreta S3 |
| `AWS_REGION` | Região S3 (ex: `us-east-1`) |
| `AWS_BUCKET_NAME` | Nome do bucket S3 |

---

## 📝 Passo 5: Atualizar README.md

Edite o `README.md` com informações específicas do seu projeto:

```bash
# Abrir README.md no editor
nano README.md
# ou
code README.md
```

Atualize:
- URL do repositório
- Informações de contato
- Instruções de deploy específicas
- Screenshots do projeto

---

## 🔄 Passo 6: Fazer Atualizações Futuras

Sempre que fizer alterações no código:

```bash
# Verificar arquivos modificados
git status

# Adicionar arquivos modificados
git add .

# Fazer commit com mensagem descritiva
git commit -m "Descrição das alterações"

# Enviar para GitHub
git push origin main
```

---

## 🌐 Passo 7: Deploy em Produção

Após o código estar no GitHub, você pode fazer deploy em:

### Opção 1: Vercel (Recomendado para Next.js/React)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Import Project"**
3. Selecione seu repositório `casadf`
4. Configure as variáveis de ambiente
5. Clique em **"Deploy"**

### Opção 2: Railway (Recomendado para fullstack)

1. Acesse [railway.app](https://railway.app)
2. Clique em **"New Project"** → **"Deploy from GitHub repo"**
3. Selecione `casadf`
4. Adicione banco MySQL no mesmo projeto
5. Configure variáveis de ambiente
6. Deploy automático!

### Opção 3: VPS (Controle total)

Consulte o arquivo `DEPLOY.md` para instruções detalhadas de deploy em VPS.

---

## 🐛 Solução de Problemas

### Erro: "remote: Permission denied"

**Solução:** Configure suas credenciais do GitHub:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### Erro: "fatal: not a git repository"

**Solução:** Você não está na pasta correta. Navegue até a pasta do projeto:

```bash
cd /caminho/para/casadf
```

### Erro: "! [rejected] main -> main (fetch first)"

**Solução:** Alguém fez alterações no repositório remoto. Faça pull primeiro:

```bash
git pull origin main --rebase
git push origin main
```

---

## 📚 Recursos Adicionais

- [Documentação Git](https://git-scm.com/doc)
- [Guia GitHub](https://guides.github.com)
- [Deploy Vercel](https://vercel.com/docs)
- [Deploy Railway](https://docs.railway.app)

---

## ✅ Checklist Final

Antes de considerar o upload completo, verifique:

- [ ] Repositório criado no GitHub
- [ ] Código enviado com sucesso (`git push`)
- [ ] README.md atualizado com informações corretas
- [ ] `.env` **NÃO** foi commitado (verificar `.gitignore`)
- [ ] Secrets configurados (se necessário)
- [ ] Deploy em produção funcionando
- [ ] Domínio personalizado configurado (opcional)

---

## 🎉 Pronto!

Seu projeto está agora no GitHub e pronto para ser compartilhado, versionado e deployado!

**Próximos passos:**
1. Configurar domínio personalizado (ex: `casadf.com.br`)
2. Configurar Google Analytics e Meta Pixel
3. Criar página "Quem Somos" com conteúdo real
4. Adicionar imóveis reais ao banco de dados
5. Conectar webhooks N8N para automação

---

**Precisa de ajuda?** Consulte os arquivos `DEPLOY.md` e `API_DOCUMENTATION.md` para mais detalhes.
