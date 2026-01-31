// Navigation functionality
const Navigation = {
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
        return page.includes('.') ? page : page + '.html';
    },

    setActiveNavLink() {
        const currentPage = this.getCurrentPage();
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkPage = href.substring(href.lastIndexOf('/') + 1);
            link.classList.toggle('active', currentPage === linkPage);
        });
    },

    initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (!menuToggle || !navLinks || menuToggle.dataset.initialized) return;
        menuToggle.dataset.initialized = 'true';

        const closeMenu = () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        };

        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    },

    init() {
        this.initMobileMenu();
        this.setActiveNavLink();
    }
};

// Expose for include.js
window.initNavigation = () => Navigation.init();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => Navigation.init());
