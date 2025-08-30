document.addEventListener('DOMContentLoaded', function () {
    /* ======================= CONTROLE DO MENU MOBILE ======================= */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav__link');
    const navMenuLogo = document.getElementById('nav-menu-logo'); // Pega a nova logo do menu
    const body = document.body;

    // Função para mostrar/esconder o menu E trocar o ícone
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
            body.classList.toggle('body-no-scroll');

            const icon = navToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Função para fechar o menu
    const closeMenu = () => {
        navMenu.classList.remove('show-menu');
        body.classList.remove('body-no-scroll');
        
        const icon = navToggle.querySelector('i');
        if (icon.classList.contains('fa-times')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    // Adiciona o evento de fechar para os links
    navLinks.forEach(n => n.addEventListener('click', closeMenu));
    // Adiciona o evento de fechar para a logo do menu
    if (navMenuLogo) {
        navMenuLogo.addEventListener('click', closeMenu);
    }

    /* ... (O restante do seu JavaScript para o carrossel e modal continua o mesmo) ... */
    
    /* ======================= INICIALIZAÇÃO DO CARROSSEL DE VÍDEOS ======================= */
    const videoCarousel = document.getElementById('video-carousel');
    if (videoCarousel) {
        new Splide(videoCarousel, {
            type: 'loop',       // Cria um carrossel infinito
            perPage: 3,         // 3 slides visíveis em telas grandes
            perMove: 1,         // Move 1 slide por vez
            gap: '1.5rem',      // Espaço entre os slides
            pagination: true,  // Mostra os pontinhos de navegação
            arrows: true,       // Mostra as setas de navegação
            focus: 'center',    // Centraliza o slide ativo (se perPage for par, pode não ser perfeito)
            breakpoints: {
                1024: {
                    perPage: 2, // 2 slides para tablets
                },
                768: {
                    perPage: 1, // 1 slide para celulares
                    arrows: false, // Esconde as setas em telas pequenas
                },
            },
        }).mount();
    }


    /* ======================= CONTROLE DO MODAL DE VÍDEO (.MP4) ======================= */
    const videoPlaceholders = document.querySelectorAll('.video__placeholder');
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('video-player');
    const closeModalBtn = document.getElementById('video-modal-close');

    const openModal = (videoSrc) => {
        videoPlayer.setAttribute('src', videoSrc);
        videoModal.classList.add('is-open');
        body.classList.add('body-no-scroll');
        videoPlayer.play();
    };

    const closeModal = () => {
        videoModal.classList.remove('is-open');
        body.classList.remove('body-no-scroll');
        videoPlayer.pause();
        videoPlayer.setAttribute('src', '');
    };

    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', () => {
            const videoSrc = placeholder.getAttribute('data-video-src');
            if (videoSrc) {
                openModal(videoSrc);
            }
        });
    });

    closeModalBtn.addEventListener('click', closeModal);

    videoModal.addEventListener('click', (event) => {
        if (event.target === videoModal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && videoModal.classList.contains('is-open')) {
            closeModal();
        }
    });


    /* ======================= MUDAR BACKGROUND DO HEADER AO ROLAR A PÁGINA ======================= */
    const scrollHeader = () => {
        const header = document.querySelector('.header');
        if (window.scrollY >= 50) {
            header.style.backgroundColor = 'rgba(18, 18, 18, 0.9)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        } else {
            header.style.backgroundColor = 'rgba(18, 18, 18, 0.8)';
            header.style.boxShadow = 'none';
        }
    }
    window.addEventListener('scroll', scrollHeader);
});