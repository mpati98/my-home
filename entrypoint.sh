#!/bin/sh
set -e

echo "🔄  Running database migrations..."
npx prisma migrate deploy

echo "🌱  Seeding database..."
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts || echo "⚠️  Seed skipped (already seeded or error)"

echo "🚀  Starting Next.js..."
exec node server.js
