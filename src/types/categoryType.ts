export interface Category {
  id: number;
  name: string;
  yoast_head_json: { og_url: string };
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: {
    id: number;
    src: string;
    name: string;
    alt: string;
  } | null;
  menu_order: number;
  count: number;
}
