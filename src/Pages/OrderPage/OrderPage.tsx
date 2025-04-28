import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { createOrder, OrderData } from "../../store/slices/orderSlice";
import s from "./OrderPage.module.css";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { Layout } from "../../components/Layout/Layout";
import { OrderSidePanel } from "../../components/OrderSidePanel/OrderSidePanel";
import { useEffect } from "react";
import { CustomSelect } from "../../components/CustomSelect/CustomSelect";
import { Link } from "react-router";
import { OrderFooter } from "./OrderFooter";
import { OrderSucces } from "../../components/OrderSucces/OrderSucces";
import { clearCart } from "../../store/slices/cartSlice";
import { AddressPopup } from "../../components/AddressPopup/AddressPopup";
import { NovaPoshtaMapPopup } from "../../components/MapPopup/MapPopup";
import InputMask from "react-input-mask";

export const OrderPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const [step, setStep] = useState(1);
  const { cities } = useSelector((state: RootState) => state.cities);
  const [selectedCity, setSelectedCity] = useState("");
  const [orderSucces, setOrderSucces] = useState<OrderData | null>(null);
  const [house, setHouse] = useState("");
  const [entrance, setEntrance] = useState("");
  const [apartment, setApartment] = useState("");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [addressPopup, setAddressPopup] = useState(false);

  const [showMapPopup, setShowMapPopup] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  const handleAddressSelect = (addressId: number) => {
    setSelectedAddressId(addressId);

    const selected = address?.find((addr) => addr.id === addressId);

    if (selected) {
      let fullAddress = "";

      if (selected.delivery_type === "department") {
        fullAddress = selected.department || ""; // тут беремо адресу відділення
      } else {
        fullAddress = `${selected.street || ""} ${selected.house || ""}${
          selected.entrance ? `, під'їзд ${selected.entrance}` : ""
        }${selected.apartment ? `, кв. ${selected.apartment}` : ""}`;
      }

      setBilling((prev) => ({
        ...prev,
        first_name: selected.first_name,
        last_name: selected.last_name,
        middle_name: selected.middle_name,
        city: selected.city,
        address_1: fullAddress,
      }));

      setShipping((prev) => ({
        ...prev,
        first_name: selected.first_name,
        last_name: selected.last_name,
        middle_name: selected.middle_name,
        phone: selected.phone || user?.meta.phone || "",
        email: user?.email || "",
        city: selected.city,
        address_1: fullAddress,
      }));

      setSelectedCity(selected.city);
      setSelectedStreet(selected.street || "");
      setHouse(selected.house || "");
      setEntrance(selected.entrance || "");
      setApartment(selected.apartment || "");
    }
  };

  const validateStepOne = () => {
    const newErrors: Record<string, boolean> = {};

    if (!billing.first_name.trim()) newErrors.first_name = true;
    if (!billing.last_name.trim()) newErrors.last_name = true;
    if (!billing.middle_name.trim()) newErrors.middle_name = true;
    if (
      !billing.phone.trim() ||
      !/^(\+380|0)\d{9}$/.test(billing.phone.trim())
    ) {
      newErrors.phone = true;
    }
    if (!billing.email.trim()) newErrors.email = true;

    if (!shipper) {
      if (!shipping.first_name.trim()) newErrors.shipping_first_name = true;
      if (!shipping.last_name.trim()) newErrors.shipping_last_name = true;
      if (!shipping.middle_name.trim()) newErrors.shipping_middle_name = true;
      if (
        !shipping.phone.trim() ||
        !/^(\+380|0)\d{9}$/.test(shipping.phone.trim())
      ) {
        newErrors.shipping_phone = true;
      }
      if (!shipping.email.trim()) newErrors.shipping_email = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors: Record<string, boolean> = {};

    if (regularCustomer) {
      if (!selectedAddressId) {
        newErrors.selectedAddress = true;
      }
    } else {
      if (!selectedCity.trim()) newErrors.city = true;

      if (departmentSelect === "На відділення") {
        if (!warehouse.trim()) newErrors.warehouse = true;
      } else if (departmentSelect === "Кур'єр") {
        if (!selectedStreet.trim()) newErrors.street = true;
        if (!house.trim()) newErrors.house = true;
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const userData = useSelector((state: RootState) => state.user.user);
  const { token } = useSelector((state: RootState) => state.user);

  const address = userData?.meta.address;

  useEffect(() => {
    if (Array.isArray(address) && address.length > 0) {
      const selected = address.find((addr) => addr.selected) || address[0];
      setSelectedAddressId(selected.id);

      // Автоматично також заповнити дані в billing і shipping
      handleAddressSelect(selected.id);
    }
  }, [address]);

  const [regularCustomer, setIsRegularCustomer] = useState(
    token && Array.isArray(address) && address.length > 0 ? true : false
  );

  const handleHouseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHouse(e.target.value); // Оновлюємо будинок
  };

  const handleEntranceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntrance(e.target.value); // Оновлюємо під'їзд
  };

  const handleApartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApartment(e.target.value); // Оновлюємо квартиру
  };

  const fullAddress = `${house}, ${entrance}, ${apartment}`;

  const [instructions, setInstructions] = useState("");
  const maxLength = 150;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setInstructions(value); // Оновлюємо значення інструкцій
    }
  };

  const [selectedStreet, setSelectedStreet] = useState("");

  const warehouses = selectedCity
    ? cities
        .filter((city) => city.name === selectedCity)
        .flatMap((city) => city.warehouses)
        .map((warehouse) => warehouse.name)
    : [];

  const streets = selectedCity
    ? cities
        .filter((city) => city.name === selectedCity)
        .flatMap((warehouse) => warehouse.streets)
    : [];

  const allCities = cities.map((city) => city.name);

  const [register, setRegister] = useState(false);
  const [shipper, setShipper] = useState(true);

  const [departmentSelect, setDepartmentSelect] = useState("На відділення");

  const [warehouse, setWarehouse] = useState<string>(warehouses[0] || "");

  const { user } = useSelector((state: RootState) => state.user);

  const [billing, setBilling] = useState({
    first_name: user?.name || "",
    last_name: user?.secondName || "",
    middle_name:
      user?.meta.address.find((item) => item.selected)?.middle_name ||
      user?.meta.address[0]?.middle_name ||
      "",
    address_1: "",
    city: "",
    state: "",
    postcode: "",
    country: "UA",
    email: user?.email || "",
    phone: user?.meta.phone || "",
  });

  const [shipping, setShipping] = useState({ ...billing });

  useEffect(() => {
    setBilling((prev) => ({
      ...prev,
      city: selectedCity,
      address_1:
        departmentSelect === "На відділення"
          ? warehouse
          : `${selectedStreet} ${fullAddress}`,
    }));
  }, [selectedCity, selectedStreet, warehouse, departmentSelect, fullAddress]);

  useEffect(() => {
    if (shipper) {
      setShipping(billing);
    }
  }, [billing, shipper]);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleNextStep = () => {
    if (step === 1 && !validateStepOne()) return;
    if (step === 2 && !validateStepTwo()) return;
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => setStep((prev) => prev - 1);

  let title: string = "";

  switch (step) {
    case 1:
      title = "Ваші контактні дані";
      break;
    case 2:
      title = "доставка";
      break;
    case 3:
      title = "оплата";
      break;
  }
  const handleOrderSubmit = async () => {
    let finalBilling = { ...billing };
    let finalShipping = { ...shipping };

    if (regularCustomer && selectedAddressId) {
      const selected = address?.find((addr) => addr.id === selectedAddressId);

      if (selected) {
        let fullAddress = "";

        if (selected.delivery_type === "department") {
          fullAddress = selected.department || "";
        } else {
          fullAddress = `${selected.street || ""} ${selected.house || ""}${
            selected.entrance ? `, під'їзд ${selected.entrance}` : ""
          }${selected.apartment ? `, кв. ${selected.apartment}` : ""}`;
        }

        finalBilling = {
          ...finalBilling,
          address_1: fullAddress,
        };
        finalShipping = {
          ...finalShipping,
          address_1: fullAddress,
        };
      }
    }

    const orderData = {
      payment_method: paymentMethod,
      payment_method_title:
        paymentMethod === "cod" ? "Cash on delivery" : "Online payment",
      set_paid: false,
      status: paymentMethod === "cod" ? "on-hold" : "processing",
      customer_id: userData ? userData.ID : 0,
      billing: finalBilling,
      shipping: finalShipping,
      line_items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        variation_id: item.variation_id,
      })),
      shipping_lines: [
        {
          method_id: "flat_rate",
          method_title: "Доставка кур'єром",
          total: "50",
        },
      ],
      meta_data: [
        {
          key: "courier_note",
          value: instructions,
        },
      ],
    };

    try {
      const resultAction = await dispatch(createOrder(orderData));
      if (createOrder.fulfilled.match(resultAction)) {
        dispatch(clearCart(token));
        setOrderSucces(resultAction.payload);
        console.log("Замовлення успішно створено:", resultAction.payload);
      } else {
        console.error(
          "Помилка при створенні замовлення:",
          resultAction.payload
        );
        alert("Сталася помилка при створенні замовлення. Спробуйте ще раз.");
      }
    } catch (error) {
      console.error("Сталася помилка при запиті:", error);
      alert("Невідомий збій. Спробуйте ще раз.");
    }
  };

  return (
    <div className={s.page}>
      <Layout>
        <div className={s.orderTopPanel}>
          <Link className={s.backLink} to="/">
            <svg
              viewBox="0 0 14 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.25 22.5L1.75 12L12.25 1.5"
                stroke="#1A1A1A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <Link to="/">
            <div className={s.headerLogo}>
              <svg viewBox="0 0 194 28" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_959_3585)">
                  <path d="M72.5214 0C68.4694 0 65.0707 1.33938 62.3249 4.01764C59.5791 6.69592 58.2062 10.0036 58.2062 13.9406C58.2062 17.9044 59.5791 21.2256 62.3249 23.9039C65.0707 26.5822 68.4694 27.9211 72.5214 27.9211C76.6 27.9211 79.9994 26.5956 82.7184 23.9442C85.4376 21.2392 86.7971 17.9044 86.7971 13.9406C86.7971 10.0036 85.4376 6.69592 82.7184 4.01764C80.0261 1.33938 76.6267 0 72.5214 0ZM153.056 0C149.003 0 145.604 1.33938 142.859 4.01764C140.113 6.69592 138.74 10.0036 138.74 13.9406C138.74 17.9044 140.113 21.2256 142.859 23.9039C145.604 26.5822 149.003 27.9211 153.056 27.9211C157.134 27.9211 160.533 26.5956 163.252 23.9442C165.972 21.2392 167.332 17.9044 167.332 13.9406C167.332 10.0036 165.972 6.69592 163.252 4.01764C160.56 1.33938 157.161 0 153.056 0ZM7.36525 0.40182V7.39229H15.6999C16.1264 7.39229 16.4863 7.55273 16.7795 7.87413C17.0728 8.16873 17.2196 8.55722 17.2196 9.03931C17.2196 9.22678 17.206 9.34726 17.1793 9.40083C17.126 9.77578 16.953 10.0837 16.6597 10.3248C16.3665 10.5658 16.0465 10.6863 15.6999 10.6863H7.36523V16.9538H16.4999C16.953 16.9538 17.3396 17.1277 17.6595 17.4758C17.9794 17.7972 18.1391 18.2122 18.1391 18.7211C18.1391 19.23 17.9794 19.659 17.6595 20.0072C17.3396 20.3553 16.953 20.5293 16.4999 20.5293H7.36523V27.5192H16.6597C19.2988 27.5192 21.5247 26.7563 23.3374 25.2296C25.1235 23.7032 26.0167 21.8012 26.0167 19.5247C26.0167 17.034 24.9638 15.0122 22.8578 13.4588C24.3507 12.0125 25.097 10.2711 25.097 8.23566C25.097 5.98591 24.2173 4.12462 22.4578 2.65157C20.6717 1.15174 18.4857 0.40182 15.8999 0.40182H7.36525ZM28.0561 0.40182V27.5192H35.6134V0.40182H28.0561ZM37.9328 0.40182V27.5192H57.6865V20.5293H45.4901V0.40182H37.9328ZM88.8364 0.40182V27.5192H103.072C105.711 27.5192 107.937 26.7563 109.75 25.2296C111.536 23.7032 112.428 21.8012 112.428 19.5247C112.428 17.034 111.376 15.0122 109.27 13.4588C110.762 12.0125 111.509 10.2711 111.509 8.23566C111.509 5.98591 110.629 4.12462 108.87 2.65157C107.084 1.15174 104.898 0.40182 102.312 0.40182H88.8364ZM114.468 0.40182V27.5192H122.026V19.6854H125.785L130.183 27.5192H138.62L133.302 18.0383C134.688 17.1544 135.768 16.0161 136.54 14.6234C137.341 13.2307 137.741 11.7044 137.741 10.0439C137.741 7.28526 136.742 4.99493 134.742 3.17371C132.769 1.3257 130.303 0.40182 127.344 0.40182H114.468ZM165.892 0.40182L176.768 27.5192H183.046L193.963 0.40182H186.085L179.926 16.5117L173.769 0.40182H165.892ZM72.5214 7.27197C74.3342 7.27197 75.8539 7.91434 77.0802 9.19991C78.3331 10.5123 78.9596 12.0926 78.9596 13.9406C78.9596 15.7886 78.3331 17.369 77.0802 18.6813C75.8539 19.9669 74.3342 20.6094 72.5214 20.6094C70.7087 20.6094 69.176 19.9798 67.923 18.7211C66.6968 17.4623 66.0838 15.869 66.0838 13.9406C66.0838 12.0391 66.6968 10.4587 67.923 9.19991C69.176 7.91434 70.7087 7.27197 72.5214 7.27197ZM153.056 7.27197C154.868 7.27197 156.388 7.91434 157.614 9.19991C158.867 10.5123 159.494 12.0926 159.494 13.9406C159.494 15.7886 158.867 17.369 157.614 18.6813C156.388 19.9669 154.868 20.6094 153.056 20.6094C151.242 20.6094 149.71 19.9798 148.456 18.7211C147.23 17.4623 146.617 15.869 146.617 13.9406C146.617 12.0391 147.23 10.4587 148.456 9.19991C149.71 7.91434 151.242 7.27197 153.056 7.27197ZM96.3937 7.3923H102.112C102.539 7.3923 102.899 7.55275 103.192 7.87413C103.485 8.16875 103.632 8.55724 103.632 9.03931C103.632 9.22679 103.618 9.34727 103.592 9.40084C103.538 9.77581 103.365 10.0838 103.072 10.3248C102.779 10.5659 102.459 10.6863 102.112 10.6863H96.3937V7.3923ZM122.026 7.3923H127.344C128.09 7.3923 128.703 7.64677 129.183 8.15565C129.663 8.63774 129.903 9.26718 129.903 10.0439C129.903 10.8206 129.663 11.463 129.183 11.9718C128.703 12.4807 128.09 12.7352 127.344 12.7352H122.026V7.3923ZM96.3937 16.9538H102.912C103.365 16.9538 103.751 17.1277 104.071 17.476C104.391 17.7973 104.552 18.2123 104.552 18.7211C104.552 19.23 104.391 19.659 104.071 20.0072C103.751 20.3553 103.365 20.5293 102.912 20.5293H96.3937V16.9538Z" />
                  <path d="M1.71213 27.8321C1.2267 27.8321 0.819986 27.6641 0.491992 27.3279C0.163997 26.9885 0 26.57 0 26.0724C0 25.7099 0.0885585 25.3887 0.265675 25.1086C0.436235 24.8284 0.669111 24.6159 0.964306 24.471L1.25458 25.2716C1.10698 25.3507 0.992186 25.4612 0.910188 25.6029C0.824908 25.7412 0.782267 25.8978 0.782267 26.0724C0.782267 26.3295 0.870826 26.5453 1.04794 26.72C1.22178 26.8913 1.44317 26.977 1.71213 26.977C1.97781 26.977 2.20085 26.8913 2.38124 26.72C2.55837 26.5453 2.64692 26.3295 2.64692 26.0724C2.64692 25.8978 2.60592 25.7412 2.52392 25.6029C2.43864 25.4612 2.32221 25.3507 2.17461 25.2716L2.46489 24.471C2.7568 24.6159 2.99131 24.8284 3.16843 25.1086C3.34227 25.392 3.42918 25.7132 3.42918 26.0724C3.42918 26.5766 3.26518 26.9951 2.93719 27.3279C2.60592 27.6641 2.19757 27.8321 1.71213 27.8321ZM1.71213 24.283C1.2267 24.283 0.819986 24.115 0.491992 23.7789C0.163997 23.4395 0 23.021 0 22.5234C0 22.0226 0.163997 21.6057 0.491992 21.2728C0.819986 20.9367 1.2267 20.7687 1.71213 20.7687C2.19757 20.7687 2.60592 20.9367 2.93719 21.2728C3.26518 21.6024 3.42918 22.0193 3.42918 22.5234C3.42918 23.0275 3.26518 23.446 2.93719 23.7789C2.60592 24.115 2.19757 24.283 1.71213 24.283ZM2.64692 22.5234C2.64692 22.2696 2.55837 22.0555 2.38124 21.8808C2.19757 21.7062 1.97453 21.6188 1.71213 21.6188C1.45301 21.6188 1.23326 21.7062 1.05287 21.8808C0.872467 22.0522 0.782267 22.2664 0.782267 22.5234C0.782267 22.7805 0.870826 22.9963 1.04794 23.171C1.22178 23.3422 1.44317 23.428 1.71213 23.428C1.97781 23.428 2.20085 23.3422 2.38124 23.171C2.55837 22.9963 2.64692 22.7805 2.64692 22.5234ZM0.801949 18.139L0.969224 18.9497C0.900348 18.9662 0.844589 19.0107 0.801949 19.0831C0.75603 19.1556 0.733071 19.2413 0.733071 19.3401C0.733071 19.4358 0.75603 19.5181 0.801949 19.5874C0.844589 19.6532 0.898708 19.6861 0.964306 19.6861C1.04303 19.6861 1.11026 19.6285 1.16602 19.5132C1.20538 19.4274 1.25294 19.2874 1.3087 19.0931C1.33494 19.0073 1.34806 18.9629 1.34806 18.9596C1.42022 18.7124 1.52026 18.5015 1.64817 18.3268C1.80561 18.1028 2.04342 17.9907 2.36157 17.9907C2.68628 17.9907 2.9454 18.1077 3.13891 18.3417C3.33244 18.5757 3.42919 18.8771 3.42919 19.2463C3.42919 19.5857 3.34883 19.8806 3.18811 20.131C3.02739 20.3782 2.8142 20.5364 2.54852 20.6056L2.37633 19.7752C2.46816 19.7521 2.5436 19.6928 2.60265 19.5972C2.66169 19.4983 2.6912 19.3798 2.6912 19.2413C2.6912 19.1194 2.66824 19.0173 2.62232 18.9349C2.57312 18.8524 2.5108 18.8113 2.43537 18.8113C2.36976 18.8113 2.31237 18.8542 2.26317 18.9398C2.21397 19.0222 2.16149 19.1556 2.10574 19.3401C2.10245 19.35 2.09916 19.3616 2.09587 19.3747C2.09259 19.388 2.08931 19.3994 2.08605 19.4094C2.01061 19.6532 1.93025 19.8543 1.84497 20.0124C1.67113 20.3255 1.39891 20.4902 1.02827 20.5067C0.723233 20.5067 0.475596 20.4013 0.285361 20.1904C0.0951231 19.9795 3.98151e-06 19.701 3.98151e-06 19.355C3.98151e-06 19.0485 0.0754427 18.7849 0.226321 18.5641C0.380479 18.3334 0.572353 18.1917 0.801949 18.139ZM3.37507 16.8688V17.6744H0.0541229V16.8688L1.95814 15.7862L0.0541229 14.7087V13.903H3.37507V14.7087H1.55469L3.03067 15.5193V16.058L1.55469 16.8688H3.37507ZM0.0541229 13.5174V11.0064H0.806867V12.6969H1.32838V11.2881H2.07621V12.6969H2.62724V10.9817H3.37507V13.5174H0.0541229ZM0.0541229 10.7741V7.9912H0.806867V8.97484H3.37507V9.79537H0.806867V10.7741H0.0541229ZM3.37507 6.88399V7.70451H0.0541229V6.88399H3.37507ZM1.71213 6.54787C1.2267 6.54787 0.819986 6.3798 0.491992 6.04369C0.163997 5.70427 0 5.28578 0 4.78818C0 4.4257 0.0885585 4.10441 0.265675 3.82431C0.436235 3.5442 0.669111 3.33166 0.964306 3.18668L1.25458 3.98744C1.10698 4.06652 0.992186 4.17691 0.910188 4.3186C0.824908 4.457 0.782267 4.61353 0.782267 4.78818C0.782267 5.04521 0.870826 5.26105 1.04794 5.43571C1.22178 5.60707 1.44317 5.69273 1.71213 5.69273C1.97781 5.69273 2.20085 5.60707 2.38124 5.43571C2.55837 5.26105 2.64692 5.04521 2.64692 4.78818C2.64692 4.61353 2.60592 4.457 2.52392 4.3186C2.43864 4.17691 2.32221 4.06652 2.17461 3.98744L2.46489 3.18668C2.7568 3.33166 2.99131 3.5442 3.16843 3.82431C3.34227 4.1077 3.42918 4.42899 3.42918 4.78818C3.42918 5.29236 3.26518 5.71086 2.93719 6.04369C2.60592 6.3798 2.19757 6.54787 1.71213 6.54787ZM0.801949 0.512544L0.969224 1.32319C0.900348 1.33967 0.844589 1.38416 0.801949 1.45665C0.75603 1.52915 0.733071 1.61483 0.733071 1.71369C0.733071 1.80924 0.75603 1.89163 0.801949 1.96082C0.844589 2.02673 0.898708 2.05968 0.964306 2.05968C1.04303 2.05968 1.11026 2.00202 1.16602 1.88668C1.20538 1.801 1.25294 1.66095 1.3087 1.46653C1.33494 1.38085 1.34806 1.33637 1.34806 1.33307C1.42022 1.08593 1.52026 0.875026 1.64817 0.700375C1.80561 0.476296 2.04342 0.364258 2.36157 0.364258C2.68628 0.364258 2.9454 0.481243 3.13891 0.715211C3.33244 0.949175 3.42919 1.25069 3.42919 1.61976C3.42919 1.95917 3.34883 2.2541 3.18811 2.50454C3.02739 2.75169 2.8142 2.90987 2.54852 2.97907L2.37633 2.14866C2.46816 2.1256 2.5436 2.06628 2.60265 1.97071C2.66169 1.87185 2.6912 1.75321 2.6912 1.61481C2.6912 1.4929 2.66824 1.39074 2.62232 1.30836C2.57312 1.22598 2.5108 1.18478 2.43537 1.18478C2.36976 1.18478 2.31237 1.22762 2.26317 1.3133C2.21397 1.39569 2.16149 1.52915 2.10574 1.71369C2.10245 1.72356 2.09916 1.73509 2.09587 1.74827C2.09259 1.76145 2.08931 1.77298 2.08605 1.78287C2.01061 2.02671 1.93025 2.22774 1.84497 2.3859C1.67113 2.69896 1.39891 2.86372 1.02827 2.88021C0.723233 2.88021 0.475596 2.77475 0.285361 2.56385C0.0951231 2.35296 3.98151e-06 2.0745 3.98151e-06 1.72849C3.98151e-06 1.42203 0.0754427 1.15841 0.226321 0.937627C0.380479 0.706957 0.572353 0.565269 0.801949 0.512544Z" />
                </g>
                <defs>
                  <clipPath id="clip0_959_3585">
                    <rect width="194" height="28" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </Link>

          <a href="tel:380674811650">+38 (067) 481 16 50</a>
        </div>
      </Layout>

      {(!orderSucces && (
        <Layout>
          <div className={s.navTabs}>
            <button
              className={`${step === 1 && s.active} ${step > 1 && s.done}`}
            >
              <span>1</span> Контактні дані
            </button>
            <button
              className={`${step === 2 && s.active} ${step > 2 && s.done}`}
            >
              <span>2</span> Доставка
            </button>
            <button className={`${step === 3 && s.active}`}>
              <span>3</span> Оплата
            </button>
          </div>

          <div className={s.orderAllInfo}>
            <div>
              <div className={s.stepsContainer}>
                {token && (
                  <div className={s.regularCustomerController}>
                    <div
                      onClick={() => setIsRegularCustomer(false)}
                      className={`${!regularCustomer ? s.active : ""}`}
                    >
                      Замовляю вперше
                    </div>
                    <div
                      onClick={() => setIsRegularCustomer(true)}
                      className={`${regularCustomer ? s.active : ""}`}
                    >
                      Я постійна клієнтка
                    </div>
                  </div>
                )}

                <h2>{title}</h2>

                {step === 1 && (
                  <div>
                    <div className={s.inputBox}>
                      <div className={s.inputContainer}>
                        <label>
                          Ім'я <span>*</span>
                          <input
                            className={
                              !billing.first_name.trim() && errors.first_name
                                ? s.errorInput
                                : ""
                            }
                            type="text"
                            placeholder="Твоє імʼя"
                            value={billing.first_name}
                            onChange={(e) =>
                              setBilling({
                                ...billing,
                                first_name: e.target.value,
                              })
                            }
                          />
                        </label>

                        <label>
                          Прізвищe <span>*</span>
                          <input
                            className={
                              !billing.last_name.trim() && errors.last_name
                                ? s.errorInput
                                : ""
                            }
                            type="text"
                            placeholder="Прізвище"
                            value={billing.last_name}
                            onChange={(e) =>
                              setBilling({
                                ...billing,
                                last_name: e.target.value,
                              })
                            }
                          />
                        </label>
                      </div>

                      <div className={s.inputContainer}>
                        <label>
                          По-батькові <span>*</span>
                          <input
                            className={
                              !billing.middle_name.trim() && errors.middle_name
                                ? s.errorInput
                                : ""
                            }
                            type="text"
                            placeholder="Твоє імʼя по-батькові"
                            value={billing.middle_name}
                            onChange={(e) =>
                              setBilling({
                                ...billing,
                                middle_name: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label>
                          Номер телефону <span>*</span>
                          <InputMask
                            mask="+380 (99) 999-99-99"
                            maskChar=""
                            value={billing.phone}
                            onChange={(e: any) =>
                              setBilling({ ...billing, phone: e.target.value })
                            }
                          >
                            {(
                              inputProps: React.InputHTMLAttributes<HTMLInputElement>
                            ) => (
                              <input
                                {...inputProps}
                                type="tel"
                                className={`${
                                  !billing.phone.trim() && errors.phone
                                    ? s.errorInput
                                    : ""
                                }`}
                                placeholder="+380 (__) ___-__-__"
                              />
                            )}
                          </InputMask>
                        </label>
                      </div>

                      <div className={s.inputContainer}>
                        <label>
                          E-mail <span>*</span>
                          <input
                            className={
                              !billing.email.trim() && errors.email
                                ? s.errorInput
                                : ""
                            }
                            type="email"
                            placeholder="Твій e-mail"
                            value={billing.email}
                            onChange={(e) =>
                              setBilling({
                                ...billing,
                                email: e.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <div className={s.checkboxContainer}>
                      <label className={s.customCheckbox}>
                        <input
                          type="checkbox"
                          checked={shipper}
                          onChange={() => setShipper(!shipper)}
                          className={s.hiddenCheckbox} // Сховаємо стандартний чекбокс
                        />
                        <span className={s.checkboxLabel}>Я отримувач</span>
                      </label>

                      {!token && (
                        <label className={s.customCheckbox}>
                          <input
                            type="checkbox"
                            checked={register}
                            onChange={() => setRegister(!register)}
                            className={s.hiddenCheckbox} // Сховаємо стандартний чекбокс
                          />
                          <span className={s.checkboxLabel}>
                            Зареєструватися на сайті і отримати доступ до
                            спеціальних бонусів
                          </span>
                        </label>
                      )}
                    </div>

                    {!shipper && (
                      <div className={`${s.inputBox} mt-[1.6vw]`}>
                        <h2>контактні дані отримувача</h2>
                        <div className={s.inputContainer}>
                          <label>
                            Ім'я <span>*</span>
                            <input
                              className={
                                !shipping.first_name.trim() &&
                                errors.shipping_first_name
                                  ? s.errorInput
                                  : ""
                              }
                              type="text"
                              placeholder="Твоє імʼя"
                              value={shipping.first_name}
                              onChange={(e) =>
                                setShipping({
                                  ...shipping,
                                  first_name: e.target.value,
                                })
                              }
                            />
                          </label>

                          <label>
                            Прізвищe <span>*</span>
                            <input
                              className={
                                !shipping.last_name.trim() &&
                                errors.shipping_last_name
                                  ? s.errorInput
                                  : ""
                              }
                              type="text"
                              placeholder="Прізвище"
                              value={shipping.last_name}
                              onChange={(e) =>
                                setShipping({
                                  ...shipping,
                                  last_name: e.target.value,
                                })
                              }
                            />
                          </label>
                        </div>

                        <div className={s.inputContainer}>
                          <label>
                            По-батькові <span>*</span>
                            <input
                              className={
                                !shipping.middle_name.trim() &&
                                errors.shipping_middle_name
                                  ? s.errorInput
                                  : ""
                              }
                              type="text"
                              placeholder="Твоє імʼя по-батькові"
                              value={shipping.middle_name}
                              onChange={(e) =>
                                setShipping({
                                  ...shipping,
                                  middle_name: e.target.value,
                                })
                              }
                            />
                          </label>

                          <label>
                            Номер телефону <span>*</span>
                            <input
                              className={
                                !shipping.phone.trim() && errors.shipping_phone
                                  ? s.errorInput
                                  : ""
                              }
                              type="text"
                              placeholder="Твій номер телефону"
                              value={shipping.phone}
                              onChange={(e) =>
                                setShipping({
                                  ...shipping,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </label>
                        </div>

                        <div className={s.inputContainer}>
                          <label>
                            E-mail <span>*</span>
                            <input
                              className={
                                !shipping.email.trim() && errors.shipping_email
                                  ? s.errorInput
                                  : ""
                              }
                              type="email"
                              placeholder="Твій e-mail"
                              value={shipping.email}
                              onChange={(e) =>
                                setShipping({
                                  ...shipping,
                                  email: e.target.value,
                                })
                              }
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 2 &&
                  (regularCustomer ? (
                    <ul className={s.addressList}>
                      {address?.map((address, index) => (
                        <li
                          onClick={() => handleAddressSelect(address.id)}
                          className={
                            selectedAddressId == address.id ? s.checked : ""
                          }
                          key={address.id || index}
                        >
                          <div className={s.infoBlock}>
                            <span>Адреса #{++index}</span>

                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={selectedAddressId === address.id}
                              onChange={() => handleAddressSelect(address.id)}
                            />

                            <div className={s.addressInfo}>
                              <p>
                                {address.city && `м. ${address.city} `}
                                {address.street && `вул. ${address.street} `}
                                {address.house && `буд. ${address.house} `}
                                {address.entrance &&
                                  `під'їзд ${address.entrance} `}
                                {address.apartment &&
                                  `кв. ${address.apartment} `}
                              </p>

                              <p>
                                Одержувач:
                                {address.last_name && ` ${address.last_name} `}
                                {address.first_name &&
                                  ` ${address.first_name} `}
                                {address.middle_name &&
                                  ` ${address.middle_name} `}
                              </p>
                            </div>
                          </div>

                          {/* <div>{address.id}</div> */}

                          <div className="flex gap-[0.8vw]">
                            <div
                              onClick={() => setAddressPopup(true)}
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
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={s.inputBox}>
                      <div className={s.inputContainer}>
                        <div className={s.selectContainer}>
                          <p className="mb-[0.6vw]">
                            Спосіб доставки <span>*</span>
                          </p>
                          <CustomSelect
                            novaIcon={true}
                            options={["На відділення", "Кур'єр"]}
                            value={departmentSelect}
                            onChange={setDepartmentSelect}
                            className={errors.city ? s.errorInput : ""}
                          />
                        </div>

                        <div className={s.selectContainer}>
                          <p className="mb-[0.6vw]">
                            Місто <span>*</span>
                          </p>
                          <CustomSelect
                            novaIcon={false}
                            options={allCities} // Випадаючий список
                            value={selectedCity}
                            onChange={setSelectedCity}
                            className={errors.warehouse ? s.errorInput : ""}
                          />
                        </div>
                      </div>

                      {selectedCity && departmentSelect === "На відділення" ? (
                        <div className={s.inputContainer}>
                          <div className={s.selectContainer}>
                            <p className="mb-[0.6vw]">
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
                            className={s.mapButton}
                            onClick={() => setShowMapPopup(true)}
                          >
                            Обрати на мапі
                          </button>

                          {showMapPopup && (
                            <NovaPoshtaMapPopup
                              selectedCity={selectedCity}
                              onClose={() => setShowMapPopup(false)}
                              onSelect={(warehouse) => {
                                setWarehouse(warehouse);
                                setShowMapPopup(false);
                              }}
                            />
                          )}
                        </div>
                      ) : selectedCity && departmentSelect === "Кур'єр" ? (
                        <div>
                          <div className={s.inputContainer}>
                            <div className={s.selectContainer}>
                              <p className="mb-[0.6vw]">
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

                            <div className={s.addressIndo}>
                              <label>
                                Будинок <span>*</span>
                                <input
                                  value={house}
                                  onChange={handleHouseChange}
                                  placeholder="№"
                                  type="text"
                                />
                              </label>

                              <label>
                                Підʼїзд
                                <input
                                  value={entrance}
                                  onChange={handleEntranceChange}
                                  placeholder="№"
                                  type="text"
                                />
                              </label>

                              <label>
                                Квартира
                                <input
                                  value={apartment}
                                  onChange={handleApartmentChange}
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
                    </div>
                  ))}

                {step === 3 && (
                  <div className={s.paymentMethodRadio}>
                    <div className={s.radioBox}>
                      <input
                        id="cash"
                        type="radio"
                        name="paymentMethod" // Атрибут name для групування
                        onClick={() => setPaymentMethod("online payment")}
                        checked={paymentMethod === "online payment"} // Встановлюємо як вибраний
                      />
                      <label
                        className={`${
                          paymentMethod === "online payment" && s.active
                        }`}
                        htmlFor="cash"
                      >
                        Онлайн-оплата WayForPay
                      </label>
                    </div>

                    <div className={s.radioBox}>
                      <input
                        id="cod"
                        type="radio"
                        name="paymentMethod" // Атрибут name для групування
                        onClick={() => setPaymentMethod("cod")}
                        checked={paymentMethod === "cod"} // Встановлюємо як вибраний
                      />
                      <label
                        className={`${paymentMethod === "cod" && s.active}`}
                        htmlFor="cod"
                      >
                        Накладений платіж
                      </label>
                    </div>
                  </div>
                )}

                <div className={s.stepController}>
                  <div
                    onClick={handlePrevStep}
                    className={`${s.prevBtn} ${step === 1 && s.disabled}`}
                  >
                    Назад
                  </div>

                  {step === 3 ? (
                    <div className={s.orderBtn}>
                      <button onClick={handleOrderSubmit}>
                        Підтвердити замовлення
                      </button>

                      <p>
                        Підтверджуючи замовлення, я приймаю умови:
                        <a href="">
                          положення про обробку і захист персональних даних
                          угоди користувача.
                        </a>
                      </p>
                    </div>
                  ) : (
                    <div onClick={handleNextStep} className={s.nextBtn}>
                      Далі
                      <svg
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_3012_20566)">
                          <path d="M17.9177 5L16.8487 6.05572L21.6059 10.7535H0.5V12.2465H21.6059L16.8487 16.9443L17.9177 18L24.5 11.5L17.9177 5Z" />
                        </g>
                        <defs>
                          <clipPath id="clip0_3012_20566">
                            <rect
                              width="24"
                              height="24"
                              fill="white"
                              transform="translate(0.5)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <OrderSidePanel />
          </div>
        </Layout>
      )) || <OrderSucces data={orderSucces} />}

      <OrderFooter />

      {addressPopup && (
        <AddressPopup onClose={() => setAddressPopup(false)} user={userData} />
      )}
    </div>
  );
};
