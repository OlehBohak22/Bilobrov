import { Layout } from "../Layout/Layout";
import s from "./BonusPageHero.module.css";

export const BonusPageHero = () => {
  return (
    <section className={s.section}>
      <Layout>
        <div>
          <h1>Bilobrov club</h1>
          <p>
            Вигідні покупки, кешбек і подарунки з віртуальною карткою лояльності
          </p>
        </div>
      </Layout>
    </section>
  );
};
