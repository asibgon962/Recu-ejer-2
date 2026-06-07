import { eventforInicio } from "./EventsForBars/myInicio.mjs";
import { eventForCalendar } from "./EventsForBars/myCalendar.mjs";
import { eventForUser } from "./EventsForBars/myUsers.mjs";
import { eventForStats } from "./EventsForBars/myCharts.mjs";
import { eventforTopBar } from "./EventsForBars/myTopBar.mjs";
import { eventForAdmin } from "./EventsForBars/myAdmin.mjs";
import {getCookie, get_all_photo,last_conexion,get_all_messages,upload_message,set_full_time_at_page,
  get_full_time_at_page,get_all_activities,upload_activity,get_all_activities_user,
  deleteActivityAndFile,downloadFile, upload_answer} from "./Fetchs/fetchs.mjs"
import Chart from 'chart.js/auto'


document.addEventListener("DOMContentLoaded", async function(){

  
  let open_bar = true; // Estado de visibilidad del sidebar


  //-------------------Media Query en JS, mo la ejecutamos todavía-----------------------//
  function initSidebarResponsive() {
    const sidebar = document.getElementById('sidebar');
    const central_content = document.querySelector('.central_content');
    const mediaQuery = window.matchMedia('(max-width: 950px)');
    let mainContent = document.querySelector('.main-content');

    const handleSidebarMode = (e) => {
        if (e.matches && open_bar==false) {
            // Pantalla menor de 950px
            sidebar.classList.add('horizontal');
            central_content.classList.add('vertical')
            mainContent.classList.add('expanded'); 
        } else if (!e.matches && open_bar==false) {
            // Pantalla mayor o igual a 950px
            sidebar.classList.remove('horizontal');
            central_content.classList.remove('vertical')
            mainContent.classList.add('expanded'); 
        }
        else if (e.matches && open_bar==true) {
          // Pantalla mayor o igual a 950px
          sidebar.classList.add('horizontal');
          central_content.classList.add('vertical')
          mainContent.classList.add('expanded'); 
          mainContent.classList.add('margin_top')
      }
      else if (!e.matches && open_bar==true) {
        // Pantalla mayor o igual a 950px
        sidebar.classList.remove('horizontal');
        central_content.classList.remove('vertical')
        mainContent.classList.remove('expanded'); 
        mainContent.classList.remove('margin_top')
    }

    };

    // Ejecuta la función al cargar la página
    handleSidebarMode(mediaQuery);

    // Escucha los cambios de la media query
    mediaQuery.addEventListener('change', handleSidebarMode);
  }

  //--------------Aqui meto los addeventListeners de cada elemento del sideBar-------------
  function my_listeners_sidebar(){
      eventforInicio(upload_message, upload_answer, objeto_foto, get_all_messages, 
        obj_actividades,username,upload_activity,get_all_activities_user,
        deleteActivityAndFile,downloadFile)
      eventForCalendar(obj_actividades)
      eventForUser(objeto_foto)
      eventForStats(Chart,get_full_time_at_page)
      eventForAdmin()

    }


  //La ejectamos aqui la mediaquery
  initSidebarResponsive();
  const username=getCookie("username")


  //-------------------Barra lateral ajustar según media-Query-----------------------// 
  function toggleSidebar() {
    const mediaQuery = window.matchMedia('(max-width: 950px)')

    if (!mediaQuery.matches && open_bar === true) {
      let sidebar = document.getElementById('sidebar');
      let mainContent = document.querySelector('.main-content');
      sidebar.classList.add('hidden_left');
      mainContent.classList.add('expanded'); // Expande el contenido principal
      open_bar=false // Agrega la clase para ocultar el sidebar
    } else if (!mediaQuery.matches && open_bar==false) {
      let sidebar = document.getElementById('sidebar');
      let mainContent = document.querySelector('.main-content');
      sidebar.classList.remove('hidden_left');
      sidebar.classList.remove('hidden_up');
      mainContent.classList.remove('expanded');
      open_bar=true// Remueve la clase para hacerlo visible
    }
    //lo voy a cerrar,t engo que dejar expended y quitar horizontal
    else if (mediaQuery.matches && open_bar==true) {
      let sidebar = document.getElementById('sidebar');
      let mainContent = document.querySelector('.main-content');
      sidebar.classList.add('hidden_up');
      mainContent.classList.add('expanded'); // Expande el contenido principal
      mainContent.classList.remove('margin_top')
      open_bar=false // Agrega la clase para ocultar el sidebar
    }
    //lo voy a abrir, tengo que dejar expanded y tengo que dejar horixontal
    else {
      let sidebar = document.getElementById('sidebar');
      let mainContent = document.querySelector('.main-content');
      sidebar.classList.remove('hidden_left');
      sidebar.classList.remove('hidden_up');
      mainContent.classList.add('expanded');
      mainContent.classList.add('margin_top')
      open_bar=true// Remueve la clase para hacerlo visible

    }
    }


  //-------------------HACEMOS TODOS LO FETCH INCIALES-------------------------
  //En estar parte del codigo hacemos tres awaits. Para ahorrar tiempo podriamos hacer
  //un promise.all(). A partir de ahora el codigo se divide en un try/catch
  const loader = document.createElement("div");
  loader.className = "loader-container";
  const spinner = document.createElement("div");
  spinner.className = "loader";
  loader.appendChild(spinner);
  const grid=document.querySelector(".grid")
  grid.innerHTML=""
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "1fr"; // Una columna
  grid.style.justifyItems = "center";     // Centra elementos horizontalmente
  grid.style.rowGap = "1rem";             // Espacio entre filas
  grid.append(loader)


  let objeto_foto
  let obj_actividades
  let var_control=false


  try {
    await last_conexion();

    objeto_foto = await get_all_photo();
    if (objeto_foto) console.log(objeto_foto);

    await new Promise((resolve) => {
      setTimeout(() => {
         resolve();
      }, 1000)
    })
    obj_actividades = await get_all_activities();
    

    if (obj_actividades) console.log(obj_actividades);

    // Esperar 2 segundos antes de quitar el loader
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!obj_actividades || !objeto_foto) {
          // Quitar loader
          loader.style.display = "none";
          document.body.removeAttribute("style");


          // Limpiar todo el body
          document.body.innerHTML = "";

          // Contenedor principal
          const errorContainer = document.createElement("div");
          errorContainer.style.display = "flex";
          errorContainer.style.justifyContent = "center";
          errorContainer.style.alignItems = "center";
          errorContainer.style.height = "100vh"; // pantalla completa
          errorContainer.style.width = "100vw"; // pantalla completa
          errorContainer.style.background = "linear-gradient(250deg, #f8f8f8, #e6e6e6)";
          errorContainer.style.padding="0.5rem"
          

          // Texto de error
          const errorText = document.createElement("div");
          errorText.textContent = "❌ Error al cargar la página. Pruebe de nuevo o intételo más tarde";
          errorText.style.fontSize = "3rem";
          errorText.style.fontFamily = "Roboto, Arial, sans-serif";
          errorText.style.fontWeight = "bold";
          errorText.style.color = "#c0392b"; // rojo elegante
          errorText.style.textShadow = "0px 4px 15px rgba(0,0,0,0.3)";
          errorText.style.opacity = "0";
          errorText.style.transform = "scale(0.2)";
          errorText.style.transition = "all 0.6s ease";


          errorContainer.appendChild(errorText);
          document.body.appendChild(errorContainer);

          // Animación de aparición
          setTimeout(() => {
            errorText.style.opacity = "1";
            errorText.style.transform = "scale(1)";
            reject(new Error("No se encontraron actividades"));
          }, 100);
        } else {
          resolve();
        }
      }, 1000);
    });


    //------------Añadimos otros eventos que no dependen del SideBar---------------------
    set_full_time_at_page();
    eventforTopBar(username,objeto_foto) //Evento para actividaes y tablon
    my_listeners_sidebar() //lo ejecuto para añadir todos los addeventlistener al código


    //----Añadir el evento de click para mostrar u ocultar la barra lateral---------
    document.getElementById('toggle-sidebar-top').addEventListener('click', toggleSidebar)
    

    //bloqueamos los botones cuando pulso 1
    const botones = [
    document.getElementById("inicio"),
    document.getElementById("usuarios"),
    document.getElementById("months"),
    document.getElementById("stats")
  ];
  //   const botones2 = [
  //   document.querySelector(".nav-bar")
  // ];

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
    botones.forEach(boton => {
      boton.addEventListener("click", function() {bloquearBotones(botones)});
    });
    // botones2.forEach(boton => {
    //   boton.addEventListener("click", function() {bloquearBotones(botones2)});
    // });
    //--------Hacmos click en incio por defecto----------------
    botones[0].click()


  } 

  catch {
    if (!var_control) {
      if (!obj_actividades || !objeto_foto) {
          loader.style.display = "none";
          document.body.removeAttribute("style");


          // Limpiar todo el body
          document.body.innerHTML = "";

          // Contenedor principal
          const errorContainer = document.createElement("div");
          errorContainer.style.display = "flex";
          errorContainer.style.justifyContent = "center";
          errorContainer.style.alignItems = "center";
          errorContainer.style.height = "100vh"; // pantalla completa
          errorContainer.style.width = "100vw"; // pantalla completa
          errorContainer.style.background = "linear-gradient(250deg, #f8f8f8, #e6e6e6)";
          errorContainer.style.padding="0.5rem"
          

          // Texto de error
          const errorText = document.createElement("div");
          errorText.textContent = "❌ Error al cargar la página. Pruebe de nuevo o intételo más tarde";
          errorText.style.fontSize = "3rem";
          errorText.style.fontFamily = "Roboto, Arial, sans-serif";
          errorText.style.fontWeight = "bold";
          errorText.style.color = "#c0392b"; // rojo elegante
          errorText.style.textShadow = "0px 4px 15px rgba(0,0,0,0.3)";
          errorText.style.opacity = "0";
          errorText.style.transform = "scale(0.2)";
          errorText.style.transition = "all 0.6s ease";


          errorContainer.appendChild(errorText);
          document.body.appendChild(errorContainer);

          // Animación de aparición
          setTimeout(() => {
            errorText.style.opacity = "1";
            errorText.style.transform = "scale(1)";
          }, 100);
      
        }
    }
  }

  



});



//Despliegue de usuarios
//Desliegue de usuarios


