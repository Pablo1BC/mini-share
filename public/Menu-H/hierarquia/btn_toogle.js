const menu = document.querySelector('.menu-wrap');



const overlay = document.querySelector('.overlay');
overlay.addEventListener('click', () => {
    console.log("Overlay clicado!"); // aqui você chama sua função
  
    btn.classList.remove('opened');
    btn.setAttribute('aria-expanded', false);

    onMenuClose(); // opcional, se tiver lógica extra

});

 
 
 
 
 
 
const btn = document.querySelector('.menu-toggle');

    btn.addEventListener('click', () => {
      btn.classList.toggle('opened');
      const isOpen = btn.classList.contains('opened');

      // atualiza o aria-expanded
      btn.setAttribute('aria-expanded', isOpen);

      if (isOpen) {
        onMenuOpen();   // 🔥 função para quando abre
      } else {
        onMenuClose();  // ❄️ função para quando fecha
      }
    });

    function onMenuOpen() {
      console.log("Menu foi aberto 🚀");
      // aqui você coloca qualquer lógica: abrir sidebar, animar overlay, etc

        menu.classList.toggle('open');
     overlay.style.display = "block"; // mostra overlay
    }

    function onMenuClose() {
      console.log("Menu foi fechado ❌");
      // aqui você coloca o que acontece quando fecha
        menu.classList.remove('open');
   overlay.style.display = "none"; // esconde overlay
}


