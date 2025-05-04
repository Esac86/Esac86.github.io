document.addEventListener("DOMContentLoaded", async () => {
    const juegosContainer = document.getElementById("juegosContainer");
    const searchInput = document.getElementById("search");
    const modalLinksContainer = document.getElementById("modalLinksContainer");
    const paginationContainer = document.getElementById("paginationContainer");
    const modal = new bootstrap.Modal(document.getElementById("descargasModal"));
    
    const juegosPorPagina = 8;
    let paginaActual = 1;

    const response = await fetch("juegos.json");
    const juegos = await response.json();
    let juegosFiltrados = juegos;

    function renderJuegos(lista, pagina) {
        juegosContainer.innerHTML = "";

        const inicio = (pagina - 1) * juegosPorPagina;
        const fin = inicio + juegosPorPagina;
        const juegosEnPagina = lista.slice(inicio, fin);

        juegosEnPagina.forEach(juego => {
            const card = document.createElement("div");
            card.className = "game-card-container";

            card.innerHTML = `
          <div class="game-card">
            <div class="game-image-container">
              <img src="${juego.portada}" class="game-image" alt="${juego.nombre}">
            </div>
            <div class="game-info">
              <h5 class="game-title">${juego.nombre}</h5>
              <button class="download-btn" onclick='descargarJuego(${JSON.stringify(juego.links)})'>
                <i class="fas fa-download"></i>
              </button>
            </div>
          </div>
        `;

            juegosContainer.appendChild(card);
        });

        renderPaginacion(lista.length);
    }

    function renderPaginacion(totalJuegos) {
        const totalPaginas = Math.ceil(totalJuegos / juegosPorPagina);
        paginationContainer.innerHTML = "";

        if (totalPaginas <= 1) return;

        const prevLi = document.createElement("li");
        prevLi.className = `page-item ${paginaActual === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `
        <a class="page-link" href="#" aria-label="Anterior" ${paginaActual === 1 ? 'tabindex="-1" aria-disabled="true"' : ''}>
          <span aria-hidden="true">&laquo;</span>
        </a>
      `;
        prevLi.addEventListener("click", (e) => {
            e.preventDefault();
            if (paginaActual > 1) {
                paginaActual--;
                renderJuegos(juegosFiltrados, paginaActual);
            }
        });
        paginationContainer.appendChild(prevLi);

        const maxPages = 5;
        let startPage = Math.max(1, paginaActual - Math.floor(maxPages / 2));
        let endPage = Math.min(totalPaginas, startPage + maxPages - 1);

        if (endPage - startPage + 1 < maxPages) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const li = document.createElement("li");
            li.className = `page-item ${i === paginaActual ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener("click", (e) => {
                e.preventDefault();
                paginaActual = i;
                renderJuegos(juegosFiltrados, paginaActual);
            });
            paginationContainer.appendChild(li);
        }

        const nextLi = document.createElement("li");
        nextLi.className = `page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`;
        nextLi.innerHTML = `
        <a class="page-link" href="#" aria-label="Siguiente" ${paginaActual === totalPaginas ? 'tabindex="-1" aria-disabled="true"' : ''}>
          <span aria-hidden="true">&raquo;</span>
        </a>
      `;
        nextLi.addEventListener("click", (e) => {
            e.preventDefault();
            if (paginaActual < totalPaginas) {
                paginaActual++;
                renderJuegos(juegosFiltrados, paginaActual);
            }
        });
        paginationContainer.appendChild(nextLi);
    }

    window.descargarJuego = function (links) {
        if (links.length === 1) {
            window.open(links[0], '_blank');
        } else {
            modalLinksContainer.innerHTML = links.map((link, i) =>
                `<a href="${link}" target="_blank" class="btn btn-primary w-100 download-link">Parte ${i + 1}</a>`
            ).join("");
            modal.show();
        }
    };

    window.filtrarJuegos = function () {
        const texto = searchInput.value.toLowerCase();
        juegosFiltrados = juegos.filter(j => j.nombre.toLowerCase().includes(texto));
        paginaActual = 1;
        renderJuegos(juegosFiltrados, paginaActual);
    };

    document.getElementById("toggleSearch").addEventListener("click", (e) => {
        e.preventDefault();
        const searchContainer = document.getElementById("searchContainer");
        searchContainer.classList.toggle("search-visible");
        if (searchContainer.classList.contains("search-visible")) {
            searchInput.focus();
        }
    });

    renderJuegos(juegos, paginaActual);
});
