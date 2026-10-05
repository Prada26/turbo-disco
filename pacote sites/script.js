```javascript
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ANO DO RODAPÉ
    // =====================================================

    const ano = document.getElementById("ano");

    if (ano) {
        ano.textContent = new Date().getFullYear();
    }


    // =====================================================
    // ELEMENTOS DO MODAL
    // =====================================================

    const modal = document.getElementById("modalPedido");
    const fecharModal = document.getElementById("fecharModal");
    const form = document.getElementById("formPedido");
    const pacoteSelecionado =
        document.getElementById("pacoteSelecionado");


    // =====================================================
    // VARIÁVEIS DO PACOTE
    // =====================================================

    let pacoteAtual = "";
    let precoAtual = 0;


    // =====================================================
    // ABRIR MODAL
    // =====================================================

    document
        .querySelectorAll(".btn-contratar")
        .forEach(botao => {

            botao.addEventListener("click", () => {

                pacoteAtual =
                    botao.dataset.pacote || "";

                precoAtual =
                    Number(
                        bot
```
