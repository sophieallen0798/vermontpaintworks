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

// Set active nav link and apply page-specific header styles after partials load
function initNavigation() {
    // Highlight the current page's nav link.
    // Normalise both sides by stripping a trailing .html so the comparison
    // is robust whether the server uses clean URLs (/about) or not (/about.html).
    const rawFile = window.location.pathname.split('/').pop() || 'index.html';
    const filename = rawFile.replace(/\.html$/, '') || 'index';
    document.querySelectorAll('.nav-links li').forEach(li => {
        const a = li.querySelector('a');
        if (!a) return;
        const linkFile = a.getAttribute('href').split('/').pop().replace(/\.html$/, '') || 'index';
        if (linkFile === filename) {
            li.classList.add('active-tab');
        }
    });

    // Apply transparent/overlay header for the home page
    if (document.body.dataset.header === 'index') {
        const header = document.querySelector('.site-header');
        if (header) {
            header.style.backgroundColor = 'transparent';
            header.style.position = 'absolute';
        }

        // Wrap nav-links <ul> in a .nav-links-index div (used by CSS)
        const navLinksUl = document.querySelector('.nav-links');
        if (navLinksUl && !navLinksUl.parentElement.classList.contains('nav-links-index')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'nav-links-index';
            navLinksUl.parentElement.insertBefore(wrapper, navLinksUl);
            wrapper.appendChild(navLinksUl);
        }

        // Use background colour for nav links, hamburger spans, and logo text
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.add('nav-desktop-color'));
        document.querySelectorAll('.mobile-menu-toggle span').forEach(span => {
            span.style.backgroundColor = 'var(--color-bg)';
        });
        const logoLink = document.querySelector('.logo a');
        if (logoLink) logoLink.style.color = 'var(--color-bg)';
    }

    // Re-initialise the mobile menu now that the header is in the DOM
    if (window.initMobileMenu) {
        window.initMobileMenu();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Preload common partials for faster subsequent navigation
    await Promise.all([
        preloadPartial('partials/header.html'),
        preloadPartial('partials/footer.html')
    ]);

    await loadPartials();

    initNavigation();
});
