// js/widgets/HorizontalVideoWidget.js
window.HorizontalVideoWidget = function (data) {
    if (!data || !data.vimeoId) return '';

    return `
        <div class="widget horizontal-video-widget">
            <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
                <iframe src="https://player.vimeo.com/video/${data.vimeoId}?background=1&autoplay=1&muted=1&loop=1" 
                    frameborder="0" 
                    allow="autoplay; fullscreen; picture-in-picture" 
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;" 
                    title="Horizontal Video">
                </iframe>
            </div>
        </div>
    `;
};
