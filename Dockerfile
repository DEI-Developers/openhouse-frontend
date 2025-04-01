# Etapa de compilación
FROM node:20-alpine AS build

# Creamos carpeta de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json (si existe) para instalar dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto de archivos
COPY . .

# Ejecutamos build de Vite (genera carpeta 'dist')
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiamos la carpeta de build al directorio por defecto de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
