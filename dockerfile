# Step 1: Angular app build
FROM node:20.19-alpine AS build

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm ci

COPY . .

# Production build
RUN npm run build -- --configuration production

# Step 2: Serve app with Nginx no root
FROM nginxinc/nginx-unprivileged:alpine

# Copy default nginx config for angular router
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy angular build
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]