
const multer=require("multer");
const fs= require("fs").promises
const path=require("path")
const {Usuarios}=require("../models/schemas.cjs")
//------Script donde definimos donde se guardará la actividad subida por el usuario-----------

//el primer parametro de cb es para indicar el error
//el segundo parametro de cb depende de lo ue se este haciendo:
const almacenamiento_imagenes = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const username = req.body.username;

      // Carpeta raíz del proyecto (un nivel arriba de __dirname)
      const rootpath = path.resolve(__dirname, "..");

      // Ruta absoluta al directorio de imágenes del usuario
      const filePath = path.join(rootpath, "imagenes", "personas", username);

      // Crear carpeta si no existe
      await fs.mkdir(filePath, { recursive: true });

      // Pasar ruta absoluta al callback (Multer lo necesita)
      cb(null, filePath);
    } catch (error) {
      console.error("Error creando el directorio:", error.message);
      cb(new Error("Error al crear el directorio"), null);
    }
  },

  filename: function (req, file, callback) {
    const nombre_usuario = req.body.username;
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    const safeFilename = `${nombre_usuario}_${formattedDate}_${file.originalname}`;

    callback(null, safeFilename);
  },
});

// La siguiente función es asíncrona porque consulto la BD
async function validarExtensionyRegistro (req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const username = req.body.username;
    const email = req.body.email;


    const nombre=req.body.nombre
    const password=req.body.password


    const existsUsername = await Usuarios.findOne({ username });
    const existsEmail = await Usuarios.findOne({ email });

    if (existsUsername) {
        req.existsUsername = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }

    // Verificar si la extensión es PNG
    if (extension !== '.png' && extension !== '.jpg') {
        req.fileValidationError = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }

    if (existsEmail) {
        req.existsEmail = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }

    if (username.length > 14) {
        req.userNotOK = 'Error'; // Establecer el error
        return cb(null, false);  // Rechazar el archivo
    }


    if (email.length > 30) {
        req.emilNotOk = 'Error'; // Establecer el error
        return cb(null, false);  // Rechazar el archivo
    }

    if (nombre.length > 15) {
        req.nombreNotOK = 'Error'; // Establecer el error
        return cb(null, false);  // Rechazar el archivo
    }


    // Validar el campo 'nombre'
    if (!nombre || !/^[a-zA-Z\s]+$/.test(nombre)) {
        req.nombreNotOK = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }

    // Validar el campo 'username'
    if (!username || username.length < 3) {
        req.userNotOK = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }


    // Validar el campo 'email'
    const emailRegex = /^[a-zA-Z0-9._%+-]{4,}@g\.educaand\.es$/;
    if (!email || !emailRegex.test(email)) {
        req.emilNotOk = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }

    // Validar el campo 'password'
    if (!password || password.length < 6) {
        req.passwordNotOk = 'Error'; // Establecer el error en la solicitud
        return cb(null, false);  // Rechazar el archivo
    }
    return cb(null, true);  // Aceptar el archivo
};


const subidas_imagenes = multer({
    storage: almacenamiento_imagenes,
    fileFilter: validarExtensionyRegistro
});




module.exports= {
    subidas_imagenes
}