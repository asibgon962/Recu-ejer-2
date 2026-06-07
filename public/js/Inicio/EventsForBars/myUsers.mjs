//2)-----------------------------Interfaz para los usuarios-----------------------------//

function eventForUser(objeto_foto) {
  const usersLi = document.getElementById('usuarios');
  
  usersLi.addEventListener('click', function (e) {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
    e.preventDefault(); // Evitar que el enlace se siga de forma predeterminada

    // Mostrar el calendario (si no está ya visible)
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = "";  // Limpiar el contenido
    const grid = document.createElement("div");
    grid.classList.add("grid");
    grid.id = "grid";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "1fr"; // 1 columna
    mainContent.appendChild(grid);

    // 2.1) Aquí se hace un fetch para recoger la info de los usuarios (se asume que 'objeto_foto' ya está disponible)
    // Si necesitas datos estáticos, utiliza los comentarios anteriores para definir los datos

    // 2.2) Aquí se itera sobre lo recogido para crear dinámicamente las tarjetas con la info de cada usuario
    for (let i = 0; i < objeto_foto.length; i++) {
      const img = document.createElement("img");
      img.style.marginRight = "1rem";
      img.classList.add("imgsUsers");
      const div = document.createElement("div");
      div.id = "divUsuario";
      div.style.fontSize = "0.8rem";
      div.style.margin = "auto";
      div.style.width = "100%";
      div.style.padding = "0.5rem"; // Espaciado interno
      div.style.border = "0.1rem solid rgba(202, 200, 200, 0.1)";
      div.style.borderRadius = "8px";
      div.style.backgroundColor = "#ffffff";
      div.style.marginTop = "1rem";
      div.style.display = "flex";
      div.style.alignItems = "center"; // Centrar contenido verticalmente
      div.style.justifyContent = "flex-start"; // Alineación de contenido en el eje horizontal

      

      const persona = objeto_foto[i];

      img.src = persona.foto;
      img.style.borderRadius = "50%";
      img.style.width = "2.5rem";
      img.style.height = "2.5rem";
      img.style.objectFit = "cover";
      img.style.flexShrink="0"
      img.style.cursor = "pointer";


      // Asegurarse de que los datos de 'persona' sean válidos
      if (persona) {
        div.innerHTML = `${persona.username} <span style="color:grey; font-size:0.7rem; margin-left:1rem">
                          Ultima conexion: ${persona.ult_conexion}</span>`;
      }
      div.prepend(img);  // Prepend img to the div

      // Añadir el div a la cuadrícula
      grid.appendChild(div);

      // Añadir evento de clic en la imagen de cada usuario
      img.addEventListener("click", () => {
        let overlay = document.querySelector("#overlay");
        
        if (overlay) {
          // Si ya existe el div overlay, eliminarlo
          overlay.remove();
        }

        // Crear el fondo semitransparente (overlay)
        overlay = document.createElement("div");
        overlay.id = "overlay"; // Asignar ID para poder acceder y eliminarlo posteriormente
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "1000";

        // Crear la imagen en el overlay
        const img_doc = document.createElement("img");
        img_doc.style.width = "30vw";
        img_doc.style.borderRadius = "0.5rem"; // Bordes redondeados, opcional
        img_doc.style.boxShadow = "0 0.3rem 0.6rem rgba(0, 0, 0, 0.2)";
        img_doc.style.opacity = "0"; // Inicia transparente
        img_doc.style.transform = "translate(150%, -80%) scale(0.01)"; // Inicia desde fuera de la pantalla

        // Establecer la fuente de la imagen del overlay
        
        img_doc.src = img.src ? img.src : "./img/anonimo.jpg";  // Usar la src de la imagen original o una predeterminada

        // Añadir la imagen al overlay
        overlay.appendChild(img_doc);

        // Añadir el overlay al body
        document.body.appendChild(overlay);

        // Añadir animación a la imagen del overlay después de un pequeño retraso
        setTimeout(() => {
          img_doc.style.transition = "transform 1s ease-out, opacity 0.5s ease-out";
          img_doc.style.transform = "translate(0, 0) scale(1)";
          img_doc.style.opacity = "1";
        }, 50);

        // Cerrar el overlay al hacer clic fuera de la imagen
        overlay.addEventListener("click", (e) => {
          if (e.target === overlay) {  // Solo cerrar si se hace clic fuera de la imagen
            img_doc.style.transition = "transform 0.5s ease-in, opacity 0.5s ease-in";
            img_doc.style.transform = "translate(100%, -100%) scale(0.01)"; // Volver a la esquina superior izquierda
            img_doc.style.opacity = "0"; // Hacer invisible

            // Eliminar el overlay después de la animación de salida
            setTimeout(() => {
              overlay.remove();
            }, 500); // Duración de la animación
          }
        });
      });
    }
  });
}

export { eventForUser };
