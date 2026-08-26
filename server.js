import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY;

app.get('/', (req,res)=> res.send('Tamilan AI 2026 Running'));

app.post('/chat', async (req,res)=>{
  try{
    const {message, lang} = req.body;
    let reply = '';
    // Try Gemini
    try{
      const gRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({contents:[{parts:[{text: message}]}]})
      });
      const gData = await gRes.json();
      reply = gData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }catch(e){}
    // Fallback Groq
    if(!reply){
      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${GROQ_KEY}`},
        body: JSON.stringify({model:'llama-3.3-70b-versatile',messages:[{role:'user',content:message}]})
      });
      const groqData = await groqRes.json();
      reply = groqData?.choices?.[0]?.message?.content || 'Vanakkam! Tamilan AI ready.';
    }
    res.json({reply});
  }catch(err){ res.json({reply:'Error: '+err.message}); }
});

app.listen(process.env.PORT||3000, ()=> console.log('running'));
