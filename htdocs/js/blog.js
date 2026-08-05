let blogPosts = [];
let activeTag = null;

async function renderBlog() {
    if (!main) return;
    destroyHomeEffects();

    try {
        const response = await fetch('/portfolio/posts/index.json');
        const data = await response.json();

        blogPosts = data.posts
            .filter(p => p.category === 'blog')
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        const topTags = getTopTags(blogPosts, 5);

        let blogHTML = '<div class="blog-container">';

        blogHTML += '<div class="blog-header">';
        blogHTML += '<div class="blog-tags" id="blog-tags">';
        topTags.forEach(tag => {
            blogHTML += `<span class="blog-tag-chip" data-tag="${tag}">${tag}</span>`;
        });
        blogHTML += '</div>';
        blogHTML += '<input type="text" id="blog-search" class="blog-search" placeholder="Search posts...">';
        blogHTML += '</div>';

        blogHTML += '<div class="blog-timeline" id="blog-timeline">';
        blogHTML += buildBlogTimeline(blogPosts, null, null);
        blogHTML += '</div>';

        blogHTML += '</div>';

        const content = htmlToFragment(blogHTML);
        main.replaceChildren(content);

        initBlogEvents();
        playMainAnimation();

    } catch (error) {
        console.error('Error loading blog:', error);
        main.innerHTML = '<p>Failed to load blog. Please try again later.</p>';
    }
}

function getTopTags(posts, count) {
    const freq = {};
    posts.forEach(p => (p.tags || []).forEach(t => { freq[t] = (freq[t] || 0) + 1; }));
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, count)
        .map(e => e[0]);
}

function buildBlogTimeline(posts, searchQuery, filterTag) {
    let filtered = posts;

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.summary.toLowerCase().includes(q)
        );
    }

    if (filterTag) {
        filtered = filtered.filter(p => (p.tags || []).includes(filterTag));
    }

    if (filtered.length === 0) {
        return '<p class="blog-empty">No posts found.</p>';
    }

    const isSearching = searchQuery || filterTag;

    if (isSearching) {
        return buildFlatList(filtered);
    }

    return buildYearTimeline(filtered);
}

function buildFlatList(posts) {
    let html = '<div class="blog-year-group">';
    posts.forEach(post => {
        html += buildBlogEntry(post);
    });
    html += '</div>';
    return html;
}

function buildYearTimeline(posts) {
    const byYear = {};
    posts.forEach(p => {
        const [y] = p.date.split('-');
        if (!byYear[y]) byYear[y] = [];
        byYear[y].push(p);
    });

    const years = Object.keys(byYear).sort((a, b) => b - a);
    const latestYear = years[0];

    let html = '';

    years.forEach(year => {
        const isLatest = year === latestYear;
        const expanded = isLatest;

        html += `<div class="blog-year" data-year="${year}">`;
        html += `<div class="blog-year-label${expanded ? ' expanded' : ''}" data-year="${year}">`;
        html += `<span class="blog-year-arrow">${expanded ? '<i class="fa-solid fa-angle-down"></i>' : '<i class="fa-solid fa-angle-right"></i>'}</span>`;
        html += `<span>${year}</span>`;
        html += `<span class="blog-year-count">${byYear[year].length} post${byYear[year].length > 1 ? 's' : ''}</span>`;
        html += '</div>';

        html += `<div class="blog-year-content" style="display: ${expanded ? 'block' : 'none'}">`;

        const byMonth = {};
        byYear[year].forEach(p => {
            const [, m] = p.date.split('-');
            const monthName = new Date(year, m - 1).toLocaleString('en', { month: 'long' });
            if (!byMonth[monthName]) byMonth[monthName] = [];
            byMonth[monthName].push(p);
        });

        const months = Object.keys(byMonth);

        months.forEach(month => {
            html += `<div class="blog-month-group">`;
            html += `<div class="blog-month-label">${month}</div>`;
            byMonth[month].forEach(post => {
                html += buildBlogEntry(post);
            });
            html += '</div>';
        });

        html += '</div></div>';
    });

    return html;
}

function buildBlogEntry(post) {
    let html = `<div class="blog-entry" data-category="${post.category}" data-slug="${post.slug}">`;
    html += `<span class="blog-entry-title" data-text="${post.title}">${post.title}</span>`;
    html += '<span class="blog-entry-tags">';
    (post.tags || []).forEach(tag => {
        html += `<span class="tag">${tag}</span>`;
    });
    html += '</span></div>';
    return html;
}

function initBlogEvents() {
    const search = document.getElementById('blog-search');
    const timeline = document.getElementById('blog-timeline');
    const tagContainer = document.getElementById('blog-tags');

    search?.addEventListener('input', () => {
        timeline.innerHTML = buildBlogTimeline(blogPosts, search.value.trim(), activeTag);
        bindBlogEntryClicks();
        bindYearToggle();
    });

    tagContainer?.addEventListener('click', (e) => {
        const chip = e.target.closest('.blog-tag-chip');
        if (!chip) return;

        const tag = chip.dataset.tag;

        if (activeTag === tag) {
            activeTag = null;
            chip.classList.remove('active');
        } else {
            tagContainer.querySelectorAll('.blog-tag-chip').forEach(c => c.classList.remove('active'));
            activeTag = tag;
            chip.classList.add('active');
        }

        timeline.innerHTML = buildBlogTimeline(blogPosts, search?.value.trim(), activeTag);
        bindBlogEntryClicks();
        bindYearToggle();
    });

    bindBlogEntryClicks();
    bindYearToggle();
}

function bindBlogEntryClicks() {
    document.querySelectorAll('.blog-entry').forEach(entry => {
        entry.addEventListener('click', () => {
            navigate(`/post/${entry.dataset.category}/${entry.dataset.slug}`);
        });
    });
}

function bindYearToggle() {
    document.querySelectorAll('.blog-year-label').forEach(label => {
        label.addEventListener('click', () => {
            const year = label.dataset.year;
            const allYears = document.querySelectorAll('.blog-year');

            allYears.forEach(yEl => {
                const yLabel = yEl.querySelector('.blog-year-label');
                const yContent = yEl.querySelector('.blog-year-content');
                const arrow = yLabel.querySelector('.blog-year-arrow');

                if (yEl.dataset.year === year) {
                    const isOpen = yContent.style.display !== 'none';
                    yContent.style.display = isOpen ? 'none' : 'block';
                    yLabel.classList.toggle('expanded', !isOpen);
                    arrow.innerHTML = isOpen ? '<i class="fa-solid fa-angle-right"></i>' : '<i class="fa-solid fa-angle-down"></i>';
                } else {
                    yContent.style.display = 'none';
                    yLabel.classList.remove('expanded');
                    arrow.innerHTML = '<i class="fa-solid fa-angle-right"></i>';
                }
            });
        });
    });
}
