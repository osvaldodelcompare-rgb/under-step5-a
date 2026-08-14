# --- Build stage -----------------------------------------------------------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Relative path: nginx proxies /api/v1 internally, so the browser never
# needs a second public URL for the backend.
ENV VITE_API_URL=/api/v1
RUN npm run build

# --- Production stage -------------------------------------------------------
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
