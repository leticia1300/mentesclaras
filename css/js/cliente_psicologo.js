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
    const tableBody = document.querySelector("table tbody");

    // Função para preencher a tabela com os usuários
    function populateUserTable(users) {
        tableBody.innerHTML = "";

        for (let userId in users) {
            const user = users[userId];

            const row = document.createElement('tr');
            row.dataset.clientId = userId;
            row.innerHTML = `
                <td>${user.nome}</td>
                <td>${user.companhia}</td>
                <td>${user.telefone}</td>
                <td>${user.email}</td>
                <td>${user.cidade}</td>
                <td>${user.data}</td>
                  <td>${user.hora}</td>
            
            `;
            tableBody.appendChild(row);
        }


    }

    // Chama a função fetchUsers e popula a tabela com os dados dos usuários
    fetchUsers().then(users => {
        populateUserTable(users);
    });
});
