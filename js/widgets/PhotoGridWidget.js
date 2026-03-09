// js/widgets/PhotoGridWidget.js
window.PhotoGridWidget = function (data) {
    if (!data || !data.images || data.images.length === 0) return '';

    const gridHtml = data.images.map(imgSrc => {
        // Asume path de formato: "imagenes/<slug>/foto.jpg"
        // Construimos el path para thumbs: "imagenes/<slug>/thumbs/foto.jpg"
        const parts = imgSrc.split('/');
        let thumbSrc = imgSrc;
        if (parts.length >= 3 && parts[parts.length - 2] !== 'thumbs') {
            const fileName = parts.pop();
            thumbSrc = [...parts, 'thumbs', fileName].join('/');
        }

        return `
            <div class="grid-item" style="overflow: hidden; aspect-ratio: 1/1; cursor: pointer;" onclick="openLightbox('${imgSrc}', 'image')">
                <img src="${thumbSrc}" onerror="this.onerror=null; this.src='${imgSrc}';" alt="Project Image" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
            </div>
        `;
    }).join('');

    return `
        <div class="widget photo-grid-widget" style="padding: 2rem 0;">
            <div class="grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
                ${gridHtml}
            </div>
        </div>
    `;
};
