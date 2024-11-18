import { fetchUsers } from './users.js';

document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.getElementById('calendar');
    const appointmentsTable = document.getElementById('appointments-table');
    let usersData = []; // Para armazenar os dados dos usuários
    let selectedDate = ''; // Data selecionada no calendário

    // Função para gerar o calendário do mês atual
    function generateCalendar() {
        const date = new Date();
        const month = date.getMonth(); // Mês atual (0-11)
        const year = date.getFullYear(); // Ano atual

        const firstDay = new Date(year, month, 1); // Primeiro dia do mês
        const lastDay = new Date(year, month + 1, 0); // Último dia do mês

        const daysInMonth = lastDay.getDate(); // Quantos dias tem o mês
        const startingDay = firstDay.getDay(); // Dia da semana do primeiro dia do mês (0: domingo, 1: segunda-feira, etc.)

        calendarElement.innerHTML = ''; // Limpa o calendário atual

        // Cabeçalhos dos dias da semana
        const headers = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        headers.forEach(day => {
            const headerElement = document.createElement('div');
            headerElement.classList.add('header');
            headerElement.textContent = day;
            calendarElement.appendChild(headerElement);
        });

        // Preenchendo o calendário com os dias
        let currentDay = 1;
        for (let i = 0; i < 6; i++) { // 6 linhas para cobrir todos os dias
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < startingDay) {
                    // Preenche com vazio antes do primeiro dia do mês
                    const emptyCell = document.createElement('div');
                    calendarElement.appendChild(emptyCell);
                } else if (currentDay <= daysInMonth) {
                    const dayCell = document.createElement('div');
                    dayCell.textContent = currentDay;

                    // Verifica se o dia tem agendamentos
                    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;

                    // Marca os dias que têm agendamentos
                    if (usersData.some(user => user.data === dateStr)) {
                        dayCell.classList.add('has-appointment');
                    }

                    // Adiciona um evento de clique para selecionar o dia
                    dayCell.addEventListener('click', () => {
                        selectedDate = dateStr;
                        document.querySelectorAll('#calendar div').forEach(cell => cell.classList.remove('selected'));
                        dayCell.classList.add('selected');
                        fetchAndDisplayAppointments(selectedDate); // Chama a função para filtrar os contatos pela data
                    });

                    calendarElement.appendChild(dayCell);
                    currentDay++;
                }
            }
        }
    }

    // Função para buscar e exibir agendamentos para uma data específica
    function fetchAndDisplayAppointments(date) {
        const filteredUsers = usersData.filter(user => user.data === date);
        displayAppointments(filteredUsers);
    }

    // Função para exibir os agendamentos na tabela
    function displayAppointments(appointments) {
        const appointmentsBody = document.getElementById('appointments-body');
        const noDataMessage = document.getElementById('no-data-message');

        if (!noDataMessage) {
            console.error("Elemento 'no-data-message' não encontrado no DOM");
            return;
        }

        if (!appointments || appointments.length === 0) {
            noDataMessage.style.display = 'table-row'; // Exibe a mensagem de nenhum dado
        } else {
            noDataMessage.style.display = 'none'; // Esconde a mensagem de nenhum dado
        }

        appointmentsBody.innerHTML = ''; // Limpa as linhas de agendamentos

        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.nome}</td>
                <td>${appointment.companhia}</td>
                <td>${appointment.email}</td>
                <td>${appointment.telefone}</td>
                <td>${appointment.data}</td>
            `;
            appointmentsBody.appendChild(row);
        });
    }



    // Função para popular a tabela com os dados dos usuários
    function populateUserTable(users) {
        if (users && typeof users === 'object') {
            // Convertendo o objeto retornado pelo Firebase para um array de objetos
            usersData = Object.values(users); // Agora usersData será um array de objetos
            generateCalendar(); // Atualiza o calendário com os dados dos usuários
        } else {
            console.error("Os dados dos usuários não estão no formato esperado.");
        }
    }

    // Gera o calendário e preenche a tabela com os usuários ao carregar os dados do Firebase
    fetchUsers().then(users => {
        populateUserTable(users);
    }).catch(error => {
        console.error("Erro ao carregar os usuários:", error);
    });
});
