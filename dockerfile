# Step 1: Angular app build
FROM node:20.19-alpine AS build

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm ci

COPY . .

# Check code errors and try to fix it
RUN npm run lint:fix

# Production build
RUN npm run build:prod

# Step 2: Serve app with Nginx -- root
FROM nginx:alpine

# Copy default nginx config for angular router
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy angular build
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]