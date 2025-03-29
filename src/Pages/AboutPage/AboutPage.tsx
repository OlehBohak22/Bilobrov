import { Breadcrumbs } from "@mui/material";
import { AboutHeroSection } from "../../components/AboutHeroSection/AboutHeroSection";
import { BilobrovTodaySection } from "../../components/BilobrovTodaySection/BilobrovTodaySection";
import { Layout } from "../../components/Layout/Layout";
import { OurTeamSection } from "../../components/OurTeamSection/OurTeamSection";
import { PhilosophySection } from "../../components/PhilosophySection/PhilosophySection";
import { ValuablesSection } from "../../components/ValuablesSection/ValuablesSection";
import s from "./AboutPage.module.css";
import { Link } from "react-router";

export const AboutPage = () => {
  const breadcrumbs = [
    { name: "Головна", link: "/" },
    { name: "Про нас", link: "/about" },
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
      <AboutHeroSection />
      <BilobrovTodaySection />
      <PhilosophySection />
      <OurTeamSection />
      <ValuablesSection />
    </main>
  );
};
