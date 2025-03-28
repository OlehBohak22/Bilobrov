// types/productTypes.ts
interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductInfo {
  id: number;
  sku: string;
  slug: string;
  on_sale: boolean;
  name: string;
  key: string;
  stock_quantity: number;
  variation_id: number;
  description: string;
  quantity: number;
  short_description?: string;
  categories: Category[];
  variations: number[];
  attributes: {
    name: string;
    options: string[];
    slug: string;
    option: string;
  }[]; // Додано правильний тип для options
  price: string;
  featured: boolean;
  regular_price: string;
  average_rating: string;
  rating_count: string;
  total_sales: number;
  sale_price: string;
  date_created: string;
  images: { src: string; alt: string; id: number }[]; // Масив зображень
  image: { src: string; alt: string; id: number }; // Окреме зображення, яке приходить в payload
  purchasable: boolean;
  meta_data: {
    key: string;
    value: string | string[]; // Враховано можливість масиву
  }[];
}
