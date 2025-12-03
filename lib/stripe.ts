import Stripe from "stripe";
import { prisma } from "./prisma";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const STRIPE_PLAN_PRICE_ID = process.env.STRIPE_PLAN_PRICE_ID || "";

export async function createOrGetStripeCustomer(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (subscription?.stripeCustomerId) {
    return subscription.stripeCustomerId;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.email) {
    throw new Error("User email not found");
  }

  const customer = await stripe.customers.create({
    email: user.email,
    metadata: {
      userId,
    },
  });

  await prisma.subscription.update({
    where: { userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function createCheckoutSession(userId: string) {
  const customerId = await createOrGetStripeCustomer(userId);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: STRIPE_PLAN_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
    metadata: {
      userId,
    },
  });

  if (session.id) {
    await prisma.subscription.update({
      where: { userId },
      data: { stripeSessionId: session.id },
    });
  }

  return session;
}

export async function cancelSubscription(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (subscription?.stripeCustomerId) {
    const subscriptions = await stripe.subscriptions.list({
      customer: subscription.stripeCustomerId,
      limit: 1,
    });

    if (subscriptions.data[0]) {
      await stripe.subscriptions.cancel(subscriptions.data[0].id);
    }
  }

  return prisma.subscription.update({
    where: { userId },
    data: {
      isCancelled: true,
      cancelledAt: new Date(),
      status: "cancelled",
    },
  });
}

export async function isTrialExpired(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    return false;
  }

  return new Date() > subscription.trialEndDate;
}

export async function isPaidSubscriber(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    return false;
  }

  return subscription.plan === "pro" && subscription.status === "active";
}

export async function canCreateReport(userId: string): Promise<boolean> {
  const isPaid = await isPaidSubscriber(userId);
  const isExpired = await isTrialExpired(userId);

  return isPaid || !isExpired;
}
