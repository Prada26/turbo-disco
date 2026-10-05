```javascript
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("loginForm");

    const mensagem =
        document.getElementById("mensagem");


    form.addEventListener("submit", evento => {

        evento.preventDefault();


        const email =
            document.getElementById("email")
                .value
                .trim()
                .toLowerCase();

        const senha =
            document.getElementById("senha")
                .value;


        // =========================
        // LOGIN ADMINISTRADOR
        // =========================

        if (
            email === "admin@admin.com" &&
            senha === "123456"
        ) {

            localStorage.setItem(
                "tipoUsuario",
                "admin"
            );

            localStorage.setItem(
                "usuarioLogado",
                email
            );

            localStorage.setItem(
                "nomeUsuario",
                "Administrador"
            );

            window.location.href = "admin.html";

            return;
        }


        // =========================
        // CLIENTES
        // =========================

        const usuarios =
            JSON.parse(
                localStorage.getItem("usuariosSite") || "[]"
            );


        const usuario =
            usuarios.find(
                item =>
                    item.email.toLowerCase() === email &&
                    item.senha === senha
            );


        if (!usuario) {

            mensagem.textContent =
                "E-mail ou senha incorretos.";

            mensagem.style.color = "red";

            return;

        }


        localStorage.setItem(
            "tipoUsuario",
            "cliente"
        );

        localStorage.setItem(
            "usuarioLogado",
            usuario.email
        );

        localStorage.setItem(
            "nomeUsuario",
            usuario.nome
        );


        mensagem.textContent =
            "Login realizado com sucesso.";

        mensagem.style.color = "green";


        setTimeout(() => {

            window.location.href = "index.html";

        }, 500);

    });
document.addEventListener("DOMContentLoaded", () => {

```
"use strict";

const form = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");

if (!form) {
    return;
}

form.addEventListener("submit", (event) => {

    event.preventDefault();

    const email = document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const senha = document
        .getElementById("senha")
        .value;

    mensagem.textContent = "";
    mensagem.className = "mensagem";

    if (!email || !senha) {

        mensagem.textContent =
            "Preencha todos os campos.";

        mensagem.classList.add("erro");

        return;
    }

    // ==========================================
    // BUSCAR USUÁRIOS
    // ==========================================

    let usuarios = [];

    try {

        usuarios = JSON.parse(
            localStorage.getItem("usuariosSite")
        ) || [];

    } catch (erro) {

        console.error(
            "Erro ao carregar usuários:",
            erro
        );

        usuarios = [];
    }

    // ==========================================
    // PROCURAR USUÁRIO
    // ==========================================

    const usuario = usuarios.find(
        (item) =>
            String(item.email || "")
                .trim()
                .toLowerCase() === email &&
            String(item.senha || "") === senha
    );

    // ==========================================
    // USUÁRIO NÃO ENCONTRADO
    // ==========================================

    if (!usuario) {

        mensagem.textContent =
            "E-mail ou senha incorretos.";

        mensagem.classList.add("erro");

        return;
    }

    // ==========================================
    // CRIAR SESSÃO
    // ==========================================

    localStorage.setItem(
        "tipoUsuario",
        "cliente"
    );

    localStorage.setItem(
        "usuarioLogado",
        usuario.email
    );

    localStorage.setItem(
        "nomeUsuario",
        usuario.nome
    );

    localStorage.setItem(
        "usuarioNome",
        usuario.nome
    );

    localStorage.setItem(
        "clienteNome",
        usuario.nome
    );

    // ==========================================
    // REDIRECIONAR
    // ==========================================

    mensagem.textContent =
        "Login realizado! Entrando...";

    mensagem.classList.add("sucesso");

    setTimeout(() => {

        window.location.href = "comprar.html";

    }, 700);

});
```

});

});
```
