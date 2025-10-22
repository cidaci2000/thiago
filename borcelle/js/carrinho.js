// carrinho.js - Sistema do Carrinho de Compras
document.addEventListener('DOMContentLoaded', function() {
    console.log('Carrinho carregado!');
    
    // Elementos do DOM
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const itemsCount = document.querySelector('.items-count');
    const subtotalElement = document.getElementById('subtotal');
    const taxesElement = document.getElementById('taxes');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Carregar carrinho do localStorage
    function carregarCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        console.log('Carrinho carregado:', carrinho);
        
        atualizarInterfaceCarrinho(carrinho);
    }

    // Atualizar interface do carrinho
    function atualizarInterfaceCarrinho(carrinho) {
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        
        // Atualizar contador
        if (itemsCount) {
            itemsCount.textContent = `${totalItens} ${totalItens === 1 ? 'item' : 'itens'}`;
        }

        // Atualizar contador no header
        atualizarContadorHeader(totalItens);

        // Mostrar/ocultar carrinho vazio
        if (cartEmpty && cartItems) {
            if (carrinho.length === 0) {
                cartEmpty.style.display = 'flex';
                cartItems.style.display = 'none';
            } else {
                cartEmpty.style.display = 'none';
                cartItems.style.display = 'block';
                renderizarItensCarrinho(carrinho);
            }
        }

        // Calcular totais
        calcularTotais(carrinho);
    }

    // Atualizar contador no header
    function atualizarContadorHeader(totalItens) {
        const countElement = document.querySelector('.cart-count');
        if (countElement) {
            countElement.textContent = totalItens;
        }
    }

    // Renderizar itens do carrinho
    function renderizarItensCarrinho(carrinho) {
        if (!cartItems) return;
        
        cartItems.innerHTML = carrinho.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="${item.nome}">
                </div>
                <div class="item-details">
                    <h4 class="item-name">${item.nome}</h4>
                    <p class="item-price">R$ ${item.preco}/dia</p>
                    <div class="item-actions">
                        <button class="btn-remove" onclick="removerItem('${item.id}')">
                            🗑️ Remover
                        </button>
                    </div>
                </div>
                <div class="item-controls">
                    <div class="quantity-controls">
                        <button class="btn-quantity" onclick="alterarQuantidade('${item.id}', -1)">-</button>
                        <span class="quantity">${item.quantidade}</span>
                        <button class="btn-quantity" onclick="alterarQuantidade('${item.id}', 1)">+</button>
                    </div>
                    <div class="item-total">
                        R$ ${(item.preco * item.quantidade).toFixed(2)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Calcular totais
    function calcularTotais(carrinho) {
        const subtotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
        const taxes = subtotal * 0.10; // 10% de taxas
        const total = subtotal + taxes;

        if (subtotalElement) subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        if (taxesElement) taxesElement.textContent = `R$ ${taxes.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `R$ ${total.toFixed(2)}`;
    }

    // Remover item do carrinho
    window.removerItem = function(id) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        carrinho = carrinho.filter(item => item.id !== id);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        carregarCarrinho();
    }

    // Alterar quantidade
    window.alterarQuantidade = function(id, change) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const item = carrinho.find(item => item.id === id);
        
        if (item) {
            item.quantidade += change;
            
            if (item.quantidade <= 0) {
                carrinho = carrinho.filter(item => item.id !== id);
            }
            
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            carregarCarrinho();
        }
    }

    // Finalizar compra
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            
            if (carrinho.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }

            // Simular processo de checkout
            alert('Reserva realizada com sucesso! Redirecionando...');
            localStorage.removeItem('carrinho');
            window.location.href = 'index.html';
        });
    }

    // Configurar datas mínimas
    const hoje = new Date().toISOString().split('T')[0];
    const pickupDate = document.getElementById('pickup-date');
    const returnDate = document.getElementById('return-date');
    
    if (pickupDate) {
        pickupDate.min = hoje;
        pickupDate.addEventListener('change', function() {
            if (returnDate) {
                returnDate.min = this.value;
            }
        });
    }

    // Inicializar
    carregarCarrinho();
});

// Função global para atualizar contador (usada pelo carros.js)
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const countElement = document.querySelector('.cart-count');
    
    if (countElement) {
        countElement.textContent = totalItens;
    }
}

// Inicializar contador quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    atualizarContadorCarrinho();
});