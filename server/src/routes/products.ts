import { Router, Request, Response } from "express";
import { Product } from "../models/Product";

const router = Router();

// GET /api/products
// Query: ?category=electronics&search=samsung&page=1&limit=20&featured=true
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      category,
      search,
      featured,
      page = "1",
      limit = "20",
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};

    if (category && category !== "all") {
      filter.catetory = { $in: category.split(",").map((c) => c.trim().toLowerCase()) };
    }

    if (featured === "true") {
      filter.featured = true;
    }

    if (search?.trim()) {
      filter.$text = { $search: search.trim() };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// GET /api/products/deals — products with old_price (on sale)
router.get("/deals", async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ old_price: { $exists: true, $ne: null } })
      .limit(20)
      .lean();
    res.json({ success: true, products });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// GET /api/products/:id
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id, 10) }).lean();
    if (!product) {
      res.status(404).json({ success: false, message: "Product not found." });
      return;
    }
    res.json({ success: true, product });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

export default router;
