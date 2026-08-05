async function renderPost(category, slug) {
    if (!main) return;
    destroyHomeEffects();

    try {
        const response = await fetch(`/portfolio/posts/${category}/${slug}.json`);
        const post = await response.json();

        const [py, pm, pd] = post.date.split('-');
        const dateStr = new Date(py, pm - 1, pd || 1).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' });

        let postHTML = '<article class="post-page">';


        const backPath = category === 'blog' ? '/blog' : '/projects';
        postHTML += `<button class="post-back" onclick="navigate('${backPath}')">&#8592; Back</button>`;

        postHTML += `<h1 class="post-title">${post.title}</h1>`;
        postHTML += `<span class="post-date">${dateStr}</span>`;

        if (post.tags && post.tags.length) {
            postHTML += '<div class="tags post-tags">';
            post.tags.forEach(tag => {
                postHTML += `<span class="tag">${tag}</span>`;
            });
            postHTML += '</div>';
        }

        postHTML += '<div class="post-content">';
        postHTML += renderBlocks(post.content || []);
        postHTML += '</div>';

        postHTML += '</article>';

        const content = htmlToFragment(postHTML);
        main.replaceChildren(content);
        playMainAnimation();
        initVideoLightbox();
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
        console.error('Error loading post:', error);
        main.innerHTML = '<p>Failed to load post. Please try again later.</p>';
    }
}

function renderBlocks(blocks) {
    let html = '';
    let i = 0;
    while (i < blocks.length) {
        if (blocks[i].type === 'button') {
            html += '<div class="post-actions">';
            let hasVideo = false;
            while (i < blocks.length && blocks[i].type === 'button') {
                const b = blocks[i];
                const url = b.data.url || '#';
                const text = b.data.text || 'View';
                if (isVideoUrl(url)) {
                    html += `<a href="${url}" class="post-action glightbox-video">${text}</a>`;
                    hasVideo = true;
                } else {
                    html += `<a href="${url}" class="post-action" target="_blank">${text}</a>`;
                }
                i++;
            }
            html += '</div>';
        } else {
            html += renderBlock(blocks[i]);
            i++;
        }
    }
    return html;
}

function renderBlock(block) {
    switch (block.type) {
        case 'paragraph':
            return `<p>${block.data.text}</p>`;
        case 'header':
            return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
        case 'list': {
            const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
            const items = renderListItems(block.data.items);
            return `<${tag}>${items}</${tag}>`;
        }
        case 'code':
            return `<pre><code>${block.data.code}</code></pre>`;
        case 'quote':
            return `<blockquote><p>${block.data.text}</p>${block.data.caption ? `<cite>${block.data.caption}</cite>` : ''}</blockquote>`;
        case 'delimiter':
            return '<hr>';
        case 'image': {
            const caption = block.data.caption ? `<figcaption>${block.data.caption}</figcaption>` : '';
            return `<figure><img src="${block.data.file?.url || ''}" alt="${block.data.caption || ''}">${caption}</figure>`;
        }
        case 'pdf': {
            const pdfCaption = block.data.caption ? `<figcaption>${block.data.caption}</figcaption>` : '';
            return `<figure class="pdf-embed"><embed src="${block.data.file?.url || ''}" type="application/pdf" width="100%" height="600px">${pdfCaption}</figure>`;
        }
        default:
            return '';
    }
}

function isVideoUrl(url) {
    return /youtu\.?be|vimeo\.com/i.test(url);
}

function renderListItems(items) {
    return items.map(item => {
        const content = typeof item === 'string' ? item : item.content;
        const nested = (typeof item === 'object' && item.items?.length)
            ? `<ul>${renderListItems(item.items)}</ul>`
            : '';
        return `<li>${content}${nested}</li>`;
    }).join('');
}
