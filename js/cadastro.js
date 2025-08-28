const form = document.getElementById("form-produto");
const lista = document.getElementById("lista-produtos");
const btnExportar = document.getElementById("btn-exportar");
const campanhaSelect = document.getElementById("campanha");

let produtos = [];
let cardEmEdicao = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = form.nome.value.trim();
  const categoria = form.categoria.value.trim();
  const preco = form.preco.value.trim();
  const imagem = form.imagem.value.trim();
  const descricao = form.descricao.value.trim();
  const campanha = campanhaSelect.value;

  if (!nome || !categoria || !preco || !imagem || !descricao || !campanha) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  if (!imagem.startsWith("imagens/")) {
    alert("O caminho da imagem deve começar com 'imagens/'.");
    return;
  }

  if (isNaN(parseFloat(preco))) {
    alert("Digite um preço válido.");
    return;
  }

  const produto = { nome, categoria, preco, imagem, descricao, campanha };

  if (cardEmEdicao !== null) {
    produtos[cardEmEdicao] = produto;
    cardEmEdicao = null;
  } else {
    produtos.push(produto);
  }

  form.reset();
  campanhaSelect.selectedIndex = 0;
  renderizarProdutos();
});

function renderizarProdutos() {
  lista.innerHTML = "";

  const iconesCampanha = {
    "Aniversário": "🎂",
    "Outubro Rosa": "🎀",
    "Novembro Azul": "💙",
    "Dia das Mães": "👩‍👧",
    "Dia dos Pais": "👨‍👦",
    "Dia das Crianças": "🧸",
    "Natal": "🎄",
    "Páscoa": "🐰",
    "Dia do Cliente": "🤝",
    "Dia do Amigo": "🫂",
    "Dia da Mulher": "🌷",
    "Dia dos Professores": "📚",
    "Black Friday": "🛍️",
    "Campanha Avulsa": "⭐",
    "Volta às Aulas": "✏️",
    "Dia dos Namorados": "❤️"
  };

  produtos.forEach((produto, index) => {
    const card = document.createElement("li");
    card.classList.add("card-produto");

    const icone = iconesCampanha[produto.campanha] || "🛒";

    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" />
      <h3>${icone} ${produto.nome}</h3>
      <p><strong>Categoria:</strong> ${produto.categoria}</p>
      <p><strong>Descrição:</strong> ${produto.descricao}</p>
      <p class="preco">R$ ${produto.preco}</p>
      <p><strong>Campanha:</strong> ${produto.campanha}</p>
      <div class="botoes-card">
        <button class="btn-editar" data-index="${index}">✏️ Editar</button>
        <button class="btn-excluir" data-index="${index}">🗑️ Excluir</button>
        <a 
          href="https://wa.me/?text=${encodeURIComponent(`Olá! Tenho interesse no produto "${produto.nome}" da campanha ${produto.campanha}. Poderia me passar mais informações?`)}" 
          target="_blank" 
          class="btn-whatsapp-card"
        >
          📤 WhatsApp
        </a>
      </div>
    `;

    lista.appendChild(card);
  });

  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      const produto = produtos[index];

      form.nome.value = produto.nome;
      form.categoria.value = produto.categoria;
      form.preco.value = produto.preco;
      form.imagem.value = produto.imagem;
      form.descricao.value = produto.descricao;
      campanhaSelect.value = produto.campanha;

      cardEmEdicao = index;
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  document.querySelectorAll(".btn-excluir").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.getAttribute("data-index");
      if (confirm("Tem certeza que deseja excluir este produto?")) {
        produtos.splice(index, 1);
        renderizarProdutos();
      }
    });
  });
}

btnExportar.addEventListener("click", () => {
  if (produtos.length === 0) {
    alert("Nenhum produto cadastrado para exportar.");
    return;
  }

  const campanhaSelecionada = campanhaSelect.value;
  if (!campanhaSelecionada) {
    alert("Selecione uma campanha para exportar.");
    return;
  }

  const produtosFiltrados = produtos.filter(p => p.campanha === campanhaSelecionada);

  if (produtosFiltrados.length === 0) {
    alert("Não há produtos cadastrados para essa campanha.");
    return;
  }

  const json = JSON.stringify(produtosFiltrados, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${campanhaSelecionada}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});