# Usamos una versión ligera de Node.js
FROM node:20-alpine
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar los paquetes (node_modules)
RUN npm install

# Copiar todo el código de React
COPY . .

# Exponer el puerto de Vite
EXPOSE 5173

# Arrancar en modo desarrollo permitiendo conexiones externas (--host)
CMD ["npm", "run", "dev", "--", "--host"]