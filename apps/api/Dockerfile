FROM node:20-alpine AS build-stage

WORKDIR /app
RUN corepack enable

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --frozen-lockfile --filter @watercloset/api...

COPY apps/api ./apps/api

RUN pnpm --filter @watercloset/api build

FROM node:20-alpine AS production-stage

WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/apps/api ./apps/api

EXPOSE 3001

WORKDIR /app/apps/api
CMD ["pnpm", "start"]
