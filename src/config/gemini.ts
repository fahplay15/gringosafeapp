import { GoogleGenerativeAI } from '@google/generative-ai';

// Substitua pela sua chave de API do Gemini
// Crie uma em: https://ai.google.dev
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('VITE_GEMINI_API_KEY não está configurada. Funcionalidades de IA serão desabilitadas.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function generatePriceSuggestion(item: string, region: string): Promise<string> {
  if (!GEMINI_API_KEY) return '';
  
  try {
    const prompt = `Você é um assistente de análise de preços justo em praias brasileiras.
    
Item: ${item}
Região: ${region}

Baseado em preços típicos praiais brasileiros, forneça:
1. Uma sugestão de preço justo
2. Motivo da sugestão
3. Intervalo de variação aceitável

Responda de forma concisa em 2-3 linhas.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Erro ao gerar sugestão com Gemini:', error);
    return '';
  }
}

export async function validatePrice(item: string, price: number, region: string): Promise<{ fair: boolean; message: string }> {
  if (!GEMINI_API_KEY) return { fair: true, message: '' };
  
  try {
    const prompt = `Você é um especialista em preços justos em praias brasileiras.

Item: ${item}
Preço reportado: R$${price}
Região: ${region}

Este preço parece justo? Responda APENAS com:
- "JUSTO" se o preço está dentro da média regional
- "ALTO" se está acima do esperado
- "BAIXO" se está abaixo do esperado

Depois, em uma segunda linha, explique brevemente (máx 15 palavras).`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const lines = text.split('\n');
    const verdict = lines[0];
    const message = lines[1] || '';

    return {
      fair: verdict.includes('JUSTO'),
      message: message
    };
  } catch (error) {
    console.error('Erro ao validar preço:', error);
    return { fair: true, message: '' };
  }
}

export async function answerQuery(question: string, context: string): Promise<string> {
  if (!GEMINI_API_KEY) return '';
  
  try {
    const prompt = `Você é um assistente amigável que ajuda turistas em praias brasileiras.
    
Pergunta do turista: "${question}"

Contexto local: ${context}

Responda de forma breve, útil e em português informal. Máximo 3 linhas.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Erro ao responder pergunta:', error);
    return '';
  }
}
