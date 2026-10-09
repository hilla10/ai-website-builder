import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma.js';

export const stripeWebhook = async (request: Request, response: Response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let stripeEvent: Stripe.Event;

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'] as string;

    try {
      stripeEvent = stripe.webhooks.constructEvent(
        request.body,
        signature,
        endpointSecret,
      );
    } catch (err: any) {
      console.log(`⚠️ Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  } else {
    return response.status(500).send('Missing Stripe webhook secret');
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = stripeEvent.data.object;
      const sessionList = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });
      const session = sessionList.data[0];
      const { transactionId, appId } = session.metadata as {
        transactionId: string;
        appId: string;
      };

      if (appId === 'ai-website-builder' && transactionId) {
        const transaction = await prisma.transaction.update({
          where: { id: transactionId },
          data: { isPaid: true },
        });

        //   Add credits to user Database
        await prisma.user.update({
          where: { id: transaction.userId },
          data: { credits: { increment: transaction.credits } },
        });
      }

      break;
    default:
      console.log(`Unhandled event type ${stripeEvent.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
};
