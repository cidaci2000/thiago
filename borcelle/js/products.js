// Sistema de produtos
let allProducts = [];

// Dados dos carros (serão substituídos pelo PHP)
const sampleCars = [
    {
        id: 1,
        name: "Tesla Model S",
        category: "luxury",
        price: 350,
        image: "https://via.placeholder.com/300x180/1a3a6c/ffffff?text=Tesla+Model+S",
        details: "Elétrico • 670km autonomia • 0-100km/h em 2.1s"
    },
    {
        id: 2,
        name: "Audi e-tron GT",
        category: "luxury",
        price: 400,
        image: "https://via.placeholder.com/300x180/1a3a6c/ffffff?text=Audi+e-tron+GT",
        details: "Elétrico • 487cv • 0-100km/h em 3.3s"
    },
    {
        id: 3,
        name: "Porsche Taycan",
        category: "sports",
        price: 450,
        image: "https://via.placeholder.com/300x180/1a3a6c/ffffff?text=Porsche+Taycan",
        details: "Elétrico • 761cv • 0-100km/h em 2.8s"
    },
    {
        id: 4,
        name: "BMW i8",
        category: "sports",
        price: 380,
        image: "https://via.placeholder.com/300x180/1a3a6c/ffffff?text=BMW+i8",
        details: "Híbrido • 374cv • 0-100km/h em 4.4s"
    },
    {
        id: 5,
        name: "Toyota Corolla",
        category: "economy",
        price: 120,
        image: "https://via.placeholder.com/300x180/1a3a6c/ffffff?text=Toyota+Corolla",
        details: "Híbrido • 16.4km/l • 5 lugares"
    },
    {
        id: 6,
        name: "Honda Civic",
        category: "economy",
        price: 110,
        image: "https://via.placeholder.com/300x180/1a3a6c/ffffff?text=Honda+Civic",
        details: "2.0 Flex • 14.2km/l • 5 lugares"
    },
    {
        id: 7,
        name: "Jeep Compass",
        category: "suv",
        price: 180,
        image: "https://via.placeholder.com/300x180/1a3a6c/ffffff?text=Jeep+Compass",
        details: "1.3 Turbo • 8.5km/l • 5 lugares"
    },
    {
        id: 8,
        name: "Toyota RAV4",
        category: "suv",
        price: 200,
        image: "https://via.placeholder.com/300x180/1a3a6c/ffffff?text=Toyota+RAV4",
        details: "Híbrido • 15.8km/l • 5 lugares"
    }
];

function loadProducts() {
    // Em produção, buscar do PHP
    allProducts = sampleCars;
    displayProducts(allProducts);
    
    // Configurar filtros
    setupFilters();
}

function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';

    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="empty-cart">Nenhum carro encontrado.</p>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-details">${product.details}</div>
                <div class="product-price">R$ ${product.price}/dia</div>
                <div class="product-actions">
                    <button class="details-btn">Detalhes</button>
                    <button class="add-to-cart" data-id="${product.id}">Alugar</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Adicionar event listeners aos botões
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    function applyFilters() {
        let filteredProducts = [...allProducts];

        // Filtrar por categoria
        if (categoryFilter.value !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.category === categoryFilter.value
            );
        }

        // Filtrar por preço
        if (priceFilter.value !== 'all') {
            const [min, max] = priceFilter.value.split('-').map(val => 
                val === '+' ? Infinity : parseInt(val)
            );
            filteredProducts = filteredProducts.filter(product => {
                if (max === Infinity) {
                    return product.price >= min;
                }
                return product.price >= min && product.price <= max;
            });
        }

        // Filtrar por busca
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm)
            );
        }

        displayProducts(filteredProducts);
    }

    categoryFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);
    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });
}