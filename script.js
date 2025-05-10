// Usar IntersectionObserver com debounce para melhor performance
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Menu mobile com melhor performance
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            requestAnimationFrame(() => {
                menuToggle.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                requestAnimationFrame(() => {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                });
            });
        });
    }

    // Smooth scroll otimizado
    const smoothScroll = (target) => {
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
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                smoothScroll(target);
            }
        });
    });

    // Intersection Observer otimizado
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    document.querySelectorAll('section').forEach((section) => {
        observer.observe(section);
    });

    // Modal com melhor UX
    const modal = document.getElementById('policyModal');
    const closeButton = document.querySelector('.close-modal');
    const termsContent = document.getElementById('termsContent');
    const privacyContent = document.getElementById('privacyContent');

    const closeModal = () => {
        if (!modal) return;
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.opacity = '1';
        }, 300);
    };

    window.openModal = function(type) {
        if (!modal || !termsContent || !privacyContent) return;

        modal.style.display = 'block';
        requestAnimationFrame(() => {
            if (type === 'terms') {
                termsContent.style.display = 'block';
                privacyContent.style.display = 'none';
            } else {
                termsContent.style.display = 'none';
                privacyContent.style.display = 'block';
            }
        });
    };

    if (closeButton) {
        closeButton.onclick = closeModal;
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };

    // Tools Carousel Implementation
    const carousel = document.querySelector('.tools-carousel');
    const track = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    let autoplayInterval;
    let isDragging = false;
    let startX;
    let scrollLeft;

    const startAutoplay = () => {
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            const scrollAmount = track.offsetWidth * 0.2;
            if (track.scrollLeft >= (track.scrollWidth - track.offsetWidth - 10)) {
                track.scrollLeft = 0;
            } else {
                track.scrollTo({
                    left: track.scrollLeft + scrollAmount,
                    behavior: 'smooth'
                });
            }
        }, 3000);
    };

    const stopAutoplay = () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    };

    const handleDragStart = (e) => {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
        scrollLeft = track.scrollLeft;
        stopAutoplay();
    };

    const handleDragEnd = () => {
        isDragging = false;
        startAutoplay();
    };

    const handleDragMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
        const dist = (startX - x);
        track.scrollLeft = scrollLeft + dist;
    };

    // Event Listeners
    track.addEventListener('mousedown', handleDragStart);
    track.addEventListener('touchstart', handleDragStart);

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove, { passive: false });

    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);

    track.addEventListener('mouseover', stopAutoplay);
    track.addEventListener('mouseout', startAutoplay);

    prevButton.addEventListener('click', () => {
        track.scrollLeft -= track.offsetWidth * 0.3;
        stopAutoplay();
        setTimeout(startAutoplay, 2000);
    });

    nextButton.addEventListener('click', () => {
        track.scrollLeft += track.offsetWidth * 0.3;
        stopAutoplay();
        setTimeout(startAutoplay, 2000);
    });

    // Start autoplay on load
    startAutoplay();
});
