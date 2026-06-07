import { popUp, createform } from "../../portada/script_portada.mjs";




function eventforTopBar(username,photosArray) {
    const img_top_bar=document.querySelector(".topbar-photo")
    const fotousername = photosArray.find(f => f.username === username);
    if (fotousername) {
    img_top_bar.src = fotousername.foto;
    } else {
    img_top_bar.src="./img/anonimo.jpg"; 
    }
    img_top_bar.style.objectFit="cover"
    img_top_bar.style.objectFit="cover"
    const topbar_username=document.querySelector(".topbar-username")
    topbar_username.textContent=username



    const topbarPhoto=document.querySelector(".topbar-photo")
    topbarPhoto.style.cursor="pointer"

    let overlay = null;




    //------Añadimos a la foto la animación----------------
    topbarPhoto.addEventListener("click", () => {
    if (overlay) {
        // Si ya existe el div llamado overlay, eliminarlo y restablecer la variable
        overlay.remove();
        overlay = null;
        return;
    }

    // Crear el fondo semitransparente
    overlay = document.createElement("div");
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

    // Crear la imagen
    const img_doc = document.createElement("img");
    img_doc.style.width = "30vw";
    img_doc.style.borderRadius = "8px"; // Bordes redondeados, opcional
    img_doc.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)"; // Sombra para mejor estética
    img_doc.style.opacity = "0"; // Inicia transparente
    img_doc.style.transform = "translate(150%, -80%) scale(0.01)"; // Inicia desde fuera de la pantalla

    // Establecer la fuente de la imagen
    if (fotousername) {
        img_doc.src = fotousername.foto; // Foto encontrada
    } else {
        img_doc.src = "./img/anonimo.jpg"; // Imagen predeterminada
    }

    // Añadir la imagen al fondo
    overlay.appendChild(img_doc);

    // Añadir el fondo al body
    document.body.appendChild(overlay);

    // Añadir animación a la imagen después de un pequeño retraso, el retraso es importantisimo!!!!!!
    setTimeout(() => {
        img_doc.style.transition = "transform 1s ease-out, opacity 0.5s ease-out";
        img_doc.style.transform = "translate(0, 0) scale(1)"; 
        img_doc.style.opacity = "1";
    }, 50);

    // Cerrar al hacer clic fuera de la imagen
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) { // Solo cerrar si se hace clic fuera de la imagen
        // Animación de salida
        img_doc.style.transition = "transform 0.5s ease-in, opacity 0.5s ease-in";
        img_doc.style.transform = "translate(100%, -100%) scale(0.01)"; // Volver a la esquina superior izquierda
        img_doc.style.opacity = "0"; // Hacer invisible

        // Eliminar el overlay después de la animación de salida
        setTimeout(() => {
            overlay.remove();
            overlay = null; // Restablecer la variable al eliminar
        }, 500); // Duración de la animación
        }
    });
    });

    const usernameSpan = document.querySelector(".topbar-username");
    usernameSpan.style.cursor="pointer"
    const dropdownMenu = document.querySelector("#dropdown-menu");
    const changePassword = document.querySelector("#change-password");
    const changeEmail = document.querySelector("#change-email");
    const logout = document.querySelector("#logout");

    usernameSpan.addEventListener("click", (e) => {
        e.stopPropagation(); // Evita que suba al div padre (.topbar-right)(); // para que no se dispare el evento del div padre
        dropdownMenu.classList.toggle("open"); //Si #dropdown-menu NO tiene la clase .open → se la añade → el menú se abre.
        //Si #dropdown-menu YA tiene la clase .open → se la quita → el menú se cierra.
    });

    // Opcional: cerrar si clicas fuera
    document.addEventListener("click", (e) => {
        if (!dropdownMenu.contains(e.target) && !usernameSpan.contains(e.target)) {
        dropdownMenu.classList.remove("open");
        }
    });


    logout.addEventListener("click", async () => {
        await fetch("/inicio/logout", {
            method: "POST",
            credentials: "include" // importante para que envíe la cookie
        });
        window.location.href = "/";
        });

    changeEmail.addEventListener("click", function(e){
        e.stopPropagation()
        popUp("rgba(255, 255, 255, 1)")
        let texto_plano=document.createElement("h2")
        texto_plano.style.fontFamily = "'Arial', sans-serif"; // Fuente moderna
        texto_plano.textContent="Cambiar Email"
        texto_plano.style.fontSize="1.5rem"
        texto_plano.color="black"
        document.querySelector("#div_absolute_poppup").append(texto_plano)
        createform({
            id: "loginForm_singup",
            action: "/inicio/change_email",
            method: "POST",
            enctype: "application/x-www-form-urlencoded",
            fields: [
                {
                    type: "text",
                    id: "email",
                    name: "email",
                    placeholder: "Email actual",
                    required: true
                },
                {
                    type: "text",
                    id: "repit_email",
                    name: "repit_email",
                    placeholder: "Email nuevo",
                    required: true
                },
                {
                    type: "text",
                    id: "repit_email",
                    name: "repit_email",
                    placeholder: "Repite el Email nuevo",
                    required: true
                }
            ],
            submitText: "Cambiar Email",
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
                        body: data,
                        credentials:"include"
                    });

                    loader.remove(); // Quitar spinner

                    if (response.ok) {
                        mensaje_servidor.style.display="block"
                        mensaje_servidor.style.color = "green";
                        mensaje_servidor.textContent = "¡Inicio de sesión exitoso!";
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        if(formData.get("username")=="admin") {
                            window.location.href = "/public_for_admin/inicio.html";
                        }
                        else {
                            window.location.href = "/inicio.html";
                        }
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

    changePassword.addEventListener("click", function(e){
        e.stopPropagation()
        popUp("rgba(255, 255, 255, 1)")
        let texto_plano=document.createElement("h2")
        texto_plano.style.fontFamily = "'Arial', sans-serif"; // Fuente moderna
        texto_plano.textContent="Cambiar Contraseña"
        texto_plano.style.fontSize="1.5rem"
        texto_plano.color="black"
        document.querySelector("#div_absolute_poppup").append(texto_plano)
        createform({
            id: "loginForm_singup",
            action: "/inicio/change_password",
            method: "POST",
            enctype: "application/x-www-form-urlencoded",
            fields: [
                {
                    type: "password",
                    id: "password",
                    name: "password",
                    placeholder: "Contraseña",
                    required: true
                },
                {
                    type: "password",
                    id: "new_password",
                    name: "new_password",
                    placeholder: "Contraseña Nueva",
                    required: true
                },

                {
                    type: "password",
                    id: "repit_password",
                    name: "repit_password",
                    placeholder: "Repite la Contraseña Nueva",
                    required: true
                }
            ],
            submitText: "Cambiar Contraseña",
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
                        body: data,
                        credentials:"include"
                    });

                    loader.remove(); // Quitar spinner

                    if (response.ok) {
                        mensaje_servidor.style.display="block"
                        mensaje_servidor.style.color = "green";
                        mensaje_servidor.textContent = "¡Inicio de sesión exitoso!";
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        if(formData.get("username")=="admin") {
                            window.location.href = "/public_for_admin/inicio.html";
                        }
                        else {
                            window.location.href = "/inicio.html";
                        }
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


    
}

export {eventforTopBar}