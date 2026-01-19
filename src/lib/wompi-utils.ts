import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User"; // Importar User
import { sendEventRegistrationEmail, sendOrderConfirmationEmail } from "@/lib/mail";

export async function handleRegistration(id: string, status: string, transactionId: string) {
  await connectDB();
  const registration = await Registration.findById(id).populate("event").populate("user"); // Populate user y event
  if (!registration) {
    console.error(`[Wompi Util] Registration not found for ID: ${id}`);
    throw new Error(`Registration not found for ID: ${id}`);
  }

  if (registration.status === "PENDING_PAYMENT") {
    if (status === "APPROVED") {
      registration.status = "COMPLETED";
      registration.wompiTransactionId = transactionId;
      await Event.findByIdAndUpdate(registration.event._id, { $inc: { slotsLeft: -1 } });
      console.log(`✅ [Wompi Util] Registration ${id} marked as COMPLETED.`);

      // Enviar correo
      const email = registration.guestInfo?.email || (registration.user as any)?.email;
      const name = registration.guestInfo?.name || (registration.user as any)?.name || "Deportista";

      if (email) {
        sendEventRegistrationEmail(email, name, (registration.event as any).name, {
          distance: registration.distance,
          category: registration.category,
          transactionId: transactionId
        }).catch(err => console.error("Error enviando email de evento:", err));
      } else {
        console.warn("No se pudo enviar email de evento: Falta correo.");
      }

    } else if (["DECLINED", "ERROR", "VOIDED"].includes(status)) {
      registration.status = "FAILED";
      registration.wompiTransactionId = transactionId;
      console.log(`❌ [Wompi Util] Registration ${id} marked as FAILED.`);
    }
    await registration.save();
  } else {
    console.log(`[Wompi Util] Registration ${id} was already processed. Status: ${registration.status}`);
  }
}

export async function handleOrder(id: string, status: string, transactionId: string) {
  await connectDB();
  const order = await Order.findById(id).populate('items.productId');
  if (!order) {
    console.error(`[Wompi Util] Order not found for ID: ${id}`);
    throw new Error(`Order not found for ID: ${id}`);
  }

  if (order.status === "PENDING_PAYMENT") {
    if (status === "APPROVED") {
      order.status = "PAID";
      order.wompiTransactionId = transactionId;

      const productDetails = [];

      for (const item of order.items) {
        if (item.productId && (item.productId as any)._id) {
          await Product.updateOne(
            { _id: (item.productId as any)._id },
            { $inc: { stock: -item.qty } }
          );
          productDetails.push({
            name: item.name,
            qty: item.qty,
            price: item.price
          });
          console.log(`- [Wompi Util] Decremented stock for product ${(item.productId as any).name} by ${item.qty}`);
        } else {
          console.warn(`- [Wompi Util] Product for item '${item.name}' not found or invalid. Stock not decremented.`);
        }
      }

      console.log(`✅ [Wompi Util] Order ${id} marked as PAID.`);

      // Enviar correo
      const email = order.guestInfo?.email;
      const name = order.guestInfo?.name || "Cliente";

      if (email) {
        sendOrderConfirmationEmail(email, name, id, productDetails)
          .catch(err => console.error("Error enviando email de orden:", err));
      } else {
        console.warn("No se pudo enviar email de orden: Falta correo.");
      }


    } else if (["DECLINED", "ERROR", "VOIDED"].includes(status)) {
      order.status = "FAILED";
      order.wompiTransactionId = transactionId;
      console.log(`❌ [Wompi Util] Order ${id} marked as FAILED.`);
    }
    await order.save();
  } else {
    console.log(`[Wompi Util] Order ${id} was already processed. Status: ${order.status}`);
  }
}
