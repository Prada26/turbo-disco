"use strict";

const pagina = location.pathname.split("/").pop().toLowerCase();
if (pagina && pagina !== "comprar.html") throw new Error("Chatbot fora da loja.");
if (document.getElementById("chatbotShalom")) throw new Error("Chatbot já criado.");

const style = document.createElement("style");
style.textContent = `
#chatbotShalom{position:fixed;right:18px;bottom:18px;z-index:9999;font-family:Arial,sans-serif}
#chatbotBotao{width:58px;height:58px;border:0;border-radius:50%;background:#198754;color:#fff;font-size:26px;cursor:pointer;box-shadow:0 4px 15px #0004}
#chatbotJanelaShalom{display:none;position:absolute;right:0;bottom:70px;width:340px;height:460px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px #0004;flex-direction:column}
#chatbotJanelaShalom.aberto{display:flex}
#chatbotTopo{background:#198754;color:#fff;padding:14px;display:flex;justify-content:space-between}
#chatbotTopo strong,#chatbotTopo small{display:block}#chatbotFechar{border:0;background:none;color:#fff;font-size:20px;cursor:pointer}
#chatbotMensagensShalom{flex:1;overflow:auto;padding:12px;background:#f5f5f5}
.shalomBot,.shalomCliente{max-width:85%;padding:10px 12px;border-radius:12px;margin-bottom:9px;line-height:1.4}.shalomBot{background:#fff}.shalomCliente{margin-left:auto;background:#dcf8c6}
#chatbotSugestoesShalom{display:flex;gap:5px;padding:7px;overflow:auto;border-top:1px solid #ddd}#chatbotSugestoesShalom button{white-space:nowrap;border:1px solid #198754;background:#fff;color:#198754;border-radius:18px;padding:6px 9px;cursor:pointer}
#chatbotFormShalom{display:flex;gap:7px;padding:9px;border-top:1px solid #ddd}#chatbotInputShalom{flex:1;border:1px solid #ccc;border-radius:20px;padding:10px;outline:0}#chatbotFormShalom button{width:40px;border:0;border-radius:50%;background:#198754;color:#fff;cursor:pointer}
@media(max-width:500px){#chatbotJanelaShalom{width:calc(100vw - 25px);height:65vh}#chatbotShalom{right:12px;bottom:12px}}
`;
document.head.appendChild(style);

const chat = document.createElement("div");
chat.id = "chatbotShalom";
chat.innerHTML = `
<button id="chatbotBotao" type="button">💬</button>
<div id="chatbotJanelaShalom">
<div id="chatbotTopo"><div><strong>🤖 Assistente Shalom</strong><small>Atendimento automático</small></div><button id="chatbotFechar" type="button">✕</button></div>
<div id="chatbotMensagensShalom"><div class="shalomBot">👋 Olá! Posso ajudar com produtos, preços, estoque, pagamento e pedidos.</div></div>
<div id="chatbotSugestoesShalom"><button data-p="produtos">📦 Produtos</button><button data-p="precos">💰 Preços</button><button data-p="pagamento">💳 Pagamento</button><button data-p="pedido">📋 Pedido</button></div>
<form id="chatbotFormShalom"><input id="chatbotInputShalom" placeholder="Digite sua dúvida..." autocomplete="off"><button type="submit">➤</button></form>
</div>`;
document.body.appendChild(chat);

const janela = document.getElementById("chatbotJanelaShalom");
const mensagens = document.getElementById("chatbotMensagensShalom");
const input = document.getElementById("chatbotInputShalom");

function esc(v){return String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function produtos(){try{const x=JSON.parse(localStorage.getItem("produtosShalom")||"[]");return Array.isArray(x)?x:[]}catch{return[]}}
function dinheiro(v){return Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}
function bot(text){const d=document.createElement("div");d.className="shalomBot";d.innerHTML=text;mensagens.appendChild(d);mensagens.scrollTop=mensagens.scrollHeight}
function cliente(text){const d=document.createElement("div");d.className="shalomCliente";d.textContent=text;mensagens.appendChild(d);mensagens.scrollTop=mensagens.scrollHeight}
function responder(texto){
    const t=texto.toLowerCase(); const ps=produtos();
    if(/oi|olá|ola|bom dia|boa tarde|boa noite/.test(t)) return "👋 Olá! Como posso ajudar?";
    if(/produto|produtos|tem o que|vende/.test(t)) return ps.length ? "📦 Temos:<br>"+ps.map(p=>`• ${esc(p.nome)}`).join("<br>") : "Ainda não há produtos cadastrados.";
    if(/preço|preco|valor|quanto custa/.test(t)) return ps.length ? ps.map(p=>`💰 ${esc(p.nome)}: ${dinheiro(p.preco)}`).join("<br>") : "Não há preços cadastrados.";
    if(/estoque|disponível|disponivel|quantidade/.test(t)) return ps.length ? ps.map(p=>`📦 ${esc(p.nome)}: ${Number(p.estoque||0)} unidade(s)`).join("<br>") : "Não há produtos cadastrados.";
    if(/pagamento|pix|cartão|cartao|dinheiro/.test(t)) return "💳 Aceitamos Pix, dinheiro e cartão.";
    if(/pedido|compra|comprar/.test(t)) return "🛒 Escolha os produtos na loja, informe as quantidades e clique em continuar para pagamento.";
    if(/entrega|endereço|endereco/.test(t)) return "🚚 No pagamento você informa telefone, endereço, número e cidade para a entrega.";
    if(/obrigado|obrigada|valeu/.test(t)) return "😊 Por nada! Estou aqui para ajudar.";
    return "🤖 Não entendi. Tente perguntar sobre produtos, preços, estoque, pagamento ou pedidos.";
}

document.getElementById("chatbotBotao").onclick=()=>janela.classList.toggle("aberto");
document.getElementById("chatbotFechar").onclick=()=>janela.classList.remove("aberto");
document.getElementById("chatbotFormShalom").onsubmit=e=>{e.preventDefault();const v=input.value.trim();if(!v)return;cliente(v);input.value="";setTimeout(()=>bot(responder(v)),150)};
document.querySelectorAll("#chatbotSugestoesShalom button").forEach(b=>b.onclick=()=>{const p=b.dataset.p;cliente(b.textContent);bot(responder(p));});
