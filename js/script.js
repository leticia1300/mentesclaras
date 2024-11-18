document.querySelectorAll('.sidebar-menu li a').forEach((link) => {
    link.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-menu li a').forEach((a) => a.classList.remove('active'));
        link.classList.add('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.getElementById('calendar');
    const contactListElement = document.getElementById('contact-list');
    
    // Dados de exemplo para os contatos
    const contacts = [
        { name: 'João Silva', company: 'TelecomX', email: 'joao@email.com', phone: '(11) 98765-4321', date: '2024-11-15' },
        { name: 'Maria Santos', company: 'Claro', email: 'maria@email.com', phone: '(21) 99876-5432', date: '2024-11-16' },
        { name: 'Pedro Almeida', company: 'Vivo', email: 'pedro@email.com', phone: '(31) 91234-5678', date: '2024-11-17' },
        { name: 'Ana Souza', company: 'Oi', email: 'ana@email.com', phone: '(41) 99876-4321', date: '2024-11-15' }
    ];

    let selectedDate = '';

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

                    if ([15, 16, 17].includes(currentDay)) {
                        dayCell.classList.add('special-day'); // Adiciona a classe 'special-day'
                    }

                    // Adiciona um evento de clique para selecionar o dia
                    dayCell.addEventListener('click', () => {
                        selectedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
                        document.querySelectorAll('#calendar div').forEach(cell => cell.classList.remove('selected'));
                        dayCell.classList.add('selected');
                        filterContactsByDate(selectedDate);
                    });

                    calendarElement.appendChild(dayCell);
                    currentDay++;
                }
            }
        }
    }

    // Função para filtrar os contatos pela data selecionada
    function filterContactsByDate(date) {
        const filteredContacts = contacts.filter(contact => contact.date === date);
        contactListElement.innerHTML = ''; // Limpa a lista de contatos antes de preencher novamente

        filteredContacts.forEach(contact => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${contact.name}</td>
                <td>${contact.company}</td>
                <td>${contact.email}</td>
                <td>${contact.phone}</td>
                <td>${contact.date}</td>
            `;
            contactListElement.appendChild(row);
        });

        // Caso não haja contatos para a data selecionada
        if (filteredContacts.length === 0) {
            const row = document.createElement('tr');
           
            contactListElement.appendChild(row);
        }
    }

    generateCalendar();
});


document.addEventListener('DOMContentLoaded', () => {
    const statusButton = document.getElementById('statusButton');

    // Define o estado inicial como "Em Risco"
    statusButton.textContent = 'Em Risco';
    statusButton.classList.add('risk');

    // Alternar o status entre "Em Risco" e "Seguro"
    statusButton.addEventListener('click', () => {
        if (statusButton.classList.contains('risk')) {
            statusButton.textContent = 'Seguro';
            statusButton.classList.remove('risk');
            statusButton.classList.add('safe');
        } else {
            statusButton.textContent = 'Em Risco';
            statusButton.classList.remove('safe');
            statusButton.classList.add('risk');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const userButton = document.querySelector('.user-button');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    userButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    // Fecha o dropdown se o usuário clicar fora
    window.addEventListener('click', (e) => {
        if (!e.target.matches('.user-button')) {
            if (dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
            }
        }
    });
});
