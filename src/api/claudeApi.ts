import axiosInstance from '../api';

export const generateGameWithClaude = async (prompt: string, style: string): Promise<string> => {
    try {
      const response = await axiosInstance.post('/game/generate', { prompt, style });
      return extractHtmlCode(response.data.gameHtml);
    } catch (error) {
      console.error('Error generating game with Claude:', error);
      throw error;
    }
  };

const extractHtmlCode = (responseText: string): string => {
  const htmlRegex = /<html[\s\S]*?<\/html>/i;
  const match = responseText.match(htmlRegex);
  return match ? match[0] : '';
};