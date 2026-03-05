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
    const heroVideo = document.getElementById('project-hero-video');
    const heroImg = document.getElementById('project-hero-img');

    if (project.heroVideo) {
        heroImg.style.display = 'none';
        heroVideo.style.display = 'block';
        heroVideo.src = project.heroVideo;
        heroVideo.load();
        heroVideo.play().catch(() => { });
    } else if (project.mediaSlug) {
        // Intenta cargar portada.jpg o portada.png
        heroVideo.style.display = 'none';
        heroImg.style.display = 'block';
        heroImg.alt = `Portada del proyecto ${project.title}`;
        heroImg.src = `imagenes/${project.mediaSlug}/portada.jpg`;
        heroImg.onerror = () => {
            heroImg.src = `imagenes/${project.mediaSlug}/portada.png`;
            heroImg.onerror = null; // si tampoco existe .png, deja el placeholder implícito
        };
    } else {
        heroVideo.style.display = 'none';
        heroImg.style.display = 'block';
        heroImg.alt = `Portada del proyecto ${project.title}`;
    }

    // ── Gallery loading (via pre-generated JSON manifest) ─────────
    if (project.mediaSlug) {
        const galleryEl = document.getElementById('project-gallery');
        galleryEl.innerHTML = '<p class="gallery-loading">Cargando galería…</p>';

        try {
            const res = await fetch('js/galleryData.json');
            if (!res.ok) throw new Error('No se pudo cargar la galería.');

            const galleryManifest = await res.json();
            const projectMedia = galleryManifest[project.mediaSlug];

            if (!projectMedia || (projectMedia.images.length === 0 && projectMedia.videos.length === 0)) {
                galleryEl.innerHTML = '';
                return;
            }

            const galleryImgs = projectMedia.images;
            const galleryVids = projectMedia.videos;

            galleryEl.innerHTML = '';

            // ── Ensure lightbox exists in DOM ─────────────────────────────────────
            initLightbox();

            // Images first — thumbnail in grid, full-res in lightbox
            galleryImgs.forEach(filename => {
                const fullSrc = `imagenes/${project.mediaSlug}/${filename}`;
                // Thumbnails are always .jpg (converted by generate-thumbs.js)
                const thumbSrc = `imagenes/${project.mediaSlug}/thumbs/${filename.replace(/\.[^.]+$/, '.jpg')}`;

                const wrapper = document.createElement('div');
                wrapper.className = 'media-item media-item--image';
                wrapper.title = 'Ver en tamaño completo';

                const img = document.createElement('img');
                img.src = thumbSrc;                    // lightweight thumbnail
                img.alt = filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
                img.loading = 'lazy';
                img.decoding = 'async';
                // Fallback: if thumb doesn't exist yet, use the original
                img.onerror = () => { img.src = fullSrc; img.onerror = null; };

                // Click → lightbox with full-res original
                wrapper.addEventListener('click', () => openLightbox(fullSrc, 'image'));

                wrapper.appendChild(img);
                galleryEl.appendChild(wrapper);
            });

            // Videos after images — preload metadata to show first frame
            galleryVids.forEach(filename => {
                const src = `videos/${project.mediaSlug}/${filename}`;
                const wrapper = document.createElement('div');
                wrapper.className = 'media-item media-item--video';
                wrapper.title = 'Ver video';

                const video = document.createElement('video');
                video.src = src;
                video.muted = true;
                video.preload = 'metadata';         // loads only metadata + first frame
                video.setAttribute('playsinline', '');
                // Seek to first frame so browser paints it as thumbnail
                video.addEventListener('loadedmetadata', () => { video.currentTime = 0.1; });

                // Click → lightbox with full video + controls
                wrapper.addEventListener('click', () => openLightbox(src, 'video'));

                wrapper.appendChild(video);
                galleryEl.appendChild(wrapper);
            });
        } catch (error) {
            console.error('[proyecto.js] Error al cargar la galería:', error);
            galleryEl.innerHTML = '<p class="gallery-error">No se pudo cargar la galería.</p>';
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

function openLightbox(src, type) {
    const lb = document.getElementById('voeux-lightbox');
    if (!lb) return;
    const container = lb.querySelector('.lb-media');
    container.innerHTML = '';

    if (type === 'image') {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Imagen a tamaño completo';
        container.appendChild(img);
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
}
