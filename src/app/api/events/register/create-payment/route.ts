import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import Event from "@/models/Event";
import Registration from "@/models/Registration";
import User from "@/models/User";

// Helper to decode JWT
interface UserPayload {
  id: string;
  email: string;
  name: string;
}

// Helper to find the current price
function getCurrentPrice(event: any): number {
    const now = new Date();
    
    if (event.registrationPeriods && event.registrationPeriods.length > 0) {
        for (const period of event.registrationPeriods) {
            const startDate = new Date(period.startDate);
            const endDate = new Date(period.endDate);
            if (now >= startDate && now <= endDate) {
                return (period.price || 0) * 100; // Return price in cents, assuming price is now a Number
            }
        }
    }
    
    // Fallback to the main event price if no period matches
    return (event.price || 0) * 100; // Return price in cents, assuming price is now a Number
}


export async function POST(request: Request) {
  await connectDB();

  try {
    const { eventId, name, email, cedula, gender, phoneNumber, dateOfBirth, distance, category, tshirtSize } = await request.json();

    // --- Data Validation ---
    if (!eventId || !name || !email || !cedula || !gender || !phoneNumber || !dateOfBirth) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found." }, { status: 404 });
    }
    
    // --- Dynamic Price Calculation ---
    const amountInCents = getCurrentPrice(event);
    
    // Handle free events directly
    if (amountInCents === 0) {
        let registrationData: any = {
            event: eventId,
            cedula,
            gender,
            phoneNumber,
            dateOfBirth: new Date(dateOfBirth),
            distance,
            category,
            tshirtSize,
            status: "COMPLETED", // Mark as completed for free events
            guestInfo: { name, email },
        };
        
        const newRegistration = new Registration(registrationData);
        await newRegistration.save();
        
        console.log(`✅ Direct registration completed for free event: ${email}`);
        return NextResponse.json({ redirectUrl: `/events/register/status/${newRegistration._id.toString()}` });
    }

    // If price is still invalid (negative or NaN after being non-zero)
    if (isNaN(amountInCents) || amountInCents < 0) {
        return NextResponse.json({ message: "Invalid event price." }, { status: 400 });
    }

    // --- User Handling (Always guestInfo, never link to platform user) ---
    let registrationData: any = {
      event: eventId,
      cedula,
      gender,
      phoneNumber,
      dateOfBirth: new Date(dateOfBirth), // Convert to Date object
      distance,
      category,
      tshirtSize,
      status: "PENDING_PAYMENT",
      guestInfo: { name, email }, // Always save guest info
    };
    
    
    // --- Create Pending Registration ---
    const newRegistration = new Registration(registrationData);
    await newRegistration.save();

    // --- Wompi API Interaction ---
    const wompiPrvKey = process.env.WOMPI_PRV_KEY;
    if (!wompiPrvKey) {
        throw new Error("Wompi environment variables are not set.");
    }

    const reference = `reg_${newRegistration._id.toString()}`;
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/events/register/status/${newRegistration._id.toString()}`;

    const wompiApiUrl = "https://sandbox.wompi.co/v1/payment_links";

    const wompiResponse = await fetch(wompiApiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${wompiPrvKey}`
        },
        body: JSON.stringify({
            name: `Inscripción: ${event.name}`,
            description: `Registro para ${name} (${email})`,
            single_use: true,
            collect_shipping: false,
            amount_in_cents: amountInCents,
            currency: "COP",
            customer_email: email,
            redirect_url: redirectUrl,
        })
    });

    const wompiData = await wompiResponse.json();

    if (!wompiResponse.ok) {
        console.error("Wompi API Error:", wompiData);
        await Registration.findByIdAndDelete(newRegistration._id); // Rollback
        throw new Error(wompiData.error?.messages?.join(', ') || "Failed to create Wompi payment link.");
    }

    const checkoutUrl = `https://checkout.wompi.co/l/${wompiData.data.id}`;

    // Update registration with payment link ID
    newRegistration.paymentId = wompiData.data.id;
    await newRegistration.save();

    console.log(`✅ Wompi payment link created for ${email}`);
    return NextResponse.json({ redirectUrl: checkoutUrl });

  } catch (error: any) {
    console.error("Error creating payment link:", error);
    // Note: rollback is attempted on wompi fail, but other errors might not be caught.
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}