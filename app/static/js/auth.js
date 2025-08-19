// URLs da nossa API
const API_BASE_URL = window.location.origin;
const REGISTER_URL = `${API_BASE_URL}/register`;
const LOGIN_URL = `${API_BASE_URL}/login`;
const PROTECTED_URL = `${API_BASE_URL}/protected`;

// Elementos do DOM
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const messageEl = document.getElementById('message');

// Função para exibir mensagens
function showMessage(message, type = 'danger') {
    messageEl.textContent = message;
    messageEl.className = `alert alert-${type} d-block`;
}

// Limpar mensagens após 5 segundos
function clearMessage() {
    setTimeout(() => {
        messageEl.className = 'alert d-none';
    }, 5000);
}

// Lógica de Cadastro
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(data.message, 'success');
                registerForm.reset();
            } else {
                showMessage(data.message);
            }
        } catch (error) {
            showMessage('Erro na requisição. Tente novamente mais tarde.');
        }

        clearMessage();
    });
}

// Lógica de Login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Salvar o JWT no Local Storage
                localStorage.setItem('access_token', data.access_token);
                showMessage('Login realizado com sucesso!', 'success');
                // Redirecionar para a página protegida após o login
                setTimeout(() => {
                    window.location.href = '/protected';
                }, 1500);
            } else {
                showMessage(data.message);
            }
        } catch (error) {
            showMessage('Erro na requisição. Tente novamente mais tarde.');
        }

        clearMessage();
    });
}