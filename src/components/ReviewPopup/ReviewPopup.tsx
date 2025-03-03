import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { RootState } from "../../store";
import { FaStar } from "react-icons/fa"; // Не забудьте імпортувати зірки!
import s from "./ReviewPopup.module.css";

// Тип для значень форми
interface ReviewFormValues {
  name: string;
  phone: string;
  review: string;
  isAuthenticated: boolean;
  rating: number;
  images: string[];
}

// Тип для компонентів, що приймають setFieldValue та values
interface ImageUploadProps {
  setFieldValue: (field: string, value: any) => void;
  values: ReviewFormValues;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setFieldValue, values }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const newImages = files.map((file) => URL.createObjectURL(file));

    setFieldValue("images", [...values.images, ...newImages]);
  };

  const handleRemoveImage = (image: string) => {
    setFieldValue(
      "images",
      values.images.filter((img) => img !== image)
    );
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        placeholder="delete"
        id="file-upload"
        multiple
        onChange={handleFileChange}
        className={s.dn}
      />

      <div className="flex gap-[0.6vw] mb-[1vw]">
        {values.images.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img}
              alt="uploaded"
              className="w-[4.1vw] h-[4.1vw] object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(img)}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full p-1"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <label htmlFor="file-upload" className={s.customFileUpload}>
        Прикріпити фотографію
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
          className={`cursor-pointer ${
            values.rating >= star ? "text-red-600" : "text-gray-300"
          }`}
          onClick={() => setFieldValue("rating", star)}
        />
      ))}
    </div>
  );
};

interface CartPopupProps {
  onClose: () => void;
}

export const ReviewPopup: React.FC<CartPopupProps> = ({ onClose }) => {
  const user = useSelector((state: RootState) => state.user.user);

  const [charCount, setCharCount] = useState(0);
  const maxLength = 150;

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const { value } = e.target;
    setCharCount(value.length); // Оновлюємо кількість символів
    setFieldValue("review", value); // Оновлюємо значення review у Formik
  };

  const initialValues: ReviewFormValues = {
    name: "",
    phone: "",
    review: "",
    isAuthenticated: !!user, // Якщо є користувач, то він авторизований
    rating: 0,
    images: [],
  };

  const handleSubmit = (
    values: ReviewFormValues,
    { resetForm }: FormikHelpers<ReviewFormValues>
  ) => {
    // Логіка для відправки відгуку
    console.log(values);
    // Закриваємо попап після відправки
    onClose();
    // Якщо хочете очистити форму після відправки
    resetForm();
  };

  return (
    <div className={s.popupOverlay} onClick={onClose}>
      <div className={s.popupContent} onClick={(e) => e.stopPropagation()}>
        <div className={s.popupHeader}>
          <h2 className={s.popupTitle}>Залишити відгук</h2>
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

        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ setFieldValue, values }) => (
            <Form className={s.form}>
              {!initialValues.isAuthenticated && (
                <>
                  <div>
                    <label htmlFor="name">
                      Ім'я<span>*</span>
                    </label>
                    <Field id="name" name="name" placeholder="Твоє імʼя" />
                  </div>

                  <div>
                    <label htmlFor="phone">
                      Номер телефону<span>*</span>
                    </label>
                    <Field
                      id="phone"
                      name="phone"
                      type="phone"
                      placeholder="Твій номер телефону"
                    />
                  </div>
                </>
              )}

              <div className="mb-[1vw]">
                <label htmlFor="review">Відгук для публікації</label>
                <Field
                  as="textarea"
                  id="review"
                  name="review"
                  placeholder="Текст відгуку"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    handleChange(e, setFieldValue)
                  } // Викликаємо handleChange з setFieldValue
                  value={values.review} // Забезпечуємо синхронізацію значення
                />
                <div className={s.length}>
                  {charCount}/{maxLength}
                </div>
              </div>

              <div className={s.reviewAttributes}>
                <div>
                  <ImageUpload setFieldValue={setFieldValue} values={values} />
                </div>

                <div>
                  <StarRating setFieldValue={setFieldValue} values={values} />
                </div>
              </div>

              <div>
                <button type="submit" className={s.submitButton}>
                  Відправити відгук
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
