document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
            datasets: [{
                label: 'Clientes',
                data: [1, 1, 3, 5, 2],
                backgroundColor: 'rgba(5, 192, 192, 0.2)', // Corrigido o erro de sintaxe
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'black' // Cor preta para as labels do eixo Y
                    }
                },
                x: {
                    ticks: {
                        color: 'black' // Cor preta para as labels do eixo X
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: 'black' // Cor preta para os rótulos da legenda
                    }
                }
            }
        }
    });
});
