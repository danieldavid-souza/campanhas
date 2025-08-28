document.addEventListener("DOMContentLoaded", () => {
  const rodape = document.createElement("footer");
  rodape.innerHTML = `
    <div style="text-align: center; padding: 1.5em; background-color: #f1f1f1; color: #555; font-size: 0.9rem;">
      &copy; ${new Date().getFullYear()} Daniel | Todos os direitos reservados.<br>
      Desenvolvido com 💙 em Juiz de Fora
    </div>
  `;
  document.body.appendChild(rodape);
});
