import { MessageProvider, Message, Conversation } from './types';

/**
 * Implementación mock de WhatsApp para desarrollo
 * En producción, integrar con WhatsApp Business API (Meta)
 */
export class WhatsAppProvider implements MessageProvider {
  name = 'WhatsApp';
  
  private apiKey?: string;
  private phoneNumberId?: string;

  constructor() {
    this.apiKey = process.env.WHATSAPP_API_KEY;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  }

  async sendMessage(to: string, content: string): Promise<string> {
    // TODO: Implementar llamada real a WhatsApp Business API
    // https://graph.facebook.com/v18.0/{phone-number-id}/messages
    
    console.log(`[WhatsApp Mock] Sending message to ${to}: ${content}`);
    
    // Simular envío exitoso
    const messageId = `wamid_${Date.now()}`;
    return messageId;
  }

  async receiveMessages(): Promise<Message[]> {
    // TODO: Implementar polling o webhook para recibir mensajes
    console.log('[WhatsApp Mock] Checking for new messages...');
    return [];
  }

  async getConversations(): Promise<Conversation[]> {
    // TODO: Obtener conversaciones activas de WhatsApp
    return [];
  }

  async getConversationHistory(conversationId: string): Promise<Message[]> {
    // TODO: Obtener historial de conversación
    console.log(`[WhatsApp Mock] Getting history for ${conversationId}`);
    return [];
  }

  async markAsRead(messageId: string): Promise<void> {
    // TODO: Marcar mensaje como leído en WhatsApp
    console.log(`[WhatsApp Mock] Marking ${messageId} as read`);
  }

  async webhookHandler(payload: unknown): Promise<void> {
    // TODO: Procesar webhooks de WhatsApp
    // Meta envía notificaciones cuando hay nuevos mensajes
    console.log('[WhatsApp Mock] Processing webhook...', payload);
  }
}

/**
 * Implementación mock de Instagram Direct
 * En producción, integrar con Instagram Graph API
 */
export class InstagramProvider implements MessageProvider {
  name = 'Instagram';
  
  private accessToken?: string;

  constructor() {
    this.accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  }

  async sendMessage(to: string, content: string): Promise<string> {
    console.log(`[Instagram Mock] Sending message to ${to}: ${content}`);
    return `ig_${Date.now()}`;
  }

  async receiveMessages(): Promise<Message[]> {
    return [];
  }

  async getConversations(): Promise<Conversation[]> {
    return [];
  }

  async getConversationHistory(conversationId: string): Promise<Message[]> {
    return [];
  }

  async markAsRead(messageId: string): Promise<void> {
    console.log(`[Instagram Mock] Marking ${messageId} as read`);
  }
}

/**
 * Implementación mock de Facebook Messenger
 */
export class FacebookProvider implements MessageProvider {
  name = 'Facebook';

  async sendMessage(to: string, content: string): Promise<string> {
    console.log(`[Facebook Mock] Sending message to ${to}: ${content}`);
    return `fb_${Date.now()}`;
  }

  async receiveMessages(): Promise<Message[]> {
    return [];
  }

  async getConversations(): Promise<Conversation[]> {
    return [];
  }

  async getConversationHistory(conversationId: string): Promise<Message[]> {
    return [];
  }

  async markAsRead(messageId: string): Promise<void> {
    console.log(`[Facebook Mock] Marking ${messageId} as read`);
  }
}

/**
 * Proveedor interno para mensajes web/chat en la plataforma
 */
export class WebChatProvider implements MessageProvider {
  name = 'WebChat';

  async sendMessage(to: string, content: string): Promise<string> {
    // Los mensajes web se guardan directamente en la DB
    console.log(`[WebChat] Message to ${to}: ${content}`);
    return `web_${Date.now()}`;
  }

  async receiveMessages(): Promise<Message[]> {
    return [];
  }

  async getConversations(): Promise<Conversation[]> {
    return [];
  }

  async getConversationHistory(conversationId: string): Promise<Message[]> {
    return [];
  }

  async markAsRead(messageId: string): Promise<void> {
    console.log(`[WebChat] Marking ${messageId} as read`);
  }
}
