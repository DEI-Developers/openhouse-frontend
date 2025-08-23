# Etapa de compilación
FROM node:22-alpine AS build

# Creamos carpeta de trabajo
WORKDIR /app

# Instalamos pnpm globalmente
RUN npm install -g pnpm

# Copiamos package.json y pnpm-lock.yaml para instalar dependencias
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copiamos el resto de archivos
COPY . .

# Ejecutamos build de Vite (genera carpeta 'dist')
RUN pnpm run build

# Etapa de producción
FROM nginx:alpine

# Copiamos la carpeta de build al directorio por defecto de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
