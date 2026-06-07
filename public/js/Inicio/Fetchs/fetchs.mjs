const getCookie = (cookieName) => {
    const cookies = document.cookie.split("; "); // Separar las cookies en un array
    console.log(cookies)
    const targetCookie = cookies.find(cookie => cookie.startsWith(`${cookieName}=`)); // Buscar la cookie por nombre
    return targetCookie ? targetCookie.split("=")[1] : null; // Devolver el valor de la cookie o null si no existe
  };




async function get_all_photo() {
  try {
    const response = await fetch(`/inicio/get_all_photo`, {
      method: "GET",
      headers: {
        'Content-Type': "application/json"
      },
      credentials: "include"
    });

    const text = await response.text(); // leemos la respuesta como texto

    if (!response.ok) {
      // Detectamos si la respuesta es HTML
      if (text.startsWith("<!DOCTYPE html>") || text.includes("<html")) {
        console.warn("Recibido HTML de error:", text);
        document.body.innerHTML = text; // reemplaza la página actual
        return null;
      } else {
        throw new Error('No se pudo obtener la información del usuario');
      }
    }

    //ASÍ ES COMO SE HACÍA ANETES CON UN BLOB!!!
    // console.log(response)
    // const usuarioData = await response.blob();
    // const imagenBlobURL= URL.createObjectURL(usuarioData)
    // console.log(imagenBlobURL)
    // let imagen_child=document.createElement("img")
    // imagen_child.src=imagenBlobURL
    // imagen_child.style.maxWidth = "20vw"
    // contendor.appendChild(imagen_child)


    // Si todo OK, parseamos JSON
    const photosArray = JSON.parse(text);
    console.log(photosArray);
    return photosArray;

  } catch (error) {
    console.error("Error:", error.message);
    return error;
  }
}




async function last_conexion() {
try {
    const response = await fetch("/inicio/edit_last_conexion", {
        method: "PUT",
        headers: {
            'Content-Type': "application/json"
        },
        credentials: "include" // Si es necesario para la autenticación
    });

    // Solo loguear la respuesta si la solicitud fue exitosa
    if (!response.ok) {
        throw new Error('No se pudo actualizar la última conexión');
    }

    // Solo queremos hacer un log del resultado, no hacer nada más con la respuesta
    console.log('Última conexión actualizada');
} catch (error) {
    console.error("Error:", error.message);
}
}

async function downloadFile(actividad,tema) {
    try {
        // Realizar una solicitud GET al servidor para descargar el archivo
        const response = await fetch(
        `/downloadFile?actividad=${encodeURIComponent(actividad)}&tema=${encodeURIComponent(tema)}`
    );
        if (!response.ok) {
            throw new Error('Error al descargar el archivo');
        }

        // Si la respuesta es correcta, obtener el archivo como un Blob (lo que significa que es un archivo binario)
        const blob = await response.blob(); // Esta línea convierte la respuesta a un archivo binario

        // Crear una URL para el archivo Blob
        const url = window.URL.createObjectURL(blob);

        // Usar window.open directamente para abrir el archivo en una nueva ventana o pestaña
        window.open(url, '_blank');  // Aquí abrimos la URL en una nueva ventana o pestaña

        // Revocar la URL para liberar memoria
        window.URL.revokeObjectURL(url);



    } catch  {
        alert('Hubo un error al descargar el archivo. Intenta nuevamente.');
    }
}

async function get_all_messages() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s

  try {
    const response = await fetch("/inicio/get_all_messages", {
      method: "GET",
      headers: {
        'Content-Type': "application/json"
      },
      credentials: "include",
      signal: controller.signal
    });

    clearTimeout(timeoutId); // limpiar timeout si termina antes

    const text = await response.text(); // leemos como texto

    if (!response.ok) {
      // Detectamos si la respuesta es HTML
      if (text.startsWith("<!DOCTYPE html>") || text.includes("<html")) {
        console.warn("Recibido HTML de error:", text);
        document.body.innerHTML = text; // reemplaza la página actual
        return null;
      } else {
        throw new Error("No se pudo obtener los mensajes");
      }
    }

    // Si todo OK, parseamos JSON
    const mensajes = JSON.parse(text);
    console.log("Mensajes obtenidos:", mensajes);
    return mensajes;

  } catch (error) {
    if (error.name === "AbortError") {
      console.error("Error: La petición tardó más de 20 segundos y fue cancelada");
    } else {
      console.error("Error:", error.message);
    }
    throw error; // relanzamos para que un catch exterior lo maneje
  }
}





