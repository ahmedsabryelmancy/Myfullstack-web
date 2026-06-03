import { getMappedProductCategories } from "../../data/site";
import { Product } from "../../types/product";

export function normalizeProductSearchText(value: string) {
  return value.trim().toLowerCase();
}

export function filterProductsBySearch(
  products: Product[],
  query: string,
  category: string
) {
  const normalizedQuery = normalizeProductSearchText(query);
  const mappedCategories = getMappedProductCategories(category);

  return products.filter((product) => {
    const matchesQuery = normalizedQuery
      ? normalizeProductSearchText(product.name).includes(normalizedQuery)
      : true;

    const matchesCategory =
      category === "All categories" ? true : mappedCategories.includes(product.catetory);

    return matchesQuery && matchesCategory;
  });
}