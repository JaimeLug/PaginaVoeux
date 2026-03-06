(function () {
    const projects = [
        {
            brand: "Xcaret Xtar",
            campaign: "XTAR AWARDS",
            vimeoId: "1170429174",
            heroPoster: "imagenes/xcaret_xtar/poster.png",
            brandLogo: "imagenes/Logo_Xcaret_Xtar.png",
            link: "#proyectos?id=xcaret-xtar",
            isVertical: false
        },
        {
            brand: "Xcaret",
            campaign: "XCARET LEALTAD",
            vimeoId: "1170429044",
            heroPoster: "imagenes/xcaret_lealtad/poster.png",
            brandLogo: "imagenes/Logo_Xcaret.png",
            link: "#proyectos?id=xcaret-lealtad",
            isVertical: false
        },
        {
            brand: "Xaak",
            campaign: "REAPERTURA",
            vimeoId: "1170836491",
            heroPoster: "imagenes/xaak/poster.png",
            brandLogo: "imagenes/Logo__Xaak.png",
            link: "#proyectos?id=xaak",
            isVertical: true
        },
        {
            brand: "Power and Flow",
            campaign: "POWER AND FLOW",
            vimeoId: "1170428872",
            heroPoster: "imagenes/power_mas_flow/poster.png",
            brandLogo: "imagenes/Logo__Power.png",
            link: "#proyectos?id=power-mas-flow",
            isVertical: true
        }
    ];

    let activeIndex = 0;
    let bgVideoIndex = 0;
    let currentVideoToken = 0;
    let sequenceTimeoutId = null;

    // Use a listener to initialize when section is loaded dynamically
    function init() {
        const navContainer = document.getElementById("project-nav");
        const containerElements = [
            document.getElementById("vimeo-container-1"),
            document.getElementById("vimeo-container-2")
        ];
        const iframeElements = [
            document.getElementById("bg-video-1"),
            document.getElementById("bg-video-2")
        ];
        const posterElements = [
            document.getElementById("vimeo-poster-1"),
            document.getElementById("vimeo-poster-2")
        ];

        if (!navContainer || !iframeElements[0] || !iframeElements[1]) return;

        let vimeoPlayers = [];
        let playerCurrentIds = [];

        function updateDynamicBrand(index, token) {
            const proj = projects[index];
            const container = document.getElementById("hero-dynamic");
            const brandLogoEl = document.getElementById("dynamic-brand-logo");
            const ctaLinkEl = document.getElementById("dynamic-cta-link");

            if (!container || !brandLogoEl) return;

            container.style.opacity = '0';

            setTimeout(() => {
                if (token !== undefined && token !== currentVideoToken) return;

                if (ctaLinkEl) ctaLinkEl.href = proj.link || "#";

                if (proj.brandLogo && proj.brandLogo !== "") {
                    brandLogoEl.style.display = "block";
                    brandLogoEl.onload = () => {
                        if (token !== undefined && token !== currentVideoToken) return;
                        container.style.opacity = '1';
                        brandLogoEl.onload = null;
                    };
                    brandLogoEl.src = proj.brandLogo;
                } else {
                    brandLogoEl.style.display = "none";
                    container.style.opacity = '1';
                }
            }, 400);
        }

        function initNav() {
            navContainer.innerHTML = '';
            projects.forEach((proj, index) => {
                const navItem = document.createElement("div");
                navItem.className = `nav-item ${index === activeIndex ? "active" : ""}`;
                navItem.onclick = () => selectProject(index);

                const line = document.createElement("div");
                line.className = "nav-item-line";

                const brand = document.createElement("div");
                brand.className = "nav-item-brand";
                brand.textContent = proj.brand;

                const campaign = document.createElement("div");
                campaign.className = "nav-item-campaign";
                campaign.textContent = proj.campaign;

                navItem.appendChild(line);
                navItem.appendChild(brand);
                navItem.appendChild(campaign);

                navContainer.appendChild(navItem);
            });

            // Load initial poster and video
            const initialProj = projects[activeIndex];
            posterElements[0].src = initialProj.heroPoster;
            iframeElements[0].src = `https://player.vimeo.com/video/${initialProj.vimeoId}?background=1&autoplay=1&muted=1`;
            containerElements[0].classList.add('active');

            if (typeof Vimeo !== 'undefined') {
                vimeoPlayers = iframeElements.map(iframe => new Vimeo.Player(iframe));
                playerCurrentIds = [projects[0].vimeoId, projects[1].vimeoId]; // initial IDs in HTML

                vimeoPlayers.forEach((player, idx) => {
                    player.on('ended', () => {
                        if (containerElements[idx].classList.contains('active')) {
                            // En el código original iteraba hacia atrás, mantenemos la lógica:
                            const nextIdx = (activeIndex - 1 + projects.length) % projects.length;
                            selectProject(nextIdx);
                        }
                    });
                });

                vimeoPlayers[0].on('play', () => {
                    posterElements[0].style.opacity = '0';
                    posterElements[0].style.pointerEvents = 'none';
                });
            }

            // Set initial content for dynamic brand
            const brandLogoEl = document.getElementById("dynamic-brand-logo");
            const ctaLinkEl = document.getElementById("dynamic-cta-link");

            if (brandLogoEl) {
                if (initialProj.brandLogo && initialProj.brandLogo !== "") {
                    brandLogoEl.src = initialProj.brandLogo;
                    brandLogoEl.style.display = "block";
                } else {
                    brandLogoEl.style.display = "none";
                }
            }

            if (ctaLinkEl) {
                ctaLinkEl.href = initialProj.link || "#";
            }
        }

        function selectProject(index) {
            if (sequenceTimeoutId) {
                clearTimeout(sequenceTimeoutId);
                sequenceTimeoutId = null;
                const heroIntro = document.getElementById("hero-intro");
                const heroDynamic = document.getElementById("hero-dynamic");
                if (heroIntro) heroIntro.classList.add("hidden");
                if (heroDynamic) heroDynamic.classList.add("active");
            }

            if (index === activeIndex) return;

            activeIndex = index;
            const nextProject = projects[activeIndex];

            currentVideoToken++;
            const myToken = currentVideoToken;

            updateDynamicBrand(activeIndex, myToken);
            updateNavUI();

            // Lógica Sincronización Poster-First (Vimeo API)
            const currentContainer = containerElements[bgVideoIndex];
            const nextIndex = (bgVideoIndex + 1) % 2;
            const nextContainer = containerElements[nextIndex];
            const nextIframe = iframeElements[nextIndex];
            const nextPoster = posterElements[nextIndex];

            // Fade out current container
            currentContainer.style.opacity = '0';
            currentContainer.classList.remove("active");

            // Setup new poster
            nextPoster.src = nextProject.heroPoster;
            nextPoster.style.opacity = '1';
            nextPoster.style.pointerEvents = 'auto';
            nextContainer.style.opacity = '1'; // Show container to let poster be visible
            nextContainer.classList.add("active");
            nextIframe.className = nextProject.isVertical ? 'video-vertical' : 'video-horizontal';

            // Escuchar el inicio de reproducción y cargar el vídeo a través de la API
            if (typeof Vimeo !== 'undefined' && vimeoPlayers[nextIndex]) {
                const nextPlayer = vimeoPlayers[nextIndex];

                let playFallbackTimeout = setTimeout(() => {
                    if (myToken === currentVideoToken) {
                        nextPoster.style.opacity = '0';
                        nextPoster.style.pointerEvents = 'none';
                        bgVideoIndex = nextIndex;
                    }
                }, 4000);

                nextPlayer.off('play'); // Remove old listener
                nextPlayer.on('play', () => {
                    clearTimeout(playFallbackTimeout);
                    if (myToken !== currentVideoToken) return;
                    // Lower poster opacity only when play is confirmed
                    nextPoster.style.opacity = '0';
                    nextPoster.style.pointerEvents = 'none';
                    bgVideoIndex = nextIndex;
                });

                if (playerCurrentIds[nextIndex] === nextProject.vimeoId) {
                    // Video ya cargado en este reproductor, solo darle play
                    nextPlayer.play().catch((error) => {
                        console.warn("Vimeo play cancelado:", error);
                    });
                } else {
                    // Cargar nuevo video y actualizar track ID
                    nextPlayer.loadVideo(nextProject.vimeoId).catch((error) => {
                        console.warn("Vimeo loadVideo cancelado:", error);
                    });
                    playerCurrentIds[nextIndex] = nextProject.vimeoId;
                }
            } else {
                // Secuencia de respaldo seguro en caso de que Vimeo no esté cargado
                nextIframe.src = `https://player.vimeo.com/video/${nextProject.vimeoId}?background=1&autoplay=1&muted=1`;
                // Asumimos que funcionó y quitamos el poster a los pocos ms
                setTimeout(() => {
                    if (myToken === currentVideoToken) {
                        nextPoster.style.opacity = '0';
                        nextPoster.style.pointerEvents = 'none';
                        bgVideoIndex = nextIndex;
                    }
                }, 1000);
            }
        }

        function updateNavUI() {
            const navItems = navContainer.querySelectorAll(".nav-item");
            navItems.forEach((item, idx) => {
                if (idx === activeIndex) {
                    item.classList.add("active");
                } else {
                    item.classList.remove("active");
                }
            });
        }

        initNav();

        // Intro sequence
        if (sequenceTimeoutId) clearTimeout(sequenceTimeoutId);

        sequenceTimeoutId = setTimeout(() => {
            const heroIntro = document.getElementById("hero-intro");
            const heroDynamic = document.getElementById("hero-dynamic");
            if (heroIntro) heroIntro.classList.add("hidden");
            if (heroDynamic) heroDynamic.classList.add("active");
            sequenceTimeoutId = null;
        }, 4000);
    }

    // Since it's a SPA, we might load this script right after injecting HTML
    // We listen to the custom event we dispatch in app.js
    window.addEventListener('section-loaded', function onSectionLoad(e) {
        if (e.detail.section === 'inicio') {
            init();
        }
    });

    // Also run init just in case it loads fast enough on first load
    if (document.getElementById("project-nav")) {
        init();
    }
})();
