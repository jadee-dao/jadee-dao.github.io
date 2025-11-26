document.addEventListener('DOMContentLoaded', () => {
    // loadNews is now called explicitly in the HTML files with/without limit
    loadPublications();
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
