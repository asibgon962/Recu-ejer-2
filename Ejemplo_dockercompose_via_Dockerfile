# Paso 1: Usar la imagen base de Node.js
# Paso 1: Usar la imagen base de Node.js
FROM node:22.11-slim

# Paso 2: Instalar MongoDB en el mismo contenedor
RUN apt-get update && \
    apt-get install -y gnupg curl

# Paso 2: Descargar la clave GPG del repositorio de MongoDB y agregarla al sistema
RUN curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-8.0.gpg

# Paso 3: Agregar el repositorio MongoDB a las fuentes de APT
RUN echo "deb [signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/8.0 main" | tee /etc/apt/sources.list.d/mongodb-org-8.0.list

# Paso 4: Actualizar los repositorios y instalar MongoDB
RUN apt-get update && apt-get install -y mongodb-org

# Copiar los archivos de dependencias al contenedor
COPY package*.json ./

# Instalar las dependencias de Node.js
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Paso 4: Exponer el puerto de la aplicación Node.js
EXPOSE 5050

# Paso 5: Exponer el puerto de MongoDB
EXPOSE 27017

RUN mkdir -p /data/db

# Paso 6: Crear un script para ejecutar MongoDB y Node.js
RUN echo '#!/bin/bash\n\
mongod --dbpath /data/db --tlsMode preferTLS --tlsCertificateKeyFile server_combined.pem --tlsCAFile ca.crt --tlsAllowInvalidCertificates --bind_ip 0.0.0.0 &\n\
node index.cjs' > /start.sh && chmod +x /start.sh


# Comando por defecto para ejecutar el script
CMD ["/start.sh"]
