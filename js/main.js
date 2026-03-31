/*=============== MAIN JAVASCRIPT ===============*/

// DOM Elements
const header = document.getElementById('header');
const navMenu = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelectorAll('.nav__link');
const tabButtons = document.querySelectorAll('.tab__btn');
const tabPanes = document.querySelectorAll('.tab__pane');
const backToTopButton = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const currentYearElement = document.getElementById('current-year');

/*=============== HEADER SCROLL EFFECT ===============*/

function scrollHeader() {
    updateWhatsAppFabFloatMode();
    if (!header) return;
    
    // Si no existe hero-header (paginas internas), mantener estado scrolled.
    const hasHeroHeader = Boolean(document.querySelector('.hero-header'));
    if (!hasHeroHeader) {
        header.classList.add('scrolled');
        return;
    }
    
    const scrollY = window.scrollY || window.pageYOffset;
    
    if (scrollY >= 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

/*=============== WHATSAPP: HEADER → ESQUINA INFERIOR (MÓVIL) ===============*/
function updateWhatsAppFabFloatMode() {
    // Mantener botón del header fijo en su lugar (sin moverlo)
    const headerFab = document.getElementById('whatsappFab');
    if (!headerFab) return;
    headerFab.classList.remove('whatsapp-fab--floating');
    document.body.classList.remove('whatsapp-fab-is-floating');
}

function updateScrollWhatsAppFabVisibility() {
    const scrollFab = document.getElementById('whatsappFabScroll');
    const whatsappMenu = document.getElementById('whatsappMenu');
    if (!scrollFab) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) {
        scrollFab.classList.remove('is-visible');
        scrollFab.classList.remove('whatsapp-fab--hint-dismissed');
        document.body.classList.remove('whatsapp-menu-near-scroll-fab');
        if (whatsappMenu && !whatsappMenu.hasAttribute('hidden')) {
            setWhatsAppMenuAnchor('header');
        }
        return;
    }

    const triggerSection = document.querySelector('.hero-header, .page-hero');
    const headerEl = document.getElementById('header');
    const headerHeight = headerEl ? headerEl.offsetHeight : 80;
    const scrollY = window.scrollY || window.pageYOffset;

    if (!triggerSection) {
        scrollFab.classList.remove('is-visible');
        scrollFab.classList.remove('whatsapp-fab--hint-dismissed');
        document.body.classList.remove('whatsapp-menu-near-scroll-fab');
        if (whatsappMenu && !whatsappMenu.hasAttribute('hidden')) {
            setWhatsAppMenuAnchor('header');
        }
        return;
    }

    const sectionRect = triggerSection.getBoundingClientRect();

    // Mostrar solo cuando toda la primera sección ya salió de pantalla (no solo del header).
    const hasLeftFirstSection = sectionRect.bottom <= 0;

    if (hasLeftFirstSection) {
        scrollFab.classList.add('is-visible');
    } else {
        scrollFab.classList.remove('is-visible');
        scrollFab.classList.remove('whatsapp-fab--hint-dismissed');
    }

    // Si el menú está abierto, anclarlo al botón visible correcto.
    if (whatsappMenu && !whatsappMenu.hasAttribute('hidden')) {
        setWhatsAppMenuAnchor(scrollFab.classList.contains('is-visible') ? 'scroll' : 'header');
    }
}

function createScrollWhatsAppFab() {
    const headerFab = document.getElementById('whatsappFab');
    if (!headerFab || document.getElementById('whatsappFabScroll')) return;

    const scrollFab = headerFab.cloneNode(true);
    scrollFab.id = 'whatsappFabScroll';
    scrollFab.classList.remove('whatsapp-fab--header');
    scrollFab.classList.remove('whatsapp-fab--floating');
    scrollFab.classList.add('whatsapp-fab--scroll');
    scrollFab.setAttribute('aria-label', 'WhatsApp flotante');

    document.body.appendChild(scrollFab);
}

function setWhatsAppMenuAnchor(anchor) {
    const menu = document.getElementById('whatsappMenu');
    if (!menu) return;

    ['top', 'right', 'bottom', 'left'].forEach((prop) => {
        menu.style.removeProperty(prop);
    });

    if (anchor === 'scroll') {
        menu.style.setProperty('top', 'auto', 'important');
        menu.style.setProperty('left', 'auto', 'important');
        menu.style.setProperty('right', 'calc(1rem + 56px + 12px)', 'important');
        menu.style.setProperty('bottom', '1.25rem', 'important');
        document.body.classList.add('whatsapp-menu-near-scroll-fab');
        return;
    }

    menu.style.setProperty('top', '64px', 'important');
    menu.style.setProperty('left', 'auto', 'important');
    menu.style.setProperty('right', 'var(--spacing-4)', 'important');
    menu.style.setProperty('bottom', 'auto', 'important');
    document.body.classList.remove('whatsapp-menu-near-scroll-fab');
}

// Ejecutar al cargar para verificar posición inicial
scrollHeader();
updateWhatsAppFabFloatMode();
createScrollWhatsAppFab();
updateScrollWhatsAppFabVisibility();

// Agregar listener de scroll
window.addEventListener('scroll', scrollHeader, { passive: true });
window.addEventListener('resize', updateWhatsAppFabFloatMode, { passive: true });
window.addEventListener('orientationchange', updateWhatsAppFabFloatMode, { passive: true });
window.addEventListener('scroll', updateScrollWhatsAppFabVisibility, { passive: true });
window.addEventListener('resize', updateScrollWhatsAppFabVisibility, { passive: true });
window.addEventListener('orientationchange', updateScrollWhatsAppFabVisibility, { passive: true });

/*=============== HERO VIDEO SCROLL ZOOM EFFECT ===============*/
function heroVideoScrollZoom() {
    // Desactivar efecto en móviles (menos de 768px) - sin zoom
    if (window.innerWidth <= 768) {
        const heroMain = document.querySelector('.hero__media-main');
        if (heroMain) {
            // Mantener escala fija sin zoom - forzar sin transiciones
            heroMain.style.transform = 'translateX(-50%) scale(1)';
            heroMain.style.transition = 'none';
            heroMain.style.willChange = 'auto';
        }
        // También asegurar que el fondo no haga zoom
        const heroBg = document.querySelector('.hero__bg');
        if (heroBg) {
            heroBg.style.transform = 'scale(1)';
            heroBg.style.transition = 'none';
        }
        return;
    }
    
    const heroMain = document.querySelector('.hero__media-main');
    if (!heroMain) return;
    
    const heroSection = document.querySelector('.hero-header');
    if (!heroSection) return;
    
    const heroSectionHeight = heroSection.offsetHeight;
    const scrollPosition = window.scrollY;
    
    // Calculate scroll progress (0 to 1)
    const scrollProgress = Math.min(scrollPosition / (heroSectionHeight * 0.5), 1);
    
    // Calculate scale (0.75 to 1.5) - starts smaller, grows larger
    const minScale = 0.75;
    const maxScale = 1.5;
    const scale = minScale + (scrollProgress * (maxScale - minScale));
    
    // Apply transform - maintain horizontal center and bottom position
    heroMain.style.transform = `translateX(-50%) scale(${scale})`;
    
    // Get video dimensions (base size)
    const videoWidth = 650; // Base width
    const videoHeight = 420; // Base height
    const baseScaledWidth = videoWidth * minScale;
    const baseScaledHeight = videoHeight * minScale;
    const scaledWidth = videoWidth * scale;
    const scaledHeight = videoHeight * scale;
    
    // Calculate offset for images (they need to move away as video grows from base scale)
    const offsetX = (scaledWidth - baseScaledWidth) / 2;
    const offsetY = (scaledHeight - baseScaledHeight) / 2;
    
    // Update image positions based on scroll - adapt to viewport height
    // Calculate dynamic bottom position based on viewport height and screen width
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Para pantallas grandes (laptops/monitores): más arriba (8-15vh)
    // Para pantallas pequeñas: más abajo (3-8vh)
    let baseBottomVh;
    
    if (viewportWidth >= 1025) {
        // Pantallas grandes (laptops y monitores) - mucho más arriba
        if (viewportHeight < 800) {
            baseBottomVh = 15 + (viewportHeight / 800) * 3; // 15vh a 18vh
        } else if (viewportHeight > 1200) {
            baseBottomVh = 20 + ((viewportHeight - 1200) / 400) * 5; // 20vh a 25vh
        } else {
            baseBottomVh = 18 + ((viewportHeight - 800) / 400) * 2; // 18vh a 20vh
        }
        baseBottomVh = Math.max(15, Math.min(28, baseBottomVh)); // Limitar entre 15vh y 28vh
    } else {
        // Pantallas pequeñas y tablets - más abajo
        if (viewportHeight < 800) {
            baseBottomVh = 3 + (viewportHeight / 800) * 2; // 3vh a 5vh
        } else if (viewportHeight > 1200) {
            baseBottomVh = 6 + ((viewportHeight - 1200) / 400) * 2; // 6vh a 8vh
        } else {
            baseBottomVh = 5 + ((viewportHeight - 800) / 400) * 1; // 5vh a 6vh
        }
        baseBottomVh = Math.max(3, Math.min(8, baseBottomVh)); // Limitar entre 3vh y 8vh
    }
    
    const baseBottom = baseBottomVh;
    const baseOffset = 5; // Base offset in pixels
    const sideOffset = 10; // Side offset in pixels
    
    // Top Left - Fixed position relative to viewport
    const topLeft = document.querySelector('.hero__media-item--top-left');
    if (topLeft) {
        const imageWidth = 260;
        topLeft.style.bottom = `calc(${baseBottom}vh + ${baseScaledHeight + baseOffset}px + ${offsetY}px)`;
        topLeft.style.left = `calc(40% - ${imageWidth/2}px)`;
        topLeft.style.right = 'auto';
    }
    
    // Top Right - Fixed position relative to viewport
    const topRight = document.querySelector('.hero__media-item--top-right');
    if (topRight) {
        const imageWidth = 220;
        const adjustedHeight = baseScaledHeight - 115; // Move down by reducing the offset
        topRight.style.bottom = `calc(${baseBottom}vh + ${adjustedHeight + baseOffset}px + ${offsetY}px)`;
        topRight.style.right = `calc(31% - ${imageWidth/2}px)`;
        topRight.style.left = 'auto';
    }
    
    // Bottom Left - Fixed position relative to viewport
    const bottomLeft = document.querySelector('.hero__media-item--bottom-left');
    if (bottomLeft) {
        const imageWidth = 240;
        bottomLeft.style.bottom = `calc(${baseBottom}vh + ${baseOffset}px - ${offsetY}px)`;
        bottomLeft.style.left = `calc(30% - ${imageWidth/2}px)`;
        bottomLeft.style.right = 'auto';
    }
    
    // Bottom Right - Fixed position relative to viewport
    const bottomRight = document.querySelector('.hero__media-item--bottom-right');
    if (bottomRight) {
        const imageWidth = 350;
        const adjustedHeight = 300; // Move up by using a fixed offset
        bottomRight.style.bottom = `calc(${baseBottom}vh + ${adjustedHeight}px - ${offsetY}px)`;
        bottomRight.style.left = `calc(28% - ${imageWidth/2}px)`;
        bottomRight.style.right = 'auto';
    }
}

window.addEventListener('scroll', heroVideoScrollZoom);
window.addEventListener('resize', heroVideoScrollZoom);

// Initialize positions on load
document.addEventListener('DOMContentLoaded', heroVideoScrollZoom);

/*=============== MOBILE NAVIGATION ===============*/
const navOverlay = document.getElementById('navOverlay');
const navClose = document.getElementById('nav-close');

function openMenu() {
    navMenu.classList.add('show');
    document.body.classList.add('nav-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Cerrar menú');
    const icon = navToggle.querySelector('i');
    if (icon) { icon.className = 'ri-close-line'; }
}

function closeMenu() {
    navMenu.classList.remove('show');
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menú');
    const icon = navToggle.querySelector('i');
    if (icon) { icon.className = 'ri-menu-line'; }
}

function toggleMenu() {
    navMenu.classList.contains('show') ? closeMenu() : openMenu();
}

navToggle.addEventListener('click', toggleMenu);

// Botón X dentro del drawer
if (navClose) navClose.addEventListener('click', closeMenu);

// Overlay click cierra
if (navOverlay) navOverlay.addEventListener('click', closeMenu);

// Cerrar al hacer clic en un link
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('show')) closeMenu();
});

