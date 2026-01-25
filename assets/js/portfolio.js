/**
 * Portfolio Carousel Implementation
 * Handles single image carousels and before/after comparison carousels
 */

class Carousel {
    constructor(container, images, options = {}) {
        this.container = container;
        this.images = images;
        this.currentIndex = 0;
        this.options = {
            autoPlay: false,
            autoPlayInterval: 5000,
            ...options
        };
        
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
        
        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }

    render() {
        this.container.innerHTML = `
            <div class="carousel-wrapper">
                <div class="carousel-slides">
                    ${this.images.map((img, index) => {
                        const src = (typeof img === 'string') ? img : img.src;
                        const label = (typeof img === 'string') ? '' : img.label || '';
                        const alt = `Project image ${index + 1}${label ? ' - ' + label : ''}`;
                        return `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <img src="${src}" alt="${alt}" loading="lazy">
                            ${label ? `<span class="slide-photo-label">${label}</span>` : ''}
                        </div>
                    `}).join('')}
                </div>
                ${this.images.length > 1 ? `
                    <button class="carousel-btn carousel-btn-prev" aria-label="Previous image">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <button class="carousel-btn carousel-btn-next" aria-label="Next image">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                    <div class="carousel-indicators">
                        ${this.images.map((_, index) => `
                            <button class="carousel-indicator ${index === 0 ? 'active' : ''}" 
                                    data-index="${index}" 
                                    aria-label="Go to image ${index + 1}">
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    attachEventListeners() {
        if (this.images.length <= 1) return;

        const prevBtn = this.container.querySelector('.carousel-btn-prev');
        const nextBtn = this.container.querySelector('.carousel-btn-next');
        const indicators = this.container.querySelectorAll('.carousel-indicator');

        prevBtn?.addEventListener('click', () => this.prev());
        nextBtn?.addEventListener('click', () => this.next());

        indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.goToSlide(index);
            });
        });

        // Keyboard navigation
        this.container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }

    goToSlide(index) {
        const slides = this.container.querySelectorAll('.carousel-slide');
        const indicators = this.container.querySelectorAll('.carousel-indicator');

        slides[this.currentIndex]?.classList.remove('active');
        indicators[this.currentIndex]?.classList.remove('active');

        this.currentIndex = (index + this.images.length) % this.images.length;

        slides[this.currentIndex]?.classList.add('active');
        indicators[this.currentIndex]?.classList.add('active');
    }

    next() {
        this.goToSlide(this.currentIndex + 1);
    }

    prev() {
        this.goToSlide(this.currentIndex - 1);
    }

    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => this.next(), this.options.autoPlayInterval);
    }

    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
        }
    }

    destroy() {
        this.stopAutoPlay();
        this.container.innerHTML = '';
    }
}

function createBeforeAfterItem(data, basePath) {
    const item = document.createElement('div');
    item.className = 'before-after-item';

    const title = document.createElement('h4');
    title.textContent = data.title;
    item.appendChild(title);

    // Combined carousel containing both before and after slides with labels
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel';
    item.appendChild(carouselContainer);

    const combined = [];
    if (Array.isArray(data.before)) {
        data.before.forEach(img => combined.push({ src: `${basePath}${data.dir}/${img}`, label: 'Before' }));
    }
    if (Array.isArray(data.after)) {
        data.after.forEach(img => combined.push({ src: `${basePath}${data.dir}/${img}`, label: 'After' }));
    }
    if (Array.isArray(data.images)) {
        data.images.map(img => combined.push({ src: `${basePath}${data.dir}/${img}` }));
    }
    new Carousel(carouselContainer, combined);

    return item;
}

function initPortfolio() {
    if (!window.portfolioData) {
        console.error('Portfolio data not found');
        return;
    }

    const basePath = '/assets/images/';
    const { streetArtSets, beforeAfterSets } = window.portfolioData;

    const beforeAfterContainer = document.getElementById('before-after-container');
    if (beforeAfterContainer && beforeAfterSets) {
        beforeAfterSets.forEach(set => {
            const item = createBeforeAfterItem(set, basePath);
            beforeAfterContainer.appendChild(item);
        });
    }
    const artContainer = document.getElementById('art-container');
    if (artContainer && streetArtSets) {
        streetArtSets.forEach(set => {
            const item = createBeforeAfterItem(set, basePath);
            artContainer.appendChild(item);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}
