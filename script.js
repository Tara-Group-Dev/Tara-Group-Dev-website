// Variables globales
let isScrolling = false;
let currentSection = 0;

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialisation de l'application
function initializeApp() {
    initNavigation();
    initScrollAnimations();
    initInteractiveElements();
    initFormHandling();
    initPerformanceOptimizations();
    
    console.log('🚀 TARA website initialized successfully!');
}

// === NAVIGATION ===
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Toggle menu mobile
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Fermer le menu au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Navbar au scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        // Masquer/afficher la navbar
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, 16));

    // Navigation active selon la section
    updateActiveNavigation();
    window.addEventListener('scroll', throttle(updateActiveNavigation, 100));
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id], .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + 100;

    sections.forEach((section, index) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.id || 'home';

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`[href="/${id === 'about' ? '' : id}"], [href="#${id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

// === ANIMATIONS AU SCROLL ===
function initScrollAnimations() {
    // Intersection Observer pour les animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Ajouter les classes d'animation
                if (element.classList.contains('animate-on-scroll')) {
                    element.classList.add('animate-fade-up');
                }
                
                if (element.classList.contains('animate-from-left')) {
                    element.classList.add('animate-fade-left');
                }
                
                if (element.classList.contains('animate-from-right')) {
                    element.classList.add('animate-fade-right');
                }

                // Animations spéciales pour certains éléments
                animateCounters(element);
                animateProgressBars(element);
            }
        });
    }, observerOptions);

    // Observer tous les éléments à animer
    const elementsToAnimate = document.querySelectorAll(`
        .about-card, 
        .value-item, 
        .domain-card, 
        .timeline-item,
        .section-header,
        .hero-content
    `);

    elementsToAnimate.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Parallax effect
    initParallaxEffect();
}

function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero-shape, .hero-pattern');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const rate = scrolled * -0.5 * (index + 1);
            element.style.transform = `translate(-50%, -50%) translateY(${rate}px)`;
        });
    }, 16));
}

// === ÉLÉMENTS INTERACTIFS ===
function initInteractiveElements() {
    // Cartes de domaines interactives
    const domainCards = document.querySelectorAll('.domain-card');
    domainCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Effet de ripple sur les boutons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });

    // Timeline interactive
    initTimelineInteractions();

    // Smooth scroll pour les liens d'ancrage
    initSmoothScroll();
}

function createRippleEffect(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function initTimelineInteractions() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
            item.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
            item.style.zIndex = '1';
        });
    });
}

function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// === GESTION DES FORMULAIRES ===
function initFormHandling() {
    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Formulaires de contact (pour les autres pages)
    const contactForms = document.querySelectorAll('form[data-form-type="contact"]');
    contactForms.forEach(form => {
        form.addEventListener('submit', handleContactSubmit);
    });
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!isValidEmail(email)) {
        showNotification('Veuillez entrer une adresse email valide', 'error');
        return;
    }
    
    // Simulation d'envoi
    submitBtn.textContent = 'Inscription...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Merci ! Vous êtes maintenant abonné à notre newsletter 🎉', 'success');
        form.reset();
        submitBtn.textContent = "S'abonner";
        submitBtn.disabled = false;
    }, 1500);
}

function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validation des champs requis
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    if (!isValid) {
        showNotification('Veuillez remplir tous les champs requis', 'error');
        return;
    }
    
    // Simulation d'envoi
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Message envoyé avec succès ! Nous vous répondrons bientôt 📧', 'success');
        form.reset();
        submitBtn.textContent = 'Envoyer';
        submitBtn.disabled = false;
    }, 2000);
}

// === UTILITAIRES ===
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Styles de la notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Fermeture automatique
    const autoClose = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Fermeture manuelle
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoClose);
        closeNotification(notification);
    });
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// === ANIMATIONS SPÉCIALES ===
function animateCounters(element) {
    const counters = element.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

function animateProgressBars(element) {
    const progressBars = element.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 500);
    });
}

// === OPTIMISATIONS DE PERFORMANCE ===
function initPerformanceOptimizations() {
    // Lazy loading des images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserver(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Préchargement des pages importantes
    preloadCriticalPages();
    
    // Optimisation des animations
    optimizeAnimations();
}

function preloadCriticalPages() {
    const criticalPages = ['/about', '/solutions', '/join'];
    
    criticalPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
    });
}

function optimizeAnimations() {
    // Réduire les animations si l'utilisateur préfère
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition', 'none');
        
        // Désactiver les animations CSS
        const style = document.createElement('style');
        style.textContent = '*, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }';
        document.head.appendChild(style);
    }
}

// === EASTER EGGS ET FONCTIONNALITÉS CACHÉES ===
let konamiSequence = [];
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.keyCode);
    
    if (konamiSequence.length > konamiCode.length) {
        konamiSequence = konamiSequence.slice(-konamiCode.length);
    }
    
    if (konamiSequence.join(',') === konamiCode.join(',')) {
        activateEasterEgg();
        konamiSequence = [];
    }
});

function activateEasterEgg() {
    showNotification('🎉 Félicitations ! Vous avez découvert notre Easter Egg ! Bienvenue dans l\'équipe des explorateurs TARA ! 🚀', 'success');
    
    // Effet visuel special
    document.body.style.filter = 'hue-rotate(180deg)';
    setTimeout(() => {
        document.body.style.filter = '';
    }, 3000);
}

// === ANALYTICS ET TRACKING (GDPR compliant) ===
function initAnalytics() {
    // Tracking des interactions utilisateur (anonyme)
    const trackEvent = (category, action, label) => {
        console.log(`📊 Event tracked: ${category} - ${action} - ${label}`);
        // Intégration avec Google Analytics, Plausible, etc.
    };
    
    // Tracking des clics sur les boutons importants
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('Engagement', 'Click', btn.textContent.trim());
        });
    });
    
    // Tracking du scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', throttle(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                trackEvent('Scroll', 'Depth', `${maxScroll}%`);
            }
        }
    }, 1000));
}

// Initialiser les analytics après consentement
setTimeout(() => {
    initAnalytics();
}, 2000);

// CSS dynamique pour les animations
const animationStyles = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .error {
        border-color: #f44336 !important;
        box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2) !important;
    }
`;

// Injecter les styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

console.log('🌍 TARA - Building the digital future of Africa! 🚀');