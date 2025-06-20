class SidebarManager {
  constructor() {
    this.sidebar = null;
    this.menuToggle = document.getElementById('menuToggle');
    this.overlay = document.querySelector('.sidebar-overlay');
    this.isMobile = window.matchMedia('(max-width: 768px)').matches;

    this.init();
    this.setupEvents();
  }

  init() {
    this.injectSidebar();
    this.sidebar = document.querySelector('.sidebar');
    this.setActiveItem();
  }

  injectSidebar() {
    const sidebarHTML = `
      <aside class="sidebar">
        <div class="logo">
          <img src="../Global/logo.png" alt="StockMaster Logo">
        </div>
        <ul class="nav-menu">
          ${this.generateMenuItems()}
        </ul>
      </aside>`;

    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
  }

  generateMenuItems() {
    const items = [
      { path: '../Dashboard/dashboard.html', target: 'dashboard', label: 'Dashboard' },
      { path: '../paginaGestaoDeProdutos/gestaoProd.html', target: 'gestaoProd', label: 'Gestão de produtos' },
      { path: '../paginapedidos/pedidos.html', target: 'pedidos', label: 'Pedidos' },
      { path: '../paginaGestaoDeEstoque/gestaoDeEstoque.html', target: 'gestaoDeEstoque', label: 'Gestão de estoque' },
      { path: '../paginaderelatorios/relatorios.html', target: 'relatorios', label: 'Relatórios' },
      { path: '../ConfiguracaoConta/config-conta.html', target: 'config-conta', label: 'Configurações' },
      { path: '../paginaSobre/paginaSobre.html', target: 'paginaSobre', label: 'Sobre' }
    ];

    return items.map((item, index) => `
      <li class="nav-item" style="--i: ${index}">
        <a href="${item.path}" class="nav-link" data-target="${item.target}">${item.label}</a>
      </li>
    `).join('');
  }

  setupEvents() {
    this.menuToggle.addEventListener('click', this.toggleSidebar.bind(this));
    this.overlay.addEventListener('click', this.closeSidebar.bind(this));

    window.addEventListener('resize', () => {
      this.isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (!this.isMobile) this.closeSidebar();
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (this.isMobile) this.closeSidebar();
      });
    });
  }

  toggleSidebar() {
    this.sidebar.classList.toggle('active');
    this.overlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    this.toggleIcons();
  }

  closeSidebar() {
    this.sidebar.classList.remove('active');
    this.overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
    this.showMenuIcon();
  }

  toggleIcons() {
    const menuIcon = this.menuToggle.querySelector('.menu-icon');
    const closeIcon = this.menuToggle.querySelector('.close-icon');

    const isActive = this.sidebar.classList.contains('active');
    menuIcon.style.display = isActive ? 'none' : 'inline';
    closeIcon.style.display = isActive ? 'inline' : 'none';
  }

  showMenuIcon() {
    const menuIcon = this.menuToggle.querySelector('.menu-icon');
    const closeIcon = this.menuToggle.querySelector('.close-icon');
    menuIcon.style.display = 'inline';
    closeIcon.style.display = 'none';
  }

  setActiveItem() {
    const currentPath = window.location.pathname.toLowerCase();
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
      const linkPath = link.getAttribute('href').toLowerCase();
      link.classList.remove('selected');

      if (currentPath.includes(link.getAttribute('data-target'))) {
        link.classList.add('selected');
      } else if (currentPath.includes(linkPath.split('/').pop().replace('.html', ''))) {
        link.classList.add('selected');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SidebarManager();
});
