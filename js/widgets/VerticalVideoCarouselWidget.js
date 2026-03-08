// js/widgets/VerticalVideoCarouselWidget.js

class FocalArcCarousel {
    constructor(container, data) {
        this.container = container;
        this.scene = container.querySelector('.vr-carousel-scene');
        this.cards = Array.from(container.querySelectorAll('.vr-video-card'));

        this.numCards = this.cards.length;
        this.currentIndex = Math.floor(this.numCards / 2); // Inicia justo en medio

        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;
        this.dragThreshold = 40;

        this.init();
    }

    init() {
        this.updateCarousel();

        // Mouse Events
        this.scene.addEventListener('mousedown', (e) => this.dragStart(e.clientX));
        window.addEventListener('mousemove', (e) => this.dragMove(e.clientX));
        window.addEventListener('mouseup', () => this.dragEnd());
        this.scene.addEventListener('mouseleave', () => { if (this.isDragging) this.dragEnd(); });

        // Touch Events
        this.scene.addEventListener('touchstart', (e) => this.dragStart(e.touches[0].clientX), { passive: true });
        window.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                if (Math.abs(e.touches[0].clientX - this.startX) > 10) e.preventDefault();
                this.dragMove(e.touches[0].clientX);
            }
        }, { passive: false });
        window.addEventListener('touchend', () => this.dragEnd());

        // Clic en tarjetas
        this.cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (this.isDragging) return;

                if (index !== this.currentIndex) {
                    // Si es una tarjeta lateral, tráela al frente
                    this.currentIndex = index;
                    this.updateCarousel();
                } else {
                    // Si es la tarjeta central (ya está al frente), abrir popup de Vimeo
                    const iframe = card.querySelector('iframe');
                    if (iframe && iframe.src) {
                        // Extraer el ID de vimeo de la URL (después de video/ y antes de ?)
                        const match = iframe.src.match(/video\/(\d+)/);
                        if (match && match[1]) {
                            this.openVideoModal(match[1]);
                        }
                    }
                }
            });
        });
    }

    openVideoModal(vimeoId) {
        // Crear un div overlay oscuro
        const overlay = document.createElement('div');
        overlay.className = 'vr-video-modal-overlay';

        // El contenido del iframe pero con controles y sonido
        overlay.innerHTML = `
            <div class="vr-video-modal-content">
                <button class="vr-modal-close">&times;</button>
                <iframe src="https://player.vimeo.com/video/${vimeoId}?autoplay=1" 
                    frameborder="0" 
                    allow="autoplay; fullscreen; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
        `;

        document.body.appendChild(overlay);

        // Bloquear scroll del fondo
        document.body.style.overflow = 'hidden';

        // Animación de entrada suave
        setTimeout(() => overlay.classList.add('visible'), 10);

        // Cerrar modal
        const closeBtn = overlay.querySelector('.vr-modal-close');
        const closeModal = () => {
            overlay.classList.remove('visible');
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 300);
        };

        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
    }

    updateCarousel() {
        this.cards.forEach((card, index) => {
            let distance = index - this.currentIndex;

            // Bucle infinito circular
            const half = Math.floor(this.numCards / 2);
            if (distance > half) distance -= this.numCards;
            if (distance < -half) distance += this.numCards;

            const absDistance = Math.abs(distance);
            const direction = Math.sign(distance);

            // Optimización y Corte abrupto: Las que están lejos se ocultan y mandan al fondo *SIN ANIMACIÓN*
            // Para evitar ese efecto de que "vuelan de atrás" durante la transición del índice.
            if (absDistance > 4) {
                card.style.transition = 'none'; // Clave: Cortar la animación para saltar de inmediato al fondo
                card.style.transform = `translateX(${direction * 800}px) translateZ(-800px) rotateY(${direction * -45}deg) scale(0)`;
                card.style.opacity = '0';
                card.style.zIndex = '1';
                card.style.pointerEvents = 'none';

                // Forzar un reflow para asegurar que el motor del navegador capta el salto sin transición
                void card.offsetHeight;

                return;
            } else {
                // Restauramos la transición bella para las que sí están en pantalla (<=2 de distancia)
                card.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), z-index 0.6s step-end';
            }

            // ─── LA GEOMETRÍA PERFECTA CILÍNDRICA (VR) ───
            let xOffset = 0;
            let zOffset = 0;
            let yRotation = 0;
            // Usamos una escala global constate para no distorsionar las tarjetas entre sí.
            // Esto asegura que los bordes interiores coincidan naturalmente por la perspectiva.
            let scale = 0.85;
            let opacity = 1;
            let zIndex = 10;

            if (absDistance === 0) {
                xOffset = 0;
                zOffset = 0;
                yRotation = 0;
                zIndex = 10;
                card.style.pointerEvents = 'auto';
                card.style.filter = 'brightness(1)';
            } else {
                // Simulamos un muro cilíndrico envolvente
                const radius = 750; // Apertura del cilindro (mayor = curva más plana)
                const angleStep = 28; // Espaciado entre tarjetas (grados)

                const theta = distance * angleStep;
                const thetaRad = theta * (Math.PI / 180);

                // Posición X natural en el perímetro de la curva
                xOffset = radius * Math.sin(thetaRad);

                // Posición Z (positiva = sale la imagen hacia ti) envolviendo tu visión
                zOffset = radius * (1 - Math.cos(thetaRad));

                // Rotamos la tarjeta para que sea tangente a la curva y mire hacia ti
                yRotation = -theta;

                opacity = 1 - (absDistance * 0.15);
                zIndex = 10 - absDistance;
                card.style.pointerEvents = 'none';
                card.style.filter = `brightness(${1 - (absDistance * 0.2)})`;
            }

            // Aplicar la magia matemática
            card.style.transform = `translateX(${xOffset}px) translateZ(${zOffset}px) rotateY(${yRotation}deg) scale(${scale})`;
            card.style.zIndex = zIndex;
            card.style.opacity = opacity;
        });
    }

    dragStart(x) {
        this.isDragging = true;
        this.startX = x;
        this.scene.classList.add('is-dragging');
    }

    dragMove(x) {
        if (!this.isDragging) return;
        this.currentX = x - this.startX;
    }

    dragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.scene.classList.remove('is-dragging');

        // Umbral de swipe (swipe threshold).
        // Aumentado a 60px para evitar gestos accidentales, pero asegura que
        // cada vez que arrastras el mouse o dedo y lo sueltas, SÓLO se mueva 1 tarjeta.
        if (this.currentX < -60) {
            this.currentIndex = (this.currentIndex + 1) % this.numCards;
        } else if (this.currentX > 60) {
            this.currentIndex = (this.currentIndex - 1 + this.numCards) % this.numCards;
        }

        this.updateCarousel();
        this.currentX = 0;
    }
}

