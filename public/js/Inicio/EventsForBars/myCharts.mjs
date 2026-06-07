function eventForStats(Chart, get_full_time_at_page) {
    // El siguiente objeto tiene solo minutos como valores
    // const objeto = [
    //     { username: "Manolo", numero_accesos_mes: 15, minutos_conectados: 90 },
    //     { username: "Ana", numero_accesos_mes: 8, minutos_conectados: 130 },
    //     { username: "Luis", numero_accesos_mes: 12, minutos_conectados: 225 },
    //     { username: "Pedro", numero_accesos_mes: 20, minutos_conectados: 260 },
    //     { username: "Marta", numero_accesos_mes: 5, minutos_conectados: 30 },
    //     { username: "Carlos", numero_accesos_mes: 18, minutos_conectados: 190 },
    //     { username: "Laura", numero_accesos_mes: 25, minutos_conectados: 350 },
    //     { username: "Sofia", numero_accesos_mes: 9, minutos_conectados: 125 },
    //     { username: "Raul", numero_accesos_mes: 14, minutos_conectados: 105 },
    //     { username: "David", numero_accesos_mes: 22, minutos_conectados: 270 },
    //     { username: "Isabel", numero_accesos_mes: 11, minutos_conectados: 170 },
    //     { username: "Javier", numero_accesos_mes: 6, minutos_conectados: 75 },
    //     { username: "Carmen", numero_accesos_mes: 17, minutos_conectados: 210 },
    //     { username: "Antonio", numero_accesos_mes: 10, minutos_conectados: 100 },
    //     { username: "Elena", numero_accesos_mes: 19, minutos_conectados: 240 }
    // ];

    document.querySelector("#stats").addEventListener("click", async function () {
        window.scrollTo({
            top: 0,
            behavior: 'auto'
          });
        const response = await get_full_time_at_page(); // Obtenemos la data desde el servidor

        const grid = document.querySelector('.grid');
        grid.innerHTML = "";
        const mainContent = document.querySelector('.main-content');
        mainContent.innerHTML = "";
        mainContent.appendChild(grid);
        grid.style.gridTemplateColumns = "1fr";

        const div = document.createElement("div");
        const canvas = document.createElement("canvas");
        canvas.id = "myChartCanvas"; // Agregar un ID para identificar el canvas
        canvas.style.width = "100%"; // El canvas ocupa el 100% del ancho
        canvas.style.height = "auto"; // La altura se ajusta automáticamente
        div.style.height = "70vh";
        div.style.width = "100%";
        div.style.margin = "auto";
        div.appendChild(canvas);
        grid.appendChild(div); // Añadir el canvas al grid

        // Configurar los datos del gráfico
        const data = {
            labels: response.map(user => user.username), // Etiquetas con los nombres de los usuarios
            datasets: [{
                label: 'Minutos Activos por Usuario',
                data: response.map(user => user.minutos_conectados), // Datos de los minutos activos
                backgroundColor: 'rgba(54, 162, 235, 0.5)', // Fondo de las barras
                borderColor: 'rgba(54, 162, 235, 1)', // Borde de las barras
                borderWidth: 1 // Ancho del borde
            }]
        };

        // Crear el gráfico (tipo barra horizontal)
        const myChart = new Chart(canvas, {
            type: 'bar', // Tipo de gráfico: barra
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y', // Cambia el eje: barras horizontales
                plugins: {
                    legend: {
                        display: true, // Mostrar leyenda
                        labels: {
                            color: 'rgb(0, 0, 0)', // Color del texto de la leyenda
                            font: {
                                size: 10
                            }
                        }
                    },
                    tooltip: {
                        enabled: true // Habilitar tooltip al pasar el cursor
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)', // Color de las líneas de la cuadrícula
                            lineWidth: 1
                        },
                        ticks: {
                            color: 'rgb(0, 0, 0)', // Color de las etiquetas
                            font: {
                                size: 8
                            }
                        },
                        title: {
                            display: true,
                            text: 'Minutos Conectados',
                            color: 'rgb(0, 0, 0)',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false // Ocultar las líneas de la cuadrícula en el eje Y
                        },
                        ticks: {
                            color: 'rgb(0, 0, 0)', // Color de las etiquetas
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });

        console.log(myChart);
    });
}

export { eventForStats };


// function eventForStats(Chart, get_full_time_at_page) {
//     // El siguiente objeto tiene solo minutos como valores
//     const objeto = [
//         { username: "Manolo", numero_accesos_mes: 15, minutos_conectados: 90 },
//         { username: "Ana", numero_accesos_mes: 8, minutos_conectados: 130 },
//         { username: "Luis", numero_accesos_mes: 12, minutos_conectados: 225 },
//         { username: "Pedro", numero_accesos_mes: 20, minutos_conectados: 260 },
//         { username: "Marta", numero_accesos_mes: 5, minutos_conectados: 30 },
//         { username: "Carlos", numero_accesos_mes: 18, minutos_conectados: 190 },
//         { username: "Laura", numero_accesos_mes: 25, minutos_conectados: 350 },
//         { username: "Sofia", numero_accesos_mes: 9, minutos_conectados: 125 },
//         { username: "Raul", numero_accesos_mes: 14, minutos_conectados: 105 },
//         { username: "David", numero_accesos_mes: 22, minutos_conectados: 270 },
//         { username: "Isabel", numero_accesos_mes: 11, minutos_conectados: 170 },
//         { username: "Javier", numero_accesos_mes: 6, minutos_conectados: 75 },
//         { username: "Carmen", numero_accesos_mes: 17, minutos_conectados: 210 },
//         { username: "Antonio", numero_accesos_mes: 10, minutos_conectados: 100 },
//         { username: "Elena", numero_accesos_mes: 19, minutos_conectados: 240 }
//     ];

//     document.querySelector("#stats").addEventListener("click", async function () {
//         const response = await get_full_time_at_page(); // Obtenemos la data desde el servidor

//         const grid = document.querySelector('.grid');
//         grid.innerHTML = "";
//         const mainContent = document.querySelector('.main-content');
//         mainContent.innerHTML = "";
//         mainContent.appendChild(grid);
//         grid.style.gridTemplateColumns = "1fr";

//         const div = document.createElement("div");
//         const canvas = document.createElement("canvas");
//         canvas.id = "myChartCanvas"; // Agregar un ID para identificar el canvas
//         canvas.style.width = "100%"; // El canvas ocupa el 100% del ancho
//         canvas.style.height = "auto"; // La altura se ajusta automáticamente
//         div.style.height = "70vh";
//         div.style.width = "90%";
//         div.style.margin = "auto";
//         div.appendChild(canvas);
//         grid.appendChild(div); // Añadir el canvas al grid

//         // Configurar los datos del gráfico
//         const data = {
//             labels: response.map(user => user.username), // Etiquetas con los nombres de los usuarios
//             datasets: [{
//                 label: 'Minutos Activos por Usuario',
//                 data: response.map(user => user.minutos_conectados), // Datos de los minutos activos
//                 backgroundColor: 'rgba(54, 162, 235, 0.5)', // Fondo de las barras
//                 borderColor: 'rgba(54, 162, 235, 1)', // Borde de las barras
//                 borderWidth: 1 // Ancho del borde
//             }]
//         };

//         // Crear el gráfico (tipo barra)
//         const myChart = new Chart(canvas, {
//             type: 'bar', // Cambiado a diagrama de barras vertical
//             data: data,
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: {
//                         display: true, // Mostrar leyenda
//                         labels: {
//                             color: 'rgb(0, 0, 0)', // Color del texto de la leyenda
//                             font: {
//                                 size: 14
//                             }
//                         }
//                     },
//                     tooltip: {
//                         enabled: true // Habilitar tooltip al pasar el cursor
//                     }
//                 },
//                 scales: {
//                     x: {
//                         grid: {
//                             display: false // Ocultar las líneas de la cuadrícula en el eje X
//                         },
//                         ticks: {
//                             color: 'rgb(0, 0, 0)', // Color de las etiquetas
//                             font: {
//                                 size: 12
//                             }
//                         }
//                     },
//                     y: {
//                         beginAtZero: true,
//                         grid: {
//                             color: 'rgba(0, 0, 0, 0.1)', // Color de las líneas de la cuadrícula
//                             lineWidth: 1
//                         },
//                         ticks: {
//                             color: 'rgb(0, 0, 0)', // Color de las etiquetas
//                             font: {
//                                 size: 12
//                             }
//                         },
//                         title: {
//                             display: true,
//                             text: 'Minutos Conectados',
//                             color: 'rgb(0, 0, 0)',
//                             font: {
//                                 size: 14,
//                                 weight: 'bold'
//                             }
//                         }
//                     }
//                 }
//             }
//         });

//         console.log(myChart);
//     });
// }

// export { eventForStats };





























// function eventForStats (Chart,get_full_time_at_page) {


//     // El siguiente objeto tiene solo minutos como valores
//     const objeto = [
//         { username: "Manolo", numero_accesos_mes: 15, minutos_conectados: 90 },  // 1h 30min = 90min
//         { username: "Ana", numero_accesos_mes: 8, minutos_conectados: 130 },    // 2h 10min = 130min
//         { username: "Luis", numero_accesos_mes: 12, minutos_conectados: 225 },   // 3h 45min = 225min
//         { username: "Pedro", numero_accesos_mes: 20, minutos_conectados: 260 },  // 4h 20min = 260min
//         { username: "Marta", numero_accesos_mes: 5, minutos_conectados: 30 },    // 30min = 30min
//         { username: "Carlos", numero_accesos_mes: 18, minutos_conectados: 190 }, // 3h 10min = 190min
//         { username: "Laura", numero_accesos_mes: 25, minutos_conectados: 350 },  // 5h 50min = 350min
//         { username: "Sofia", numero_accesos_mes: 9, minutos_conectados: 125 },   // 2h 5min = 125min
//         { username: "Raul", numero_accesos_mes: 14, minutos_conectados: 105 },   // 1h 45min = 105min
//         { username: "David", numero_accesos_mes: 22, minutos_conectados: 270 },  // 4h 30min = 270min
//         { username: "Isabel", numero_accesos_mes: 11, minutos_conectados: 170 }, // 2h 50min = 170min
//         { username: "Javier", numero_accesos_mes: 6, minutos_conectados: 75 },   // 1h 15min = 75min
//         { username: "Carmen", numero_accesos_mes: 17, minutos_conectados: 210 }, // 3h 30min = 210min
//         { username: "Antonio", numero_accesos_mes: 10, minutos_conectados: 100 }, // 1h 40min = 100min
//         { username: "Elena", numero_accesos_mes: 19, minutos_conectados: 240 }   // 4h 0min = 240min
//     ];

//     document.querySelector("#stats").addEventListener("click", async function() {

//         const response=await get_full_time_at_page()
//         const grid = document.querySelector('.grid');
//         grid.innerHTML = "";
//         const mainContent = document.querySelector('.main-content');
//         mainContent.innerHTML = "";
//         mainContent.appendChild(grid);
//         grid.style.gridTemplateColumns = "1fr";
        
//         const div = document.createElement("div");
//         const canvas = document.createElement("canvas");
//         canvas.id = "myChartCanvas"; // Agregar un ID para identificar el canvas
//         canvas.style.width = "100%"; // El canvas ocupa el 100% del ancho
//         canvas.style.height = "auto"; // La altura se ajusta automáticamente
//         div.style.height = "70vh";
//         div.style.width = "90%";
//         div.style.margin = "auto";
//         div.appendChild(canvas);
//         grid.appendChild(div); // Añadir el canvas al grid

//         // Configurar los datos del gráfico
//         const data = {
//             labels: response.map(user => user.username), // Etiquetas con los nombres de los usuarios
//             datasets: [{
//                 label: 'Minutos Activos por Usuario',
//                 data: response.map(user => user.minutos_conectados), // Datos de los minutos activos
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color del fondo
//                 borderColor: 'rgba(75, 192, 192, 1)', // Color del borde
//                 borderWidth: 2, // Ancho del borde de cada línea
//                 pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Color de los puntos
//                 pointBorderColor: 'rgba(75, 192, 192, 1)', // Color del borde de los puntos
//                 pointBorderWidth: 3, // Ancho del borde de los puntos
//                 pointRadius: 3, // Tamaño de los puntos
//                 fill: true, // Rellenar el área bajo la línea
//                 tension: 0.4, // Suavizar las líneas
//             }]
//         };

//         // Crear el gráfico (cambiamos a un gráfico de radar)
//         const myChart = new Chart(canvas, {
//             type: 'radar', // Tipo de gráfico: radar
//             data: data,
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 scales: {
//                     r: {
//                         beginAtZero: true,
//                         angleLines: {
//                             display: true, // Mostrar líneas angulares
//                             color: 'rgb(173, 173, 173)', // Color de las líneas angulares
//                             lineWidth: 1 // Ancho de las líneas angulares
//                         },
//                         grid: {
//                             color: 'rgba(1, 18, 18, 0.2)', // Color de la cuadrícula
//                             lineWidth: 2 // Ancho de las líneas de la cuadrícula
//                         },
//                         ticks: {
//                             backdropColor: 'rgba(0, 0, 0, 0)', // Fondo detrás de los ticks
//                             color: 'rgb(0, 0, 0)', // Color de los números
//                             font: {
//                                 size: 14
//                             }
//                         }
//                     }
//                 },
//                 elements: {
//                     line: {
//                         tension: 0.4 // Suaviza las líneas
//                     }
//                 }
//             }
//         });

//         console.log(myChart);
//     });
// }

// export { eventForStats };