// Cerrar al pasar a desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('show')) closeMenu();
}, { passive: true });

/*=============== ACTIVE LINK ON SCROLL ===============*/
function activeLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href*="${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink?.classList.add('active');
        }
    });
}

window.addEventListener('scroll', activeLink);

/*=============== TABS FUNCTIONALITY ===============*/
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get category from data attribute
        const category = button.dataset.category;
        
        // Hide all tab panes
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Show the selected tab pane
        document.getElementById(category)?.classList.add('active');
    });
});

/*=============== BACK TO TOP BUTTON ===============*/
function scrollUp() {
    if (!backToTopButton) return;
    
    if (window.scrollY >= 350) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
}

if (backToTopButton) {
    window.addEventListener('scroll', scrollUp);
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/*=============== CONTACT FORM SUBMISSION ===============*/
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.name.value.trim();
        const email = this.email.value.trim();
        const phone = this.phone.value.trim();
        const service = this.service.value;
        const message = this.message.value.trim();
        
        // Simple validation
        if (!name || !email || !phone || !service || !message) {
            showFormMessage('Por favor complete todos los campos', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Por favor ingrese un correo electrónico válido', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Create WhatsApp message
        const whatsappMessage = `Hola VEFOD, me interesa cotizar un servicio:

*Nombre:* ${name}
*Email:* ${email}
*Teléfono:* ${phone}
*Servicio:* ${service}

*Mensaje:*
${message}

Por favor contáctenme para más información.`;

        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            // Open WhatsApp
            const whatsappUrl = `https://wa.me/50670000000/?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showFormMessage('¡Mensaje enviado! Te redirigimos a WhatsApp.', 'success');
        }, 1500);
    });
}

/*=============== FORM MESSAGE NOTIFICATION ===============*/
function showFormMessage(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="ri-${type === 'success' ? 'check-line' : 'error-warning-line'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        animation: 'slideIn 0.3s ease-out'
    });
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .ri-spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        
        // Add slide out animation
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(slideOutStyle);
        
        // Remove notification after animation completes
        setTimeout(() => {
            notification.remove();
            slideOutStyle.remove();
        }, 300);
    }, 5000);
}

/*=============== CURRENT YEAR ===============*/
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

/*=============== ABOUT COUNTERS ===============*/
function initAboutCounters() {
    const counters = document.querySelectorAll('.about__stats .stat__number[data-target]');
    if (!counters.length) return;

    const animateCounter = (counter) => {
        const target = Number(counter.dataset.target || 0);
        const prefix = counter.dataset.prefix || '';
        const suffix = counter.dataset.suffix || '';
        if (!Number.isFinite(target) || target <= 0) return;

        const duration = 1500;
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const currentValue = Math.floor(target * progress);
            counter.textContent = `${prefix}${currentValue}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                counter.textContent = `${prefix}${target}${suffix}`;
            }
        };

        requestAnimationFrame(step);
    };

    const resetCounter = (counter) => {
        const prefix = counter.dataset.prefix || '';
        const suffix = counter.dataset.suffix || '';
        counter.textContent = `${prefix}0${suffix}`;
    };

    const section = document.querySelector('.about');
    if (!section) return;

    let hasAnimatedInView = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (!hasAnimatedInView) {
                    counters.forEach(animateCounter);
                    hasAnimatedInView = true;
                }
                return;
            }

            hasAnimatedInView = false;
            counters.forEach(resetCounter);
        });
    }, { threshold: 0.35 });

    observer.observe(section);
}

