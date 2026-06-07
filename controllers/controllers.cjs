
const validator= require("validator");
const {Usuarios,Actividades,Actividades_entregadas, Mensajes}=require("../models/schemas.cjs")
const bcrypt=require("bcrypt")
const jwt= require('jsonwebtoken')
const path=require('path')
const fs = require('fs').promises



async function insertarDocumentos(req, res) {
    try {
        // Obtener las actividades desde req.body
        const actividades = req.body; // Asumiendo que el cuerpo de la solicitud contiene un array de actividades

        // Validar que el cuerpo de la solicitud no esté vacío y tenga las actividades
        if (!actividades || actividades.length === 0) {
            return res.status(400).json({ message: "No se proporcionaron actividades" });
        }

        // Insertar los documentos en la colección 'actividad'

        const resultado = await Actividades.insertMany(actividades);
        res.status(201).json({ message: "Documentos insertados correctamente", data: resultado });


    } catch (error) {
        console.error("Error al insertar los documentos:", error);
        // Responder con un error
        res.status(500).json({ message: "Error al insertar los documentos", error: error.message });
    }
}







function get_all_activities(req, res) {
    Actividades.find()
        .then(actividades => {
            // Si no se encuentran actividades, respondemos con un mensaje
            if (actividades.length === 0) {
                return res.status(404).json({ message: 'No se encontraron actividades' });
            }

            // Devolver las actividades encontradas
            res.status(200).json(actividades);
        })
        .catch(error => {
            // En caso de error, respondemos con un mensaje de error
            console.error(error);
            res.status(500).json({ message: 'Hubo un error al obtener las actividades' });
        });
}




function get_all_messages(req, res) {
    Mensajes.find()
        .then(actividades => {
            // Si no se encuentran actividades, respondemos con un mensaje
            if (actividades.length === 0) {
                return res.status(404).json({ message: 'No se encontraron mensajes' });
            }

            // Devolver las actividades encontradas
            res.status(200).json(actividades);
        })
        .catch(error => {
            // En caso de error, respondemos con un mensaje de error
            console.error(error);
            res.status(500).json({ message: 'Hubo un error al obtener las actividades' });
        });
}



function get_all_activities_user(req, res) {
    const username = req.cookies["username"];
    Actividades_entregadas.find({ username })
        .then(actividades => {
            // Si no se encuentran actividades, respondemos con un mensaje
            if (actividades.length === 0) {
                return res.status(200).json({ message: 'No se encontraron actividades' });
            }

            // Iteramos sobre cada actividad para modificar el Nombre_archivo y no devolver la ruta al cliente
            actividades.forEach(actividad => {
                actividad.Nombre_archivo = actividad.Nombre_archivo.split(path.sep).slice(-1)[0];
            });

            // Devolver las actividades encontradas
            res.status(200).json(actividades);
        })
        .catch(error => {
            // En caso de error, respondemos con un mensaje de error
            console.error(error);
            res.status(500).json({ message: 'Hubo un error al obtener las actividades' });
        });
}



async function delete_activity_and_File(req, res) {
    try {
        const username = req.cookies["username"];
        const { Actividad, Tema } = req.body;

        // Buscar la actividad original en el esquema Actividades
        const actividadOriginal = await Actividades.findOne({ Actividad, Tema });
        if (!actividadOriginal) {
            return res.status(404).json({ message: "Actividad no encontrada" });
        }

        // Fecha límite de la actividad (YYYY-MM-DD)
        const fechaFin = new Date(actividadOriginal.Fecha_fin + "T23:59:59");

        // Convertir Fecha_entrega de "DD/MM/YYYY, HH:mm:ss" a Date
        const fechaActual = new Date();
        // Comparar fechas
        if (fechaActual  > fechaFin) {
            return res.status(400).json({ message: "No se puede borrar la actividad, se ha pasado la fecha límite" });
        }

        // Paso 1: Eliminar el registro del usuario en la base de datos
        await Actividades_entregadas.findOneAndDelete({ username, Actividad, Tema });

        // Paso 2: Eliminar la carpeta donde se almacenó el archivo
        let rootpath = __dirname.split(path.sep);
        rootpath.pop(); // Eliminar el último directorio (__dirname)
        rootpath = path.join(...rootpath);

        const dirPath = path.join(rootpath, "imagenes", "personas", username, `${Tema}_${Actividad}`);
        await fs.rm(dirPath, { recursive: true, force: true }); // Elimina la carpeta y su contenido

        res.status(200).json({ message: "Actividad eliminada correctamente" });

    } catch (error) {
        console.error("Error al eliminar actividad y carpeta:", error.message);
        res.status(500).json({ message: "Hubo un error al eliminar la actividad" });
    }
}




