import s from "./AddressTab.module.css";
import { UserData } from "../../store/slices/userSlice"; // імпорт типу UserData
import { useState } from "react";
import { AddAddressForm } from "./AddAddressForm";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { deleteAddress } from "../../store/slices/addressSlice";
import { checkUserSession } from "../../store/actions/userActions";

interface AddressTabProps {
  user: UserData | null; // Типізуємо пропс user
}

export const AddressTab = ({ user }: AddressTabProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleCLoseForm = () => {
    setFormOpen(false);

    setTimeout(() => {
      dispatch(checkUserSession());
    }, 1000);
  };

  const token = useSelector((state: RootState) => state.user.token) || "";

  const handleDelete = (id: number) => {
    const payload = { token, addressId: id.toString() }; // Конвертація в рядок
    dispatch(deleteAddress(payload));

    setTimeout(() => {
      dispatch(checkUserSession());
    }, 1000);
  };

  return (
    <div className={s.tab}>
      <div className={s.heading}>
        <h3>
          <span>Мої</span>
          <span>адреси</span>
        </h3>

        <button onClick={() => setFormOpen(true)}>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_3171_21958)">
              <path d="M16 7.33333H8.66667V0H7.33333V7.33333H0V8.66667H7.33333V16H8.66667V8.66667H16V7.33333Z" />
            </g>
            <defs>
              <clipPath id="clip0_3171_21958">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Додати нову адресу
        </button>
      </div>

      {!user?.meta.address.length && !formOpen && (
        <div className={s.noneAddress}>
          <p>У вас ще немає збережених адрес</p>
          <img src="/icons/none.svg" alt="None address" />
        </div>
      )}

      {user?.meta.address && (
        <ul className={s.addressList}>
          {user?.meta.address.map((address, index) => (
            <li key={address.id || index}>
              <div className={s.infoBlock}>
                <span>Адреса #{++index}</span>

                <div className={s.addressInfo}>
                  <p>
                    {address.city && `м. ${address.city} `}
                    {address.street && `вул. ${address.street} `}
                    {address.house && `буд. ${address.house} `}
                    {address.entrance && `під'їзд ${address.entrance} `}
                    {address.apartment && `кв. ${address.apartment} `}
                  </p>

                  <p>
                    Одержувач:
                    {address.last_name && ` ${address.last_name} `}
                    {address.first_name && ` ${address.first_name} `}
                    {address.middle_name && ` ${address.middle_name} `}
                  </p>
                </div>
              </div>

              <div>{address.id}</div>

              <div>
                <button
                  onClick={() => handleDelete(address.id)}
                  className={s.delete}
                >
                  <svg
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 3.5H15M3 6.5H21M19 6.5L18.2987 17.0193C18.1935 18.5975 18.1409 19.3867 17.8 19.985C17.4999 20.5118 17.0472 20.9353 16.5017 21.1997C15.882 21.5 15.0911 21.5 13.5093 21.5H10.4907C8.90891 21.5 8.11803 21.5 7.49834 21.1997C6.95276 20.9353 6.50009 20.5118 6.19998 19.985C5.85911 19.3867 5.8065 18.5975 5.70129 17.0193L5 6.5M10 11V16M14 11V16"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {formOpen && <AddAddressForm closeForm={handleCLoseForm} />}
    </div>
  );
};
