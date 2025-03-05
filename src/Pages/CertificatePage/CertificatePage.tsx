import { Layout } from "../../components/Layout/Layout";
import s from "./CertificatePage.module.css";

export const CertificatePage = () => {
  return (
    <main className={s.page}>
      <Layout>
        <div className={s.hero}>
          <img src="/images/certificate-hero.avif" alt="" />
        </div>
      </Layout>
    </main>
  );
};