const upload_message = async function (req, res) {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const username=req.cookies["username"]
        const texto = req.body.texto;

        // Validar que los campos requeridos estén presentes
        if (!username || !texto) {
            return res.status(400).json({
                status: "error",
                message: "El nombre de usuario y el texto son obligatorios",
            });
        }

        // Generar la fecha en formato español y huso horario de Madrid
        const fecha_anuncio = new Date().toLocaleString('es-ES', {
            timeZone: 'Europe/Madrid',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // Formato 24 horas
        });

        // Crear un nuevo mensaje
        const nuevoMensaje = new Mensajes({
            username: username.trim(),
            texto: texto.trim(),
            fecha_anuncio: fecha_anuncio,
        });

        // Guardar el mensaje en la base de datos
        const mensajeGuardado = await nuevoMensaje.save();

        // Devolver una respuesta exitosa
        res.status(201).json({
            status: "success",
            message: "Mensaje creado exitosamente",
            data: mensajeGuardado,
        });
    } catch (error) {
        // En caso de error, devolver un mensaje de error
        console.error("Error al crear el mensaje:", error.message);
        res.status(500).json({
            status: "error",
            message: "Hubo un error al crear el mensaje",
        });
    }
};



const upload_answer = async function (req, res) {
  try {
    const data = req.body.mensajeObj;
    let { username, fecha_anuncio, respuestas } = data;
    const [fechaParte, horaParte] = fecha_anuncio.split(' '); // separar fecha y hora
    const [dia, mes, anio] = fechaParte.split('/');
    fecha_anuncio = `${dia}/${mes}/${anio.replace(",","")}, ${horaParte}`;

    if (!username || !fecha_anuncio || !respuestas || !respuestas.length) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos obligatorios para registrar la respuesta",
      });
    }

    const nuevaRespuesta = respuestas[0];

    // Buscar el mensaje original por username y fecha
    let mensajeOriginal = await Mensajes.findOne({
      username: username.trim(),
      fecha_anuncio: fecha_anuncio.trim(),
    });

    if (!mensajeOriginal) {
      return res.status(404).json({
        status: "error",
        message: "Mensaje original no encontrado",
      });
    }


    if (!Array.isArray(mensajeOriginal.respuestas)) {
        mensajeOriginal.respuestas = [];
        }


    // Agregar la nueva respuesta al array
    mensajeOriginal.respuestas.push({
        username: nuevaRespuesta.username.trim(),
        texto: nuevaRespuesta.texto.trim(),
        fecha_respuesta: nuevaRespuesta.fecha_respuesta.trim(),
    });
    mensajeOriginal.respuestas = mensajeOriginal.respuestas.filter(r =>
        r.username && r.texto && r.fecha_respuesta
        );


    const mensajeActualizado = await mensajeOriginal.save();


    res.status(200).json({
      status: "success",
      message: "Respuesta añadida correctamente",
      data: mensajeActualizado,
    });
    }
    
    catch (error) {
    console.error("Error al añadir respuesta:", error.message);
    res.status(500).json({
      status: "error",
      message: "Hubo un error al añadir la respuesta",
    });
  }
};





