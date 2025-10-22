// carros.js - Versão Simplificada e Funcional
document.addEventListener('DOMContentLoaded', function() {
    console.log('Carros.js carregado!');
    
    // Configurar filtros
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const techFilter = document.getElementById('tech-filter');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const resetBtn = document.getElementById('reset-filters');
    const sortFilter = document.getElementById('sort-filter');

    // Sistema de Filtros (mantém o original)
    function filtrarEOrdenarCarros() {
        const categoria = categoryFilter ? categoryFilter.value : 'all';
        const preco = priceFilter ? priceFilter.value : 'all';
        const tecnologia = techFilter ? techFilter.value : 'all';
        const busca = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const ordenacao = sortFilter ? sortFilter.value : 'name';

        const carCards = document.querySelectorAll('.car-card');
        let carrosVisiveis = 0;

        carCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardPrice = parseInt(card.getAttribute('data-price'));
            const cardTech = card.getAttribute('data-tech');
            const cardName = card.querySelector('.car-name').textContent.toLowerCase();
            const cardDesc = card.querySelector('.car-description').textContent.toLowerCase();

            let show = true;

            if (categoria !== 'all' && cardCategory !== categoria) show = false;
            if (preco !== 'all') {
                const [min, max] = preco.split('-').map(val => val === '+' ? Infinity : parseInt(val));
                if (max === Infinity) {
                    if (cardPrice < min) show = false;
                } else {
                    if (cardPrice < min || cardPrice > max) show = false;
                }
            }
            if (tecnologia !== 'all' && !cardTech.includes(tecnologia)) show = false;
            if (busca) {
                if (!cardName.includes(busca) && !cardDesc.includes(busca)) show = false;
            }

            if (show) {
                carrosVisiveis++;
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Atualizar contador
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = `${carrosVisiveis} ${carrosVisiveis === 1 ? 'carro encontrado' : 'carros encontrados'}`;
        }
    }

    // Event listeners para filtros
    if (categoryFilter) categoryFilter.addEventListener('change', filtrarEOrdenarCarros);
    if (priceFilter) priceFilter.addEventListener('change', filtrarEOrdenarCarros);
    if (techFilter) techFilter.addEventListener('change', filtrarEOrdenarCarros);
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(filtrarEOrdenarCarros, 300);
        });
    }
    if (searchBtn) searchBtn.addEventListener('click', filtrarEOrdenarCarros);
    if (sortFilter) sortFilter.addEventListener('change', filtrarEOrdenarCarros);
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (categoryFilter) categoryFilter.value = 'all';
            if (priceFilter) priceFilter.value = 'all';
            if (techFilter) techFilter.value = 'all';
            if (searchInput) searchInput.value = '';
            if (sortFilter) sortFilter.value = 'name';
            filtrarEOrdenarCarros();
        });
    }

    // **SISTEMA INFALÍVEL PARA BOTÕES ALUGAR**
    function configurarBotoesAlugar() {
        console.log('Configurando botões alugar...');
        
        const botoesAlugar = document.querySelectorAll('.btn-rent');
        console.log(`Encontrados ${botoesAlugar.length} botões alugar`);
        
        botoesAlugar.forEach(botao => {
            // Remove qualquer evento anterior
            botao.onclick = null;
            
            // Adiciona novo evento DIRETO
            botao.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('BOTÃO ALUGAR CLICADO!');
                
                const card = this.closest('.car-card');
                if (!card) return;
                
                const nomeCarro = card.querySelector('.car-name').textContent;
                const precoCarro = parseInt(card.getAttribute('data-price'));
                
                console.log('Adicionando ao carrinho:', nomeCarro, precoCarro);
                
                // ADICIONAR AO CARRINHO
                let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
                
                // Gerar ID único
                const carroId = `carro-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                
                // Verificar se já existe um carro com mesmo nome
                const carroExistente = carrinho.find(item => item.nome === nomeCarro);
                
                if (carroExistente) {
                    carroExistente.quantidade += 1;
                } else {
                    carrinho.push({
                        id: carroId,
                        nome: nomeCarro,
                        preco: precoCarro,
                        quantidade: 1
                    });
                }
                
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                console.log('Carrinho atualizado:', carrinho);
                
                // ATUALIZAR CONTADOR
                atualizarContadorCarrinho();
                
                // FEEDBACK VISUAL
                this.innerHTML = '✓ Adicionado!';
                this.style.background = '#00ff88';
                this.disabled = true;
                
                setTimeout(() => {
                    this.innerHTML = '🚀 Alugar';
                    this.style.background = '';
                    this.disabled = false;
                }, 2000);
                
                // MENSAGEM DE SUCESSO
                mostrarMensagemSucesso(nomeCarro);
            });
        });
    }

    // Função para mostrar mensagem de sucesso
    function mostrarMensagemSucesso(nomeCarro) {
        const mensagem = document.createElement('div');
        mensagem.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(45deg, #00ff88, #00cc66);
            color: #000;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 5px 15px rgba(0,255,136,0.4);
            border: 2px solid #00ff88;
            font-family: 'Exo 2', sans-serif;
        `;
        mensagem.textContent = `✅ ${nomeCarro} adicionado ao carrinho!`;
        
        document.body.appendChild(mensagem);
        
        setTimeout(() => {
            mensagem.remove();
        }, 3000);
    }

    // Função para atualizar contador do carrinho
    function atualizarContadorCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        
        // Atualizar no header da página atual
        const countElement = document.querySelector('.cart-count');
        if (countElement) {
            countElement.textContent = totalItens;
        }
        
        console.log('Contador atualizado:', totalItens);
    }

    // Configurar botões quando a página carrega
    configurarBotoesAlugar();
    
    // Re-configurar quando os filtros mudam
    if (categoryFilter) categoryFilter.addEventListener('change', configurarBotoesAlugar);
    if (priceFilter) priceFilter.addEventListener('change', configurarBotoesAlugar);
    if (techFilter) techFilter.addEventListener('change', configurarBotoesAlugar);
    if (sortFilter) sortFilter.addEventListener('change', configurarBotoesAlugar);

    // Inicializar
    filtrarEOrdenarCarros();
    atualizarContadorCarrinho();
});

// Função verDetalhes (mantida)
function verDetalhes(carroId) {
    alert('Detalhes do carro ' + carroId);
}

console.log('Script carros.js carregado!');