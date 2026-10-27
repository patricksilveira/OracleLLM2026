FROM node:20-slim AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm ci

# Copy application source code
COPY . .

# Build frontend assets into dist/
RUN npm run build

# Production runtime stage
FROM node:20-slim

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev && npm install -g tsx

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/services ./services
COPY --from=builder /app/data.ts ./data.ts
COPY --from=builder /app/types.ts ./types.ts
COPY --from=builder /app/data_store ./data_store

EXPOSE 3000

CMD ["tsx", "server.ts"]
