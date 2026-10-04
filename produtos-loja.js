/* =========================================================
   PRODUTOS-LOJA.JS
   RELAÇÃO DE PRODUTOS + CARRINHO
   SITE
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    const CHAVE_PRODUTOS = "produtosShalom";
    const CHAVE_CARRINHO = "carrinhoShalom";


    /* =====================================================
       ELEMENTOS DO HTML
    ===================================================== */

    const listaProdutos =
        document.getElementById("listaProdutosLoja");

    const pesquisa =
        document.getElementById("pesquisaProdutosLoja");

    const listaCarrinho =
        document.getElementById("listaCarrinho");

    const quantidadeItens =
        document.getElementById("quantidadeItens");

    const totalCarrinho =
        document.getElementById("totalCarrinho");

    const btnFinalizar =
        document.getElementById("btnFinalizarPedido");


    /* =====================================================
       VERIFICAÇÃO
    ===================================================== */

    if (!listaProdutos) {
        console.error(
            "Erro: #listaProdutosLoja não foi encontrado."
        );

        return;
    }


    /* =====================================================
       PEGAR PRODUTOS
    ===================================================== */

    function pegarProdutos() {

        try {

            const dados =
                localStorage.getItem(CHAVE_PRODUTOS);

            if (!dados) {
                return [];
            }

            const produtos = JSON.parse(dados);

            if (!Array.isArray(produtos)) {
                return [];
            }

            return produtos.filter(produto => produto);

        } catch (erro) {

            console.error(
                "Erro ao carregar produtos:",
                erro
            );

            return [];
        }
    }


    /* =====================================================
       PEGAR CARRINHO
    ===================================================== */

    function pegarCarrinho() {

        try {

            const dados =
                localStorage.getItem(CHAVE_CARRINHO);

            if (!dados) {
                return [];
            }

            const carrinho = JSON.parse(dados);

            if (!Array.isArray(carrinho)) {
                return [];
            }

            return carrinho;

        } catch (erro) {

            console.error(
                "Erro ao carregar carrinho:",
                erro
            );

            return [];
        }
    }


    /* =====================================================
       SALVAR CARRINHO
    ===================================================== */

    function salvarCarrinho(carrinho) {

        localStorage.setItem(
            CHAVE_CARRINHO,
            JSON.stringify(carrinho)
        );
    }


    /* =====================================================
       MOEDA
    ===================================================== */

    function formatarMoeda(valor) {

        return Number(valor || 0).toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }


    /* =====================================================
       ESCAPAR HTML
    ===================================================== */

    function escaparHTML(valor) {

        return String(valor ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================================
       NORMALIZAR TEXTO
    ===================================================== */

    function normalizarTexto(texto) {

        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }


    /* =====================================================
       MOSTRAR PRODUTOS
    ===================================================== */

    function mostrarProdutos(filtro = "") {

        const produtos = pegarProdutos();

        const termo =
            normalizarTexto(filtro.trim());


        const produtosFiltrados =
            produtos.filter(produto => {

                const nome =
                    normalizarTexto(produto.nome);

                const observacao =
                    normalizarTexto(
                        produto.observacao
                    );

                return (
                    nome.includes(termo) ||
                    observacao.includes(termo)
                );

            });


        /* ================================================
           NENHUM PRODUTO
        ================================================ */

        if (produtos.length === 0) {

            listaProdutos.innerHTML = `

                <div class="carrinho-vazio">

                    <div class="icone-carrinho">
                        📦
                    </div>

                    <h3>
                        Nenhum produto disponível
                    </h3>

                    <p>
                        Os produtos cadastrados no
                        painel administrativo aparecerão aqui.
                    </p>

                </div>

            `;

            return;
        }


        /* ================================================
           PESQUISA SEM RESULTADO
        ================================================ */

        if (produtosFiltrados.length === 0) {

            listaProdutos.innerHTML = `

                <div class="carrinho-vazio">

                    <div class="icone-carrinho">
                        🔎
                    </div>

                    <h3>
                        Produto não encontrado
                    </h3>

                    <p>
                        Tente pesquisar por outro nome.
                    </p>

                </div>

            `;

            return;
        }


        /* ================================================
           MONTAR CARDS
        ================================================ */

        listaProdutos.innerHTML =
            produtosFiltrados.map(produto => {

                const id =
                    String(produto.id);

                const nome =
                    escaparHTML(
                        produto.nome || "Produto"
                    );

                const preco =
                    Number(produto.preco || 0);

                const estoque =
                    Math.max(
                        0,
                        Number(produto.estoque || 0)
                    );

                const observacao =
                    String(
                        produto.observacao || ""
                    ).trim();

                const imagem =
                    String(
                        produto.imagem || ""
                    ).trim();


                /* ==========================================
                   STATUS DO ESTOQUE
                ========================================== */

                let textoEstoque = "";
                let classeEstoque = "";

                if (estoque <= 0) {

                    textoEstoque =
                        "❌ Produto indisponível";

                    classeEstoque =
                        "indisponivel";

                } else if (estoque <= 5) {

                    textoEstoque =
                        `⚠️ ${estoque} unidades disponíveis`;

                    classeEstoque =
                        "baixo";

                } else {

                    textoEstoque =
                        `✅ ${estoque} unidades disponíveis`;

                    classeEstoque =
                        "disponivel";
                }


                /* ==========================================
                   IMAGEM
                ========================================== */

                let blocoImagem = "";

                if (imagem) {

                    blocoImagem = `

                        <img
                            src="${escaparHTML(imagem)}"
                            alt="${nome}"
                            class="imagem-produto-loja"
                            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                        >

                        <div
                            class="sem-imagem-produto"
                            style="display:none;"
                        >
                            📦
                        </div>

                    `;

                } else {

                    blocoImagem = `

                        <div class="sem-imagem-produto">
                            📦
                        </div>

                    `;
                }


                /* ==========================================
                   OBSERVAÇÃO
                ========================================== */

                const blocoObservacao =
                    observacao
                        ? `
                            <div class="observacao-produto">
                                📝 ${escaparHTML(observacao)}
                            </div>
                          `
                        : "";


                /* ==========================================
                   BOTÃO
                ========================================== */

                const botao =
                    estoque > 0

                        ? `
                            <button
                                type="button"
                                class="btn-produto"
                                data-adicionar="${escaparHTML(id)}"
                            >
                                🛒 Adicionar ao pedido
                            </button>
                          `

                        : `
                            <button
                                type="button"
                                class="btn-produto indisponivel"
                                disabled
                            >
                                ❌ Indisponível
                            </button>
                          `;


                return `

                    <article
                        class="produto-card-loja"
                    >

                        <div class="imagem-container-produto">

                            ${blocoImagem}

                        </div>


                        <div class="produto-conteudo">

                            <h3>
                                ${nome}
                            </h3>


                            <div class="preco-produto">
                                ${formatarMoeda(preco)}
                            </div>


                            <div
                                class="estoque-produto ${classeEstoque}"
                            >
                                ${textoEstoque}
                            </div>


                            ${blocoObservacao}


                            ${botao}

                        </div>

                    </article>

                `;

            }).join("");


        /* ================================================
           EVENTOS DOS BOTÕES
        ================================================ */

        document
            .querySelectorAll("[data-adicionar]")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        const id =
                            botao.dataset.adicionar;

                        adicionarProdutoPedido(id);

                    }
                );

            });
    }


    /* =====================================================
       ADICIONAR PRODUTO
    ===================================================== */

    function adicionarProdutoPedido(id) {

        const produtos =
            pegarProdutos();

        const produto =
            produtos.find(
                item =>
                    String(item.id) === String(id)
            );


        if (!produto) {

            alert(
                "Produto não encontrado."
            );

            return;
        }


        const estoque =
            Number(produto.estoque || 0);


        if (estoque <= 0) {

            alert(
                "Este produto está sem estoque."
            );

            return;
        }


        let carrinho =
            pegarCarrinho();


        const itemExistente =
            carrinho.find(
                item =>
                    String(item.id) === String(id)
            );


        /* ================================================
           JÁ EXISTE NO CARRINHO
        ================================================ */

        if (itemExistente) {

            const quantidadeAtual =
                Number(
                    itemExistente.quantidade || 0
                );


            if (quantidadeAtual >= estoque) {

                alert(
                    `Você já adicionou todas as ${estoque} unidades disponíveis.`
                );

                return;
            }


            itemExistente.quantidade =
                quantidadeAtual + 1;

        } else {

            /* ============================================
               NOVO ITEM
            ============================================ */

            carrinho.push({

                id: produto.id,

                nome: produto.nome,

                preco: Number(
                    produto.preco || 0
                ),

                imagem:
                    produto.imagem || "",

                observacao:
                    produto.observacao || "",

                quantidade: 1

            });
        }


        salvarCarrinho(carrinho);

        mostrarCarrinho();

    }


    /* =====================================================
       MOSTRAR CARRINHO
    ===================================================== */

    function mostrarCarrinho() {

        if (!listaCarrinho) {
            return;
        }


        const carrinho =
            pegarCarrinho();


        /* ================================================
           CARRINHO VAZIO
        ================================================ */

        if (carrinho.length === 0) {

            listaCarrinho.innerHTML = `

                <div class="carrinho-vazio">

                    <div class="icone-carrinho">
                        🛒
                    </div>

                    <h3>
                        Nenhum item adicionado
                    </h3>

                    <p>
                        Escolha um produto
                        para adicioná-lo ao pedido.
                    </p>

                </div>

            `;

            atualizarResumoCarrinho();

            return;
        }


        /* ================================================
           PRODUTOS DO CARRINHO
        ================================================ */

        listaCarrinho.innerHTML =
            carrinho.map(item => {

                const id =
                    String(item.id);

                const nome =
                    escaparHTML(
                        item.nome || "Produto"
                    );

                const preco =
                    Number(item.preco || 0);

                const quantidade =
                    Math.max(
                        1,
                        Number(
                            item.quantidade || 1
                        )
                    );

                const subtotal =
                    preco * quantidade;

                const imagem =
                    String(
                        item.imagem || ""
                    ).trim();


                const imagemHTML =
                    imagem

                        ? `
                            <img
                                src="${escaparHTML(imagem)}"
                                alt="${nome}"
                                class="item-carrinho-imagem"
                                onerror="this.style.display='none';"
                            >
                          `

                        : `
                            <div
                                class="item-carrinho-imagem"
                                style="
                                    display:flex;
                                    align-items:center;
                                    justify-content:center;
                                    font-size:25px;
                                "
                            >
                                📦
                            </div>
                          `;


                return `

                    <div class="item-carrinho">

                        ${imagemHTML}


                        <div class="item-carrinho-info">

                            <strong>
                                ${nome}
                            </strong>


                            <div class="item-carrinho-preco">

                                ${formatarMoeda(preco)}
                                cada

                                <br>

                                Subtotal:
                                <strong>
                                    ${formatarMoeda(subtotal)}
                                </strong>

                            </div>


                            <div class="controle-quantidade">

                                <button
                                    type="button"
                                    data-diminuir="${escaparHTML(id)}"
                                >
                                    −
                                </button>


                                <span>
                                    ${quantidade}
                                </span>


                                <button
                                    type="button"
                                    data-aumentar="${escaparHTML(id)}"
                                >
                                    +
                                </button>

                            </div>

                        </div>


                        <button
                            type="button"
                            class="btn-remover-item"
                            title="Remover produto"
                            data-remover="${escaparHTML(id)}"
                        >
                            🗑️
                        </button>

                    </div>

                `;

            }).join("");


        /* ================================================
           EVENTOS
        ================================================ */

        document
            .querySelectorAll("[data-diminuir]")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        alterarQuantidade(
                            botao.dataset.diminuir,
                            -1
                        );

                    }
                );

            });


        document
            .querySelectorAll("[data-aumentar]")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        alterarQuantidade(
                            botao.dataset.aumentar,
                            1
                        );

                    }
                );

            });


        document
            .querySelectorAll("[data-remover]")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        removerProduto(
                            botao.dataset.remover
                        );

                    }
                );

            });


        atualizarResumoCarrinho();
    }


    /* =====================================================
       ALTERAR QUANTIDADE
    ===================================================== */

    function alterarQuantidade(id, alteracao) {

        let carrinho =
            pegarCarrinho();

        const produtos =
            pegarProdutos();

        const item =
            carrinho.find(
                produto =>
                    String(produto.id) === String(id)
            );


        if (!item) {
            return;
        }


        const produto =
            produtos.find(
                produto =>
                    String(produto.id) === String(id)
            );


        if (!produto) {

            carrinho =
                carrinho.filter(
                    item =>
                        String(item.id) !== String(id)
                );

            salvarCarrinho(carrinho);

            mostrarCarrinho();

            return;
        }


        const estoque =
            Number(produto.estoque || 0);


        let novaQuantidade =
            Number(item.quantidade || 1)
            + alteracao;


        /* ================================================
           NÃO DEIXAR MENOS DE 1
        ================================================ */

        if (novaQuantidade < 1) {

            novaQuantidade = 1;
        }


        /* ================================================
           RESPEITAR ESTOQUE
        ================================================ */

        if (novaQuantidade > estoque) {

            novaQuantidade = estoque;

            alert(
                `Quantidade máxima disponível: ${estoque}.`
            );
        }


        /* ================================================
           SE ESTOQUE VIROU ZERO
        ================================================ */

        if (estoque <= 0) {

            carrinho =
                carrinho.filter(
                    item =>
                        String(item.id) !== String(id)
                );

            salvarCarrinho(carrinho);

            mostrarCarrinho();

            return;
        }


        item.quantidade =
            novaQuantidade;


        salvarCarrinho(carrinho);

        mostrarCarrinho();
    }


    /* =====================================================
       REMOVER PRODUTO
    ===================================================== */

    function removerProduto(id) {

        let carrinho =
            pegarCarrinho();


        carrinho =
            carrinho.filter(
                item =>
                    String(item.id) !== String(id)
            );


        salvarCarrinho(carrinho);

        mostrarCarrinho();
    }


    /* =====================================================
       ATUALIZAR RESUMO
    ===================================================== */

    function atualizarResumoCarrinho() {

        const carrinho =
            pegarCarrinho();


        let quantidade = 0;

        let total = 0;


        carrinho.forEach(item => {

            const qtd =
                Number(
                    item.quantidade || 0
                );

            const preco =
                Number(
                    item.preco || 0
                );


            quantidade += qtd;

            total +=
                preco * qtd;

        });


        if (quantidadeItens) {

            quantidadeItens.textContent =
                quantidade === 1
                    ? "1 item"
                    : `${quantidade} itens`;
        }


        if (totalCarrinho) {

            totalCarrinho.textContent =
                formatarMoeda(total);
        }
    }


    /* =====================================================
       PESQUISA
    ===================================================== */

    if (pesquisa) {

        pesquisa.addEventListener(
            "input",
            () => {

                mostrarProdutos(
                    pesquisa.value
                );

            }
        );
    }


    /* =====================================================
       CONTINUAR PEDIDO
    ===================================================== */

    if (btnFinalizar) {

        btnFinalizar.addEventListener(
            "click",
            () => {

                const carrinho =
                    pegarCarrinho();


                if (carrinho.length === 0) {

                    alert(
                        "Adicione pelo menos um produto ao pedido."
                    );

                    return;
                }


                /* =========================================
                   CONFIRMAR ESTOQUE ATUAL
                ========================================= */

                const produtos =
                    pegarProdutos();


                for (const item of carrinho) {

                    const produto =
                        produtos.find(
                            p =>
                                String(p.id) ===
                                String(item.id)
                        );


                    if (!produto) {

                        alert(
                            `O produto "${item.nome}" não está mais disponível.`
                        );

                        return;
                    }


                    const estoque =
                        Number(
                            produto.estoque || 0
                        );


                    if (
                        Number(item.quantidade) >
                        estoque
                    ) {

                        alert(
                            `O produto "${item.nome}" possui apenas ${estoque} unidade(s) disponível(is).`
                        );

                        mostrarProdutos(
                            pesquisa
                                ? pesquisa.value
                                : ""
                        );

                        return;
                    }
                }


                window.location.href =
                    "comprar.html";

            }
        );
    }


    /* =====================================================
       ATUALIZAÇÃO INICIAL
    ===================================================== */

    mostrarProdutos();

    mostrarCarrinho();


    /* =====================================================
       ATUALIZAR SE OUTRA ABA ALTERAR O STORAGE
    ===================================================== */

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key === CHAVE_PRODUTOS ||
                event.key === CHAVE_CARRINHO
            ) {

                mostrarProdutos(
                    pesquisa
                        ? pesquisa.value
                        : ""
                );

                mostrarCarrinho();

            }

        }
    );

});