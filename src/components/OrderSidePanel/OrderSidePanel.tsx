import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import s from "./OrderSidePanel.module.css";
import { RootState } from "../../store";
import { ProductInfo } from "../../types/productTypes";
import { CartProductItemMemo } from "../CartProductItem/CartProductItem";
import { fetchCartProducts } from "../../store/slices/productsSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { Loader } from "../Loader/Loader";
import { useTranslation } from "react-i18next";
import { API_URL_WC, consumerKey, consumerSecret } from "../../constants/api";

interface Props {
  useBonus: number;
  setUseBonus: (val: number | ((prev: number) => number)) => void;
  appliedCoupon: {
    code: string;
    discountAmount: number;
  } | null;
  setAppliedCoupon: (
    val: { code: string; discountAmount: number } | null
  ) => void;
  availableBonuses: number;
}

export const OrderSidePanel = ({
  useBonus,
  setUseBonus,
  availableBonuses,
  setAppliedCoupon,
  appliedCoupon,
}: Props) => {
  const { t } = useTranslation();
  const { items } = useSelector((state: RootState) => state.cart);
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useAppDispatch();

  const [cartProducts, setCartProducts] = useState<ProductInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const productIds = items.map((item) => item.id);
  const productIdsString = productIds.sort((a, b) => a - b).join(",");

  const [isBonusOpen, setIsBonusOpen] = useState(false);

  const [isPromoOpen, setIsPromoOpen] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const [couponValid, setCouponValid] = useState<boolean | null>(null);
  const [couponError, setCouponError] = useState("");

  const checkCoupon = async (): Promise<void> => {
    setIsCheckingCoupon(true);
    setCouponError("");
    setCouponValid(null);
    setAppliedCoupon(null);

    try {
      const response = await fetch(
        `${API_URL_WC}coupons?code=${promoCode.trim()}`,
        {
          headers: {
            Authorization: "Basic " + btoa(`${consumerKey}:${consumerSecret}`),
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !Array.isArray(data) || data.length === 0) {
        throw new Error("Купон не знайдено або недійсний");
      }

      const coupon = data[0];

      // Перевірка, чи це gift_card
      const isGiftCard = coupon.meta_data?.some(
        (meta: { key: string; value: string }) =>
          meta.key === "coupon_mode" && meta.value === "gift_card"
      );

      if (isGiftCard) {
        throw new Error(
          "Це подарунковий сертифікат. Введіть його у відповідне поле нижче."
        );
      }

      // Перевірка дати завершення
      if (coupon.date_expires) {
        const now = new Date();
        const expiryDate = new Date(coupon.date_expires);
        if (now > expiryDate) {
          throw new Error("Термін дії купону минув");
        }
      }

      const discountType = coupon.discount_type;
      const amount = parseFloat(coupon.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Невірна знижка в купоні");
      }

      // 💸 Рахуємо знижку:
      const cartTotal = cart.reduce(
        (sum, item) => sum + Number(item.price || 0) * item.quantity,
        0
      );

      let calculatedDiscount = 0;

      if (discountType === "percent") {
        calculatedDiscount = (cartTotal * amount) / 100;
      } else if (discountType === "fixed_cart") {
        calculatedDiscount = amount;
      } else {
        throw new Error("Невідомий тип купону");
      }

      console.log("✅ Купон дійсний:", {
        code: coupon.code,
        type: discountType,
        amount,
        cartTotal,
        calculatedDiscount,
      });

      setAppliedCoupon({
        code: coupon.code,
        discountAmount: calculatedDiscount,
      });
      setCouponValid(true);
    } catch (error) {
      console.error(
        "❌ Помилка при перевірці купону:",
        error instanceof Error ? error.message : "Невідома помилка"
      );
      setCouponValid(false);
      setAppliedCoupon(null);

      setCouponError(
        error instanceof Error ? error.message : "Невідома помилка"
      );
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  useEffect(() => {
    if (productIds.length) {
      setLoading(true);
      dispatch(fetchCartProducts(productIds)).then((res) => {
        if (fetchCartProducts.fulfilled.match(res)) {
          setCartProducts(res.payload);
        }
        setLoading(false);
      });
    } else {
      setCartProducts([]);
      setLoading(false);
    }
  }, [productIdsString]);

  const cart = items
    .map((cartItem) => {
      const product = cartProducts.find((p) => p.id === cartItem.id);

      if (product) {
        return {
          ...product,
          variation: cartItem.variation_id,
          quantity: cartItem.quantity,
        };
      }

      return null;
    })
    .filter(
      (item): item is ProductInfo & { variation: number; quantity: number } =>
        item !== null
    );

  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  const discount = cart.reduce((sum, item) => {
    if (item.sale_price && item.regular_price) {
      const itemDiscount =
        (Number(item.regular_price) - Number(item.sale_price)) * item.quantity;
      return sum + itemDiscount;
    }
    return sum;
  }, 0);

  const regularPrice = cart.reduce(
    (sum, item) => sum + Number(item.regular_price || 0) * item.quantity,
    0
  );

  const { user } = useSelector((state: RootState) => state.user);

  const maxBonuses = Math.min(availableBonuses, totalAmount);

  return (
    <div className={s.sidePanel}>
      <div className={s.sideHeading}>
        <p>{t("orderPanel.totalToPay")}</p>
        <span>{totalAmount}₴</span>
      </div>

      <div className={s.orderCartList}>
        <ul>
          {loading ? (
            <Loader />
          ) : cart.length ? (
            cart.map((item) => (
              <CartProductItemMemo
                optional={false}
                key={item.id}
                info={item}
                token={token || ""}
                variation={item.variation}
              />
            ))
          ) : (
            <div className={s.emptyCart}>{t("orderPanel.emptyCart")}</div>
          )}
        </ul>
      </div>

      {user && (
        <div className={s.bonusAccordion}>
          <button
            className={`${s.bonusToggle} ${isBonusOpen ? s.open : ""}`}
            onClick={() => setIsBonusOpen((prev) => !prev)}
          >
            {isBonusOpen ? (
              <>
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 7.33203H0V8.66536H16V7.33203Z"
                      fill="#D63D44"
                    />
                  </svg>
                </span>
                {t("order-panel.payWithBonuses")}
              </>
            ) : (
              <>
                <span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_1929_19716)">
                      <path
                        d="M6.411e-07 8.66667L7.33333 8.66667L7.33333 16L8.66667 16L8.66667 8.66667L16 8.66667L16 7.33333L8.66667 7.33333L8.66667 -6.411e-07L7.33333 -7.57664e-07L7.33333 7.33333L7.57664e-07 7.33333L6.411e-07 8.66667Z"
                        fill="#D63D44"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1929_19716">
                        <rect
                          width="16"
                          height="16"
                          fill="white"
                          transform="translate(16 16) rotate(-180)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </span>{" "}
                {t("order-panel.payWithBonuses")}
              </>
            )}
          </button>

          {isBonusOpen && (
            <div className={s.bonusContent}>
              <p className="flex justify-between">
                {t("order-panel.yourBonusBalance")}:{" "}
                <span className={s.bonusCount}>
                  {availableBonuses} {t("order-panel.bonuses")}
                </span>
              </p>
              <p className={s.bonusNote}>{t("order-panel.bonusRate")}</p>

              <div className={s.bonusControls}>
                <p>{t("order-panel.writeOffBonuses")}</p>
                <div className={s.qty}>
                  <button
                    onClick={() => setUseBonus((prev) => Math.max(0, prev - 1))}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16 7.33203H0V8.66536H16V7.33203Z"
                        fill="#1A1A1A"
                      />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={maxBonuses}
                    value={useBonus}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= maxBonuses) {
                        setUseBonus(val);
                      } else {
                        setUseBonus(maxBonuses);
                      }
                    }}
                  />

                  <button
                    onClick={() =>
                      setUseBonus((prev) => Math.min(maxBonuses, prev + 1))
                    }
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_4095_27906)">
                        <path
                          d="M16 7.33333H8.66667V0H7.33333V7.33333H0V8.66667H7.33333V16H8.66667V8.66667H16V7.33333Z"
                          fill="#1A1A1A"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_4095_27906">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>

                <button
                  className={s.applyAll}
                  onClick={() => setUseBonus(maxBonuses)}
                >
                  {t("order-panel.applyAll")}
                </button>

                <button
                  className={s.reset}
                  onClick={() => setUseBonus(0)}
                  disabled={useBonus === 0}
                >
                  {t("order-panel.reset")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==== PROMO CODE ==== */}
      <div className={s.promoAccordion}>
        <button
          className={`${s.promoToggle} ${isPromoOpen ? s.open : ""}`}
          onClick={() => setIsPromoOpen((prev) => !prev)}
        >
          {isPromoOpen ? (
            <>
              <span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 7.33203H0V8.66536H16V7.33203Z" fill="#D63D44" />
                </svg>
              </span>
              {t("order-panel.payWithCoupons")}
            </>
          ) : (
            <>
              <span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_1929_19716)">
                    <path
                      d="M6.411e-07 8.66667L7.33333 8.66667L7.33333 16L8.66667 16L8.66667 8.66667L16 8.66667L16 7.33333L8.66667 7.33333L8.66667 -6.411e-07L7.33333 -7.57664e-07L7.33333 7.33333L7.57664e-07 7.33333L6.411e-07 8.66667Z"
                      fill="#D63D44"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1929_19716">
                      <rect
                        width="16"
                        height="16"
                        fill="white"
                        transform="translate(16 16) rotate(-180)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              {t("order-panel.payWithCoupons")}
            </>
          )}
        </button>

        {isPromoOpen && (
          <div className={s.promoContent}>
            <input
              type="text"
              placeholder={t("coupon.enter")}
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className={s.promoInput}
            />
            <button
              onClick={checkCoupon}
              disabled={!promoCode.trim() || isCheckingCoupon}
              className={s.applyPromoBtn}
            >
              {isCheckingCoupon
                ? t("coupon.перевірка")
                : t("coupon.застосувати")}
            </button>

            {couponValid && <p className={s.success}>{t("coupon.allow")}</p>}
            {couponError && <p className={s.error}>{couponError}</p>}
          </div>
        )}
      </div>

      <div className={s.orderInfo}>
        <div>
          <div className={s.orderDetails}>
            <p>
              <span>{t("orderPanel.orderAmount")}:</span>
              <span>{regularPrice} ₴</span>
            </p>
            <p>
              <span>{t("orderPanel.discountAmount")}:</span>
              <span className={s.discount}>{discount} ₴</span>
            </p>

            {appliedCoupon && (
              <p>
                <span>
                  {t("orderPanel.couponDiscount")} ({appliedCoupon.code}):
                </span>
                <span className={s.discount}>
                  {appliedCoupon.discountAmount.toFixed(2)} ₴
                </span>
              </p>
            )}

            {useBonus > 0 && (
              <p>
                <span>{t("orderPanel.discountBonus")}:</span>

                <span className={s.discount}>{useBonus} ₴</span>
              </p>
            )}

            <p>
              <span>{t("orderPanel.deliveryCost")}:</span>

              <span>
                <svg
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="..."
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t("orderPanel.free")}
              </span>
            </p>
          </div>
          <div className={s.totalAmount}>
            <p>{t("orderPanel.total")}:</p>
            <span>
              {Math.max(
                totalAmount - useBonus - (appliedCoupon?.discountAmount || 0),
                0
              ).toFixed(2)}
              ₴
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
