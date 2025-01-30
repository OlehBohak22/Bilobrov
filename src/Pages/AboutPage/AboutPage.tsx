// import s from "./AboutPage.module.css";

import { AboutHeroSection } from "../../components/AboutHeroSection/AboutHeroSection";
import { BilobrovTodaySection } from "../../components/BilobrovTodaySection/BilobrovTodaySection";
import { OurTeamSection } from "../../components/OurTeamSection/OurTeamSection";
import { PhilosophySection } from "../../components/PhilosophySection/PhilosophySection";
import { ValuablesSection } from "../../components/ValuablesSection/ValuablesSection";

export const AboutPage = () => {
  return (
    <main>
      <AboutHeroSection />
      <BilobrovTodaySection />
      <PhilosophySection />
      <OurTeamSection />
      <ValuablesSection />
    </main>
  );
};
