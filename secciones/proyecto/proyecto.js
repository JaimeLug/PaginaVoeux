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
    document.getElementById('project-brand').textContent = project.brand;
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('spec-cliente').textContent = project.brand;

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
        heroImg.onerror = () => {
            heroImg.src = `imagenes/${project.mediaSlug}/portada.png`;
            heroImg.onerror = null; // si tampoco existe .png, deja el placeholder implícito
        };
    } else {
        vimeoHeroContainer.style.display = 'none';
        heroImg.style.display = 'block';
        heroImg.alt = `Portada del proyecto ${project.title}`;
    }

    // ── Gallery loading ────────────────────────────────────────────────────────
    const galleryEl = document.getElementById('project-gallery');

    if (!project.mediaSlug) {
        return;
    }

    galleryEl.innerHTML = '<p class="gallery-loading">Cargando galería…</p>';

    let combinedItems = [];

    try {
        const res = await fetch('js/galleryData.json');
        if (res.ok) {
            const galleryManifest = await res.json();
            const projectMedia = galleryManifest[project.mediaSlug];

            if (projectMedia) {
                // Render images from JSON
                if (projectMedia.images && projectMedia.images.length > 0) {
                    projectMedia.images.forEach(filename => {
                        combinedItems.push({
                            type: 'image',
                            fullResSrc: `imagenes/${project.mediaSlug}/${filename}`,
                            thumbnailSrc: `imagenes/${project.mediaSlug}/thumbs/${filename.replace(/\.[^.]+$/, '.jpg')}`,
                            alt: filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
                        });
                    });
                }

                // Render videos from JSON (Vimeo objects)
                if (projectMedia.videos && projectMedia.videos.length > 0) {
                    projectMedia.videos.forEach(videoData => {
                        // Push immediately, objects already defined properly in JSON
                        combinedItems.push(videoData);
                    });
                }
            }
        }
    } catch (error) {
        console.warn('[proyecto.js] Error loading gallery JSON:', error);
    }

    // 3. Render Combined Items
    if (combinedItems.length === 0) {
        galleryEl.innerHTML = '';
        return;
    }

    galleryEl.innerHTML = '';
    initLightbox();

    combinedItems.forEach(item => {
        const wrapper = document.createElement('div');

        if (item.type === 'vimeo') {
            const vimeoId = item.vimeoRaw ? extractVimeoId(item.vimeoRaw) : item.id;

            wrapper.className = 'media-item media-item--video';
            wrapper.title = 'Ver video';

            if (vimeoId && vimeoId !== 'PENDIENTE') {
                const iframe = document.createElement('iframe');
                iframe.src = `https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&muted=1&loop=1`;
                iframe.frameBorder = "0";
                iframe.allow = "autoplay; fullscreen; picture-in-picture";
                iframe.style.width = "100%";
                iframe.style.height = "100%";
                iframe.style.pointerEvents = "none";
                iframe.style.objectFit = "cover";

                const orientation = item.orientation || 'horizontal';
                wrapper.addEventListener('click', () => openLightbox(vimeoId, 'vimeo', orientation));
                wrapper.appendChild(iframe);
            } else {
                wrapper.classList.add('loading-placeholder');
                wrapper.title = '';
                wrapper.innerHTML = '<div class="vimeo-gallery-wrapper" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;"><div class="loading-text">Video Pendiente</div></div>';
            }
        } else if (item.type === 'image') {
            wrapper.className = 'media-item media-item--image';
            wrapper.title = 'Ver en tamaño completo';

            const img = document.createElement('img');
            img.src = item.thumbnailSrc;
            img.alt = item.alt || 'Gallery Image';
            img.loading = 'lazy';
            img.decoding = 'async';
            img.onerror = () => { img.src = item.fullResSrc; img.onerror = null; };

            wrapper.addEventListener('click', () => openLightbox(item.fullResSrc, 'image'));
            wrapper.appendChild(img);
        }

        galleryEl.appendChild(wrapper);
    });
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
