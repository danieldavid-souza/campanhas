console.log("📦 Script leitor-campanhas.js carregado");

document.addEventListener("DOMContentLoaded", () => {
  const caminho = window.location.pathname;
  const nomeArquivo = caminho.split("/").pop();
  const campanha = nomeArquivo.replace(".html", "");
  const nomeFormatado = campanha.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const urlCampanha = window.location.href;

  const container = document.getElementById("produtos-container");

  // 🔄 Carrega os produtos da campanha
  fetch(`/data/${campanha}.json`)
    .then(res => {
      if (!res.ok) throw new Error("Arquivo não encontrado");
      return res.json();
    })
    .then(produtos => {
      produtos.forEach(p => {
        const card = document.createElement("div");
        card.className = "card-produto";
        card.innerHTML = `
          <img src="../${p.imagem}" alt="${p.nome}" />
          <h3 class="nome-produto">${p.nome}</h3>
          <p class="descricao-produto">Descrição: ${p.descricao}</p>
          <p class="campanha">${p.campanha}</p>
          <p class="categoria">Categoria: ${p.categoria}</p>
          <p class="preco">R$${p.preco}</p>
          <a 
            href="https://wa.me/?text=${encodeURIComponent(`Olá Marli! Tenho interesse no produto "${p.nome}" que custa "${p.preco}" da campanha ${p.campanha}. Poderia me passar mais informações?`)}" 
            target="_blank" 
            class="btn-whatsapp-card"
          >
            📤 Enviar pelo WhatsApp
          </a>
        `;
        container.appendChild(card);
      });
      console.log("✅ Produtos carregados:", produtos);
    })
    .catch(err => {
      container.innerHTML = `<p style="color: red;">Erro ao carregar produtos: ${err.message}</p>`;
      console.error("❌ Erro ao carregar JSON:", err);
    });

  // ✅ Botão WhatsApp principal (se existir)
  const botaoWhatsApp = document.getElementById("botao-whatsapp");
  if (botaoWhatsApp) {
    const mensagem = `Confira essa campanha incrível: ${urlCampanha}`;
    botaoWhatsApp.setAttribute("href", `https://wa.me/?text=${encodeURIComponent(mensagem)}`);
    botaoWhatsApp.setAttribute("target", "_blank");
  }

  // ✅ Modal de Compartilhamento
  const botaoCompartilhar = document.getElementById("botao-compartilhar");
  const modal = document.getElementById("modal-compartilhar");
  const fecharModal = document.getElementById("fechar-modal");
  const btnWhatsApp = document.getElementById("compartilhar-whatsapp");
  const btnCopiar = document.getElementById("copiar-mensagem");
  const btnNativo = document.getElementById("compartilhar-nativo");

  const mensagem = window.mensagemCampanhaPersonalizada || 
    `📦 Olá! Segue o catálogo da campanha ${nomeFormatado} com todos os produtos disponíveis:\n👉 ${urlCampanha}\nQualquer dúvida ou interesse, é só clicar no botão de WhatsApp em cada produto!`;

  if (botaoCompartilhar && modal) {
    botaoCompartilhar.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  }

  if (fecharModal) {
    fecharModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  if (btnWhatsApp) {
    btnWhatsApp.addEventListener("click", () => {
      const link = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
      window.open(link, "_blank");
    });
  }

  if (btnCopiar) {
    btnCopiar.addEventListener("click", () => {
      const textarea = document.createElement("textarea");
      textarea.value = mensagem;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("📋 Mensagem copiada!");
    });
  }

  if (btnNativo) {
    btnNativo.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({
          title: `Catálogo ${nomeFormatado}`,
          text: mensagem,
          url: urlCampanha
        }).catch(err => console.error("Erro ao compartilhar:", err));
      } else {
        alert("❌ Compartilhamento nativo não suportado neste navegador.");
      }
    });
  }
});