window.VerticalVideoCarouselWidget = function (data) {
    if (!data || !data.videos || data.videos.length === 0) return '';

    if (typeof window.loadCSS === 'function') {
        window.loadCSS('css/widgets/VerticalVideoCarouselWidget.css');
    }

    const uniqueId = 'vr-carousel-' + Math.random().toString(36).substr(2, 9);
    const title = data.title ? `<h2 class="vr-carousel-title">${data.title}</h2>` : '';

    // ─── EL TRUCO DEL BUCLE INFINITO ───
    // Si hay muy pocos videos (ej. 5), la lógica circular (distance > half) de FocalArcCarousel
    // causa que uno "vuele" de un extremo al otro frente a la cámara.
    // Solución más eficiente: multiplicar el array original de videos antes de inyectarlos al HTML.
    // Triplicar la lista asegura que haya suficientes tarjetas físicas reales para que las 
    // tarjetas ocultas nunca tengan que cruzar en medio de tu vista mientras rotas.
    const minimumCardsRequired = 15;
    let extendedVideos = [...data.videos];
    while (extendedVideos.length < minimumCardsRequired) {
        extendedVideos = extendedVideos.concat(data.videos); // Duplica, triplica, etc.
    }

    const itemsHtml = extendedVideos.map(vimeoId => {
        return `
                <div class="vr-video-card">
                     <iframe src="https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&muted=1&loop=1" 
                            frameborder="0" 
                            allow="autoplay; fullscreen; picture-in-picture">
                    </iframe>
                </div>
            `;
    }).join('');

    setTimeout(() => {
        const container = document.getElementById(uniqueId);
        if (container) new FocalArcCarousel(container, data);
    }, 150);

    return `
        <div id="${uniqueId}" class="vr-carousel-container">
            ${title}
            <div class="vr-carousel-scene">
                ${itemsHtml}
            </div>
        </div>
    `;
};
