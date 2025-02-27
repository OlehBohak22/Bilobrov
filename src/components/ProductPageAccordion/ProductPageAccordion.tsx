import Accordion from "@mui/material/Accordion";
import { styled } from "@mui/material/styles";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FC } from "react";
import s from "./ProductPageAccordion.module.css";

const CustomAccordion = styled(Accordion)(() => ({
  backgroundColor: "white",
  borderRadius: "0",
  padding: "0",
  boxShadow: "none",
  "&:before": {
    display: "none",
  },
  "& .MuiAccordionSummary-root": {
    backgroundColor: "white",
    borderTop: "1px solid #1A1A1A0D",
    color: "black",
    fontWeight: "bold",
    borderRadius: "0",
    minHeight: "3.8vw",
    padding: "0",

    "&:hover": {
      backgroundColor: "transparrent",
    },
  },
  "& .MuiAccordionDetails-root": {
    backgroundColor: "transparrent",
    padding: "0",
    borderRadius: "8px",
    paddingBottom: "0.5vw",
  },
}));

interface CharacteristicsType {
  appointment: string[];
  skinType: string[];
  contraindication: string[];
}

interface ProductAccordionPropType {
  desc: string;
  components: string;
  ingredients: string[];
  characteristics: CharacteristicsType;
}

export const ProductPageAccordion: FC<ProductAccordionPropType> = ({
  desc,
  components,
  characteristics,
  ingredients,
}) => {
  const formattedDesc = desc
    .replace(/- /g, "<br />- ")
    .replace(/\n/g, "<br />");

  return (
    <div className={s.acardion}>
      <CustomAccordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Опис товару
        </AccordionSummary>
        <AccordionDetails>
          <div
            className={s.desc}
            dangerouslySetInnerHTML={{ __html: formattedDesc }}
          />
        </AccordionDetails>
      </CustomAccordion>

      <CustomAccordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          ХАРАКТЕРИСТИКИ
        </AccordionSummary>
        <AccordionDetails>
          <div className={s.characteristics}>
            <p>
              Призначення:
              {characteristics.appointment.length > 0
                ? characteristics.appointment.map((item, index) => (
                    <span key={index}> {item},</span>
                  ))
                : "-"}
            </p>
            <p>
              Тип шкіри:
              {characteristics.skinType.length > 0
                ? characteristics.skinType.map((item, index) => (
                    <span key={index}> {item},</span>
                  ))
                : "-"}
            </p>
            <p>
              Протипоказання:
              {characteristics.contraindication.length > 0
                ? characteristics.contraindication.map((item, index) => (
                    <span key={index}> {item},</span>
                  ))
                : "-"}
            </p>
          </div>
        </AccordionDetails>
      </CustomAccordion>

      <CustomAccordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          Активні інгрідієнти
        </AccordionSummary>

        <AccordionDetails>
          <ul className={s.ingredientsList}>
            {ingredients.length > 0
              ? ingredients.map((item, index) => <li key={index}> {item},</li>)
              : "-"}
          </ul>
        </AccordionDetails>
      </CustomAccordion>

      <CustomAccordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5-content"
          id="panel5-header"
        >
          Склад товару
        </AccordionSummary>
        <AccordionDetails>
          <div className={s.components}>{components}</div>
        </AccordionDetails>
      </CustomAccordion>
    </div>
  );
};
