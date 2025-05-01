import { Layout } from "../Layout/Layout";
import s from "./BilobrovTodaySection.module.css";

export const BilobrovTodaySection = () => {
  return (
    <section>
      <Layout className={s.container}>
        <div>
          <p>Bilobrov cosmetics</p>
          <span>сьогодні</span>
        </div>

        <ul>
          <li>
            <span>326</span>
            <p>брендів</p>
          </li>
          <li>
            <span>9 років</span>
            <p>досвіду</p>
          </li>
          <li>
            <span>45</span>
            <p>людей в команді</p>
          </li>
          <li>
            <span>3500</span>
            <p>у базі клієнтів</p>
          </li>
        </ul>
      </Layout>
    </section>
  );
};
