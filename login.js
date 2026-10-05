"use strict";

const ADMIN_EMAIL = "admin@shalom.com";
const ADMIN_SENHA = "123456";

const form = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");

function limparSessao() {
    ["tipoUsuario","usuarioLogado","usuarioNome","nomeUsuario","clienteNome","clienteEmail","usuarioAtual"]
        .forEach(k => localStorage.removeItem(k));
}

function sessao(usuario, tipo) {
    localStorage.setItem("tipoUsuario", tipo);
    localStorage.setItem("usuarioLogado", "true");
    localStorage.setItem("usuarioNome", usuario.nome);
    localStorage.setItem("nomeUsuario", usuario.nome);
    localStorage.setItem("clienteNome", usuario.nome);
    localStorage.setItem("clienteEmail", usuario.email);
    localStorage.setItem("usuarioAtual", JSON.stringify({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo
    }));
}

function mostrar(texto, ok = false) {
    if (!mensagem) return;
    mensagem.textContent = texto;
    mensagem.className = ok ? "mensagem sucesso" : "mensagem erro";
}

form?.addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("email")?.value.trim().toLowerCase();
    const senha = document.getElementById("senha")?.value || "";

    if (!email || !senha) {
        mostrar("Digite o e-mail e a senha.");
        return;
    }

    // O administrador sempre é verificado antes dos clientes.
    if (email === ADMIN_EMAIL && senha === ADMIN_SENHA) {
        limparSessao();
        sessao({ id: "admin", nome: "Administrador", email: ADMIN_EMAIL }, "admin");
        window.location.replace("admin.html");
        return;
    }

    let usuarios = [];
    try {
        usuarios = JSON.parse(localStorage.getItem("usuariosShalom") || "[]");
        if (!Array.isArray(usuarios)) usuarios = [];
    } catch {
        usuarios = [];
    }

    const usuario = usuarios.find(u =>
        String(u.email || "").trim().toLowerCase() === email &&
        String(u.senha || "") === senha
    );

    if (!usuario) {
        mostrar("E-mail ou senha incorretos.");
        return;
    }

    limparSessao();
    sessao({
        id: usuario.id || Date.now().toString(),
        nome: usuario.nome || "Cliente",
        email: usuario.email || email
    }, "cliente");

    window.location.replace("comprar.html");
});
