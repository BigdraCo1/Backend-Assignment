# Migration stage
FROM node:18-alpine AS migration

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./
COPY --chown=node:node prisma/ prisma/

RUN pnpm install --frozen-lockfile
RUN npx prisma generate

# Run migrations when container starts
CMD ["npx", "prisma", "migrate", "deploy"]

# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application source (excluding .db files via .dockerignore)
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN pnpm build

# Production stage
FROM node:18-alpine AS production

# Set NODE_ENV
ENV NODE_ENV=production

# Set working directory
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml* ./

# Copy entire prisma folder (excluding .db files via .dockerignore)
COPY --chown=node:node prisma/ prisma/

# Install dependencies (including dev dependencies for prisma CLI)
RUN pnpm install --frozen-lockfile

# Generate Prisma client in the production image
RUN npx prisma generate

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Add metadata labels
LABEL org.opencontainers.image.description="API Application"
LABEL org.opencontainers.image.source="https://github.com/user/repo"

# Copy entrypoint script
COPY --chown=node:node entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Use node user for better security
USER node

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 8000) + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Note: Docker's EXPOSE is for documentation
EXPOSE 8000

# Set the entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

# Default command (starts the application)
CMD ["start"]