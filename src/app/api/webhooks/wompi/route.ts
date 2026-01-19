import { NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { handleRegistration, handleOrder } from "@/lib/wompi-utils";

export async function POST(request: Request) {
  const webhookSecret = process.env.WOMPI_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("WOMPI_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ message: "Server configuration error." }, { status: 500 });
  }

  const rawBody = await request.text();
  const headersList = await headers();
  const wompiSignature = headersList.get("X-Wompi-Signature");

  if (!wompiSignature) {
    console.error("Missing X-Wompi-Signature header.");
    return NextResponse.json({ message: "Missing signature header." }, { status: 401 });
  }

  const hmac = crypto.createHmac("sha256", webhookSecret);
  hmac.update(rawBody);
  const calculatedSignature = hmac.digest("hex");

  if (calculatedSignature !== wompiSignature) {
    console.error("Webhook signature verification failed.");
    return NextResponse.json({ message: "Invalid signature." }, { status: 401 });
  }

  let eventPayload;
  try {
    eventPayload = JSON.parse(rawBody);
  } catch (parseError) {
    console.error("Error parsing webhook body:", parseError);
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const { data } = eventPayload;
  const transaction = data.transaction;

  if (!transaction || !transaction.reference) {
    console.error("Wompi Webhook: Invalid event data - missing transaction or reference.");
    return NextResponse.json({ message: "Invalid event data." }, { status: 400 });
  }

  const reference = transaction.reference;
  const status = transaction.status;
  const transactionId = transaction.id;

  try {
    if (reference.startsWith("reg_")) {
      await handleRegistration(reference.substring(4), status, transactionId);
    } else if (reference.startsWith("ord_")) {
      await handleOrder(reference.substring(4), status, transactionId);
    } else {
      console.warn(`Webhook received with unknown reference prefix: ${reference}`);
    }

    return NextResponse.json({ message: "Webhook processed successfully." }, { status: 200 });

  } catch (error: any) {
    console.error("Error processing webhook:", error.message);
    return NextResponse.json({ message: "Internal server error.", error: error.message }, { status: 500 });
  }
}