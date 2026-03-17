# Workspace

A full-stack personal workspace application for task management, learning, library organization, and daily productivity.

**Tech Stack:** Next.js 15 • TypeScript • Tailwind CSS • Prisma • PostgreSQL • Node.js 20

---

## ✨ Features

- **Task Manager** — Create, organize, and track tasks by priority, status, and due date
- **Calendar View** — Visual task planning with monthly calendar overview
- **Daily Learn** — Build vocabulary with daily word cards and examples
- **Library** — Manage flip cards for learning (books, experiences, collections)
- **Collection** — Organize content by topics with nested sub-items
- **REST API** — Full CRUD endpoints for all resources
- **Responsive Design** — Works on desktop, tablet, and mobile

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Install Docker Desktop if you don't have it
# https://www.docker.com/products/docker-desktop

# Start everything (build + database + app)
docker compose up --build
```

The app will be available at **http://localhost:8080** after ~30 seconds.

Docker will automatically:

- Pull and run PostgreSQL 16
- Build the Next.js app image
- Run database migrations
- Seed sample data
- Start the application

> **Note:** If you get a port conflict on 5432 (PostgreSQL), ensure no local PostgreSQL is running, or modify the port mapping in `docker-compose.yml`.

### Option 2: Local Development

**Prerequisites:**

- Node.js 20+
- PostgreSQL 14+ running locally, OR Docker for database only

**Setup:**

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create database schema
npx prisma db push

# Seed sample data
npx prisma db seed

# Start dev server
npm run dev
```

App runs at **http://localhost:3000**

**To use Docker for just the database:**

```bash
docker compose up db -d
npm run dev
```

---

## 📋 Available Scripts

```bash
npm run dev              # Start development server (port 3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking
npm run db:push          # Push schema to database
npm run db:seed          # Seed database with sample data
npm run db:migrate       # Run pending migrations
```

---

## 🐳 Docker Commands Reference

| Command                                              | Description                                      |
| ---------------------------------------------------- | ------------------------------------------------ |
| `docker compose up --build`                          | First run — builds image and starts all services |
| `docker compose up`                                  | Start services (image must be pre-built)         |
| `docker compose up -d`                               | Start in background                              |
| `docker compose down`                                | Stop all services                                |
| `docker compose down -v`                             | Stop services and delete database volume         |
| `docker compose logs -f app`                         | Stream application logs                          |
| `docker compose logs -f db`                          | Stream database logs                             |
| `docker compose ps`                                  | List running containers                          |
| `docker compose exec app sh`                         | Shell into the app container                     |
| `docker compose exec db psql -U workspace workspace` | Connect to PostgreSQL                            |

---

## ⚙️ Configuration

### Environment Variables

Database credentials can be customized in `.env`:

```env
POSTGRES_USER=workspace
POSTGRES_PASSWORD=workspace_pass
POSTGRES_DB=workspace
```

Or pass them to `docker compose`:

```bash
POSTGRES_PASSWORD=mypass docker compose up
```

The `DATABASE_URL` is automatically generated from these values.

### Ports

- **Web App:** `http://localhost:8080` (Docker) or `http://localhost:3000` (local)
- **PostgreSQL:** `localhost:5433` (Docker) or `localhost:5432` (local)

---

## 📁 Project Structure

```
.
├── app/                      # Next.js App Router
│   ├── api/                  # REST API routes
│   │   ├── cards/            # Card management endpoints
│   │   ├── tasks/            # Task management endpoints
│   │   ├── topics/           # Topic endpoints
│   │   ├── subcards/         # SubCard endpoints
│   │   └── learn/            # Learn/vocabulary endpoints
│   ├── about/                # About page
│   ├── collection/           # Collection page
│   ├── learn/                # Daily learning page
│   ├── library/              # Library page
│   ├── task/                 # Task dashboard page
│   └── layout.tsx            # Root layout
├── components/               # React components
│   ├── collection/           # Collection components
│   ├── images/               # Image gallery components
│   ├── learn/                # Learning components
│   ├── library/              # Library components
│   ├── main/                 # Navigation components
│   └── workspace/            # Workspace/task components
├── lib/                      # Utility libraries
│   └── prisma.ts             # Prisma client
├── pages/                    # Legacy page components
├── prisma/                   # Database
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Seed script
│   ├── seedNewWords.ts       # Vocabulary data
│   └── migrations/           # Database migrations
├── public/                   # Static assets
├── utilities/                # UI utilities and themes
│   ├── collection/           # Collection styling
│   ├── learn/                # Learn utilities
│   ├── library/              # Library utilities
│   ├── main/                 # Main utilities
│   └── workspace/            # Task/workspace utilities
├── Dockerfile                # Container build configuration
├── docker-compose.yml        # Multi-container setup
├── entrypoint.sh             # Container startup script
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

---

## 🗄️ Database Schema

### Core Models

| Model       | Purpose                 | Key Fields                                                     |
| ----------- | ----------------------- | -------------------------------------------------------------- |
| `Task`      | Task management         | id, title, tag, priority, status, dueDate, notes, done, doneAt |
| `Card`      | Flip cards for learning | id, front, back, type, isPublic, userId                        |
| `Topic`     | Collection organization | id, name, description                                          |
| `SubCard`   | Cards within topics     | id, content, topicId                                           |
| `LearnWord` | Daily vocabulary        | id, word, meaning, examples, references, difficulty            |

### Relationships

- Task → many (standalone)
- Card → many users (library)
- Topic → many SubCards
- LearnWord → daily learning

---

## 🔄 Common Workflows

### Reset Database

```bash
# Remove all data and recreate schema
docker compose down -v
docker compose up --build
```

### Re-seed Data

```bash
# Clear and re-seed while keeping containers running
docker compose exec app npx prisma db seed
```

### Access Database

```bash
# Connect to PostgreSQL
docker compose exec db psql -U workspace workspace
```

### Rebuild App

```bash
# Rebuild Next.js app without restarting database
docker compose up --build app
```

### View Logs

```bash
# Real-time logs from all services
docker compose logs -f

# Or specific service
docker compose logs -f app
docker compose logs -f db
```

---

## 🛠️ Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find what's using the port
sudo lsof -i :5432    # PostgreSQL
sudo lsof -i :8080    # Web app

# Stop existing services
docker compose down
```

Modify `docker-compose.yml` to use different ports if needed.

### Database Connection Failed

1. Ensure PostgreSQL is healthy: `docker compose logs db`
2. Check DATABASE_URL in container: `docker compose exec app env | grep DATABASE_URL`
3. Verify database exists: `docker compose exec db psql -U workspace -l`

### Build Fails

```bash
# Clean rebuild everything
docker compose down -v
docker system prune -a
docker compose up --build
```

### TypeScript Errors

```bash
# Regenerate Prisma client
npx prisma generate

# Type check
npm run type-check
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PostgreSQL](https://www.postgresql.org/docs)

---

## 📝 License

Personal project
