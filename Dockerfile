# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package.json and lock file
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

# Copy package.json and lock file
COPY package.json pnpm-lock.yaml* ./

# Copy prisma directory excluding .db files
COPY --chown=node:node prisma/schema.prisma prisma/
COPY --chown=node:node prisma/migrations prisma/migrations/

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod

# Generate Prisma client in the production image
RUN npx prisma generate

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Use node user for better security
USER node

# Note: Docker's EXPOSE is for documentation
EXPOSE 8000

# Start the application
CMD ["node", "dist/main"]