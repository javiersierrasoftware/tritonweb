import { connectDB } from "@/lib/mongodb";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function handleRegistration(id: string, status: string, transactionId: string) {
  await connectDB();
  const registration = await Registration.findById(id);
  if (!registration) {
    console.error(`[Wompi Util] Registration not found for ID: ${id}`);
    throw new Error(`Registration not found for ID: ${id}`);
  }

  if (registration.status === "PENDING_PAYMENT") {
    if (status === "APPROVED") {
      registration.status = "COMPLETED";
      registration.wompiTransactionId = transactionId;
      await Event.findByIdAndUpdate(registration.event, { $inc: { slotsLeft: -1 } });
      console.log(`✅ [Wompi Util] Registration ${id} marked as COMPLETED.`);
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

            for (const item of order.items) {
                if (item.productId && (item.productId as any)._id) {
                    await Product.updateOne(
                        { _id: (item.productId as any)._id },
                        { $inc: { stock: -item.qty } }
                    );
                    console.log(`- [Wompi Util] Decremented stock for product ${(item.productId as any).name} by ${item.qty}`);
                } else {
                    console.warn(`- [Wompi Util] Product for item '${item.name}' not found or invalid. Stock not decremented.`);
                }
            }
            
            console.log(`✅ [Wompi Util] Order ${id} marked as PAID.`);

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
