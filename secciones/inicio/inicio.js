(function () {
    const projects = [
        {
            brand: "Xcaret Xtar",
            campaign: "XTAR AWARDS",
            video: "videos/xcaret_xtar.mp4",
            brandLogo: "imagenes/Logo_Xcaret_Xtar.png",
            link: "#proyectos"
        },
        {
            brand: "Xcaret",
            campaign: "XCARET LEALTAD",
            video: "videos/xcaret_lealtad.mp4",
            brandLogo: "imagenes/Logo_Xcaret.png",
            link: "#proyectos"
        },
        {
            brand: "Xaak",
            campaign: "REAPERTURA",
            video: "videos/xaak_reapertura.mp4",
            brandLogo: "imagenes/Logo__Xaak.png",
            link: "#proyectos"
        },
        {
            brand: "Power mas Flow",
            campaign: "POWER MAS FLOW",
            video: "videos/powermasflow.mp4",
            brandLogo: "imagenes/Logo__Power.png",
            link: "#proyectos"
        }
    ];

    let activeIndex = 0;
    let bgVideoIndex = 0;
    let currentVideoToken = 0;
    let sequenceTimeoutId = null;

    // Use a listener to initialize when section is loaded dynamically
    function init() {
        const navContainer = document.getElementById("project-nav");
        const videoElements = [
            document.getElementById("bg-video-1"),
            document.getElementById("bg-video-2")
        ];

        if (!navContainer || !videoElements[0] || !videoElements[1]) return;

        function updateDynamicBrand(index, token) {
            const proj = projects[index];
            const container = document.getElementById("hero-dynamic");
            const brandLogoEl = document.getElementById("dynamic-brand-logo");
            const ctaLinkEl = document.getElementById("dynamic-cta-link");

            if (!container || !brandLogoEl) return;

            // Paso A: Ocultar el contenedor entero
            container.style.opacity = '0';

            // Paso B: Esperar la transición CSS
            setTimeout(() => {
                if (token !== undefined && token !== currentVideoToken) return;

                // Actualizar enlace
                if (ctaLinkEl) ctaLinkEl.href = proj.link || "#";

                if (proj.brandLogo && proj.brandLogo !== "") {
                    // Caso A: El proyecto SÍ tiene un logo válido
                    brandLogoEl.style.display = "block";

                    // Asignar evento onload ANTES de cambiar el src
                    brandLogoEl.onload = () => {
                        if (token !== undefined && token !== currentVideoToken) return;
                        container.style.opacity = '1';
                        // Limpiar el evento para evitar disparos múltiples o fugas de memoria
                        brandLogoEl.onload = null;
                    };

                    // Actualizar el src, lo cual lanzará el onload una vez cargado
                    brandLogoEl.src = proj.brandLogo;
                } else {
                    // Caso B: Fallback sin logo
                    brandLogoEl.style.display = "none";

                    // Mostrar inmediatamente ya que no hay imagen que cargar
                    container.style.opacity = '1';
                }
            }, 400);
        }

        function initNav() {
            navContainer.innerHTML = ''; // reset just in case
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

            // Load initial video
            videoElements[bgVideoIndex].src = projects[activeIndex].video;

            // Set initial content for dynamic brand container without animations
            const proj = projects[activeIndex];
            const brandLogoEl = document.getElementById("dynamic-brand-logo");
            const ctaLinkEl = document.getElementById("dynamic-cta-link");

            if (brandLogoEl) {
                if (proj.brandLogo && proj.brandLogo !== "") {
                    brandLogoEl.src = proj.brandLogo;
                    brandLogoEl.style.display = "block";
                } else {
                    brandLogoEl.style.display = "none";
                }
            }

            if (ctaLinkEl) {
                ctaLinkEl.href = proj.link || "#";
            }
        }

        function selectProject(index) {
            // Cancel the intro sequence immediately if the user interacts
            if (sequenceTimeoutId) {
                clearTimeout(sequenceTimeoutId);
                sequenceTimeoutId = null;
                // Force containers into their final state immediately to avoid overlap
                const heroIntro = document.getElementById("hero-intro");
                const heroDynamic = document.getElementById("hero-dynamic");
                if (heroIntro) heroIntro.classList.add("hidden");
                if (heroDynamic) heroDynamic.classList.add("active");
            }

            if (index === activeIndex) return;

            activeIndex = index;
            const nextProject = projects[activeIndex];

            // 2. Sistema de Token para Cancelación (Race Condition Fix)
            currentVideoToken++;
            const myToken = currentVideoToken;

            // 1. Desacoplar la UI del Video
            updateDynamicBrand(activeIndex, myToken);
            updateNavUI();

            // 3. Secuencia Segura de Carga de Video
            const currentVideo = videoElements[bgVideoIndex];
            const nextVideoIndex = (bgVideoIndex + 1) % 2;
            const nextVideo = videoElements[nextVideoIndex];

            // Paso A: Aplica opacity = 0 al video actual para ocultarlo suavemente
            currentVideo.style.opacity = '0';
            currentVideo.classList.remove("active");

            // Paso B: Cambia el src al nuevo video y forzar carga
            nextVideo.src = nextProject.video;
            nextVideo.load();

            // Paso C: Asigna evento oncanplay
            nextVideo.oncanplay = () => {
                if (myToken !== currentVideoToken) return;

                // Paso D: Manejo de Promesas Obligatorio
                nextVideo.play().then(() => {
                    nextVideo.style.opacity = '1';
                    nextVideo.classList.add("active");
                    bgVideoIndex = nextVideoIndex;
                }).catch((error) => {
                    console.warn("Carga de video interrumpida intencionalmente por nuevo clic", error);
                });
            };
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

        const handleVideoEnd = (e) => {
            const vid = e.target;
            if (vid.classList.contains("active")) {
                const nextIdx = (activeIndex - 1 + projects.length) % projects.length;
                selectProject(nextIdx);
            }
        };

        videoElements.forEach((vid) => {
            // Remove any previous to avoid duplicates on route change
            vid.removeEventListener("ended", handleVideoEnd);
            vid.addEventListener("ended", handleVideoEnd);
        });

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
