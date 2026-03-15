# Workspace — Next.js + Prisma + PostgreSQL

Personal workspace with Tasks, Calendar, Library, Collection, and Daily Learn.

---

## 🐳 Run with Docker (recommended)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)

### 1. Clone / unzip the project

```bash
cd my-app
```

### 2. Start everything

```bash
docker compose up --build
```

Docker will:

1. Pull `postgres:16-alpine`
2. Build the Next.js app image
3. Wait for PostgreSQL to be healthy
4. Run database migrations automatically
5. Seed the database with sample data
6. Start the app on **http://localhost:3000**

### 3. Open the app

```
http://localhost:3000
```

---

## 🔧 Docker commands

| Command                                              | Description                     |
| ---------------------------------------------------- | ------------------------------- |
| `docker compose up --build`                          | First run — build image + start |
| `docker compose up`                                  | Start (image already built)     |
| `docker compose up -d`                               | Start in background             |
| `docker compose down`                                | Stop containers                 |
| `docker compose down -v`                             | Stop + delete database volume   |
| `docker compose logs -f app`                         | Stream app logs                 |
| `docker compose logs -f db`                          | Stream database logs            |
| `docker compose exec app sh`                         | Shell into app container        |
| `docker compose exec db psql -U workspace workspace` | Open psql                       |

---

## ⚙️ Configuration

Edit `.env` to change credentials:

```env
POSTGRES_USER=workspace
POSTGRES_PASSWORD=workspace_pass
POSTGRES_DB=workspace
```

The `DATABASE_URL` is built automatically inside `docker-compose.yml`.

---

## 💻 Local development (without Docker)

### Prerequisites

- Node.js 20+
- PostgreSQL running locally (or use `docker compose up db` to run just the database)

### Setup

```bash
# Install dependencies
npm install

# Copy env
cp .env.local .env.local   # Already set to localhost:5432

# Push schema + generate client
npx prisma db push

# Seed
npm run db:seed

# Start dev server
npm run dev
```

App runs at **http://localhost:3000**

### To run only the database in Docker (for local dev):

```bash
docker compose up db -d
```

Then run `npm run dev` locally — it connects to `localhost:5432`.

---

## 📁 Project structure

```
my-app/
├── src/
│   ├── app/              # Next.js App Router pages + API routes
│   │   ├── api/          # REST API endpoints
│   │   ├── calendar/     # Calendar page
│   │   ├── collection/   # Collection page
│   │   ├── learn/        # Daily Learn page
│   │   └── library/      # Library page
│   └── components/       # React components
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Seed data (100 learn words + sample cards)
│   └── migrations/       # SQL migrations
├── public/               # Static assets (logo.png)
├── Dockerfile
├── docker-compose.yml
├── entrypoint.sh         # Migration + seed + start
└── next.config.ts
```

---

## 🗄️ Database schema

| Model       | Description                                            |
| ----------- | ------------------------------------------------------ |
| `Task`      | Tasks with priority, status, due date                  |
| `Card`      | Library flip cards (Book / Experience / Collection)    |
| `Topic`     | Collection topics with sub-cards                       |
| `SubCard`   | Cards nested under a topic                             |
| `LearnWord` | Daily vocabulary — word, meaning, examples, references |

---

## 🔄 Re-seed the database

```bash
docker compose exec app npm run db:seed
```

## 🗑️ Reset everything

```bash
docker compose down -v   # removes the postgres_data volume
docker compose up --build
```
