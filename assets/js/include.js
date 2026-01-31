// Cache to store loaded partials and prevent flashing
const partialCache = new Map();

// Preload a partial into cache
async function preloadPartial(filePath) {
    if (partialCache.has(filePath)) return;
    
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const html = await response.text();
            partialCache.set(filePath, html);
        }
    } catch (error) {
        console.error(`Failed to preload ${filePath}:`, error);
    }
}

// Load partials from cache or fetch if needed
async function loadPartials() {
    const includeElements = document.querySelectorAll('[data-include]');
    if (!includeElements.length) return;

    const loadPromises = Array.from(includeElements).map(async (element) => {
        const filePath = element.getAttribute('data-include');
        
        try {
            let html = partialCache.get(filePath);
            
            if (!html) {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error(`Failed to load ${filePath}`);
                html = await response.text();
                partialCache.set(filePath, html);
            }
            
            element.innerHTML = html;
            element.classList.add('loaded');
        } catch (error) {
            console.error(`Error loading ${filePath}:`, error);
            element.innerHTML = '';
        }
    });

    await Promise.all(loadPromises);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Preload common partials for faster subsequent navigation
    await Promise.all([
        preloadPartial('partials/header.html'),
        preloadPartial('partials/footer.html')
    ]);
    
    await loadPartials();
    
    if (window.initNavigation) {
        window.initNavigation();
    }
});
