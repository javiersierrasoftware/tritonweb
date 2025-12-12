import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroSlide extends Document {
  image: string;
  title: string;
  subtitle: string;
  buttonLink: string;
  order: number; // To define the order of slides
}

const HeroSlideSchema: Schema = new Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  buttonLink: { type: String, required: true },
  order: { type: Number, required: true, unique: true },
});

export default mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);
