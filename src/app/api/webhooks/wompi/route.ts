import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import crypto from "crypto";

export async function POST(request: Request) {
  await connectDB();

  const webhookSecret = process.env.WOMPI_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("WOMPI_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ message: "Server configuration error." }, { status: 500 });
  }

  // --- 1. Read Raw Request Body for Signature Verification ---
  const rawBody = await request.text();
  console.log("Wompi Webhook: Raw body received:", rawBody);
  const wompiSignature = headers().get("X-Wompi-Signature"); // Common Wompi header name, might vary
  console.log("Wompi Webhook: X-Wompi-Signature header received:", wompiSignature);

  if (!wompiSignature) {
    console.error("Missing X-Wompi-Signature header.");
    return NextResponse.json({ message: "Missing signature header." }, { status: 401 });
  }

  // --- 2. Implement Standard HMAC-SHA256 Signature Verification ---
  const hmac = crypto.createHmac("sha256", webhookSecret);
  hmac.update(rawBody);
  const calculatedSignature = hmac.digest("hex");
  console.log("Wompi Webhook: Calculated signature:", calculatedSignature);

  if (calculatedSignature !== wompiSignature) {
    console.error("Webhook signature verification failed. Calculated:", calculatedSignature, "Received:", wompiSignature);
    return NextResponse.json({ message: "Invalid signature." }, { status: 401 });
  }
  console.log("Wompi Webhook: Signature verified successfully.");

  // --- 3. Parse JSON Body After Verification ---
  let eventPayload;
  try {
    eventPayload = JSON.parse(rawBody);
    console.log("Wompi Webhook: Parsed event payload:", eventPayload);
  } catch (parseError) {
    console.error("Error parsing webhook body:", parseError);
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  // --- 4. Process the Event ---
  const { data } = eventPayload;
  const transaction = data.transaction;
  console.log("Wompi Webhook: Transaction details:", transaction);

  if (!transaction || !transaction.reference) {
    console.error("Wompi Webhook: Invalid event data - missing transaction or reference.");
    return NextResponse.json({ message: "Invalid event data." }, { status: 400 });
  }

  try {
    const registration = await Registration.findById(transaction.reference);
    if (!registration) {
      console.error(`Registration not found for reference: ${transaction.reference}`);
      // Return 200 so Wompi doesn't retry for a non-existent registration
      return NextResponse.json({ message: "Registration not found." }, { status: 200 });
    }

    // Only process if the registration is still pending
    if (registration.status === "PENDING_PAYMENT") {
      if (transaction.status === "APPROVED") {
        // --- PAYMENT SUCCESS ---
        registration.status = "COMPLETED";
        registration.wompiTransactionId = transaction.id;
        
        // Decrement event slots
        await Event.findByIdAndUpdate(registration.event, { $inc: { slotsLeft: -1 } });

        // --- REMOVED USER CREATION LOGIC ---
        // As per user's request, registration should not automatically create platform users.
        // If a registration has guestInfo, it remains a guest registration.
        // If it was linked to a user, it remains linked.
        
      } else if (["DECLINED", "ERROR", "VOIDED"].includes(transaction.status)) {
        // --- PAYMENT FAILED ---
        registration.status = "FAILED";
        registration.wompiTransactionId = transaction.id;
      }
      
      await registration.save();
    }
    
    return NextResponse.json({ message: "Webhook processed successfully." }, { status: 200 });

  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}