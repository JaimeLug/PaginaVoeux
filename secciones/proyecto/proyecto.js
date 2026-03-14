// Script for project view — Dynamic content injection + Gallery auto-discovery
window.addEventListener('section-loaded', async (e) => {
    if (e.detail.section !== 'proyecto') return;

    // Scroll to top on every project load
    window.scrollTo({ top: 0, behavior: 'instant' });

    const projectId = e.detail.projectId;

    if (typeof PROJECTS_DATA === 'undefined') {
        console.error('[proyecto.js] PROJECTS_DATA no está disponible.');
        return;
    }

    const project = PROJECTS_DATA[projectId];

    if (!project) {
        console.warn(`[proyecto.js] Proyecto no encontrado: "${projectId}"`);
        document.getElementById('project-title').textContent = 'Proyecto no encontrado';
        document.getElementById('project-brand').textContent = '';
        return;
    }

    // ── Brand & Title ──────────────────────────────────────────────────────────
    document.getElementById('project-brand').textContent = project.brand || '';
    document.getElementById('project-title').textContent = project.title || '';
    document.getElementById('spec-cliente').textContent = project.client || project.brand || '';
    document.getElementById('spec-servicios').textContent = project.services || '';
    document.getElementById('spec-anio').textContent = project.year || '';

    // ── Description paragraphs ────────────────────────────────────────────────
    const descContainer = document.getElementById('project-description');
    descContainer.innerHTML = '';
    project.description.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        descContainer.appendChild(p);
    });

    // ── Highlight ──────────────────────────────────────────────────────────────
    const highlightEl = document.getElementById('project-highlight');
    if (project.highlight) {
        highlightEl.textContent = project.highlight;
        highlightEl.style.display = '';
    } else {
        highlightEl.style.display = 'none';
    }

    // ── Hero media ────────────────────────────────────────────────────────────
    const vimeoHeroContainer = document.getElementById('vimeo-hero-container');
    const vimeoHeroIframe = document.getElementById('project-hero-vimeo');
    const heroImg = document.getElementById('project-hero-img');

    if (project.heroVimeoId) {
        heroImg.style.display = 'none';
        vimeoHeroContainer.style.display = 'block';
        vimeoHeroIframe.src = `https://player.vimeo.com/video/${project.heroVimeoId}?background=1&autoplay=1&muted=1`;
    } else if (project.mediaSlug) {
        // Intenta cargar portada.jpg o portada.png
        vimeoHeroContainer.style.display = 'none';
        heroImg.style.display = 'block';
        heroImg.alt = `Portada del proyecto ${project.title}`;
        heroImg.src = `imagenes/${project.mediaSlug}/portada.jpg`;
        if (project.coverPositionY) {
            heroImg.style.objectPosition = `50% ${project.coverPositionY}`;
        } else {
            heroImg.style.objectPosition = '50% 50%'; // Reset to default
        }
        heroImg.onerror = () => {
            heroImg.src = `imagenes/${project.mediaSlug}/portada.png`;
            heroImg.onerror = null; // si tampoco existe .png, deja el placeholder implícito
        };
    } else {
        vimeoHeroContainer.style.display = 'none';
        heroImg.style.display = 'block';
        heroImg.alt = `Portada del proyecto ${project.title}`;
        if (project.coverPositionY) {
            heroImg.style.objectPosition = `50% ${project.coverPositionY}`;
        } else {
            heroImg.style.objectPosition = '50% 50%';
        }
    }

    // ── Dynamic Content Blocks (Widgets) ───────────────────────────────────────
    const dynamicContainer = document.getElementById('project-dynamic-content');

    if (dynamicContainer) {
        dynamicContainer.innerHTML = '';

        if (project.content_blocks && project.content_blocks.length > 0) {
            try {
                // Aseguramos que los widgets estén cargados antes de renderizarlos
                const widgetsToLoad = [
                    'js/widgets/HorizontalVideoWidget.js',
                    'js/widgets/PhotoGridWidget.js',
                    'js/widgets/VerticalVideoCarouselWidget.js'
                ];
                await Promise.all(widgetsToLoad.map(src => typeof loadJS === 'function' ? loadJS(src) : Promise.resolve()));

                // Iterar y renderizar secuencialmente
                project.content_blocks.forEach(block => {
                    let widgetHtml = '';

                    switch (block.type) {
                        case 'horizontal-video':
                            if (window.HorizontalVideoWidget) widgetHtml = window.HorizontalVideoWidget(block);
                            break;
                        case 'photo-grid':
                            if (window.PhotoGridWidget) widgetHtml = window.PhotoGridWidget(block);
                            break;
                        case 'vertical-video-carousel':
                            if (window.VerticalVideoCarouselWidget) widgetHtml = window.VerticalVideoCarouselWidget(block);
                            break;
                        default:
                            console.warn(`[proyecto.js] Widget desconocido: ${block.type}`);
                    }

                    if (widgetHtml) {
                        const tempContainer = document.createElement('div');
                        tempContainer.innerHTML = widgetHtml.trim();
                        // Append the outermost node of the widget
                        if (tempContainer.firstElementChild) {
                            dynamicContainer.appendChild(tempContainer.firstElementChild);
                        }
                    }
                });
            } catch (err) {
                console.error('[proyecto.js] Error al cargar o renderizar widgets:', err);
            }
        }
    }
});

// ── Lightbox ──────────────────────────────────────────────────────────────────
function initLightbox() {
    if (document.getElementById('voeux-lightbox')) return; // already exists

    const lb = document.createElement('div');
    lb.id = 'voeux-lightbox';
    lb.innerHTML = `
        <div class="lb-backdrop"></div>
        <button class="lb-close" aria-label="Cerrar">&#x2715;</button>
        <div class="lb-media"></div>
    `;
    document.body.appendChild(lb);

    lb.querySelector('.lb-backdrop').addEventListener('click', closeLightbox);
    lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
}

function openLightbox(src, type, orientation = 'horizontal') {
    const lb = document.getElementById('voeux-lightbox');
    if (!lb) return;
    const container = lb.querySelector('.lb-media');
    container.innerHTML = '';

    if (type === 'image') {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Imagen a tamaño completo';
        container.appendChild(img);
    } else if (type === 'vimeo') {
        const iframe = document.createElement('iframe');
        iframe.src = `https://player.vimeo.com/video/${src}?autoplay=1&color=ffffff&title=0&byline=0&portrait=0`;
        iframe.frameBorder = "0";
        iframe.allow = "autoplay; fullscreen; picture-in-picture";
        // Apply orientation class for CSS
        iframe.className = orientation === 'vertical' ? 'lb-vimeo-vertical' : 'lb-vimeo-horizontal';
        container.appendChild(iframe);
    } else {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        video.setAttribute('playsinline', '');
        container.appendChild(video);
    }

    lb.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = document.getElementById('voeux-lightbox');
    if (!lb) return;
    lb.classList.remove('lb-open');
    document.body.style.overflow = '';
    // Stop video if playing
    const video = lb.querySelector('video');
    if (video) { video.pause(); video.src = ''; }

    // Stop vimeo if playing
    const iframe = lb.querySelector('iframe');
    if (iframe) { iframe.src = ''; }
}
