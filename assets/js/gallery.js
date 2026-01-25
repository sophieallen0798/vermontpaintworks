(function(){
    // Render a gallery set into the container with minimal duplication
    function renderGallerySet(set, containerId) {
        const container = document.getElementById(containerId);
        if (!container || !set || !Array.isArray(set.images)) return;

        const grid = document.createElement('div');
        grid.className = 'gallery-grid';

        set.images.forEach(filename => {
            const item = document.createElement('figure');
            item.className = 'gallery-item';

            const img = document.createElement('img');
            img.src = `/assets/images/${set.dir}/${filename}`;
            img.alt = `${set.title} — ${filename}`;
            img.loading = 'lazy';

            item.appendChild(img);
            grid.appendChild(item);
        });

        // Clear and append grid
        container.innerHTML = '';
        container.appendChild(grid);
    }

    function initGallery() {
        if (typeof artSets === 'undefined' || !Array.isArray(artSets)) return;

        const mapping = {
            'Chalk Art': 'chalk-art-container',
            'Tree Mural': 'tree-mural-container',
            'Wall Art': 'wall-art-container',
            'Stage Sets': 'stage-sets-container'
        };

        artSets.forEach(set => {
            // try to find a matching container by title mapping first, otherwise fall back to dir-based id
            const containerId = mapping[set.title] || `${set.dir}-container`;
            renderGallerySet(set, containerId);
        });
    }

    // init after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }
})();
