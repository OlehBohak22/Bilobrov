import { useState } from "react";
import s from "./ProductContent.module.css";
import { ProductInfo } from "../../types/productTypes";
import { StarRating } from "../StarRating/StarRating";

interface ProductItemProps {
  info: ProductInfo;
}

export const ProductContent: React.FC<ProductItemProps> = ({ info }) => {
  // Якщо variations пустий, встановлюємо `null`
  const [selectedVariation, setSelectedVariation] = useState<number | null>(
    info.variations.length > 0 ? Number(info.variations[0]) : null
  );

  const handleVariationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedVariation(Number(event.target.value));
  };

  const brandMeta = info.meta_data.find((item) => item.key === "brands");
  const brandName = Array.isArray(brandMeta?.value)
    ? brandMeta.value[0]?.name
    : null;

  return (
    <div className={s.content}>
      <div className={s.ratingBlock}>
        <StarRating rating={info.average_rating} />
        <span>{info.rating_count} відгуків</span>
      </div>

      {brandName && <p className={s.productBrand}>{brandName}</p>}

      <p className={s.productName}>{info.name}</p>

      {typeof info.short_description === "string" ? (
        <p
          className={s.shortDesc}
          dangerouslySetInnerHTML={{ __html: info.short_description }}
        />
      ) : (
        <>{info.short_description}</>
      )}

      {info.variations.length > 0 && (
        <div className={s.variationSelect}>
          <label htmlFor="variation"></label>
          <select
            id="variation"
            value={selectedVariation ?? ""}
            onChange={handleVariationChange}
          >
            {info.variations.map((variationId) => (
              <option key={variationId} value={variationId}>
                Варіант {variationId}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
