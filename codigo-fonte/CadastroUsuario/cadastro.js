document.addEventListener('DOMContentLoaded', function () {
    // Elementos do formulário
    const registerForm = document.querySelector('.register-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const documentInput = document.getElementById('document');
    const whatsappInput = document.getElementById('whatsapp');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const termsCheckbox = document.getElementById('terms');

    // Chave secreta para criptografia (DEVE SER A MESMA USADA NO LOGIN!)
    const SECRET_KEY = "minha-chave-secreta-123";

    // =============================================
    // MÁSCARAS DE FORMULÁRIO
    // =============================================

    // Máscara para CPF/CNPJ
    documentInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length <= 11) {
            // Formata CPF (000.000.000-00)
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else {
            // Formata CNPJ (00.000.000/0000-00)
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }

        e.target.value = value;
    });

    // Máscara para WhatsApp
    whatsappInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        e.target.value = value;
    });

    // =============================================
    // VALIDAÇÕES
    // =============================================

    // Validação de senha
    function validatePassword() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('As senhas não coincidem!');
            return false;
        } else {
            confirmPasswordInput.setCustomValidity('');
            return true;
        }
    }

    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePassword);

    // Validação de termos
    termsCheckbox.addEventListener('change', function () {
        termsCheckbox.setCustomValidity(termsCheckbox.checked ? '' : 'Aceite os termos para continuar.');
    });

    // =============================================
    // SUBMIT DO FORMULÁRIO
    // =============================================

registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // 1. Validações iniciais
    if (!validatePassword()) {
        alert('As senhas não coincidem!');
        return;
    }

    if (!termsCheckbox.checked) {
        alert('Você deve aceitar os termos e condições!');
        return;
    }

    // 2. Obter valores dos campos 
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const docValue = documentInput.value.replace(/\D/g, ''); // Remove formatação para comparação
    const whatsapp = whatsappInput.value.replace(/\D/g, ''); // Remove formatação para comparação

    // 3. Validações adicionais
    if (!name || !email || !password) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }
    
    // Validação de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('E-mail inválido!');
        return;
    }

    // 4. Criptografa a senha
    const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();

    // 5. Armazena no localStorage
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const usersArray = Object.values(users);

    // Verifica se e-mail já existe
    if (users[email]) {
        alert('Este e-mail já está cadastrado!');
        return;
    }

    // Verifica se CPF/CNPJ já existe
    const documentExists = usersArray.some(user => 
        user.document && user.document.replace(/\D/g, '') === docValue
    );
    if (documentExists) {
        alert('Este CPF/CNPJ já está cadastrado!');
        return;
    }

    // Verifica se WhatsApp já existe (opcional)
    const whatsappExists = usersArray.some(user => 
        user.whatsapp && user.whatsapp.replace(/\D/g, '') === whatsapp
    );
    if (whatsappExists) {
        alert('Este número de WhatsApp já está cadastrado!');
        return;
    }

    // Se todas as verificações passarem, cadastra o usuário
    users[email] = {
        name: name,
        email: email,
        password: encryptedPassword,
        document: documentInput.value, // Mantém a formatação para exibição
        whatsapp: whatsappInput.value // Mantém a formatação para exibição
    };

    localStorage.setItem('users', JSON.stringify(users));

    // 6. Feedback e redirecionamento
    alert('Cadastro realizado com sucesso! Redirecionando para login...');
    window.location.href = '../HomePage/index.html';
});
}
);

    // teste
