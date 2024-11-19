import { auth, signOut } from './firebase.js';

function deslogar(mensagem, bool) {
    signOut(auth).then(() => {
        console.log(`%c${mensagem}`, 'color: red; font-weight: bold;');
        alert(mensagem);

        if (!bool) window.location.href = "../index.html";
    }).catch((error) => {
        console.error('%cErro ao deslogar:', 'color: red; font-weight: bold;', error);
        alert("Ocorreu um erro ao deslogar. Tente novamente.");
    });
}

// Adicionando evento ao link de logout dentro do dropdown
document.addEventListener('DOMContentLoaded', function () {
    // Adicionando evento ao link de logout dentro do dropdown
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function (event) {
            event.preventDefault(); // Evita o comportamento padrão de redirecionamento do link
            deslogar("Você foi deslogado com sucesso!", false); // Passa a mensagem personalizada
        });
    } else {
        console.error('O botão de logout não foi encontrado.');
    }
});


export { deslogar };