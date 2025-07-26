// Aditya Anand - Final Portfolio JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initScrollToTop();
    console.log('Portfolio initialized successfully!');
});

/** Throttles a function to limit how often it can be called. */
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

/** Initializes the light/dark theme toggle functionality. */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    /**
     * UPDATED: This function now uses the outlined sun/moon icons.
     */
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            // In dark mode, show the sun icon to switch to light
            themeIcon.className = 'fa-regular fa-sun';
        } else {
            // In light mode, show the moon icon to switch to dark
            themeIcon.className = 'fa-regular fa-moon';
        }
    }
}

/** Initializes navigation effects like active link highlighting. */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const highlightNavLink = () => {
        let currentSection = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 100) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };
    
    // Use throttle to improve scroll performance
    window.addEventListener('scroll', throttle(highlightNavLink, 150));
}

/** Initializes scroll-triggered fade-in animations for elements. */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.work-item, .service-card, .about-description, .contact-form-container').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
    
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .animate-on-scroll.is-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

/** Initializes contact form validation and submission. */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // IMPORTANT: Replace with your actual EmailJS credentials
    const SERVICE_ID = 'YOUR_SERVICE_ID';
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
    const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!contactForm.checkValidity()) {
            e.stopPropagation();
            contactForm.classList.add('was-validated');
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        const templateParams = {
            full_name: document.getElementById('fullName').value,
            from_email: document.getElementById('email').value,
            service_type: document.getElementById('serviceType').value,
            budget: document.getElementById('budget').value,
            message: document.getElementById('message').value
        };

        // --- DEVELOPMENT ONLY: Simulate successful submission ---
        console.log("Form submitted. Data:", templateParams);
        setTimeout(() => {
            showNotification('Thank you! Your message has been sent.', 'success');
            contactForm.reset();
            contactForm.classList.remove('was-validated');
            submitButton.textContent = 'Send Project Brief';
            submitButton.disabled = false;
        }, 1500);
    });
}

/** Initializes the scroll-to-top button. */
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', throttle(toggleVisibility, 200));
    
    // Smooth scroll to top on click
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/** Displays a custom notification toast. */
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `notification-toast is-${type}`;
    toast.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
        .notification-toast {
            position: fixed; bottom: 20px; right: 20px; padding: 15px 20px; border-radius: 8px; color: #fff;
            font-weight: 500; z-index: 10000; box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
            opacity: 0; transform: translateY(20px); transition: all 0.3s ease;
        }
        .notification-toast.is-success { background: #198754; } .notification-toast.is-error { background: #dc3545; }
        .notification-toast.is-visible { opacity: 1; transform: translateY(0); }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('is-visible'), 10);
    setTimeout(() => {
        toast.classList.remove('is-visible');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}