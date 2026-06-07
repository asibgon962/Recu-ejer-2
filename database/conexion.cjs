const mongoose = require("mongoose");
const path = require('path');

const useSSL = process.env.SSL === "true";

async function conexion() {
    try {
        const uri = `mongodb://${process.env.PATH_DB}:27017/ClassProject`;
        console.log(uri)
        

        const useSSL = process.env.SSL === "true";

        if (!useSSL) {
            await mongoose.connect(uri);
            console.log("Conexion normal establecida")
        } else {
            await mongoose.connect(uri, {
                tls: true,
                tlsCAFile: path.join(__dirname, "../ca.crt"),
                tlsCertificateKeyFile: path.join(__dirname, "../server_combined.pem"),
                tlsAllowInvalidCertificates: true
            });
        }

    } catch (error) {
        console.error("Error al conectar con MongoDB:", error);
    }
}

module.exports = { conexion };
