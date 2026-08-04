async function renderProjects() {
    if (!main) return;
    destroyHomeEffects();

    try {
        const response = await fetch('./portfolio/posts/index.json');
        const data = await response.json();

        const projects = data.posts
            .filter(p => p.category === 'project')
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        let projectsHTML = '<div id="projects-box">';

        projects.forEach(post => {
            const [y, m] = post.date.split('-');
            const month = new Date(y, m - 1).toLocaleString('en', { month: 'short' }) + '.';
            const year = y;

            projectsHTML += `
        <div class="proj-card" data-category="${post.category}" data-slug="${post.slug}">
          <img class="proj-img" src="${post.thumbnail}" alt="${post.title}">
          <div class="content-box">
            <span class="proj-title" data-text="${post.title}">${post.title}</span>
            <p class="proj-desc">${post.summary}</p>
            <span class="proj-link">Detail</span>
          </div>
          <div class="date-box">
            <span class="proj-month">${month}</span>
            <span class="proj-year">${year}</span>
          </div>
        </div>`;
        });

        projectsHTML += '</div>';

        const content = htmlToFragment(projectsHTML);
        main.replaceChildren(content);

        main.querySelectorAll('.proj-card').forEach(card => {
            card.addEventListener('click', () => {
                navigate(`#post/${card.dataset.category}/${card.dataset.slug}`);
            });
        });

        playMainAnimation();

        const start = {r: 238, g: 174, b: 202};
        const end = {r: 148, g: 187, b: 233};
        changeListItemColor(".date-box", start, end, "--date-color");

    } catch (error) {
        console.error('Error loading projects:', error);
        main.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
    }
}
