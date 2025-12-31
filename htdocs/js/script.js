let typedInstance = null;
let projectLightbox = null;
let videoLightbox = null;

const main = document.querySelector("main");
const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 0);
});
//
// // ---------- Image Viewer (click image to close) ----------
// let viewer = document.querySelector(".img-viewer");
// if (!viewer) {
//   viewer = document.createElement("div");
//   viewer.className = "img-viewer";
//   viewer.innerHTML = `<img class="img-viewer__img" alt="">`;
//   document.body.appendChild(viewer);
// }
//
// const viewerImg = viewer.querySelector(".img-viewer__img");
//
// function openViewer(src, alt = "") {
//   viewerImg.src = src;
//   viewerImg.alt = alt;
//   viewer.classList.add("open");
// }
//
// function closeViewer() {
//   viewer.classList.remove("open");
//   setTimeout(() => {
//     viewerImg.src = "";
//   }, 200);
// }
//
// document.addEventListener("click", (e) => {
//   const img = e.target.closest(".proj-img");
//   if (!img) return;
//   openViewer(img.currentSrc || img.src, img.alt || "");
// });
//
// viewerImg.addEventListener("click", closeViewer);
//
// document.addEventListener("keydown", (e) => {
//   if (e.key === "Escape") closeViewer();
// });
//
// viewer.addEventListener("click", (e) => {
//   if (e.target === viewer) closeViewer(); // click outside the image
// });

// ---------- Routing (single click handler = resilient) ----------
nav?.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    if (btn.id === "home") {
        await renderHome();
    } else if (btn.id === "projects") {
        renderProjects();
    } else if (btn.id === "experience") {
        renderExperience();
    }
});

// ---------- Render helpers ----------
async function renderHome() {
    if (!main) return;

    const raw = await fetchHtmlAsText("./portfolio/home.html");
    const content = htmlToFragment(raw);

    main.replaceChildren(content);

    // re-run page-specific JS
    initHomeEffects();
}

async function renderProjects() {
    if (!main) return;
    destroyHomeEffects();

    try {
        // Fetch JSON data
        const response = await fetch('./portfolio/projects.json');
        const data = await response.json();

        // Create the projects container HTML
        let projectsHTML = '<div id="projects-box">';

        // Generate HTML for each project
        data.projects.forEach(project => {
            projectsHTML += `
        <div class="proj-card">
          <a class="glightbox" href="${project.imgSrc}" data-gallery="projects" data-type="image">
            <img class="proj-img" src="${project.imgSrc}" alt="${project.alt}">
          </a>
          <div class="content-box">
            <span class="proj-title" data-text="${project.title}">${project.title}</span>
            <p class="proj-desc">${project.description}</p>
      `;
            if (project.linkText === "Video") {
                projectsHTML += `<a href="${project.link}" class="proj-link glightbox-video" data-type="video">${project.linkText}</a>`;

            }
            else {
                projectsHTML += `<a href="${project.link}" class="proj-link" target="_blank">${project.linkText}</a>`;
            }

            projectsHTML +=
                `</div>
                  <div class="date-box">
                    <span class="proj-month">${project.month}</span>
                    <span class="proj-year">${project.year}</span>
                  </div>
                </div>`;
        });

        projectsHTML += '</div>';

        // Convert to DOM elements and replace content
        const content = htmlToFragment(projectsHTML);
        main.replaceChildren(content);

        initProjectLightbox();
        initVideoLightbox();

        const start = {r: 238, g: 174, b: 202};
        const end = {r: 148, g: 187, b: 233};

        changeListItemColor(".date-box", start, end, "--date-color");

    } catch (error) {
        console.error('Error loading projects:', error);
        main.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
    }
}

async function renderExperience() {
    if (!main) return;
    destroyHomeEffects();

    try {
        // Fetch JSON data
        const response = await fetch('./portfolio/exp.json');
        const data = await response.json();

        // Create the projects container HTML
        let expHTML = '<div class="timeline-box">';

        // Generate HTML for each project
        data.exp.forEach(timeline => {
            expHTML += `
              <div class="timeline">
                <div class="timeline-date">
                  <span class="date-from">${timeline.from}</span>
                  <span class="date-to">${timeline.to}</span>
                </div>
                <div class="timeline-card">
                  <h3 class="occupation">${timeline.title}</h3>
                  <p class="company">${timeline.org}</p>
                  <p class="description">
                    ${timeline.desc}
                  </p>
            `;
            if (timeline.duties) {
                expHTML += `<ul class="duties">`;
                timeline.duties.forEach(duty => {
                    expHTML += `<li>${duty}</li>`;
                });
                expHTML += `</ul>`;
            }
            if (timeline.tags) {
                expHTML += `<div class="tags">`
                timeline.tags.forEach(tag => {
                    expHTML += `<span class="tag">${tag}</span>`;
                });
                expHTML += `</div></div></div>`;
            }
        });

        expHTML += `</div>`;

        // Convert to DOM elements and replace content
        const content = htmlToFragment(expHTML);
        main.replaceChildren(content);

        const start = {r: 238, g: 174, b: 202};
        const end = {r: 148, g: 187, b: 233};
        changeListItemColor(".timeline", start, end, "--dot-color");

    } catch (error) {
        console.error('Error loading experience:', error);
        main.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
    }
}

// ---------- Page-specific init / cleanup ----------
function initHomeEffects() {
    // Re-init Typed ONLY if elements exist
    const typedEl = document.querySelector("#typed");
    const stringsEl = document.querySelector("#typed-desc");

    if (!typedEl || !stringsEl || typeof Typed === "undefined") return;

    // If previously had one, kill it first
    if (typedInstance) typedInstance.destroy();

    typedInstance = new Typed("#typed", {
        stringsElement: "#typed-desc",
        typeSpeed: 50,
        loop: true,
        loopCount: Infinity,
    });
}

function destroyHomeEffects() {
    if (typedInstance) {
        typedInstance.destroy();
        typedInstance = null;
    }
}

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

function initProjectLightbox() {
    if (projectLightbox) projectLightbox.destroy(); // important for rerenders

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
window.addEventListener("load", async () => {
    await renderHome();
});
