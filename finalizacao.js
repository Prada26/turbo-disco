(() => {
"use strict";

const form = document.getElementById("pedidoForm");
const resumoFinal = document.getElementById("resumoFinal");

function moeda(v) {
  return Number(v).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
}

function lerCarrinho() {
  try {
    const dados = JSON.parse(localStorage.getItem("carrinhoCompra") || "[]");
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

const carrinho = lerCarrinho();

if (!carrinho.length) {
  alert("Seu carrinho está vazio.");
  window.location.href = "comprar.html";
} else {
  const total = carrinho.reduce((s,p) => s + (Number(p.preco)||0) * (Number(p.quantidade)||0), 0);
  resumoFinal.innerHTML = `<strong>Itens:</strong> ${carrinho.map(p => `${p.quantidade}x ${p.nome}`).join(", ")}<br><br><strong>Total: R$ ${moeda(total)}</strong>`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const pagamento = document.querySelector('input[name="pagamento"]:checked');
  if (!pagamento) {
    alert("Escolha uma forma de pagamento.");
    return;
  }

  const pedido = {
    id: Date.now(),
    nome: document.getElementById("nome").value.trim(),
    telefone: document.getElementById("telefone").value.trim(),
    endereco: {
      rua: document.getElementById("endereco").value.trim(),
      numero: document.getElementById("numero").value.trim(),
      complemento: document.getElementById("complemento").value.trim(),
      bairro: document.getElementById("bairro").value.trim(),
      cidade: document.getElementById("cidade").value.trim(),
      cep: document.getElementById("cep").value.trim()
    },
    pagamento: pagamento.value,
    observacao: document.getElementById("observacao").value.trim(),
    produtos: carrinho,
    total: Number(carrinho.reduce((s,p) => s + (Number(p.preco)||0)*(Number(p.quantidade)||0), 0).toFixed(2)),
    data: new Date().toISOString(),
    status: "Pendente"
  };

  let pedidos = [];
  try {
    const dados = JSON.parse(localStorage.getItem("pedidosShalom") || "[]");
    pedidos = Array.isArray(dados) ? dados : [];
  } catch {}

  pedidos.push(pedido);
  localStorage.setItem("pedidosShalom", JSON.stringify(pedidos));
  localStorage.setItem("ultimoPedido", JSON.stringify(pedido));
  localStorage.removeItem("carrinhoCompra");

  alert(`Pedido #${pedido.id} registrado com sucesso!`);
  window.location.href = "pedido-confirmado.html";
});
})();
