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

    // ── Load thumbnail covers for each card ───────────────────────────────────
    const cards = document.querySelectorAll('.project-card[data-media-slug]');
    cards.forEach(card => {
        const slug = card.dataset.mediaSlug;
        const img = card.querySelector('.project-img');
        if (!img || !slug) return;

        // Try thumbnail first (fast), fallback to full portada
        img.src = `imagenes/${slug}/thumbs/portada.jpg`;
        img.onerror = () => {
            img.src = `imagenes/${slug}/portada.jpg`;
            img.onerror = () => {
                img.src = `imagenes/${slug}/portada.png`;
                img.onerror = null;
            };
        };
    });
});
