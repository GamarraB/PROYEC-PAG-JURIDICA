// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.main-navbar');
    if (navbar) { // Check if navbar exists
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Load publications in carousel
async function loadPublications() {
    if (!window.db) {
        console.error('Firebase not ready');
        return;
    }

    try {
        const publicationsQuery = query(collection(window.db, 'articles'), orderBy('timestamp', 'desc'), limit(10));
        const querySnapshot = await getDocs(publicationsQuery);
        const publications = [];
        querySnapshot.forEach((doc) => {
            publications.push({ id: doc.id, ...doc.data() });
        });

        console.log('Loading publications:', publications);

        const carousel = document.getElementById('publicationsCarousel');
        if (publications.length === 0) {
            carousel.innerHTML = `
                <div class="publication-card">
                    <div class="pub-image">📚</div>
                    <div class="pub-content">
                        <div class="pub-date">Sin publicaciones</div>
                        <h3 class="pub-title">No hay artículos publicados</h3>
                        <p class="pub-author">Mater Iuris</p>
                        <p class="pub-excerpt">Aún no se han publicado artículos. Visita la sección de administración para agregar contenido.</p>
                    </div>
                </div>
            `;
            return;
        }

        carousel.innerHTML = '';
        publications.forEach((pub) => {
            const pubCard = createPublicationCard(pub);
            carousel.appendChild(pubCard);
        });

        // Initialize carousel if needed
        initializePublicationsCarousel();

    } catch (error) {
        console.error('Error loading publications:', error);
        const carousel = document.getElementById('publicationsCarousel');
        carousel.innerHTML = '<p>Error al cargar publicaciones.</p>';
    }
}

// Create publication card for carousel
function createPublicationCard(article) {
    const card = document.createElement('div');
    card.className = 'publication-card';

    let imageHtml = '📚';
    if (article.image) {
        imageHtml = `<img src="${article.image}" alt="${article.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">`;
    }

    const excerpt = article.content.length > 120
        ? article.content.substring(0, 120) + '...'
        : article.content;

    card.innerHTML = `
        <div class="pub-image">${imageHtml}</div>
        <div class="pub-content">
            <div class="pub-date">${article.date}</div>
            <h3 class="pub-title">${article.title}</h3>
            <p class="pub-author">Por Mater Iuris</p>
            <p class="pub-excerpt">${excerpt}</p>
            ${article.pdf ? `<a href="${article.pdf}" download="${article.title}.pdf" class="btn-download-pdf" style="margin-top: 10px; display: inline-block;">Descargar PDF</a>` : ''}
        </div>
    `;

    return card;
}

// Initialize publications carousel
function initializePublicationsCarousel() {
    const carousel = document.getElementById('publicationsCarousel');
    const prevBtn = document.getElementById('prevPub');
    const nextBtn = document.getElementById('nextPub');

    if (!carousel || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const cards = carousel.children;
    const totalCards = cards.length;

    function updateCarousel() {
        const offset = -currentIndex * 100;
        carousel.style.transform = `translateX(${offset}%)`;

        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalCards - 1;
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalCards - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Initialize
    updateCarousel();
}

// Initialize testimonial carousel (equipo section)
  let currentSlide = 0;
        const slides = document.querySelectorAll('.testimonial-slide');
        const indicators = document.querySelectorAll('.indicator-dot');

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        setInterval(nextSlide, 6000);
        showSlide(0);

// Initialize events carousel
function initializeEventsCarousel() {
    const carousel = document.getElementById('eventsCarousel');
    const prevBtn = document.getElementById('prevEvent');
    const nextBtn = document.getElementById('nextEvent');

    if (!carousel || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    const slides = carousel.children;
    const totalSlides = slides.length;

    function updateEventsCarousel() {
        const offset = -currentIndex * 100;
        carousel.style.transform = `translateX(${offset}%)`;

        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalSlides - 1;
    }

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateEventsCarousel();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            updateEventsCarousel();
        }
    });

    // Initialize
    updateEventsCarousel();
}

// Initialize hamburger menu
function initializeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navbarMenu = document.getElementById('navbarMenu');

    if (!hamburger || !navbarMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbarMenu.classList.toggle('active');
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navbarMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
        }
    });

    // Close menu when clicking on a menu link
    navbarMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navbarMenu.classList.remove('active');
        });
    });
}

// Wait for Firebase to be ready
function waitForFirebase() {
    return new Promise((resolve) => {
        if (window.firebaseReady && window.db) {
            resolve();
        } else {
            const checkFirebase = setInterval(() => {
                if (window.firebaseReady && window.db) {
                    clearInterval(checkFirebase);
                    resolve();
                }
            }, 100);
        }
    });
}

// Contact form and initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components that don't need Firebase first
    initializeHamburgerMenu();
    initializeEventsCarousel();

    waitForFirebase().then(() => {
        console.log('Main page ready with Firebase');
        // Load publications in carousel
        loadPublications();

        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const name = document.getElementById('contactName').value;
                const email = document.getElementById('contactEmail').value;
                const message = document.getElementById('contactMessage').value;

                alert(`¡Gracias ${name}! Tu mensaje ha sido enviado. Te contactaremos pronto a ${email}.`);
                contactForm.reset();
            });
        }

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    });
});
