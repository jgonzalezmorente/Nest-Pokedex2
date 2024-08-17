FROM node:22-alpine3.20 AS deps
RUN apk add --no-cache libc6-compat # apk gestor de paquetes en alpine, libc6-compat compatibilidad glibc (biblioteca C de GNU)
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile # frozen-lockfile -> Indica a yarn que no debe modificar el archivo yarn.lock. Si las versiones del package.json no coinciden con las del yarn.lock dará error en lugar de actualizarlo.

FROM node:22-alpine3.20 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:22-alpine3.20 AS runner
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn install --prod
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main"]