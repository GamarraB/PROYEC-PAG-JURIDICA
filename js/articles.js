// Articles page functionality
let allArticlesData = [];
let filteredArticlesData = [];
let currentPage = 1;
const articlesPerPage = 9;

// Load and display articles
async function loadArticlesPage() {
    if (!window.db) {
        console.error('Firebase not ready');
        return;
    }

    try {
        const articlesQuery = query(collection(window.db, 'articles'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(articlesQuery);
        allArticlesData = [];
        querySnapshot.forEach((doc) => {
            allArticlesData.push({ id: doc.id, ...doc.data() });
        });

        console.log('Loaded articles for page:', allArticlesData.length);

        // Initial display
        filteredArticlesData = [...allArticlesData];
        displayArticles();

    } catch (error) {
        console.error('Error loading articles for page:', error);
        const grid = document.getElementById('articlesGrid');
        grid.innerHTML = '<div class="error-state"><p>Error al cargar artículos. Intenta recargar la página.</p></div>';
    }
}

// Display articles with pagination
function displayArticles() {
    const grid = document.getElementById('articlesGrid');
    const count = document.getElementById('articlesCount');

    if (filteredArticlesData.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <h3 class="empty-state-title">No se encontraron artículos</h3>
                <p class="empty-state-description">
                    No hay artículos que coincidan con tu búsqueda. Intenta con otros términos.
                </p>
            </div>
        `;
        count.textContent = '0 artículos encontrados';
        document.getElementById('paginationContainer').innerHTML = '';
        return;
    }

    // Update count
    count.textContent = `${filteredArticlesData.length} artículo${filteredArticlesData.length !== 1 ? 's' : ''} encontrado${filteredArticlesData.length !== 1 ? 's' : ''}`;

    // Calculate pagination
    const totalPages = Math.ceil(filteredArticlesData.length / articlesPerPage);
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const articlesToShow = filteredArticlesData.slice(startIndex, endIndex);

    // Display articles
    grid.innerHTML = '';
    articlesToShow.forEach((article) => {
        const articleCard = createArticleCard(article);
        grid.appendChild(articleCard);
    });

    // Display pagination
    displayPagination(totalPages);
}

// Create article card
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';

    let imageHtml = '';
    if (article.image) {
        imageHtml = `<img src="${article.image}" alt="${article.title}" class="article-image">`;
    } else {
        imageHtml = `<div class="article-image" style="display: flex; align-items: center; justify-content: center; font-size: 3rem; color: rgba(37, 99, 235, 0.3);">📄</div>`;
    }

    const excerpt = article.content.length > 150
        ? article.content.substring(0, 150) + '...'
        : article.content;

    card.innerHTML = `
        ${imageHtml}
        <div class="article-content">
            <div class="article-date">${article.date}</div>
            <h3 class="article-title">${article.title}</h3>
            <p class="article-excerpt">${excerpt}</p>
            <div class="article-footer">
                ${article.pdf ? `<a href="${article.pdf}" download="${article.title}.pdf" class="btn-download-pdf">📥 Descargar PDF</a>` : ''}
            </div>
        </div>
    `;

    return card;
}

// Display pagination
function displayPagination(totalPages) {
    const container = document.getElementById('paginationContainer');

    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let paginationHtml = '<div class="pagination">';

    // Previous button
    paginationHtml += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">‹ Anterior</button>`;

    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        paginationHtml += `<button class="page-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHtml += '<span class="pagination-dots">...</span>';
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHtml += '<span class="pagination-dots">...</span>';
        }
        paginationHtml += `<button class="page-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }

    // Next button
    paginationHtml += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">Siguiente ›</button>`;

    paginationHtml += '</div>';
    container.innerHTML = paginationHtml;
}

// Change page
function changePage(page) {
    currentPage = page;
    displayArticles();

    // Scroll to top of articles section
    document.querySelector('.articles-section').scrollIntoView({ behavior: 'smooth' });
}

// Search and filter articles
function searchArticles() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const dateFilter = document.getElementById('dateFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;

    // Filter by search term
    let filtered = allArticlesData.filter(article => {
        const matchesSearch = !searchTerm ||
            article.title.toLowerCase().includes(searchTerm) ||
            article.content.toLowerCase().includes(searchTerm);

        const matchesDate = !dateFilter || article.date.includes(dateFilter);

        return matchesSearch && matchesDate;
    });

    // Sort articles
    switch (sortFilter) {
        case 'oldest':
            filtered.sort((a, b) => new Date(a.timestamp.toDate()) - new Date(b.timestamp.toDate()));
            break;
        case 'title':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'newest':
        default:
            filtered.sort((a, b) => new Date(b.timestamp.toDate()) - new Date(a.timestamp.toDate()));
            break;
    }

    filteredArticlesData = filtered;
    currentPage = 1;
    displayArticles();
}

// Debounce search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Firebase and then load articles
    waitForFirebase().then(() => {
        console.log('Articles page ready with Firebase');
        loadArticlesPage();

        // Set up search with debounce
        const searchInput = document.getElementById('searchInput');
        const debouncedSearch = debounce(searchArticles, 300);
        searchInput.addEventListener('input', debouncedSearch);

        // Set up filters
        document.getElementById('dateFilter').addEventListener('change', searchArticles);
        document.getElementById('sortFilter').addEventListener('change', searchArticles);

        // Set up search button
        document.getElementById('searchBtn').addEventListener('click', searchArticles);
    });
});
