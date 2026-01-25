document.addEventListener('DOMContentLoaded', function() {
    const includeElements = document.querySelectorAll('[data-include]');

    if (!includeElements.length) {
        if (window.initNavigation) {
            window.initNavigation();
        }
        return;
    }

    const requests = Array.from(includeElements).map((element) => {
        const filePath = element.getAttribute('data-include');

        return fetch(filePath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${filePath}`);
                }
                return response.text();
            })
            .then((html) => {
                element.innerHTML = html;
            })
            .catch(() => {
                element.innerHTML = '';
            });
    });

    Promise.all(requests).then(() => {
        if (window.initNavigation) {
            window.initNavigation();
        }
    });
});
