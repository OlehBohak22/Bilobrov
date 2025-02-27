// types/productTypes.ts
interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductInfo {
  id: number;
  sku: string;
  name: string;
  key: string;
  description: string;
  short_description?: string;
  categories: Category[];
  variations: number[];
  attributes: { name: string; options: string[] }[]; // Додано правильний тип для options
  price: string;
  featured: boolean;
  regular_price: string;
  average_rating: string;
  rating_count: string;
  total_sales: number;
  sale_price: string;
  date_created: string;
  images: { src: string; alt: string }[]; // Масив зображень
  image: { src: string; alt: string }; // Окреме зображення, яке приходить в payload
  purchasable: boolean;
  meta_data: {
    key: string;
    value: string | string[]; // Враховано можливість масиву
  }[];
}
