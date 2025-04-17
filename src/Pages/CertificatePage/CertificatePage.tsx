import { useSelector } from "react-redux";
import { Layout } from "../../components/Layout/Layout";
import s from "./CertificatePage.module.css";
import { RootState } from "../../store";
import { ProductItem } from "../../components/ProductItem/ProductItem";
import { Breadcrumbs } from "@mui/material";
import { Link } from "react-router";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useEffect } from "react";
import { fetchCertificates } from "../../store/slices/filterSlice";

export const CertificatePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCertificates());
  }, [dispatch]);

  const { certificates } = useSelector((state: RootState) => state.filters);

  console.log(certificates);

  const breadcrumbs = [
    { name: "Головна", link: "/" },
    { name: "Подарункові сертифікати", link: "/podarunkovi-sertyfikaty-20" },
  ];

  return (
    <main className={s.page}>
      <Layout>
        <Breadcrumbs aria-label="breadcrumb" className="breadcrumbs">
          {breadcrumbs.map((breadcrumb, index) => (
            <Link key={index} to={breadcrumb.link}>
              {breadcrumb.name}
            </Link>
          ))}
        </Breadcrumbs>
      </Layout>
      <Layout>
        <div className={s.hero}>
          <img src="/images/certificate-hero.avif" alt="" />
        </div>

        <div className={s.certificates}>
          <h2>
            <span>Подарункові</span>
            <span>сертифікати</span>
          </h2>

          <ul className={s.list}>
            {certificates.map((item) => (
              <ProductItem withoutRating={true} info={item} />
            ))}
          </ul>
        </div>
      </Layout>
    </main>
  );
};
