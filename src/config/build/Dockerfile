FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build


FROM node:20-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
