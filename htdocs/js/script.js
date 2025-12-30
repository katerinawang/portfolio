let typedInstance = null;

const main = document.querySelector("main");
const nav = document.querySelector("nav");

window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 0);
});

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
          <img class="proj-img" src="${project.imgSrc}" alt="${project.alt}">
          <div class="content-box">
            <span class="proj-title" data-text="${project.title}">${project.title}</span>
            <p class="proj-desc">${project.description}</p>
            <a href="${project.link}" class="proj-link">${project.linkText}</a>
          </div>
          <div class="date-box">
            <span class="proj-month">${project.month}</span>
            <span class="proj-year">${project.year}</span>
          </div>
        </div>
      `;
        });

        projectsHTML += '</div>';

        // Convert to DOM elements and replace content
        const content = htmlToFragment(projectsHTML);
        main.replaceChildren(content);

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

// ---------- Initial load ----------
window.addEventListener("load", async () => {
    await renderHome();
});
