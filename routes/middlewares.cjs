const jwt= require('jsonwebtoken')



//-----------MIDDLEWARE para verificar token usuario--------------------------
function verificarToken(req, res, next) {
    const token = req.cookies['token'];
    const username = req.cookies['username'];

    if (!token) {
        return res.status(403).send(`
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
                <p>Debes iniciar sesión para acceder a esta página.</p>
                <a href="/">Volver al inicio</a>
            </body>
            </html>
        `);
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err || decoded.username !== username) {
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

        req.usuario = decoded;
        next();
    });
}




//-----------MIDDLEWARE para verificar token administrador--------------------------
function verificarToken_admin(req, res, next) {
    const token = req.cookies['token'];
    const username = req.cookies['username'];

    if (!token) {
        return res.status(403).send(`
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
                <p>Debes iniciar sesión para acceder a esta página.</p>
                <a href="/">Volver al inicio</a>
            </body>
            </html>
        `);
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err || decoded.username !== "admin") {
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

        req.usuario = decoded;
        next();
    });
}



module.exports ={verificarToken, verificarToken_admin} //¡Devuelvo mis endpoints¡¡¡¡
