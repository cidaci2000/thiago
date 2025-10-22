// Sistema do carrinho
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartStorage();
    updateCartCount();
    showNotification(`${product.name} adicionado ao carrinho!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartStorage();
    updateCartCount();
    updateCartDisplay();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartStorage();
        updateCartDisplay();
    }
}

function updateCartStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const emptyCart = document.getElementById('empty-cart');

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartSummary.style.display = 'none';
        cartItems.innerHTML = '';
        cartItems.appendChild(emptyCart);
        return;
    }

    emptyCart.style.display = 'none';
    cartSummary.style.display = 'block';
    
    cartItems.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price}/dia</div>
                </div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">🗑️</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    // Calcular totais
    const taxes = subtotal * 0.1; // 10% de taxas
    const total = subtotal + taxes;

    // Atualizar resumo
    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('taxes').textContent = `R$ ${taxes.toFixed(2)}`;
    document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;

    // Adicionar event listeners
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            updateQuantity(id, -1);
        });
    });

    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            updateQuantity(id, 1);
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
}

function showNotification(message) {
    // Criar notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--neon-blue);
        color: var(--dark-bg);
        padding: 1rem 2rem;
        border-radius: 4px;
        box-shadow: var(--glow);
        z-index: 1000;
        font-weight: bold;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Remover após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Finalizar compra
document.getElementById('checkout-btn')?.addEventListener('click', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        alert('Por favor, faça login para finalizar a reserva.');
        document.getElementById('login-screen').classList.add('active');
        document.getElementById('cart-screen').classList.remove('active');
        return;
    }

    if (cart.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
    }

    // Simular finalização (substituir por chamada PHP)
    fetch('php/cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `action=checkout&cart=${encodeURIComponent(JSON.stringify(cart))}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Reserva realizada com sucesso!');
            cart = [];
            updateCartStorage();
            updateCartCount();
            updateCartDisplay();
        } else {
            alert('Erro ao finalizar reserva: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao finalizar reserva. Tente novamente.');
    });
});

// Inicializar carrinho
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});