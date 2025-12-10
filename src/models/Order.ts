import { Schema, model, models, Document } from "mongoose";

interface IOrderItem {
  productId: Schema.Types.ObjectId;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

interface IGuestInfo {
  name: string;
  email: string;
  cedula: string;
  address: string;
  phoneNumber: string;
}

export interface IOrder extends Document {
  user?: Schema.Types.ObjectId; // Optional, if user is logged in
  guestInfo: IGuestInfo;
  items: IOrderItem[];
  totalAmount: number;
  paymentId?: string; // Wompi payment ID
  wompiTransactionId?: string; // Actual transaction ID from Wompi callback
  status: "PENDING_PAYMENT" | "COMPLETED" | "FAILED" | "PAID"; // Added PAID for clarity
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 },
  image: { type: String },
});

const GuestInfoSchema = new Schema<IGuestInfo>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cedula: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    guestInfo: { type: GuestInfoSchema, required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentId: { type: String },
    wompiTransactionId: { type: String },
    status: {
      type: String,
      enum: ["PENDING_PAYMENT", "COMPLETED", "FAILED", "PAID"],
      default: "PENDING_PAYMENT",
    },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model<IOrder>("Order", OrderSchema);

export default Order;