async function create_activities_admin(req, res) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: 'No autenticado: falta token' });
    }

    let payload;
    try {
      payload = jwt.decode(token);
    } catch {
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }

    // Permiso: sólo admin
    if (!payload?.username || payload.username !== 'admin') {
      return res.status(403).json({ message: 'Prohibido: sólo admin puede crear actividades' });
    }

    // Normalizar body a array
    const body = req.body;
    if (!body) return res.status(400).json({ message: 'Cuerpo de la petición vacío' });

    const items = Array.isArray(body) ? body : [body];

    // Helper para fecha ES/Madrid
    const ahoraES = () =>
      new Date().toLocaleString('es-ES', {
        timeZone: 'Europe/Madrid',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

    // Preparar documentos (dejamos a Mongoose validar requeridos)
    const docs = items.map((a) => ({
      Tema: a.Tema,
      Color: a.Color ?? 'black',
      Actividad: a.Actividad,
      Fecha_fin: a.Fecha_fin,                    // requerido por el esquema
      Fecha_creación: a.Fecha_creación ?? ahoraES(),
      Abreviacion: a.Abreviacion,
      Explicacion: a.Explicacion,
    }));

    const resultado = await Actividades.insertMany(docs, { ordered: true });

    return res.status(201).json({
      message: 'Actividades creadas',
      count: resultado.length,
      data: resultado,
    });
  } catch (err) {
    console.error('create_activities_admin error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validación fallida', errors: err.errors });
    }
    return res.status(500).json({ message: 'Error del servidor', error: err.message });
  }
}




const get_inicio_html = async function (req, res) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).send(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>No autorizado</title>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 50px; }
                        h1 { color: #e74c3c; }
                        p { color: #555; }
                        a { color: #3498db; text-decoration: none; }
                        a:hover { text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <h1>No estás autorizado</h1>
                    <p>Tu sesión no es válida.</p>
                    <a href="/">Volver al inicio</a>
                </body>
                </html>
            `);
    }

    let payload;
    try {
        payload = jwt.decode(token);
    } catch  {
        return res.status(401).send(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>No autorizado</title>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 50px; }
                        h1 { color: #e74c3c; }
                        p { color: #555; }
                        a { color: #3498db; text-decoration: none; }
                        a:hover { text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <h1>No estás autorizado</h1>
                    <p>Tu sesión no es válida.</p>
                    <a href="/">Volver al inicio</a>
                </body>
                </html>
            `);
    }

    let filePath;
    filePath = path.join(__dirname, '..', 'public', 'inicio.html');
    res.sendFile(filePath, err => {
        if (err) {
            console.error('Error al enviar el HTML:', err);
            res.status(500).send('Error al cargar la página');
        }
    });
}





async function logout(req, res) {
  try {
    // Invalida la cookie en el navegador expirándola
    res.clearCookie("token", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production", // solo HTTPS en prod
      sameSite: "lax"
    });

    return res.status(200).json({ message: "Logout exitoso" });
  } catch (err) {
    return res.status(500).json({ message: "Error en logout", error: err.message });
  }
}





