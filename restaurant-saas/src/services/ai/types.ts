/**
 * AI Provider Interface
 * Permite cambiar de proveedor de IA sin afectar el código principal
 */

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIProvider {
  name: string;
  
  generateResponse(messages: AIMessage[], options?: AIOptions): Promise<AIResponse>;
  summarize(text: string): Promise<string>;
  classify(text: string, categories: string[]): Promise<string>;
  extractEntities(text: string): Promise<Record<string, unknown>>;
  generateSuggestions(messages: AIMessage[]): Promise<string[]>;
}

export interface AIOptions {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}
