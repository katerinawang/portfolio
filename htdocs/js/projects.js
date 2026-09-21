async function renderProjects() {
    if (!main) return;
    destroyHomeEffects();

    try {
        const response = await fetch('/portfolio/posts/index.json');
        const data = await response.json();

        const projects = data.posts
            .filter(p => p.category === 'project')
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        // group by year
        const grouped = {};
        projects.forEach(post => {
            const year = post.date.split('-')[0];
            if (!grouped[year]) grouped[year] = [];
            grouped[year].push(post);
        });

        let html = '<div id="projects-box">';

        for (const year of Object.keys(grouped).sort((a, b) => b - a)) {
            html += `<div class="timeline-year">${year}</div>`;

            grouped[year].forEach(post => {
                const [y, m] = post.date.split('-');
                const monthLabel = new Date(y, m - 1).toLocaleString('en', { month: 'short' });

                const tagsHTML = (post.tags || []).slice(0, 4).map(t =>
                    `<span class="proj-tag">${t}</span>`
                ).join('');

                html += `
          <div class="proj-item" data-category="${post.category}" data-slug="${post.slug}">
            <span class="proj-date">${monthLabel}</span>
            <span class="proj-name">${post.title}</span>
            <div class="proj-tags">${tagsHTML}</div>
          </div>`;
            });
        }

        html += '</div>';

        const content = htmlToFragment(html);
        main.replaceChildren(content);

        main.querySelectorAll('.proj-item').forEach(item => {
            item.addEventListener('click', () => {
                navigate(`/post/${item.dataset.category}/${item.dataset.slug}`);
            });
        });

        playMainAnimation();

    } catch (error) {
        console.error('Error loading projects:', error);
        main.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
    }
}
