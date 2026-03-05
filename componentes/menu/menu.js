// Wait briefly for the DOM to be fully injected before binding events
setTimeout(() => {
    const menuBtn = document.getElementById('open-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const sideMenu = document.getElementById('side-menu');

    if (menuBtn && sideMenu) {
        menuBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
        });
    }

    if (closeBtn && sideMenu) {
        closeBtn.addEventListener('click', () => {
            sideMenu.classList.remove('open');
        });
    }

    // Close menu when a link inside it is clicked
    const menuLinks = document.querySelectorAll('.side-menu-item a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            sideMenu.classList.remove('open');
        });
    });
}, 100);
