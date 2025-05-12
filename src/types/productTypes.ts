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
  brands: { name: string }[];
  short_description?: string;
  categories: Category[];
  variations: number[];
  attributes: {
    name: string;
    options: string[];
    slug: string;
    option: string;
  }[];
  price: string;
  featured: boolean;
  regular_price: string;
  average_rating: string;
  rating_count: string;
  total_sales: number;
  sale_price: string;
  date_created: string;
  images: { src: string; alt: string; id: number }[];
  image: { src: string; alt: string; id: number };
  purchasable: boolean;
  meta_data: {
    key: string;
    value: string | string[];
  }[];
}
