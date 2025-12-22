# Combined Payload + Nuxt production Dockerfile for WaterCloset
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++
RUN corepack enable pnpm

# ==================== PAYLOAD BUILD ====================
FROM base AS payload-builder
WORKDIR /payload
# Copy the entire API directory with its package.json
COPY apps/api/package.json ./
# Copy root lock file for workspace dependencies
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install
COPY apps/api/ ./
RUN pnpm build

# ==================== NUXT BUILD ====================
FROM base AS nuxt-builder
WORKDIR /nuxt
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY app/ ./app/
COPY server/ ./server/
COPY public/ ./public/
# Copy all config files needed for nuxt build
COPY nuxt.config.ts tsconfig.json ./
COPY tailwind.config.js ./
COPY components.json ./
RUN pnpm install
# Set proxy target for production - Payload runs on localhost:3000 in same container
ENV PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
RUN pnpm build:web

# ==================== PRODUCTION RUNNER ====================
FROM base AS runner
WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy Payload standalone build
COPY --from=payload-builder /payload/.next/standalone ./payload
COPY --from=payload-builder /payload/.next/static ./payload/.next/static

# Copy Nuxt build
COPY --from=nuxt-builder /nuxt/.output ./nuxt/.output

# Create startup script that generates PM2 config
# Payload: internal port 3000 (never exposed)
# Nuxt: Railway's PORT (public-facing), but NEVER 3000 to avoid conflict
RUN printf '#!/bin/sh\n\
set -e\n\
\n\
echo "=== WaterCloset Starting ==="\n\
\n\
# Debug: Show critical env vars (redacted)\n\
echo "=== Environment Check ==="\n\
echo "PORT=${PORT:-not set}"\n\
echo "NODE_ENV=${NODE_ENV:-not set}"\n\
echo "DATABASE_URL present: $([ -n \"${DATABASE_URL}\" ] && echo yes || echo no)"\n\
echo "PAYLOAD_SECRET present: $([ -n \"${PAYLOAD_SECRET}\" ] && echo yes || echo no)"\n\
\n\
echo "=== Configuring services ==="\n\
\n\
# Payload always uses internal port 3000\n\
PAYLOAD_PORT=3000\n\
\n\
# Nuxt uses Railway PORT. Avoid 3000 (conflict) and 5432 (postgres)\n\
if [ "${PORT}" = "3000" ] || [ "${PORT}" = "5432" ] || [ -z "${PORT}" ]; then\n\
  NUXT_PORT=3001\n\
  echo "PORT was ${PORT:-empty}, using NUXT_PORT=3001 to avoid conflict"\n\
else\n\
  NUXT_PORT=${PORT}\n\
fi\n\
\n\
echo "Payload internal port: ${PAYLOAD_PORT}"\n\
echo "Nuxt public port: ${NUXT_PORT}"\n\
\n\
# Generate PM2 config at runtime with correct ports\n\
cat > /app/ecosystem.config.json << EOF\n\
{\n\
  "apps": [\n\
    {\n\
      "name": "payload",\n\
      "script": "/app/payload/server.js",\n\
      "cwd": "/app",\n\
      "env": {\n\
        "NODE_ENV": "production",\n\
        "PORT": "${PAYLOAD_PORT}",\n\
        "HOSTNAME": "0.0.0.0",\n\
        "PAYLOAD_SECRET": "${PAYLOAD_SECRET}",\n\
        "DATABASE_URL": "${DATABASE_URL}",\n\
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}",\n\
        "STRIPE_PUBLIC_KEY": "${STRIPE_PUBLIC_KEY}",\n\
        "STRIPE_WEBHOOK_SECRET": "${STRIPE_WEBHOOK_SECRET}",\n\
        "STRIPE_PLATFORM_FEE_PERCENT": "${STRIPE_PLATFORM_FEE_PERCENT}",\n\
        "BREVO_API_KEY": "${BREVO_API_KEY}",\n\
        "GEOAPIFY_API_KEY": "${GEOAPIFY_API_KEY}",\n\
        "PAYLOAD_PUBLIC_SERVER_URL": "${PAYLOAD_PUBLIC_SERVER_URL}",\n\
        "FRONTEND_URL": "${FRONTEND_URL}",\n\
        "BUNNY_API_KEY": "${BUNNY_API_KEY}",\n\
        "BUNNY_STORAGE_API_KEY": "${BUNNY_STORAGE_API_KEY}",\n\
        "BUNNY_STORAGE_ZONE": "${BUNNY_STORAGE_ZONE}",\n\
        "BUNNY_CDN_URL": "${BUNNY_CDN_URL}",\n\
        "BUNNY_CDN_HOSTNAME": "${BUNNY_CDN_HOSTNAME}",\n\
        "BUNNY_STORAGE_HOSTNAME": "${BUNNY_STORAGE_HOSTNAME}",\n\
        "BUNNY_UPLOAD_PATH": "${BUNNY_UPLOAD_PATH}",\n\
        "BUNNY_STORAGE_ENABLED": "${BUNNY_STORAGE_ENABLED}"\n\
      }\n\
    },\n\
    {\n\
      "name": "nuxt",\n\
      "script": "/app/nuxt/.output/server/index.mjs",\n\
      "cwd": "/app",\n\
      "env": {\n\
        "NODE_ENV": "production",\n\
        "PORT": "${NUXT_PORT}",\n\
        "HOST": "0.0.0.0",\n\
        "PAYLOAD_PUBLIC_SERVER_URL": "http://localhost:${PAYLOAD_PORT}",\n\
        "NUXT_PUBLIC_API_URL": "${NUXT_PUBLIC_API_URL}",\n\
        "NUXT_PUBLIC_GEOAPIFY_KEY": "${GEOAPIFY_API_KEY}",\n\
        "NUXT_PUBLIC_STRIPE_KEY": "${STRIPE_PUBLIC_KEY}",\n\
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"\n\
      }\n\
    }\n\
  ]\n\
}\n\
EOF\n\
\n\
echo "=== PM2 Config ==="\n\
cat /app/ecosystem.config.json\n\
\n\
echo "=== Starting services with PM2 ==="\n\
exec pm2-runtime /app/ecosystem.config.json\n\
' > /app/start.sh && chmod +x /app/start.sh

# Railway injects PORT env var - Nuxt will use it
ENV PORT=3001

# Expose the PORT (Railway will override this)
EXPOSE $PORT

# Health check
RUN printf '#!/bin/sh\n\
NUXT_PORT=${PORT:-3001}\n\
PAYLOAD_PORT=3000\n\
\n\
# Check Payload internal health\n\
if ! wget --no-verbose --tries=1 --spider "http://localhost:${PAYLOAD_PORT}/api/users/me" 2>/dev/null; then\n\
  echo "Payload not healthy"\n\
  exit 1\n\
fi\n\
\n\
# Check Nuxt frontend\n\
if ! wget --no-verbose --tries=1 --spider "http://localhost:${NUXT_PORT}/" 2>/dev/null; then\n\
  echo "Nuxt not healthy"\n\
  exit 1\n\
fi\n\
\n\
echo "All services healthy"\n\
exit 0\n\
' > /app/healthcheck.sh && chmod +x /app/healthcheck.sh

HEALTHCHECK --interval=30s --timeout=15s --start-period=120s --retries=3 \
  CMD /app/healthcheck.sh

CMD ["/app/start.sh"]
