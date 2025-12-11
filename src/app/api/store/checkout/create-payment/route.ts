import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

interface DecodedToken {
  id: string;
  role: string;
  [key: string]: any;
}

// Helper function to extract token (similar to other API routes)
function getToken() {
  const cookieStore = cookies();
  let token = cookieStore.get("triton_session_token")?.value;
  // For API routes, if client sends Authorization header, it might override cookie.
  // Not directly relevant here as CheckoutForm doesn't send it.
  return token;
}

export async function POST(request: Request) {
  await connectDB();

  try {
    const { name, email, cedula, address, phoneNumber, cartItems, totalAmount } = await request.json();

    // --- Data Validation ---
    if (!name || !email || !cedula || !address || !phoneNumber || !cartItems || cartItems.length === 0 || totalAmount === undefined) {
      return NextResponse.json({ message: "Faltan datos obligatorios para la orden." }, { status: 400 });
    }

    // --- Verify products and prices ---
    const productIds = cartItems.map((item: any) => item.productId);
    const productsInDb = await Product.find({ _id: { $in: productIds } });

    if (productsInDb.length !== cartItems.length) {
      return NextResponse.json({ message: "Algunos productos en el carrito no son válidos." }, { status: 400 });
    }

    let calculatedTotal = 0;
    const itemsForOrder = [];

    for (const item of cartItems) {
      const dbProduct = productsInDb.find(p => p._id.toString() === item.productId);
      if (!dbProduct) {
        return NextResponse.json({ message: `Producto no encontrado: ${item.name}` }, { status: 400 });
      }
      if (dbProduct.price !== item.price) {
        return NextResponse.json({ message: `Precio del producto no coincide para: ${item.name}` }, { status: 400 });
      }
      if (dbProduct.stock < item.qty) {
        return NextResponse.json({ message: `Stock insuficiente para: ${item.name}` }, { status: 400 });
      }
      calculatedTotal += dbProduct.price * item.qty;
      itemsForOrder.push({
        productId: dbProduct._id,
        name: dbProduct.name,
        price: dbProduct.price,
        qty: item.qty,
        image: dbProduct.image,
      });
    }

    if (calculatedTotal !== totalAmount) {
      return NextResponse.json({ message: "El total del carrito no coincide con el calculado en el servidor." }, { status: 400 });
    }
    
    // --- User context (optional, if logged in) ---
    let userId: string | undefined;
    const token = getToken();
    if (token) {
        try {
            const secret = process.env.JWT_SECRET!;
            const userPayload = jwt.verify(token, secret) as DecodedToken;

            // Prevent admins from making purchases
            if (userPayload.role === 'ADMIN') {
                return NextResponse.json({ message: "Los administradores no pueden realizar compras." }, { status: 403 });
            }

            userId = userPayload.id;
        } catch (error) {
            // Invalid token, proceed as guest
            console.warn("Invalid token during checkout, proceeding as guest.");
        }
    }


    // --- Create Pending Order ---
    const newOrder = new Order({
      user: userId,
      guestInfo: { name, email, cedula, address, phoneNumber },
      items: itemsForOrder,
      totalAmount: calculatedTotal,
      status: "PENDING_PAYMENT",
    });
    await newOrder.save();

    // --- Wompi API Interaction ---
    const wompiPrvKey = process.env.WOMPI_PRV_KEY;
    if (!wompiPrvKey) {
        throw new Error("Wompi environment variables are not set.");
    }

    const amountInCents = calculatedTotal * 100;
    const reference = `ord_${newOrder._id.toString()}`;
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/tienda/checkout/status/${newOrder._id.toString()}`;

    const wompiApiUrl = "https://sandbox.wompi.co/v1/payment_links";

    const wompiResponse = await fetch(wompiApiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${wompiPrvKey}`
        },
        body: JSON.stringify({
            name: `Compra en Tienda TRITON (Orden: ${newOrder._id.toString()})`,
            description: `Productos: ${itemsForOrder.map(item => item.name).join(', ')}`,
            single_use: true,
            collect_shipping: false, // Shipping collected in form, not via Wompi
            amount_in_cents: amountInCents,
            currency: "COP",
            customer_email: email,
            redirect_url: redirectUrl,
            // You might want to pass more buyer info if Wompi supports it directly
            // For example: customer_data: { phone_number: phoneNumber, address: address }
        })
    });

    const wompiData = await wompiResponse.json();

    if (!wompiResponse.ok) {
        console.error("Wompi API Error:", wompiData);
        await Order.findByIdAndDelete(newOrder._id); // Rollback
        throw new Error(wompiData.error?.messages?.join(', ') || "Failed to create Wompi payment link.");
    }

    const checkoutUrl = `https://checkout.wompi.co/l/${wompiData.data.id}`;

    // Update order with payment link ID
    newOrder.paymentId = wompiData.data.id;
    await newOrder.save();

    console.log(`✅ Wompi payment link created for store order: ${email}`);
    return NextResponse.json({ redirectUrl: checkoutUrl });

  } catch (error: any) {
    console.error("Error creating store payment link:", error);
    return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
  }
}