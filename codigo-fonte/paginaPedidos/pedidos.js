const dadosIniciais = [
    { nome: "Coca-cola 350ml", categoria: "Refrigerantes", fornecedor: "FEMSA", valorUnitario: "R$ 2,59", quantidade: 200, dataEntrada: "01/04/2025" },
    { nome: "Coca-cola 1L", categoria: "Refrigerantes", fornecedor: "FEMSA", valorUnitario: "R$ 4,70", quantidade: 150, dataEntrada: "28/03/2025" },
    { nome: "Del Valle 1L", categoria: "Sucos", fornecedor: "FEMSA", valorUnitario: "R$ 3,50", quantidade: 60, dataEntrada: "25/03/2025" },
    { nome: "Brahma 600ml", categoria: "Cervejas", fornecedor: "Ambev", valorUnitario: "R$ 5,00", quantidade: 300, dataEntrada: "18/03/2025" }
];

const btnSalvar = document.getElementById('btn-salvar');
const btnCancelar = document.getElementById('btn-cancelar');
const btnNovoPedido = document.getElementById('btn-novo-pedido');
const formPedido = document.getElementById('form-pedido');
const tabelaPedidos = document.getElementById('orders-table-body');
const notification = document.getElementById('notification');

let editandoIndex = null;

document.addEventListener('DOMContentLoaded', function () {
    let pedidos = JSON.parse(localStorage.getItem('pedidos'));
    if (!pedidos) {
        localStorage.setItem('pedidos', JSON.stringify(dadosIniciais));
        pedidos = dadosIniciais;
    }
    carregarPedidos();

    btnSalvar.addEventListener('click', salvarPedido);
    btnCancelar.addEventListener('click', limparFormulario);
    btnNovoPedido.addEventListener('click', function () {
        limparFormulario();
        document.getElementById('nome-produto').focus();
        editandoIndex = null;
    });
});

function carregarPedidos() {
    tabelaPedidos.innerHTML = '';
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    pedidos.forEach((pedido, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pedido.nome}</td>
            <td>${pedido.categoria}</td>
            <td>${pedido.fornecedor}</td>
            <td>${pedido.valorUnitario}</td>
            <td>${pedido.quantidade}</td>
            <td>${pedido.dataEntrada}</td>
        `;
        tr.addEventListener('click', function () {
            preencherFormularioParaEdicao(pedido, index);
        });
        tabelaPedidos.appendChild(tr);
    });
}

function salvarPedido() {
    const nome = document.getElementById('nome-produto').value;
    const categoria = document.getElementById('categoria').value;
    const fornecedor = document.getElementById('fornecedor').value;
    const dataEntrada = document.getElementById('data-entrada').value;
    const quantidade = document.getElementById('quantidade').value;
    let valorUnitario = document.getElementById('valor-unitario').value;

    if (!nome || !categoria || !fornecedor || !dataEntrada || !quantidade || !valorUnitario) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    if (!valorUnitario.includes('R$')) {
        valorUnitario = valorUnitario.replace(/[^\d.,]/g, '');
        valorUnitario = valorUnitario.replace('.', ',');
        valorUnitario = `R$ ${valorUnitario}`;
    }

    const novoPedido = {
        nome,
        categoria,
        fornecedor,
        valorUnitario,
        quantidade: parseInt(quantidade),
        dataEntrada
    };

    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    if (editandoIndex !== null) {
        pedidos[editandoIndex] = novoPedido;
        editandoIndex = null;
    } else {
        pedidos.push(novoPedido);
    }

    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    carregarPedidos();
    limparFormulario();
    mostrarNotificacao();
}

function limparFormulario() {
    document.getElementById('nome-produto').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('fornecedor').value = '';
    document.getElementById('data-entrada').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('valor-unitario').value = '';
    editandoIndex = null;
}

function mostrarNotificacao() {
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function preencherFormularioParaEdicao(pedido, index) {
    document.getElementById('nome-produto').value = pedido.nome;
    document.getElementById('categoria').value = pedido.categoria;
    document.getElementById('fornecedor').value = pedido.fornecedor;
    document.getElementById('data-entrada').value = pedido.dataEntrada;
    document.getElementById('quantidade').value = pedido.quantidade;
    document.getElementById('valor-unitario').value = pedido.valorUnitario;
    editandoIndex = index;
}