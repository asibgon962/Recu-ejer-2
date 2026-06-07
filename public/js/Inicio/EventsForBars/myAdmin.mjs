async function eventForAdmin() {
  const adminLi = document.getElementById('admin');
  function fakeDelay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  adminLi.addEventListener('click', function () {
    if (!document.getElementById("admin-dynamic-styles")) {
      const style = document.createElement("style");
      style.id = "admin-dynamic-styles";
      style.textContent = `
        .admin-search {
            display: flex;
            gap: 0.6rem;
            background: #fff;
            padding: 0.8rem;
            justify-content: center;
        }

        .admin-search input {
            width: 80%;
            padding: 0.6rem 0.8rem;
            border-radius: 0.4rem;
            border: 1px solid #d1d5db;
        }

        .admin-search input:focus {
            border-color: #6366f1;
            border-radius: 1rem;
        }

        .admin-search button {
            padding: 0.6rem 1rem;
            border-radius: 0.4rem;
            cursor: pointer;
            border: 1px solid #6366f1;
            background: #6366f1;
            color: #fff;
        }

        .cards-container {
            margin-top: 1rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1rem;
        }

        .activity-card {
            background: #fff;
            border-radius: 0.6rem;
            padding: 1rem;
            border: 1px solid #e5e7eb;
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
        }

        .activity-card h3 {
            margin: 0;
            font-weight: 600;
        }

        .activity-card .tema {
            font-size: 0.85rem;
            color: #6b7280;
        }

        .activity-card p {
            margin: 0;
            font-size: 0.8rem;
            color: #374151;
        }

        .activity-card label {
            margin-top: 0.4rem;
            font-size: 0.75rem;
            color: #374151;
        }

        .activity-card input[type="number"] {
            width:10%;
            min-width:3rem;
            padding: 0.4rem;
            border-radius: 0.4rem;
            border: 1px solid #d1d5db;
            font-size: 0.85rem;
        }

        .activity-card input[type="number"]:focus {
            border-color: #6366f1;
            border: 2px solid #d1d5db;
            outline: none;
        }

        .btn_calificar,
        .btn_editar {
            margin-top: 0.5rem;
            background-color: rgba(127, 193, 255, 1);
            color: white;
            cursor: pointer;
            border-radius: 0.5rem;
            padding: 0.5rem;
            transition: transform 0.2s ease;
        }

        .btn_calificar:hover,
        .btn_editar:hover {
            background-color:rgb(248, 250, 255);
            color: rgba(0, 0, 0, 1);
            transform: scale(1.08);
        }
      `;
      document.head.appendChild(style);
    }

    window.scrollTo({ top: 0, behavior: 'auto' });

    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = "";

    const grid = document.createElement("div");
    grid.classList.add("grid");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "1fr";
    mainContent.appendChild(grid);

    const searchContainer = document.createElement("div");
    searchContainer.classList.add("admin-search");
    searchContainer.innerHTML = `
      <input type="text" placeholder="Buscar usuario (username)">
      <button>Buscar</button>
    `;
    grid.appendChild(searchContainer);

    const cardsContainer = document.createElement("div");
    cardsContainer.classList.add("cards-container");
    grid.appendChild(cardsContainer);

    const input = searchContainer.querySelector("input");
    const button = searchContainer.querySelector("button");

    input.addEventListener("keydown", function (e) {
      if (e.key == "Enter") {
        button.click();
      }
    });

    button.addEventListener("click", async () => {
      const username = input.value.trim();
      if (!username) return;

      cardsContainer.textContent = "Cargando...";
      await fakeDelay(300);

      try {
        const res = await fetch(`/inicio/get_all_activities_send/${username}`, {
          credentials: "include"
        });

        if (res.status === 401) {
          const html = await res.text();
          document.documentElement.innerHTML = html;
          return;
        }

        if (!res.ok) {
          throw new Error(`Error HTTP ${res.status}`);
        }

        const entregas = await res.json();

        cardsContainer.innerHTML = "";

        if (!Array.isArray(entregas) || entregas.length === 0) {
          cardsContainer.textContent = "No hay entregas para este usuario";
          return;
        }

        entregas.forEach(entrega => {
          const card = document.createElement("div");
          card.classList.add("activity-card");

          const notaExiste =
            entrega.Nota_actividad !== null &&
            entrega.Nota_actividad !== undefined;

          card.innerHTML = `
            <h3>${entrega.Actividad}</h3>
            <p class="tema">Tema: ${entrega.Tema}</p>
            <p><strong>Archivo:</strong> ${entrega.Nombre_archivo}</p>
            <p><strong>Fecha:</strong> ${entrega.Fecha_entrega}</p>

            <div class="nota-section">
              <label>Nota</label>
              ${
                notaExiste
                  ? `<input type="number"
                      min="0"
                      max="10"
                      value="${entrega.Nota_actividad}"
                      class="input_nota"
                      disabled>
                      <br>
                      <button class="btn_editar">Editar calificación</button>`
                  : `<input type="number"
                      min="0"
                      max="10"
                      class="input_nota"
                      placeholder="Sin calificar">
                      <br>
                      <button class="btn_calificar" >Guardar calificación</button>`
              }
            </div>
          `;

          cardsContainer.appendChild(card);

          const button = card.querySelector("button");
          const input_nota = card.querySelector(".input_nota");

          button.addEventListener("click", async () => {
            if (button.classList.contains("btn_editar")) {
              input_nota.disabled = false;
              input_nota.focus();
              button.textContent = "Guardar calificación";
              button.classList.remove("btn_editar");
              button.classList.add("btn_calificar");
              return;
            }
            const nota = input_nota.value;
            try {
              const res = await fetch(
                `/inicio/edit_activity_mark/${entrega.Tema}/${entrega.Actividad}/${username}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ nota })
                }
              );

              if (!res.ok) throw new Error(res.status);

              input_nota.disabled = true;
              button.textContent = "Editar calificación";
              button.classList.add("btn_editar");
              button.classList.remove("btn_calificar");

            } catch (err) {
              alert("No se pudo guardar la nota");
            }
          });
        });

      } catch (err) {
        console.error("FETCH ERROR:", err);
        cardsContainer.textContent = "Error cargando entregas";
      }
    });
  });
}

export { eventForAdmin };
