// ====================================================================
// Variáveis e Constantes
// ====================================================================

// Obtém a URL base da aplicação a partir do navegador
const API_BASE_URL = window.location.origin;

// Define as URLs completas dos endpoints da nossa API
const REGISTER_URL = `${API_BASE_URL}/register`;
const LOGIN_URL = `${API_BASE_URL}/login`;


// Seleciona os elementos do DOM para os formulários e a área de mensagens
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const messageEl = document.getElementById('message');

// ====================================================================
// Funções de Utilidade
// ====================================================================

/**
 * Exibe uma mensagem de feedback na tela do usuário.
 * @param {string} message - A mensagem a ser exibida.
 * @param {string} type - O tipo de alerta do Bootstrap ('success', 'danger', etc.).
 */
function showMessage(message, type = 'danger') {
    messageEl.textContent = message;
    messageEl.className = `alert alert-${type} d-block`;
}

/**
 * Esconde a mensagem de feedback após um tempo determinado.
 */
function clearMessage() {
    // Usa um timer para remover a classe de exibição
    setTimeout(() => {
        messageEl.className = 'alert d-none';
    }, 5000);
}

// ====================================================================
// Lógica de Cadastro (Register)
// ====================================================================

/**
 * Lida com o envio do formulário de cadastro.
 */
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // Coleta os valores dos campos de input
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            // Faz a requisição POST para o endpoint de registro
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            // Verifica se a requisição foi bem-sucedida (status 200-299)
            if (response.ok) {
                showMessage(data.message, 'success');
                registerForm.reset(); // Limpa os campos do formulário
            } else {
                showMessage(data.message);
            }
        } catch (error) {
            // Captura e exibe erros de rede
            showMessage('Erro na requisição. Tente novamente mais tarde.');
        }

        clearMessage(); // Limpa a mensagem após 5 segundos
    });
}

// ====================================================================
// Lógica de Login (Login)
// ====================================================================

/**
 * Lida com o envio do formulário de login.
 */
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        // Coleta os valores dos campos de input
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        try {
            // Faz a requisição POST para o endpoint de login
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            // Verifica se a requisição foi bem-sucedida
            if (response.ok) {
                // Salva o token JWT no armazenamento local do navegador
                localStorage.setItem('access_token', data.access_token);
                showMessage('Login realizado com sucesso!', 'success');
                
                // Redireciona o usuário para a página do dashboard após um pequeno delay
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                showMessage(data.message);
            }
        } catch (error) {
            // Captura e exibe erros de rede
            showMessage('Erro na requisição. Tente novamente mais tarde.');
        }

        clearMessage(); // Limpa a mensagem após 5 segundos
    });
}