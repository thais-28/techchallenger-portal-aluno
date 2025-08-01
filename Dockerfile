FROM node:20.3.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run dist

EXPOSE 3333

CMD ["node", "dist/server.js"]
