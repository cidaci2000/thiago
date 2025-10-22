// Sistema Principal da Borcelle
class BorcelleApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Header scroll effect
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });

        // Mobile menu (se necessário)
        this.setupMobileMenu();
    }

    handleScroll() {
        const header = document.querySelector('.glass-header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    handleNavigation(e) {
        e.preventDefault();
        const target = e.target.getAttribute('href');
        
        // Adicionar efeito de transição
        document.body.style.opacity = '0.7';
        
        setTimeout(() => {
            window.location.href = target;
        }, 300);
    }

    setupMobileMenu() {
        // Implementar menu mobile se necessário
        console.log('Mobile menu setup ready');
    }

    initializeComponents() {
        // Inicializar contador do carrinho
        this.updateCartCount();
        
        // Inicializar animações
        this.initAnimations();
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('borcelle-cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }

    initAnimations() {
        // Animação de entrada para elementos
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideIn 0.6s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar elementos para animação
        document.querySelectorAll('.feature-card, .stat-card').forEach(el => {
            observer.observe(el);
        });
    }

    checkAuthStatus() {
        const user = localStorage.getItem('borcelle-user');
        if (user) {
            this.updateUserInterface(JSON.parse(user));
        }
    }

    updateUserInterface(user) {
        const loginBtn = document.querySelector('.btn-login');
        const registerBtn = document.querySelector('.btn-register');
        
        if (loginBtn && registerBtn) {
            loginBtn.innerHTML = `<span class="btn-icon">👤</span> ${user.name}`;
            registerBtn.textContent = 'Sair';
            registerBtn.onclick = this.logout.bind(this);
        }
    }

    logout() {
        localStorage.removeItem('borcelle-user');
        window.location.reload();
    }
}

// Inicializar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new BorcelleApp();
});

// Utilitários globais
const Utils = {
    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    },

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : '⚠️'}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--electric-green)' : 'var(--cyber-yellow)'};
            color: var(--primary-dark);
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-weight: 600;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};
