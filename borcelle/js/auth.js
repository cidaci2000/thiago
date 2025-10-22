// Sistema de Autenticação
class AuthSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Formulário de Cadastro
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }

        // Formulário de Login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Máscaras de input
        this.setupInputMasks();
    }

    setupInputMasks() {
        // Máscara para CPF
        const cpfInput = document.getElementById('cpf');
        if (cpfInput) {
            cpfInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                    e.target.value = value;
                }
            });
        }

        // Máscara para telefone
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 11) {
                    value = value.replace(/(\d{2})(\d)/, '($1) $2');
                    value = value.replace(/(\d{5})(\d)/, '$1-$2');
                    e.target.value = value;
                }
            });
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            cpf: formData.get('cpf'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirm-password')
        };

        // Validações
        if (userData.password !== userData.confirmPassword) {
            this.showNotification('As senhas não coincidem!', 'error');
            return;
        }

        if (userData.password.length < 6) {
            this.showNotification('A senha deve ter pelo menos 6 caracteres!', 'error');
            return;
        }

        // Simular cadastro (substituir por API real)
        try {
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="spinner"></div> Criando conta...';
            submitBtn.disabled = true;

            await new Promise(resolve => setTimeout(resolve, 2000));

            // Salvar usuário no localStorage
            const user = {
                id: Date.now(),
                ...userData,
                createdAt: new Date().toISOString()
            };
            delete user.confirmPassword;
            delete user.password;

            localStorage.setItem('borcelle-user', JSON.stringify(user));
            
            this.showNotification('Conta criada com sucesso!', 'success');
            
            setTimeout(() => {
                window.location.href = 'carros.html';
            }, 1500);

        } catch (error) {
            this.showNotification('Erro ao criar conta. Tente novamente.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="spinner"></div> Entrando...';
            submitBtn.disabled = true;

            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simular login bem-sucedido
            // Em produção, isso viria da API
            const user = {
                id: 1,
                name: 'João Silva',
                email: loginData.email,
                phone: '(11) 99999-9999'
            };

            localStorage.setItem('borcelle-user', JSON.stringify(user));
            
            this.showNotification('Login realizado com sucesso!', 'success');
            
            setTimeout(() => {
                window.location.href = 'carros.html';
            }, 1000);

        } catch (error) {
            this.showNotification('E-mail ou senha incorretos!', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    checkAuthStatus() {
        const user = localStorage.getItem('borcelle-user');
        if (user) {
            this.updateUIForLoggedInUser(JSON.parse(user));
        }
    }

    updateUIForLoggedInUser(user) {
        const loginBtn = document.querySelector('.btn-login');
        const registerBtn = document.querySelector('.btn-register');
        
        if (loginBtn && registerBtn) {
            loginBtn.innerHTML = `<span class="btn-icon">👤</span> ${user.name.split(' ')[0]}`;
            loginBtn.style.pointerEvents = 'none';
            registerBtn.textContent = 'Sair';
            registerBtn.onclick = this.logout.bind(this);
        }
    }

    logout() {
        localStorage.removeItem('borcelle-user');
        localStorage.removeItem('borcelle-cart');
        window.location.href = 'index.html';
    }

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
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar sistema de autenticação
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});