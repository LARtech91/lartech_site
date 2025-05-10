
// Utility functions
const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
};

// Mobile menu handling
class MobileMenu {
    constructor() {
        this.menuToggle = document.querySelector('.menu-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.init();
    }

    init() {
        if (!this.menuToggle || !this.navLinks) return;
        
        this.menuToggle.addEventListener('click', () => this.toggleMenu());
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }

    toggleMenu() {
        requestAnimationFrame(() => {
            this.menuToggle.classList.toggle('active');
            this.menuToggle.setAttribute('aria-expanded', 
                this.menuToggle.classList.contains('active'));
            this.navLinks.classList.toggle('active');
        });
    }

    closeMenu() {
        requestAnimationFrame(() => {
            this.menuToggle.classList.remove('active');
            this.menuToggle.setAttribute('aria-expanded', 'false');
            this.navLinks.classList.remove('active');
        });
    }
}

// Smooth scroll implementation
class SmoothScroll {
    static scroll(target) {
        const startPosition = window.pageYOffset;
        const targetPosition = target.getBoundingClientRect().top + startPosition;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;

        const animation = (currentTime) => {
            if (!start) start = currentTime;
            const progress = currentTime - start;
            const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

            window.scrollTo(0, startPosition + distance * easeInOutQuad(Math.min(progress / duration, 1)));

            if (progress < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    static init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.scroll(target);
                }
            });
        });
    }
}

// Modal handling
class Modal {
    constructor() {
        this.modal = document.getElementById('policyModal');
        this.closeButton = document.querySelector('.close-modal');
        this.termsContent = document.getElementById('termsContent');
        this.privacyContent = document.getElementById('privacyContent');
        this.init();
    }

    init() {
        if (!this.modal) return;
        
        if (this.closeButton) {
            this.closeButton.onclick = () => this.close();
        }

        window.onclick = (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        };

        window.openModal = (type) => this.open(type);
    }

    open(type) {
        if (!this.modal || !this.termsContent || !this.privacyContent) return;

        this.modal.style.display = 'block';
        requestAnimationFrame(() => {
            if (type === 'terms') {
                this.termsContent.style.display = 'block';
                this.privacyContent.style.display = 'none';
            } else {
                this.termsContent.style.display = 'none';
                this.privacyContent.style.display = 'block';
            }
        });
    }

    close() {
        if (!this.modal) return;
        this.modal.style.opacity = '0';
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.modal.style.opacity = '1';
        }, 300);
    }
}

// Carousel configuration
class CarouselManager {
    static initializeCarousels() {
        // Static carousels configuration
        const staticSwiperConfig = {
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: false,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        };

        // Initialize static carousels
        ['services', 'process', 'industry', 'diagnostic', 'cases'].forEach(type => {
            new Swiper(`.${type}-swiper`, staticSwiperConfig);
        });

        // Tools carousel with autoplay
        new Swiper('.tools-swiper', {
            slidesPerView: 'auto',
            centeredSlides: false,
            spaceBetween: 20,
            loop: true,
            loopFillGroupWithBlank: true,
            loopedSlides: 12,
            speed: 1000,
            allowTouchMove: true,
            watchSlidesProgress: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                waitForTransition: true,
                reverseDirection: false
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                320: {
                    slidesPerView: 3,
                    spaceBetween: 10
                },
                480: {
                    slidesPerView: 4,
                    spaceBetween: 15
                },
                768: {
                    slidesPerView: 5,
                    spaceBetween: 20
                },
                1024: {
                    slidesPerView: 6,
                    spaceBetween: 25
                }
            }
        });
    }
}

// Intersection Observer for animations
class ScrollAnimator {
    static init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(() => {
                            entry.target.classList.add('visible');
                        });
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        document.querySelectorAll('section').forEach((section) => {
            observer.observe(section);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
    SmoothScroll.init();
    new Modal();
    CarouselManager.initializeCarousels();
    ScrollAnimator.init();
    
    // Header scroll effect
    const header = document.querySelector('.main-header');
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    });
});
