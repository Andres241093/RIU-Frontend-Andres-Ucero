# Etapa 1: Build de la aplicación Angular
FROM node:20.19-alpine AS build

WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación en modo producción
RUN npm run build -- --configuration production

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar los archivos estáticos generados al directorio de Nginx
COPY --from=build /app/dist/RIU-Frontend-Andres-Ucero/browser /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]