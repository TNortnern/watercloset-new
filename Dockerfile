FROM node:20-alpine AS build-stage

WORKDIR /app
RUN corepack enable

COPY .npmrc package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build:web

# SSR
FROM node:20-alpine AS production-stage

WORKDIR /app

COPY --from=build-stage /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
