export type NavItem = {
  label: string;
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
};

export type CategoryNavItem = {
  label: string;
  path: string;
  description: string;
  productCategories: string[];
  featuredOnly?: boolean;
};

export type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Top 5 Smartphones for 2024",
    excerpt:
      "Discover the best mobile devices with cutting-edge cameras and battery life.",
    date: "March 15, 2024",
    image: "/img/banner_home1.png",
    category: "Mobiles",
  },
  {
    id: 2,
    title: "Optimizing Your Home Office Setup",
    excerpt:
      "Learn how to choose the right monitor and desk for maximum productivity.",
    date: "March 12, 2024",
    image: "/img/banner_home2.png",
    category: "Engineering",
  },
  {
    id: 3,
    title: "Smart Appliances: Are They Worth It?",
    excerpt:
      "We review the latest smart washing machines and kitchen tech for your home.",
    date: "March 10, 2024",
    image: "/img/banner_home3.png",
    category: "Appliances",
  },
];

export const siteCategories = [
  "All categories",
  "Engineering",
  "Electronic & digital",
  "Phones & tablets",
  "Fashion & clothes",
  "Televisions & monitor",
  "Jewelry & watches",
  "Washing & machine",
  "Toys & hobbies",
];

export const catalogCategoryLinks: CategoryNavItem[] = [
  {
    label: "All categories",
    path: "/collections/all-categories",
    description:
      "Browse the full catalog across electronics, mobiles, appliances, and future categories.",
    productCategories: [
      "electronics",
      "mobiles",
      "appliances",
      "fashion",
      "jewelry",
      "toys",
    ],
  },
  {
    label: "Engineering",
    path: "/collections/engineering",
    description:
      "Technical devices, performance-focused hardware, and work-ready electronics.",
    productCategories: ["electronics"],
  },
  {
    label: "Electronic & digital",
    path: "/collections/electronics",
    description:
      "Monitors, TVs, projectors, cameras, and essential digital gear.",
    productCategories: ["electronics"],
  },
  {
    label: "Phones & tablets",
    path: "/collections/phones-tablets",
    description:
      "Smartphones and portable devices with strong daily performance.",
    productCategories: ["mobiles"],
  },
  {
    label: "Fashion & clothes",
    path: "/collections/fashion-clothes",
    description:
      "This collection page is ready for apparel inventory when added.",
    productCategories: ["fashion"],
  },
  {
    label: "Televisions & monitor",
    path: "/collections/televisions-monitor",
    description:
      "Displays and home entertainment screens curated for larger setups.",
    productCategories: ["electronics"],
  },
  {
    label: "Jewelry & watches",
    path: "/collections/jewelry-watches",
    description:
      "This collection page is ready for accessories and watch inventory.",
    productCategories: ["jewelry"],
  },
  {
    label: "Washing & machine",
    path: "/collections/washing-machine",
    description:
      "Home appliances, washers, kitchen machines, and practical household equipment.",
    productCategories: ["appliances"],
  },
  {
    label: "Toys & hobbies",
    path: "/collections/toys-hobbies",
    description:
      "This collection page is ready for hobby and toy catalog expansion.",
    productCategories: ["toys"],
  },
];

export const headerCategoryLinks: CategoryNavItem[] = [
  {
    label: "Top 10 offers",
    path: "/collections/top-offers",
    description: "Discounted picks and featured deals ready for checkout.",
    productCategories: ["electronics", "mobiles", "appliances"],
    featuredOnly: true,
  },
  ...catalogCategoryLinks,
];

export const navLinks: NavItem[] = [
  {
    label: "Home",
    path: "/",
    eyebrow: "Storefront",
    title: "Modern shopping with fast discovery",
    description:
      "Browse featured campaigns, top products, and a responsive storefront built for conversion.",
    highlights: [
      "Hero-led merchandising",
      "Responsive catalog browsing",
      "Direct add-to-cart actions",
    ],
  },
  {
    label: "About",
    path: "/about",
    eyebrow: "About the brand",
    title: "A storefront focused on clarity, speed, and product confidence",
    description:
      "The brand page explains how the shop curates electronics, mobile devices, and home appliances with a simpler buying flow.",
    highlights: [
      "Curated product sourcing",
      "Pragmatic after-sales support",
      "Design-led digital shopping",
    ],
  },
  {
    label: "Accessories",
    path: "/accessories",
    eyebrow: "Accessories",
    title: "Small essentials that improve the full setup",
    description:
      "This page highlights complementary gear and gives the navigation a real destination instead of routing everything back home.",
    highlights: [
      "Cross-sell ready layout",
      "Accessory-led merchandising",
      "Expandable category framework",
    ],
  },
  {
    label: "Blog",
    path: "/blog",
    eyebrow: "Editorial",
    title: "Stories, buying tips, and product guidance for shoppers",
    description:
      "Use the blog route for launch notes, category explainers, and richer content that supports product discovery.",
    highlights: [
      "Guides and comparison content",
      "SEO-friendly page structure",
      "Editorial cards ready for CMS data",
    ],
  },
  {
    label: "Contact",
    path: "/contact",
    eyebrow: "Support",
    title: "A clear contact destination for sales and support requests",
    description:
      "The contact page gives the navbar a working endpoint and a structured place for customer communication details.",
    highlights: [
      "Support routing",
      "Sales inquiry details",
      "Next step for form integration",
    ],
  },
];

export const navPageByPath = Object.fromEntries(
  navLinks.map((item) => [item.path, item]),
) as Record<string, NavItem>;

export const categoryPageByPath = Object.fromEntries(
  headerCategoryLinks.map((item) => [item.path, item]),
) as Record<string, CategoryNavItem>;

const searchCategoryMap: Record<string, string[]> = Object.fromEntries(
  catalogCategoryLinks.map((item) => [item.label, item.productCategories]),
);

export function getMappedProductCategories(searchCategory: string) {
  return searchCategoryMap[searchCategory] ?? [];
}

export function getCategoryRouteByLabel(searchCategory: string) {
  return (
    catalogCategoryLinks.find((item) => item.label === searchCategory)?.path ??
    null
  );
}

export const heroSlides = ["/img/banner_home1.png", "/img/banner_home2.png"];

export const featureBanners = [
  "/img/banner3_1.png",
  "/img/banner3_2.png",
  "/img/banner3_3.png",
  "/img/banner3_4.png",
];

export const secondaryBanners = [
  "/img/banner_box4.jpg",
  "/img/banner_box5.jpg",
];
