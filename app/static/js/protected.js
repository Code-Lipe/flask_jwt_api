// ====================================================================
// Variáveis e Constantes
// ====================================================================

// Obtém a URL base da aplicação a partir do navegador
const API_BASE_URL = window.location.origin;

// Define a URL do endpoint da API protegida
const PROTECTED_URL = `${API_BASE_URL}/protected`;

// Seleciona o botão de logout e obtém o token do armazenamento local
const logoutBtn = document.getElementById('logout-btn');
const token = localStorage.getItem('access_token');

// ====================================================================
// Lógica de Autenticação e Redirecionamento
// ====================================================================

// Verifica se existe um token no armazenamento local.
// Se não houver, redireciona o usuário para a página de login.
// Esta é a primeira linha de defesa no frontend.
if (!token) {
    window.location.href = '/login';
}

// ====================================================================
// Lógica de Logout
// ====================================================================

/**
 * Adiciona um ouvinte de evento de clique ao botão de logout.
 * Remove o token do armazenamento local e redireciona para a página de login.
 */
logoutBtn.addEventListener('click', ()=> {
    localStorage.removeItem('access_token')
    window.location.href = '/login';
});

// ====================================================================
// Lógica para Obter Dados Protegidos
// ====================================================================

/**
 * Função assíncrona para buscar dados do endpoint protegido.
 * Envia o token JWT no cabeçalho da requisição para autorização.
 */
async function getProtectedData() {
    try {
        // Faz a requisição para a API protegida, incluindo o cabeçalho de autorização
        const response = await fetch(PROTECTED_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Verifica se a resposta foi bem-sucedida
        if (response.ok) {
            const data = await response.json();
            const loggedInAsEl = document.getElementById('logged-in-as');
            if (loggedInAsEl) {
                // Preenche o elemento da página com o nome de usuário retornado
                loggedInAsEl.textContent = data.logged_in_as;
            }
        } else {
            // Se a resposta não for OK (ex: 401 Unauthorized), remove o token
            // e redireciona para o login.
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
    } catch (error) {
        // Em caso de erro de rede, assume que o token é inválido e redireciona.
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    }
}

// ====================================================================
// Execução Inicial
// ====================================================================

// Chama a função para buscar os dados protegidos assim que a página é carregada.
getProtectedData();