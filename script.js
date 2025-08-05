 let currentUser = null;
        const products = [
            { id: 1, name: "Banana", quantity: 25, unit: "kg", expiry: "05/12/2023", image: "🍌" },
            { id: 2, name: "Pão Francês", quantity: 200, unit: "un", expiry: "10/12/2023", image: "🍞" }
        ];
        function handleLogin(event) {
            event.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            if(!username || !password) {
                alert("Por favor, preencha todos os campos!");
                return;
            }
            currentUser = username;
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('main-content').classList.remove('hidden');
            document.getElementById('current-user').textContent = currentUser;
            showPage('stock-page');
            renderProducts();
        }
        function logout() {
            currentUser = null;
            document.getElementById('main-content').classList.add('hidden');
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('login-form').reset();
        }
        function showPage(pageId) {
            document.querySelectorAll('#main-content > div').forEach(page => {
                page.classList.add('hidden');
            });
            document.getElementById(pageId).classList.remove('hidden');
            updateActiveNav(pageId);
        }
        function updateActiveNav(pageId) {
            const navButtons = document.querySelectorAll('nav button');
            navButtons.forEach(btn => btn.classList.remove('border-white', 'text-white'));   
            if(pageId === 'stock-page' || pageId === 'add-product-page') {
                navButtons[0].classList.add('border-white', 'text-white');
            } else if(pageId === 'reports-page') {
                navButtons[1].classList.add('border-white', 'text-white');
            }
        }
        function renderProducts() {
            const tbody = document.querySelector('#products-table tbody');
            tbody.innerHTML = '';   
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                                ${product.image}
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">${product.name}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${product.quantity}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${product.unit}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${product.expiry}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button onclick="editProduct(${product.id})" class="text-blue-600 hover:text-blue-900 mr-3">Editar</button>
                        <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-900">Excluir</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
        document.addEventListener('DOMContentLoaded', () => {
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', handleLogin);
            }
            const navButtons = document.querySelectorAll('nav button');
            if (navButtons.length > 0) {
                navButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const target = this.getAttribute('onclick').match(/'([^']+)'/)[1];
                        showPage(target);
                    });
                });
            }
            if (!currentUser) {
                document.getElementById('login-screen').classList.remove('hidden');
            }
            const productSelect = document.getElementById('report-product');
            products.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = product.name;
                productSelect.appendChild(option);
            });
            document.getElementById('edit-form')?.addEventListener('submit', function(e) {
                e.preventDefault();
                const id = parseInt(document.getElementById('edit-id').value);
                const product = products.find(p => p.id === id);
                if (product) {
                    product.name = document.getElementById('edit-name').value;
                    product.quantity = document.getElementById('edit-quantity').value;
                    document.getElementById('edit-modal').classList.add('hidden');
                    renderProducts();
                }
            });
            document.getElementById('report-form')?.addEventListener('submit', submitReport);
            document.getElementById('add-product-form')?.addEventListener('submit', addNewProduct);
        });
        function addNewProduct(event) {
            event.preventDefault();
            const newProduct = {
                id: Math.max(...products.map(p => p.id), 0) + 1,
                name: document.getElementById('add-name').value,
                quantity: document.getElementById('add-quantity').value,
                unit: document.getElementById('add-unit').value,
                expiry: document.getElementById('add-expiry').value || 'Não especificada',
                image: '📦'
            };   
            products.push(newProduct);
            alert('Produto adicionado com sucesso!');
            document.getElementById('add-product-form').reset();
            showPage('stock-page');
        }
        function editProduct(id) {
            const product = products.find(p => p.id === id);
            if (product) {
                document.getElementById('edit-id').value = product.id;
                document.getElementById('edit-name').value = product.name;
                document.getElementById('edit-quantity').value = product.quantity;
                document.getElementById('edit-modal').classList.remove('hidden');
            }
        }
        function deleteProduct(id) {
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                const index = products.findIndex(p => p.id === id);
                if (index !== -1) {
                    products.splice(index, 1);
                    renderProducts();
                }
            }
        }
        let reports = [];
        function submitReport(event) {
            event.preventDefault();
            const report = {
                productId: document.getElementById('report-product').value,
                type: document.getElementById('report-type').value,
                description: document.getElementById('report-desc').value,
                date: new Date().toLocaleDateString()
            };
            reports.push(report);
            alert('Relatório enviado com sucesso!');
            showPage('stock-page');
            renderReports();
        }
        function renderReports() {
            const tbody = document.querySelector('#reports-table tbody');
        tbody.innerHTML = '';
 reports.forEach(report => {
                const product = products.find(p => p.id == report.productId);
                const row = document.createElement('tr');
                row.className = 'border-b';
                row.innerHTML = `
                    <td class="p-2">${product ? product.name : 'Produto não encontrado'}</td>
                    <td class="p-2">${getReportTypeName(report.type)}</td>
                    <td class="p-2">${report.date}</td>
                    <td class="p-2">
                        <button class="text-blue-600 hover:text-blue-900">Ver</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
        function getReportTypeName(type) {
            const types = {
                'verde': 'Produto verde',
                'estragado': 'Produto estragado',
                'quantidade': 'Quantidade incorreta',
                'outro': 'Outro problema'
            };
            return types[type] || type;
        }
        function showPage(pageId) {
            const pages = document.querySelectorAll('#main-content > div:not(header)');
            pages.forEach(page => page.classList.add('hidden'));
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.remove('hidden');
            }
            updateActiveNav(pageId);
            if (pageId === 'stock-page') {
                renderProducts();
            }
        }