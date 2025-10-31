document.addEventListener("DOMContentLoaded", () => {
  console.log("📦 Script leitor-campanhas.js carregado");

  // Detecta ambiente
  const hostname = window.location.hostname.toLowerCase();
  const emDesenvolvimento = hostname === "localhost" || hostname === "127.0.0.1";
  console.log("🧭 Ambiente:", hostname);

  // Oculta botão Voltar em produção
  const btnVoltar = document.getElementById("btn-voltar");
  if (btnVoltar && !emDesenvolvimento) {
    btnVoltar.style.display = "none";
    console.log("🚫 Botão Voltar ocultado em produção");
  }

  // Lógica de campanha
  const caminho = window.location.pathname;
  const nomeArquivo = caminho.split("/").pop();
  const campanha = nomeArquivo.replace(".html", "");
  const nomeFormatado = campanha.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  const urlCampanha = window.location.href;

  const container = document.getElementById("produtos-container");

  // Carrega os produtos
  fetch(`/data/${campanha}.json`)
    .then(res => res.json())
    .then(produtos => {
      const iconesCampanha = {
        "Aniversário": "🎂", "Outubro Rosa": "🎀", "Novembro Azul": "💙",
        "Dia das Mães": "👩‍👧", "Dia dos Pais": "👨‍👦", "Dia das Crianças": "🧸",
        "Natal": "🎄", "Páscoa": "🐰", "Dia do Cliente": "🤝", "Dia do Amigo": "🫂",
        "Dia da Mulher": "🌷", "Dia dos Professores": "📚", "Black Friday": "🛍️",
        "Campanha Avulsa": "⭐", "Volta às Aulas": "✏️", "Dia dos Namorados": "❤️"
      };

      produtos.forEach(p => {
        const card = document.createElement("div");
        card.className = "card-produto";

        const icone = iconesCampanha[p.campanha] || "🛒";

        card.innerHTML = `
          <img src="../${p.imagem}" alt="${p.nome}" class="zoom-produto" data-nome="${p.nome}" />
          <h3 class="nome-produto">${icone} ${p.nome}</h3>
          <p class="descricao-produto">Descrição: ${p.descricao}</p>
          <p class="campanha">${p.campanha}</p>
          <p class="categoria">Categoria: ${p.categoria}</p>
          <p class="preco">R$${p.preco}</p>
          <a 
            href="https://wa.me/?text=${encodeURIComponent(`Olá Marli! Tenho interesse no produto "${p.nome}" que custa "${p.preco}" da campanha ${p.campanha}. Poderia me passar mais informações?`)}" 
            target="_blank" 
            class="btn-whatsapp-card"
          >
            <i class="fab fa-whatsapp"></i> WhatsApp
          </a>
        `;
        container.appendChild(card);
      });

      console.log("✅ Produtos carregados:", produtos);
      inicializarLightbox(); // 🔍 Ativa o lightbox após renderizar os produtos
    })
    .catch(err => {
      container.innerHTML = `<p style="color: red;">Erro ao carregar produtos: ${err.message}</p>`;
      console.error("❌ Erro ao carregar JSON:", err);
    });

  // Botão WhatsApp principal
  const botaoWhatsApp = document.getElementById("botao-whatsapp");
  if (botaoWhatsApp) {
    const mensagem = `Confira essa campanha incrível: ${urlCampanha}`;
    botaoWhatsApp.setAttribute("href", `https://wa.me/?text=${encodeURIComponent(mensagem)}`);
    botaoWhatsApp.setAttribute("target", "_blank");
  }

  // Modal de Compartilhamento
  const botaoCompartilhar = document.getElementById("botao-compartilhar");
  const modal = document.getElementById("modal-compartilhar");
  const fecharModal = document.getElementById("fechar-modal");
  const btnWhatsApp = document.getElementById("compartilhar-whatsapp");
  const btnCopiar = document.getElementById("copiar-mensagem");
  const btnNativo = document.getElementById("compartilhar-nativo");

  const mensagem = window.mensagemCampanhaPersonalizada || 
    `📦 Olá! Segue o catálogo da campanha ${nomeFormatado} com todos os produtos disponíveis:\n👉 ${urlCampanha}\nQualquer dúvida ou interesse, é só clicar no botão de WhatsApp em cada produto!`;

  if (botaoCompartilhar && modal) {
    botaoCompartilhar.addEventListener("click", () => modal.style.display = "flex");
  }

  if (fecharModal) {
    fecharModal.addEventListener("click", () => modal.style.display = "none");
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

  // 🖼️ Função de Lightbox
  function inicializarLightbox() {
  const imagens = Array.from(document.querySelectorAll(".zoom-produto"));
  let indexAtual = 0;

  const overlay = document.createElement("div");
  overlay.id = "lightbox-overlay";
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.85); display: none; justify-content: center; align-items: center;
    z-index: 9999; flex-direction: column; gap: 10px;
  `;

  const imgZoom = document.createElement("img");
  imgZoom.id = "lightbox-img";
  imgZoom.style.cssText = "max-width: 90%; max-height: 80%; border-radius: 8px;";

  const controles = document.createElement("div");
  controles.style.cssText = "display: flex; gap: 20px; justify-content: center;";

  const btnFechar = document.createElement("button");
  btnFechar.textContent = "✖";
  btnFechar.title = "Fechar";
  btnFechar.style.cssText = "font-size: 24px; background: none; color: white; border: none; cursor: pointer;";

  const btnAnterior = document.createElement("button");
  btnAnterior.textContent = "←";
  btnAnterior.title = "Anterior";
  btnAnterior.style.cssText = "font-size: 24px; background: none; color: white; border: none; cursor: pointer;";

  const btnProximo = document.createElement("button");
  btnProximo.textContent = "→";
  btnProximo.title = "Próximo";
  btnProximo.style.cssText = "font-size: 24px; background: none; color: white; border: none; cursor: pointer;";

  controles.appendChild(btnAnterior);
  controles.appendChild(btnFechar);
  controles.appendChild(btnProximo);

  overlay.appendChild(imgZoom);
  overlay.appendChild(controles);
  document.body.appendChild(overlay);

  function abrirLightbox(index) {
    indexAtual = index;
    imgZoom.src = imagens[indexAtual].src;
    overlay.style.display = "flex";
  }

  function fecharLightbox() {
    overlay.style.display = "none";
  }

  function navegar(direcao) {
    indexAtual = (indexAtual + direcao + imagens.length) % imagens.length;
    imgZoom.src = imagens[indexAtual].src;
  }

  imagens.forEach((img, i) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => abrirLightbox(i));
  });

  btnFechar.addEventListener("click", fecharLightbox);
  btnAnterior.addEventListener("click", () => navegar(-1));
  btnProximo.addEventListener("click", () => navegar(1));

  overlay.addEventListener("click", e => {
    if (e.target === overlay) fecharLightbox();
  });

  document.addEventListener("keydown", e => {
    if (overlay.style.display === "flex") {
      if (e.key === "ArrowRight") navegar(1);
      if (e.key === "ArrowLeft") navegar(-1);
      if (e.key === "Escape") fecharLightbox();
    }
  });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const hostname = window.location.hostname.toLowerCase();
  const emDesenvolvimento = hostname === "localhost" || hostname === "127.0.0.1";

  // Botão Voltar só visível em desenvolvimento
  const btnVoltar = document.getElementById("btn-voltar");
  if (btnVoltar && !emDesenvolvimento) {
    btnVoltar.style.display = "none";
  } else if (btnVoltar) {
    btnVoltar.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // Compartilhamento
  const botaoCompartilhar = document.getElementById("botao-compartilhar");
  const modal = document.getElementById("modal-compartilhar");
  const fecharModal = document.getElementById("fechar-modal");
  const btnWhatsApp = document.getElementById("compartilhar-whatsapp");
  const btnCopiar = document.getElementById("copiar-mensagem");
  const btnNativo = document.getElementById("compartilhar-nativo");

  const urlCampanha = window.location.href;
  const nomeCampanha = document.title || "Campanha";
  const mensagem = `📦 Olá! Confira a campanha ${nomeCampanha}:\n👉 ${urlCampanha}`;

  if (botaoCompartilhar && modal) {
    botaoCompartilhar.addEventListener("click", () => modal.style.display = "flex");
  }

  if (fecharModal) {
    fecharModal.addEventListener("click", () => modal.style.display = "none");
  }

  if (btnWhatsApp) {
    btnWhatsApp.addEventListener("click", () => {
      const link = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
      window.open(link, "_blank");
    });
  }

  if (btnCopiar) {
    btnCopiar.addEventListener("click", () => {
      navigator.clipboard.writeText(mensagem).then(() => {
        alert("📋 Link copiado para a área de transferência!");
      });
    });
  }

  if (btnNativo) {
    btnNativo.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({
          title: nomeCampanha,
          text: mensagem,
          url: urlCampanha
        }).catch(err => console.error("Erro ao compartilhar:", err));
      } else {
        alert("❌ Compartilhamento nativo não suportado neste navegador.");
      }
    });
  }
});