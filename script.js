// Variables globales
const config = {
    debounceTime: 100,
    throttleTime: 16,
    scrollOffset: 100,
    animationOffset: 150
};

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 TARA - Initialisation du site');

    // Initialiser les composants communs
    initNavigation();
    initScrollAnimations();
    initInteractiveElements();
    initForms();
    initAnalytics();

    // Initialiser les composants spécifiques aux pages
    const pageScripts = {
        'solutions': initSolutionsPage,
        'join': initJoinPage,
        'contact': initContactPage,
        'blog': initBlogPage,
        'about': initAboutPage
    };

    const bodyId = document.body.id || 'home';
    if (pageScripts[bodyId]) {
        pageScripts[bodyId]();
    }

    // Optimisations finales
    initPerformanceOptimizations();
});

// ==================== COMPOSANTS COMMUNS ====================

/**
 * Initialisation de la navigation
 */
function initNavigation() {
    console.log('🔹 Initialisation de la navigation');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Menu mobile
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
    }, config.throttleTime));

    // Mise à jour de la navigation active
    updateActiveNavigation();
    window.addEventListener('scroll', throttle(updateActiveNavigation, 100));
}

/**
 * Met à jour la navigation active en fonction de la section visible
 */
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id], .hero');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.scrollY + config.scrollOffset;

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

/**
 * Initialise les animations au scroll
 */
function initScrollAnimations() {
    console.log('🔹 Initialisation des animations au scroll');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: `0px 0px -${config.animationOffset}px 0px`
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Animation de base
                if (element.classList.contains('animate-on-scroll')) {
                    element.classList.add('animate-fade-up');
                }
                
                // Animations directionnelles
                if (element.classList.contains('animate-from-left')) {
                    element.classList.add('animate-fade-left');
                }
                
                if (element.classList.contains('animate-from-right')) {
                    element.classList.add('animate-fade-right');
                }

                // Animations spéciales
                animateCounters(element);
                animateProgressBars(element);
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    const elementsToAnimate = document.querySelectorAll(`
        .about-card, 
        .value-item, 
        .domain-card, 
        .timeline-item,
        .section-header,
        .hero-content,
        .tech-card,
        .position-card,
        .testimonial-card,
        .founder-card
    `);

    elementsToAnimate.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Effet parallaxe
    initParallaxEffect();
}

/**
 * Initialise l'effet parallaxe
 */
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero-shape, .hero-pattern');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const rate = scrolled * -0.5 * (index + 1);
            element.style.transform = `translate(-50%, -50%) translateY(${rate}px)`;
        });
    }, config.throttleTime));
}

/**
 * Initialise les éléments interactifs
 */
function initInteractiveElements() {
    console.log('🔹 Initialisation des éléments interactifs');
    
    // Cartes interactives
    const interactiveCards = document.querySelectorAll('.domain-card, .timeline-item, .position-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = card.classList.contains('timeline-item') 
                ? 'scale(1.05)' 
                : 'translateY(-10px)';
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'none';
            card.style.zIndex = '1';
        });
    });

    // Effet ripple sur les boutons
    const buttons = document.querySelectorAll('.btn:not(.no-ripple)');
    buttons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });

    // Smooth scroll pour les liens
    initSmoothScroll();

    // FAQ interactive
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            
            // Fermer les autres éléments
            document.querySelectorAll('.faq-item').forEach(faqItem => {
                if (faqItem !== item) {
                    faqItem.querySelector('.faq-question').classList.remove('active');
                    faqItem.querySelector('.faq-answer').classList.remove('active');
                }
            });

            // Basculer l'état actuel
            question.classList.toggle('active');
            answer.classList.toggle('active');
        });
    });
}

/**
 * Crée un effet ripple sur les boutons
 */
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

/**
 * Initialise le smooth scroll
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const targetId = href.substring(1);
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

/**
 * Initialise les formulaires
 */
function initForms() {
    console.log('🔹 Initialisation des formulaires');
    
    // Newsletter
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', handleNewsletterSubmit);
    });

    // Formulaires de contact
    const contactForms = document.querySelectorAll('form[id="contactForm"], form[id="joinForm"]');
    contactForms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

/**
 * Gère la soumission de la newsletter
 */
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (!isValidEmail(email)) {
        showNotification('Veuillez entrer une adresse email valide', 'error');
        emailInput.focus();
        return;
    }
    
    // Simulation d'envoi
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Merci ! Vous êtes maintenant abonné à notre newsletter 🎉', 'success');
        form.reset();
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }, 1500);
}

/**
 * Gère la soumission des formulaires
 */
function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const requiredFields = form.querySelectorAll('[required]');
    
    // Validation
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
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('Message envoyé avec succès ! Nous vous répondrons bientôt 📧', 'success');
        form.reset();
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }, 2000);
}

