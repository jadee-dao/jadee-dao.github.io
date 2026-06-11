document.addEventListener('DOMContentLoaded', () => {
    // loadNews is now called explicitly in the HTML files with/without limit
    loadPublications();
    loadIndustry();

    // Handle initial navigation based on hash
    handleNavigation();
});

// Listen for hash changes to navigate between sections
window.addEventListener('hashchange', handleNavigation);

function handleNavigation() {
    const hash = window.location.hash || '#about';
    const targetId = hash.substring(1);

    // Update active state for sections
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        // We always skip 'contact' because it might be displayed separately or at bottom
        // But the user said "i only want the about section to show when at home"
        // This implies other sections should be hidden.
        if (section.id === 'contact') return;

        if (section.id === targetId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });

    // Update active state for nav tabs
    const navTabs = document.querySelectorAll('.nav-tab');
    navTabs.forEach(tab => {
        if (tab.getAttribute('href') === hash) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Scroll to top when changing tabs for a better "single page app" feel
    window.scrollTo(0, 0);
}

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

let isIndustryMinimalView = false;
let industryDataCache = null;

async function loadIndustry() {
    const list = document.getElementById('industry-list');
    if (!list) return;

    // Set up toggle listener once
    const toggle = document.getElementById('industry-view-toggle');
    if (toggle && !toggle.hasListener) {
        toggle.addEventListener('change', (e) => {
            isIndustryMinimalView = e.target.checked;
            renderIndustry();
        });
        toggle.hasListener = true;
    }

    try {
        if (!industryDataCache) {
            const response = await fetch('data/industry.json');
            industryDataCache = await response.json();
        }
        renderIndustry();
    } catch (error) {
        console.error('Error loading industry:', error);
        list.innerHTML = '<p>Error loading industry experience.</p>';
    }
}

function renderIndustry() {
    const list = document.getElementById('industry-list');
    list.innerHTML = '';

    if (isIndustryMinimalView) {
        list.classList.add('minimal-view');
    } else {
        list.classList.remove('minimal-view');
    }

    industryDataCache.forEach(item => {
        list.appendChild(createIndustryElement(item, isIndustryMinimalView));
    });
}

function createIndustryElement(item, isMinimal) {
    const div = document.createElement('div');
    div.className = 'industry-item';

    const logoSrc = item.logos ? item.logos[0] : item.logo;

    if (isMinimal) {
        div.innerHTML = `
            <div class="industry-content">
                <div class="industry-header">
                    <span class="industry-company">${item.company}</span>
                    <span class="industry-year">${item.year}</span>
                </div>
                <span class="industry-team">${item.team}</span>
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="industry-logo-container">
                <img src="${logoSrc}" alt="${item.company}" class="industry-logo" onerror="this.style.display='none'">
            </div>
            <div class="industry-content">
                <div class="industry-header">
                    <span class="industry-company">${item.company}</span>
                    <span class="industry-year">${item.year}</span>
                </div>
                <span class="industry-team">${item.team}</span>
                <p class="industry-desc">${item.description}</p>
                ${item.link ? `<a href="${item.link}" target="_blank" class="industry-link">${item.link_text || 'Link'} <i class="fas fa-arrow-right"></i></a>` : ''}
            </div>
        `;
    }
    return div;
}

let isMinimalView = false;
let publicationsDataCache = null;

async function loadPublications() {
    const pubList = document.getElementById('publications-list');
    if (!pubList) return;

    // Set up toggle listener once
    const toggle = document.getElementById('pub-view-toggle');
    if (toggle && !toggle.hasListener) {
        toggle.addEventListener('change', (e) => {
            isMinimalView = e.target.checked;
            renderPublications();
        });
        toggle.hasListener = true;
    }

    try {
        if (!publicationsDataCache) {
            const response = await fetch('data/publications.json');
            publicationsDataCache = await response.json();
        }
        renderPublications();
    } catch (error) {
        console.error('Error loading publications:', error);
        pubList.innerHTML = '<p>Error loading publications.</p>';
    }
}

function renderPublications() {
    const pubList = document.getElementById('publications-list');
    pubList.innerHTML = '';

    if (isMinimalView) {
        pubList.classList.add('minimal-view');
        // Group by category
        const groups = publicationsDataCache.reduce((acc, pub) => {
            const cat = pub.category || 'Other';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(pub);
            return acc;
        }, {});

        for (const [category, items] of Object.entries(groups)) {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'publication-group';
            groupDiv.innerHTML = `<h3 class="category-header">${category}</h3>`;

            items.forEach(pub => {
                groupDiv.appendChild(createPublicationElement(pub, true));
            });
            pubList.appendChild(groupDiv);
        }
    } else {
        pubList.classList.remove('minimal-view');
        publicationsDataCache.forEach(pub => {
            pubList.appendChild(createPublicationElement(pub, false));
        });
    }
}

function createPublicationElement(pub, isMinimal) {
    const div = document.createElement('div');
    div.className = 'publication-item';

    const linksHtml = pub.links ? pub.links.map(link =>
        `<a href="${link.url}">${link.name}</a>`
    ).join('') : '';

    const minimalLinksHtml = pub.links ? pub.links.map(link =>
        `<a href="${link.url}" class="pub-link-icon" title="${link.name}" aria-label="${link.name}">↗</a>`
    ).join('') : '';

    if (isMinimal) {
        div.innerHTML = `
            <div class="pub-content">
                <span class="pub-title">${pub.title}</span>
                <span class="pub-authors">${pub.authors}</span>
                <div class="pub-meta">
                    <span class="pub-venue">${pub.venue}</span>
                    ${minimalLinksHtml}
                    <span class="pub-year">${pub.year}</span>
                </div>
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="pub-image-container">
                <img src="${pub.image}" alt="${pub.title}" class="pub-image" onerror="this.style.display='none'">
            </div>
            <div class="pub-content">
                <span class="pub-title">${pub.title}</span>
                <span class="pub-authors">${pub.authors}</span>
                <div class="pub-meta">
                    <span class="pub-venue">${pub.venue}</span>
                    <span class="pub-medium">${pub.medium}</span>
                    <span class="pub-year">${pub.year}</span>
                </div>
                ${linksHtml ? `<div class="pub-links">${linksHtml}</div>` : ''}
            </div>
        `;
    }
    return div;
}

// Simple markdown parser for bold and links
function parseMarkdown(text) {
    // Bold: **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Links: [text](url)
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    return text;
}
