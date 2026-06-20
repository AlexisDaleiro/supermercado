/**
 * Message Provider Interface
 * Patrón para integrar diferentes canales de mensajería
 */

export interface Message {
  id?: string;
  content: string;
  from: string;
  to: string;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  participantId: string; // ID del cliente en el canal externo
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount?: number;
  metadata?: Record<string, unknown>;
}

export interface MessageProvider {
  name: string;
  
  sendMessage(to: string, content: string): Promise<string>;
  receiveMessages(): Promise<Message[]>;
  getConversations(): Promise<Conversation[]>;
  getConversationHistory(conversationId: string): Promise<Message[]>;
  markAsRead(messageId: string): Promise<void>;
  webhookHandler?(payload: unknown): Promise<void>;
}

export enum MessageChannelType {
  WHATSAPP = 'WHATSAPP',
  INSTAGRAM = 'INSTAGRAM',
  FACEBOOK = 'FACEBOOK',
  TELEGRAM = 'TELEGRAM',
  WEB = 'WEB',
  EMAIL = 'EMAIL',
}