/**
 * Initialise les analytics
 */
function initAnalytics() {
    console.log('🔹 Initialisation des analytics');
    
    // Fonction de tracking
    const trackEvent = (category, action, label) => {
        console.log(`📊 Event tracked: ${category} - ${action} - ${label}`);
        // Intégration avec Google Analytics, Plausible, etc.
    };
    
    // Tracking des clics sur les boutons importants
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
        btn.addEventListener('click', () => {
            const label = btn.textContent.trim() || btn.getAttribute('aria-label') || 'Bouton';
            trackEvent('Engagement', 'Click', label);
        });
    });
    
    // Tracking du scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', throttle(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) { // Track à 25%, 50%, 75%, 100%
                trackEvent('Scroll', 'Depth', `${maxScroll}%`);
            }
        }
    }, 1000));
}

// ==================== COMPOSANTS SPÉCIFIQUES AUX PAGES ====================

/**
 * Initialisation de la page Solutions
 */
function initSolutionsPage() {
    console.log('🔹 Initialisation de la page Solutions');
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Mettre à jour les boutons actifs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Afficher le panneau correspondant
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Initialisation de la page Rejoignez-nous
 */
function initJoinPage() {
    console.log('🔹 Initialisation de la page Rejoignez-nous');
    
    // Initialisation déjà faite dans initSolutionsPage pour les tabs
    initSolutionsPage();
    
    // Filtrage des positions
    const filterInput = document.querySelector('#position-filter');
    if (filterInput) {
        filterInput.addEventListener('input', debounce(() => {
            const searchTerm = filterInput.value.toLowerCase();
            const positionCards = document.querySelectorAll('.position-card');
            
            positionCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }, config.debounceTime));
    }
}

/**
 * Initialisation de la page Contact
 */
function initContactPage() {
    console.log('🔹 Initialisation de la page Contact');
    // Les formulaires sont déjà initialisés dans initForms()
}

/**
 * Initialisation de la page Blog
 */
function initBlogPage() {
    console.log('🔹 Initialisation de la page Blog');
    
    // Filtrage des catégories
    const categoryButtons = document.querySelectorAll('.category-btn');
    const postCards = document.querySelectorAll('.post-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.textContent.trim();
            
            // Mettre à jour les boutons actifs
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filtrer les articles
            postCards.forEach(card => {
                const cardCategory = card.querySelector('.post-category').textContent.trim();
                
                if (category === 'Tous les articles' || cardCategory === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Initialisation de la page À propos
 */
function initAboutPage() {
    console.log('🔹 Initialisation de la page À propos');
    
    // Animation des statistiques
    const statsSection = document.querySelector('.vision-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
}

// ==================== UTILITAIRES ====================

/**
 * Affiche une notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
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

/**
 * Ferme une notification
 */
function closeNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        notification.remove();
    }, 300);
}

/**
 * Anime les compteurs
 */
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

/**
 * Anime les barres de progression
 */
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

/**
 * Vérifie si un email est valide
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Fonction debounce
 */
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

/**
 * Fonction throttle
 */
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

// ==================== OPTIMISATIONS ====================

/**
 * Initialise les optimisations de performance
 */
function initPerformanceOptimizations() {
    console.log('🔹 Initialisation des optimisations de performance');
    
    // Lazy loading des images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"], img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src') || img.src;
                    
                    img.src = src;
                    img.removeAttribute('data-src');
                    img.removeAttribute('loading');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Préchargement des pages
    preloadCriticalPages();
    
    // Réduire les animations si nécessaire
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition', 'none');
    }
}

/**
 * Précharge les pages importantes
 */
function preloadCriticalPages() {
    const criticalPages = ['/about', '/solutions', '/join', '/blog', '/contact'];
    
    criticalPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
    });
}

// ==================== EASTER EGG ====================

/**
 * Easter Egg - Code Konami
 */
const konamiSequence = [];
const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiSequence.push(e.keyCode);
    
    if (konamiSequence.length > konamiCode.length) {
        konamiSequence.splice(0, konamiSequence.length - konamiCode.length);
    }
    
    if (konamiSequence.join(',') === konamiCode.join(',')) {
        activateEasterEgg();
        konamiSequence.length = 0;
    }
});

/**
 * Active l'Easter Egg
 */
function activateEasterEgg() {
    showNotification('🎉 Félicitations ! Vous avez découvert notre Easter Egg ! Bienvenue dans l\'équipe des explorateurs TARA ! 🚀', 'success');
    
    // Effet visuel spécial
    document.body.style.transition = 'filter 1s';
    document.body.style.filter = 'hue-rotate(180deg)';
    
    setTimeout(() => {
        document.body.style.filter = '';
    }, 3000);
}

console.log('🌍 TARA - Construisant le futur numérique de l\'Afrique ! 🚀');