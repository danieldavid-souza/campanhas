document.addEventListener("DOMContentLoaded", () => {
  const imagens = Array.from(document.querySelectorAll(".card-produto img.zoom-produto"));
  const lightbox = document.getElementById("lightbox");
  const imagemZoom = document.getElementById("imagem-lightbox");
  const fechar = document.getElementById("fechar-lightbox");
  const setaEsquerda = document.getElementById("seta-esquerda");
  const setaDireita = document.getElementById("seta-direita");

  let indiceAtual = 0;

  function abrirLightbox(indice) {
    indiceAtual = indice;
    imagemZoom.src = imagens[indiceAtual].src;
    lightbox.style.display = "flex";
  }

  function navegar(direcao) {
    indiceAtual = (indiceAtual + direcao + imagens.length) % imagens.length;
    imagemZoom.src = imagens[indiceAtual].src;
  }

  imagens.forEach((img, i) => {
    img.addEventListener("click", () => abrirLightbox(i));
  });

  fechar.addEventListener("click", () => {
    lightbox.style.display = "none";
    imagemZoom.src = "";
  });

  setaEsquerda.addEventListener("click", () => navegar(-1));
  setaDireita.addEventListener("click", () => navegar(1));

  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "flex") {
      if (e.key === "ArrowLeft") navegar(-1);
      if (e.key === "ArrowRight") navegar(1);
      if (e.key === "Escape") fechar.click();
    }
  });

  let touchStartX = 0;
  imagemZoom.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });

  imagemZoom.addEventListener("touchend", (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const delta = touchEndX - touchStartX;
    if (delta > 50) navegar(-1);
    if (delta < -50) navegar(1);
  });
});