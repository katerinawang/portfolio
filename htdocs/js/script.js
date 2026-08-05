let projectLightbox = null;
let videoLightbox = null;

const main = document.querySelector("main");
const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 0);
});

// ---------- Routing ----------
function navigate(path) {
    if (path.startsWith('#')) path = '/' + path.slice(1);
    if (path === location.pathname) {
        handleRoute(path);
    } else {
        history.pushState(null, '', path);
        handleRoute(path);
    }
}

async function handleRoute(path) {
    const parts = path.replace(/^\//, '').split('/');
    const page = parts[0] || 'home';

    if (page === 'post' && parts[1] && parts[2]) {
        await renderPost(parts[1], parts[2]);
    } else if (page === 'projects') {
        await renderProjects();
    } else if (page === 'experience') {
        await renderExperience();
    } else if (page === 'blog') {
        await renderBlog();
    } else {
        await renderHome();
    }
}

window.addEventListener('popstate', () => handleRoute(location.pathname));

nav?.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const path = btn.id === 'home' ? '/' : '/' + btn.id;
    navigate(path);
});

// ---------- Utilities ----------
async function fetchHtmlAsText(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.text();
}

function htmlToFragment(html) {
    const tpl = document.createElement("template");
    tpl.innerHTML = html.trim();
    return tpl.content;
}

function changeListItemColor(element, start, end, property) {
    const el = document.querySelectorAll(element);
    const count = el.length;

    el.forEach((e, i) => {
        const t = count === 1 ? 0 : i / (count - 1);

        const r = Math.round(start.r + (end.r - start.r) * t);
        const g = Math.round(start.g + (end.g - start.g) * t);
        const b = Math.round(start.b + (end.b - start.b) * t);

        e.style.setProperty(property, `rgb(${r}, ${g}, ${b})`);
    });
}

function initVideoLightbox() {
    if (videoLightbox) videoLightbox.destroy();

    videoLightbox = GLightbox({
        selector: '.glightbox-video',
        autoplayVideos: true,
        closeButton: false,
        closeOnOutsideClick: true,
        touchNavigation: true,
    });
}

function playMainAnimation() {
    main.classList.remove("fade-in");
    void main.offsetWidth;
    main.classList.add("fade-in");
}

function initProjectLightbox() {
    if (projectLightbox) projectLightbox.destroy();

    projectLightbox = GLightbox({
        selector: '.glightbox[data-gallery="projects"]',
        openEffect: 'zoom',
        closeEffect: 'zoom',
        slideEffect: 'slide',
        touchNavigation: true,
        loop: false,
        closeOnOutsideClick: true,
        closeButton: false,
        zoomable: false,
        draggable: false,
    });

    projectLightbox.on('slide_after_load', ({slideNode}) => {
        const media = slideNode.querySelector('.gslide-media');
        if (!media) return;

        media.style.cursor = 'zoom-out';
        media.onclick = () => projectLightbox.close();
    });
}

// ---------- Initial load ----------
window.addEventListener("load", () => handleRoute(location.pathname));
