import { MessageProvider, MessageChannelType } from './types';
import {
  WhatsAppProvider,
  InstagramProvider,
  FacebookProvider,
  WebChatProvider,
} from './providers';

/**
 * Registry de proveedores de mensajería
 * Permite obtener el proveedor correcto según el canal
 */
export class MessagingRegistry {
  private static providers: Map<MessageChannelType, MessageProvider> = new Map();

  static register(channel: MessageChannelType, provider: MessageProvider): void {
    this.providers.set(channel, provider);
  }

  static getProvider(channel: MessageChannelType): MessageProvider | undefined {
    return this.providers.get(channel);
  }

  static getAllProviders(): Map<MessageChannelType, MessageProvider> {
    return this.providers;
  }
}

// Inicializar proveedores
MessagingRegistry.register(MessageChannelType.WHATSAPP, new WhatsAppProvider());
MessagingRegistry.register(MessageChannelType.INSTAGRAM, new InstagramProvider());
MessagingRegistry.register(MessageChannelType.FACEBOOK, new FacebookProvider());
MessagingRegistry.register(MessageChannelType.WEB, new WebChatProvider());

export function getMessagingProvider(
  channel: MessageChannelType
): MessageProvider | undefined {
  return MessagingRegistry.getProvider(channel);
}

export function getAllMessagingProviders(): Map<
  MessageChannelType,
  MessageProvider
> {
  return MessagingRegistry.getAllProviders();
}