/*=============== WORKS CAROUSEL ===============*/
function initWorksCarousel() {
    const carousel = document.getElementById('worksCarousel');
    if (!carousel) return;

    const track = carousel.querySelector('.works-carousel__track');
    const slides = Array.from(carousel.querySelectorAll('.works-carousel__slide'));
    const dotsContainer = carousel.querySelector('.works-carousel__dots');
    if (!track || !slides.length || !dotsContainer) return;

    let currentIndex = 0;
    let autoTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;
    let perView = window.matchMedia('(min-width: 769px)').matches ? 2 : 1;
    let maxIndex = Math.max(0, slides.length - perView);

    const updatePerView = () => {
        perView = window.matchMedia('(min-width: 769px)').matches ? 2 : 1;
        maxIndex = Math.max(0, slides.length - perView);
    };

    const goToSlide = (index) => {
        updatePerView();
        if (index > maxIndex) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = maxIndex;
        } else {
            currentIndex = index;
        }
        // Use pixel-based translate to avoid subpixel drift on mobile.
        const stepWidth = carousel.clientWidth / perView;
        const offsetPx = stepWidth * currentIndex;
        track.style.transform = `translateX(-${offsetPx}px)`;
        const dots = dotsContainer.querySelectorAll('.works-carousel__dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    };

    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'works-carousel__dot';
        dot.type = 'button';
        dot.setAttribute('aria-label', `Ir al trabajo ${i + 1}`);
        dot.addEventListener('click', () => {
            goToSlide(i);
            restartAuto();
        });
        dotsContainer.appendChild(dot);
    });

    function startAuto() {
        autoTimer = window.setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 3600);
    }

    function stopAuto() {
        if (autoTimer) {
            window.clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    function restartAuto() {
        stopAuto();
        startAuto();
    }

    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchStartX - touchEndX;

        if (Math.abs(deltaX) > 40) {
            goToSlide(deltaX > 0 ? currentIndex + 1 : currentIndex - 1);
            restartAuto();
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        goToSlide(currentIndex);
    }, { passive: true });

    goToSlide(0);
    startAuto();
}

