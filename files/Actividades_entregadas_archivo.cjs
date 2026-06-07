
const multer=require("multer");
const fs= require("fs").promises
const path=require("path")
const {Actividades_entregadas, Actividades}=require("../models/schemas.cjs")


//------Script donde definimos donde se guardará la actividad subida por el usuario-----------
const almacenamiento_actividades = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            const username = req.cookies["username"];
            const actividad = req.body.Actividad;
            const Tema = req.body.Tema;

    
            // Si el usuario existe, procedemos con la creación de directorios
            let rootpath = __dirname.split(path.sep);
            rootpath.pop(); // Eliminar el último directorio (__dirname)
            rootpath = path.join(...rootpath);
    
            // Crear la ruta del directorio usando path.join para que sea compatible con el SO
            const filePath = path.join(rootpath, "imagenes", "personas", username,Tema+"_"+actividad);
            await fs.mkdir(filePath, { recursive: true });
    
            // Establecer la ruta del archivo donde se almacenará usando path.join
            cb(null, filePath);
        } catch (error) {
            console.error("Error creando el directorio:", error.message);
            cb(new Error("Error al crear el directorio"), null); // Propagar el error si ocurre
        }
    },

    filename: function(req, file, callback) {
        const nombre_usuario = req.cookies["username"];
        const now = new Date(Date.now());

        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
        callback(null, nombre_usuario + "_" + formattedDate + "_" + file.originalname);
    }
});




async function validarExtensionactividad(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const username = req.cookies["username"];

    if(!req.body.Actividad || !req.body.Comentarios || !req.body.Tema) {
        req.bodyNotOK = 'Error'; // Establecer el error en la solicitud
        return cb(null, false); // Rechazar el archivo

    }
    const Fecha_entrega = new Date();

        // Buscar la actividad original para comprobar fecha límite
    const actividadOriginal = await Actividades.findOne({ Tema: req.body.Tema, Actividad: req.body.Actividad });
    
    if (!actividadOriginal) {
        req.NotExistActivity = 'Error';
        return cb(null, false); // Rechazar el archivo
    }

    // Convertir Fecha_fin a Date
    const fechaFin = new Date(actividadOriginal.Fecha_fin + "T23:59:59");

    // Comprobar si la fecha de entrega es posterior a la fecha límite
    if (Fecha_entrega > fechaFin) {
        req.ActivityLate = 'Error';
        return cb(null, false); // Rechazar el archivo
    }

    const existsUsername = await Actividades_entregadas.findOne({ username:username, Tema: req.body.Tema, Actividad: req.body.Actividad});
    if(existsUsername) {
        req.alreadyExistsUser = 'Error';
        return cb(null, false); // Rechazar el archivo
    }

    const extensionesPermitidas = ['.zip', '.rar', '.pdf', '.png'];
    if (!extensionesPermitidas.includes(extension)) {
        req.fileValidationError = 'Error'; // Establecer el error en la solicitud
        return cb(null, false); // Rechazar el archivo
    }
    return cb(null, true);  // Aceptar el archivo
};


const subidas_actividades= multer({
    storage: almacenamiento_actividades,
    fileFilter: validarExtensionactividad
});


module.exports= {
    subidas_actividades
}