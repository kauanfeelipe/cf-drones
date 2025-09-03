// ======================= UTILITÁRIOS E HELPERS =======================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const safeExecute = (fn) => {
    try {
        fn();
    } catch (error) {
        console.warn('Erro não crítico:', error.message);
    }
};

// ======================= CONTROLE DO MENU MOBILE =======================
const initMobileMenu = () => {
    const navMenu = $('#nav-menu');
    const navToggle = $('#nav-toggle');
    const navLinks = $$('.nav__link');
    const navMenuLogo = $('#nav-menu-logo');
    const body = document.body;

    if (!navToggle || !navMenu) return;

    const toggleMenu = () => {
        navMenu.classList.toggle('show-menu');
        body.classList.toggle('body-no-scroll');
        
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    };

    const closeMenu = () => {
        navMenu.classList.remove('show-menu');
        body.classList.remove('body-no-scroll');
        
        const icon = navToggle.querySelector('i');
        if (icon?.classList.contains('fa-times')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    };

    navToggle.addEventListener('click', toggleMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMenu));
    navMenuLogo?.addEventListener('click', closeMenu);
};

// ======================= CARROSSEL SIMPLES SEM DEPENDÊNCIAS =======================
const initSimpleCarousel = () => {
    const carousel = $('#video-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.splide__track .splide__list');
    const slides = track?.querySelectorAll('.splide__slide');
    
    if (!track || !slides.length) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    const getPerView = () => (window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3));
    let perView = getPerView();

    // Criar controles de navegação
    const createControls = () => {
        const controlsHTML = `
            <div class="carousel-controls">
                <button class="carousel-btn carousel-prev" aria-label="Anterior">‹</button>
                <div class="carousel-dots"></div>
                <button class="carousel-btn carousel-next" aria-label="Próximo">›</button>
            </div>
        `;
        carousel.insertAdjacentHTML('beforeend', controlsHTML);
        buildDots();
    };

    const getMaxIndex = () => Math.max(0, totalSlides - perView);

    const buildDots = () => {
        const dotsContainer = carousel.querySelector('.carousel-dots');
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const numPages = getMaxIndex() + 1;
        for (let i = 0; i < numPages; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${i === currentSlide ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Página ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    };

    const updateSlide = () => {
        const maxIndex = getMaxIndex();
        if (currentSlide > maxIndex) currentSlide = maxIndex;
        if (currentSlide < 0) currentSlide = 0;
        const slideWidth = slides[0].offsetWidth;
        track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        
        // Atualizar dots
        const dots = $$('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    };

    const goToSlide = (index) => {
        const maxIndex = getMaxIndex();
        currentSlide = Math.max(0, Math.min(index, maxIndex));
        updateSlide();
    };

    const nextSlide = () => {
        const maxIndex = getMaxIndex();
        currentSlide = Math.min(currentSlide + 1, maxIndex);
        updateSlide();
    };

    const prevSlide = () => {
        currentSlide = Math.max(currentSlide - 1, 0);
        updateSlide();
    };

    createControls();
    
    // Event listeners
    carousel.querySelector('.carousel-next')?.addEventListener('click', nextSlide);
    carousel.querySelector('.carousel-prev')?.addEventListener('click', prevSlide);

    // Touch/swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    });

    // Responsive
    window.addEventListener('resize', () => {
        const oldPerView = perView;
        perView = getPerView();
        if (perView !== oldPerView) {
            buildDots();
        }
        updateSlide();
    });
};

// ======================= MODAL DE VÍDEO OTIMIZADO =======================
const initVideoModal = () => {
    const videoPlaceholders = $$('.video__placeholder');
    const videoModal = $('#video-modal');
    const videoPlayer = $('#video-player');
    const closeModalBtn = $('#video-modal-close');
    const body = document.body;

    if (!videoModal || !videoPlayer || !closeModalBtn) return;

    const openModal = (videoSrc) => {
        if (!videoSrc) return;
        
        videoPlayer.src = videoSrc;
        videoModal.classList.add('is-open');
        body.classList.add('body-no-scroll');
        
        // Play com fallback
        const playPromise = videoPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                console.warn('Autoplay bloqueado pelo navegador');
            });
        }
    };

    const closeModal = () => {
        videoModal.classList.remove('is-open');
        body.classList.remove('body-no-scroll');
        videoPlayer.pause();
        videoPlayer.src = '';
    };

    // Event listeners
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', () => {
            const videoSrc = placeholder.dataset.videoSrc;
            openModal(videoSrc);
        });
    });

    closeModalBtn.addEventListener('click', closeModal);

    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('is-open')) {
            closeModal();
        }
    });
};

// ======================= HEADER SCROLL OTIMIZADO =======================
const initScrollHeader = () => {
    const header = $('.header');
    if (!header) return;

    let ticking = false;
    
    const updateHeader = () => {
        const scrolled = window.pageYOffset > 50;
        header.style.backgroundColor = scrolled ? 'rgba(18, 18, 18, 0.9)' : 'rgba(18, 18, 18, 0.8)';
        header.style.boxShadow = scrolled ? '0 2px 10px rgba(0, 0, 0, 0.2)' : 'none';
        ticking = false;
    };

    const handleScroll = () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
};

// ======================= SERVICE WORKER =======================
const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('SW registrado com sucesso'))
            .catch(() => console.log('Falha no registro do SW'));
    }
};

// ======================= INICIALIZAÇÃO =======================
document.addEventListener('DOMContentLoaded', () => {
    safeExecute(initMobileMenu);
    safeExecute(initSimpleCarousel);
    safeExecute(initVideoModal);
    safeExecute(initScrollHeader);
    safeExecute(registerServiceWorker);
});