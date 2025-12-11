import { Schema, model, models, Document } from "mongoose";

export interface IRegistration extends Document {
  user?: Schema.Types.ObjectId;
  event: Schema.Types.ObjectId;
  guestInfo?: {
    name: string;
    email: string;
  };
  cedula: string;
  gender: "Hombre" | "Mujer";
  phoneNumber: string;
  dateOfBirth: Date;
  distance?: string;
  category?: string;
  tshirtSize?: string;
  status: "PENDING_PAYMENT" | "COMPLETED" | "FAILED";
  paymentId?: string;
  wompiTransactionId?: string;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    guestInfo: {
      name: { type: String },
      email: { type: String },
    },
    cedula: { type: String, required: true },
    gender: { type: String, enum: ["Hombre", "Mujer"], required: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    distance: { type: String },
    category: { type: String },
    tshirtSize: { type: String },
    status: {
      type: String,
      enum: ["PENDING_PAYMENT", "COMPLETED", "FAILED"],
      default: "PENDING_PAYMENT",
    },
    paymentId: { type: String }, // Could be the Wompi transaction ID or our own reference
    wompiTransactionId: { type: String },
  },
  {
    timestamps: true,
  }
);

const Registration = models.Registration || model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
