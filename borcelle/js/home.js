// Sistema Específico para Home
class HomeSystem {
    constructor() {
        this.init();
    }

    init() {
        this.createParticles();
        this.setupEventListeners();
        this.updateCartPreview();
        this.animateStats();
        this.setupMobileMenu();
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Posição aleatória
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 6;
            const duration = 6 + Math.random() * 4;
            
            particle.style.left = `${left}%`;
            particle.style.top = `${top}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            // Tamanho e cor aleatórios
            const size = 1 + Math.random() * 2;
            const colors = ['var(--accent-blue)', 'var(--neon-purple)', 'var(--electric-green)'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = color;
            
            particlesContainer.appendChild(particle);
        }
    }

    setupEventListeners() {
        // Cart hover persistence
        const cartWrapper = document.querySelector('.cart-wrapper');
        let cartTimeout;

        cartWrapper.addEventListener('mouseenter', () => {
            clearTimeout(cartTimeout);
            cartWrapper.classList.add('hover');
        });

        cartWrapper.addEventListener('mouseleave', () => {
            cartTimeout = setTimeout(() => {
                cartWrapper.classList.remove('hover');
            }, 300);
        });

        // Quick add to cart buttons
        document.querySelectorAll('.btn-primary.small').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const carId = btn.getAttribute('data-car-id');
                if (carId) {
                    this.addToCart(parseInt(carId));
                }
            });
        });
    }

    setupMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const body = document.body;

        if (menuBtn && mobileMenu) {
            menuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });

            // Fechar menu ao clicar em um link
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    body.style.overflow = '';
                });
            });
        }
    }

    updateCartPreview() {
        const cart = JSON.parse(localStorage.getItem('borcelle-cart')) || [];
        const previewItems = document.getElementById('cart-preview-items');
        const previewEmpty = document.getElementById('cart-preview-empty');
        const itemsCount = document.querySelector('.cart-items-count');
        const totalPrice = document.querySelector('.total-price');
        const cartCount = document.querySelector('.cart-count');

        // Atualizar contador
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }

        if (itemsCount) {
            itemsCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
        }

        // Calcular total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (totalPrice) {
            totalPrice.textContent = `R$ ${total.toFixed(2)}`;
        }

        // Atualizar itens do preview
        if (previewItems && previewEmpty) {
            previewItems.innerHTML = '';

            if (cart.length === 0) {
                previewEmpty.style.display = 'block';
                previewItems.style.display = 'none';
            } else {
                previewEmpty.style.display = 'none';
                previewItems.style.display = 'block';

                cart.slice(0, 3).forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-preview-item';
                    itemElement.innerHTML = `
                        <div class="cart-preview-item-image">
                            <i class="fas fa-car"></i>
                        </div>
                        <div class="cart-preview-item-details">
                            <div class="cart-preview-item-name">${item.name}</div>
                            <div class="cart-preview-item-price">R$ ${item.price} x ${item.quantity}</div>
                        </div>
                    `;
                    previewItems.appendChild(itemElement);
                });

                if (cart.length > 3) {
                    const moreItems = document.createElement('div');
                    moreItems.className = 'cart-preview-more';
                    moreItems.textContent = `+${cart.length - 3} mais itens...`;
                    moreItems.style.textAlign = 'center';
                    moreItems.style.color = 'var(--text-secondary)';
                    moreItems.style.fontSize = '0.9rem';
                    moreItems.style.marginTop = '1rem';
                    previewItems.appendChild(moreItems);
                }
            }
        }
    }

    addToCart(carId) {
        const cars = [
            {
                id: 1,
                name: "Tesla Model S Plaid",
                price: 450,
                image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400"
            },
            {
                id: 2,
                name: "Audi e-tron GT",
                price: 380,
                image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=400"
            },
            {
                id: 3,
                name: "Porsche Taycan Turbo",
                price: 520,
                image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400"
            },
            {
                id: 4,
                name: "Rivian R1S",
                price: 320,
                image: "https://images.unsplash.com/photo-1628191136681-d34e22b9cdcf?w=400"
            },
            {
                id: 5,
                name: "BMW i4 M50",
                price: 280,
                image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=400"
            }
        ];

        const car = cars.find(c => c.id === carId);
        if (!car) return;

        let cart = JSON.parse(localStorage.getItem('borcelle-cart')) || [];
        const existingItem = cart.find(item => item.id === carId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...car,
                quantity: 1,
                rentalDays: 1
            });
        }

        localStorage.setItem('borcelle-cart', JSON.stringify(cart));
        this.updateCartPreview();
        this.showNotification(`${car.name} adicionado ao carrinho!`, 'success');
    }

    animateStats() {
        const stats = document.querySelectorAll('.stat-number[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
                </span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--electric-green)' : 'var(--cyber-yellow)'};
            color: var(--primary-dark);
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-weight: 600;
            max-width: 400px;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar sistema da home
document.addEventListener('DOMContentLoaded', () => {
    new HomeSystem();
});

// Funções globais para os botões
function addToCart(carId) {
    const homeSystem = new HomeSystem();
    homeSystem.addToCart(carId);
}