const upload_activity = async function (req, res) {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const username = req.cookies["username"];
        const tema = req.body.Tema;
        const actividad = req.body.Actividad;
        const comentarios = req.body.Comentarios;

        // Validar que los campos requeridos estén presentes
        if (!username || !comentarios || !actividad || !tema) {
            return res.status(400).json({
                status: "error",
                message: "Algun fallo",
            });
        }

        if (req.fileValidationError === 'Error') {
            return res.status(400).json({
                status: "error",
                message: "Has pasado una extension no valida de imagen",
            });
        }

        if (req.bodyNotOK === 'Error') {
            return res.status(400).json({
                status: "error",
                message: "No se han pasado los campos que se debían",
            });
        }

        if (req.alreadyExistsUser === 'Error') {
            return res.status(400).json({
                status: "error",
                message: "Este usuario ya ha entregado esta actividad",
            });
        }


        if (req.ActivityLate === 'Error') {
            return res.status(400).json({
                status: "error",
                message: "No se puede entregar la actividad tarde",
            });
        }


        if (req.NotExistActivity === 'Error') {
            return res.status(400).json({
                status: "error",
                message: "No existe la actividad",
            });
        }


        // Crear fecha de entrega
        const Fecha_entrega = new Date();


        let Nombre_archivo;
        if (req.file) {
            Nombre_archivo = req.file.path;
        }

        // Crear un nuevo documento en Actividades_entregadas
        const nuevaEntrega = new Actividades_entregadas({
            username: username.trim(),
            Tema: tema.trim(),
            Actividad: actividad,
            Fecha_entrega: Fecha_entrega.toLocaleString('es-ES', {
                timeZone: 'Europe/Madrid',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }),
            Comentarios: comentarios,
            Nombre_archivo
        });

        // Guardar la actividad en la base de datos
        const mensajeGuardado = await nuevaEntrega.save();

        // Devolver una respuesta exitosa
        res.status(201).json({
            status: "success",
            message: "Mensaje creado exitosamente",
            data: mensajeGuardado,
        });
    } catch (error) {
        console.error("Error al crear el mensaje:", error.message);
        res.status(500).json({
            status: "error",
            message: "Hubo un error al crear el mensaje",
        });
    }
};






async function create(req, res) {
    const parametros = req.body; // Obtenemos los datos enviados en el POST. AQUÍ NO HAY IMAGEN REQ BODY Y REQ FILE SE SPARAN AUTOMATICAMENTE


    try {
        // Validamos los campos `nombre` y `apellidos` usando validator
        let evalue_title = validator.isEmpty(parametros.username);


        if (evalue_title === true) {
            throw new Error("No se ha validado la información");
        }

    } catch (error) {

        return res.status(400).json({
            status: "error",
            mensaje: "Hay fallos en la validación",
            error: error.message,
            linea: error.stack    
        });
    }


    if (req.fileValidationError === 'Error'){
        return res.status(400).json({
            status: "error",
            message: "Has pasado una extension no valida de imagen",
        })
    }

    if (req.existsUsername){
        return res.status(400).json({
            status: "error",
            message: "Ya existe el usuario",
        })
    }
    
    if (req.existsEmail){
        return res.status(400).json({
            status: "error",
            message: "Ya existe el email",
        })
    }

    if (req.userNotOK){
        return res.status(400).json({
            status: "error",
            message: "El nombre de usuario debe tener al menos 3 letras sin espacios y solo mayúsculas y minúsculas y menos de 14 caracteres",
        })
    }

    if (req.nombreNotOK){
        return res.status(400).json({
            status: "error",
            message: "El nombre de la persona debe tener al menos 3 letras sin espacios y solo mayúsculas y minúsculas y menos de 15 caracteres",
        })
    }
    
    
    if (req.emilNotOk){
        return res.status(400).json({
            status: "error",
            message: "El email debe tener extension educaand, al menos 4 caracteres delante del @ y menos de 30 caracteres",
        })
    }

    if (req.passwordNotOk){
        return res.status(400).json({
            status: "error",
            message: "La constraseña debe tener al menos 6 caracteres",
        })
    }

    if (req.file) {
        parametros["foto"] = req.file.path;
    }

    const persona_model = new Usuarios(parametros);

    try {
        const personasaved = await persona_model.save(); // Mongoose se encargará del encriptado de la contraseña aqui gracia a pre
        return res.status(200).json({
            status: "finalizado con éxito",
            persona: personasaved
        });
    } catch(error){
        if (error.code === 11000) {  // Código de error MongoDB para clave duplicada
            // Si el error es por clave duplicada, devuelve un mensaje más claro
            const field = Object.keys(error.keyValue)[0]; // Obtenemos el campo duplicado
            const message = field === 'username' ? 'El nombre de usuario ya está en uso' : 'El correo electrónico ya está registrado';
            res.status(400).json({ message });
        } else {
            return res.status(400).json({
                status: "error",
                message: error.message,
    
                
            });
        }

    }
}






