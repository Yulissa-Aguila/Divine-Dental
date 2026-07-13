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
