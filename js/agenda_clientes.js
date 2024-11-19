import { auth, database, ref, get, update } from './firebase.js';

document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const availableTimes = document.getElementById('available-times');
    const selectedDateEl = document.getElementById('selected-date');
    const timeList = document.getElementById('time-list');

    function formatDate(date) {
        const data = new Date(date);
        data.setDate(data.getDate() + 1);

        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return data.toLocaleDateString('pt-BR', options);
    }


    function generateAvailableTimes() {
        const availableSlots = {};
        const startHour = 9;
        const endHour = 17;
        const currentDate = new Date();
        const todayString = currentDate.toISOString().split('T')[0];

        for (let dayOffset = 0; dayOffset <= 60; dayOffset++) {
            const date = new Date();
            date.setDate(currentDate.getDate() + dayOffset);
            const formattedDate = date.toISOString().split('T')[0];

            if (formattedDate < todayString) continue;

            const slots = [];
            for (let hour = startHour; hour < endHour; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

                    if (formattedDate === todayString && date.getHours() === hour && date.getMinutes() <= minute) {
                        continue;
                    }

                    slots.push(time);
                }
            }

            if (slots.length > 0) {
                availableSlots[formattedDate] = slots;
            }
        }

        return availableSlots;
    }

    let availableSlots = generateAvailableTimes();

    async function fetchAppointments() {
        try {
            const usersRef = ref(database, 'usuarios');
            const snapshot = await get(usersRef);
            const usersData = snapshot.val() || {};

            for (let userId in usersData) {
                if (usersData.hasOwnProperty(userId)) {
                    const userAppointments = usersData[userId].data;

                    for (let date in userAppointments) {
                        if (userAppointments.hasOwnProperty(date)) {
                            const time = userAppointments[date];

                            if (!availableSlots[date]) {
                                availableSlots[date] = [];
                            }

                            const index = availableSlots[date].indexOf(time);
                            if (index !== -1) {
                                availableSlots[date].splice(index, 1);
                            }
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
        }
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'pt',
        initialView: 'dayGridMonth',
        events: Object.keys(availableSlots).map(date => {
            if (availableSlots[date] && availableSlots[date].length > 0) {
                return {
                    title: 'Disponível',
                    start: date,
                    className: 'available-event',
                };
            }
            return null;
        }).filter(event => event !== null),
        dateClick: function (info) {
            const date = info.dateStr;

            if (availableSlots[date] && availableSlots[date].length > 0) {
                selectedDateEl.textContent = formatDate(date);
                updateTimeList(date);
            } else {
                alert(`Nenhum horário disponível para o dia ${formatDate(date)}.`);
            }
        },
    });

    fetchAppointments().then(() => {
        calendar.render();
    });

    function updateTimeList(date) {
        timeList.innerHTML = '';

        if (availableSlots[date] && availableSlots[date].length > 0) {
            availableSlots[date].forEach(time => {
                const li = document.createElement('li');
                li.textContent = time;
                li.style.color = 'green';
                li.addEventListener('click', () => {
                    const selectedData = { date, time };
                    saveAppointment(selectedData, calendar);
                });
                timeList.appendChild(li);
            });
            availableTimes.style.display = 'block';
        } else {
            availableTimes.style.display = 'none';
        }
    }

    async function saveAppointment(data, calendar) {
        if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const userAppointmentsRef = ref(database, `usuarios/${userId}/data`);

            try {
                const snapshot = await get(userAppointmentsRef);
                const appointments = snapshot.val() || {};

                if (appointments[data.date]) {
                    alert(`Você já tem um agendamento para o dia ${formatDate(data.date)}!`);
                } else {
                    const newAppointment = {};
                    newAppointment[data.date] = data.time;
                    await update(userAppointmentsRef, newAppointment);

                    alert(`Você agendou ${data.time} para o dia ${formatDate(data.date)}`);

                    availableSlots[data.date] = availableSlots[data.date].filter(slot => slot !== data.time);

                    calendar.getEventSources().forEach(source => source.remove());

                    const events = Object.keys(availableSlots).map(date => {
                        if (availableSlots[date] && availableSlots[date].length > 0) {
                            return {
                                title: 'Disponível',
                                start: date,
                            };
                        }
                        return null;
                    }).filter(event => event !== null)

                    calendar.addEventSource(events);
                    calendar.refetchEvents();

                    updateTimeList(data.date);
                }
            } catch (error) {
                console.error('Erro ao verificar ou salvar o agendamento:', error);
            }
        } else {
            alert('Usuário não está logado. Faça login para continuar.');
        }
    }
});