async function start_session (req, res) {
    try {
        const { username, password } = req.body;


        // Busca una persona por el campo `username`
        const persona = await Usuarios.findOne({ username: username });
        if (!persona || !persona.password) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha encontrado la persona en la db",
            });
        }

        const is_correct = await bcrypt.compare(password, persona.password);
        if (!is_correct) {
            return res.status(401).json({
                error: "Usuario o contraseña inválidos",
            });
        }

        let userForToken = {
            id: persona._id,
            username: persona.username
        };


        const token = jwt.sign(userForToken, process.env.SECRET_KEY, { expiresIn: '1h' });
        const rutaBase = path.resolve(__dirname, '..'); // Obtiene la ruta base


        // Establecer las cookies:
        // Cookie para el token
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
            secure: process.env.NODE_ENV === "production",  // Cambiar a true si estás usando HTTPS
            sameSite: "lax"
        });

        // Cookie para el nombre de usuario (sin JWT)
        res.cookie('username', persona.username, {
            httpOnly: false,  // Evitar que JavaScript acceda a la cookie
            expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
            secure: process.env.NODE_ENV === "production",  // Cambiar a true si estás usando HTTPS
            sameSite: "lax"
        });

        // Redirigir al usuario a la página de inicio
         let payload;
         try {
        payload = jwt.decode(token);
        } 
        catch {
                return res.status(401).send(`
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <title>No autorizado</title>
                    <style>
                        body { font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; padding: 50px; }
                        h1 { color: #e74c3c; }
                        p { color: #555; }
                        a { color: #3498db; text-decoration: none; }
                        a:hover { text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <h1>No estás autorizado</h1>
                    <p>Tu sesión no es válida.</p>
                    <a href="/">Volver al inicio</a>
                </body>
                </html>
            `);
        }
        res.status(200).sendFile(path.join(rutaBase, 'public', 'inicio.html')); 
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: error.message,
        });
    }
}

function root (req,res) {
    const rutaBase = path.resolve(__dirname, '..'); // Obtiene la ruta base
    res.status(200).sendFile(path.join(rutaBase, 'public', 'portada.html'));
}







