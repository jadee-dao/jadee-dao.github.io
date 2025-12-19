document.addEventListener('DOMContentLoaded', () => {
    // loadNews is now called explicitly in the HTML files with/without limit
    loadPublications();
    loadIndustry();
});

async function loadNews(limit = null) {
    const newsList = document.getElementById('news-list');
    if (!newsList) return; // Guard clause in case element doesn't exist

    try {
        const response = await fetch('data/news.json');
        const newsData = await response.json();

        newsList.innerHTML = ''; // Clear loading text

        // Apply limit if provided
        const itemsToDisplay = limit ? newsData.slice(0, limit) : newsData;

        itemsToDisplay.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="news-date">${item.date}</span>
                <span class="news-content">${parseMarkdown(item.content)}</span>
            `;
            newsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading news:', error);
        newsList.innerHTML = '<li>Error loading news.</li>';
    }
}

async function loadIndustry() {
    const list = document.getElementById('industry-list');
    try {
        const response = await fetch('data/industry.json');
        const data = await response.json();

        list.innerHTML = '';

        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'industry-item';

            // Allow clicking the whole card if a link exists
            // if (item.link) {
            //    div.onclick = () => window.open(item.link, '_blank');
            //    div.style.cursor = 'pointer';
            // }

            div.innerHTML = `
                <div class="industry-logo-container">
                    ${item.logos
                    ? item.logos.map(logo => `<img src="${logo}" alt="${item.company}" class="industry-logo">`).join('')
                    : `<img src="${item.logo}" alt="${item.company}" class="industry-logo" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iI2YwZjBmMCIgLz48L3N2Zz4='">`
                }
                </div>
                <div class="industry-content">
                    <div class="industry-header">
                        <span class="industry-company">${item.company}</span>
                        <span class="industry-year">${item.year}</span>
                    </div>
                    <span class="industry-team">${item.team}</span>
                    <p class="industry-desc">${item.description}</p>
                    ${item.link ? `<a href="${item.link}" target="_blank" class="industry-link">Link to ${item.link_text || 'Website'} <i class="fas fa-arrow-right"></i></a>` : ''}
                </div>
            `;
            list.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading industry:', error);
        list.innerHTML = '<p>Error loading industry experience.</p>';
    }
}

async function loadPublications() {
    const pubList = document.getElementById('publications-list');
    try {
        const response = await fetch('data/publications.json');
        const pubsData = await response.json();

        pubList.innerHTML = ''; // Clear loading text

        pubsData.forEach(pub => {
            const div = document.createElement('div');
            div.className = 'publication-item';

            // Format links
            const linksHtml = pub.links ? pub.links.map(link =>
                `<a href="${link.url}">${link.name}</a>`
            ).join('') : '';

            div.innerHTML = `
                <div class="pub-image-container">
                    <img src="${pub.image}" alt="${pub.title}" class="pub-image">
                </div>
                <div class="pub-content">
                    <span class="pub-title">${pub.title}</span>
                    <span class="pub-authors">${pub.authors}</span>
                    <div class="pub-meta">
                        <span class="pub-venue">${pub.venue}</span>
                        <span class="pub-medium">${pub.medium}</span>
                        <span class="pub-year">${pub.year}</span>
                    </div>
                    <div class="pub-links">${linksHtml}</div>
                </div>
            `;
            pubList.appendChild(div);
        });
    } catch (error) {
        console.error('Error loading publications:', error);
        pubList.innerHTML = '<p>Error loading publications.</p>';
    }
}

// Simple markdown parser for bold and links
function parseMarkdown(text) {
    // Bold: **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Links: [text](url)
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    return text;
}
