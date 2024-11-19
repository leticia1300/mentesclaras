import { fetchUsers } from './users.js';  // Importando a função de User.js
import { database, ref, get, set } from './firebase.js';

function toggleStatus(button) {
    const status = button.textContent.trim();
    const newStatus = status === "Ativo" ? "Inativo" : "Ativo";

    button.textContent = newStatus;
    button.classList.toggle('active');
    button.classList.toggle('inactive');

    const userId = button.getAttribute('data-user-id');
    const userRef = ref(database, 'usuarios/' + userId);

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            const updatedUserData = {
                ...userData,
                status: newStatus
            };

            set(userRef, updatedUserData).then(() => {
                console.log("Status atualizado com sucesso no Firebase");
            }).catch((error) => {
                console.error("Erro ao atualizar o status no Firebase:", error);
            });
        } else {
            console.error("Usuário não encontrado no Firebase.");
        }
    }).catch((error) => {
        console.error("Erro ao acessar dados do usuário no Firebase:", error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const tableBodies = {
        cliente: document.querySelector("#cliente-table tbody"),
        psicologo: document.querySelector("#psicologo-table tbody"),
        rh: document.querySelector("#rh-table tbody"),
    };

    // Função genérica para preencher qualquer tabela com base no cargo
    function populateTable(users, cargo) {
        const tableBody = tableBodies[cargo];
        tableBody.innerHTML = "";  // Limpa a tabela

        for (let userId in users) {
            const user = users[userId];
            if (user.cargo === cargo) {  // Verifica o cargo do usuário
                const row = document.createElement('tr');
                row.dataset.userId = userId;  // Usar um único dataset chave para todos

                row.innerHTML = `
                    <td>${user.nome}</td>
                    <td>${user.companhia}</td>
                    <td>${user.telefone}</td>
                    <td>${user.email}</td>
                    <td>${user.cidade}</td>
                    <td><button class="status-btn ${user.status === 'Ativo' ? 'active' : 'inactive'}" data-user-id="${userId}">${user.status}</button></td>
                `;
                tableBody.appendChild(row);
            }
        }

        // Adiciona os eventos de clique nos botões de status
        const statusButtons = tableBody.querySelectorAll('.status-btn');
        statusButtons.forEach(button => {
            button.addEventListener('click', function () {
                toggleStatus(button);
            });
        });
    }

    // Chama a função fetchUsers e popula as tabelas com os dados dos usuários
    fetchUsers().then(users => {
        populateTable(users, 'cliente');
        populateTable(users, 'psicologo');
        populateTable(users, 'rh');
    });
});