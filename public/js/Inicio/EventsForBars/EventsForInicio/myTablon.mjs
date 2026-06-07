function eventforTablon(upload_message, objeto_foto, get_all_messages, nombre_usuario,upload_answer) {


  document.querySelector("#TablonDiv").addEventListener("click", async function () {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });


    const loader = document.createElement("div");
    loader.className = "loader";
    loader.style.display = "block"; // Lo mostramos inmediatamente
    loader.style.margin="0px auto"
    loader.style.width = "5rem";
    loader.style.height = "5rem";
    let grid = document.querySelector(".grid");
    grid.style.removeProperty("justify-items");
    grid.style.display = "grid";                  // necesario para usar grid
    grid.style.gridTemplateColumns = "1fr";       // 1 columna que ocupa todo el ancho
    grid.style.gridAutoRows = "auto";   
    grid.innerHTML=""
    grid.append(loader);

       
    try {
    // Promesa que espera 1 segundo antes de ocultar el loader
    
      let objeto = await get_all_messages();
      if (objeto) {
        console.log(objeto); // Aquí tienes acceso a photosArray
      }
      else {
        objeto=[]
      }

      await new Promise((resolve) => {
        setTimeout(() => {
          loader.style.display = "none";
          grid.innerHTML=""
          resolve();
        }, 1000);
      });

      
      // Se crea el objeto observer para la animación
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animar solo una vez
          }
        });
      }, {
        threshold: 0.2 // 10% visible
      });

      // 3️⃣ Marcar elementos a observar



      
      grid.style.transition = "transform 0.5s ease-out";
      grid.style.transform = "translateX(-250vw)";
      grid.style.overflow = "hidden";

      setTimeout(() => {
        const tablondiv = document.querySelector("#TablonDiv");
        tablondiv.style.borderBottom = "0.3rem solid rgb(0, 136, 255)";
        tablondiv.style.backgroundColor = "rgb(224, 238, 249)";
        const grid = document.querySelector(".grid");
        grid.innerHTML = "";
        grid.style.gridTemplateColumns = "1fr"; // Solo una columna
        grid.style.gridAutoRows = "auto"; // Altura automática para las filas


        //-------------------Esta funcion la usaremos en escribir_mensaje. Sirve para actualizar el vaor de objeto
        // -------------------y así no hacer over-fetch

        function agregarRespuesta(objeto, objeto_ejemplo) {
          // Tomamos el primer elemento del objeto ejemplo
          const nuevo = objeto_ejemplo[0];
          const respuestaNueva = nuevo.respuestas[0];

          // Buscamos coincidencia en objeto
          const fecha_anuncio = nuevo.fecha_anuncio
          let encontrado = null;
          for (let i = 0; i < objeto.length; i++) {
            const item = objeto[i];
            console.log(`Iteración ${i}:`, item);

            if (item.username === nuevo.username && item.fecha_anuncio === fecha_anuncio) {
              encontrado = item;
              console.log("¡Coincidencia encontrada!", item);
              break; // salir del bucle al encontrarlo
            }
          };

          if (encontrado) {
            // Si no tiene respuestas, creamos la lista
            if (!encontrado.respuestas) {
              encontrado.respuestas = [];
            }
            // Añadimos la nueva respuesta
            encontrado.respuestas.push(respuestaNueva);
          } else {
            console.warn("No se encontró ningún elemento que coincida.");
          }
        }


        //----------------Pintar Casilla para publicar mensajes----------------
        //funcion que hace el textarea para mandar mensajes, tanto para espuestas como el de cabecera
        function escribir_mensaje(id_respuesta, username_origen = null, fecha_origen = null) {
          const img = document.createElement("img");
          img.style.marginRight = "1rem";
          const div = document.createElement("div");
          div.style.display = "flex";
          div.style.flexDirection = "column";
          div.style.padding = "1rem"; // Espaciado interno
          div.style.border = "1px solid #ccc";
          div.style.borderRadius = "8px";
          div.style.backgroundColor="#f8fbff"
          div.style.maxWidth="86vw"
          div.style.overflowWrap="break-word"
          div.style.whiteSpace="normal"


          // Usar la función para obtener el valor de "username"
          const username = nombre_usuario;
          console.log(username);

        // Asegurarse de que ambos elementos existan
          if (username) {
            const div_conatainer = document.createElement("div");
            const div_2 = document.createElement("div");
            const etiqueta_p_2 = document.createElement("p");
            etiqueta_p_2.textContent = `${username}`;
            div_2.append(etiqueta_p_2);
            const fotousername = objeto_foto.find((f) => f.username === username);
            if (fotousername) {
              img.src = fotousername.foto; // Foto encontrada
            } 
            else {
              img.src = "./img/anonimo.jpg"; // Imagen predeterminada
            }
            img.style.borderRadius = "50%";
            img.style.width = "2.5rem";
            img.style.height = "2.5rem";
            img.style.objectFit = "cover";

            div_conatainer.prepend(img);
            div_conatainer.append(div_2);
            div_conatainer.style.display = "flex";
            div.append(div_conatainer);

          }
          const textarea = document.createElement("textarea");
          textarea.style.width = "100%";
          textarea.style.resize = "none"; // Evitar que el usuario redimensione el textarea
          textarea.style.marginTop = "1rem";
          textarea.style.color = "rgb(72, 72, 72)";
          textarea.style.borderColor = "rgb(229, 229, 229)";
          textarea.style.height = "5rem"; // Ajustar altura inicial
          textarea.style.fontSize = "1rem";
          textarea.style.lineHeight = "1.5rem";
          textarea.placeholder = "Escribe aquí...";
          
          // Evento para manejar Shift + Enter
          textarea.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && e.shiftKey) {
              e.preventDefault(); // Prevenir comportamiento por defecto
              textarea.value += "\n"; // Agregar salto de línea
            }
          });

          // Colocar el cursor al principio del textarea
          textarea.addEventListener("focus", () => {
            textarea.selectionStart = 0;
            textarea.selectionEnd = 0;
          });

          div.append(textarea);
          
          const loader = document.createElement("div");
          loader.className = "loader";
          loader.style.display="none"
          const publicarBtn = document.createElement("button");
          publicarBtn.textContent = "Publicar";
          publicarBtn.style.padding = "0.2rem";
          publicarBtn.style.backgroundColor = "#007BFF"; // Azul bonito
          publicarBtn.style.color = "#fff"; // Texto blanco
          publicarBtn.style.border = "none";
          publicarBtn.style.borderRadius = "5px";
          publicarBtn.style.cursor = "pointer";
          publicarBtn.style.fontSize = "1rem";
          publicarBtn.style.marginTop = "1rem";
          publicarBtn.style.display = "flex"; // Para usar flexbox
          publicarBtn.style.justifyContent = "center"; // Centra horizontalmente
          publicarBtn.style.alignItems = "center"; // Centra verticalmente
          publicarBtn.style.textAlign = "center";

          const controlsContainer = document.createElement("div");
          controlsContainer.style.display = "flex";
          controlsContainer.style.alignItems = "center";
          controlsContainer.style.marginTop = "1rem";
          controlsContainer.append(publicarBtn, loader);

          // Hover efecto para el botón
          publicarBtn.addEventListener("mouseover", () => {
            publicarBtn.style.backgroundColor = "#0056b3"; // Azul más oscuro al pasar el mouse
          });
          publicarBtn.addEventListener("mouseout", () => {
            publicarBtn.style.backgroundColor = "#007BFF"; // Regresar al color original
          });

          publicarBtn.style.width = "5rem";
          publicarBtn.textAlign = "center";
          let errorMsg = document.createElement("p");
          div.append(controlsContainer);
          div.classList.add('scroll-animate');
          observer.observe(div);

          
            if (id_respuesta) {
              const targetElement = document.getElementById(id_respuesta)
              if (targetElement) {
                div.style.marginLeft="2rem"
                div.style.marginTop="1rem"
                targetElement.after(div)  // Inserta justo después del div con el id `id_respuesta`
                } 
              else {
                console.warn(`No se encontró el elemento con id ${id_respuesta}`)
                }
              div.className = "new-message-answer";
            }
            else {
              const paginacion = grid.querySelector('.paginacion');
              paginacion.after(div);
              div.classList.add("new-message");
              }

          errorMsg.id = "error-message";
          errorMsg.textContent = "Error en publicar el mensaje";
          errorMsg.style.color = "red";
          errorMsg.style.display="none"
          errorMsg.style.marginTop = "1rem";
          div.append(errorMsg); // Añadir el mensaje de error al DOM


          publicarBtn.addEventListener("click", async () => {
            const now = new Date();
            // Obtener partes de la fecha
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0"); // Mes (0-11) +1 y rellenar con 0 si es necesario
            const day = String(now.getDate()).padStart(2, "0"); // Día del mes
            // Obtener partes de la hora
            const hours = String(now.getHours()).padStart(2, "0"); // Horas
            const minutes = String(now.getMinutes()).padStart(2, "0"); // Minutos
            const seconds = String(now.getSeconds()).padStart(2, "0"); // Segundos
            const fecha_mensaje = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
            let objeto_example
            try {
              publicarBtn.style.opacity = "0.5";
              publicarBtn.style.cursor = "not-allowed";
              loader.style.display= "block"
              const textarea=div.querySelector("textarea")
              const valor_texto=textarea.value
              textarea.readOnly = true;
              // Intentar subir el mensaje a la base de datos
              if (valor_texto.length===0){
                  throw new Error("El mensaje no puede estar vacío");
                }
              
              if (!id_respuesta){
                objeto_example = [
                { username: username, texto: valor_texto, fecha_anuncio: fecha_mensaje, respuestas:[] },
                ];
                await upload_message(objeto_example[0]);
                objeto.push(objeto_example[0])
                textarea.value = ""; // Limpiar el textarea
              }
              else {
                objeto_example = [{
                  username: username_origen,
                  fecha_anuncio:fecha_origen, // remplaza con tu variable si ya existe
                  respuestas: [
                    {
                      username: username, // quien responde
                      texto: valor_texto,
                      fecha_respuesta: fecha_mensaje
                    }
                  ]
                }];
                await upload_answer(objeto_example[0]);
                agregarRespuesta(objeto, objeto_example)
                textarea.value = ""; // Limpiar el textarea
              }
              // Simulamos la operación de publicar como promesa
              new Promise((resolve) => {
                setTimeout(function() {
                  loader.style.display="none"; // Eliminar el loader del DOM
                  errorMsg.style.display="none"; 

                  // Aquí decides si es éxito o error (por ejemplo con un if real)
                  if (!id_respuesta) {
                    resolve("Mensaje publicado correctamente");
                  } else {
                    
                    resolve("Respuesta publicada correctamente");
                  }

                  // si quisieras simular error:
                  // reject("Error en publicar el mensaje");
                }, 1000);
              })
              .then(msg => {
                errorMsg.style.display="block";
                errorMsg.textContent = msg;
                errorMsg.style.color = "green";
                setTimeout(() => { 
                  errorMsg.style.display="none"
                  errorMsg.style.color = "red";
                  errorMsg.textContent = "Error en publicar el mensaje";
                  textarea.readOnly = false;
                  publicarBtn.style.opacity = "1";
                  publicarBtn.style.cursor = "default";
                  if (id_respuesta) {
                    div.remove()
                    pintar_respuestas(objeto_example, objeto_foto, false);}
                  else {
                    pintar(objeto_example, objeto_foto, false);
                  }
                }, 1000);
                
              })
              .catch(() => {
                errorMsg.style.display="block";
                errorMsg.textContent = "Error en publicar el mensaje";
                errorMsg.style.color = "red";
                setTimeout(() => { errorMsg.style.display="none"; }, 2000);
              });


              
                
            } 
            
            catch {
              // Crear el mensaje de error
              textarea.value = ""
              loader.style.display="none"; // Eliminar el loader del DOM
              if (errorMsg) {
                  errorMsg.style.display="block"
              }
              setTimeout(function() {
              publicarBtn.style.opacity = "1";
              publicarBtn.style.cursor = "default";
              textarea.readOnly = false
              errorMsg.style.display="none"; // Eliminar el mensaje de error
              },1500)
            }

            
          });
        }

        const div_messages = document.createElement("div");
        div_messages.id = "content-messages";
        grid.append(div_messages);

        // Función que pinta todos los mensajes de una lista y los pone en pantalla
        function pintar(objeto, objeto_foto, controlador=true) {
          const div_messages = document.querySelector("#content-messages");
          if (div_messages && controlador) {
            div_messages.innerHTML=""
          }

          for (let i = 0; i < objeto.length; i++) {
            const persona = objeto[i];
            const div = document.createElement("div");
            div.style.backgroundColor = "rgb(255, 255, 255)";
            div.style.padding = "1rem";
            div.style.border = "1px solid #ccc";
            div.style.borderRadius = "8px";
            div.style.position = "relative";
            div.style.marginTop = "1rem";
            div.style.backgroundColor="#f8fbff"
            div.style.maxWidth="86vw"
            div.style.overflowWrap="break-word"
            div.style.whiteSpace="normal"

            div.id = `comment-${persona.username}-${persona.fecha_anuncio}`;

            let foto;
            const fotoEncontrada = objeto_foto.find((f) => f.username === persona.username);
            if (fotoEncontrada) {
              foto = fotoEncontrada.foto;
            } else {
              foto = "./img/anonimo.png";
            }
            const img = document.createElement("img");
            img.src = foto;
            img.style.borderRadius = "50%";
            img.style.width = "2.5rem";
            img.style.height = "2.5rem";
            img.style.objectFit = "cover";
            img.style.marginRight = "1rem";
            const div_container = document.createElement("div");
            div_container.style.display = "flex";
            div_container.style.alignItems = "center";
            const div_2 = document.createElement("div");
            const etiqueta_p_2 = document.createElement("p");
            const etiqueta_p_3 = document.createElement("p");
            etiqueta_p_2.textContent = persona.username;
            etiqueta_p_3.textContent = persona.fecha_anuncio;
            etiqueta_p_3.style.fontSize = "0.8rem";
            etiqueta_p_3.style.color = "rgb(100, 100, 100)";

            div_2.append(etiqueta_p_2);
            div_2.append(etiqueta_p_3);

            div_container.prepend(img);
            div_container.append(div_2);

            div.append(div_container);
            div.classList.add('scroll-animate');
            observer.observe(div);

            const texto = document.createElement("p");
            texto.style.marginTop = "1rem";
            texto.textContent = persona.texto;
            div.append(texto);

            // Botón responder
            const btnResponder = document.createElement("button");
            btnResponder.textContent = "Responder";
            btnResponder.style.padding = "0.3rem 0.7rem";
            btnResponder.style.border = "none";
            btnResponder.style.borderRadius = "4px";
            btnResponder.style.backgroundColor = "#007BFF";
            btnResponder.style.color = "white";
            btnResponder.style.cursor = "pointer";
            btnResponder.className="answer_boton"

            btnResponder.addEventListener("click", () => {
              const respuestasAbiertas = document.querySelectorAll(".new-message-answer");

              if (respuestasAbiertas.length > 0) {
                respuestasAbiertas.forEach(respuesta => respuesta.remove());
              } else {
                escribir_mensaje(div.id, persona.username, persona.fecha_anuncio);
              }
            });

            // Contenedor para el corazón (like)
            const likeContainer = document.createElement("div");
            likeContainer.style.display = "inline-flex";
            likeContainer.style.alignItems = "center";
            likeContainer.style.marginLeft = "1rem";  // separación del botón responder
            likeContainer.style.cursor = "pointer";
            likeContainer.style.userSelect = "none";
            likeContainer.style.gap = "0.3rem";

            const likeIcon = document.createElement("span");
            likeIcon.textContent = "❤️";
            likeIcon.style.fontSize = "1rem";
            likeIcon.style.transition = "color 0.3s";

            const likeCount = document.createElement("span");
            likeCount.style.fontWeight = "bold";
            likeCount.style.fontSize = "1rem";
            likeCount.textContent = persona.likes ? persona.likes.length : 0;

            likeContainer.append(likeIcon, likeCount);

            likeContainer.addEventListener("click", () => {
              const currentUser = "usuarioActual"; // Cambia según tu app
              if (!persona.likes) persona.likes = [];

              const index = persona.likes.indexOf(currentUser);
              if (index === -1) {
                persona.likes.push(currentUser);
                likeIcon.classList.add("heart-anim");
                likeIcon.style.color = "red";
              } else {
                persona.likes.splice(index, 1);
                likeIcon.style.color = "black";
              }

              likeCount.textContent = persona.likes.length;

              likeIcon.addEventListener("animationend", () => {
                likeIcon.classList.remove("heart-anim");
              }, { once: true });

              // Aquí podrías enviar al servidor el cambio
            });

            // Añadimos el botón y el like container juntos en un div para alinearlos
            const controlsContainer = document.createElement("div");
            controlsContainer.style.display = "flex";
            controlsContainer.style.alignItems = "center";
            controlsContainer.style.marginTop = "1rem";
            controlsContainer.append(btnResponder, likeContainer);

            div.append(controlsContainer);

            // Insertar la tarjeta al contenedor principal
            const div_messages = document.querySelector("#content-messages");
            div_messages.prepend(div);
          }
        }


        function pintar_respuestas(objeto, objeto_foto, controlador=true) {
          const div_messages = document.querySelector("#content-messages");
          if (div_messages && controlador) {
            div_messages.innerHTML=""
          }
          if (objeto) {
            for (let i = 0; i < objeto.length; i++) {
              const persona_respondida = objeto[i];
              const id_padre = `comment-${persona_respondida.username}-${persona_respondida.fecha_anuncio}`;

              //lo recorremos al reves
              for (let i = 0; i < persona_respondida.respuestas.length; i++) {
                const persona = persona_respondida.respuestas[i];
                if(persona.username) {
                  const div = document.createElement("div");
                  div.style.backgroundColor = "rgb(255, 255, 255)";
                  div.style.padding = "1rem";
                  div.style.border = "1px solid #ccc";
                  div.style.borderRadius = "8px";
                  div.style.position = "relative";
                  div.style.marginTop = "1rem";
                  div.style.backgroundColor="#f8fbff"
                  div.style.maxWidth="75vw"
                  div.style.overflowWrap="break-word"
                  div.style.whiteSpace="normal"

                  let foto;
                  const fotoEncontrada = objeto_foto.find((f) => f.username === persona.username);
                  if (fotoEncontrada) {
                    foto = fotoEncontrada.foto;
                  } else {
                    foto = "./img/anonimo.png";
                  }
                  const img = document.createElement("img");
                  img.src = foto;
                  img.style.borderRadius = "50%";
                  img.style.width = "2.5rem";
                  img.style.height = "2.5rem";
                  img.style.objectFit = "cover";
                  img.style.marginRight = "1rem";

                  const div_container = document.createElement("div");
                  div_container.style.display = "flex";
                  div_container.style.alignItems = "center";
                  const div_2 = document.createElement("div");
                  const etiqueta_p_2 = document.createElement("p");
                  const etiqueta_p_3 = document.createElement("p");
                  etiqueta_p_2.textContent = persona.username;
                  etiqueta_p_3.textContent = persona.fecha_respuesta;
                  etiqueta_p_3.style.fontSize = "0.8rem";
                  etiqueta_p_3.style.color = "rgb(100, 100, 100)";
                  div_2.append(etiqueta_p_2);
                  div_2.append(etiqueta_p_3);
                  div_container.prepend(img);
                  div_container.append(div_2);
                  div.append(div_container);

                  const texto = document.createElement("p");
                  texto.style.marginTop = "1rem";
                  texto.textContent = persona.texto;
                  div.append(texto);

                  // Contenedor para el corazón (like)
                  const likeContainer = document.createElement("div");
                  likeContainer.style.display = "inline-flex";
                  likeContainer.style.alignItems = "center";
                  likeContainer.style.marginLeft = "1rem";  // separación del botón responder
                  likeContainer.style.marginTop = "0.5rem";
                  likeContainer.style.cursor = "pointer";
                  likeContainer.style.userSelect = "none";
                  likeContainer.style.gap = "0.3rem";

                  const likeIcon = document.createElement("span");
                  likeIcon.textContent = "❤️";
                  likeIcon.style.fontSize = "1rem";
                  likeIcon.style.transition = "color 0.3s";

                  const likeCount = document.createElement("span");
                  likeCount.style.fontWeight = "bold";
                  likeCount.style.fontSize = "1rem";
                  likeCount.textContent = persona.likes ? persona.likes.length : 0;

                  likeContainer.append(likeIcon, likeCount);

                  likeContainer.addEventListener("click", () => {
                    const currentUser = "usuarioActual"; // Cambia según tu app
                    if (!persona.likes) persona.likes = [];

                    const index = persona.likes.indexOf(currentUser);
                    if (index === -1) {
                      persona.likes.push(currentUser);
                      likeIcon.classList.add("heart-anim");
                      likeIcon.style.color = "red";
                    } else {
                      persona.likes.splice(index, 1);
                      likeIcon.style.color = "black";
                    }

                    likeCount.textContent = persona.likes.length;

                    likeIcon.addEventListener("animationend", () => {
                      likeIcon.classList.remove("heart-anim");
                    }, { once: true });

                    // Aquí podrías enviar al servidor el cambio
                  });

                  // Añadimos el botón y el like container juntos en un div para alinearlos
                  const controlsContainer = document.createElement("div");
                  controlsContainer.style.display = "flex";
                  controlsContainer.style.alignItems = "center";
                  controlsContainer.append(likeContainer);

                  div.append(controlsContainer);
                  div.style.marginLeft="2rem"
                  div.style.marginTop="1rem"
                  div.classList.add('scroll-animate');
                  observer.observe(div);

                  // Insertar la tarjeta al contenedor principal
                  const referencia = document.getElementById(id_padre);
                  if (referencia) {
                    referencia.insertAdjacentElement("afterend", div);; // Inserta justo debajo de #hola
                  } else {
                    div_messages.prepend(div); // Si no existe #hola, añade arriba como antes
                  }
              }
            }
          }
          } 
        }


        grid.style.transform = "";

        function crearPaginacion(objeto, paginaInicio = 1) {
          const itemsPorPagina = 10;
          const maxBotones = 5;

          let totalPages
          let totalItems
          if (!objeto) {
            totalItems=0
          }
          else {
            totalItems = objeto.length;
          }
          
  
          totalPages = Math.max(1, Math.ceil(totalItems / itemsPorPagina));

          // Evitar duplicar la barra de paginación
          const previa = grid.querySelectorAll('.paginacion');
          previa.forEach(p => p.remove());

          // Función que crea el contenedor y devuelve el nodo SIN listeners
          function crearContenedor() {
            const container = document.createElement('div');
            container.className = 'paginacion';
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';
            container.style.justifyContent = 'center';
            container.style.alignItems = 'center';
            container.style.gap = '0.5rem';
            container.style.margin = '0.5rem auto';
            container.style.maxWidth = '30rem';
            return container;
          }

          // Crear botones numéricos y de navegación
          const paginaFin = Math.min(paginaInicio + maxBotones - 1, totalPages);
          const container = crearContenedor();

          if (paginaInicio > 1) {
            const btnAnterior = document.createElement('button');
            btnAnterior.textContent = '<';
            btnAnterior.textContent = '<';
            btnAnterior.style.padding = '0.1rem 0.3rem';
            btnAnterior.style.border = '1px solid #f0f0f0';
            btnAnterior.style.borderRadius = '0.1rem';
            btnAnterior.style.backgroundColor = '#f0f0f0';
            btnAnterior.style.cursor = 'pointer';
            container.appendChild(btnAnterior);
          }

          for (let i = paginaInicio; i <= paginaFin; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.setAttribute('data-page', i);
            btn.style.padding = '0.3rem 0.8rem';
            btn.style.border = '1px solid #ccc';
            btn.style.borderRadius = '0.4rem';
            btn.style.backgroundColor = '#f0f0f0';
            btn.style.cursor = 'pointer';
            btn.style.fontSize = '1rem';
            container.appendChild(btn);
          }

          if (paginaFin < totalPages) {
            const btnSiguiente = document.createElement('button');
            btnSiguiente.textContent = '>';
            btnSiguiente.textContent = '>';
            btnSiguiente.style.padding = '0.1rem 0.3rem';
            btnSiguiente.style.border = '1px solid #f0f0f0';
            btnSiguiente.style.borderRadius = '0.1rem';
            btnSiguiente.style.backgroundColor = '#f0f0f0';
            btnSiguiente.style.cursor = 'pointer';
            container.appendChild(btnSiguiente);
          }

          // 🔹 Función para asignar los listeners a un contenedor
        
          // Insertar arriba y abajo, activando los eventos en ambos
          // Insertar arriba y abajo, activando los eventos en ambos
          const arriba = container;
          const abajo = container.cloneNode(true);

          // Función para actualizar el estado visual de ambos contenedores
          function marcarBotonActivo(i) {
            [arriba, abajo].forEach(c => {
              c.querySelectorAll('button[data-page]').forEach(b => {
                b.removeAttribute('aria-current');
                b.style.backgroundColor = '#f0f0f0';
                b.style.outline = 'none';
              });
              const btn = c.querySelector(`button[data-page="${i}"]`);
              if (btn) {
                btn.setAttribute('aria-current', 'page');
                btn.style.backgroundColor = '#e6e6e6';
                btn.style.outline = '2px solid #888';
              }
            });
          }

          // Función que activa eventos, ahora usando marcarBotonActivo
          function activarEventos(container) {
            container.querySelectorAll('button').forEach(btn => {
              const text = btn.textContent.trim();

              if (text === '<') {
                btn.onclick = () => crearPaginacion(objeto, Math.max(1, paginaInicio - maxBotones));
              } 
              else if (text === '>') {
                btn.onclick = () => crearPaginacion(objeto, paginaFin + 1);
              } 
              else {
                btn.onclick = () => {
                  const i = parseInt(text, 10);
                  const start = (totalPages - i) * itemsPorPagina;
                  const end = start + itemsPorPagina;
                  let slice
                  if (objeto)
                  {
                    slice = objeto.slice(start, end);
                  }
                  else {
                    slice= []
                  }
                  console.log(slice)
                  pintar(slice, objeto_foto);
                  pintar_respuestas(slice, objeto_foto, false);

                  // Marcar ambos contenedores
                  marcarBotonActivo(i);
                };
              }

              // Hover
              btn.addEventListener("mouseover", () => {
                if (!btn.hasAttribute("aria-current")) btn.style.backgroundColor = '#ddd';
              });
              btn.addEventListener("mouseout", () => {
                if (!btn.hasAttribute("aria-current")) btn.style.backgroundColor = '#f0f0f0';
              });
            });
          }

          activarEventos(arriba);
          activarEventos(abajo);

          grid.prepend(arriba);
          grid.append(abajo);

        }



        // Para empezar usa:
        let control=false
        crearPaginacion(objeto, 1);


        const botones = document.querySelectorAll("button");
        for (let boton of botones) {
          const txt = boton.textContent.trim();
          if (txt === "1") {
            boton.addEventListener("click", function() {
              if (!control) {
              escribir_mensaje(false)
              control=true
              }
            })
            boton.click();
          }
          else if (!isNaN(txt)) {
            boton.addEventListener("click", function() {
              document.querySelectorAll('.new-message').forEach(el => el.remove());
              control=false
            })
          }
        }

            
        
        
        
        // pintar(objeto, objeto_foto);
        // pintar_respuestas(objeto, objeto_foto)



      }, 500);

      document.addEventListener("click", function (event) {
      const isInside = event.target.closest(".new-message-answer");
      const isAnswerButton = event.target.closest(".answer_boton");

      if (!isInside && !isAnswerButton) {
        document.querySelectorAll(".new-message-answer").forEach((el) => {
          el.remove();
        });
      }
    });
    }



  catch {
        grid.innerHTML=""
       const mensajeContainer = document.createElement("div");
        mensajeContainer.style.display = "flex";
        mensajeContainer.style.justifyContent = "center";
        mensajeContainer.style.alignItems = "center";
        mensajeContainer.style.marginTop = "5rem";
        mensajeContainer.style.marginBottom = "5rem";

        // Caja estilo tarjeta
        const mensajeError = document.createElement("div");
        mensajeError.textContent = "Error al cargar la informacion";
        mensajeError.style.padding = "1rem 0.5rem";
        mensajeError.style.background = "linear-gradient(250deg,rgb(242, 242, 242),rgb(226, 226, 226))";
        mensajeError.style.border = "2px solid #ddd";
        mensajeError.style.borderRadius = "1rem";
        mensajeError.style.boxShadow = "10px 8px 20px rgba(0, 0, 0, 0.15)";
        mensajeError.style.fontSize = "3rem";
        mensajeError.style.fontFamily = "Roboto, Arial, sans-serif";
        mensajeError.style.fontWeight = "200"; // ahora sí debería verse fino
        mensajeError.style.color = "#333";
        mensajeError.style.textAlign = "center";
        mensajeError.style.opacity = "0";
        mensajeError.style.color="red"
        mensajeError.style.transform = "scale(0.1)";
        mensajeError.style.transition = "all 0.4s ease";

        // Insertamos
        mensajeContainer.append(mensajeError);
        grid.append(mensajeContainer);

        setTimeout(() => {
          mensajeError.style.opacity = "1";
          mensajeError.style.transform = "scale(1)";
        }, 50);

  }



  });
}

export { eventforTablon };
