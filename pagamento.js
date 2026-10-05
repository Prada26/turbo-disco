"use strict";

if (localStorage.getItem("tipoUsuario") !== "cliente" || localStorage.getItem("usuarioLogado") !== "true") {
    window.location.replace("login.html");
    throw new Error("Cliente não autenticado.");
}

const resumo = document.getElementById("resumoPedido");
const formPagamento = document.getElementById("pagamentoForm");

function dinheiro(v) {
    return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function esc(v) {
    return String(v ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function lerCarrinho() {
    try {
        const dados = JSON.parse(localStorage.getItem("carrinhoCompra") || "null");
        if (Array.isArray(dados)) return { itens: dados, total: 0 };
        if (dados && Array.isArray(dados.itens)) return dados;
    } catch {}
    return { itens: [], total: 0 };
}

const carrinho = lerCarrinho();

if (!carrinho.itens.length) {
    resumo.innerHTML = "<p>🛒 Seu carrinho está vazio.</p>";
    formPagamento?.querySelector("button[type=submit]")?.setAttribute("disabled", "true");
} else {
    const total = carrinho.itens.reduce((s, item) => s + Number(item.preco || 0) * Number(item.quantidade || 0), 0);
    resumo.innerHTML = `
        ${carrinho.itens.map(item => `
            <div class="item-resumo">
                <span>${esc(item.nome)} x${Number(item.quantidade || 0)}</span>
                <strong>${dinheiro(Number(item.preco || 0) * Number(item.quantidade || 0))}</strong>
            </div>
        `).join("")}
        <div class="total-resumo"><strong>Total: ${dinheiro(total)}</strong></div>
    `;
}

formPagamento?.addEventListener("submit", event => {
    event.preventDefault();

    if (!carrinho.itens.length) {
        alert("Seu carrinho está vazio.");
        return;
    }

    const pagamento = document.querySelector('input[name="pagamento"]:checked');
    if (!pagamento) {
        alert("Escolha uma forma de pagamento.");
        return;
    }

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const endereco = document.getElementById("endereco").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const cidade = document.getElementById("cidade").value.trim();

    if (!nome || !telefone || !endereco || !numero || !cidade) {
        alert("Preencha todos os dados para entrega.");
        return;
    }

    const produtos = (() => {
        try {
            const x = JSON.parse(localStorage.getItem("produtosShalom") || "[]");
            return Array.isArray(x) ? x : [];
        } catch { return []; }
    })();

    // Confere estoque antes de concluir.
    for (const item of carrinho.itens) {
        const p = produtos.find(x => String(x.id) === String(item.id));
        if (p && Number(p.estoque || 0) < Number(item.quantidade || 0)) {
            alert(`Estoque insuficiente para: ${item.nome}`);
            return;
        }
    }

    const total = carrinho.itens.reduce((s, item) => s + Number(item.preco || 0) * Number(item.quantidade || 0), 0);
    const pedido = {
        id: "PED-" + Date.now(),
        usuario: localStorage.getItem("clienteEmail") || "",
        nome,
        telefone,
        endereco,
        numero,
        cidade,
        pagamento: pagamento.value,
        produtos: carrinho.itens,
        total,
        data: new Date().toISOString()
    };

    let pedidos = [];
    try {
        pedidos = JSON.parse(localStorage.getItem("pedidosShalom") || "[]");
        if (!Array.isArray(pedidos)) pedidos = [];
    } catch { pedidos = []; }

    pedidos.push(pedido);
    localStorage.setItem("pedidosShalom", JSON.stringify(pedidos));
    localStorage.setItem("pedidoTemporario", JSON.stringify(pedido));

    // Baixa o estoque.
    carrinho.itens.forEach(item => {
        const p = produtos.find(x => String(x.id) === String(item.id));
        if (p) p.estoque = Math.max(0, Number(p.estoque || 0) - Number(item.quantidade || 0));
    });
    localStorage.setItem("produtosShalom", JSON.stringify(produtos));
    localStorage.removeItem("carrinhoCompra");

    formPagamento.querySelector("button[type=submit]").disabled = true;
    window.location.replace("finalizacao.html");
});
