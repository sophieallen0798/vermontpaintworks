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

  // Generic initializer for sets (portfolio or artwork)
  function initSets(sets, mapping) {
    if (!Array.isArray(sets)) return;

    sets.forEach((set) => {
      const containerId = (mapping && mapping[set.title]) || `${set.dir}-container`;
      const container = document.getElementById(containerId);
      const slideshowSlot = document.getElementById(`${set.dir}-slideshow`);
      if (!container && !slideshowSlot) return;

      const images = [];

      if (Array.isArray(set.before)) {
        set.before.forEach((filename) =>
          images.push({ src: `assets/images/${set.dir}/${filename}`, alt: createAltText(filename, set.title), label: 'Before' }),
        );
      }

      if (Array.isArray(set.after)) {
        set.after.forEach((filename) =>
          images.push({ src: `assets/images/${set.dir}/${filename}`, alt: createAltText(filename, set.title), label: 'After' }),
        );
      }

      if (Array.isArray(set.images)) {
        set.images.forEach((filename) =>
          images.push({ src: `assets/images/${set.dir}/${filename}`, alt: createAltText(filename, set.title), label: null }),
        );
      }

      if (container) container.innerHTML = '';
      if (images.length > 0) createSlideshow(images, set.title, slideshowSlot || container, set.dir);

      if (container && !container.classList.contains('slideshow-slot')) renderImageGallery(images, set.title, container);
    });
  }

  function initPortfolio(sets) {
    const mapping = {
      'Church Sanctuary Painting': 'church-painting-container',
      'Tiny House': 'tiny-house-container',
      'Exterior House Painting': 'exterior-house-painting-container',
      'Porch Restoration': 'porch-restoration-container',
      'Stairs': 'stairs-container',
    };
    initSets(sets, mapping);
  }

  // Create a self-contained slideshow for a set and append it to the parent container
  function createSlideshow(images, title, parentContainer, uid) {
    const slideshowWrapper = document.createElement("div");
    slideshowWrapper.className = "slideshow-wrapper";

    const slideshowId = `slideshow-${uid}`;

    const container = document.createElement("div");
    container.className = "slideshow-container";
    container.id = slideshowId;

    images.forEach((imgData, i) => {
      const slide = document.createElement("div");
      slide.className = "mySlides fade";

      const numberText = document.createElement("div");
      numberText.className = "numbertext";
      numberText.textContent = `${i + 1} / ${images.length}`;

      const img = document.createElement("img");
      img.src = imgData.src;
      img.alt = imgData.alt;
      img.style.width = "100%";
      img.loading = "lazy";
      img.decoding = "async";

      const caption = document.createElement("div");
      caption.className = "slide-text";
      caption.textContent = imgData.label ? `${title} - ${imgData.label}` : title;

      // Open lightbox on click (image or entire slide)
      img.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(images, i);
      });
      slide.style.cursor = "pointer";
      slide.addEventListener("click", () => openLightbox(images, i));

      slide.appendChild(numberText);
      slide.appendChild(img);
      slide.appendChild(caption);
      container.appendChild(slide);
    });

    const prev = document.createElement("a");
    prev.className = "prev";
    prev.href = "javascript:void(0)";
    prev.setAttribute("aria-label", `${title} previous`);
    prev.innerHTML = "&#10094;";

    const next = document.createElement("a");
    next.className = "next";
    next.href = "javascript:void(0)";
    next.setAttribute("aria-label", `${title} next`);
    next.innerHTML = "&#10095;";

    container.appendChild(prev);
    container.appendChild(next);

    // Dots
    const dotsWrap = document.createElement("div");
    dotsWrap.className = "slideshow-dots";
    dotsWrap.style.textAlign = "center";

    const dots = [];
    images.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.className = "dot";
      dot.setAttribute("role", "button");
      dot.setAttribute("tabindex", "0");
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        showSlide(i + 1);
      });
      dot.addEventListener("keypress", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
          showSlide(i + 1);
        }
      });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    slideshowWrapper.appendChild(container);
    slideshowWrapper.appendChild(dotsWrap);

    parentContainer.appendChild(slideshowWrapper);

    // slideshow state and controls (closure per slideshow)
    let slideIndex = 1;

    function showSlide(n) {
      if (n > images.length) slideIndex = 1;
      else if (n < 1) slideIndex = images.length;
      else slideIndex = n;

      const slides = container.getElementsByClassName("mySlides");
      for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
      for (let i = 0; i < dots.length; i++)
        dots[i].className = dots[i].className.replace(" active", "");
      slides[slideIndex - 1].style.display = "block";
      dots[slideIndex - 1].className += " active";
    }

    function plusSlides(n) {
      showSlide(slideIndex + n);
    }

    prev.addEventListener("click", (e) => {
      e.stopPropagation();
      plusSlides(-1);
    });
    next.addEventListener("click", (e) => {
      e.stopPropagation();
      plusSlides(1);
    });

    // keyboard nav for slideshow
    container.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") plusSlides(-1);
      if (e.key === "ArrowRight") plusSlides(1);
    });

    // initialize
    showSlide(slideIndex);
  }

  // Initialize art gallery
    function initGallery() {
      const mapping = {
        'Chalk Art': 'chalk-art-container',
        'Tree Mural': 'tree-mural-container',
        'Wall Art': 'wall-art-container',
        'Stage Sets': 'stage-sets-container',
      };
      initSets(artSets, mapping);
    }

  // init after DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initPortfolio(portfolioSets);
      initGallery();
    });
  } else {
    initPortfolio(portfolioSets);
    initGallery();
  }
})();
