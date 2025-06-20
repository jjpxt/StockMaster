document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const sortSelect = document.querySelector('.sort-select');
    const inventoryTableBody = document.querySelector('.inventory-table tbody');

    const originalRowElements = Array.from(inventoryTableBody.querySelectorAll('tr'))
        .map(tr => tr.cloneNode(true));

    function applySearchFilter() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const currentRowsInDOM = inventoryTableBody.querySelectorAll('tr');

        currentRowsInDOM.forEach(row => {
            const cells = row.querySelectorAll('td');
            let match = false;

            for (const cell of cells) {
                if (cell.textContent.toLowerCase().includes(searchTerm)) {
                    match = true;
                    break;
                }
            }
            row.style.display = match ? '' : 'none';
        });
    }


    function updateTotalEstoque() {
        const rows = document.querySelectorAll('.inventory-table tbody tr');
        let totalEstoque = 0;

        rows.forEach(row => {
            const quantidade = parseInt(row.cells[4].textContent) || 0;
            totalEstoque += quantidade;
        });

        localStorage.setItem('totalEstoque', totalEstoque); // Salva no localStorage
    }

    function parseDate(dateStr) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);

            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                return new Date(year, month, day);
            }
        }
        return null;
    }

    function getCellValueForSort(rowElement, columnIndex) {
        const cell = rowElement.cells[columnIndex];
        if (!cell) return null;

        const cellText = cell.textContent.trim();

        switch (columnIndex) {
            case 0:
            case 1:
            case 2:
                return cellText.toLowerCase();
            case 3:
                return parseDate(cellText);
            case 4:
                return parseInt(cellText.split(' ')[0], 10);
            default:
                return cellText.toLowerCase();
        }
    }

    function renderTableRows(rowsToDisplay) {
        inventoryTableBody.innerHTML = '';
        rowsToDisplay.forEach(row => inventoryTableBody.appendChild(row));
        applySearchFilter();
    }

    function generateMockProducts() {
        const categories = ['Refrigerantes', 'Sucos', 'Energéticos', 'Águas', 'Chocolates'];
        const productNames = ['Coca-cola', 'Pepsi', 'Guaraná', 'Del Valle', 'Monster', 'Red Bull', 'Fanta', 'Sprite'];
        const products = [];

        for (let i = 1; i <= 300; i++) {
            const name = `${productNames[Math.floor(Math.random() * productNames.length)]} ${Math.floor(Math.random() * 1000)}ml`;
            const category = categories[Math.floor(Math.random() * categories.length)];
            const batch = Math.floor(Math.random() * 99999).toString();
            const expiry = `${Math.floor(Math.random() * 30) + 1}/${Math.floor(Math.random() * 12) + 1}/${2026}`;
            const quantity = Math.floor(Math.random() * 100) + 1;

            products.push({ name, category, batch, expiry, quantity });
        }
        return products;
    }

    function populateTable(products) {
        inventoryTableBody.innerHTML = '';

        products.forEach(product => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.batch}</td>
                <td>${product.expiry}</td>
                <td>${product.quantity}</td>
            `;

            inventoryTableBody.appendChild(row);
        });
    }

    const products = generateMockProducts();
    populateTable(products);

    searchInput.addEventListener('input', applySearchFilter);

    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;
        let rowsToSortAndDisplay;

        if (sortValue === "0") {
            rowsToSortAndDisplay = originalRowElements.map(row => row.cloneNode(true));
        } else {
            const columnIndex = parseInt(sortValue) - 1;

            rowsToSortAndDisplay = originalRowElements.map(row => row.cloneNode(true));

            rowsToSortAndDisplay.sort((rowA, rowB) => {
                const valA = getCellValueForSort(rowA, columnIndex);
                const valB = getCellValueForSort(rowB, columnIndex);

                if (valA === null && valB === null) return 0;
                if (valA === null) return 1;
                if (valB === null) return -1;

                if (valA instanceof Date && valB instanceof Date) {
                    return valA.getTime() - valB.getTime();
                }
                if (typeof valA === 'number' && typeof valB === 'number') {
                    if (isNaN(valA) && isNaN(valB)) return 0;
                    if (isNaN(valA)) return 1;
                    if (isNaN(valB)) return -1;
                    return valA - valB;
                }
                return String(valA).localeCompare(String(valB));
            });
        }
        renderTableRows(rowsToSortAndDisplay);
    });
});
///////////////////////
