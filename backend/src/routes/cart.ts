import { Router, Response } from "express";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

// GET /api/cart
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).lean();

    if (!cart) {
      res.json({ success: true, items: [], count: 0, total: 0 });
      return;
    }

    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.items.reduce(
      (sum, item) => sum + item.productSnapshot.price * item.quantity,
      0
    );

    res.json({ success: true, items: cart.items, count, total });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// POST /api/cart  — add item (or increase qty if already in cart)
// Body: { productId: number, quantity?: number }
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, quantity = 1 } = req.body as {
      productId: number;
      quantity?: number;
    };

    if (!productId) {
      res.status(400).json({ success: false, message: "productId is required." });
      return;
    }

    const product = await Product.findOne({ id: productId }).lean();
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
      return;
    }

    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        items: [
          {
            product: product._id,
            productSnapshot: {
              id: product.id,
              name: product.name,
              img: product.img,
              price: product.price,
              old_price: product.old_price,
              catetory: product.catetory,
            },
            quantity,
          },
        ],
      });
    } else {
      const existing = cart.items.find(
        (item) => item.productSnapshot.id === productId
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({
          product: product._id,
          productSnapshot: {
            id: product.id,
            name: product.name,
            img: product.img,
            price: product.price,
            old_price: product.old_price,
            catetory: product.catetory,
          },
          quantity,
        });
      }

      await cart.save();
    }

    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.items.reduce(
      (sum, item) => sum + item.productSnapshot.price * item.quantity,
      0
    );

    res.json({ success: true, items: cart.items, count, total });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// PATCH /api/cart/:productId  — set exact quantity (0 = remove)
router.patch("/:productId", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const { quantity } = req.body as { quantity: number };

    if (typeof quantity !== "number" || quantity < 0) {
      res.status(400).json({ success: false, message: "quantity must be a non-negative number." });
      return;
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      res.status(404).json({ success: false, message: "Cart not found." });
      return;
    }

    if (quantity === 0) {
      cart.items = cart.items.filter((item) => item.productSnapshot.id !== productId);
    } else {
      const item = cart.items.find((i) => i.productSnapshot.id === productId);
      if (!item) {
        res.status(404).json({ success: false, message: "Item not in cart." });
        return;
      }
      item.quantity = quantity;
    }

    await cart.save();

    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.items.reduce(
      (sum, item) => sum + item.productSnapshot.price * item.quantity,
      0
    );

    res.json({ success: true, items: cart.items, count, total });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// DELETE /api/cart/:productId  — remove single item
router.delete("/:productId", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId, 10);

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      res.status(404).json({ success: false, message: "Cart not found." });
      return;
    }

    cart.items = cart.items.filter((item) => item.productSnapshot.id !== productId);
    await cart.save();

    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.items.reduce(
      (sum, item) => sum + item.productSnapshot.price * item.quantity,
      0
    );

    res.json({ success: true, items: cart.items, count, total });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// DELETE /api/cart  — clear entire cart
router.delete("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Cart.findOneAndUpdate({ user: req.userId }, { items: [] });
    res.json({ success: true, items: [], count: 0, total: 0 });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

export default router;
