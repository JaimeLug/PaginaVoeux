// js/widgets/VerticalVideoCarouselWidget.js

class FocalArcCarousel {
    constructor(container, data) {
        this.container = container;
        this.scene = container.querySelector('.vr-carousel-scene');
        this.cards = Array.from(container.querySelectorAll('.vr-video-card'));

        this.numCards = this.cards.length;
        // Ahora usamos un offset de rotación flotante en lugar de un índice discreto
        this.currentOffset = 0;

        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;

        // Variables para inercia y animación continua
        this.targetOffset = 0;
        this.autoPlaySpeed = 0.002; // Velocidad del giro continuo
        this.animationFrame = null;
        this.isHovering = false;

        this.init();
        this.setupVisibilityObserver();
    }

    init() {
        this.updateCarousel();
        this.startEngine(); // Iniciar motor de animación continua

        // Mouse Events
        this.scene.addEventListener('mousedown', (e) => this.dragStart(e.clientX));
        window.addEventListener('mousemove', (e) => this.dragMove(e.clientX));
        window.addEventListener('mouseup', () => this.dragEnd());

        this.scene.addEventListener('mouseleave', () => {
            if (this.isDragging) this.dragEnd();
        });

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
                if (this.isDragging || Math.abs(this.currentX) > 5) return;

                // Determinar cuál es la tarjeta que está 'al centro' visualmente
                // Normalizamos el offset actual al rango de [0, numCards)
                let normalizedOffset = ((this.currentOffset % this.numCards) + this.numCards) % this.numCards;
                let closestIndex = Math.round(normalizedOffset) % this.numCards;

                if (index !== closestIndex) {
                    // Si clicamos en una lateral, calculamos la distancia más corta para ponerla al frente
                    let distance = index - normalizedOffset;
                    if (distance > this.numCards / 2) distance -= this.numCards;
                    if (distance < -this.numCards / 2) distance += this.numCards;

                    this.targetOffset = this.currentOffset + distance;
                } else {
                    // Si clicamos en el centro exacto, abrimos Vimeo
                    const iframe = card.querySelector('iframe');
                    if (iframe && iframe.src) {
                        const match = iframe.src.match(/video\/(\d+)/);
                        if (match && match[1]) {
                            this.openVideoModal(match[1]);
                        }
                    }
                }
            });
        });
    }

    startEngine() {
        let lastTime = 0;
        const fpsInterval = 1000 / 30; // 30 FPS límite

        const tick = (currentTime) => {
            this.animationFrame = requestAnimationFrame(tick);

            if (!lastTime) lastTime = currentTime;
            const elapsed = currentTime - lastTime;

            if (elapsed > fpsInterval) {
                // Ajustar lastTime para el siguiente frame sin perder milisegundos
                lastTime = currentTime - (elapsed % fpsInterval);

                if (!this.isDragging) {
                    // Si no estamos arrastrando
                    if (Math.abs(this.targetOffset - this.currentOffset) > 0.001) {
                        // Lerp hacia el target (si hicimos click para centrar una o arrastramos)
                        this.currentOffset += (this.targetOffset - this.currentOffset) * 0.05;
                    } else {
                        // Avance continuo autónomo de poco en poco
                        this.currentOffset += this.autoPlaySpeed;
                        this.targetOffset = this.currentOffset;
                    }
                } else {
                    // Durante el drag, el target sigue al dedo al instante
                    this.currentOffset += (this.targetOffset - this.currentOffset) * 0.2;
                }

                this.updateCarousel();
            }
        };
        this.animationFrame = requestAnimationFrame(tick);
    }

    openVideoModal(vimeoId) {
        // Crear un div overlay oscuro
        const overlay = document.createElement('div');
        overlay.className = 'vr-video-modal-overlay';

        // El contenido del iframe pero con controles y sonido
        overlay.innerHTML = `
            <div class="vr-video-modal-content">
                <button class="vr-modal-close">&times;</button>
                <iframe src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&autopause=0" 
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
            // Evaluamos la distancia flotante desde el desplazamiento actual
            let rawDistance = index - this.currentOffset;

            // Bucle envolvente continuo usando Módulo estricto
            // Normaliza la distancia en un rango circular de [-numCards/2, numCards/2]
            const half = this.numCards / 2;
            let distance = ((rawDistance + half) % this.numCards + this.numCards) % this.numCards - half;

            const absDistance = Math.abs(distance);
            const direction = Math.sign(distance);

            // Optimización y Corte abrupto (evita que el elemento cruce la cámara Z=1000 y rompa el scroll)
            if (absDistance > 3.1) {
                card.style.visibility = 'hidden';
                if (card.style.transition !== 'none') {
                    card.style.transition = 'none';
                }
                card.style.pointerEvents = 'none';
                return;
            } else {
                card.style.visibility = 'visible';
                // Al ser animación analógica (requestAnimationFrame), eliminamos las transiciones CSS pesadas 
                // para que JS pinte fotograma por fotograma sin tirones del navegador
                if (card.style.transition !== 'none') {
                    card.style.transition = 'none';
                }
            }

            // --- WAKE-UP LOGIC (Lazy Loading) ---
            if (absDistance <= 3) {
                const iframe = card.querySelector('iframe');
                if (iframe && iframe.hasAttribute('data-src')) {
                    iframe.setAttribute('src', iframe.getAttribute('data-src'));
                    iframe.removeAttribute('data-src');

                    const preview = card.querySelector('.vr-preview');
                    if (preview) preview.remove();
                }
            }

            // ─── LA GEOMETRÍA PERFECTA CILÍNDRICA (VR) ───
            const radius = 750;
            const angleStep = 28;

            const theta = distance * angleStep;
            const thetaRad = theta * (Math.PI / 180);

            let xOffset = radius * Math.sin(thetaRad);
            let zOffset = radius * (1 - Math.cos(thetaRad));
            let yRotation = -theta;

            // Efectoescalado y opacidad
            let scale = 0.85;
            // Opacidad se desvanece más rápido para que sea invisible al llegar al corte de 3.1
            let opacity = 1 - (absDistance * 0.35);
            // El Z-Index debe recalcularse para el que esté más cerca de 0
            let zIndex = 100 - Math.round(absDistance * 10);

            // Foco interactivo: La tarjeta que esté más central recibe los eventos
            if (absDistance < 0.5) {
                card.style.pointerEvents = 'auto';
            } else {
                card.style.pointerEvents = 'none';
            }

            card.style.filter = `brightness(${1 - (absDistance * 0.2)})`;
            card.style.transform = `translate3d(${xOffset}px,0,${zOffset}px) rotateY(${yRotation}deg) scale(${scale})`;
            card.style.zIndex = zIndex;
            card.style.opacity = Math.max(0, opacity);
        });
    }

    dragStart(x) {
        this.isDragging = true;
        this.startX = x;
        // Guardar la posición inicial real al empezar a tocar
        this.startOffset = this.currentOffset;
        this.scene.classList.add('is-dragging');
    }

    dragMove(x) {
        if (!this.isDragging) return;
        this.currentX = x - this.startX;
        // Mapear píxeles a grados/índices (200px = 1 rotación de tarjeta)
        this.targetOffset = this.startOffset - (this.currentX / 200);
    }

    dragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.scene.classList.remove('is-dragging');

        // Al soltar, redondear (Snap) a la tarjeta más cercana
        this.targetOffset = Math.round(this.targetOffset);
        this.currentX = 0;
    }

    setupVisibilityObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!this.animationFrame) {
                        this.startEngine();
                    }
                } else {
                    if (this.animationFrame) {
                        cancelAnimationFrame(this.animationFrame);
                        this.animationFrame = null;
                    }
                }
            });
        }, { threshold: 0.1 });

        observer.observe(this.container);
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
    const minimumCardsRequired = 9;
    let extendedVideos = [...data.videos];
    while (extendedVideos.length < minimumCardsRequired) {
        extendedVideos = extendedVideos.concat(data.videos); // Duplica, triplica, etc.
    }

    const itemsHtml = extendedVideos.map(vimeoId => {
        return `
                <div class="vr-video-card">
                     <img class="vr-preview" src="https://vumbnail.com/${vimeoId}.jpg" alt="Video preview">
                     <iframe data-src="https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&muted=1&loop=1&autopause=0" 
                            frameborder="0" 
                            loading="lazy"
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
