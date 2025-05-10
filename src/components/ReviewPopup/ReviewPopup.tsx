import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Field, Form } from "formik";
import { RootState } from "../../store";
import { FaStar } from "react-icons/fa";
import s from "./ReviewPopup.module.css";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addReview } from "../../store/slices/productsSlice";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface ReviewFormValues {
  product_id: number;
  name: string;
  email: string;
  review: string;
  isAuthenticated: boolean;
  rating: number;
  review_images: File[];
}

interface ImageUploadProps {
  setFieldValue: (field: string, value: any) => void;
  values: ReviewFormValues;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setFieldValue, values }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setFieldValue("review_images", [...values.review_images, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setFieldValue(
      "review_images",
      values.review_images.filter((_, i) => i !== index)
    );
  };

  const { t } = useTranslation();

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        multiple
        onChange={handleFileChange}
        className={s.dn}
      />
      <div className="flex gap-2 mb-4">
        {values.review_images.map((file, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt="uploaded"
              className={s.reviewImage}
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <label htmlFor="file-upload" className={s.customFileUpload}>
        {t("reviewPopup.attachPhoto")}
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.61646 18.2916C4.66862 18.2919 3.74199 18.011 2.95384 17.4845C2.16568 16.958 1.55141 16.2095 1.18875 15.3338C0.826101 14.4581 0.731362 13.4945 0.916525 12.5649C1.10169 11.6353 1.55843 10.7815 2.22896 10.1116L9.29979 3.03996C9.41704 2.92271 9.57606 2.85684 9.74188 2.85684C9.90769 2.85684 10.0667 2.92271 10.184 3.03996C10.3012 3.1572 10.3671 3.31623 10.3671 3.48204C10.3671 3.64785 10.3012 3.80688 10.184 3.92412L3.11229 10.995C2.76993 11.3208 2.49624 11.7118 2.30735 12.145C2.11845 12.5782 2.01817 13.0449 2.01242 13.5174C2.00666 13.99 2.09554 14.4589 2.27383 14.8966C2.45212 15.3343 2.7162 15.7319 3.05053 16.0659C3.38485 16.4 3.78265 16.6637 4.22048 16.8417C4.65832 17.0196 5.12734 17.1081 5.5999 17.1019C6.07247 17.0958 6.53903 16.9951 6.97209 16.8059C7.40514 16.6166 7.79594 16.3426 8.12146 16L17.2548 6.86662C17.6733 6.43443 17.9052 5.85503 17.9004 5.25341C17.8955 4.6518 17.6544 4.07619 17.229 3.65078C16.8036 3.22536 16.228 2.98422 15.6263 2.97939C15.0247 2.97456 14.4453 3.20642 14.0131 3.62496L6.64813 10.995C6.55139 11.0917 6.47465 11.2065 6.42229 11.3329C6.36994 11.4593 6.34299 11.5948 6.34299 11.7316C6.34299 11.8684 6.36994 12.0039 6.42229 12.1303C6.47465 12.2567 6.55139 12.3716 6.64813 12.4683C6.74487 12.565 6.85971 12.6418 6.98611 12.6941C7.11251 12.7465 7.24798 12.7734 7.38479 12.7734C7.52161 12.7734 7.65708 12.7465 7.78347 12.6941C7.90987 12.6418 8.02472 12.565 8.12146 12.4683L12.834 7.75496C12.8916 7.69524 12.9605 7.64759 13.0368 7.6148C13.113 7.58201 13.195 7.56473 13.278 7.56397C13.361 7.56321 13.4433 7.57898 13.5201 7.61037C13.5969 7.64176 13.6667 7.68814 13.7254 7.74679C13.7842 7.80545 13.8306 7.87521 13.8621 7.952C13.8935 8.0288 13.9094 8.11109 13.9087 8.19408C13.908 8.27706 13.8908 8.35908 13.8581 8.43535C13.8254 8.51162 13.7778 8.58061 13.7181 8.63829L9.00479 13.3525C8.792 13.5653 8.53936 13.7342 8.26131 13.8494C7.98326 13.9646 7.68523 14.0239 7.38425 14.024C7.08328 14.024 6.78524 13.9647 6.50716 13.8496C6.22907 13.7345 5.97639 13.5657 5.76354 13.3529C5.55069 13.1401 5.38184 12.8874 5.26662 12.6094C5.15141 12.3313 5.09209 12.0333 5.09205 11.7323C5.09197 11.1245 5.33337 10.5415 5.76313 10.1116L13.1298 2.74996C13.7939 2.0857 14.6948 1.71248 15.6341 1.7124C16.5734 1.71232 17.4743 2.08539 18.1385 2.74954C18.8028 3.41369 19.176 4.31451 19.1761 5.25383C19.1762 6.19315 18.8031 7.09403 18.139 7.75829L9.00563 16.8883C8.56152 17.3346 8.03332 17.6885 7.45157 17.9293C6.86983 18.1702 6.2461 18.2934 5.61646 18.2916Z"
            fill="#D63D44"
          />
        </svg>
      </label>
    </div>
  );
};

interface StarRatingProps {
  setFieldValue: (field: string, value: any) => void;
  values: ReviewFormValues;
}

const StarRating: React.FC<StarRatingProps> = ({ setFieldValue, values }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className="cursor-pointer"
          style={{
            color: values.rating >= star ? "#D63D44" : "#D1D5DB", // "#D1D5DB" — це приблизно Tailwind text-gray-300
          }}
          onClick={() => setFieldValue("rating", star)}
        />
      ))}
    </div>
  );
};

