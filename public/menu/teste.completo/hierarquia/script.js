function menu(){  const menu = document.querySelector('.menu-wrap');
  const toggle = document.querySelector('.menu-toggle');

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
    // === Estrutura do menu (modifique aqui) ===
    const menuData = [
      { title: "Menu-1", href: "#menu1" },
      { title: "Menu-2", href: "#menu2" },
      {
        title: "Menu-3",
        children: [
          { title: "Menu-3-1", href: "#m3-1" },
          {
            title: "Menu-3-2",
            children: [
              { title: "Menu-3-2-1", href: "#m3-2-1" },
              { title: "Menu-3-2-2", href: "#m3-2-2" },
              {
                title: "Menu-3-2-3",
                children: [
                  { title: "Menu-3-2-3-1", href: "#m3-2-3-1" },
                  { title: "Menu-3-2-3-2", href: "#m3-2-3-2" }
                ]
              }
            ]
          }
        ]
      },
      { title: "Menu-4", href: "#menu4" }
    ];

    // === Estado e helpers ===
    const viewport = document.getElementById('viewport');
    const stack = []; // pilha de views (DOM elements)

    function createView(items, title, isRoot = false) {
      const view = document.createElement('div');
      view.className = 'view';
      view.setAttribute('role','group');

      // HEADER
      const header = document.createElement('div');
      header.className = 'menu-header';

      if (!isRoot) {
        const back = document.createElement('button');
        back.className = 'back';
        back.textContent = '← Voltar';
        back.type = 'button';
        back.addEventListener('click', () => goBack());
        header.appendChild(back);
      } else {
        // espaço para alinhar o título se for root
        const spacer = document.createElement('div');
        spacer.style.width = '66px';
        header.appendChild(spacer);
      }

      const titleSpan = document.createElement('div');
      titleSpan.className = 'title';
      titleSpan.textContent = title;
      header.appendChild(titleSpan);

      view.appendChild(header);

      // LISTA
      const ul = document.createElement('ul');
      ul.className = 'menu-list';

      items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'menu-item';

        if (item.children && item.children.length) {
          // botão que abre submenu
          const btn = document.createElement('div');
          btn.className = 'item-btn';
          btn.tabIndex = 0;
          btn.setAttribute('role','button');
          btn.setAttribute('aria-haspopup','true');
          btn.innerHTML = `<span>${item.title}</span><svg class="item-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>`;
          btn.addEventListener('click', () => openSubmenu(item));
          btn.addEventListener('keydown', (e)=> { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSubmenu(item); } });
          li.appendChild(btn);
        } else {
          // link simples
          const a = document.createElement('a');
          a.className = 'item-link';
          a.href = item.href || '#';
          a.textContent = item.title;
          a.addEventListener('click', (e) => {
            // comportamento padrão: navega; aqui só demonstrativo
            // se quiser tratar clique JS, faça aqui
            // e.preventDefault();
            console.log('clicou em link:', item.title, 'href:', a.href);
          });
          li.appendChild(a);
        }

        ul.appendChild(li);
      });

      view.appendChild(ul);
      return view;
    }

    // render inicial (root)
    function init() {
      const rootView = createView(menuData, 'Início', true);
      viewport.appendChild(rootView);
      stack.push(rootView);
      // forçar layout e ativar
      requestAnimationFrame(() => {
        rootView.classList.add('active');
        adjustHeightTo(rootView);
      });
    }

    // abrir submenu (push)
    function openSubmenu(item) {
      const parentView = stack[stack.length - 1];
      const newView = createView(item.children, item.title, false);
      viewport.appendChild(newView);
      stack.push(newView);

      // ajusta altura antes da animação (melhor visual)
      adjustHeightTo(newView);

      // animar: marca previous como left, novo como active
      requestAnimationFrame(() => {
        parentView.classList.remove('active');
        parentView.classList.add('left');
        newView.classList.add('active');
      });

      // opcional: remover previous do DOM depois de certa profundidade se quiser economizar
    }

    // voltar (pop)
    function goBack() {
      if (stack.length <= 1) return;
      const top = stack.pop();
      const prev = stack[stack.length - 1];

      // preparar altura para prev
      adjustHeightTo(prev);

      // animação inversa
      top.classList.remove('active');
      top.classList.add('right');
      prev.classList.remove('left');
      prev.classList.add('active');

      // quando terminar animação, remover top do DOM
      top.addEventListener('transitionend', () => {
        top.remove();
      }, { once: true });
    }

    // ajusta a altura do viewport conforme a view passada
    function adjustHeightTo(viewEl) {
      // medir
      // cria uma cópia invisível? Não precisa: o view está no DOM e tem scrollHeight
      // porém quando está com transform translateX(100%) pode não ter layout certo em alguns navegadores
      // forçamos visibilidade momentânea para medir
      const prevPointer = viewEl.style.pointerEvents;
      viewEl.style.pointerEvents = 'none';
      // calcula a altura necessária
      // adiciona padding do elemento (já considera)
      const h = viewEl.scrollHeight;
      viewport.style.height = h + 'px';
      viewEl.style.pointerEvents = prevPointer;
    }

    // inicializa
    init();

    // para suportar redimensionamento (ajusta a altura da view ativa)
    window.addEventListener('resize', () => {
      const active = stack[stack.length - 1];
      if (active) adjustHeightTo(active);
    });}