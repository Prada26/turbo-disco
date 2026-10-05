"use strict";

const form = document.getElementById("cadastroForm");
const mensagem = document.getElementById("mensagem");

function mostrar(texto, ok = false) {
    if (!mensagem) return;
    mensagem.textContent = texto;
    mensagem.style.color = ok ? "green" : "red";
}

function usuarios() {
    try {
        const lista = JSON.parse(localStorage.getItem("usuariosShalom") || "[]");
        return Array.isArray(lista) ? lista : [];
    } catch {
        return [];
    }
}

form?.addEventListener("submit", event => {
    event.preventDefault();

    const nome = document.getElementById("nome")?.value.trim();
    const email = document.getElementById("email")?.value.trim().toLowerCase();
    const senha = document.getElementById("senha")?.value || "";
    const confirmar = document.getElementById("confirmarSenha")?.value || "";

    if (!nome || !email || !senha || !confirmar) {
        mostrar("Preencha todos os campos.");
        return;
    }

    if (senha.length < 6) {
        mostrar("A senha precisa ter pelo menos 6 caracteres.");
        return;
    }

    if (senha !== confirmar) {
        mostrar("As senhas não são iguais.");
        return;
    }

    if (email === "admin@shalom.com") {
        mostrar("Este e-mail é reservado para o administrador.");
        return;
    }

    const lista = usuarios();

    if (lista.some(u => String(u.email || "").toLowerCase() === email)) {
        mostrar("Este e-mail já está cadastrado.");
        return;
    }

    lista.push({
        id: Date.now().toString(),
        nome,
        email,
        senha,
        tipo: "cliente",
        dataCadastro: new Date().toISOString()
    });

    localStorage.setItem("usuariosShalom", JSON.stringify(lista));
    mostrar("✅ Cadastro realizado! Entrando...", true);

    setTimeout(() => window.location.replace("login.html"), 700);
});
