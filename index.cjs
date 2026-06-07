require("dotenv").config();
const conector = require("./database/conexion.cjs");
const app = require("./app.cjs");
const { crearActividadPorDefecto, crearMensajesPorDefecto } = require("./models/schemas.cjs");

async function main() {
  try {
    console.log("Iniciamos");

    await conector.conexion();
    await crearActividadPorDefecto();
    await crearMensajesPorDefecto();

    app.listen(5050, "0.0.0.0", () => {
      console.log("Servidor HTTP corriendo en el puerto 5050");
    });

  } catch (error) {
    console.error("Error al iniciar la aplicación:", error);
    process.exit(1);
  }
}

main();
