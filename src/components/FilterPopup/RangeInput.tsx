import { useCallback, useEffect, useState, useRef } from "react";
import styles from "./RangeInput.module.css";
import { useTranslation } from "react-i18next";

interface RangeInputProps {
  min: number;
  max: number;
  onChange: (values: { min: number; max: number }) => void;
}

export const RangeInput: React.FC<RangeInputProps> = ({
  min,
  max,
  onChange,
}) => {
  const [minVal, setMinVal] = useState<number>(min);
  const [maxVal, setMaxVal] = useState<number>(max);
  const minValRef = useRef<number>(min);
  const maxValRef = useRef<number>(max);
  const range = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();

  const getPercent = useCallback(
    (value: number): number => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div className={styles.container}>
      <div className={styles.slider}>
        <div className={styles.valuesContainer}>
          <div className={styles.slider__leftValue}>
            {t("catalog.from")} <span>₴ {minVal}</span>
          </div>
          <div className={styles.slider__rightValue}>
            {t("catalog.to")} <span>₴ {maxVal}</span>
          </div>
        </div>
        <div className={styles.slider__track} />
        <div ref={range} className={styles.slider__range} />
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={(event) => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
          }}
          className={`${styles.thumb} ${styles["thumb--left"]}`}
          style={{ zIndex: minVal > max - 100 ? 5 : undefined }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={(event) => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          className={`${styles.thumb} ${styles["thumb--right"]}`}
        />
      </div>
    </div>
  );
};
