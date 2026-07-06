# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
WORKDIR /app
ENV CI=true

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM deps AS build
COPY prisma ./prisma
RUN npx prisma generate
COPY nest-cli.json tsconfig*.json ./
COPY src ./src
RUN npm run build

FROM deps AS migrate
COPY prisma ./prisma
RUN npx prisma generate
CMD ["npx", "prisma", "migrate", "deploy"]

FROM deps AS prod-deps
COPY prisma ./prisma
RUN npx prisma generate
RUN npm prune --omit=dev && npm cache clean --force

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache dumb-init
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
COPY prisma ./prisma
USER node
EXPOSE 3000
CMD ["dumb-init", "node", "dist/src/main.js"]
