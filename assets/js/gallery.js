(function () {
  // Create descriptive alt text from filename
  function createAltText(filename, category) {
    // Remove extension and clean up filename
    const cleanName = filename
      .replace(/\.[^/.]+$/, "") // remove extension
      .replace(/[-_]/g, " ") // replace dashes/underscores with spaces
      .replace(/\s+/g, " ") // normalize spaces
      .trim();

    // Capitalize first letter of each word
    const formatted = cleanName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return `${category} - ${formatted}`;
  }

  // Lightbox functionality
  let currentImages = [];
  let currentIndex = 0;
  let lightboxModal = null;

  function createLightbox() {
    lightboxModal = document.createElement("div");
    lightboxModal.className = "lightbox-modal";
    lightboxModal.innerHTML = `
            <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
            <button class="lightbox-nav prev" aria-label="Previous image">&lsaquo;</button>
            <button class="lightbox-nav next" aria-label="Next image">&rsaquo;</button>
            <div class="lightbox-content">
                <img src="" alt="">
            </div>
        `;
    document.body.appendChild(lightboxModal);

    const closeBtn = lightboxModal.querySelector(".lightbox-close");
    const prevBtn = lightboxModal.querySelector(".prev");
    const nextBtn = lightboxModal.querySelector(".next");

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", () => showImage(currentIndex - 1));
    nextBtn.addEventListener("click", () => showImage(currentIndex + 1));

    lightboxModal.addEventListener("click", (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightboxModal.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showImage(currentIndex - 1);
      if (e.key === "ArrowRight") showImage(currentIndex + 1);
    });
  }

  function openLightbox(images, index) {
    if (!lightboxModal) createLightbox();
    currentImages = images;
    currentIndex = index;
    showImage(index);
    lightboxModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightboxModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  function showImage(index) {
    if (index < 0) index = currentImages.length - 1;
    if (index >= currentImages.length) index = 0;
    currentIndex = index;

    const img = lightboxModal.querySelector(".lightbox-content img");
    const imageData = currentImages[index];

    img.src = imageData.src;
    img.alt = imageData.alt;

    const prevBtn = lightboxModal.querySelector(".prev");
    const nextBtn = lightboxModal.querySelector(".next");
    prevBtn.style.display = currentImages.length > 1 ? "flex" : "none";
    nextBtn.style.display = currentImages.length > 1 ? "flex" : "none";
  }

  // Unified function to render image gallery with optional labels
  function renderImageGallery(images, title, parentContainer) {
    const grid = document.createElement("div");
    grid.className = "gallery-grid";
    grid.setAttribute("role", "list");
    grid.setAttribute("aria-label", `${title} gallery`);

    images.forEach((imageData, index) => {
      const item = document.createElement("figure");
      item.className = "gallery-item";
      item.setAttribute("role", "listitem");
      item.style.cursor = "pointer";
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", `View ${imageData.alt}`);

      const img = document.createElement("img");
      img.src = imageData.src;
      img.alt = imageData.alt;
      img.loading = "lazy";
      img.decoding = "async";

      item.appendChild(img);

      // Add label if present
      if (imageData.label) {
        const label = document.createElement("span");
        label.className = "image-label";
        label.textContent = imageData.label;
        item.appendChild(label);
      }

      item.addEventListener("click", () => openLightbox(images, index));
      item.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(images, index);
        }
      });
      grid.appendChild(item);
    });

    parentContainer.appendChild(grid);
  }

  function initPortfolio() {
    if (typeof portfolioSets === "undefined" || !Array.isArray(portfolioSets)) return;

    const mapping = {
      "Tiny House": "tiny-house-container",
      "Exterior House Painting": "exterior-house-painting-container",
      "Porch Restoration": "porch-restoration-container",
      "Stairs": "stairs-container",
    };

    portfolioSets.forEach((set) => {
      const containerId = mapping[set.title] || `${set.dir}-container`;
      const container = document.getElementById(containerId);
      if (!container) return;

      const images = [];

      // combine before, after, and regular images into one array
      if (Array.isArray(set.before)) {
        set.before.forEach((filename) =>
          images.push({
            src: `assets/images/${set.dir}/${filename}`,
            alt: createAltText(filename, set.title),
            label: "Before",
          }),
        );
      }

      if (Array.isArray(set.after)) {
        set.after.forEach((filename) =>
          images.push({
            src: `assets/images/${set.dir}/${filename}`,
            alt: createAltText(filename, set.title),
            label: "After",
          }),
        );
      }

      if (Array.isArray(set.images)) {
        set.images.forEach((filename) =>
          images.push({
            src: `assets/images/${set.dir}/${filename}`,
            alt: createAltText(filename, set.title),
            label: null,
          }),
        );
      }

      container.innerHTML = "";
      renderImageGallery(images, set.title, container);
    });
  }

  // Initialize art gallery
  function initGallery() {
    if (typeof artSets === "undefined" || !Array.isArray(artSets)) return;

    const mapping = {
      "Chalk Art": "chalk-art-container",
      "Tree Mural": "tree-mural-container",
      "Wall Art": "wall-art-container",
      "Stage Sets": "stage-sets-container",
    };

    artSets.forEach((set) => {
      const containerId = mapping[set.title] || `${set.dir}-container`;
      const container = document.getElementById(containerId);
      if (!container || !Array.isArray(set.images)) return;

      const images = set.images.map((filename) => ({
        src: `assets/images/${set.dir}/${filename}`,
        alt: createAltText(filename, set.title),
        label: null,
      }));

      container.innerHTML = "";
      renderImageGallery(images, set.title, container);
    });
  }

  // init after DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initGallery();
      initPortfolio();
    });
  } else {
    initGallery();
    initPortfolio();
  }
})();
