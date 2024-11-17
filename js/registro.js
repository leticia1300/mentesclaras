import { auth, database, createUserWithEmailAndPassword, ref, set } from './firebase.js';

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const companhia = document.getElementById("companhia").value;
    const cidade = document.getElementById("cidade").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Definir cargo automaticamente com base na página
    const cargo = getCargo();

    // Chama a função de registro com o cargo
    registerUser(nome, cargo, companhia, cidade, email, password)
        .then(() => {
            alert('Cadastro realizado com sucesso!');
            window.location.href = "../html/login.html"; // Redireciona para a página de login
        })
        .catch((error) => {
            alert(`Erro ao registrar: ${error.message}`);
        });
});

// Função para obter o cargo automaticamente
function getCargo() {
    // Aqui você pode verificar qual página está sendo carregada
    // No caso de 'cadastro_usuario.html', definimos o cargo como "cliente"
    if (window.location.pathname.includes("cadastro_usuario.html") || window.location.pathname.includes("cadastro_usuario")) {
        return "cliente";  // Para a página de cadastro de usuário, o cargo será "cliente"
    }  else if (window.location.pathname.includes("cadastro_psicologo.html")|| window.location.pathname.includes("cadastro_psicologo")) {
        return "psicologo";  // Para a página de cadastro de usuário, o cargo será "cliente"
    } else if (window.location.pathname.includes("cadastro_rh.html")|| window.location.pathname.includes("cadastro_rh")) {
        return "rh";  // Para a página de cadastro de usuário, o cargo será "cliente"
    } 
    // Defina outros cargos para outras páginas, se necessário
    return "desconhecido";  // Um cargo padrão
}

// Função para registrar o usuário
function registerUser(nome, cargo, companhia, cidade, email, password) {
    return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                const userId = user.uid;
                set(ref(database, 'usuarios/' + userId), {
                    nome: nome,
                    cargo: cargo,  // Inclui o cargo no banco de dados
                    companhia: companhia,
                    cidade: cidade,
                    email: email
                })
                .then(() => {
                    console.log("Usuário cadastrado e informações salvas no banco de dados!");
                    resolve();
                })
                .catch((error) => {
                    console.error("Erro ao salvar informações no banco de dados: ", error);
                    reject(error);
                });

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Erro ao cadastrar usuário: ", errorCode, errorMessage);
                reject(new Error(errorMessage));
            });
    });
}