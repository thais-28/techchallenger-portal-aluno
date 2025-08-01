# Dockerfile
FROM node:20.3.1-alpine

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia package.json + package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia todo o código
COPY . .

# Exponha a porta (opcional, só para docs)
EXPOSE 3333

# Comando para iniciar em modo dev com tsx
CMD ["npm", "run", "start:dev"]
