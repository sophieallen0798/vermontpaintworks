// Get current page filename from URL
function getCurrentPage() {
  const path = window.location.pathname;
  let page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  return page.includes('.') ? page : page + '.html';
}

// Set active class on current nav link
function setActiveNavLink() {
  const currentPage = getCurrentPage();
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    const linkPage = href.substring(href.lastIndexOf('/') + 1);
    link.classList.toggle('active', currentPage === linkPage);
  });
}

// Mobile menu functionality
function initMobileMenu() {
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
}

// Initialize navigation
function initNavigation() {
  initMobileMenu();
  setActiveNavLink();
}

// Expose for include.js
window.initNavigation = initNavigation;

// Run on DOM ready
document.addEventListener('DOMContentLoaded', initNavigation);

// Update active link after view transitions
document.addEventListener('pageswap', setActiveNavLink);
