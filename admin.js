"use strict";

if (localStorage.getItem("tipoUsuario") !== "admin" || localStorage.getItem("usuarioLogado") !== "true") {
    window.location.replace("login.html");
    throw new Error("Acesso administrativo negado.");
}

const KEY = {
    produtos: "produtosShalom",
    usuarios: "usuariosShalom",
    depositos: "depositosShalom",
    pedidos: "pedidosShalom"
};

const produtosPadrao = [
    { id: "caixa", nome: "Caixa de Papelão", preco: 10.90, estoque: 0, observacao: "", imagem: "caixa-de-papelao.webp" },
    { id: "sacola", nome: "Sacola Kraft", preco: 10.50, estoque: 0, observacao: "", imagem: "" },
    { id: "delivery", nome: "Embalagem Delivery", preco: 10.00, estoque: 0, observacao: "", imagem: "emblagens.jpg" },
    { id: "copo", nome: "Copo Descartável", preco: 10.90, estoque: 0, observacao: "", imagem: "copos png..webp" }
];

function lista(chave) {
    try {
        const x = JSON.parse(localStorage.getItem(chave) || "[]");
        return Array.isArray(x) ? x : [];
    } catch { return []; }
}

function salvar(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
}

function dinheiro(v) {
    return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function esc(v) {
    return String(v ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
}

function iniciarProdutos() {
    const atual = lista(KEY.produtos);
    if (!atual.length) salvar(KEY.produtos, produtosPadrao);
}

function mostrarDepositos() {
    const area = document.getElementById("listaDepositos");
    if (!area) return;
    const dados = lista(KEY.depositos);

    if (!dados.length) {
        area.innerHTML = '<p class="vazio">Nenhum depósito registrado.</p>';
        return;
    }

    area.innerHTML = dados.slice().reverse().map((d, i) => `
        <div class="deposito-item">
            <strong>${dinheiro(d.valor)}</strong>
            <span>${esc(d.descricao || "Depósito")}</span>
            <small>${esc(d.data || "")}</small>
            <button type="button" class="btn-excluir" data-deposito="${dados.length - 1 - i}">🗑️ Excluir</button>
        </div>
    `).join("");

    area.querySelectorAll("[data-deposito]").forEach(btn => {
        btn.addEventListener("click", () => {
            const dados = lista(KEY.depositos);
            dados.splice(Number(btn.dataset.deposito), 1);
            salvar(KEY.depositos, dados);
            atualizar();
        });
    });
}

function mostrarProdutos() {
    const area = document.getElementById("listaProdutos");
    if (!area) return;
    const produtos = lista(KEY.produtos);

    area.innerHTML = produtos.length ? produtos.map((p, i) => `
        <div class="produto-admin">
            <strong>${esc(p.nome)}</strong>
            <span>${dinheiro(p.preco)}</span>
            <span>Estoque: ${Number(p.estoque || 0)}</span>
            ${p.observacao ? `<small>${esc(p.observacao)}</small>` : ""}
            <div class="botoes">
                <button type="button" class="btn-editar" data-editar="${i}">✏️ Editar</button>
                <button type="button" class="btn-excluir" data-excluir="${i}">🗑️ Excluir</button>
            </div>
        </div>
    `).join("") : '<p class="vazio">Nenhum produto cadastrado.</p>';

    area.querySelectorAll("[data-editar]").forEach(btn => btn.onclick = () => editarProduto(Number(btn.dataset.editar)));
    area.querySelectorAll("[data-excluir]").forEach(btn => btn.onclick = () => excluirProduto(Number(btn.dataset.excluir)));
}

function mostrarPedidos() {
    const area = document.getElementById("listaPedidos");
    if (!area) return;
    const pedidos = lista(KEY.pedidos);

    if (!pedidos.length) {
        area.innerHTML = '<p class="vazio">Nenhum pedido registrado.</p>';
        return;
    }

    area.innerHTML = pedidos.slice().reverse().map((p, i) => `
        <div class="pedido-admin">
            <strong>Pedido ${pedidos.length - i}</strong>
            <span>👤 ${esc(p.nome || "Cliente")}</span>
            <span>💰 ${dinheiro(p.total)}</span>
            <span>💳 ${esc(p.pagamento || "")}</span>
            <small>${esc(p.data ? new Date(p.data).toLocaleString("pt-BR") : "")}</small>
        </div>
    `).join("");
}

function mostrarClientes() {
    const area = document.getElementById("listaClientes");
    if (!area) return;
    const clientes = lista(KEY.usuarios);

    area.innerHTML = clientes.length ? clientes.map(u => `
        <div class="cliente">
            <strong>👤 ${esc(u.nome || "Cliente")}</strong>
            <span>📧 ${esc(u.email || "")}</span>
        </div>
    `).join("") : '<p class="vazio">Nenhum cliente cadastrado.</p>';
}

function atualizarResumo() {
    const produtos = lista(KEY.produtos);
    const clientes = lista(KEY.usuarios);
    const depositos = lista(KEY.depositos);
    const saldo = depositos.reduce((s, d) => s + Number(d.valor || 0), 0);

    document.getElementById("saldo")?.replaceChildren(document.createTextNode(dinheiro(saldo)));
    document.getElementById("totalProdutos")?.replaceChildren(document.createTextNode(produtos.length));
    document.getElementById("totalClientes")?.replaceChildren(document.createTextNode(clientes.length));
    document.getElementById("totalDepositos")?.replaceChildren(document.createTextNode(depositos.length));
}

function mostrarMensagem(texto, ok = false) {
    const el = document.getElementById("mensagemDeposito");
    if (!el) return;
    el.textContent = texto;
    el.style.color = ok ? "green" : "red";
}

function registrarDeposito(event) {
    event.preventDefault();
    const valor = Number(document.getElementById("valorDeposito")?.value);
    const descricao = document.getElementById("descricaoDeposito")?.value.trim() || "Depósito";

    if (!Number.isFinite(valor) || valor <= 0) {
        mostrarMensagem("Digite um valor válido.");
        return;
    }

    const dados = lista(KEY.depositos);
    dados.push({ id: Date.now(), valor, descricao, data: new Date().toLocaleString("pt-BR") });
    salvar(KEY.depositos, dados);
    event.target.reset();
    mostrarMensagem("✅ Depósito registrado.", true);
    atualizar();
}

function abrirProduto() {
    document.getElementById("formularioProduto")?.classList.remove("oculto");
}

function fecharProduto() {
    document.getElementById("formularioProduto")?.classList.add("oculto");
    document.getElementById("formularioProduto")?.reset();
    const id = document.getElementById("produtoId");
    if (id) id.value = "";
}

function salvarProduto(event) {
    event.preventDefault();
    const id = document.getElementById("produtoId")?.value;
    const nome = document.getElementById("nomeProduto")?.value.trim();
    const preco = Number(document.getElementById("precoProduto")?.value);
    const estoque = Number(document.getElementById("estoqueProduto")?.value);
    const observacao = document.getElementById("observacaoProduto")?.value.trim() || "";
    const imagem = document.getElementById("imagemProduto")?.value.trim() || "";

    if (!nome || !Number.isFinite(preco) || preco < 0 || !Number.isFinite(estoque) || estoque < 0) {
        alert("Preencha corretamente nome, preço e estoque.");
        return;
    }

    const produtos = lista(KEY.produtos);
    const produto = id ? produtos.find(p => String(p.id) === String(id)) : null;

    if (produto) Object.assign(produto, { nome, preco, estoque, observacao, imagem });
    else produtos.push({ id: Date.now().toString(), nome, preco, estoque, observacao, imagem });

    salvar(KEY.produtos, produtos);
    fecharProduto();
    atualizar();
}

function editarProduto(i) {
    const p = lista(KEY.produtos)[i];
    if (!p) return;
    document.getElementById("produtoId").value = p.id;
    document.getElementById("nomeProduto").value = p.nome || "";
    document.getElementById("precoProduto").value = p.preco ?? "";
    document.getElementById("estoqueProduto").value = p.estoque ?? "";
    document.getElementById("observacaoProduto").value = p.observacao || "";
    document.getElementById("imagemProduto").value = p.imagem || "";
    abrirProduto();
}

function excluirProduto(i) {
    const produtos = lista(KEY.produtos);
    if (!produtos[i] || !confirm("Excluir este produto?")) return;
    produtos.splice(i, 1);
    salvar(KEY.produtos, produtos);
    atualizar();
}

function sair() {
    ["tipoUsuario","usuarioLogado","usuarioNome","nomeUsuario","clienteNome","clienteEmail","usuarioAtual"]
        .forEach(k => localStorage.removeItem(k));
    window.location.replace("login.html");
}

function atualizar() {
    mostrarDepositos();
    mostrarProdutos();
    mostrarPedidos();
    mostrarClientes();
    atualizarResumo();
}

document.addEventListener("DOMContentLoaded", () => {
    iniciarProdutos();
    document.getElementById("depositoForm")?.addEventListener("submit", registrarDeposito);
    document.getElementById("formularioProduto")?.addEventListener("submit", salvarProduto);
    document.getElementById("btnNovoProduto")?.addEventListener("click", abrirProduto);
    document.getElementById("btnCancelarProduto")?.addEventListener("click", fecharProduto);
    document.getElementById("btnSair")?.addEventListener("click", sair);
    atualizar();
});
