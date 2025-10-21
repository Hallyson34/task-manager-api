# 🧰 Task Manager API — NestJS + Prisma + PostgreSQL

API do Task Manager construída com **NestJS**, **Prisma ORM** e **PostgreSQL**. O projeto está preparado para:

- 🚀 **Produção com Docker Compose** (sobe **app + banco** e executa **migrations** automaticamente).
- 🧑‍💻 **Desenvolvimento local** com `npm run start:dev` que **já sobe o Postgres via Docker**, executa **migrations**, **seed** e inicia o Nest em **watch mode**.
- 📦 **Geração do cliente Prisma** e execução de `migrate` na subida do app em produção.

---

## 📦 Requisitos

- Node.js 18+ (para desenvolvimento local)
- Docker + Docker Compose
- `npm` (ou `yarn`/`pnpm`)

---

## 🌱 Variáveis de ambiente

### Arquivo `.env` (raiz)

> Usado em **desenvolvimento local** (app rodando no host, banco no Docker).

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_manager?schema=public"
```

> **Observação:** Em produção via Docker Compose, a URL é injetada pelo serviço `app` como:

```
postgresql://postgres:postgres@db:5432/task_manager?schema=public
```

(repare que o host é `db`, o nome do serviço do Postgres).

---

## 🧑‍💻 Desenvolvimento local (App no host + DB via Docker automaticamente)

O script abaixo já existe no seu `package.json`:

```json
"start:dev": "docker compose up -d && npx prisma migrate dev && npx prisma db seed && nest start --watch"
```

### Passo a passo

1. **Instalar dependências e gerar o Prisma Client**

```bash
npm install
npx prisma generate
```

2. **Subir o app em modo desenvolvimento (sobe DB via Docker automaticamente)**

```bash
npm run start:dev
```

Esse comando irá:

- Subir o Postgres com o `docker-compose` da raiz (`docker compose up -d`);
- Executar as **migrations** (`npx prisma migrate dev`);
- Rodar o **seed** (`npx prisma db seed`);
- Iniciar o NestJS em **watch mode** (`nest start --watch`).

A API ficará disponível em: **http://localhost:3001** (ajuste conforme sua configuração).

> ✅ Não é necessário executar `docker compose` manualmente no desenvolvimento comum.

---

## 🐳 (Opcional) Subir App + DB em modo desenvolvimento usando um compose dedicado

Se preferir subir **apenas via Docker Compose** (com o app rodando dentro do container em watch/hot-reload), existe um arquivo de compose dedicado:

- Localização: **`src/config/build/docker-compose-dev.yml`**

Você tem **duas opções**:

### Opção A — Executar a partir da raiz informando o caminho do arquivo

```bash
docker compose -f src/config/build/docker-compose-dev.yml up --build
# parar
docker compose -f src/config/build/docker-compose-dev.yml down
```

### Opção B — (Alternativa) Mover o arquivo para a raiz do projeto

Caso prefira, mova `docker-compose-dev.yml` para a **raiz** e execute:

```bash
docker compose -f docker-compose-dev.yml up --build
# parar
docker compose -f docker-compose-dev.yml down
```

> 💡 Esse modo é opcional e útil para times que preferem rodar **tudo** via Docker em dev, sem Node instalado no host.

---

## 🐳 Produção com Docker Compose (App + DB)

O arquivo **`src/config/build/docker-compose-prod.yml`** contém os serviços de **app** e **db** já configurados para produção. O serviço do app executa automaticamente:

```
npx prisma migrate deploy && npm run start:prod
```

### 1) Estrutura de build (pasta `src/config/build`)

- `docker-compose-prod.yml` (compose de produção)
- `Dockerfile` (imagem multi-stage do Nest)

> Se você mover esses arquivos para outra pasta, ajuste o `build.context` ou rode os comandos a partir dessa pasta.

### 2) Subir produção (com build)

No diretório onde está o `docker-compose-prod.yml`:

```bash
docker compose -f docker-compose-prod.yml up -d --build
```

Isso fará:

- Buildar a imagem do app via `Dockerfile` multi-stage.
- Subir o Postgres (serviço `db`) com volume persistente `postgres_data`.
- Subir o Nest (`app`) e **rodar** `prisma migrate deploy` antes de iniciar.

A API ficará em: **http://localhost:3001**  
O Postgres escutará em **5432** (mapeado no host).

> ⚠️ **Porta 5432 em uso?** Ajuste a linha `- '5432:5432'` no compose de produção se você já tiver outro Postgres rodando localmente.

---

## 📄 Arquivos relevantes

### `docker-compose.yml` (raiz — desenvolvimento do DB pelo script `start:dev`)

### `.env` (raiz — desenvolvimento local)

### `src/config/build/docker-compose-prod.yml` (produção — App + DB)

### `src/config/build/Dockerfile` (imagem multi-stage do Nest)

---

## 🧪 Comandos Prisma úteis

- **Gerar cliente**: `npx prisma generate`
- **Criar/rodar migrations (dev)**: `npx prisma migrate dev`
- **Aplicar migrations (prod)**: `npx prisma migrate deploy`
- **Visualizar DB**: `npx prisma studio`

> Em produção, o `migrate deploy` já é executado automaticamente pelo `command` do serviço `app`.

---

## 🔍 Health-check rápido

- **DB**: `docker logs task_postgres_db` (ou `dev_postgres_db` no dev)
- **App**: `docker logs nest_app`
- **Conexão Prisma**: verifique a `DATABASE_URL` (host `localhost` em dev local; host `db` em produção via compose)

---

## ❓FAQ

**Posso usar portas diferentes para Postgres?**  
Sim. Edite `- '5432:5432'` para algo como `- '5433:5432'` se a 5432 estiver ocupada.

**Preciso do Node instalado em produção?**  
Não. O container do app já contém tudo que precisa.

**Onde configuro a URL do banco em produção?**  
No `docker-compose-prod.yml`, variável `DATABASE_URL` do serviço `app`.

---

## ✅ Resumo

- **Dev (script automatizado):** `npm install` → `npm run start:dev`
- **Dev (compose dedicado opcional):** `docker compose -f src/config/build/docker-compose-dev.yml up --build`
- **Prod:** `docker compose -f src/config/build/docker-compose-prod.yml up -d --build`

## 👨‍💻 Autor

**Hallyson Nobres**  
💼 Desenvolvedor Full-Stack  
📧 [hallysonnobres@gmail.com](mailto:hallysonnobres@gmail.com)  
🌐 [LinkedIn](https://www.linkedin.com/in/hallyson-nobres)

