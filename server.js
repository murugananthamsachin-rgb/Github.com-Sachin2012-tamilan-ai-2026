import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY;

app.get('/', (req,res)=> res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tamilan AI 2026 - Dual Engine</title>
<meta property="og:title" content="Tamilan AI 2026 - Dual Engine Gemini + Groq">
<meta property="og:description" content="Tamil Search, Gold Rate, Currency, Tamil Calendar - Made in Tamil Nadu!">
<meta property="og:image" content="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800">
<style>
*{margin:0;padding:0;box-sizing:border-box}body{background:#000;color:#fff;font-family:system-ui;display:flex;flex-direction:column;height:100vh}header{padding:14px;background:#111;display:flex;justify-content:space-between;border-bottom:1px solid #222}.logo{font-weight:900;background:linear-gradient(90deg,#ff512f,#dd2476);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:20px}#chat{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}.msg{max-width:85%;padding:12px;border-radius:16px;white-space:pre-wrap}.user{align-self:flex-end;background:#dd2476}.ai{align-self:flex-start;background:#1e1e1e;border:1px solid #333}.input{display:flex;gap:8px;padding:12px;background:#111}input{flex:1;padding:12px 16px;border-radius:24px;border:1px solid #333;background:#1e1e1e;color:#fff}button{padding:12px 18px;border-radius:24px;border:none;background:#dd2476;color:#fff;font-weight:700}.badges{display:flex;gap:6px;padding:8px 16px;background:#0f0f0f;overflow-x:auto}.badge{background:#1e1e1e;border:1px solid #333;padding:4px 10px;border-radius:12px;font-size:11px}
</style>
</head>
<body>
<header><div class="logo">TAMILAN AI 2026</div><span style="background:#00c853;padding:3px 8px;border-radius:10px;font-size:11px">GEMINI + GROQ LIVE</span></header>
<div class="badges"><span class="badge">🔍 Tamil Search</span><span class="badge">💰 Gold Rate</span><span class="badge">💱 Currency</span><span class="badge">📅 Calendar</span></div>
<div id="chat"><div class="msg ai">Vanakkam da! 🙏 Dual Engine Ready!\n\nGemini: ${GEMINI_KEY?'✅ Connected':'❌ Add key in Railway'}\nGroq: ${GROQ_KEY?'✅ Connected':'❌ Add key'}\n\nEnna venum? Gold rate, currency, Tamil search - ellam kekalaam!</div></div>
<div class="input"><input id="q" placeholder="Tamil / English..." onkeydown="if(event.key==='Enter')send()"><button onclick="send()">Send</button></div>
<script>
async function send(){
 let el=document.getElementById('q'); let t=el.value.trim(); if(!t)return;
 let c=document.getElementById('chat'); c.innerHTML+=\`<div class="msg user">\${t}</div>\`; el.value='';
 c.innerHTML+='<div class="msg ai" id="tmp">Yosikkiren... Gemini + Groq working...</div>'; c.scrollTop=c.scrollHeight;
 try{
  let r=await fetch('/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:t,lang:'ta'})});
  let d=await r.json(); document.getElementById('tmp').remove(); c.innerHTML+=\`<div class="msg ai">\${d.reply||d.error}</div>\`;
 }catch(e){document.getElementById('tmp').remove(); c.innerHTML+=\`<div class="msg ai">Error: \${e.message}</div>\`;}
 c.scrollTop=c.scrollHeight;
}
</script>
</body>
</html>
`));

app.post('/chat', async (req,res)=>{
 try{
  const {message, lang} = req.body;
  let reply = '';
  // Try Gemini
  if(GEMINI_KEY){
   try{
    const gRes = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${GEMINI_KEY}\`,{
     method:'POST', headers:{'Content-Type':'application/json'},
     body: JSON.stringify({contents:[{parts:[{text: message}]}]})
    });
    const gData = await gRes.json();
    if(gData.candidates) reply = gData.candidates[0].content.parts[0].text;
   }catch(e){ console.log("Gemini fail", e.message) }
  }
  // Fallback Groq
  if(!reply && GROQ_KEY){
   try{
    const qRes = await fetch("https://api.groq.com/openai/v1/chat/completions",{
     method:'POST',
     headers:{"Content-Type":"application/json","Authorization":"Bearer "+GROQ_KEY},
     body: JSON.stringify({model:"llama-3.1-8b-instant",messages:[{role:"user",content:message}]})
    });
    const qData = await qRes.json();
    if(qData.choices) reply = qData.choices[0].message.content;
   }catch(e){ console.log("Groq fail", e.message) }
  }
  if(!reply) reply = "Demo mode da - Add GEMINI_API_KEY & GROQ_API_KEY in Railway Variables to make me real AI!";
  res.json({reply});
 }catch(err){ res.json({error: err.message}) }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Tamilan AI 2026 Dual Engine Running on "+PORT));
