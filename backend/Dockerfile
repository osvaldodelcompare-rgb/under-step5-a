# --- Build stage -----------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY scripts ./scripts
RUN npm install

COPY . .
RUN npm run build

# --- Production stage -------------------------------------------------------
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY scripts ./scripts
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
