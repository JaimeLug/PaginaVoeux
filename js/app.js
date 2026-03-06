document.addEventListener("DOMContentLoaded", async () => {
    // 1. Initial Load of Components (Header, Menu, Footer)
    await loadComponent('header-container', 'componentes/header/header.html', 'componentes/header/header.css');
    await loadComponent('footer-container', 'componentes/footer/footer.html', 'componentes/footer/footer.css');
    await loadComponent('menu-container', 'componentes/menu/menu.html', 'componentes/menu/menu.css', 'componentes/menu/menu.js');

    // Load global project data
    await loadJS('js/projectsData.js');

    // Remove preload class to enable transitions after initial DOM and components load
    document.body.classList.remove('preload');

    // 2. Setup simple router based on hash
    window.addEventListener('hashchange', router);

    // Initial route check
    router();

    // 3. Cookie Banner Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('btn-accept-cookies');
    const configBtn = document.getElementById('btn-config-cookies');

    if (cookieBanner) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.style.display = 'flex'; // Show banner if no cookies accepted
        }

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieBanner.classList.add('hide'); // Apply fade-out translation
                setTimeout(() => {
                    cookieBanner.style.display = 'none'; // Fully hide after transition
                }, 500);
            });
        }

        if (configBtn) {
            configBtn.addEventListener('click', () => {
                // Placeholder for future configuration modal
                console.log('Open cookie configuration');
            });
        }
    }
});

// Cache for loaded scripts/styles to prevent duplicating them
const loadedAssets = {
    css: new Set(),
    js: new Set()
};

async function loadComponent(containerId, htmlPath, cssPath, jsPath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        // Fetch and inject HTML
        const response = await fetch(htmlPath);
        if (response.ok) {
            const html = await response.text();
            container.innerHTML = html;
        } else {
            console.error(`Error loading HTML from ${htmlPath}:`, response.statusText);
        }

        // Load CSS if provided
        if (cssPath) {
            loadCSS(cssPath);
        }

        // Load JS if provided
        if (jsPath) {
            await loadJS(jsPath);
        }
    } catch (error) {
        console.error(`Error loading component from ${htmlPath}:`, error);
    }
}

function loadCSS(href) {
    if (loadedAssets.css.has(href)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);

    loadedAssets.css.add(href);
}

function loadJS(src) {
    return new Promise((resolve, reject) => {
        if (loadedAssets.js.has(src)) {
            // Already loaded, just resolve
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            loadedAssets.js.add(src);
            resolve();
        };
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// Router map
const routes = {
    '': 'inicio', // default route
    '#inicio': 'inicio',
    '#proyectos': 'proyectos',
    '#filosofia': 'filosofia',
    '#contacto': 'contacto',
    '#proyecto': 'proyecto',
    '#/privacidad': 'privacidad',
    '#/terminos': 'terminos'
};

async function router() {
    let hash = window.location.hash;
    let basePath = hash.split('?')[0]; // Simple query string handling
    let sectionName = routes[basePath] || 'inicio';

    // Close menu if open when navigating
    const sideMenu = document.getElementById('side-menu');
    if (sideMenu && sideMenu.classList.contains('open')) {
        sideMenu.classList.remove('open');
    }

    const appContent = document.getElementById('app-content');
    const dynamicHeader = document.getElementById('dynamic-header-center');
    if (dynamicHeader) {
        dynamicHeader.innerHTML = '';
    }

    // Fade out current content
    appContent.classList.add('fade-out');

    // Wait for fade out transition (0.5s as requested)
    await new Promise(resolve => setTimeout(resolve, 500));

    appContent.innerHTML = ''; // Clear current content
    window.scrollTo(0, 0); // Make sure we scroll to top on new section

    // We dispatch a custom event to allow previous section's JS to cleanup if needed (like timers)
    window.dispatchEvent(new Event('section-unload'));

    // Path structure for sections
    let htmlPath, cssPath, jsPath;

    if (sectionName === 'privacidad' || sectionName === 'terminos') {
        htmlPath = `secciones/legales/${sectionName}.html`;
        cssPath = `secciones/legales/legales.css`;
        jsPath = null;
    } else {
        htmlPath = `secciones/${sectionName}/${sectionName}.html`;
        cssPath = `secciones/${sectionName}/${sectionName}.css`;
        jsPath = `secciones/${sectionName}/${sectionName}.js`;
    }

    await loadComponent('app-content', htmlPath, cssPath, jsPath);

    // Fade in new content
    appContent.classList.remove('fade-out');

    // Provide a small delay and fire an event to let the loaded section's JS initialize itself
    setTimeout(() => {
        // Parse query string for project slug: #proyecto?id=byd-club -> 'byd-club'
        const queryString = hash.includes('?') ? hash.split('?')[1] : '';
        const params = new URLSearchParams(queryString);
        const projectId = params.get('id') || null;

        window.dispatchEvent(new CustomEvent('section-loaded', {
            detail: { section: sectionName, projectId }
        }));
    }, 50);
}

// Global helper for extracting Vimeo IDs
function extractVimeoId(input) {
    if (!input || input === 'PENDIENTE') return null;
    // Regex para encontrar secuencias de dígitos después de vimeo.com/ o video/
    const regex = /(?:vimeo\.com\/(?:video\/)?|vimeo\.com\/[a-zA-Z0-9_-]+\/|player\.vimeo\.com\/video\/)(\d+)/;
    const match = input.match(regex);
    return match ? match[1] : null;
}

// --- Global Security Module ---
// 1. Bloquear el menú contextual (Clic derecho)
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// 2. Bloquear atajos de teclado comunes para guardar o inspeccionar
document.addEventListener('keydown', function (e) {
    // Bloquear Ctrl+S (Guardar página) o Cmd+S en Mac
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
    }
    // Bloquear Ctrl+P (Imprimir página) o Cmd+P
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
    }
});

// 3. Prevenir arrastre nativo por si el CSS falla en navegadores antiguos
document.addEventListener('dragstart', function (e) {
    if (e.target.nodeName.toUpperCase() === "IMG" || e.target.nodeName.toUpperCase() === "A") {
        e.preventDefault();
    }
});
