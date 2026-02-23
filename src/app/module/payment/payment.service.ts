/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      striperEventId: event.id,
    },
  });

  if (existingPayment) {
    console.log(`Event ${event.id} already exists. Skipping`);
    return { message: `This event id: {${event.id}} already exists` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const appointmentId = session.metadata?.appointmentId;

      const paymentId = session.metadata?.paymentId;

      if (!appointmentId || !paymentId) {
        console.error("Missing appointmentId or paymentId in session metadata");
        return { message: "Missing appointmentId or paymentId in session metadata" };
      }

      const appointment = await prisma.appointment.findUnique({
        where: {
          id: appointmentId,
        },
      });

      if (!appointment) {
        console.error("Appointment not found");
        return { message: "Appointment not found" };
      }

      await prisma.$transaction(async (tx) => {
        await tx.appointment.update({
          where: {
            id: appointmentId,
          },
          data: {
            paymentStatus:
              session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
          },
        });

        await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            striperEventId: event.id,
            status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            paymentGatewayData: session as any,
          },
        });
      });

      console.log(`Payment completed for appointment - ${appointmentId}`);
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;

      console.log(
        `Checkout session {${session.id}} expired for appointment. Marking associated appointment as cancelled.`
      );
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;

      console.log(
        `Payment intent {${session.id}} failed for appointment. Marking associated appointment as cancelled.`
      );
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { message: `Webhook event ${event.id} processed successfully` };
};

export const PaymentService = {
  handleStripeWebhookEvent,
};
