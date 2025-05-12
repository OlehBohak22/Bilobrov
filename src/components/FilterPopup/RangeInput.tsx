import styles from "./RangeInput.module.css";
import { useTranslation } from "react-i18next";

interface RangeInputProps {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (values: { min: number; max: number }) => void;
}

export const RangeInput: React.FC<RangeInputProps> = ({
  min,
  max,
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  const getPercent = (val: number) =>
    Math.round(((val - min) / (max - min)) * 100);

  const leftPercent = getPercent(value.min);
  const rightPercent = getPercent(value.max);

  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        <div className={styles.valuesContainer}>
          <div className={styles.slider__leftValue}>
            {t("catalog.from")} <span>₴ {value.min}</span>
          </div>
          <div className={styles.slider__rightValue}>
            {t("catalog.to")} <span>₴ {value.max}</span>
          </div>
        </div>
        <div className={styles.slider__track} />
        <div
          className={styles.slider__range}
          style={{
            left: `${leftPercent}%`,
            width: `${rightPercent - leftPercent}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value.min}
          onChange={(e) => {
            const newMin = Math.min(+e.target.value, value.max - 1);
            onChange({ ...value, min: newMin });
          }}
          className={`${styles.thumb} ${styles["thumb--left"]}`}
          style={{ zIndex: value.min > max - 100 ? 5 : undefined }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value.max}
          onChange={(e) => {
            const newMax = Math.max(+e.target.value, value.min + 1);
            onChange({ ...value, max: newMax });
          }}
          className={`${styles.thumb} ${styles["thumb--right"]}`}
        />
      </div>
    </div>
  );
};
