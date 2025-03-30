#!/bin/sh

# Setup database - always check if migrations are needed first
setup_database() {
  echo "Checking database schema..."
  npx prisma migrate deploy
}

if [ "$1" = "migrate" ]; then
  echo "Running database migrations..."
  npx prisma migrate deploy
  echo "Database migrations completed"
elif [ "$1" = "generate" ]; then
  echo "Generating Prisma client..."
  npx prisma generate
  echo "Prisma client generation completed"
elif [ "$1" = "studio" ]; then
  echo "Starting Prisma Studio..."
  npx prisma studio
else
  echo "Starting application..."
  # Always run migrations before starting the app
  setup_database
  # Use the PORT environment variable if set, otherwise default to 8000
  PORT=${PORT:-8000} exec node dist/main
fi