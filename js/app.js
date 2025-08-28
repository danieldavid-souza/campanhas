document.addEventListener("DOMContentLoaded", () => {
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [
    { nome: "Buquê de flores", categoria: "Flores", preco: "49.90" },
    { nome: "Kit Spa", categoria: "Beleza", preco: "89.90" }
  ];

  const lista = document.getElementById("lista-produtos");
  produtos.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.nome} (${p.categoria}) - R$${p.preco}`;
    lista.appendChild(li);
  });

  const mensagemFinal = `🌷 Campanha Dia das Mães\nUma homenagem cheia de carinho\n\nProdutos:\n` +
    produtos.map((p, i) => `${i + 1}. ${p.nome} (${p.categoria}) - R$${p.preco}`).join("\n");

  const textoFormatado = encodeURIComponent(mensagemFinal);
  document.getElementById("btn-whatsapp").href = `https://wa.me/?text=${textoFormatado}`;

  document.getElementById("btn-compartilhar").addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Campanha Dia das Mães",
          text: "Uma homenagem cheia de carinho",
          url: window.location.href
        });
      } catch (err) {
        console.error("Erro ao compartilhar:", err);
      }
    } else {
      alert("Compartilhamento não suportado neste dispositivo.");
    }
  });
});
