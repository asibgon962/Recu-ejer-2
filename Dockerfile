FROM node:22.11-slim

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    sudo \
    curl

# Copiar los archivos de dependencias al contenedor
COPY package*.json ./

# Instalar las dependencias de Node.js
RUN npm install

# Copiar el resto de los archivos de tu proyecto
COPY . .

# Exponer el puerto 5050
EXPOSE 5050

# Ejecutar la aplicación
CMD ["node", "index.cjs"]