interface CartPopupProps {
  onClose: () => void;
  product_id: number;
}

const ReviewPopup: React.FC<CartPopupProps> = ({ onClose, product_id }) => {
  const user = useSelector((state: RootState) => state.user.token);
  const dispatch = useAppDispatch();
  const [isSubmitted, setIsSubmitted] = useState(false); // Стан для показу подяки
  const [error, setError] = useState<string | null>(null); // Стан для зберігання помилки
  const maxLength = 150;
  const [charCount, setCharCount] = useState(0);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const { value } = e.target;
    setCharCount(value.length);
    setFieldValue("review", value);
  };

  const initialValues: ReviewFormValues = {
    product_id,
    name: "",
    email: "",
    review: "",
    isAuthenticated: !!user,
    rating: 0,
    review_images: [],
  };

  const handleSubmit = async (values: ReviewFormValues) => {
    if (!values.review || values.review.trim().length < 3) {
      setError("Відгук не може бути порожнім або занадто коротким");
      return;
    }

    const formData = new FormData();

    formData.append("product_id", String(values.product_id));
    formData.append("review", values.review);
    formData.append("rating", String(values.rating));

    values.review_images.forEach((file) => {
      formData.append("review_images[]", file);
    });

    let headers: { [key: string]: string } = {};

    if (user) {
      headers = {
        Authorization: `Bearer ${user}`,
      };
    } else {
      formData.append("name", values.name);
      formData.append("email", values.email);

      if (!values.name || !values.email) {
        setError("Не вказано ім'я або email");
        return;
      }
    }

    try {
      await dispatch(addReview({ formData, headers }));
      setIsSubmitted(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Щось пішло не так");
    }
  };

  const { t } = useTranslation();

  return (
    <div className={s.popupOverlay} onClick={onClose}>
      <motion.div
        initial={{ transform: "scale(0)" }}
        animate={{ transform: "scale(1)" }}
        exit={{ transform: "scale(0)" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={s.popupContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={s.popupHeader}>
          <h2 className={s.popupTitle}>
            {isSubmitted ? "" : t("reviewPopup.title")}
          </h2>
          <button className={s.closeButton} onClick={onClose}>
            <svg
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M39 13L13 39M13 13L39 39"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {!isSubmitted ? (
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ setFieldValue, values }) => (
              <Form className={s.form}>
                {!initialValues.isAuthenticated && (
                  <>
                    <div className="lg:mb-[0.7vw] mb-[3.4vw]">
                      <label htmlFor="name">
                        {t("reviewPopup.name")}
                        <span>*</span>
                      </label>
                      <Field
                        id="name"
                        name="name"
                        placeholder={t("reviewPopup.namePlaceholder")}
                      />
                    </div>

                    <div className="lg:mb-[2vw] mb-[6.4vw]">
                      <label htmlFor="email">
                        {t("reviewPopup.phone")}
                        <span>*</span>
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t("reviewPopup.phonePlaceholder")}
                      />
                    </div>
                  </>
                )}

                <div className="mb-[1vw]">
                  <label htmlFor="review">{t("reviewPopup.reviewLabel")}</label>
                  <Field
                    as="textarea"
                    id="review"
                    name="review"
                    placeholder={t("reviewPopup.reviewPlaceholder")}
                    onChange={(e: any) => handleChange(e, setFieldValue)}
                    value={values.review}
                  />
                  <div className={s.length}>
                    {charCount}/{maxLength}
                  </div>
                </div>

                <div className={s.reviewAttributes}>
                  <div>
                    <ImageUpload
                      setFieldValue={setFieldValue}
                      values={values}
                    />
                  </div>

                  <div className={s.stars}>
                    <StarRating setFieldValue={setFieldValue} values={values} />
                  </div>
                </div>

                <div>
                  <button type="submit" className={s.submitButton}>
                    {t("reviewPopup.submit")}
                  </button>
                  {error && <div className="text-red-500">{error}</div>}{" "}
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className={s.thanksContent}>
            <svg
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="56" height="56" rx="28" fill="#D63D44" />
              <path
                d="M25 27L27 29L31.5 24.5M27.9932 21.1358C25.9938 18.7984 22.6597 18.1696 20.1547 20.31C17.6496 22.4504 17.297 26.029 19.2642 28.5604C20.7501 30.4724 24.9713 34.311 26.948 36.0749C27.3114 36.3991 27.4931 36.5613 27.7058 36.6251C27.8905 36.6805 28.0958 36.6805 28.2805 36.6251C28.4932 36.5613 28.6749 36.3991 29.0383 36.0749C31.015 34.311 35.2362 30.4724 36.7221 28.5604C38.6893 26.029 38.3797 22.4279 35.8316 20.31C33.2835 18.1922 29.9925 18.7984 27.9932 21.1358Z"
                stroke="white"
                stroke-Width="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p>{t("reviewPopup.thanks")}</p>
            <h3>{t("reviewPopup.success")}</h3>

            <Link onClick={onClose} to="/">
              {t("reviewPopup.backHome")}
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ReviewPopup;
