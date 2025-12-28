# Build stage
FROM node:20-slim AS builder

# Install OpenSSL and other required dependencies
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma
COPY prisma_db_schema ./prisma_db_schema
COPY scripts ./scripts

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Prisma schema and generate client
RUN npm run prisma:generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim AS production

# Install OpenSSL and other required dependencies
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy full node_modules from builder (includes prisma CLI)
COPY --from=builder /app/node_modules ./node_modules

# Copy built application and assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma_db_schema ./prisma_db_schema
COPY --from=builder /app/scripts ./scripts

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
