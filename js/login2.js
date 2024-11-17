// Função para redirecionar para a página inicial
function voltarInicio() {
    window.location.href = "index.html"; // Caminho da página inicial
}

// Adiciona um evento ao formulário de login
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    // Obtém os valores do e-mail e senha
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Valida as credenciais
    if (email === "psicologo@menteclara.com" && password === "1") {
        // Redireciona para a página do dashboard
        window.location.href = "../html/dashboard_psicologo.html";

    }
    else if (email === "rh@menteclara.com" && password === "1") {
        // Redireciona para a página do dashboard
        window.location.href = "../html/dashboard_rh.html";

    }

    else if (email === "cliente@menteclara.com" && password === "1") {
        // Redireciona para a página do dashboard
        window.location.href = "../html/agenda.html";

    }
    else {

        alert("E-mail ou senha incorretos. Tente novamente.");
    }
});
