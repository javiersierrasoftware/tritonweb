import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio."],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria."],
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    discipline: {
      type: String,
    },
    goal: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);

export default User;

