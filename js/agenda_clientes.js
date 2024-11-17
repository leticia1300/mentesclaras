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
        '2024-11-21': ['13:00', '14:30', '16:00'],
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