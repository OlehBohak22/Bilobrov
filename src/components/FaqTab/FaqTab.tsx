import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchFaqs } from "../../store/slices/faqSlice";
import { motion } from "framer-motion";
import s from "./FaqTab.module.css";

export const FaqTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { faqs } = useSelector((state: RootState) => state.faq);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchFaqs());
  }, [dispatch]);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={s.tab}>
      <h2>
        <span>Часті</span>
        <span>питання</span>
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
    </div>
  );
};
