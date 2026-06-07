//1)-------------Interfaz para la pagina de inicio (Tablón y Actividades)------------------------------

import { eventforTablon } from "./EventsForInicio/myTablon.mjs";
import { eventforActivities } from "./EventsForInicio/myActividades.mjs";


function EventsforInicio (upload_message, upload_answer, objeto_foto,get_all_messages,obj_actividades,nombre_usuario,upload_activity,get_all_activities_user,delete_activity_and_File,downloadFile) {
  eventforTablon(upload_message,objeto_foto,get_all_messages,nombre_usuario,upload_answer)
  eventforActivities(obj_actividades,upload_activity,get_all_activities_user,delete_activity_and_File,downloadFile, nombre_usuario)
}




function eventforInicio (upload_message,objeto_foto,get_all_messages,obj_actividades,nombre_usuario,upload_activity,get_all_activities_user,delete_activity_and_File,downloadFile) {
  const inicio=document.querySelector("#inicio")
  inicio.addEventListener("click",async function () {
      window.scrollTo({
        top: 0,
        behavior: 'auto'
    });
    const grid = document.querySelector('.grid');
    grid.innerHTML=""
    const mainContent = document.querySelector('.main-content');
    grid.classList.add("grid")
    mainContent.innerHTML = "";
    mainContent.appendChild(grid);

    //1.1)---NavBar, Botones: aunucio y tablón dentro del grid
    const navBar = document.createElement('div');
    navBar.style.textAlign="down"
    navBar.classList.add('nav-bar'); // Añade una clase al contenedor para estilos
    navBar.style.display="flex"
    navBar.style.borderBottom="solid 1px rgb(214, 214, 214)"
    
    const tablondiv = document.createElement('div');
    tablondiv.textContent = 'Tablón';
    tablondiv.id="TablonDiv"
    tablondiv.classList.add("main-content-options")
    tablondiv.style.marginRight="2rem"
    tablondiv.style.marginLeft="1rem"
    tablondiv.style.padding="1rem"
    tablondiv.style.cursor="pointer"

    const tablondiv2 = document.createElement('div');
    tablondiv2.textContent = 'Actividades';
    tablondiv2.id="ActivitiesDiv"
    tablondiv2.classList.add("main-content-options")
    tablondiv2.style.padding="1rem"
    tablondiv2.style.cursor="pointer"

    navBar.appendChild(tablondiv);
    navBar.appendChild(tablondiv2);
    

    const gridDiv = document.querySelector('.grid');
    mainContent.insertBefore(navBar, gridDiv);
    EventsforInicio (upload_message,objeto_foto,get_all_messages,obj_actividades,nombre_usuario,upload_activity,get_all_activities_user,delete_activity_and_File,downloadFile)
    tablondiv.click()
    const listItems_main = document.querySelectorAll('.main-content-options');


    //1.2)---Intereación para que los botones tablón y anuncios se queden señalados
    listItems_main.forEach(item => {
    item.addEventListener('click', function () {
        // Restablecer estilos de todos los elementos
        listItems_main.forEach(item2 => {
            item2.style.borderBottom = "none";
            item2.style.backgroundColor = "transparent";
        });

        // Aplicar estilo activo al elemento pulsado
        this.style.borderBottom = "0.3rem solid rgb(0, 136, 255)";
        this.style.backgroundColor = "rgb(224, 238, 249)";
    });
    })


    const botones2 = [
    document.querySelector(".nav-bar")
  ];

    // Función para bloquear todos los botones por 2.5s
    let timeoutId
    function bloquearBotones(lista) {
      lista.forEach(boton => {
        // Crear overlay
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        
        // Posicionar el overlay sobre el botón
        const rect = boton.getBoundingClientRect();
        overlay.style.position = "absolute";
        overlay.style.top = rect.top + "px";
        overlay.style.left = rect.left + "px";
        overlay.style.width = rect.width + "px";
        overlay.style.height = rect.height + "px";
        overlay.style.cursor = "not-allowed";
        overlay.style.background = "rgba(0,0,0,0)"; // transparente
        overlay.style.zIndex = 1000;
        overlay.style.pointerEvents = "all";

        // Guardamos el overlay en el botón para poder eliminarlo después
        boton._overlay = overlay;

        document.body.appendChild(overlay);

        // Reducir opacidad del botón
        boton.style.opacity = 0.4;
      });

      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        lista.forEach(boton => {
          // Restaurar opacidad
          boton.style.opacity = 1;
          
          // Eliminar overlay
          if (boton._overlay) {
            boton._overlay.remove();
            delete boton._overlay;
          }
        });
      }, 1500);
    }
    // Asignamos el evento
    botones2.forEach(boton => {
      boton.addEventListener("click", function() {bloquearBotones(botones2)});
    });





    //1.3)---Crea los div de mensajes sobre el grid
   

  })
}

export {eventforInicio}

