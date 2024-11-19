import { fetchUsers } from './users.js';

document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.getElementById('calendar');
    const appointmentsTable = document.getElementById('appointments-table');
    let usersData = []; // Para armazenar os dados dos usuários
    let selectedDate = ''; // Data selecionada no calendário

    // Função para gerar o calendário do mês atual
    function generateCalendar() {
        if (!Array.isArray(usersData) || usersData.length === 0) {
            console.error("Nenhum dado de usuário disponível para gerar o calendário.");
            return;
        }

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

                    // Marca os dias que têm agendamentos (iterando sobre os mapas de data:hora)
                    if (usersData.some(user => {
                        // Verifica se o usuário tem um agendamento para o dia
                        return user.data && Object.keys(user.data).some(key => key.startsWith(dateStr));
                    })) {
                        dayCell.classList.add('has-appointment');
                    }

                    // Adiciona um evento de clique para selecionar o dia
                    dayCell.addEventListener('click', () => {
                        selectedDate = dateStr;
                        document.querySelectorAll('#calendar div').forEach(cell => cell.classList.remove('selected'));
                        dayCell.classList.add('selected');
                        fetchAndDisplayAppointments(selectedDate); // Chama a função para filtrar os agendamentos pela data
                    });

                    calendarElement.appendChild(dayCell);
                    currentDay++;
                }
            }
        }
    }

    // Função para buscar e exibir agendamentos para uma data específica
    function fetchAndDisplayAppointments(date) {
        if (!date) {
            console.error("Data inválida ou não selecionada.");
            return;
        }

        // Filtra os usuários para encontrar agendamentos para a data específica
        const filteredUsers = usersData.filter(user => {
            return user.data && Object.keys(user.data).some(key => key.startsWith(date)); // Garantir que 'data' não seja null
        });

        // Exibe os agendamentos filtrados
        displayAppointments(filteredUsers, date);
    }

    // Função para exibir os agendamentos na tabela
    // Função para exibir os agendamentos na tabela
    function displayAppointments(users, date) {
        const appointmentsBody = document.getElementById('appointments-body');
        const noDataMessage = document.getElementById('no-data-message');

        if (!appointmentsBody) {
            console.error("Elemento 'appointments-body' não encontrado no DOM");
            return;
        }

        if (!noDataMessage) {
            console.error("Elemento 'no-data-message' não encontrado no DOM");
            return;
        }

        if (!users || users.length === 0) {
            noDataMessage.style.display = 'table-row'; // Exibe a mensagem de nenhum dado
        } else {
            noDataMessage.style.display = 'none'; // Esconde a mensagem de nenhum dado
        }

        appointmentsBody.innerHTML = ''; // Limpa as linhas de agendamentos

        users.forEach(user => {
            // Filtra os agendamentos para a data específica
            const appointmentsForDay = Object.entries(user.data)
                .filter(([key, value]) => key.startsWith(date)) // Só mantém as chaves que começam com a data
                .map(([key, value]) => {
                    let formattedTime = ''; // Variável para armazenar o horário formatado

                    // Verifica se a chave contém a data e a hora
                    if (value) {
                        // Se a chave do banco de dados contém hora (ex: '2024-11-18' e valor '14:30')
                        const [year, month, day] = key.split("-");  // Divide a data em ano, mês e dia
                        const [hour, minute] = value.split(":"); // Divide a hora em hora e minuto

                        // Cria um objeto Date com a data e a hora
                        const dateObj = new Date(year, month - 1, day, hour, minute);

                        // Formata a data com a hora
                        formattedTime = dateObj.toLocaleString('pt-BR', {
                            weekday: 'short',  // Exibe o dia da semana
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    } else {
                        // Se o valor for vazio ou indefinido, usamos uma hora padrão
                        const [year, month, day] = key.split("-");
                        formattedTime = `Seg., ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}, 00:00`;
                    }

                    // Retorna os dados de agendamento
                    return {
                        time: formattedTime, // Hora formatada
                        nome: user.nome || 'Nome não disponível',
                        companhia: user.companhia || 'Companhia não disponível',
                        email: user.email || 'Email não disponível',
                        telefone: user.telefone || 'Telefone não disponível',
                        data: value // Valor de hora
                    };
                })
                .filter(appointment => appointment !== null); // Remove valores nulos, se existirem

            appointmentsForDay.forEach(appointment => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${appointment.nome}</td>
                <td>${appointment.companhia}</td>
                <td>${appointment.email}</td>
                <td>${appointment.telefone}</td>
                <td>${appointment.time}</td>
            `;
                appointmentsBody.appendChild(row);
            });
        });
    }


    // Função para popular a tabela com os dados dos usuários
    function populateUserTable(users) {
        if (!users || typeof users !== 'object') {
            console.error("Os dados dos usuários não estão no formato esperado.");
            return;
        }

        // Convertendo o objeto retornado pelo Firebase para um array de objetos
        usersData = Object.values(users); // Agora usersData será um array de objetos
        generateCalendar(); // Atualiza o calendário com os dados dos usuários
    }

    // Gera o calendário e preenche a tabela com os usuários ao carregar os dados do Firebase
    fetchUsers().then(users => {
        populateUserTable(users);
    }).catch(error => {
        console.error("Erro ao carregar os usuários:", error);
    });
});
