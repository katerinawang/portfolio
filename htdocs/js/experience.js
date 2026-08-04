async function renderExperience() {
    if (!main) return;
    destroyHomeEffects();

    try {
        const response = await fetch('./portfolio/exp.json');
        const data = await response.json();

        let expHTML = '<div class="timeline-box">';

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

        const content = htmlToFragment(expHTML);
        main.replaceChildren(content);
        playMainAnimation();

        const start = {r: 238, g: 174, b: 202};
        const end = {r: 148, g: 187, b: 233};
        changeListItemColor(".timeline", start, end, "--dot-color");

    } catch (error) {
        console.error('Error loading experience:', error);
        main.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
    }
}