/*=============== INITIALIZE WHEN DOM IS LOADED ===============*/
document.addEventListener('DOMContentLoaded', function() {
    initAboutCounters();
    initWorksCarousel();

    // Initialize ScrollReveal
    if (typeof ScrollReveal !== 'undefined') {
        const sr = ScrollReveal({
            origin: 'top',
            distance: '60px',
            duration: 2500,
            delay: 400,
        });
        
        sr.reveal(`.hero__content, .section__header`);
        sr.reveal(`.service-card`, {interval: 100});
        sr.reveal(`.product-card`, {interval: 100});
        sr.reveal(`.contact__form-section`, {origin: 'left'});
        sr.reveal(`.contact__info-section`, {origin: 'right'});
    } else {
        // Add ScrollReveal script if not already loaded
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/scrollreveal@4.0.9/dist/scrollreveal.min.js';
        script.onload = () => {
            // Initialize ScrollReveal after loading
            const sr = ScrollReveal({
                origin: 'top',
                distance: '60px',
                duration: 2500,
                delay: 400,
            });
            
            sr.reveal(`.hero__content, .section__header`);
            sr.reveal(`.service-card`, {interval: 100});
            sr.reveal(`.product-card`, {interval: 100});
            sr.reveal(`.contact__form-section`, {origin: 'left'});
            sr.reveal(`.contact__info-section`, {origin: 'right'});
        };
        document.head.appendChild(script);
    }
    
    // Set active tab on page load
    const firstTabButton = document.querySelector('.tab__btn');
    if (firstTabButton) {
        firstTabButton.click();
    }
});

