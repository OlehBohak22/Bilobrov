import { FC, useEffect, useState } from "react";
import s from "./AddAddressForm.module.css";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  addAddress,
  Address,
  updateAddress,
} from "../../store/slices/addressSlice";
import { NovaPoshtaMapPopup } from "../MapPopup/MapPopup";

interface AddAddressFormProps {
  closeForm: () => void;
  initialValues?: (Address & { id?: number }) | null;
}

export const AddAddressForm: FC<AddAddressFormProps> = ({
  closeForm,
  initialValues,
}) => {
  const { cities } = useSelector((state: RootState) => state.cities);
  const allCities = cities.map((city) => city.name);
  const [selectedCity, setSelectedCity] = useState("");
  const [departmentSelect, setDepartmentSelect] = useState("На відділення");
  const [selectedStreet, setSelectedStreet] = useState("");
  const dispatch = useAppDispatch();
  const [showMapPopup, setShowMapPopup] = useState(false);
  const [, setSelectedWarehouse] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.user.token) || "";

  const { user } = useSelector((state: RootState) => state.user) ?? {};

  const [tab, setTab] = useState<"PostOffice" | "ParcelLocker">("PostOffice");

  useEffect(() => {
    if (departmentSelect === "Поштомат") {
      setTab("ParcelLocker");
    } else if (departmentSelect === "На відділення") {
      setTab("PostOffice");
    }
  }, [departmentSelect]);

  useEffect(() => {
    if (initialValues) {
      setAddress((prev) => ({
        ...prev,
        ...initialValues,
      }));

      setSelectedCity(initialValues.city);
      setDepartmentSelect(
        initialValues.delivery_type === "department"
          ? "На відділення"
          : "Кур'єр"
      );
      setSelectedStreet(initialValues.street);
      setWarehouse(initialValues.department);
    }
  }, [initialValues]);

  const warehouses = selectedCity
    ? cities
        .filter((city) => city.name === selectedCity)
        .flatMap((city) => city.warehouses)
        .map((warehouse) => warehouse.name)
    : [];
  const [warehouse, setWarehouse] = useState<string>(warehouses[0] || "");

  const streets = selectedCity
    ? cities
        .filter((city) => city.name === selectedCity)
        .flatMap((warehouse) => warehouse.streets)
    : [];

  //   const fullAddress = `${house}, ${entrance}, ${apartment}`;

  const [instructions, setInstructions] = useState("");
  const maxLength = 150;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setInstructions(value); // Оновлюємо значення інструкцій
    }
  };

  const [address, setAddress] = useState({
    first_name: user?.name,
    middle_name: "",
    last_name: user?.secondName,
    phone: user?.meta.phone,
    city: "",
    street: "",
    house: "",
    entrance: "",
    apartment: "",
    selected: true,
    delivery_type: "",
    department: "",
  });

  useEffect(() => {
    const currentType =
      departmentSelect === "На відділення" ? "department" : "courier";

    setAddress((prev) => ({
      ...prev,
      delivery_type: currentType,
      city: selectedCity,
      street: selectedStreet,
      department: warehouse,
    }));
  }, [departmentSelect, selectedCity, selectedStreet, warehouse]);

  const handleSubmit = () => {
    const fixedAddress = {
      ...address,
      delivery_type:
        departmentSelect === "На відділення" ? "department" : "courier",
    };

    const payload = {
      token,
      address: initialValues?.id
        ? { ...fixedAddress, id: initialValues.id } // якщо є id — додаємо
        : fixedAddress,
    };

    if (initialValues?.id) {
      dispatch(updateAddress(payload));
    } else {
      dispatch(addAddress(payload));
    }

    closeForm();
  };

  return (
    <div>
      <div>
        <div className={s.heading}>
          <p>
            {initialValues?.id
              ? "Редагування адреси"
              : `Адреса #${(user?.meta.address?.length || 0) + 1}`}
          </p>

          <div className={s.headingContoller}>
            <div
              className={s.customCheckbox}
              onClick={() =>
                setAddress((prev) => ({
                  ...prev,
                  selected: !prev.selected,
                }))
              }
            >
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

            <svg
              onClick={closeForm}
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
          </div>
        </div>

        <form>
          <div className={s.inputContainer}>
            <label>
              Ім'я одержувача <span>*</span>
              <input
                value={address.first_name}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    first_name: e.target.value,
                  })
                }
                type="text"
                placeholder="Ім'я одержувача"
              />
            </label>

            <label>
              Прізвище одержувача <span>*</span>
              <input
                value={address.last_name}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    last_name: e.target.value,
                  })
                }
                type="text"
                placeholder="Прізвище одержувача"
              />
            </label>

            <label>
              По-батькові одержувача <span>*</span>
              <input
                value={address.middle_name}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    middle_name: e.target.value,
                  })
                }
                type="text"
                placeholder="По-батькові одержувача"
              />
            </label>

            <label>
              Номер телефону одержувача <span>*</span>
              <input
                value={address.phone}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    phone: e.target.value,
                  })
                }
                type="tel"
                placeholder="+38 ("
              />
            </label>
          </div>

          <div className={`${s.inputContainer} ${s.flex}`}>
            <div className={s.selectContainer}>
              <p>
                Спосіб доставки <span>*</span>
              </p>
              <CustomSelect
                novaIcon={true}
                options={["На відділення", "Кур'єр", "Поштомат"]}
                value={departmentSelect}
                onChange={setDepartmentSelect}
              />
            </div>
            <div className={s.selectContainer}>
              <p>
                Місто <span>*</span>
              </p>
              <CustomSelect
                novaIcon={false}
                options={allCities}
                value={selectedCity}
                onChange={setSelectedCity}
              />
            </div>

            {selectedCity && departmentSelect === "Кур'єр" ? (
              <div className={s.selectContainer}>
                <p>
                  Вулиця <span>*</span>
                </p>
                <CustomSelect
                  isStreet={true}
                  isWarehouses={false}
                  novaIcon={false}
                  options={streets}
                  value={
                    typeof selectedStreet === "string"
                      ? selectedStreet.split(",")[0]
                      : ""
                  }
                  onChange={(value) => setSelectedStreet(value)}
                />
              </div>
            ) : null}
          </div>

          {(selectedCity && departmentSelect === "На відділення") ||
          departmentSelect === "Поштомат" ? (
            <div className={`${s.inputContainer} `}>
              <div className={s.selectContainer}>
                <p>
                  № Відділення <span>*</span>
                </p>
                <CustomSelect
                  isWarehouses={true}
                  novaIcon={false}
                  options={warehouses}
                  value={warehouse}
                  onChange={(value) => setWarehouse(value)} // ✅ value - це рядок
                />
              </div>
              <button
                type="button"
                onClick={() => setShowMapPopup(true)}
                className={s.mapSelect}
              >
                Обрати на мапі
              </button>
            </div>
          ) : selectedCity && departmentSelect === "Кур'єр" ? (
            <div>
              <div className={`${s.inputContainer} items-end`}>
                <div className={s.addressIndo}>
                  <label>
                    Будинок <span>*</span>
                    <input
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          house: e.target.value,
                        })
                      }
                      value={address.house}
                      placeholder="№"
                      type="text"
                    />
                  </label>

                  <label>
                    Підʼїзд
                    <input
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          entrance: e.target.value,
                        })
                      }
                      value={address.entrance}
                      placeholder="№"
                      type="text"
                    />
                  </label>

                  <label>
                    Квартира
                    <input
                      onChange={(e) =>
                        setAddress({
                          ...address,
                          apartment: e.target.value,
                        })
                      }
                      value={address.apartment}
                      placeholder="№"
                      type="text"
                    />
                  </label>
                </div>
              </div>

              <div className={s.textArea}>
                <label>
                  Додаткові інструкції для курʼєра
                  <textarea
                    placeholder="Допоможіть курʼєру швидше знайти вас"
                    value={instructions}
                    onChange={handleChange}
                  />
                </label>
                <div className={s.characterCount}>
                  <span>
                    {instructions.length}/{maxLength}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {showMapPopup && (
            <NovaPoshtaMapPopup
              selectedCity={selectedCity}
              tab={tab}
              setTab={setTab} // ⬅️ додай
              onClose={() => setShowMapPopup(false)}
              onSelect={(warehouseName) => {
                setSelectedWarehouse(warehouseName);
                setWarehouse(warehouseName);
                setAddress((prev) => ({
                  ...prev,
                  department: warehouseName,
                }));
                setShowMapPopup(false);

                // автоматично оновлюємо тип доставки:
                if (warehouseName.toLowerCase().includes("поштомат")) {
                  setDepartmentSelect("Поштомат");
                } else {
                  setDepartmentSelect("На відділення");
                }
              }}
            />
          )}

          <button onClick={handleSubmit} className={s.submitBtn} type="submit">
            <p>Зберегти зміни</p>
            <svg
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_2036_10999)">
                <path d="M17.9177 5L16.8487 6.05572L21.6059 10.7535H0.5V12.2465H21.6059L16.8487 16.9443L17.9177 18L24.5 11.5L17.9177 5Z" />
              </g>
              <defs>
                <clipPath id="clip0_2036_10999">
                  <rect width="24" height="24" transform="translate(0.5)" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
