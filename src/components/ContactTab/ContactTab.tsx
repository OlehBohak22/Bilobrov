import s from "./ContactTab.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchContacts } from "../../store/slices/contactSlice";
import { AppDispatch, RootState } from "../../store";
import { Loader } from "../Loader/Loader";

export const ContactTab = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Отримуємо контактну інформацію
  const {
    input_email,
    input_phone,
    input_address,
    input_schedule,
    save_data_text,
    loading,
    error,
  } = useSelector((state: RootState) => state.contact);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  if (loading) return <Loader />;
  if (error) return <div className={s.error}>Помилка: {error}</div>;

  return (
    <div className={s.tab}>
      <h2>
        <span>Наші</span>
        <span>контакти</span>
      </h2>

      <ul className={s.list}>
        <li>
          <div>
            <h3>Надіслати листа</h3>
            <p>Звʼяжіться з нами</p>
          </div>

          <a href={`mailto:${input_email}`}>{input_email}</a>
        </li>

        <li>
          <div>
            <h3>Подзвонити</h3>
            <p>Поговоріть з підтримкою</p>
          </div>

          <a href={`tel:${input_phone}`}>{input_phone}</a>
        </li>

        <li>
          <div>
            <h3>Завітайте до нас</h3>
            <p>{input_address}</p>
          </div>

          <a
            target="_blank"
            href="https://www.google.com.ua/maps/place/%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%8F+%D0%9B%D0%B5%D1%81%D1%8F+%D0%9A%D1%83%D1%80%D0%B1%D0%B0%D1%81%D0%B0,+5,+%D0%91%D1%96%D0%BB%D0%B0+%D0%A6%D0%B5%D1%80%D0%BA%D0%B2%D0%B0,+%D0%9A%D0%B8%D1%97%D0%B2%D1%81%D1%8C%D0%BA%D0%B0+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C,+09100/@49.7954719,30.1134199,17z/data=!4m16!1m9!3m8!1s0x40d3421f3013b993:0x68138c7ccf251674!2z0LLRg9C70LjRhtGPINCb0LXRgdGPINCa0YPRgNCx0LDRgdCwLCA1LCDQkdGW0LvQsCDQptC10YDQutCy0LAsINCa0LjRl9Cy0YHRjNC60LAg0L7QsdC70LDRgdGC0YwsIDA5MTAw!3b1!8m2!3d49.79551!4d30.1138181!10e5!16s%2Fg%2F1tgxs11f!3m5!1s0x40d3421f3013b993:0x68138c7ccf251674!8m2!3d49.79551!4d30.1138181!16s%2Fg%2F1tgxs11f?hl=uk&entry=ttu&g_ep=EgoyMDI1MDIwMy4wIKXMDSoASAFQAw%3D%3D"
          >
            Подивитись на Google Maps
          </a>
        </li>
      </ul>

      <p className={s.schdule}>{input_schedule}</p>

      <ul className={s.socialList}>
        {save_data_text.map((item) => (
          <li>
            <a target="_blank" href={item.hl_input_link}>
              <div className={s.socialName}>
                <span
                  dangerouslySetInnerHTML={{ __html: item.hl_svg_photo }}
                ></span>
                <p>{item.hl_input_name}</p>
              </div>

              <div className={s.socialInfo}>
                <img src="/icons/footer-logo.svg" alt="Logo" />

                <div>
                  <p>{item.hl_input_tag}</p>
                  <span>
                    {item.hl_input_btn_text}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 18L18 6M18 6H10M18 6V14"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
