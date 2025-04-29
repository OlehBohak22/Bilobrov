import s from "./AddressTab.module.css";
import { UserData } from "../../store/slices/userSlice"; // імпорт типу UserData
import { useState } from "react";
import { AddAddressForm } from "./AddAddressForm";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { deleteAddress } from "../../store/slices/addressSlice";
import { checkUserSession } from "../../store/actions/userActions";
import { ConfirmLogoutModal } from "../ConfirmLogoutModal/ConfirmLogoutModal";

interface AddressTabProps {
  user: UserData | null; // Типізуємо пропс user
}

export const AddressTab = ({ user }: AddressTabProps) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null); // тип: Address | null
  const dispatch = useAppDispatch();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<number | null>(null);

  const handleCLoseForm = () => {
    setFormOpen(false);

    setTimeout(() => {
      dispatch(checkUserSession());
    }, 1000);
  };

  const token = useSelector((state: RootState) => state.user.token) || "";

  const handleDelete = (id: number) => {
    setAddressToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (addressToDelete === null) return;

    const payload = { token, addressId: addressToDelete.toString() };
    dispatch(deleteAddress(payload));

    setTimeout(() => {
      dispatch(checkUserSession());
    }, 1000);

    // Закриваємо попап і очищаємо id
    setIsDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAddressToDelete(null);
  };

  const handleChange = (address: any) => {
    setEditAddress(address);
    setFormOpen(true);
  };

  return (
    <div className={s.tab}>
      <div className={s.heading}>
        <h3>
          <span>Мої</span>
          <span>адреси</span>
        </h3>

        <button
          onClick={() => {
            setEditAddress(null); // 💡 очищаємо перед відкриттям форми
            setFormOpen(true);
          }}
        >
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
                    {address.department && `м. ${address.department} `}
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

              <div className={s.bottomFlex}>
                <div className={s.customCheckbox}>
                  <span className={s.checkboxIcon}>
                    {address.selected ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.2827 3.45258C11.5131 2.98564 11.6284 2.75218 11.7848 2.67758C11.9209 2.61268 12.0791 2.61268 12.2152 2.67758C12.3717 2.75218 12.4869 2.98564 12.7174 3.45258L14.9041 7.88255C14.9721 8.0204 15.0061 8.08933 15.0558 8.14284C15.0999 8.19023 15.1527 8.22862 15.2113 8.25589C15.2776 8.28669 15.3536 8.29781 15.5057 8.32004L20.397 9.03497C20.9121 9.11026 21.1696 9.1479 21.2888 9.2737C21.3925 9.38316 21.4412 9.53356 21.4215 9.68304C21.3988 9.85485 21.2124 10.0364 20.8395 10.3996L17.3014 13.8457C17.1912 13.9531 17.136 14.0068 17.1004 14.0707C17.0689 14.1273 17.0487 14.1895 17.0409 14.2538C17.0321 14.3264 17.0451 14.4023 17.0711 14.554L17.906 19.4214C17.994 19.9348 18.038 20.1914 17.9553 20.3438C17.8833 20.4763 17.7554 20.5693 17.6071 20.5967C17.4366 20.6283 17.2061 20.5071 16.7451 20.2647L12.3724 17.9651C12.2361 17.8935 12.168 17.8576 12.0962 17.8436C12.0327 17.8311 11.9673 17.8311 11.9038 17.8436C11.832 17.8576 11.7639 17.8935 11.6277 17.9651L7.25492 20.2647C6.79392 20.5071 6.56341 20.6283 6.39297 20.5967C6.24468 20.5693 6.11672 20.4763 6.04474 20.3438C5.962 20.1914 6.00603 19.9348 6.09407 19.4214L6.92889 14.554C6.95491 14.4023 6.96793 14.3264 6.95912 14.2538C6.95132 14.1895 6.93111 14.1273 6.89961 14.0707C6.86402 14.0068 6.80888 13.9531 6.69859 13.8457L3.16056 10.3996C2.78766 10.0364 2.60121 9.85485 2.57853 9.68304C2.55879 9.53356 2.60755 9.38316 2.71125 9.2737C2.83044 9.1479 3.08797 9.11026 3.60304 9.03497L8.49431 8.32004C8.64642 8.29781 8.72248 8.28669 8.78872 8.25589C8.84736 8.22862 8.90016 8.19023 8.94419 8.14284C8.99391 8.08933 9.02793 8.0204 9.09597 7.88255L11.2827 3.45258Z"
                          fill="#FFC43A"
                          stroke="#FFC43A"
                          stroke-width="1.3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.2827 3.95258C11.5131 3.48564 11.6284 3.25218 11.7848 3.17758C11.9209 3.11268 12.0791 3.11268 12.2152 3.17758C12.3717 3.25218 12.4869 3.48564 12.7174 3.95258L14.9041 8.38255C14.9721 8.5204 15.0061 8.58933 15.0558 8.64284C15.0999 8.69023 15.1527 8.72862 15.2113 8.75589C15.2776 8.78669 15.3536 8.79781 15.5057 8.82004L20.397 9.53497C20.9121 9.61026 21.1696 9.6479 21.2888 9.7737C21.3925 9.88316 21.4412 10.0336 21.4215 10.183C21.3988 10.3548 21.2124 10.5364 20.8395 10.8996L17.3014 14.3457C17.1912 14.4531 17.136 14.5068 17.1004 14.5707C17.0689 14.6273 17.0487 14.6895 17.0409 14.7538C17.0321 14.8264 17.0451 14.9023 17.0711 15.054L17.906 19.9214C17.994 20.4348 18.038 20.6914 17.9553 20.8438C17.8833 20.9763 17.7554 21.0693 17.6071 21.0967C17.4366 21.1283 17.2061 21.0071 16.7451 20.7647L12.3724 18.4651C12.2361 18.3935 12.168 18.3576 12.0962 18.3436C12.0327 18.3311 11.9673 18.3311 11.9038 18.3436C11.832 18.3576 11.7639 18.3935 11.6277 18.4651L7.25492 20.7647C6.79392 21.0071 6.56341 21.1283 6.39297 21.0967C6.24468 21.0693 6.11672 20.9763 6.04474 20.8438C5.962 20.6914 6.00603 20.4348 6.09407 19.9214L6.92889 15.054C6.95491 14.9023 6.96793 14.8264 6.95912 14.7538C6.95132 14.6895 6.93111 14.6273 6.89961 14.5707C6.86402 14.5068 6.80888 14.4531 6.69859 14.3457L3.16056 10.8996C2.78766 10.5364 2.60121 10.3548 2.57853 10.183C2.55879 10.0336 2.60755 9.88316 2.71125 9.7737C2.83044 9.6479 3.08797 9.61026 3.60304 9.53497L8.49431 8.82004C8.64642 8.79781 8.72248 8.78669 8.78872 8.75589C8.84736 8.72862 8.90016 8.69023 8.94419 8.64284C8.99391 8.58933 9.02793 8.5204 9.09597 8.38255L11.2827 3.95258Z"
                          stroke="black"
                          stroke-width="1.3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  <span>Основна адреса</span>
                </div>

                <div
                  onClick={() => handleChange(address)}
                  className={s.changeAddress}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 4.00023H6.8C5.11984 4.00023 4.27976 4.00023 3.63803 4.32721C3.07354 4.61483 2.6146 5.07377 2.32698 5.63826C2 6.27999 2 7.12007 2 8.80023V17.2002C2 18.8804 2 19.7205 2.32698 20.3622C2.6146 20.9267 3.07354 21.3856 3.63803 21.6732C4.27976 22.0002 5.11984 22.0002 6.8 22.0002H15.2C16.8802 22.0002 17.7202 22.0002 18.362 21.6732C18.9265 21.3856 19.3854 20.9267 19.673 20.3622C20 19.7205 20 18.8804 20 17.2002V13.0002M7.99997 16.0002H9.67452C10.1637 16.0002 10.4083 16.0002 10.6385 15.945C10.8425 15.896 11.0376 15.8152 11.2166 15.7055C11.4184 15.5818 11.5914 15.4089 11.9373 15.063L21.5 5.50023C22.3284 4.6718 22.3284 3.32865 21.5 2.50023C20.6716 1.6718 19.3284 1.6718 18.5 2.50022L8.93723 12.063C8.59133 12.4089 8.41838 12.5818 8.29469 12.7837C8.18504 12.9626 8.10423 13.1577 8.05523 13.3618C7.99997 13.5919 7.99997 13.8365 7.99997 14.3257V16.0002Z"
                      stroke-width="1.3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
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

      {formOpen && (
        <AddAddressForm
          closeForm={handleCLoseForm}
          initialValues={editAddress} // ← ось це
        />
      )}

      <ConfirmLogoutModal
        isOpen={isDeleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        confirmText="Видалити"
        cancelText="Залишити"
        titleText="Впевнена?"
        descText="Твоя косметика вже полюбила цю адресу!"
      />
    </div>
  );
};
