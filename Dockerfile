# Etapa de compilación
FROM node:22-alpine AS build

# Creamos usuario no-root para mayor seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Creamos carpeta de trabajo
WORKDIR /app

# Instalamos pnpm globalmente y limpiamos caché de npm
RUN npm install -g pnpm && \
    npm cache clean --force

# Copiamos archivos de dependencias primero (mejor cache layering)
COPY package.json pnpm-lock.yaml ./

# Cambiamos propietario de archivos y instalamos dependencias
RUN chown -R nextjs:nodejs /app
USER nextjs

# Instalamos dependencias y limpiamos caché de pnpm
RUN pnpm install --frozen-lockfile && \
    pnpm store prune

# Copiamos el resto de archivos (como usuario no-root)
COPY --chown=nextjs:nodejs . .

# Ejecutamos build de Vite
RUN pnpm run build

# Etapa de producción
FROM nginx:alpine

# Creamos usuario no-root para nginx
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001 -G nginx

# Copiamos solo los archivos de build necesarios
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Configuramos nginx para ejecutar como usuario no-root
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Cambiamos a usuario no-root
USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
