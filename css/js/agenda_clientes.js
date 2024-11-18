document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const availableTimes = document.getElementById('available-times');
    const selectedDateEl = document.getElementById('selected-date');
    const timeList = document.getElementById('time-list');

    // Dados simulados de horários disponíveis
    const availableSlots = {
        '2024-11-14': ['10:00', '11:00', '14:00'],
        '2024-11-15': ['09:00', '12:00', '15:30'],
        '2024-11-18': ['13:00', '14:30', '16:00'],
        '2024-11-19': ['10:00', '11:00', '14:00'],
        '2024-11-20': ['09:00', '12:00', '15:30'],
        '2024-1-21': ['13:00', '14:30', '16:00'],
    };

    // Inicializa o calendário
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: Object.keys(availableSlots).map(date => ({
            title: 'Disponível',
            start: date,
        })),
        dateClick: function (info) {
            const date = info.dateStr;

            if (availableSlots[date]) {
                selectedDateEl.textContent = date;
                timeList.innerHTML = ''; // Limpa a lista

                availableSlots[date].forEach(time => {
                    const li = document.createElement('li');
                    li.textContent = time;
                    li.addEventListener('click', () => {
                        const selectedData = { date, time };
                        saveToRealtimeDatabase(selectedData);
                        alert(`Você selecionou ${time} em ${date}`);
                    });
                    timeList.appendChild(li);
                });

                availableTimes.style.display = 'block';
            } else {
                alert('Nenhum horário disponível para esta data.');
            }
        },
    });

    calendar.render();
});

// Função para salvar no Realtime Database
function saveToRealtimeDatabase(data) {
    // Verifica se o usuário está logado
    const user = firebase.auth().currentUser;

    if (user) {
        const userId = user.uid; // ID do usuário logado
        const db = firebase.database(); // Instância do Realtime Database

        db.ref(`users/${userId}/appointments`) // Caminho no banco de dados
            .push(data) // Salva os dados
            .then(() => {
                console.log('Agendamento salvo com sucesso:', data);
            })
            .catch(error => {
                console.error('Erro ao salvar o agendamento:', error);
            });
    } else {
        alert('Usuário não está logado. Faça login para continuar.');
    }
}
