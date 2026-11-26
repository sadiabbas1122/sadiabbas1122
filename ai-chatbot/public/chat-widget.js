(() => {
  const script = document.currentScript;
  if (!script) return;
  const endpoint = script.dataset.endpoint;
  const businessName = script.dataset.businessName || "Business Assistant";
  if (!endpoint) { console.warn("AI chatbot widget: data-endpoint is required."); return; }
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "Chat with us";
  button.setAttribute("aria-label", "Open business chat");
  Object.assign(button.style, { position:"fixed", right:"20px", bottom:"20px", zIndex:"2147483000", border:0, borderRadius:"999px", padding:"14px 19px", background:"#101d35", color:"#fff", font:"700 14px system-ui", boxShadow:"0 8px 28px #0003", cursor:"pointer" });
  const panel = document.createElement("section");
  panel.setAttribute("aria-label", businessName + " chat");
  Object.assign(panel.style, { display:"none", position:"fixed", right:"20px", bottom:"82px", zIndex:"2147483000", width:"min(360px,calc(100vw - 32px))", height:"min(490px,calc(100vh - 115px))", background:"#fff", border:"1px solid #dce6ef", borderRadius:"16px", boxShadow:"0 15px 45px #0003", overflow:"hidden", font:"14px system-ui", color:"#17243a" });
  panel.innerHTML = '<div style="background:#101d35;color:#fff;padding:15px;font-weight:800"></div><div data-chat-log style="height:calc(100% - 116px);overflow:auto;padding:13px;background:#f7fafc"></div><form style="display:flex;gap:7px;padding:10px;border-top:1px solid #e2eaf2"><input maxlength="1200" placeholder="Ask a question…" aria-label="Message" style="min-width:0;flex:1;padding:10px;border:1px solid #cad7e4;border-radius:8px"><button style="border:0;border-radius:8px;padding:0 13px;background:#19b6a5;font-weight:800">Send</button></form>';
  panel.querySelector("div").textContent = businessName;
  const log = panel.querySelector("[data-chat-log]");
  const form = panel.querySelector("form");
  const input = form.querySelector("input");
  const history = [];
  function add(text, mine) {
    const item = document.createElement("div");
    item.textContent = text;
    Object.assign(item.style, { whiteSpace:"pre-wrap", maxWidth:"88%", padding:"10px 12px", margin:"8px 0", borderRadius:"11px", lineHeight:"1.45", background:mine?"#101d35":"#e8f0f6", color:mine?"#fff":"#20344d", marginLeft:mine?"auto":"0" });
    log.appendChild(item); log.scrollTop = log.scrollHeight; return item;
  }
  add("Hello! How can I help you today?", false);
  button.addEventListener("click", () => { const open = panel.style.display === "none"; panel.style.display = open ? "block" : "none"; button.textContent = open ? "Close chat" : "Chat with us"; });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = input.value.trim(); if (!message) return;
    add(message, true); input.value = "";
    const pending = add("Thinking…", false);
    try {
      const response = await fetch(endpoint, { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({message,history}) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "The assistant is temporarily unavailable.");
      pending.textContent = data.answer;
      history.push({role:"user",text:message},{role:"model",text:data.answer});
      while (history.length > 8) history.shift();
    } catch (error) { pending.textContent = error.message; }
  });
  document.body.append(button, panel);
})();