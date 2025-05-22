import React, { useState } from "react";
import styles from "./ProductDescription.module.css";
import { Layout } from "../Layout/Layout";

interface ProductDescriptionProps {
  shortLength?: number;
  content: string;
}

export const ProductDescription: React.FC<ProductDescriptionProps> = ({
  shortLength = 410,
  content,
}) => {
  const [expanded, setExpanded] = useState(false);

  console.log(content);

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  const displayText = expanded
    ? content
    : `${content.slice(0, shortLength)}...`;

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
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </Layout>
    </section>
  );
};
