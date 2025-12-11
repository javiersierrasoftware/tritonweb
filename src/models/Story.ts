import { Schema, model, models } from "mongoose";

const StorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio."],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "El contenido es obligatorio."],
    },
    author: {
      type: String, // A futuro podría ser: { type: Schema.Types.ObjectId, ref: 'User' }
      required: [true, "El autor es obligatorio."],
    },
    image: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Evita sobreescribir el modelo si ya existe (importante en Next.js)
const Story = models.Story || model("Story", StorySchema);

export default Story;