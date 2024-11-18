import { auth, signInWithEmailAndPassword, database, ref, get } from './firebase.js';

// Função para redirecionar para a página inicial
function voltarInicio() {
    window.location.href = "../index.html"; // Caminho da página inicial
}

// Adiciona um evento ao formulário de login
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    // Obtém os valores do e-mail e senha
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Tenta autenticar com Firebase
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;  // Usuário autenticado
            console.log('Usuário autenticado com sucesso:', user.email);

            // Após a autenticação, pegar as informações do usuário no banco de dados
            const userId = user.uid;  // ID único do usuário no Firebase
            get(ref(database, 'usuarios/' + userId))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();  // Dados do usuário
                        console.log("Informações do usuário: ", userData);

                        // Verifica o cargo do usuário e faz o redirecionamento
                        if (userData.status === 'Ativo') {
                            if (userData.cargo === 'rh') {
                                // Se o cargo for 'rh', redireciona para a página do RH
                                window.location.href = "../html/dashboard_rh.html";
                            } else if (userData.cargo === 'cliente') {

                                // Se o cargo não for 'rh', redireciona para a página do usuário
                                window.location.href = "../html/agenda_cliente.html";
                            } else if (userData.cargo === 'psicologo') {
                                // Se o cargo não for 'rh', redireciona para a página do usuário
                                window.location.href = "../html/dashboard_psicologo.html";
                            }
                        } else {
                            console.log("Você está desativado.");
                        }

                    } else {
                        console.log("Nenhuma informação encontrada para o usuário.");
                    }
                })
                .catch((error) => {
                    console.error("Erro ao pegar dados do usuário:", error);
                });

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Erro ao fazer login: " + errorMessage);
            console.log(`Erro (${errorCode}): ${errorMessage}`);
        });
});