async function downloadFile(req, res) {
    try {
        // Obtener el nombre de usuario desde las cookies
        const username = req.cookies["username"];
        if (!username) {
            return res.status(400).json({ error: 'El nombre del usuario no existe.' });
        }

        // Obtener los parámetros de consulta
        const { actividad, tema } = req.query;
        if (!actividad || !tema) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos (actividad o tema).' });
        }

        // Construir la ruta de la carpeta donde se guarda el archivo
        // Suponiendo que estamos en la ruta actual de este archivo, subimos una carpeta para llegar a "imagenes"
        let rootPath = __dirname.split(path.sep);
        rootPath.pop(); // subimos una carpeta
        rootPath = path.join(...rootPath);

        const dirPath = path.join(rootPath, "imagenes", "personas", username, `${tema}_${actividad}`);

        // Verificar que la carpeta exista
        try {
            await fs.access(dirPath);
        } catch {
            return res.status(404).json({ error: 'Carpeta de actividad no encontrada.' });
        }

        // Listar archivos en la carpeta (solo hay uno)
        const files = await fs.readdir(dirPath);
        if (files.length === 0) {
            return res.status(404).json({ error: 'No se encontró ningún archivo en la carpeta.' });
        }

        const filePath = path.join(dirPath, files[0]); // tomamos el primer archivo

        // Enviar el archivo al cliente
        res.download(filePath, files[0], (err) => {
            if (err) {
                console.error('Error al enviar el archivo:', err);
                res.status(500).json({ error: 'No se pudo descargar el archivo.' });
            }
        });

    } catch (error) {
        console.error('Error al manejar la solicitud de descarga:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}






const calculate_minutes_connected = async (req, res) => {
    try {
        const username = req.cookies['username'];

        if (!username) {
            return res.status(400).json({ message: "No se recibió el username en las cookies" });
        }

        // Obtener al usuario desde la base de datos
        const usuario = await Usuarios.findOne({ username: username });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Hora actual en el servidor en el huso horario español
        const cierreSesion = new Date().toLocaleString('es-ES', {
            timeZone: 'Europe/Madrid',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // Formato 24 horas
        });

        // Convertir a objetos Date para cálculos
        const ultimaConexion = usuario.ult_conexion; // Convertir a Date

        function convertirFecha(fechaStr) {
            const [fecha, hora] = fechaStr.split(", ");
            const [dia, mes, año] = fecha.split("/").map(Number);
            return new Date(`${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}T${hora}`);
        }

        // Calcular diferencia en minutos. Esto se debe hacer mucho mejor...
        const diferenciaMinutos = Math.floor((convertirFecha(cierreSesion) - convertirFecha(ultimaConexion)) / 1000 / 60);
        if (diferenciaMinutos < 0) {
            return res.status(400).json({ message: "Error en las fechas" });
        }

        // Actualizar los minutos conectados del usuario
        usuario.minutos_conectados = (usuario.minutos_conectados || 0) + diferenciaMinutos;

        // Actualizar `ult_conexion` con la hora actual
        usuario.ult_conexion = cierreSesion;

        // Guardar los cambios en la base de datos
        await usuario.save();

        res.status(200).json({ 
            message: "Minutos conectados actualizados",
            diferenciaMinutos,
        });
    } catch (error) {
        console.error("Error al calcular minutos conectados:", error.message);
        res.status(500).json({ message: "Hubo un error en el servidor" });
    }
};




const get_minutes_connected = async (req, res) => {
    try {
        // Obtener todos los usuarios de la base de datos
        const usuarios = await Usuarios.find({}, "username minutos_conectados");

        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({ message: "No se encontraron usuarios" });
        }

        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error al obtener minutos conectados:", error.message);
        res.status(500).json({ message: "Hubo un error en el servidor" });
    }
};





async function edit_last_conexion (req, res) {
    try {
        const username = req.cookies['username']
        const persona = await Usuarios.findOne({ username: username });

        if (!persona) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha encontrado la persona en la db",
            });
        }

        // Obtener la hora actual ajustada al huso horario español
        const fechaHoraEspañola = new Date().toLocaleString('es-ES', {
            timeZone: 'Europe/Madrid',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Formato 24 horas
        });//Esto genera una cadena de texto que representa la fecha y hora ajustada al huso horario especificado (Europe/Madrid en este caso). Es importante notar que:



        // Guardar la fecha en la base de datos con la hora española
        persona.ult_conexion = fechaHoraEspañola;
        await persona.save();

        res.status(200).json({
            status: "success",
            mensaje: "Fecha de última conexión actualizada.",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            mensaje: error.message,
        });
    }
};

function get_all_activities_send(req, res) {
  const { username } = req.params;
  Actividades_entregadas.find({ username })
    .then(actividades => {
      // ojo, SIEMPRE devolver un array para cuando no hay nada
      res.status(200).json(actividades || []);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json([]);
    });
}


async function edit_activity_mark (req, res)  {
  try {
    const {tema, actividad, usuario} = req.params;
    const { nota } = req.body;

    // validamos que la nota llegue bien por si nos envían basura
    if (nota === undefined || nota === null) {
      return res.status(400).json({ error: "La nota es obligatoria" });
    }
    const notaNumerica = Number(nota);
    console.log(notaNumerica)
    console.log("---------")
    console.log(req.params)
    console.log(tema)
    console.log(actividad)
    console.log(usuario)

    if (Number.isNaN(notaNumerica) || notaNumerica < 0 || notaNumerica > 10) {
      return res.status(400).json({ error: "La nota debe estar entre 0 y 10" });
    }
    console.log("hasta_aqui")

    // usamos el método findOneAndUpdate
    const entrega = await Actividades_entregadas.findOneAndUpdate(
      { username: usuario, Actividad: actividad, Tema: tema},
      { Nota_actividad: notaNumerica }
    );
    console.log(entrega)

    if (!entrega) {
      return res.status(404).json({ error: "Entrega no encontrada" });
    }
    return res.json({
      ok: true,
      mensaje: "Nota actualizada correctamente",
    });

  } catch (err) {
    return res.status(500).json({ error: "Error" });
  }
};





