import { useSelector } from "react-redux";
import { Layout } from "../Layout/Layout";
import s from "./BonusFaq.module.css";
import { motion } from "framer-motion";
import { useState } from "react";
import { RootState } from "../../store";
import { Loader } from "../Loader/Loader";
import { useTranslation } from "react-i18next";

export const BonusFaq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { faqs, loading } = useSelector((state: RootState) => state.faq);
  const { t } = useTranslation();

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <section className={s.section}>
      <Layout>
        <h2>
          <span>{t("bonusFaq.title1")}</span>
          <span>{t("bonusFaq.title2")}</span>
        </h2>

        <ul className={s.faqList}>
          {faqs.map((faq, index) => (
            <li
              onClick={() => toggleAccordion(index)}
              key={faq.id}
              className={s.accordionItem}
            >
              <h3 className={s.accordionTitle}>
                {faq.faq_question}

                <div>
                  <motion.svg
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5V19M12 19L19 12M12 19L5 12"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </div>
              </h3>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={s.accordionContentWrapper}
              >
                <p className={s.accordionContent}>{faq.faq_answer}</p>
              </motion.div>
            </li>
          ))}
        </ul>
      </Layout>
    </section>
  );
};
