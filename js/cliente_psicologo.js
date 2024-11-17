document.addEventListener('DOMContentLoaded', function () {
    const psychologistInfo = document.getElementById('psychologist-info');
    const statusButton = document.getElementById('statusButton');

    // Obtém os dados armazenados no sessionStorage
    const selectedDate = sessionStorage.getItem('selectedDate');
    const selectedTime = sessionStorage.getItem('selectedTime');

    if (selectedDate && selectedTime) {
        // Buscar informações do psicólogo usando os dados
        // Exemplo: consulte a base de dados ou use dados simulados
        const psychologist = {
            nome: 'Dr. João Silva',
            companhia: 'Clínica MenteClara',
        
            email: 'joao.silva@menteclara.com',
            cidade: 'São Paulo',
            status: 'Ativo'
        };

        // Exibe as informações na tela
        document.getElementById('psychologist-name').textContent = psychologist.nome;
        document.getElementById('psychologist-company').textContent = psychologist.companhia;
     
        document.getElementById('psychologist-email').textContent = psychologist.email;
        document.getElementById('psychologist-city').textContent = psychologist.cidade;
        document.getElementById('psychologist-status').textContent = psychologist.status;
    }}
    )
        
