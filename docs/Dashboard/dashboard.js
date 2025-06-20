feather.replace();

const ctx = document.getElementById('salesChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
            {
                label: '5 unidades',
                data: [2, 7, 4, 9, 3, 5, 10, 8, 7, 6, 11, 8],
                borderColor: '#ffc107',
                backgroundColor: 'transparent',
                borderWidth: 2
            },
            {
                label: '10 unidades',
                data: [4, 3, 6, 10, 8, 12, 7, 13, 9, 14, 13, 12],
                borderColor: '#ffaa00',
                backgroundColor: 'transparent',
                borderWidth: 2
            },
            {
                label: '15 unidades',
                data: [1, 4, 6, 5, 11, 9, 14, 10, 12, 13, 14, 15],
                borderColor: '#ffeb3b',
                backgroundColor: 'transparent',
                borderWidth: 2
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
                    stepSize: 2
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

function redirectToProducts() {
    window.location.href = '../paginaGestaoDeProdutos/gestaoProd.html';
}

function redirectToPedidos() {
    window.location.href = '../paginaPedidos/Pedidos.html';
}

function redirectToEstoque() {
    window.location.href = '../paginaGestaoDeEstoque/gestaoDeEstoque.html';
}
function updateDashboardCounters() {
    const produtos = JSON.parse(localStorage.getItem('produtos') || '[]'); // A CHAVE 'produtos' é crucial aqui!

    // Contagem de produtos únicos
    const produtosUnicos = [...new Set(produtos.map(p => p.nome))];
    const totalProdutos = produtosUnicos.length;

    // Contagem do estoque total (Soma das quantidades)
    const estoqueTotal = produtos.reduce((total, produto) => {
        return total + (parseInt(produto.quantidade) || 0);
    }, 0);

    // Contagem de alertas (quantidade <= 10)
    const alertas = produtos.filter(produto => {
        const quantidade = parseInt(produto.quantidade) || 0;
        return quantidade <= 10;
    }).length;

    document.getElementById('produtos-count').textContent = totalProdutos;
    //document.getElementById('estoque-count').textContent = estoqueTotal; // Atualiza o card de estoque
    document.getElementById('alertas-count').textContent = alertas;

    updatePedidosCount(); // Chama a função para atualizar a contagem de pedidos também
}

function updatePedidosCount() {
    const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    const numeroPedidos = pedidos.length;
    document.getElementById('pedidos-count').textContent = numeroPedidos;
}

document.addEventListener('DOMContentLoaded', function () {
    updateDashboardCounters();
    setInterval(updateDashboardCounters, 5000);
});

window.addEventListener('storage', function (e) {
    if (e.key === 'produtos') { // Agora reage a mudanças na chave 'produtos'
        updateDashboardCounters();
    }
    if (e.key === 'pedidos') {
        updatePedidosCount();
    }
});

document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
        updateDashboardCounters();
    }
});
