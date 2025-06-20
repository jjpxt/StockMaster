document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    const loginInput = document.getElementById('email'); // Mudamos o ID para 'login' no HTML
    const passwordInput = document.getElementById('password');
    const SECRET_KEY = "minha-chave-secreta-123";

    // Função para descriptografar
    const decryptPassword = (encrypted) => {
        try {
            const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error("Erro na descriptografia:", error);
            return null;
        }
    };

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();

        if (!login || !password) {
            alert('Preencha todos os campos!');
            return;
        }

        // Obtém todos os usuários
        const users = JSON.parse(localStorage.getItem('users')) || {};
        let user = null;

        // Busca por e-mail OU nome
        for (const key in users) {
            if (key === login || users[key].name.toLowerCase() === login.toLowerCase()) {
                user = users[key];
                break;
            }
        }

        if (!user) {
            alert('Credenciais não encontradas!');
            return;
        }

        // Verifica a senha
        const decryptedPassword = decryptPassword(user.password);
        
        if (decryptedPassword === password) {
            // Login bem-sucedido
            localStorage.setItem('currentUser', JSON.stringify({
                email: user.email,
                name: user.name,
                loggedIn: true
            }));
            
            alert(`Bem-vindo, ${user.name}!`);
            window.location.href = '../Dashboard/dashboard.html';
        } else {
            alert('Senha incorreta!');
        }
    });
});