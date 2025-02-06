import { BonusFaq } from "../../components/BonusFaq/BonusFaq";
import { BonusPageHero } from "../../components/BonusPageHero/BonusPageHero";
import { BonusSection } from "../../components/BonusSection/BonusSection";
import { BonusSystem } from "../../components/BonusSystem/BonusSystem";
// import s from "./BonusPage.module.css";

export const BonusPage = () => {
  return (
    <main>
      <BonusPageHero />
      <BonusSection />
      <BonusSystem />
      <BonusFaq />
    </main>
  );
};
