document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('graphicReportModal');
    var btn = document.getElementById('openGraphicReportModal');
    var span = document.getElementsByClassName('close-button')[0];

    let salesChartInstance = null;

    function renderSalesChart() {
        const ctx = document.getElementById('salesChart');

        if (!ctx) {
            console.error("Elemento canvas não encontrado!");
            return;
        }

        if (salesChartInstance !== null) {
            salesChartInstance.destroy();
        }

        salesChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [
                    {
                        label: '5 unidades',
                        data: [2, 7, 4, 9, 3, 5, 10, 8, 7, 6, 11, 8],
                        borderColor: '#ffc107',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.4,
                    },
                    {
                        label: '10 unidades',
                        data: [4, 3, 6, 10, 8, 12, 7, 13, 9, 14, 13, 12],
                        borderColor: '#ffaa00',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.4,
                    },
                    {
                        label: '15 unidades',
                        data: [1, 4, 6, 5, 11, 9, 14, 10, 12, 13, 14, 15],
                        borderColor: '#ffeb3b',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.4,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 2,
                            callback: function (value) {
                                return value + ' unidades';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.dataset.label + ': ' + context.parsed.y + ' unidades';
                            }
                        }
                    }
                },
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 0,
                        bottom: 0
                    }
                }
            }
        });
    }

    btn.onclick = function () {
        modal.style.display = 'flex';
        setTimeout(() => {
            renderSalesChart();
        }, 300);
    };

    span.onclick = function () {
        modal.style.display = 'none';
        if (salesChartInstance !== null) {
            salesChartInstance.destroy();
            salesChartInstance = null;
        }
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            if (salesChartInstance !== null) {
                salesChartInstance.destroy();
                salesChartInstance = null;
            }
        }
    };

    feather.replace();
});