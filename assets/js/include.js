async function includeHTML(selector, file) {
  const element = document.querySelector(selector);
  if (!element) return;

  const response = await fetch(file);
  element.innerHTML = await response.text();
}

// Load shared components
includeHTML("#header", "/partials/header.html");
includeHTML("#footer", "/partials/footer.html");
