const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', () => {
    // Remove o token do Local Storage
    localStorage.removeItem('access_token');
    // Redireciona para a página de login
    window.location.href = '/login';
});