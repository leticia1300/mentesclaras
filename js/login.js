import { auth, signInWithEmailAndPassword, database, ref, get } from './firebase.js';
import { deslogar } from './script.js';

// Função para redirecionar para a página inicial


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
            console.log('%cUsuário autenticado com sucesso:', 'color: green; font-weight: bold;', user.email);

            // Após a autenticação, pegar as informações do usuário no banco de dados
            const userId = user.uid;  // ID único do usuário no Firebase
            get(ref(database, 'usuarios/' + userId))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val();  // Dados do usuário
                        console.log('%cInformações do usuário:', 'color: blue; font-weight: bold;', userData);
                        if (userData.status === 'Ativo') {

                            // Verifica o cargo do usuário e faz o redirecionamento
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
                            else if (userData.cargo === 'adm') {
                                // Se o cargo não for 'adm', redireciona para a página do usuário
                                window.location.href = "../html/adm.html";
                            }
                        } else {
                            deslogar('Você foi desativado e deslogado', true)

                        }


                    } else {
                        console.warn('%cNenhuma informação encontrada para o usuário.', 'color: orange; font-weight: bold;');
                        alert("Erro ao acessar os dados do usuário. Por favor, tente novamente.");
                    }
                })
                .catch((error) => {
                    console.error('%cErro ao pegar dados do usuário:', 'color: red; font-weight: bold;', error);
                    alert("Erro ao acessar os dados do usuário. Por favor, tente novamente.");
                });

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('%cErro ao fazer login:', 'color: red; font-weight: bold;', errorMessage);
            alert("Erro ao fazer login: " + errorMessage);
        });
});
