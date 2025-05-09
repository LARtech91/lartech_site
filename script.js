
document.addEventListener('DOMContentLoaded', () => {
    // Menu mobile toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle?.addEventListener('click', () => {
        navLinks?.classList.toggle('active');
    });
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // Observe all sections
    document.querySelectorAll('section').forEach((section) => {
        observer.observe(section);
    });

    // Carousel Logic
    const carousel = document.querySelector('.tools-carousel');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const images = carousel.querySelectorAll('img');
    
    let currentIndex = 0;
    let autoRotateInterval;
    
    function updateCarousel() {
        images.forEach((img, index) => {
            img.classList.remove('active');
            if (index === currentIndex) {
                img.classList.add('active');
            }
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    }

    function startAutoRotate() {
        autoRotateInterval = setInterval(nextSlide, 3000); // Muda a cada 3 segundos
    }

    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }
    
    // Eventos dos botões
    prevButton.addEventListener('click', () => {
        stopAutoRotate();
        prevSlide();
        startAutoRotate();
    });
    
    nextButton.addEventListener('click', () => {
        stopAutoRotate();
        nextSlide();
        startAutoRotate();
    });

    // Pause na rotação quando o mouse está sobre o carrossel
    carousel.addEventListener('mouseenter', stopAutoRotate);
    carousel.addEventListener('mouseleave', startAutoRotate);
    
    // Inicializa o carrossel
    updateCarousel();
    startAutoRotate();
});
