// ============================================
// Divine Dental - script.js
// ============================================

// ---------- 1. Menú hamburguesa ----------
// Seleccionamos el botón y la lista de links del menú
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

// Cuando se hace click en el botón, alternamos (toggle) la clase "open"
menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');

    // Actualizamos aria-expanded para lectores de pantalla:
    // le dice al usuario si el menú está abierto o cerrado
    menuToggle.setAttribute('aria-expanded', isOpen);

    // También cambiamos el aria-label del botón para que sea claro
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');

    // Y le agregamos una clase al botón para animar el ícono (hamburguesa -> X)
    menuToggle.classList.toggle('active', isOpen);
});

// Cuando el usuario hace click en un link del menú (en móvil),
// cerramos el menú automáticamente para que no se quede abierto
navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open menu');
    });
});

// ---------- 2. Highlight de sección activa al hacer scroll ----------
// IntersectionObserver nos avisa cuando una sección entra o sale de la pantalla,
// sin tener que escuchar el evento "scroll" manualmente (más eficiente).

const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const observerOptions = {
    // El "punto de disparo" es cuando la sección cruza el 40% de la altura
    // de la pantalla, para que el link se active cuando la sección
    // ya está claramente visible
    rootMargin: '-40% 0px -55% 0px',
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');

            // Quitamos "active" de todos los links...
            navItems.forEach((link) => link.classList.remove('active-link'));

            // ...y se lo ponemos solo al link que corresponde a la sección visible
            const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active-link');
            }
        }
    });
}, observerOptions);

sections.forEach((section) => sectionObserver.observe(section));

// ---------- 3. Modo oscuro con localStorage ----------
const themeToggle = document.getElementById('themeToggle');

// Función que aplica el tema y actualiza el botón para que sea accesible
function applyTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeToggle.setAttribute('aria-pressed', isDark);
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

// Al cargar la página: usamos la preferencia guardada, o si no existe,
// respetamos la preferencia de modo oscuro del sistema operativo
const savedTheme = localStorage.getItem('divine-dental-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark);

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(!isDark);
    // Guardamos la preferencia para que se recuerde en la próxima visita
    localStorage.setItem('divine-dental-theme', !isDark ? 'dark' : 'light');
});

// ---------- 4. Acordeón de FAQ ----------
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach((question) => {
    question.addEventListener('click', () => {
        const answer = document.getElementById(question.getAttribute('aria-controls'));
        const isOpen = question.getAttribute('aria-expanded') === 'true';

        // Cerramos cualquier otra pregunta abierta (comportamiento de acordeón:
        // solo una respuesta visible a la vez)
        faqQuestions.forEach((otherQuestion) => {
            if (otherQuestion !== question) {
                otherQuestion.setAttribute('aria-expanded', 'false');
                document.getElementById(otherQuestion.getAttribute('aria-controls')).style.maxHeight = null;
            }
        });

        question.setAttribute('aria-expanded', !isOpen);
        answer.style.maxHeight = isOpen ? null : `${answer.scrollHeight}px`;
    });
});

// ---------- 5. Carrusel de testimonios ----------
const track = document.getElementById('testimonialTrack');
const slides = track ? Array.from(track.children) : [];
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
let currentSlide = 0;

// Creamos un punto (dot) por cada testimonio, para navegar directo a uno
slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.children);

function goToSlide(index) {
    // Nos aseguramos de que el índice siempre esté dentro del rango,
    // dando la vuelta al llegar al final (carrusel circular)
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

goToSlide(0);

// ---------- 6. Lightbox de la galería ----------
const galleryItems = document.querySelectorAll('.gallery-item');

// Creamos el modal del lightbox una sola vez y lo agregamos al final del body
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close image">&times;</button>
    <img src="" alt="">
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('img');
const lightboxClose = lightbox.querySelector('.lightbox-close');
let lastFocusedElement = null;

function openLightbox(src, alt) {
    lastFocusedElement = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('open');
    lightboxClose.focus();
    document.body.style.overflow = 'hidden'; // evita el scroll de fondo mientras el modal está abierto
}

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
}

galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        openLightbox(item.getAttribute('data-full'), img.alt);
    });
});

lightboxClose.addEventListener('click', closeLightbox);

// Cerrar al hacer click en el fondo oscuro (fuera de la imagen)
lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
});

// Cerrar con la tecla Escape
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
    }
});
