FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY app.js ./
COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "app.js"]
