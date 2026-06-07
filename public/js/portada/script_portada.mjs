

function popUp(color) {
    //div que pone la pantalla en negro
    let div_absolute=document.createElement("div")
    div_absolute.id="div_absolute_background"
    div_absolute.style.position = "fixed"; // en vez de absolute
    div_absolute.style.zIndex = "1000000"; // en vez de absolute
    div_absolute.style.top = "0";
    div_absolute.style.left = "0";
    div_absolute.style.width = "100%";
    div_absolute.style.height = "100%";
    div_absolute.style.pointerEvents = "auto"; // para que reciba clics
    div_absolute.style.backgroundColor = "rgba(88, 88, 88, 0.7)";
    div_absolute.style.width="100vw"
    document.querySelector("body").appendChild(div_absolute)

    //div que crea el recuadro de iniciar sesión
    let div_absolute_2=document.createElement("div")
    div_absolute_2.id="div_absolute_poppup"
    div_absolute_2.style.position="fixed "
    div_absolute_2.style.top="50%"
    div_absolute_2.style.left="50%"
    div_absolute_2.style.padding="5rem"
    div_absolute_2.style.paddingTop="0.5rem"
    div_absolute_2.style.paddingBottom="2.5rem"
    div_absolute_2.style.zIndex="10000000"
    div_absolute_2.style.transform = "translate(-50%, -50%)"
    div_absolute_2.style.pointerEvents = "auto";
    div_absolute_2.style.backgroundColor=color
    div_absolute_2.style.borderRadius="1.5rem"
    div_absolute_2.style.boxShadow="0.2rem 0.2rem 0.2rem 0.2rem rgba(4, 1, 46, 0.5)"
    
    let closeBtn = document.createElement("button")
    closeBtn.innerHTML = "&times;" // símbolo de multiplicar (X)
    closeBtn.style.position = "absolute"
    closeBtn.style.top = "0.5rem"
    closeBtn.style.right = "0.5rem"
    closeBtn.style.background = "transparent"
    closeBtn.style.border = "none"
    closeBtn.style.color = "white"
    closeBtn.style.fontSize = "1.5rem"
    closeBtn.style.cursor = "pointer"
    closeBtn.addEventListener("click", function() {
        div_absolute.remove()
        div_absolute_2.remove()
    })
    div_absolute_2.appendChild(closeBtn)



    let img_logo=document.createElement("img")
    img_logo.src="./img/logo.png"
    img_logo.style.width="5rem"
    img_logo.style.marginBottom="1rem"
    div_absolute_2.append(img_logo)
    document.querySelector("body").appendChild(div_absolute_2)

    div_absolute.addEventListener("click", function() {
        // Remueve el fondo negro y el pop-up
        div_absolute.remove();
        div_absolute_2.remove();
    });        
}


function createform (config) {
    const form = document.createElement("form");
    form.action = config.action || "#"; 
    form.method = config.method || "POST"; 
    form.id = config.id || "dynamicForm"; 
    form.style.display = config.style?.display || "flex";
    form.style.flexDirection = config.style?.flexDirection || "column";
    form.style.gap = config.style?.gap || "1rem";
    form.enctype= config.enctype


    config.fields.forEach(field => {
        const fieldContainer = document.createElement("div");
        fieldContainer.className = "form-group"; // Clase para estilo

        // Crear la etiqueta si existe
        if (field.label) {
            const label = document.createElement("label");
            label.textContent = field.label;
            label.htmlFor = field.id || field.name;
            fieldContainer.appendChild(label);
        }

        // Crear el campo de entrada
        const input = document.createElement("input");
        input.type = field.type || "text"; // Tipo de input (text, email, password, etc.)
        input.name = field.name || ""; // Nombre del campo
        input.id = field.id || ""; // ID del campo
        input.placeholder = field.placeholder || ""; // Placeholder
        input.required = field.required || false; // Si el campo es obligatorio

        // Agregar clases y estilos adicionales al input si se especifican
        if (field.className) input.className = field.className;
        if (field.style) Object.assign(input.style, field.style);


        fieldContainer.appendChild(input);

        // Agregar el campo al formulario
        form.appendChild(fieldContainer);

    });

    let div_separator=document.createElement("div")
    div_separator.className="separator"
    form.appendChild(div_separator);

    // Crear un botón de envío
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = config.submitText || "Enviar";
    submitButton.className = config.submitClass || "btn-submit";

    form.appendChild(submitButton);


    // Agregar el formulario al cuerpo o a un contenedor especificado
    const targetContainer = document.querySelector(config.targetContainer || "body");
    targetContainer.appendChild(form);
}






