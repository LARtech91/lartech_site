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
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
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
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
            
            // Atualiza o atributo aria-current
            navLinks.forEach(navLink => {
                navLink.removeAttribute('aria-current');
            });
            link.setAttribute('aria-current', 'page');
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
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
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
                
                // Atualiza a URL com o hash
                history.pushState(null, null, targetId);
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
    let isDragging = false;
    let startX, scrollLeft;
    
    // Armazena as dimensões do carrossel para reduzir reflow
    const getCarouselMetrics = () => ({
        scrollLeft: toolsCarousel.scrollLeft,
        scrollWidth: toolsCarousel.scrollWidth,
        clientWidth: toolsCarousel.clientWidth
    });
    
    // Função para iniciar o auto-scroll
    function startAutoScroll() {
        if (!isScrolling) {
            isScrolling = true;
            scrollInterval = setInterval(() => {
                const metrics = getCarouselMetrics();
                // Verifica se alcançou o limite direito ou esquerdo
                if (metrics.scrollLeft >= (metrics.scrollWidth - metrics.clientWidth - 5)) {
                    scrollDirection = -1;
                } else if (metrics.scrollLeft <= 5) {
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
    
    // Tratamento de eventos de arrastar
    function handleDragStart(e) {
        if (e.type === 'mousedown') {
            isDragging = true;
            startX = e.pageX - toolsCarousel.offsetLeft;
        } else if (e.type === 'touchstart') {
            isDragging = true;
            startX = e.touches[0].pageX - toolsCarousel.offsetLeft;
        }
        scrollLeft = toolsCarousel.scrollLeft;
        toolsCarousel.style.cursor = 'grabbing';
    }
    
    function handleDragEnd() {
        isDragging = false;
        toolsCarousel.style.cursor = 'grab';
    }
    
    function handleDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        let x;
        if (e.type === 'mousemove') {
            x = e.pageX - toolsCarousel.offsetLeft;
        } else if (e.type === 'touchmove') {
            x = e.touches[0].pageX - toolsCarousel.offsetLeft;
        }
        
        const walk = (x - startX) * 2; // Multiplicador para ajustar a velocidade
        toolsCarousel.scrollLeft = scrollLeft - walk;
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
    
    // Configurar listeners
    toolsCarousel.addEventListener('mouseenter', stopAutoScroll);
    toolsCarousel.addEventListener('touchstart', stopAutoScroll);
    toolsCarousel.addEventListener('mouseleave', startAutoScroll);
    toolsCarousel.addEventListener('touchend', () => {
        setTimeout(startAutoScroll, 2000); // Retoma após 2 segundos
    });
    
    // Eventos de arrastar
    toolsCarousel.addEventListener('mousedown', handleDragStart);
    toolsCarousel.addEventListener('touchstart', handleDragStart);
    toolsCarousel.addEventListener('mouseup', handleDragEnd);
    toolsCarousel.addEventListener('touchend', handleDragEnd);
    toolsCarousel.addEventListener('mouseleave', handleDragEnd);
    toolsCarousel.addEventListener('mousemove', handleDragMove);
    toolsCarousel.addEventListener('touchmove', handleDragMove);
    
    // Adicionar classe de estilo cursor grab ao carregamento
    toolsCarousel.style.cursor = 'grab';
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
       modalDiv.setAttribute('role', 'dialog');
       modalDiv.setAttribute('aria-labelledby', `${modalData.id}-title`);
       modalDiv.setAttribute('aria-modal', 'true');
       
       modalDiv.innerHTML = `
           <div class="modal-content">
               <span class="modal-close" aria-label="Fechar" role="button" tabindex="0">&times;</span>
               <h2 class="modal-title" id="${modalData.id}-title">${modalData.title}</h2>
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
           
           // Adiciona funcionalidade de teclado
           closeBtn.addEventListener('keydown', (e) => {
               if (e.key === 'Enter' || e.key === ' ') {
                   e.preventDefault();
                   closeModal(modalData.id);
               }
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
       
       // Foca no botão de fechar para acessibilidade
       const closeBtn = modal.querySelector('.modal-close');
       if (closeBtn) {
           setTimeout(() => {
               closeBtn.focus();
           }, 100);
       }
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
   // Verifica se o navegador suporta IntersectionObserver
   if (!('IntersectionObserver' in window)) {
       // Fallback para navegadores que não suportam IntersectionObserver
       const animatedElements = document.querySelectorAll('.service-card, .process-card, .testimonial-card, .feature-item');
       animatedElements.forEach(element => {
           element.classList.add('fade-in-up');
       });
       return;
   }
   
   // Agrupa elementos por tipo para otimizar
   const animationGroups = {
       'service-cards': '.service-card',
       'process-cards': '.process-card',
       'testimonial-cards': '.testimonial-card',
       'feature-items': '.feature-item',
       'solution-cards': '.solution-card',
       'case-study-cards': '.case-study-card'
   };
   
   // Cria um único observador de interseção com opções otimizadas
   const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
           if (entry.isIntersecting) {
               // Adiciona atraso baseado na posição do elemento para efeito escalonado
               setTimeout(() => {
                   entry.target.classList.add('fade-in-up');
               }, entry.target.dataset.animationDelay || 0);
               
               observer.unobserve(entry.target); // Para de observar após animar
           }
       });
   }, {
       threshold: 0.1, // Quando 10% do elemento está visível
       rootMargin: '0px 0px -50px 0px' // Ajusta a "viewport" de observação
   });
   
   // Para cada grupo de elementos, adiciona um atraso escalonado
   Object.values(animationGroups).forEach(selector => {
       const elements = document.querySelectorAll(selector);
       elements.forEach((element, index) => {
           // Adiciona um pequeno atraso escalonado baseado no índice
           element.dataset.animationDelay = index * 100; // 100ms de atraso entre elementos do mesmo tipo
           observer.observe(element);
       });
   });
   
   // Verifica se o navegador suporta requestIdleCallback para otimizar performance
   const scheduleObservation = window.requestIdleCallback || ((callback) => setTimeout(callback, 1));
   
   // Agenda a observação dos elementos para quando o navegador estiver ocioso
   scheduleObservation(() => {
       // Detecta se a página foi carregada já com scroll
       if (window.scrollY > 0) {
           // Força a verificação dos elementos já visíveis na tela
           const elements = document.querySelectorAll(Object.values(animationGroups).join(', '));
           elements.forEach(element => {
               const rect = element.getBoundingClientRect();
               if (rect.top < window.innerHeight && rect.bottom > 0) {
                   element.classList.add('fade-in-up');
                   observer.unobserve(element);
               }
           });
       }
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
   
   // Atualiza aria-current nos links de navegação com base no scroll
   updateActiveNavLink();
});

/**
* Atualiza o link de navegação ativo com base na posição de scroll
*/
function updateActiveNavLink() {
   // Captura todas as seções e links de navegação
   const sections = document.querySelectorAll('section[id]');
   const navLinks = document.querySelectorAll('.nav-link');
   
   // Encontra a seção atualmente visível
   let currentSectionId = null;
   let minDistance = Infinity;
   
   sections.forEach(section => {
       const sectionTop = section.offsetTop - 100; // Ajuste para o header
       const sectionHeight = section.offsetHeight;
       const distanceFromTop = Math.abs(window.scrollY - sectionTop);
       
       // Se o scroll está dentro da área da seção
       if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
           if (distanceFromTop < minDistance) {
               minDistance = distanceFromTop;
               currentSectionId = section.id;
           }
       }
   });
   
   // Atualiza os links de navegação
   if (currentSectionId) {
       navLinks.forEach(navLink => {
           const href = navLink.getAttribute('href').substring(1); // Remove o #
           
           if (href === currentSectionId) {
               navLink.setAttribute('aria-current', 'page');
           } else {
               navLink.removeAttribute('aria-current');
           }
       });
   }
}
