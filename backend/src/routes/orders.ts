import { Router, Response } from "express";
import { Order } from "../models/Order";
import { Cart } from "../models/Cart";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

// POST /api/orders  — place order from current cart
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ success: false, message: "Your cart is empty." });
      return;
    }

    const items = cart.items.map((item) => ({
      productId: item.productSnapshot.id,
      name: item.productSnapshot.name,
      img: item.productSnapshot.img,
      price: item.productSnapshot.price,
      quantity: item.quantity,
    }));

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.userId,
      items,
      total,
      status: "confirmed",
    });

    // Clear cart after placing order
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// GET /api/orders  — current user's order history
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, orders });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// GET /api/orders/:orderId  — single order detail
router.get("/:orderId", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.userId,
    }).lean();

    if (!order) {
      res.status(404).json({ success: false, message: "Order not found." });
      return;
    }

    res.json({ success: true, order });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

export default router;
