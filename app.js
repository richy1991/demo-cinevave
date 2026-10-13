const fallback = [
        { name: "Dune: Parte Dos", year: "2024", genres: ["Ciencia ficción"], rating: 8.7, image: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", summary: "Paul Atreides se une a Chani y a los Fremen en un viaje épico por Arrakis." },
        { name: "Spider-Man: Across the Spider-Verse", year: "2023", genres: ["Acción"], rating: 8.6, image: "https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", summary: "Miles Morales regresa para una aventura a través del Spider-Verso." },
        { name: "Oppenheimer", year: "2023", genres: ["Drama"], rating: 8.6, image: "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", summary: "La historia del científico que lideró el proyecto Manhattan." },
        { name: "Barbie", year: "2023", genres: ["Comedia"], rating: 7.9, image: "https://image.tmdb.org/t/p/w780/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", summary: "Barbie vive una aventura inesperada fuera de Barbieland." },
        { name: "The Batman", year: "2022", genres: ["Acción"], rating: 7.8, image: "https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg", summary: "Batman descubre una red de corrupción en Gotham City." }
    ];
    const catalog = document.querySelector("#catalog"), status = document.querySelector("#status");
    let titles = fallback, activeGenre = "Todos";
    const clean = text => (text || "Sin descripción disponible.").replace(/<[^>]*>/g, "");
    function render(items) {
        const filtered = activeGenre === "Todos" ? items : items.filter(x => (x.genres || []).includes(activeGenre));
        catalog.innerHTML = filtered.length ? filtered.map((x, i) => `<article class="card" data-index="${i}"><div class="poster"><img src="${x.image || "https://via.placeholder.com/400x600/171922/ffffff?text=Cinewave"}" alt="Póster de ${x.name}" loading="lazy"><span class="rating">★ ${x.rating || "N/A"}</span></div><h3>${x.name}</h3><small>${x.year || "Serie"} · ${(x.genres || ["Serie"]).slice(0, 2).join(" · ")}</small></article>`).join("") : '<div class="empty">No encontramos títulos de este género.</div>';
        document.querySelectorAll(".card").forEach(card => card.addEventListener("click", () => openModal(filtered[card.dataset.index])));
    }
    async function loadShows() {
        try {
        const response = await fetch("https://api.tvmaze.com/shows?page=1");
        if (!response.ok) throw new Error("No se pudo cargar el catálogo");
        const shows = (await response.json()).slice(0, 20).map(show => ({ ...show, year: show.premiered?.slice(0, 4), image: show.image?.original, rating: show.rating?.average, summary: clean(show.summary) }));
        titles = [...fallback, ...shows]; status.textContent = `${titles.length} títulos disponibles`; render(titles);
        } catch (error) { status.textContent = "Mostrando selección offline"; render(titles); }
    }
    function openModal(item) { if (!item) return; document.querySelector("#modal-title").textContent = item.name; document.querySelector("#modal-meta").textContent = `${item.year || "Serie"}  •  ★ ${item.rating || "N/A"}  •  ${(item.genres || []).join(" · ")}`; document.querySelector("#modal-description").textContent = clean(item.summary); document.querySelector("#modal-image").src = item.image || fallback[0].image; document.querySelector("#modal").classList.add("open"); }
    document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => { document.querySelector(".filter.active").classList.remove("active"); button.classList.add("active"); activeGenre = button.dataset.genre; render(titles); }));
    document.querySelector("#search").addEventListener("input", event => { const query = event.target.value.toLowerCase(); render(titles.filter(x => x.name.toLowerCase().includes(query))); });
    document.querySelector("[data-featured]").addEventListener("click", () => openModal(fallback[0]));
    document.querySelector(".close").addEventListener("click", () => document.querySelector("#modal").classList.remove("open"));
    document.querySelector("#modal").addEventListener("click", event => { if (event.target.id === "modal") event.currentTarget.classList.remove("open"); });
    render(titles); loadShows();
