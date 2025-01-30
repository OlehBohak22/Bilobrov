import { Layout } from "../Layout/Layout";
import s from "./PhilosophySection.module.css";

export const PhilosophySection = () => {
  return (
    <section className={s.section}>
      <Layout className={s.container}>
        <div className={s.imageContainer}>
          <img src="/images/viktoria-in-about.avif" alt="Viktoria" />
        </div>

        <div className={s.blockDesc}>
          <span>Суть бренду Bilobrov через очі засновниці</span>
          <h3>Bilobrov Cosmetics — </h3>
          <p>
            це моя філософія краси, де кожен продукт — це крок до впевненості та
            комфорту.
          </p>
          <div className={s.viktoria}>
            <span>Вікторія</span>
            <span>Білобров</span>
          </div>
        </div>
      </Layout>
    </section>
  );
};
