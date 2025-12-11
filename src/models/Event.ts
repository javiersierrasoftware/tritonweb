import { Schema, model, models } from "mongoose";

const RegistrationPeriodSchema = new Schema({
  label: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  price: { type: Number },
});

const EventSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "El nombre del evento es obligatorio."],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "La fecha es obligatoria."],
    },
    time: {
      type: String,
      required: [true, "La hora es obligatoria."],
    },
    location: {
      type: String,
      required: [true, "La ubicación es obligatoria."],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Carrera", "Triatlón", "Ciclismo", "Natación", "Entrenamiento", "Otro"],
    },
    distance: {
      type: String, // Ej: "10K"
    },
    distances: {
      type: [String], // Ej: ["5K", "10K", "21K"]
      default: [],
    },
    category: {
      type: [String],
      default: [],
    },
    minAge: {
      type: Number,
      min: 0,
    },
    maxAge: {
      type: Number,
      min: 0,
    },
    shirtSizes: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
    },
    slotsLeft: {
      type: Number,
      default: 0,
    },
    image: {
      type: String, // URL de la imagen
    },
    registrationPeriods: {
      type: [RegistrationPeriodSchema],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // Asumiendo que tendrás un modelo 'User'
      required: true,
    },
    // A futuro:
    // registeredUsers: [{
    //   type: Schema.Types.ObjectId,
    //   ref: 'User'
    // }]
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt
  }
);

// Evita sobreescribir el modelo si ya existe (importante en Next.js)
const Event = models.Event || model("Event", EventSchema);

export default Event;
