import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "./Product";

interface CartItem {
  product: IProduct["_id"];
  productSnapshot: {
    id: number;
    name: string;
    img: string;
    price: number;
    old_price?: number;
    catetory: string;
  };
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: CartItem[];
  updatedAt: Date;
}

const cartItemSchema = new Schema<CartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    productSnapshot: {
      id: Number,
      name: String,
      img: String,
      price: Number,
      old_price: Number,
      catetory: String,
    },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
