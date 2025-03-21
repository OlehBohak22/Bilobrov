import { FC, useEffect, useState } from "react";
import s from "./AddAddressForm.module.css";
import { CustomSelect } from "../CustomSelect/CustomSelect";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addAddress } from "../../store/slices/addressSlice";

interface AddressFormProp {
  closeForm: () => void;
}

export const AddAddressForm: FC<AddressFormProp> = ({ closeForm }) => {
  const { cities } = useSelector((state: RootState) => state.cities);
  const allCities = cities.map((city) => city.name);
  const [selectedCity, setSelectedCity] = useState("");
  const [departmentSelect, setDepartmentSelect] = useState("На відділення");
  const [selectedStreet, setSelectedStreet] = useState("");
  const dispatch = useAppDispatch();

  const token = useSelector((state: RootState) => state.user.token) || "";

  const { user } = useSelector((state: RootState) => state.user) ?? {};

  const warehouses = selectedCity
    ? cities
        .filter((city) => city.name === selectedCity)
        .flatMap((city) => city.warehouses)
        .map((warehouse) => warehouse.name)
    : [];
  const [warehouse, setWarehouse] = useState<string>(warehouses[0] || "");

  console.log(warehouse);

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
        departmentSelect === "На відділення" ? "department" : "courier", // Тепер передається правильне значення
    };

    const payload = {
      token,
      address: fixedAddress,
    };

    console.log("Запит до API:", payload);

    dispatch(addAddress(payload)); // передаємо об'єкт із token та address

    closeForm();
  };

  return (
    <div>
      <div>
        <div className={s.heading}>
          <p>
            Адреса #
            {user?.meta.address?.length ? user.meta.address.length + 1 : 1}
          </p>

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
                Відділення <span>*</span>
              </p>
              <CustomSelect
                novaIcon={true}
                options={["На відділення", "Кур'єр"]}
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
                  value={selectedStreet.split(",")[0]} // Вибір вулиці
                  onChange={(value) => setSelectedStreet(value)}
                />
              </div>
            ) : null}
          </div>

          {selectedCity && departmentSelect === "На відділення" ? (
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

                <button className={s.mapSelect}>Обрати на мапі</button>
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
