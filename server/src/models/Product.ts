import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  id: number;
  img: string;
  name: string;
  price: number;
  old_price?: number;
  catetory: string; // matches frontend typo intentionally
  rating?: number;
  featured?: boolean;
}

const productSchema = new Schema<IProduct>(
  {
    id: { type: Number, required: true, unique: true },
    img: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    old_price: { type: Number, min: 0 },
    catetory: { type: String, required: true, lowercase: true },
    rating: { type: Number, default: 4, min: 1, max: 5 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", catetory: "text" });
productSchema.index({ catetory: 1 });
productSchema.index({ featured: 1 });

export const Product = mongoose.model<IProduct>("Product", productSchema);
