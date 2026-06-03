import { Router, Response } from "express";
import { Wishlist } from "../models/Wishlist";
import { Product } from "../models/Product";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();
router.use(requireAuth);

// GET /api/wishlist
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.userId })
      .populate("products")
      .lean();

    res.json({
      success: true,
      items: wishlist?.products ?? [],
      count: wishlist?.products.length ?? 0,
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// POST /api/wishlist/:productId  — toggle (add if absent, remove if present)
router.post("/:productId", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const productId = parseInt(req.params.productId, 10);

    const product = await Product.findOne({ id: productId });
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
      return;
    }

    let wishlist = await Wishlist.findOne({ user: req.userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.userId,
        products: [product._id],
      });
      await wishlist.populate("products");
      res.json({ success: true, saved: true, items: wishlist.products });
      return;
    }

    const alreadySaved = wishlist.products.some(
      (id) => id.toString() === product._id.toString()
    );

    if (alreadySaved) {
      wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== product._id.toString()
      );
    } else {
      wishlist.products.push(product._id);
    }

    await wishlist.save();
    await wishlist.populate("products");

    res.json({ success: true, saved: !alreadySaved, items: wishlist.products });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// DELETE /api/wishlist  — clear all saved items
router.delete("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Wishlist.findOneAndUpdate({ user: req.userId }, { products: [] });
    res.json({ success: true, items: [], count: 0 });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

export default router;
