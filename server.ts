import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Gemini Chat
  app.post("/api/nutrition/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "A chave GEMINI_API_KEY não está configurada no servidor. Por favor, adicione-a em Configurações > Secrets no AI Studio." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Prepare and sanitize history for generateContent (alternating user/model starting with user)
      const formattedHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      let lastRole: 'user' | 'model' | null = null;
      
      for (const msg of (history || [])) {
        const role = msg.sender === 'user' ? 'user' : 'model';
        // First message in history MUST be from the user
        if (formattedHistory.length === 0 && role !== 'user') {
          continue;
        }
        // Strict alternation check
        if (role === lastRole) {
          continue;
        }
        formattedHistory.push({
          role,
          parts: [{ text: msg.text }]
        });
        lastRole = role;
      }

      // Add the new user message to the contents array
      const contents = [
        ...formattedHistory,
        { role: 'user' as const, parts: [{ text: message }] }
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: `Você é o NutriAI, um assistente virtual especialista em nutrição esportiva e alimentação de baixo custo.
Seu objetivo é ajudar praticantes de musculação e atletas amadores a otimizarem sua dieta gastando pouco.
Você deve responder dúvidas sobre:
1. Substituição de alimentos caros por equivalentes saudáveis e baratos (ex: peito de frango por ovos inteiros ou proteína de soja PTS; patinho moído por sardinha; batata doce por mandioca; arroz integral por arroz branco enriquecido com casca de abóbora). Referencie o banco de dados de substitutos econômicos do aplicativo sempre que aplicável.
2. Quantidade de calorias, proteínas, carboidratos e gorduras em alimentos ou produtos específicos (tabelas nutricionais).
3. Sugestões de lanches, café da manhã, jantares e refeições focados em ganho de massa (hipertrofia) ou perda de gordura (definição muscular), prezando por ingredientes acessíveis.
4. Explicações amigáveis sobre metas de água e macros.

Instruções importantes:
- Mantenha suas respostas práticas, diretas, encorajadoras e baseadas em evidências científicas simples.
- Dê dicas financeiras práticas (como comprar a granel, em feiras livres, mercados atacadistas, preparar em casa).
- Escreva de forma estilizada e empática, em Português do Brasil.
- Use markdown (negritos, listas e tabelas) para deixar as informações fáceis de ler no visor pequeno de um smartphone simulado.`
        }
      });

      const text = response.text;
      res.json({ text });
    } catch (error: any) {
      console.error("Erro no chat de nutrição:", error);
      res.status(500).json({ error: error.message || "Erro desconhecido ao processar resposta do assistente." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
