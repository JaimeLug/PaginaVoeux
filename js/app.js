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
    '#proyecto': 'proyecto'
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

    // We dispatch a custom event to allow previous section's JS to cleanup if needed (like timers)
    window.dispatchEvent(new Event('section-unload'));

    // Path structure for sections
    const htmlPath = `secciones/${sectionName}/${sectionName}.html`;
    const cssPath = `secciones/${sectionName}/${sectionName}.css`;
    const jsPath = `secciones/${sectionName}/${sectionName}.js`;

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
