import { Schema, model, models, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  stock: number;
  createdBy?: Schema.Types.ObjectId;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio."],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "El slug del producto es obligatorio."],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "El precio del producto es obligatorio."],
      min: 0,
    },
    image: {
      type: String, // URL de la imagen del producto
    },
    stock: {
      type: Number,
      required: [true, "El stock del producto es obligatorio."],
      min: 0,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