async function get_all_activities_user() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

    try {
        const response = await fetch("/inicio/get_all_activities_user", {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            },
            credentials: "include",
            signal: controller.signal
        });

        clearTimeout(timeout);

        const text = await response.text(); // leemos como texto

        if (!response.ok) {
            // Detectamos si es HTML (por ejemplo middleware 403)
            if (text.startsWith("<!DOCTYPE html>") || text.includes("<html")) {
                console.warn("Recibido HTML de error:", text);
                document.body.innerHTML = text; // reemplaza la página actual
                return null;
            } else {
                throw new Error("No se pudo obtener las actividades");
            }
        }

        // Parseamos JSON si la respuesta es correcta
        const data = JSON.parse(text);
        return data;

    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("La petición tardó demasiado (timeout de 20s).");
        }
        throw error; 
    }
}




async function upload_message(mensajeObj) {
try {
    const response = await fetch("/inicio/upload_message", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include", // Si es necesario para la autenticación
        body: JSON.stringify(mensajeObj)
    });

    if (!response.ok) {
        throw new Error("No se pudo guardar el mensaje en la base de datos");
    }

    const data = await response.json()
    console.log("Mensaje guardado en la BD:", data);
    return data; // Devolver la respuesta del servidor si se necesita
} catch (error) {
    console.error("Error al guardar el mensaje:", error.message);
    throw error; // Relanzar el error si es necesario manejarlo fuera
}
}

async function upload_answer(mensajeObj) {
    const response = await fetch("/inicio/upload_answer", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({mensajeObj})
    });
      if (!response.ok) {
        throw new Error("No se pudo guardar el mensaje en la base de datos");
    }
    const data = await response.json()
    return data;
}





async function upload_activity(selectedFile, comment, Actividad, Tema) {
    const formData = new FormData();
    formData.append('Comentarios', comment);  // Comentario
    formData.append('Actividad', Actividad);
    formData.append('Tema', Tema);
    formData.append('archivo', selectedFile); // Archivo seleccionado

    // Enviar los datos al servidor
    const response = await fetch('/inicio/upload_activity', { 
        method: 'POST',
        credentials: 'include', // Si necesitas autenticación
        body: formData // El cuerpo de la solicitud con archivo y texto
    });

    if (!response.ok) {
        throw new Error('No se pudo completar la entrega. Inténtalo de nuevo.');
    }

    const result = await response.json();
    return result
}


function set_full_time_at_page () {
    window.addEventListener("beforeunload", async () => {
        try {
            // Enviar un fetch al servidor para calcular los minutos conectados
            await fetch("/inicio/set_all_minutes", {
                method: "POST",
                credentials: "include", // Si necesitas enviar cookies
            });
        } catch (error) {
            console.error("Error al enviar la solicitud al servidor:", error.message);
        }
    });
}


async function get_full_time_at_page() {
    try {
        const response = await fetch("/inicio/get_all_minutes", {
            method: "GET",
            credentials: "include", // Si necesitas enviar cookies
        });

        if (!response.ok) {
            throw new Error("No se pudo obtener los minutos conectados");
        }

        const data = await response.json();
        console.log("Minutos conectados de los usuarios:", data);
        return data; // Devolver los datos si se necesita trabajar con ellos
    } catch (error) {
        console.error("Error al obtener los minutos conectados:", error.message);
        return null;
    }
}



async function get_all_activities() {
    try {
        const response = await fetch("/inicio/get_all_activities", {
            method: "GET",
            credentials: "include", // Si necesitas enviar cookies
        });

        if (!response.ok) {
            throw new Error("No se pudo obtener los minutos conectados");
        }

        const data = await response.json();
        console.log("Minutos conectados de los usuarios:", data);
        return data; // Devolver los datos si se necesita trabajar con ellos
    } catch (error) {
        console.error("Error al obtener los minutos conectados:", error.message);
        return null;
    }
}


async function deleteActivityAndFile(actividad, tema) {
    const response = await fetch('/inicio/delete_activity_and_File', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            Actividad: actividad,
            Tema: tema
        }),
        credentials: "include"
    });

    const data = await response.json();

    // Devuelvo siempre un objeto que puedas inspeccionar
    return {
        ok: response.ok,
        status: response.status,
        message: data.message
    };
}




export {getCookie, get_all_photo,last_conexion,get_all_messages,upload_message,
    set_full_time_at_page,get_full_time_at_page,get_all_activities,upload_activity,
    get_all_activities_user,deleteActivityAndFile,downloadFile,upload_answer}