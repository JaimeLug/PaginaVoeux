// js/widgets/PhotoGridWidget.js
window.PhotoGridWidget = function (data) {
    if (!data || !data.images || data.images.length === 0) return '';

    const gridHtml = data.images.map(imgSrc => {
        return `
            <div class="grid-item" style="overflow: hidden; aspect-ratio: 1/1;">
                <img src="${imgSrc}" alt="Project Image" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
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
