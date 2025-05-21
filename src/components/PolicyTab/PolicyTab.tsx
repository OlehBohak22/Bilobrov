import { useEffect, useState } from "react";
import s from "../OffertTab/OffertTab.module.css";
import { Loader } from "../Loader/Loader";
import { useTranslation } from "react-i18next";
import { API_URL_WP_V2 } from "../../constants/api";
import { motion } from "framer-motion";

interface OfferItem {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
}

export const PolicyTab = () => {
  const [content, setContent] = useState<OfferItem[] | null>();

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`${API_URL_WP_V2}privacy_policy`);
        const data = await res.json();

        console.log(data);
        setContent(data);
      } catch (err) {
        console.error(
          "Помилка при завантаженні політики кофіденційності :",
          err
        );
      }
    };

    fetchPage();
  }, []);

  const { t } = useTranslation();

  return (
    <div className={s.tab}>
      <h2>
        <span>{t("policyTab.title1")}</span>
        <span>{t("policyTab.title2")}</span>
      </h2>

      {content ? (
        <ul className={s.faqList}>
          {content.map((faq, index) => (
            <li
              onClick={() => toggleAccordion(index)}
              key={faq.id}
              className={s.accordionItem}
            >
              <h3 className={s.accordionTitle}>
                {`${++index}. ${faq.title.rendered}`}

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
                <p
                  dangerouslySetInnerHTML={{ __html: faq.content.rendered }}
                  className={s.accordionContent}
                ></p>
              </motion.div>
            </li>
          ))}
        </ul>
      ) : (
        <Loader />
      )}
    </div>
  );
};
