/**
 * LARTECH AUTOMAÇÕES - JavaScript Principal
 * Responsável por gerenciar interações, funcionalidades e comportamentos dinâmicos.
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Inicialização de todas as funcionalidades
    initMobileMenu();
    initSmoothScroll();
    initToolsCarousel();
    initServiceCardAnimations();
    initContactForm();
    initModalHandlers();
    initScrollAnimations();
    
    // Adiciona classe para ativar animações após carregamento
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);
});

/**
 * Inicializa o menu mobile
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    
    // Se os elementos não existirem, retorna
    if (!mobileMenuBtn || !navMenu) return;
    
    // Toggle do menu mobile
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Impede a propagação do evento
        navMenu.classList.toggle('active');
        
        // Alterna o ícone do botão
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Fecha o menu ao clicar em qualquer link de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            
            // Reset do ícone
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            e.target !== mobileMenuBtn && 
            !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            
            // Reset do ícone
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

/**
 * Inicializa o scroll suave para links internos
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerOffset = 80; // Altura do header fixo
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Inicializa o carrossel de ferramentas
 */
function initToolsCarousel() {
    const toolsCarousel = document.getElementById('tools-carousel');
    if (!toolsCarousel) return;
    
    let scrollInterval;
    let scrollDirection = 1; // 1 para direita, -1 para esquerda
    let isScrolling = false;
    let scrollSpeed = 30; // Velocidade de scroll (ms)
    let scrollStep = 1; // Pixels por etapa de scroll
    
    // Função para iniciar o auto-scroll
    function startAutoScroll() {
        if (!isScrolling) {
            isScrolling = true;
            scrollInterval = setInterval(() => {
                // Verifica se alcançou o limite direito ou esquerdo
                if (toolsCarousel.scrollLeft >= (toolsCarousel.scrollWidth - toolsCarousel.clientWidth - 5)) {
                    scrollDirection = -1;
                } else if (toolsCarousel.scrollLeft <= 5) {
                    scrollDirection = 1;
                }
                
                // Aplica o scroll
                toolsCarousel.scrollLeft += scrollStep * scrollDirection;
            }, scrollSpeed);
        }
    }
    
    // Função para parar o auto-scroll
    function stopAutoScroll() {
        isScrolling = false;
        clearInterval(scrollInterval);
    }
    
    // Inicia o auto-scroll quando o carrossel entra no viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAutoScroll();
            } else {
                stopAutoScroll();
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(toolsCarousel);
    
    // Pausa o auto-scroll quando o usuário interage com o carrossel
    toolsCarousel.addEventListener('mouseenter', stopAutoScroll);
    toolsCarousel.addEventListener('touchstart', stopAutoScroll);
    
    // Retoma o auto-scroll quando o usuário deixa o carrossel
    toolsCarousel.addEventListener('mouseleave', startAutoScroll);
    toolsCarousel.addEventListener('touchend', () => {
        setTimeout(startAutoScroll, 2000); // Retoma após 2 segundos
    });
    
    // Permite rolagem por arrastar
    let isDragging = false;
    let startX, scrollLeft;
    
    toolsCarousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - toolsCarousel.offsetLeft;
        scrollLeft = toolsCarousel.scrollLeft;
        toolsCarousel.style.cursor = 'grabbing';
    });
    
    toolsCarousel.addEventListener('mouseleave', () => {
        isDragging = false;
        toolsCarousel.style.cursor = 'grab';
    });
    
    toolsCarousel.addEventListener('mouseup', () => {
        isDragging = false;
        toolsCarousel.style.cursor = 'grab';
    });
    
    toolsCarousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - toolsCarousel.offsetLeft;
        const walk = (x - startX) * 2; // Multiplicador para ajustar a velocidade
        toolsCarousel.scrollLeft = scrollLeft - walk;
    });
}

/**
 * Inicializa animações dos cards de serviço
 */
function initServiceCardAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    // Se não houver cards, retorna
    if (!serviceCards.length) return;
    
    // Adiciona hover effect via JS para melhor controle
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        });
    });
}

/**
 * Inicializa o formulário de contato
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    // Se o formulário não existir, retorna
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coleta os dados do formulário
        const formData = new FormData(contactForm);
        const formValues = Object.fromEntries(formData.entries());
        
        // Aqui você adicionaria a lógica para enviar os dados para o servidor
        // Por enquanto, apenas simularemos um envio bem-sucedido
        
        // Desabilita o botão durante o envio
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        // Simula uma resposta do servidor após 2 segundos
        setTimeout(() => {
            // Reset do formulário
            contactForm.reset();
            
            // Restaura o botão
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            
            // Exibe mensagem de sucesso
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
        }, 2000);
    });
    
    // Adiciona máscara para o campo de telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                if (value.length > 2) {
                    value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
                }
                if (value.length > 10) {
                    value = `${value.substring(0, 10)}-${value.substring(10)}`;
                }
            }
            e.target.value = value;
        });
    }
}

/**
 * Inicializa os handlers de modais para documentos legais
 */
function initModalHandlers() {
    // Links para abrir modais
    const termosLink = document.getElementById('termos-link');
    const privacidadeLink = document.getElementById('privacidade-link');
    const cookiesLink = document.getElementById('cookies-link');
    
    // Cria os modais se eles não existirem
    if (!document.querySelector('.modal')) {
        createModals();
    }
    
    // Adiciona event listeners aos links
    if (termosLink) {
        termosLink.addEventListener('click', () => {
            openModal('termos-modal');
        });
    }
    
    if (privacidadeLink) {
        privacidadeLink.addEventListener('click', () => {
            openModal('privacidade-modal');
        });
    }
    
    if (cookiesLink) {
        cookiesLink.addEventListener('click', () => {
            openModal('cookies-modal');
        });
    }
    
    // Fecha os modais quando clica fora
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Fecha os modais quando aperta ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

/**
 * Cria os modais para documentos legais
 */
function createModals() {
    // Conteúdo para os modais
    const modalsData = [
        {
            id: 'termos-modal',
            title: 'Termos de Uso',
            content: `
                <p>Este documento descreve os termos e condições gerais aplicáveis ao uso dos serviços oferecidos pela LARTECH AUTOMAÇÕES.</p>
                
                <h3>1. Aceitação dos Termos</h3>
                <p>Ao utilizar os serviços da LARTECH AUTOMAÇÕES, você concorda com estes termos. Se você não concorda com qualquer parte destes termos, não utilize nossos serviços.</p>
                
                <h3>2. Descrição dos Serviços</h3>
                <p>A LARTECH AUTOMAÇÕES oferece soluções de automação personalizadas para empresas, incluindo integração de sistemas, assistentes virtuais com IA, e automação de processos.</p>
                
                <h3>3. Responsabilidades do Cliente</h3>
                <p>O cliente é responsável por fornecer informações precisas e completas necessárias para a prestação dos serviços, além de manter a segurança de suas credenciais de acesso.</p>
                
                <h3>4. Propriedade Intelectual</h3>
                <p>Todos os direitos de propriedade intelectual relacionados aos serviços pertencem à LARTECH AUTOMAÇÕES. O cliente recebe apenas uma licença limitada para utilizar os serviços conforme contratado.</p>
                
                <h3>5. Alterações nos Termos</h3>
                <p>A LARTECH AUTOMAÇÕES se reserva o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor após publicação no site.</p>
            `
        },
        {
            id: 'privacidade-modal',
            title: 'Política de Privacidade',
            content: `
                <p>A LARTECH AUTOMAÇÕES está comprometida com a proteção da sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações.</p>
                
                <h3>1. Informações Coletadas</h3>
                <p>Coletamos informações pessoais como nome, e-mail, telefone e detalhes da empresa quando você preenche nossos formulários ou interage com nossos serviços.</p>
                
                <h3>2. Uso das Informações</h3>
                <p>Utilizamos suas informações para fornecer e melhorar nossos serviços, comunicar-nos com você, processar pagamentos e cumprir obrigações legais.</p>
                
                <h3>3. Compartilhamento de Dados</h3>
                <p>Não vendemos suas informações pessoais. Podemos compartilhar dados com parceiros de confiança que nos ajudam a fornecer nossos serviços, sempre sob rigorosos acordos de confidencialidade.</p>
                
                <h3>4. Segurança de Dados</h3>
                <p>Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.</p>
                
                <h3>5. Seus Direitos</h3>
                <p>Você tem o direito de acessar, corrigir ou excluir seus dados pessoais a qualquer momento. Entre em contato conosco para exercer esses direitos.</p>
            `
        },
        {
            id: 'cookies-modal',
            title: 'Política de Cookies',
            content: `
                <p>Esta política explica como a LARTECH AUTOMAÇÕES utiliza cookies e tecnologias semelhantes em seu site.</p>
                
                <h3>1. O que são Cookies</h3>
                <p>Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita nosso site. Eles nos ajudam a fornecer funcionalidades essenciais e melhorar sua experiência.</p>
                
                <h3>2. Tipos de Cookies que Utilizamos</h3>
                <p>- Cookies essenciais: necessários para o funcionamento básico do site<br>
                - Cookies de desempenho: coletam informações sobre como você usa nosso site<br>
                - Cookies de funcionalidade: permitem recursos personalizados<br>
                - Cookies de publicidade: fornecem anúncios relevantes para seus interesses</p>
                
                <h3>3. Gerenciamento de Cookies</h3>
                <p>Você pode controlar e gerenciar cookies nas configurações do seu navegador. No entanto, desabilitar certos cookies pode afetar a funcionalidade do site.</p>
                
                <h3>4. Cookies de Terceiros</h3>
                <p>Nosso site pode conter cookies de terceiros, como Google Analytics, para análise de tráfego. Esses terceiros podem ter suas próprias políticas de privacidade.</p>
                
                <h3>5. Atualizações da Política</h3>
                <p>Podemos atualizar esta política periodicamente. Recomendamos que você a revise regularmente.</p>
            `
        }
    ];
    
    // Cria os modais no DOM
    modalsData.forEach(modalData => {
        const modalDiv = document.createElement('div');
        modalDiv.id = modalData.id;
        modalDiv.className = 'modal';
        
        modalDiv.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h2 class="modal-title">${modalData.title}</h2>
                <div class="modal-body">
                    ${modalData.content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modalDiv);
        
        // Adiciona event listener para fechar o modal
        const closeBtn = modalDiv.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeModal(modalData.id);
            });
        }
    });
}

/**
 * Abre um modal específico
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Impede o scroll de fundo
    }
}

/**
 * Fecha um modal específico
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restaura o scroll
    }
}

/**
 * Fecha todos os modais abertos
 */
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('show');
    });
    document.body.style.overflow = ''; // Restaura o scroll
}

/**
 * Inicializa animações de scroll
 */
function initScrollAnimations() {
    // Seleciona elementos que devem ser animados ao entrar na viewport
    const animatedElements = document.querySelectorAll('.service-card, .process-card, .testimonial-card, .feature-item');
    
    // Se não houver elementos, retorna
    if (!animatedElements.length) return;
    
    // Configura o observador de interseção
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target); // Para de observar após animar
            }
        });
    }, {
        threshold: 0.1, // Quando 10% do elemento está visível
        rootMargin: '0px 0px -50px 0px' // Ajusta a "viewport" de observação
    });
    
    // Observa cada elemento
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Adiciona comportamento de header reduzido ao rolar a página
 */
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    
    if (!header) return;
    
    // Reduz o tamanho do header ao rolar para baixo
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