async function get_all_photo(req, res) {
  try {
    const personas = await Usuarios.find({});
    if (!personas || personas.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron usuarios." });
    }

    // Ruta absoluta a la carpeta raíz del proyecto
    const rootpath = path.resolve(__dirname, "..");

    // Ruta absoluta a la foto por defecto
    const anonimoPath = path.join(rootpath, "public", "img", "anonimo.png");

    // Generar array con rutas absolutas y normalizadas
    const array_fotos = personas.map((persona) => {
      let fotoPath;

      if (persona.foto) {
        if (path.isAbsolute(persona.foto)) {
          // Si ya es absoluta, la normalizamos
          fotoPath = path.normalize(persona.foto);
        } else {
          // Si es relativa, la resolvemos desde la raíz del proyecto
          fotoPath = path.normalize(path.resolve(rootpath, persona.foto));
        }
      } else {
        fotoPath = anonimoPath;
      }

      return {
        foto: fotoPath,
        username: persona.username,
        ult_conexion: persona.ult_conexion,
      };
    });

    // Crear array con imágenes en base64
    const photosArray = await Promise.all(
      array_fotos.map(async (objeto) => {
        try {
          const file = await fs.readFile(objeto.foto);
          const ext = path.extname(objeto.foto).toLowerCase();
          const mimeType =
            ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
          const base64Image = file.toString("base64");

          return {
            foto: `data:${mimeType};base64,${base64Image}`,
            username: objeto.username,
            ult_conexion: objeto.ult_conexion,
          };
        } catch (err) {
          console.error(
            `Error leyendo el archivo: ${objeto.foto}, usando anonimo.png`,
            err.message
          );

          try {
            const file = await fs.readFile(anonimoPath);
            const base64Image = file.toString("base64");

            return {
              foto: `data:image/png;base64,${base64Image}`,
              username: objeto.username,
              ult_conexion: objeto.ult_conexion,
            };
          } catch (fallbackErr) {
            console.error("Error leyendo anonimo.png", fallbackErr.message);
            return {
              foto: null,
              username: objeto.username,
              ult_conexion: objeto.ult_conexion,
              error: "No se pudo cargar ninguna foto",
            };
          }
        }
      })
    );

    res.status(200).json(photosArray);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      linea: error.stack,
      mensaje: error.message,
    });
  }
}

async function change_password(req, res) {
    try {
        const { password, new_password, repit_password } = req.body;
        const username = req.usuario.username;

        // Comprobamos que las contraseñas nuevas coinciden
        if (new_password !== repit_password) {
            return res.status(400).json({ mensaje: "Las contraseñas nuevas no coinciden" });
        }

        // Buscamos el usuario en la bd
        const usuario = await Usuarios.findOne({ username });
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        // Comprobamos que la contraseña actual es correcta
        const is_correct = await bcrypt.compare(password, usuario.password);
        if (!is_correct) {
            return res.status(401).json({ mensaje: "La contraseña actual es incorrecta" });
        }

        // Actualizamos la contraseña (el pre-save del schema la encripta automáticamente)
        usuario.password = new_password;
        await usuario.save();

        return res.status(200).json({ mensaje: "Contraseña cambiada correctamente" });

    } catch (error) {
        return res.status(500).json({
            linea: error.stack,
            mensaje: error.message,
        });
    }
}

module.exports={
    root,
    create,
    start_session,
    edit_last_conexion,
    get_all_photo,
    get_all_activities,
    get_all_messages,
    upload_message,
    upload_answer,
    calculate_minutes_connected,
    get_minutes_connected,
    upload_activity,
    get_all_activities_user,
    delete_activity_and_File,
    insertarDocumentos,
    downloadFile,
    create_activities_admin,
    get_inicio_html,
    logout,
    get_all_activities_send,
    edit_activity_mark,
    change_password
}