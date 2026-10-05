```javascript
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PROTEÇÃO DO ADMIN
    ===================================================== */

    const tipoUsuario = localStorage.getItem("tipoUsuario");

    if (tipoUsuario !== "admin") {
        window.location.href = "login.html";
        return;
    }


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const usuarioAdmin = document.getElementById("usuarioAdmin");
    const btnSair = document.getElementById("btnSair");

    const listaPedidos = document.getElementById("listaPedidos");
    const listaClientes = document.getElementById("listaClientes");

    const formCliente = document.getElementById("formCliente");
    const atualizarPedidos =
        document.getElementById("atualizarPedidos");

    const totalPedidos =
        document.getElementById("totalPedidos");

    const totalClientes =
        document.getElementById("totalClientes");

    const faturamento =
        document.getElementById("faturamento");


    /* =====================================================
       USUÁRIO LOGADO
    ===================================================== */

    if (usuarioAdmin) {

        usuarioAdmin.textContent =
            localStorage.getItem("nomeUsuario") ||
            localStorage.getItem("usuarioLogado") ||
            "
```
