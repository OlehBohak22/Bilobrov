import { Layout } from "../Layout/Layout";
import s from "./BlogSection.module.css";
import { Link } from "react-router";

const items = [
  {
    id: 1,
    category: "СТАТТІ",
    title: "Як створити ідеальний набір для зимового догляду за шкірою",
    image: "/temporarily/Mask group-1.jpg",
    link: "/articles/winter-skincare-set",
  },
  {
    id: 2,
    category: "БРЕНДИ",
    title: "Секрети сяючого макіяжу для новорічних вечірок",
    image: "/temporarily/Mask group-2.jpg",
    link: "/brands/holiday-makeup-secrets",
  },
  {
    id: 3,
    category: "ДОБІРКИ",
    title:
      "Догляд за волоссям у зимовий період: топ-продукти для живлення та зволоження",
    image: "/temporarily/Mask group.jpg",
    link: "/collections/winter-haircare",
  },
];

export const BlogSection = () => {
  return (
    <section className={s.section}>
      <Layout>
        <div className={s.titleContainer}>
          <span className={s.stub}>stuuuuuuuuuuuuuuuuuuuuub</span>
          <h2>
            <span>Наші</span>
            <span>новини</span>
          </h2>
          <Link to="/">
            <span>Перейти до категорії</span>
            <svg
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_1195_3453)">
                <path d="M17.9177 5.5L16.8487 6.55572L21.6059 11.2535H0.5V12.7465H21.6059L16.8487 17.4443L17.9177 18.5L24.5 12L17.9177 5.5Z" />
              </g>
              <defs>
                <clipPath id="clip0_1195_3453">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0.5 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
          </Link>
        </div>

        <ul className={s.blogList}>
          {items.map((item) => (
            <li key={item.id}>
              <div className={s.blogImage}>
                <img src={item.image} alt={item.title} />
              </div>

              <h3>{item.category}</h3>

              <p>{item.title}</p>
            </li>
          ))}
        </ul>
      </Layout>
    </section>
  );
};