/*=============== WHATSAPP FLOATING BUTTON ===============*/
const whatsappMenu = document.getElementById('whatsappMenu');
const whatsappFabTriggers = () => document.querySelectorAll('#whatsappFab, #whatsappFabScroll');

function applyWhatsAppBubbleText() {
    const scrollFab = document.getElementById('whatsappFabScroll');
    if (!scrollFab) return;
    scrollFab.setAttribute('data-bubble-text', 'Contáctanos');
}

function dismissWhatsAppHintBubble() {
    const scrollFab = document.getElementById('whatsappFabScroll');
    if (scrollFab) scrollFab.classList.add('whatsapp-fab--hint-dismissed');
}

function showWhatsAppHintBubble() {
    const scrollFab = document.getElementById('whatsappFabScroll');
    if (scrollFab) scrollFab.classList.remove('whatsapp-fab--hint-dismissed');
}

if (whatsappMenu) {
    applyWhatsAppBubbleText();

    function handleWhatsAppFabClick(e) {
        e.stopPropagation();
        dismissWhatsAppHintBubble();
        const clickedFab = e.currentTarget;
        const isScrollFab = clickedFab && clickedFab.id === 'whatsappFabScroll';
        const isMenuClosed = whatsappMenu.hasAttribute('hidden');

        // Posicionar ANTES de abrir para que aparezca en el lugar correcto al instante.
        if (isMenuClosed) {
            setWhatsAppMenuAnchor(isScrollFab ? 'scroll' : 'header');
            whatsappMenu.removeAttribute('hidden');
            whatsappFabTriggers().forEach(fab => fab.setAttribute('aria-expanded', 'true'));
            return;
        }

        // Cerrar menú si ya estaba abierto.
        whatsappMenu.setAttribute('hidden', '');
        whatsappFabTriggers().forEach(fab => fab.setAttribute('aria-expanded', 'false'));
        setWhatsAppMenuAnchor('header');
        showWhatsAppHintBubble();
    }

    whatsappFabTriggers().forEach(fab => {
        fab.addEventListener('click', handleWhatsAppFabClick);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        const clickedOnAnyFab = Array.from(whatsappFabTriggers()).some(fab => fab.contains(e.target));
        if (!whatsappMenu.contains(e.target) && !clickedOnAnyFab) {
            whatsappMenu.setAttribute('hidden', '');
            whatsappFabTriggers().forEach(fab => fab.setAttribute('aria-expanded', 'false'));
            setWhatsAppMenuAnchor('header');
            showWhatsAppHintBubble();
        }
    });
    
    // Prevent menu from closing when clicking inside it
    whatsappMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

/*=============== FAQ ACCORDION ===============*/
const faqItems = document.querySelectorAll('.faq__item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq__question');
    
    if (question) {
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    }
});

/*=============== SCROLL REVEAL NATIVO ===============*/
(function() {
    const revealElements = document.querySelectorAll(
        '.service-card, .service-preview-card, .why-choose__item, ' +
        '.process__step, .product-list, .stat, .contact__item, ' +
        '.faq__item, .about__image, .section__header'
    );

    if (!revealElements.length) return;

    // Agregar clase reveal a los elementos
    revealElements.forEach((el, i) => {
        el.classList.add('reveal');
        // Delay escalonado para grupos de elementos
        el.style.transitionDelay = (i % 4) * 0.08 + 's';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
})();
