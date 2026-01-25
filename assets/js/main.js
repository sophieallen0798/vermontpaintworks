function setActiveNavLink(navLinks) {
    const links = navLinks.querySelectorAll('a');
    const currentPath = window.location.pathname;

    links.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        const isHome = linkPath === '/' && (currentPath === '/' || currentPath === '/index.html');
        const isMatch = isHome || linkPath === currentPath;

        if (isMatch) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

function initMobileMenu(menuToggle, navLinks) {
    if (menuToggle.dataset.navInitialized === 'true') {
        return;
    }

    menuToggle.dataset.navInitialized = 'true';

    menuToggle.addEventListener('click', function() {
        const isOpen = navLinks.classList.toggle('active');
        this.classList.toggle('active');
        this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', function(event) {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

window.initNavigation = function initNavigation() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) {
        return;
    }

    initMobileMenu(menuToggle, navLinks);
    setActiveNavLink(navLinks);
};

document.addEventListener('DOMContentLoaded', function() {
    window.initNavigation();
});