document.addEventListener('DOMContentLoaded', () => {
    const encabezado = document.getElementById("h2_anim");
    let intervaloId;
        // Función para añadir letras con un intervalo
    function escribirTexto(frase_escribir) {
        const palabras = frase_escribir.split(" "); // Dividimos el texto en palabras
        let letraIndex = 0;
        let palabraIndex = 0;
        let frase = "";
        encabezado.textContent=""
        const clases = ['font-1', 'font-2', 'font-3', 'font-4', 'font-5'];  // Clases para los estilos
        

        function animar() {
            if (palabraIndex < palabras.length) {
                const palabra = palabras[palabraIndex];
                let palabraHtml = '';

                // Crear palabra con las letras hasta el índice actual
                for (let i = 0; i <= letraIndex; i++) {
                    palabraHtml += palabra[i];
                }

                // Aplicar estilo
                const textoconestilo = `<span class="${clases[palabraIndex % clases.length]}">${palabraHtml}</span> `;
                encabezado.innerHTML = frase + textoconestilo; // Mostrar el texto en el encabezado

                letraIndex++; // Aumentar el índice de letra

                if (letraIndex === palabra.length) { // Si ya hemos terminado una palabra
                    letraIndex = 0;
                    frase += textoconestilo + "<br>"; // Añadir la palabra completa al texto mostrado
                    palabraIndex++; // Avanzar a la siguiente palabra
                }
            }
        }
        intervaloId =setInterval(animar, 100);
    }


    escribirTexto("¡Bienvenido a la Formación Profesional!");


    document.querySelector("#images_container").addEventListener("click", function() {
        clearInterval(intervaloId)
        escribirTexto("¡La doc está disponible abajo!");
    });

    //---------Eventos a partir de la funcion anterior--------------------
    document.querySelector("#singup").addEventListener("click", function(){
        popUp("rgb(0, 0, 0)")
        let texto_plano=document.createElement("h2")
        texto_plano.style.fontFamily = "'Arial', sans-serif"; // Fuente moderna
        texto_plano.textContent="Inicio de Sesión"
        texto_plano.style.fontSize="1.5rem"
        texto_plano.color="white"
        document.querySelector("#div_absolute_poppup").append(texto_plano)
        createform({
            id: "loginForm_singup",
            action: "/inicio",
            method: "POST",
            enctype: "application/x-www-form-urlencoded",
            fields: [
                {
                    type: "text",
                    id: "username",
                    name: "username",
                    placeholder: "Nombre de usuario",
                    required: true
                },
                {
                    type: "password",
                    id: "password",
                    name: "password",
                    placeholder: "Contraseña",
                    required: true
                }
            ],
            submitText: "Iniciar sesión",
            targetContainer: "#div_absolute_poppup" // ID del contenedor donde se añadirá el formulario
        });
    
        const form = document.getElementById("loginForm_singup");
        const mensaje_servidor = document.createElement("p");
        mensaje_servidor.style.fontFamily = "'Arial', sans-serif";
        mensaje_servidor.style.fontSize = "1.1rem";
        mensaje_servidor.style.marginTop = "1rem";
        mensaje_servidor.style.display="none"
        const popupDiv = document.querySelector("#div_absolute_poppup");
        popupDiv.append(mensaje_servidor);

        if (form) {
            const boton= form.querySelector("button");

            form.addEventListener("submit", async function(event) {
                event.preventDefault(); // Evita recargar la página

                // Spinner opcional mientras se procesa la petición
                let loader = document.createElement("div");
                loader.className = "loader";
                popupDiv.append(loader);
                boton.textContent = "Enviado";
                boton.style.opacity = "0.4";   // efecto visual
                boton.style.cursor = "not-allowed";
                boton.disabled = true

                // Recoger los datos del formulario
                const formData = new FormData(form);
                const data = new URLSearchParams();
                for (const pair of formData) {
                    data.append(pair[0], pair[1]);
                }

                try {
                    const response = await fetch(form.action, {
                        method: form.method,
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: data
                    });

                    loader.remove(); // Quitar spinner



                    if (response.ok) {
                        mensaje_servidor.style.display="block"
                        mensaje_servidor.style.color = "green";
                        mensaje_servidor.textContent = "¡Inicio de sesión exitoso!";
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        window.location.href = "/inicio.html";

                    } 
                    else {
                        mensaje_servidor.style.display="block"
                        mensaje_servidor.style.color = "red";
                        mensaje_servidor.textContent = `Error: Usuario o contraseña invalidos`;
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        mensaje_servidor.style.display="none"
                        boton.disabled = false;
                        boton.textContent = "Enviar";
                        boton.style.opacity = "1";   // efecto visual
                        boton.style.cursor = "default";
                        
                    }

                    
                    
                } catch (error) {
                    loader.remove();
                    mensaje_servidor.style.display="block"
                    mensaje_servidor.style.color = "red";
                    mensaje_servidor.textContent = `Error de conexión: ${error.message}`;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    mensaje_servidor.style.display="none"
                    boton.disabled = false;
                    boton.textContent = "Enviar";
                    boton.style.opacity = "1";   // efecto visual
                    boton.style.cursor = "default";

                }
            });
        }






    })


    

    
    document.querySelector("#register").addEventListener("click", function(){
        popUp("rgb(0, 0, 0)")
        let texto_plano=document.createElement("h2")
        texto_plano.style.fontFamily = "'Arial', sans-serif"; // Fuente moderna
        texto_plano.textContent="Registrate en tu nuevo Classroom"
        texto_plano.style.fontSize="1.5rem"
        texto_plano.color="white"
        document.querySelector("#div_absolute_poppup").append(texto_plano)
        createform({
            id: "createuserForm",
            action: "/register",
            enctype:"multipart/form-data",
            method: "POST",
            fields: [
                {
                    type: "text",
                    id: "nombre",
                    name: "nombre",
                    placeholder: "Nombre",
                    required: true
                },
                {
                    type: "text",
                    id: "username",
                    name: "username",
                    placeholder: "Nombre de usuario",
                    required: true
                },
                {
                    type: "text",
                    id: "email",
                    name: "email",
                    placeholder: "Email educaand",
                    required: true
                },
 
                {
                    type: "password",
                    id: "password",
                    name: "password",
                    placeholder: "Contraseña",
                    required: true
                },
                {
                    type: "password",
                    name: "repit_password",
                    id: "repit_password",
                    placeholder: "Repite tu contraseña",
                    required: true
                },
                {
                    type: "file",
                    id: "foto",
                    name: "foto",
                    placeholder: "Inserta una foto",
                    required: true
                },

            ],
            submitText: "Crear usuario",
            targetContainer: "#div_absolute_poppup" // ID del contenedor donde se añadirá el formulario
        });

        //Arreglamos cosas en el caso del de crear usuario
        const div_absolute_poppup = document.querySelector("#div_absolute_poppup");
        // 🔄 Crear un spinner visual
        const loader = document.createElement("div");
        loader.className = "loader"; // Usaremos CSS para la animación
        loader.style.display = "none"; // Oculto al inicio
        div_absolute_poppup.appendChild(loader);

        const form = document.getElementById("createuserForm");
        const mensaje_vista_previa_usuario = document.createElement("p");
        const mensajeError = document.createElement("p")
        const mensajeError2 = document.createElement("p")
        const mensajeError3 = document.createElement("p")
        const mensajeError4 = document.createElement("p")
        mensajeError.style.display = "none";
        mensajeError2.style.display = "none";
        mensajeError3.style.display = "none";
        mensajeError4.style.display = "none";
        mensajeError.style.color = "red";
        mensajeError2.style.color = "red";
        mensajeError3.style.color = "red";
        mensajeError4.style.color = "red";
        div_absolute_poppup.append(mensajeError)
        div_absolute_poppup.append(mensajeError2)
        div_absolute_poppup.append(mensajeError3)
        div_absolute_poppup.append(mensajeError4)
        if (form) {
            const inputFoto = document.getElementById("foto"); // input type="file"
            let username = document.getElementById("username"); // input type="file"
            username.maxLength = 8
            const inputPassword = document.getElementById("password");
            const inputRepite = document.getElementById("repit_password");
            const inputEmail = document.getElementById("email");
            const boton= form.querySelector("button");

            inputEmail.addEventListener("input", function () {
            const email = inputEmail.value.trim();
            const dominio = "@g.educaand.es";
            // Verifica si termina correctamente
            if (email.endsWith(dominio)) {
                const nombre = email.slice(0, -dominio.length); // Parte antes de @g.educaand.es

                if (nombre.length >= 5) {
                    boton.disabled = false;
                    boton.textContent = "Enviar";
                    boton.style.opacity = "1";   // efecto visual
                    boton.style.cursor = "default";
                    mensajeError2.style.display = "none";
                } else {
                // Menos de 5 caracteres antes del dominio
                    mensajeError2.textContent = "Debe tener al menos 5 caracteres antes de @g.educaand.es";
                    mensajeError2.style.display = "block";
                    boton.disabled = true; // 🔒 bloqueado para siempre
                    boton.textContent = "Enviar";
                    boton.style.opacity = "0.4";   // efecto visual
                    boton.style.cursor = "not-allowed";
                }
            } else {
                if (email.length === 0) {
                // Válido
                    mensajeError2.style.display = "none";
                    boton.disabled = false;
                    boton.textContent = "Enviar";
                    boton.style.opacity = "1";   // efecto visual
                    boton.style.cursor = "default";
                }
                else {
                // Dominio incorrecto
                    mensajeError2.textContent = "El correo debe terminar en @g.educaand.es";
                    mensajeError2.style.display = "block";
                    boton.disabled = true; // 🔒 bloqueado para siempre
                    boton.textContent = "Enviar";
                    boton.style.opacity = "0.4";   // efecto visual
                    boton.style.cursor = "not-allowed";
                }
            }
            });
            //verificamos si las contraseñas que introduce el usuario coinciden
           
            function verificarCoincidencia() {
            const formData = new FormData(form);
                const pass1 = formData.get("password");
                const pass2 = formData.get("repit_password");

                if (pass1 && pass2 && pass1 !== pass2) {
                    mensajeError.textContent = "Las contraseñas no coinciden.";
                    mensajeError.style.display = "block";

                    boton.disabled = true; // 🔒 bloqueado para siempre
                    boton.textContent = "Enviar";
                    boton.style.opacity = "0.4";   // efecto visual
                    boton.style.cursor = "not-allowed";
                } else {
                    mensajeError.textContent = "";
                    mensajeError.style.display = "none";
                    boton.disabled = false;
                    boton.textContent = "Enviar";
                    boton.style.opacity = "1";   // efecto visual
                    boton.style.cursor = "default";
                } 
            }

            function validar_username () {
                   const formData = new FormData(form);
                if (formData.get("username").length >= 3 & formData.get("username").length <= 8 || formData.get("username").length===0) {
                    boton.disabled = false;
                    boton.textContent = "Enviar";
                    boton.style.opacity = "1";   // efecto visual
                    boton.style.cursor = "default";
                    mensajeError3.style.display = "none";
                } else {
                // Menos de 5 caracteres antes del dominio
                    mensajeError3.textContent = "El nombre de usuario debe contener como mucho 8 caracteres y 5 como mínimo";
                    mensajeError3.style.display = "block";
                    boton.disabled = true; // 🔒 bloqueado para siempre
                    boton.textContent = "Enviar";
                    boton.style.opacity = "0.4";   // efecto visual
                    boton.style.cursor = "not-allowed";
                }
            }

            function vista_previa_perfil () {
                const file = inputFoto.files[0];
                if (file) {
                    // Si ya hay un <img> anterior, eliminarlo
                    if (document.getElementById("divUsuario")) {
                        document.getElementById("divUsuario").remove()};
                    
                    const div = document.createElement("div");
                    const img = document.createElement("img");
                    img.style.marginRight = "1rem";
                    div.id = "divUsuario";
                    div.style.color = "black";
                    div.style.fontSize = "0.8rem";
                    div.style.margin = "auto";
                    div.style.width = "19rem";
                    div.style.padding = "0.5rem"; // Espaciado interno
                    div.style.border = "0.1rem solid rgba(202, 200, 200, 0.1)";
                    div.style.borderRadius = "8px";
                    div.style.backgroundColor = "#ffffffff";
                    div.style.marginTop = "5rem";
                    div.style.display = "flex";
                    div.style.alignItems = "center"; // Centrar contenido verticalmente
                    div.style.justifyContent = "flex-start"; // Alineación de contenido en el eje horizontal
                    div.style.margin = "1rem auto 0 auto";
                    mensaje_vista_previa_usuario.style.color = "white";
                    mensaje_vista_previa_usuario.textContent = "Tu usuario se verá así:"
                   
                    img.style.borderRadius = "50%";
                    img.style.width = "3rem";
                    img.style.height = "3rem";
                    img.style.objectFit = "cover";
                    img.style.flexShrink="0"
                    img.src = URL.createObjectURL(file);

                    // Asegurarse de que los datos de 'persona' sean válidos
                    if (form) {
                        const formData = new FormData(form);
                        div.innerHTML = `${formData.get("username")} <span style="color:black; font-size:0.7rem; margin-left:1rem">
                                        Ultima conexion: Nunca </span>`;
                    }
                
                    const nombreArchivo = file.name.toLowerCase();
    
                    if (nombreArchivo.endsWith(".png")) {
                        boton.disabled = false;
                        boton.textContent = "Enviar";
                        boton.style.opacity = "1";   // efecto visual
                        boton.style.cursor = "default";
                        mensajeError4.style.display = "none";
                        div.prepend(img);  // Prepend img to the div
                        inputFoto.insertAdjacentElement("afterend", div);
                        inputFoto.insertAdjacentElement("afterend", mensaje_vista_previa_usuario);

                    }
                     else {
                        mensajeError4.textContent = "La extensión del archivo debe ser png";
                        mensajeError4.style.display = "block";
                        boton.disabled = true; // 🔒 bloqueado para siempre
                        boton.textContent = "Enviar";
                        boton.style.opacity = "0.4";   // efecto visual
                        boton.style.cursor = "not-allowed";
                    }
                }
            }

            inputPassword.addEventListener("input", verificarCoincidencia);
            inputRepite.addEventListener("input", verificarCoincidencia);
            username.addEventListener("input", function() {
                    vista_previa_perfil()
                    validar_username()}
            )
            inputFoto.addEventListener("change", function() {
                    vista_previa_perfil()
                });




            const mensaje_servidor = document.createElement("p");
            form.addEventListener("submit", async function(event) {
                event.preventDefault();
                const boton= form.querySelector("button")
                boton.textContent = "Enviado";
                boton.style.opacity = "0.4";   // efecto visual
                boton.style.cursor = "not-allowed";
                if (mensajeError) {
                    mensajeError.style.display="none"
                }
                if (mensajeError2) {
                    mensajeError2.style.display="none"
                }
                if (mensajeError3) {
                    mensajeError3.style.display="none"
                }
                if (mensajeError4) {
                    mensajeError4.style.display="none"
                }

                const formData = new FormData(form);

                // Mostrar loader y ocultar mensaje anterior
                loader.style.display = "block";
                mensaje_servidor.textContent = "";

                try {
                    const response = await fetch(form.action, {
                        method: form.method,
                        body: formData 
                    });

                    loader.style.display = "none"; // 🔄 Ocultar loader al terminar

                    if (response.ok) {
                        mensaje_servidor.style.color = "green";
                        mensaje_servidor.textContent = "Usuario creado exitosamente ✅";

                        // Limpiar inputs

                    } else {
                        const errorData = await response.json(); // <-- aquí conviertes la respuesta a JSON
                        mensaje_servidor.style.color = "red";
                        mensaje_servidor.textContent = `❌ Error: ${errorData.message || "Ha ocurrido un error en el servidor"}`;
                        const inputs = document.querySelectorAll("input");
                        inputs.forEach(input => input.value = "")
                        setTimeout(() => {
                        boton.disabled = false;
                        boton.textContent = "Enviar";
                        boton.style.opacity = "1";   // efecto visual
                        boton.style.cursor = "default";
                        }, 1000); // 4000 milisegundos = 4 segundos
                    }
                } catch (error) {
                    loader.style.display = "none"; // 🔄 Ocultar loader si falla
                    console.error("Ha ocurrido un error inesperado. Inténtelo más tarde", error);
                    setTimeout(() => {
                        boton.disabled = false;
                        boton.textContent = "Enviar";
                        boton.style.opacity = "1";   // efecto visual
                        boton.style.cursor = "default";
                        boton.disabled = false;
                        mensaje_servidor.style.color = "red";
                        mensaje_servidor.textContent = "⚠️ Ha ocurrido un error inesperado. Inténtelo más tarde";
                        }, 1000); // 4000 milisegundos = 4 segundos
                }

                div_absolute_poppup.append(mensaje_servidor);
            });
        }

    })


    
    // document.querySelector("#passwordforgot").addEventListener("click", function(){
    //     popUp()
    //     let texto=document.createElement("h2")
    //     texto.style.fontFamily = "'Arial', sans-serif"; // Fuente moderna
    //     texto.textContent="Cambia tu contraseña"
    //     texto.style.fontSize="1.5rem"
    //     texto.color="white"
    //     document.querySelector("#div_absolute_poppup").append(texto)
    //     createform({
    //         id: "loginForm",
    //         action: "/submit",
    //         method: "POST",
    //         fields: [
    //             {
    //                 type: "text",
    //                 id: "username",
    //                 placeholder: "Nombre de usuario",
    //                 required: true
    //             },
    //             {
    //                 type: "password",
    //                 id: "password_old",
    //                 placeholder: "Contraseña actual",
    //                 required: true
    //             },

    //             {
    //                 type: "password",
    //                 id: "password",
    //                 placeholder: "Nueva contraseña",
    //                 required: true
    //             },
    //             {
    //                 type: "password",
    //                 id: "repit_password_old",
    //                 placeholder: "Repite tu contraseña nueva",
    //                 required: true
    //             },
    //         ],
    //         submitText: "Cambiar contraseña",
    //         targetContainer: "#div_absolute_poppup" // ID del contenedor donde se añadirá el formulario
    //     });
    //     let texto_plano=document.createElement("p")
    //     texto_plano.textContent="¡Recuerda introducir una contraseña segura!"
    //     texto_plano.style.fontSize="1.2rem"
    //     texto_plano.color="white"
    //     document.querySelector("#div_absolute_poppup").style.paddingBottom="0px"
    //     document.querySelector("#div_absolute_poppup").append(texto_plano)

    //     let texto_plano_2 = document.createElement("p");
    //     texto_plano_2.style.fontSize = "1rem";
    //     texto_plano_2.style.color = "red";
    //     texto_plano_2.style.marginTop = "1rem";
    //     document.querySelector("#div_absolute_poppup").append(texto_plano_2);


    // let passwordInput = document.querySelector("#password");
    // let repeatPasswordInput = document.querySelector("#repit_password_old");
    // repeatPasswordInput.addEventListener("input", function () {
    //     // Verificar si algún campo está vacío
    //     if (passwordInput.value === "" || repeatPasswordInput.value === "") {
    //         texto_plano_2.textContent = ""; // Limpiar el mensaje
    //     } 
    //     // Verificar si las contraseñas no coinciden
    //     else if (passwordInput.value !== repeatPasswordInput.value) {
    //         texto_plano_2.textContent = "Las contraseñas no coinciden. Por favor, revisa.";
    //         texto_plano_2.style.color = "red"; // Cambiar el color del mensaje
    //     } 
    //     // Las contraseñas coinciden
    //     else {
    //         texto_plano_2.textContent = "¡Las contraseñas coinciden!";
    //         texto_plano_2.style.color = "green"; // Cambiar el color del mensaje
    //     }
    // });
    

    // });


    const buttons = document.querySelectorAll('.buttonClass1');

    // Agregar el efecto al pasar el mouse sobre los botones
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.05)'; // Aumenta el tamaño
            button.style.backgroundColor = '#007BFF'; // Cambia el color de fondo
            button.style.color = 'white'; // Cambia el color del texto
        });

        // Restaurar estilo cuando el mouse salga del botón
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1.0)'; // Restaura el tamaño original
            button.style.backgroundColor = ''; // Restaura el color original
            button.style.color = ''; // Restaura el color original del texto
        });
    });



    window.addEventListener('resize', function(){

        let div_back = document.querySelector("#div_absolute_background");
        div_back.style.height= Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) + "px"

    });

})

export {popUp,createform}


