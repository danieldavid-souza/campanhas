// Lista de produtos da campanha Setembro Amarelo
const produtos = [
  {
    nome: "Caneca Setembro Amarelo",
    descricao: "Caneca com mensagem de apoio e acolhimento. Capacidade 325ml.",
    preco: 35.00,
    imagem: "imagens/setembro/caneca.jpg"
  },
  {
    nome: "Camisa Consciente",
    descricao: "Camisa amarela com frase inspiradora. Tecido leve e confortável.",
    preco: 45.00,
    imagem: "imagens/setembro/camisa.jpg"
  },
  {
    nome: "Azulejo Decorativo",
    descricao: "Azulejo 20x20cm com arte de esperança e empatia.",
    preco: 40.00,
    imagem: "imagens/setembro/azulejo.jpg"
  },
  {
    nome: "Chaveiro de Apoio",
    descricao: "Chaveiro com frase de incentivo. Pequeno gesto, grande impacto.",
    preco: 10.00,
    imagem: "imagens/setembro/chaveiro.jpg"
  }
];

// Renderiza os cards na página
function renderizarProdutos() {
  const container = document.getElementById('produtos');
  container.innerHTML = '';

  produtos.forEach((produto, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${index * 100}ms`;

    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
    `;

    container.appendChild(card);
  });
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', renderizarProdutos);
