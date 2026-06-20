import OpenAI from 'openai';
import { AIProvider, AIMessage, AIResponse, AIOptions } from './types';

export class OpenAIService implements AIProvider {
  name = 'OpenAI';
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateResponse(
    messages: AIMessage[],
    options?: AIOptions
  ): Promise<AIResponse> {
    const completion = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
    });

    return {
      content: completion.choices[0]?.message?.content || '',
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      },
    };
  }

  async summarize(text: string): Promise<string> {
    const response = await this.generateResponse([
      {
        role: 'system',
        content: 'Eres un asistente útil que resume conversaciones de manera concisa.',
      },
      {
        role: 'user',
        content: `Resume la siguiente conversación en máximo 3 frases:\n\n${text}`,
      },
    ]);

    return response.content;
  }

  async classify(text: string, categories: string[]): Promise<string> {
    const categoryList = categories.join(', ');
    const response = await this.generateResponse([
      {
        role: 'system',
        content: `Clasifica el texto en una de estas categorías: ${categoryList}. Responde solo con el nombre de la categoría.`,
      },
      {
        role: 'user',
        content: text,
      },
    ]);

    return response.content.trim();
  }

  async extractEntities(text: string): Promise<Record<string, unknown>> {
    const response = await this.generateResponse([
      {
        role: 'system',
        content:
          'Extrae entidades relevantes del texto (nombre, teléfono, email, productos, cantidades). Responde en formato JSON.',
      },
      {
        role: 'user',
        content: text,
      },
    ]);

    try {
      return JSON.parse(response.content);
    } catch {
      return {};
    }
  }

  async generateSuggestions(messages: AIMessage[]): Promise<string[]> {
    const lastMessages = messages.slice(-5);
    const conversationText = lastMessages.map((m) => `${m.role}: ${m.content}`).join('\n');

    const response = await this.generateResponse([
      {
        role: 'system',
        content:
          'Genera 3 sugerencias de respuesta cortas y útiles para un agente de soporte de restaurante.',
      },
      {
        role: 'user',
        content: `Conversación:\n${conversationText}\n\nGenera 3 sugerencias de respuesta.`,
      },
    ]);

    return response.content.split('\n').filter((line) => line.trim());
  }
}
