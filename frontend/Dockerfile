# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS build
WORKDIR /app
ARG VITE_API_URL=
ENV VITE_API_URL=${VITE_API_URL}
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM caddy:2.8-alpine AS runtime
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /usr/share/caddy
EXPOSE 80
