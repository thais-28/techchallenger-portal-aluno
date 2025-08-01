# Etapa 1 – Build com dependências completas
FROM node:20.3.1-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run dist

# Etapa 2 – Apenas runtime (produção enxuta)
FROM node:20.3.1-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist ./dist

# Porta de exposição
EXPOSE 3333

# Subida final da aplicação transpilada
CMD ["node", "dist/server.js"]
