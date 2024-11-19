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