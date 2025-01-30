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
  short_description?: string;
  categories: Category[];
  price: string;
  featured: boolean;
  regular_price: "";
  average_rating: string;
  rating_count: string;
  total_sales: number;
  sale_price: "";
  date_created: string;
  images: { src: string; alt: string }[];
  meta_data: {
    key: string;
    value: string; // Значення може бути як строкою, так і масивом
  }[];
}
