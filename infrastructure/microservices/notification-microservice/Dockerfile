FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/node_modules ./node_modules

EXPOSE 6432

CMD ["npm", "run", "start:dist"]