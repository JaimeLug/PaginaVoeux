// Script for proyectos (portfolio grid) view
// Loads portada.jpg covers for image-based projects and video thumbnails for video-based cards
window.addEventListener('section-loaded', (e) => {
    if (e.detail.section !== 'proyectos') return;

    // ── Inject header title ──────────────────────────────────────────────────
    const dynamicHeader = document.getElementById('dynamic-header-center');
    if (dynamicHeader) {
        dynamicHeader.innerHTML = `
            <div class="proyectos-header-injected">
                <p class="proyectos-subtitle-injected">NUESTRO TRABAJO</p>
                <h1 class="proyectos-title-injected">PORTAFOLIO</h1>
            </div>
        `;
    }

    // ── Generate Portfolio Grid Dynamically ──────────────────────────────────
    const portfolioContainer = document.getElementById('portfolio');
    if (portfolioContainer && typeof PROJECTS_DATA !== 'undefined') {
        portfolioContainer.innerHTML = '';

        Object.values(PROJECTS_DATA).forEach(project => {
            // Apply span class if gridSpan is 2
            const spanClass = project.gridSpan === 2 ? 'span-2-cols' : '';
            // Some entries use different background SVG colors in the original HTML, but a standard dark grey works well
            const cardHTML = `
    <div class="project-card ${spanClass}" data-media-slug="${project.mediaSlug || project.id}" onclick="window.location.hash='#proyecto?id=${project.id}'" aria-label="Ver proyecto ${project.title} de ${project.brand}" role="button" tabindex="0">
        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9' fill='%23111'%3E%3C/svg%3E" alt="${project.title}" class="project-img">
        <div class="project-overlay">
            <span class="brand-name">${project.brand}</span>
            <h3 class="project-name">${project.title}</h3>
        </div>
    </div>`;
            portfolioContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // ── Load thumbnail covers for each card ───────────────────────────────────
    const cards = document.querySelectorAll('.project-card[data-media-slug]');
    cards.forEach(card => {
        const slug = card.dataset.mediaSlug;
        const img = card.querySelector('.project-img');
        if (!img || !slug) return;

        // Si es una tarjeta de 2 columnas, cargar directamente la imagen de alta calidad
        if (card.classList.contains('span-2-cols')) {
            img.src = `imagenes/${slug}/portada.jpg`;
            img.onerror = () => {
                img.src = `imagenes/${slug}/portada.png`;
                img.onerror = null;
            };
        } else {
            // Try thumbnail first (fast) para tarjetas normales, fallback a full portada
            img.src = `imagenes/${slug}/thumbs/portada.jpg`;
            img.onerror = () => {
                img.src = `imagenes/${slug}/portada.jpg`;
                img.onerror = () => {
                    img.src = `imagenes/${slug}/portada.png`;
                    img.onerror = null;
                };
            };
        }
    });
});
