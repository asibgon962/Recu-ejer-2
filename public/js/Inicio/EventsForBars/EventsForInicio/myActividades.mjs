
function eventforActivities (obj_actividades,upload_activity,get_all_activities_user,delete_activity_and_File, downloadFilefunction, nombre_usuario) {

    document.querySelector("#ActivitiesDiv").addEventListener("click", async function() {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });






      let grid = document.querySelector(".grid");
      grid.innerHTML=""

      const loader = document.createElement("div");
      loader.className = "loader";
      loader.style.display = "block"; // Lo mostramos inmediatamente
      loader.style.width = "5rem";
      loader.style.height = "5rem";
      grid.append(loader);
      let actividades_user
      let var_control=false

      try {
        console.log(obj_actividades)
        actividades_user = await get_all_activities_user();
        console.log(actividades_user);
       

        // Promesa que espera 1 segundo antes de ocultar el loader
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (!obj_actividades) {
              loader.style.display = "none";
              // Crear mensaje de error
              const mensajeContainer = document.createElement("div");
              mensajeContainer.style.display = "flex";
              mensajeContainer.style.justifyContent = "center";
              mensajeContainer.style.alignItems = "center";
              mensajeContainer.style.marginTop = "5rem";
              mensajeContainer.style.marginBottom = "5rem";

              // Caja estilo tarjeta
              const mensajeError = document.createElement("div");
              mensajeError.textContent = "No hay actividades por mostrar";
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
              mensajeError.style.color="black"
              mensajeError.style.transform = "scale(0.1)";
              mensajeError.style.transition = "all 0.4s ease";

              // Insertamos
              mensajeContainer.append(mensajeError);
              grid.append(mensajeContainer);

              // Animación (fade + zoom-in)
              setTimeout(() => {
                mensajeError.style.opacity = "1";
                mensajeError.style.transform = "scale(1)";
              }, 50);
              var_control=true
              return reject(new Error("No se encontraron actividades"));
            }
            loader.style.display = "none";
            resolve();
          }, 1000);
        });
        grid.style.transition = "transform 0.5s ease-out";
        grid.style.transform = "translateX(-250vw)";
        grid.style.overflow = "hidden";

        setTimeout(async () => {
          grid.innerHTML=""

          //1.6) Utilizamos el método reduce para crear un objeto ordenado para crear la interfaz
          const temasDivididos = obj_actividades.reduce((result, actividad) => {
            //  -- Crea una clave para el tema si no existe en el objeto acumulador
            if (!result[actividad.Tema]) {
                result[actividad.Tema] = []; // Inicializa la lista vacía
            }
            //  --Agrega la actividad correspondiente al array del tema
            result[actividad.Tema].push(actividad);
        
            return result; // Devuelve el objeto acumulador actualizado.
            }, {});





          if (actividades_user) {
            console.log(actividades_user);
          }

          //1.7) Recorremos el objeto creado y ordenado para crear la interfaz
          Object.entries(temasDivididos).forEach(([tema, actividades]) => {

            //1.7.1) Añadimos un header h2 al grid por cada tema
            const temaHeader = document.createElement('h2');
            temaHeader.textContent = tema;
            temaHeader.style.color = 'rgb(0, 0, 0)';
            temaHeader.style.marginBottom = '1rem';
            temaHeader.style.fontSize = '2rem';
            grid.appendChild(temaHeader);
            
            //1.7.2) debajo del header correspondiente del tema creamos un div por cada actividad
            const actividadesContainer = document.createElement('div');
            actividadesContainer.style.marginBottom = '1.5rem';
        


            

            //1.8) Creamos y damos formato al div (se crea uno por actividad)
            actividades.forEach(actividad => {
                const actividadDiv = document.createElement('div');
                actividadDiv.style.cursor = 'pointer';
                actividadDiv.style.border = '2px solid #ddd';; // Borde azul con grosor de 2px
                actividadDiv.style.borderRadius = '8px'; // Bordes redondeados
                actividadDiv.style.padding = '0.5rem';
                actividadDiv.style.marginBottom = '1.5rem';
                actividadDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
                actividadDiv.style.transition = "height 0.4s linear, background-color 0.3s ease";
                actividadDiv.style.overflow = "hidden"; // Para evitar saltos visuales
                actividadDiv.style.height = "auto"
                actividadDiv.style.wordBreak="break-all"
                actividadDiv.style.overflowWrap="break-word"
                actividadDiv.style.backgroundColor= "#f8fbff"
               //1.8.1) Inicialmente cada div tiene la siguiente info
                actividadDiv.innerHTML = `
                  <p style="font-size: 1.1rem; margin-bottom:0.5rem; color: black">${actividad.Actividad}</p>
                  <div id="basicInformation" style="font-size: 0.8rem;color: grey; margin-bottom:1rem">
                      <p>Fecha de Creación: <span style="color: black;">${actividad.Fecha_creación || '-'}</span></p>
                      <p>Fecha de Fin: <span style="color: black;">${actividad.Fecha_fin || '-'}</span></p>
                      <p>Estado: <span class="estado" style="color: black;">Abrir para ver</span></p>
                      
                  </div>
              `;
                //Añadimos la exlicacion de la actividad
                const p_explicacion = document.createElement("div");
                p_explicacion.style.textAlign = "left";
                p_explicacion.style.color = "grey";
                
                // Obtener el texto de la base de datos
                let expl = actividad.Explicacion;
                
                // Reemplazar los saltos de línea por etiquetas <br> para que sean visibles en el navegador
                expl = expl.replace(/\n/g, '<br>');
                
                // Aquí reemplazamos las URLs por enlaces clickeables
                const enlaceRegex = /(https?:\/\/[^\s]+)/g; // Expresión regular para encontrar URLs
                expl = expl.replace(enlaceRegex, (url) => {
                    return `<a href="${url}" target="_blank" style="color: blue; text-decoration: underline;">${url}</a>`;
                });
                
                // Insertar el texto con los saltos de línea y enlaces en el HTML
                p_explicacion.innerHTML = 'Explicacion: <span class="estado" style="color: black;">' + expl + '</span>';
                p_explicacion.id = "p_explicacion";
                p_explicacion.style.marginBottom = "1rem";
                p_explicacion.style.fontSize = "0.8rem";
                
                // Agregar el contenedor al DOM
                actividadDiv.append(p_explicacion);

            

              //1.8.2) Añadimos un evento de click a cada div de actividad, controlando cuando se abre para entregar y cuando se cierra
                actividadDiv.addEventListener("click", function(){
                    const estadoSpan=actividadDiv.querySelector(".estado")
                    const existingInteractionContainer = actividadDiv.querySelector(".interaction-container");
                    console.log(existingInteractionContainer)
                    let selectedFile


                    if (existingInteractionContainer) {
                        // || (estadoSpan.textContent==="Entregado")
                        if (((existingInteractionContainer.querySelector("textarea").value==="") && !selectedFile) || (existingInteractionContainer.querySelector("#containerForSummary").innerHTML==="")
                          || (estadoSpan.textContent==="Entregado") || (estadoSpan.textContent==="Entregado. No calificado")) {

                          existingInteractionContainer.remove();
                          const estadoSpan=actividadDiv.querySelector(".estado")
                          estadoSpan.textContent="Abrir para ver"
                          estadoSpan.style.color="rgba(0,0,0,1)"


                          setTimeout(() => {
                              actividadDiv.style.height = "auto";
                          }, 10);
                        return
                        }
                        else {
                          const confirmDelete = confirm("¿Estás seguro? Perderás la selección.");
                          if (confirmDelete) {
                              existingInteractionContainer.remove();
                              setTimeout(() => {
                                  actividadDiv.style.height ="auto";
                              }, 10);
                              const estadoSpan=actividadDiv.querySelector(".estado")
                              estadoSpan.textContent="Abrir para ver"
                              estadoSpan.style.color="rgba(0,0,0,1)"

                          }
                          return; // Salimos para evitar añadir otro interactionContainer}
                      
                      }
                    }


                    //1.8.3) Cada div tiene un interactionContainer, que contendrá el textarea para enviar comentarios y
                    //los botones necesarios para realizar la entrega, además tendrá la clase ".interaction-container"
                    const interactionContainer = document.createElement('div');
                    interactionContainer.style.border = '1px solid #ddddddff';
                    interactionContainer.style.borderRadius = '8px';
                    interactionContainer.style.padding = '1rem'; // Espaciado interno para darle más espacio al contenido
                    interactionContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Sombra sutil para un efecto elegante
                    interactionContainer.style.margin = '1rem'; // Espaciado externo
                    //--Ojo, importante quitar la propagación para que el evento click de la propia actividad no afecte
                    //al evento click de los botones
                    

                    estadoSpan.textContent = 'No entregado';
                    estadoSpan.style.color = 'red';

                    interactionContainer.addEventListener("click", function(event){
                      event.stopPropagation();
                    })

                    //--Indicamos que en contenedor interactionContainer es donde se debe agregar comentarios y archivos para la entrega
                    interactionContainer.innerHTML+="<p id=encabezadoEntrega style='margin-bottom:1rem; color:grey'><u>Aqui debes hacer la entrega con comentarios</u></p>"
                    
                    //Le damos formato al iterarion container
                    interactionContainer.classList.add("interaction-container");
                    interactionContainer.style.backgroundColor = "rgb(255, 255, 255)";  
                    interactionContainer.style.padding = '1rem';
                    interactionContainer.style.marginTop = '1rem';
                    interactionContainer.style.borderRadius = '0.6rem';
                    interactionContainer.style.textAlign="center"

                    //Creamos un textarea donde añadir comentarios
                    const commentTextarea = document.createElement('textarea');
                    commentTextarea.placeholder = 'Escribe un comentario...';
                    commentTextarea.style.width = '100%';
                    commentTextarea.style.height = '8rem';
                    commentTextarea.style.marginBottom = '1rem';
                    commentTextarea.style.padding = '0.8rem';
                    commentTextarea.style.border = '1px solid #ddd';
                    commentTextarea.style.borderRadius = '1rem';
                    commentTextarea.style.resize = 'none';
                    commentTextarea.style.fontSize="0.7rem"
                    interactionContainer.appendChild(commentTextarea);


                    //Creamos un "#containerForSummary" donde resumiremos el archivo y comentario entregado
                    const previewContainer = document.createElement('div');
                    previewContainer.id="containerForSummary"
                    previewContainer.style.display = 'flex';
                    previewContainer.style.flexDirection = 'column';
                    previewContainer.style.gap = '0.8rem';
                    interactionContainer.appendChild(previewContainer);

            
                    //Creamos un buttonContainer que tendrá tres botones, enviar, borrar y agregar archivo
                    const buttonContainer = document.createElement('div');
                    buttonContainer.style.display = 'flex';
                    buttonContainer.style.gap = '1rem';
                    buttonContainer.style.justifyContent = 'flex-start';
                    buttonContainer.style.marginTop = '1rem';
            
                    const selectFileButton = document.createElement('button');
                    selectFileButton.innerHTML = '&#128206;'; // Clip icon
                    selectFileButton.title = 'Seleccionar archivo';
                    selectFileButton.style.flex = '1';
                    selectFileButton.style.padding = '0.8rem';
                    selectFileButton.style.border = 'none';
                    selectFileButton.style.fontSize = '1.4rem';
                    selectFileButton.style.backgroundColor = '#e0e0e0';
                    selectFileButton.style.borderRadius = '0.6rem';
                    buttonContainer.appendChild(selectFileButton);
            
                    const deleteFileButton = document.createElement('button');
                    deleteFileButton.innerHTML = '&#128465;'; // Trash icon
                    deleteFileButton.title = 'Borrar entrega';
                    deleteFileButton.style.flex = '1';
                    deleteFileButton.style.padding = '0.8rem';
                    deleteFileButton.style.border = 'none';
                    deleteFileButton.style.fontSize = '1.4rem';
                    deleteFileButton.style.backgroundColor = '#e57373';
                    deleteFileButton.style.color = '#fff';
                    deleteFileButton.style.borderRadius = '0.6rem';
                    buttonContainer.appendChild(deleteFileButton);
            
                    const sendFileButton = document.createElement('button');
                    sendFileButton.innerHTML = '&#11014;'; // Arrow up icon
                    sendFileButton.title = 'Enviar entrega';
                    sendFileButton.style.flex = '1';
                    sendFileButton.style.padding = '0.8rem';
                    sendFileButton.style.border = 'none';
                    sendFileButton.style.fontSize = '1.4rem';
                    sendFileButton.style.backgroundColor = '#81c784';
                    sendFileButton.style.color = '#fff';
                    sendFileButton.style.borderRadius = '0.6rem';
                    buttonContainer.appendChild(sendFileButton);
            
                    interactionContainer.appendChild(buttonContainer);
            
                    //1.9) Añadimos un evento click al botón de agregar achivo, que añadirá información a preview container
                    selectFileButton.addEventListener('click', () => {
                      //Creamos un fileinput ficticio
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        //fileInput.accept = '.zip, .rar, .pdf, .png';
                        ;
                        fileInput.multiple = false
                        fileInput.name="achivo"
                        fileInput.style.display = 'none';
                        document.body.appendChild(fileInput);
            
                        fileInput.click();
            
                        //1.9.1) Añadimos un evento change sobre el input para agrgar archivo
                        fileInput.addEventListener('change', () => {
                            actividadDiv.style.height="auto"
                            if (fileInput.files.length > 0) {
                                selectedFile = fileInput.files[0];
                                const allowedExtensions = ['.zip', '.rar', '.pdf', '.png', 'jpeg'];
                                const fileName2 = selectedFile.name.toLowerCase();
                                const isValid = allowedExtensions.some(ext => fileName2.endsWith(ext));

                                if (!isValid) {
                                  alert("⚠️ Archivo no válido. Solo se permiten: .zip, .rar, .pdf, .png");
                                  previewContainer.innerHTML = '';
                                  document.body.removeChild(fileInput);
                                  return; // salimos de la función
                                }

                                previewContainer.innerHTML = '';
            
                                const filePreview = document.createElement('div');
                                filePreview.style.display = 'flex';
                                filePreview.style.alignItems = 'center';
                                filePreview.style.gap = '0.8rem';
            
                                const fileIcon = document.createElement('span');
                                fileIcon.style.fontSize = '1rem';
                                fileIcon.style.color = "grey";
                                fileIcon.textContent = selectedFile.type.startsWith('image/') ? '🖼️' : '📄';
            
                                const fileName = document.createElement('span');
                                fileName.textContent = selectedFile.name;
                                fileName.style.fontSize = '0.7rem';
                                filePreview.appendChild(fileIcon);
                                filePreview.appendChild(fileName);
            
                                previewContainer.appendChild(filePreview);
                                previewContainer.style.display="block"
                            }
                            document.body.removeChild(fileInput);
                        });
                    });
            

                    //1.10) Añadimos un evento click al botón de borrar selección/borrar entrega de la bd
                    //Aquí borraremos lo que hayamos entregado ya o borramos lo que estemos a punto de entregar (reseteo)
                    deleteFileButton.addEventListener('click', async () => {
                        // Convertimos Fecha_Fin a Date, considerando el final del día
                        const fechaFin = new Date(actividad.Fecha_fin + "T23:59:59");
                        const fechaActual = new Date();
                        console.log(fechaFin)
                        console.log(fechaActual)

                        // Verificación de fecha límite
                        if (fechaActual > fechaFin) {
                            alert("❌ No se puede borrar una actividad fuera de la fecha límite.");
                            return; // Salimos sin borrar
                        }

                        if (confirm('¿Estás seguro de que quieres borrar la entrega?')) {
                            try {
                                // Deshabilitamos interacción y aplicamos opacidad
                                actividadDiv.style.pointerEvents = "none";
                                actividadDiv.style.opacity = "0.5";

                                // Mostramos loader
                                loader.className = "loader";
                                loader.style.display = "block";
                                loader.style.width = "2rem";
                                loader.style.height = "2rem";

                                // Ocultamos botones y vista previa
                                deleteFileButton.style.display = "none";
                                previewContainer.style.display = "none";
                                interactionContainer.querySelector("#encabezadoEntrega").style.display = "none";
                                actividadDiv.style.height = "auto";
                                interactionContainer.append(loader);

                                // Borrado real desde backend
                                const result = await delete_activity_and_File(actividad.Actividad, actividad.Tema);

                                if (!result.ok) {
                                  document.querySelectorAll(".loader").forEach(element => element.style.display = "none");
                                  actividadDiv.style.pointerEvents = "auto";
                                  actividadDiv.style.opacity = "1";
                                  deleteFileButton.style.display = "block";
                                  previewContainer.style.display = "block";
                                 interactionContainer.querySelector("#encabezadoEntrega").style.display = "block";
                                  if (result.status === 400 && result.message.includes("fecha límite")) {
                                      alert("❌ No se puede borrar la actividad: la fecha de borrado ha superado la fecha límite");
                                      return; // cortamos la ejecución
                                  } else {
                                      console.error("Error al eliminar la actividad:", result.message);
                                      return; // opcional, cortamos la ejecución
                                  }
}

                                // Pequeña pausa para UX
                                await new Promise((resolve) => {
                                    setTimeout(() => {
                                        loader.style.display = "none";
                                        resolve();
                                    }, 1000);
                                });

                                // Limpiamos estado local
                                selectedFile = null;
                                actividades_user = actividades_user.filter(item => {
                                    return !(item.Actividad === actividad.Actividad && item.Tema === actividad.Tema);
                                });

                                // Restauramos interfaz
                                commentTextarea.value = '';
                                commentTextarea.style.display = 'block';
                                selectFileButton.style.display = "block";
                                sendFileButton.style.display = "block";
                                deleteFileButton.style.display = "block";

                                const estadoSpan = actividadDiv.querySelector('.estado');
                                estadoSpan.textContent = 'No entregado';
                                estadoSpan.style.color = 'red';
                                actividadDiv.style.height = "auto";

                                interactionContainer.querySelector("#encabezadoEntrega").innerHTML = "<u>Aqui debes hacer la entrega con comentarios</u>";
                                interactionContainer.querySelector("#encabezadoEntrega").style.display = "block";

                                // Reactivamos interacción
                                actividadDiv.style.pointerEvents = "auto";
                                actividadDiv.style.opacity = "1";

                            } catch {
                                // En caso de error
                                document.querySelectorAll(".loader").forEach(element => element.style.display = "none");
                                actividadDiv.style.pointerEvents = "auto";
                                actividadDiv.style.opacity = "1";
                                deleteFileButton.style.display = "block";
                                previewContainer.style.display = "block";
                                interactionContainer.querySelector("#encabezadoEntrega").style.display = "block";


                                alert("No se ha podido borrar la actividad ahora mismo, inténtelo más tarde");
                            }
                        }
                    });

                    

                    //1.11)Añadimos un evento click sobre el botón de enviar, que enviará info a la BD
                    sendFileButton.addEventListener('click', async () => {
                        const comment = commentTextarea.value.trim();
                        actividadDiv.style.pointerEvents = "none";  // no se puede clicar ni interactuar
                        actividadDiv.style.opacity = "0.5";
                        if (selectedFile && comment) {
                            console.log(comment)
                            console.log(actividad.Actividad)
                            console.log(actividad.Tema)
                            try{
                              const loader = document.createElement("div");
                              loader.className = "loader";
                              loader.style.display = "block"; // Lo mostramos inmediatamente
                              loader.style.width = "2rem";
                              loader.style.height = "2rem";
                              commentTextarea.style.display = "none";
                              previewContainer.innerHTML=""
                              previewContainer.append(loader)
                              const fechaFin = new Date(actividad.Fecha_fin + "T23:59:59");
                              const fechaActual = new Date();

                              // Comprobar si la fecha actual ha superado la fecha límite
                              if (fechaActual > fechaFin) {
                                  document.querySelectorAll(".loader").forEach(function(element) {
                                    element.style.display="none"
                                  })
                                  commentTextarea.style.display = "block";
                                  actividadDiv.style.pointerEvents = "auto";  // no se puede clicar ni interactuar
                                  actividadDiv.style.opacity = "1";
                                  alert("No puedes subir la actividad tarde")
                                  return; // cortamos la ejecución
                              }
                              await upload_activity(selectedFile,comment, actividad.Actividad, actividad.Tema)
                              await new Promise((resolve) => {
                                setTimeout(() => {
                                    loader.style.display = "none";
                                  resolve();
                                }, 1000);
                              })
                              if (selectedFile) {
                                  // Obtener la fecha actual en formato dd/mm/yyyy, hh:mm:ss
                                  const ahora = new Date();
                                  const fechaEntrega = ahora.toLocaleString("es-ES"); // Esto da el formato deseado

                                  // Crear el nuevo objeto
                                  const nuevaActividad = {
                                    "Actividad": actividad.Actividad,     
                                    "Tema": actividad.Tema,            
                                    "Comentarios": comment,  
                                    "username": nombre_usuario,         
                                    "Fecha entrega": fechaEntrega,
                                    "Nombre_archivo": selectedFile.name
                                  };
                                  console.log(actividades_user)
                                  if (!Array.isArray(actividades_user)) {
                                    actividades_user = [];
                                  }

                                  // Agregar al array

                                  actividades_user.push(nuevaActividad);
                                }
                                console.log(actividades_user)
                              const estadoSpan = actividadDiv.querySelector('.estado');
                              estadoSpan.textContent = 'Entregado. No calificado';
                              estadoSpan.style.color = 'orange';
                              previewContainer.style.textAlign="left"
              
                              previewContainer.innerHTML = `
                                <div id="downloadFile" style="display: flex; align-items: center; gap: 0.6rem;">
                                    <span style="font-size:0.8rem">Archivo: </span>
                                    <span style="font-size: 1.2rem;">${selectedFile.type.startsWith('image/') ? '🖼️' : '📄'}</span>
                                    <span style="font-size:0.8rem; color:blue; text-decoration:underline; cursor:pointer; word-break: break-all;">
                                        <strong>${selectedFile.name}</strong>
                                    </span>
                                </div>
                                <p style="font-size:0.8rem;color:grey">
                                    <strong style="color:black">Comentario alumno:</strong> ${comment}
                                </p>
                                <p style="font-size:0.8rem;color:grey">
                                    <strong style="color:black">Comentario profesor:</strong> -
                                </p>
                                <p style="font-size:0.8rem;color:grey">
                                    <strong style="color:black">Calificación profesor:</strong> -
                                </p>
                              `;


                              sendFileButton.style.display="none"
                              selectFileButton.style.display="none"
                              actividadDiv.style.height="auto"
                              interactionContainer.querySelector("#encabezadoEntrega").innerHTML="<u>Entrega realizada</u>"
                              

                              if (previewContainer.querySelector('#downloadFile')) {
                                const sendExcerciseElement = previewContainer.querySelector('#downloadFile');
                                sendExcerciseElement.addEventListener('click', async (event) => {
                                event.stopPropagation()
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
                                await downloadFile(actividad.Actividad,actividad.Tema)
                                })
                              }
                            actividadDiv.style.pointerEvents = "auto";  // no se puede clicar ni interactuar
                            actividadDiv.style.opacity = "1";
                            }
                            catch {
                              document.querySelectorAll(".loader").forEach(function(element) {
                                element.style.display="none"
                              })
                              commentTextarea.style.display = "block";
                              actividadDiv.style.pointerEvents = "auto";  // no se puede clicar ni interactuar
                              actividadDiv.style.opacity = "1";
                              alert("error al subir el archivo, intentalo de nuevo o más tarde. Revise la extensión permitida '.zip, .rar, .pdf, .png' y que estés en fecha de entrega")
                            }
                            // Aquí debería ir el fetch.
                          } 
                        else {
                            alert('Por favor, selecciona un archivo y escribe un comentario antes de enviar.');
                          }
                      });

                      
                    if (actividades_user.message) {
                      console.log("no hay avtividades que mostrar")
                    }


                    else if (actividades_user.some(entrega => entrega.Actividad === actividad.Actividad && entrega.Tema === actividad.Tema)) {
                      const entrega = actividades_user.find(entrega => entrega.Actividad === actividad.Actividad);
                      const estadoSpan = actividadDiv.querySelector('.estado');
                      if (entrega.Calificacion) {
                          estadoSpan.textContent = 'Calificado';
                          estadoSpan.style.color = 'green';
                          previewContainer.style.textAlign = "left";

                          previewContainer.innerHTML = `
                              <div id="downloadFile" style="display: flex; align-items: center; gap: 0.6rem;">
                                  <span style="font-size:0.8rem">Archivo: </span>
                                  <span style="font-size: 1.2rem;">
                                      ${entrega.Nombre_archivo.startsWith('image/') ? '🖼️' : '📄'}
                                  </span>
                                  <span 
                                      style="font-size:0.8rem; color:blue; word-break: break-all; text-decoration:underline; cursor:pointer;">
                                      <strong>${entrega.Nombre_archivo}</strong>
                                  </span>
                              </div>
                              <p style="font-size:0.8rem;color:grey">
                                  <strong style="color:black">Comentario:</strong> ${entrega.Comentarios || '-'}
                              </p>
                              <p style="font-size:0.8rem;color:grey">
                                  <strong style="color:black">Comentario profesor:</strong> ${entrega.ComentarioProfesor || '-'}
                              </p>
                              <p style="font-size:0.8rem;color:grey">
                                  <strong style="color:black">Calificación profesor:</strong> ${entrega.Calificacion}
                              </p>
                          `;
                      } else {
                          estadoSpan.textContent = 'Entregado. No calificado';
                          estadoSpan.style.color = 'orange';
                          previewContainer.style.textAlign = "left";

                          previewContainer.innerHTML = `
                              <div id="downloadFile" style="display: flex; align-items: center; gap: 0.6rem;">
                                  <span style="font-size:0.8rem">Archivo: </span>
                                  <span style="font-size: 1.2rem;">
                                      ${entrega.Nombre_archivo.startsWith('image/') ? '🖼️' : '📄'}
                                  </span>
                                  <span 
                                      style="font-size:0.8rem; color:blue; word-break: break-all; text-decoration:underline; cursor:pointer;">
                                      <strong>${entrega.Nombre_archivo}</strong>
                                  </span>
                              </div>
                              <p style="font-size:0.8rem;color:grey">
                                  <strong style="color:black">Comentario:</strong> ${entrega.Comentarios || '-'}
                              </p>
                              <p style="font-size:0.8rem;color:grey">
                                  <strong style="color:black">Comentario profesor:</strong> -
                              </p>
                              <p style="font-size:0.8rem;color:grey">
                                  <strong style="color:black">Calificación profesor:</strong> -
                              </p>
                          `;
                      }

                  
                      if (previewContainer.querySelector('#downloadFile')) {
                        const sendExcerciseElement = previewContainer.querySelector('#downloadFile');
                        sendExcerciseElement.addEventListener('click', async (event) => {
                          event.stopPropagation()
                          console.log("typeof downloadFile:", typeof downloadFile);
                          
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
                          await downloadFile(actividad.Actividad,actividad.Tema)
                        })
                      }

                      commentTextarea.style.display = 'none';
                      sendFileButton.style.display="none"
                      selectFileButton.style.display="none"
                      actividadDiv.style.height="auto"
                      interactionContainer.querySelector("#encabezadoEntrega").innerHTML="<u>Entrega realizada</u>"

                      //Aqui se añade un addevent listener al boton para borrar de la db la entrega
                      
                    }

                    else {
                      const estadoSpan = actividadDiv.querySelector('.estado');
                      estadoSpan.textContent = 'No entregado';
                      estadoSpan.style.color = 'red';
                    }

                  
                  //1.14)Por último pero no menos importante de este primer punto, añadimos
                  //La animación al preview container
                  const initialHeight = actividadDiv.offsetHeight;
                  actividadDiv.appendChild(interactionContainer);
                  const newHeight = actividadDiv.offsetHeight;


                  actividadDiv.style.height = `${initialHeight}px`;
                  setTimeout(() => {
                      actividadDiv.style.height = newHeight+"px";
                  }, 10);

                  
                })

                //Añadimos al div de actividades con nuestro div de la actividad
                actividadesContainer.appendChild(actividadDiv);
           });

            //Añadimos al grid nuestro único div con todas las actividades
            grid.appendChild(actividadesContainer);
        });
        grid.style.transform = ""; //esto es lo que hace la animacion posible
      },250)



      } catch {
        if(!var_control) {
        // Quitar loader si hay error
          loader.style.display = "none";

          // Crear mensaje de error
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
      }

      // const obj_actividades=[
      // {Tema:"Tema 1",Color:"green", Actividad: "Actividad 1", Fecha_fin: "2024-12-23",  Fecha_creación: "2024-12-17", Explicacion:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", Abreviacion:"T1Act1"},
      // {Tema:"Tema 1",Color:"green",  Actividad: "Actividad 2", Fecha_fin: "2024-12-27", Fecha_creación: "2024-12-20", Explicacion: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", Abreviacion:"T1Act2"},
      // {Tema:"Tema 2",Color:"blue",  Actividad: "Actividad 1", Fecha_fin: "2024-12-23", Fecha_creación: "2024-12-15", Explicacion:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", Abreviacion:"T2Act1"},
      // {Tema:"Tema 2",Color:"blue", Actividad: "Actividad 1", Fecha_fin: "2025-01-20", Fecha_creación: "2024-12-13", Explicacion:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", Abreviacion:"T2Act2"},
      // {Tema:"Tema 2",Color:"blue", Actividad: "Actividad 1", Fecha_fin: "2025-01-15", Fecha_creación: "2025-01-08", Explicacion:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", Abreviacion:"T2Act3"},
      // {Tema:"Tema 3",Color:"orange", Actividad: "Actividad 1", Fecha_fin: "2025-02-20", Fecha_creación: "2025-02-13", Explicacion:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", Abreviacion:"T3Act1"}]
    



    })

}





export{eventforActivities}