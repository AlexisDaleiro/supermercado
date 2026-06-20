import { AIProvider, AIMessage, AIResponse, AIOptions } from './types';
import { OpenAIService } from './openai-service';

/**
 * Factory para crear el proveedor de IA configurado
 * Permite cambiar de proveedor mediante variables de entorno
 */
export function createAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || 'openai';

  switch (provider) {
    case 'openai':
      return new OpenAIService();
    // case 'claude':
    //   return new ClaudeService();
    // case 'gemini':
    //   return new GeminiService();
    default:
      return new OpenAIService();
  }
}

// Singleton instance
let aiProviderInstance: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!aiProviderInstance) {
    aiProviderInstance = createAIProvider();
  }
  return aiProviderInstance;
}

// Servicio de alto nivel para usar IA en la aplicación
export class AIService {
  private provider: AIProvider;

  constructor(provider?: AIProvider) {
    this.provider = provider || getAIProvider();
  }

  async generateAutoReply(conversationHistory: AIMessage[]): Promise<string> {
    const systemPrompt = `Eres un asistente virtual para un restaurante. 
Tu trabajo es ayudar a los clientes con:
- Reservas
- Pedidos
- Información del menú
- Preguntas frecuentes

Sé amable, profesional y conciso. Si no sabes algo, ofrece conectar al cliente con un agente humano.`;

    const response = await this.provider.generateResponse(
      [{ role: 'system', content: systemPrompt }, ...conversationHistory],
      { temperature: 0.7 }
    );

    return response.content;
  }

  async summarizeConversation(messages: string[]): Promise<string> {
    const text = messages.join('\n');
    return this.provider.summarize(text);
  }

  async classifyIntent(message: string): Promise<string> {
    const categories = [
      'reserva',
      'pedido',
      'consulta_menu',
      'queja',
      'felicitacion',
      'informacion_general',
      'otro',
    ];
    return this.provider.classify(message, categories);
  }

  async extractOrderDetails(message: string): Promise<Record<string, unknown>> {
    return this.provider.extractEntities(message);
  }

  async generateResponseSuggestions(
    conversationHistory: AIMessage[]
  ): Promise<string[]> {
    return this.provider.generateSuggestions(conversationHistory);
  }
}

// Export singleton instance
export const aiService = new AIService();
