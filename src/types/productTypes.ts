// types/productTypes.ts
interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductInfo {
  id: number; // Додано, якщо потрібно
  name: string;
  key: string;
  categories: Category[];
  regular_price: "";
  sale_price: "";
  images: { src: string; alt: string }[];
  meta_data: {
    key: string;
    value: string; // Значення може бути як строкою, так і масивом
  }[];
}
