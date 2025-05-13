import React, { useState } from "react";
import styles from "./ProductDescription.module.css";
import { Layout } from "../Layout/Layout";

interface ProductDescriptionProps {
  shortLength?: number;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  shortLength = 410,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const text =
    "Кожна ваша покупка приносить більше, ніж просто задоволення. Накопичуйте кешбек на кожному етапі покупок з Bilobrov та використовуйте його для ще вигідніших замовлень у майбутньому. Кожна ваша покупка приносить більше, ніж просто задоволення. Накопичуйте кешбек на кожному етапі покупок з Bilobrov та використовуйте його для ще вигідніших замовлень у майбутньому.Кожна ваша покупка приносить більше, ніж просто задоволення. Накопичуйте кешбек на кожному етапі покупок з Bilobrov та використовуйте його для ще вигідніших замовлень у майбутньому.Кожна ваша покупка приносить більше, ніж просто задоволення. Накопичуйте кешбек на кожному етапі покупок з Bilobrov та використовуйте його для ще вигідніших замовлень у майбутньому. Кожна ваша покупка приносить більше, ніж просто задоволення. Накопичуйте кешбек на кожному етапі покупок з Bilobrov та використовуйте його для ще вигідніших замовлень у майбутньому.Кожна ваша покупка приносить більше, ніж просто задоволення. Накопичуйте кешбек на кожному етапі покупок з Bilobrov та використовуйте його для ще вигідніших замовлень у майбутньому.Кожна ваша покупка приносить більше, ніж просто задоволення. Накопичуйте кешбек на кожному етапі покупок з Bilobrov та використовуйте його для ще вигідніших замовлень у майбутньому. Кожна ваша покупка приносить більше, ніж просто задоволення. Накопичуйте кешбек на кожному етапі покупок з Bilobrov та використовуйте його для ще вигідніших замовлень у майбутньому.Кожна ваша покупка приносить більше, ніж просто задоволення. Накопичуйте кешбек на кожному етапі покупок з Bilobrov та використовуйте його для ще вигідніших замовлень у майбутньому.";

  const displayText = expanded ? text : `${text.slice(0, shortLength)}...`;

  return (
    <section className={styles.sectioon}>
      <Layout>
        <h2 className={styles.title}>Опис</h2>
        <p className={styles.text}>{displayText}</p>
        <button className={styles.toggleButton} onClick={toggleExpand}>
          {expanded ? "Приховати" : "Більше"}
          <svg
            style={expanded ? { transform: "rotate(-90deg)" } : {}}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.33301 9.3335L22.6663 22.6668M22.6663 22.6668V9.3335M22.6663 22.6668H9.33301"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </Layout>
    </section>
  );
};
