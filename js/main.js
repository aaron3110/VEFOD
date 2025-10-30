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
    if (window.scrollY >= 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', scrollHeader);

/*=============== MOBILE NAVIGATION ===============*/
function toggleMenu() {
    navMenu.classList.toggle('show');
}

navToggle.addEventListener('click', toggleMenu);

// Close menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
    }
});

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

/*=============== INITIALIZE WHEN DOM IS LOADED ===============*/
document.addEventListener('DOMContentLoaded', function() {
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
const whatsappFab = document.getElementById('whatsappFab');
const whatsappMenu = document.getElementById('whatsappMenu');

if (whatsappFab && whatsappMenu) {
    whatsappFab.addEventListener('click', function(e) {
        e.stopPropagation();
        whatsappMenu.toggleAttribute('hidden');
        whatsappFab.setAttribute('aria-expanded', whatsappMenu.hasAttribute('hidden') ? 'false' : 'true');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!whatsappMenu.contains(e.target) && e.target !== whatsappFab) {
            whatsappMenu.setAttribute('hidden', '');
            whatsappFab.setAttribute('aria-expanded', 'false');
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
