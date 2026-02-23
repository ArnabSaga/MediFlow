/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import stripe from "stripe";
import { envVars } from "../../config/env";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";

const handleStripeWebhookEvent = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"] as string;

  const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error("Missing stripe signature or webhook secret");
    return res
      .status(status.BAD_REQUEST)
      .json({ message: "Missing stripe signature or webhook secret" });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (error: any) {
    console.error("Error constructing webhook event", error.message);
    sendResponse(res, {
      httpStatusCode: status.BAD_REQUEST,
      success: false,
      message: "Error constructing webhook event",
    });
    return;
  }

  let result;

  try {
    result = await PaymentService.handleStripeWebhookEvent(event);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Webhook event processed successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Error processing webhook event", error.message);
    sendResponse(res, {
      httpStatusCode: status.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Error processing webhook event",
    });
  }
});

export const PaymentController = {
  handleStripeWebhookEvent,
};
