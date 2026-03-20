import { useState } from 'react';
import { generatePriceSuggestion, validatePrice, answerQuery } from '../config/gemini';

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestion = async (item: string, region: string) => {
    setLoading(true);
    setError(null);
    try {
      const suggestion = await generatePriceSuggestion(item, region);
      return suggestion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar sugestão');
      return '';
    } finally {
      setLoading(false);
    }
  };

  const checkPrice = async (item: string, price: number, region: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await validatePrice(item, price, region);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar preço');
      return { fair: true, message: '' };
    } finally {
      setLoading(false);
    }
  };

  const getAnswer = async (question: string, context: string) => {
    setLoading(true);
    setError(null);
    try {
      const answer = await answerQuery(question, context);
      return answer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar pergunta');
      return '';
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getSuggestion,
    checkPrice,
    getAnswer,
  };
}
