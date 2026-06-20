import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

export enum PlanType {
  STARTER = 'STARTER',
  PRO = 'PRO',
  BUSINESS = 'BUSINESS',
}

export interface PlanConfig {
  id: PlanType;
  name: string;
  price: number;
  maxBranches: number;
  maxUsers: number;
  stripePriceId?: string;
  features: string[];
}

export const PLANS: Record<PlanType, PlanConfig> = {
  [PlanType.STARTER]: {
    id: PlanType.STARTER,
    name: 'Starter',
    price: 29.99,
    maxBranches: 1,
    maxUsers: 3,
    stripePriceId: process.env.STRIPE_PRICE_ID_STARTER,
    features: [
      '1 Sucursal',
      '3 Usuarios',
      'Gestión de inventario básica',
      'Soporte por email',
    ],
  },
  [PlanType.PRO]: {
    id: PlanType.PRO,
    name: 'Pro',
    price: 79.99,
    maxBranches: 5,
    maxUsers: 20,
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO,
    features: [
      'Hasta 5 sucursales',
      '20 Usuarios',
      'Todo lo del plan Starter',
      'Mensajería omnicanal',
      'Automatización con IA',
      'Reportes avanzados',
      'Soporte prioritario',
    ],
  },
  [PlanType.BUSINESS]: {
    id: PlanType.BUSINESS,
    name: 'Business',
    price: 199.99,
    maxBranches: -1, // Ilimitado
    maxUsers: -1, // Ilimitado
    stripePriceId: process.env.STRIPE_PRICE_ID_BUSINESS,
    features: [
      'Sucursales ilimitadas',
      'Usuarios ilimitados',
      'Todo lo del plan Pro',
      'API access',
      'Webhooks personalizados',
      'SLA garantizado',
      'Manager dedicado',
    ],
  },
};

export async function createCustomer(
  email: string,
  restaurantId: string
): Promise<string> {
  const customer = await stripe.customers.create({
    email,
    metadata: {
      restaurantId,
    },
  });

  return customer.id;
}

export async function createSubscription(
  customerId: string,
  priceId: string
): Promise<{ subscriptionId: string; status: string }> {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });

  return {
    subscriptionId: subscription.id,
    status: subscription.status,
  };
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await stripe.subscriptions.cancel(subscriptionId);
}

export async function updateSubscription(
  subscriptionId: string,
  priceId: string
): Promise<void> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
  });
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });

  return session.url || '';
}

export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}

export async function handleWebhook(
  payload: Buffer,
  signature: string
): Promise<Stripe.Event> {
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET || ''
  );

  return event;
}

export { stripe };
