document.addEventListener("DOMContentLoaded", () => {

```
"use strict";

const form = document.getElementById("cadastroForm");
const mensagem = document.getElementById("mensagem");

if (!form) {
    return;
}

form.addEventListener("submit", (event) => {

    event.preventDefault();

    const nome = document
        .getElementById("nome")
        .value
        .trim();

    const email = document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const senha = document
        .getElementById("senha")
        .value;

    const confirmarSenha = document
        .getElementById("confirmarSenha")
        .value;

    mensagem.textContent = "";
    mensagem.className = "mensagem";

    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (!nome || !email || !senha || !confirmarSenha) {

        mensagem.textContent =
            "Preencha todos os campos.";

        mensagem.classList.add("erro");

        return;
    }

    if (senha.length < 4) {

        mensagem.textContent =
            "A senha precisa ter pelo menos 4 caracteres.";

        mensagem.classList.add("erro");

        return;
    }

    if (senha !== confirmarSenha) {

        mensagem.textContent =
            "As senhas não são iguais.";

        mensagem.classList.add("erro");

        return;
    }

    // ==========================================
    // CARREGAR USUÁRIOS
    // ==========================================

    let usuarios = [];

    try {

        usuarios = JSON.parse(
            localStorage.getItem("usuariosSite")
        ) || [];

    } catch (erro) {

        usuarios = [];
    }

    // ==========================================
    // VERIFICAR E-MAIL
    // ==========================================

    const emailExiste = usuarios.some(
        (usuario) =>
            String(usuario.email || "")
                .trim()
                .toLowerCase() === email
    );

    if (emailExiste) {

        mensagem.textContent =
            "Este e-mail já está cadastrado.";

        mensagem.classList.add("erro");

        return;
    }

    // ==========================================
    // CRIAR USUÁRIO
    // ==========================================

    const novoUsuario = {

        id: Date.now(),

        nome: nome,

        email: email,

        senha: senha,

        dataCadastro:
            new Date().toLocaleString("pt-BR")

    };

    usuarios.push(novoUsuario);

    localStorage.setItem(
        "usuariosSite",
        JSON.stringify(usuarios)
    );

    // ==========================================
    // SUCESSO
    // ==========================================

    mensagem.textContent =
        "Conta criada com sucesso!";

    mensagem.classList.add("sucesso");

    form.reset();

    setTimeout(() => {

        window.location.href = "login.html";

    }, 1000);

});
```

});
