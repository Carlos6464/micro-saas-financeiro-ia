# 💰 Micro SaaS Financeiro com IA

![Nx](https://img.shields.io/badge/Nx-Blue?style=for-the-badge&logo=nx&logoColor=white) ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

> Uma plataforma de gestão financeira inteligente baseada em microsserviços, integrando análise de dados e Inteligência Artificial.

---

## 🏗 Arquitetura do Projeto

Este projeto utiliza uma arquitetura de **Monorepo** gerenciada pelo **Nx**, dividida em microsserviços para garantir escalabilidade e modularidade.

### 🧩 Microsserviços (`apps/`)

| Serviço              | Tecnologia | Descrição                                                     |
| :-------------------- | :--------- | :-------------------------------------------------------------- |
| **API Gateway** | NestJS     | Ponto de entrada único para todas as requisições externas.   |
| **Auth**        | NestJS     | Gerencia autenticação, autorização e tokens JWT.            |
| **Users**       | NestJS     | Gestão de dados e perfis de usuários.                         |
| **Finance**     | NestJS     | Core financeiro (transações, contas, saldos).                 |
| **IA Service**  | Python     | Serviço dedicado para processamento de IA e análise de dados. |

### 📚 Bibliotecas Compartilhadas (`libs/`)

- **Common**: Utilitários, filtros de exceção, interceptors e loggers compartilhados.
- **Contracts**: Interfaces e DTOs para garantir a tipagem entre serviços.
- **Database**: Configurações de conexão (TypeORM), migrações e entidades base.

---

## 🚀 Tecnologias Utilizadas

O ecossistema do projeto é composto por:

- **Backend (Node.js):** [NestJS](https://nestjs.com/) (Framework principal), [TypeORM](https://typeorm.io/) (ORM).
- **IA & Data (Python):** Python integrado via `@nxlv/python`.
- **Banco de Dados:** [MySQL 8.0](https://www.mysql.com/) (Armazenamento persistente).
- **Cache & Mensageria:** [Redis](https://redis.io/) (Cache e comunicação assíncrona).
- **Infraestrutura:** [Docker](https://www.docker.com/) & Docker Compose.
- **Ferramentas:** [Husky](https://typicode.github.io/husky/) (Git Hooks), [Commitlint](https://commitlint.js.org/) (Padronização de commits), [Jest](https://jestjs.io/) (Testes).

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

* [Node.js](https://nodejs.org/) (v20+)
* [Docker](https://www.docker.com/) e Docker Compose
* [Python](https://www.python.org/) (v3.10+ para o serviço de IA)

---

## 🛠 Instalação e Configuração

1. **Clone o repositório:**

   ```bash
   git clone [https://github.com/carlos6464/micro-saas-financeiro-ia.git](https://github.com/carlos6464/micro-saas-financeiro-ia.git)
   cd micro-saas-financeiro-ia
   ```
2. **Instale as dependências do projeto:**

   ```bash
   npm install
   ```
3. **Configuração de Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto. Você pode usar o `.env.example` como base (se houver) ou configurar conforme o `docker-compose.yml`:

   ```env
   DB_PASS=sua_senha_segura
   DB_PORT=3306
   REDIS_PORT=6379
   ```

---

## 🐳 Executando a Infraestrutura (Docker)

O projeto possui um arquivo `docker-compose.yml` configurado para subir o banco de dados e o cache.

```bash
# Iniciar MySQL e Redis em segundo plano
docker-compose up -d
```


## ▶️ Executando os Serviços

Com o Nx, você pode rodar os serviços individualmente ou em paralelo.

### Modo Desenvolvimento

```bash
# Rodar o API Gateway (Ponto de entrada)
npx nx serve api-gateway

# Rodar o serviço de Autenticação
npx nx serve auth

# Rodar o serviço Financeiro
npx nx serve finance

# Rodar todos os serviços (se configurado no nx.json)
npx nx run-many --target=serve --all
```


## 🗄 Migrações de Banco de Dados

Utilizamos o **TypeORM** para gerenciar o esquema do banco de dados. Os comandos estão configurados no `package.json`:

```bash
# Gerar uma nova migration (baseada nas alterações das entidades)
npm run migration:generate --name=NomeDaMudanca

# Executar as migrations pendentes (atualizar o banco)
npm run migration:run

# Reverter a última migration
npm run migration:revert
```


## 🧪 Testes

Para garantir a qualidade do código:

```
# Executar testes unitários de todos os projetos
npx nx run-many --target=test --all

# Executar testes de um serviço específico
npx nx test finance

```


## 🤝 Contribuição

Este projeto segue o padrão  **Conventional Commits** . Ao realizar um commit, certifique-se de seguir o formato:

* `feat: adiciona nova funcionalidade de relatórios`
* `fix: corrige erro no login`
* `docs: atualiza documentação`

O **Husky** irá verificar a mensagem do commit antes de permitir a confirmação.

---

## 📝 Licença

Este projeto está licenciado sob a licença [MIT](https://www.google.com/search?q=./LICENSE).
