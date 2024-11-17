import { auth } from './firebase.js';
import { sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js';

const form = document.getElementById('recoverPasswordForm');
const messageElement = document.getElementById('message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value;

    try {
        await sendPasswordResetEmail(auth, email);
        // Exibe a mensagem de sucesso
        messageElement.textContent = 'E-mail de redefinição enviado com sucesso!';
        messageElement.classList.remove('hidden', 'error');
        messageElement.classList.add('success');
    } catch (error) {
        console.error('Erro ao enviar o e-mail de redefinição:', error);
        // Exibe a mensagem de erro
        messageElement.textContent = `Erro: ${error.message}`;
        messageElement.classList.remove('hidden', 'success');
        messageElement.classList.add('error');
    }
});
