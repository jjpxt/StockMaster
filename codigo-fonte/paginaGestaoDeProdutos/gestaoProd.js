function getProdutos() {
    const produtos = localStorage.getItem('produtos');
    return produtos ? JSON.parse(produtos) : [];
}

function saveProdutos(produtos) {
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

function renderProdutos() {
    const produtos = getProdutos();
    const tbody = document.querySelector('.inventory-table tbody');

    tbody.innerHTML = '';

    produtos.forEach((produto, index) => {
        // Ignorar produtos com campos obrigatórios vazios
        if (!produto.nome || !produto.categoria || !produto.lote || !produto.validade || !produto.quantidade) {
            return;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${produto.nome}</td>
            <td>${produto.categoria}</td>
            <td>${produto.lote}</td>
            <td>${produto.validade}</td>
            <td ${produto.quantidade <= 10 ? 'class="quantity-alert"' : ''}>
                ${produto.quantidade} ${produto.quantidade <= 10 ? '⚠️' : ''}
            </td>
        `;

        // Ao clicar em uma linha, carrega para edição
        tr.addEventListener('click', () => {
            preencherFormularioParaEdicao(produto, index);
        });

        tbody.appendChild(tr);
    });
}

// Variável global para controlar se estamos editando
let editandoIndex = null;

document.querySelector('.btn-save').addEventListener('click', () => {
    const nome = document.querySelector('input[name="nome"]').value.trim();
    const categoria = document.querySelector('input[name="categoria"]').value.trim();
    const lote = document.querySelector('input[name="lote"]').value.trim();
    const validade = document.querySelector('input[name="validade"]').value.trim();
    const quantidade = parseInt(document.querySelector('input[name="quantidade"]').value.trim(), 10);

    if (nome && categoria && lote && validade && !isNaN(quantidade)) {
        const produto = { nome, categoria, lote, validade, quantidade };
        const produtos = getProdutos();

        if (editandoIndex !== null) {
            // Atualizar produto existente
            produtos[editandoIndex] = produto;
            editandoIndex = null; // resetar modo de edição
        } else {
            // Adicionar novo produto
            produtos.push(produto);
        }

        saveProdutos(produtos);
        renderProdutos();

        // Limpar campos
        document.querySelectorAll('.form-control').forEach(input => input.value = '');
    } else {
        alert('Por favor, preencha todos os campos corretamente!');
    }
});

function preencherFormularioParaEdicao(produto, index) {
    document.querySelector('input[name="nome"]').value = produto.nome;
    document.querySelector('input[name="categoria"]').value = produto.categoria;
    document.querySelector('input[name="lote"]').value = produto.lote;
    document.querySelector('input[name="validade"]').value = produto.validade;
    document.querySelector('input[name="quantidade"]').value = produto.quantidade;
    editandoIndex = index;
}

document.addEventListener('DOMContentLoaded', renderProdutos);