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
                    ${this.images.map((img, index) => `
                        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <img src="${img}" alt="Project image ${index + 1}" loading="lazy">
                        </div>
                    `).join('')}
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

/**
 * Create a single carousel item
 */
function createCarouselItem(data, basePath) {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    
    const title = document.createElement('h4');
    title.textContent = data.title;
    item.appendChild(title);

    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel';
    item.appendChild(carouselContainer);

    const images = data.images.map(img => `${basePath}${data.dir}/${img}`);
    new Carousel(carouselContainer, images);

    return item;
}

/**
 * Create a before/after comparison item with two carousels
 */
function createBeforeAfterItem(data, basePath) {
    const item = document.createElement('div');
    item.className = 'before-after-item';
    
    const title = document.createElement('h4');
    title.textContent = data.title;
    item.appendChild(title);

    const comparison = document.createElement('div');
    comparison.className = 'before-after-comparison';

    // Before carousel
    const beforeSection = document.createElement('div');
    beforeSection.className = 'before-after-section';
    const beforeLabel = document.createElement('span');
    beforeLabel.className = 'before-after-label';
    beforeLabel.textContent = 'Before';
    beforeSection.appendChild(beforeLabel);
    
    const beforeCarousel = document.createElement('div');
    beforeCarousel.className = 'carousel';
    beforeSection.appendChild(beforeCarousel);
    
    const beforeImages = data.before.map(img => `${basePath}${data.dir}/${img}`);
    new Carousel(beforeCarousel, beforeImages);

    // After carousel
    const afterSection = document.createElement('div');
    afterSection.className = 'before-after-section';
    const afterLabel = document.createElement('span');
    afterLabel.className = 'before-after-label';
    afterLabel.textContent = 'After';
    afterSection.appendChild(afterLabel);
    
    const afterCarousel = document.createElement('div');
    afterCarousel.className = 'carousel';
    afterSection.appendChild(afterCarousel);
    
    const afterImages = data.after.map(img => `${basePath}${data.dir}/${img}`);
    new Carousel(afterCarousel, afterImages);

    comparison.appendChild(beforeSection);
    comparison.appendChild(afterSection);
    item.appendChild(comparison);

    return item;
}

/**
 * Initialize portfolio carousels
 */
function initPortfolio() {
    if (!window.portfolioData) {
        console.error('Portfolio data not found');
        return;
    }

    const basePath = '/assets/images/';
    const { finishedSets, beforeAfterSets } = window.portfolioData;

    // Render finished project carousels
    const finishedContainer = document.getElementById('finished-carousels');
    if (finishedContainer && finishedSets) {
        finishedSets.forEach(set => {
            const item = createCarouselItem(set, basePath);
            finishedContainer.appendChild(item);
        });
    }

    // Render before/after comparison carousels
    const beforeAfterContainer = document.getElementById('before-after-container');
    if (beforeAfterContainer && beforeAfterSets) {
        beforeAfterSets.forEach(set => {
            const item = createBeforeAfterItem(set, basePath);
            beforeAfterContainer.appendChild(item);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}
