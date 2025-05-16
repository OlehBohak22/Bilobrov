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
import { useWindowSize } from "../../hooks/useWindowSize";
import { addAddress } from "../../store/slices/addressSlice";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { API_URL_WP } from "../../constants/api";
import { fetchCities } from "../../store/slices/citiesSlice";

const OrderPage: React.FC = () => {
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
  const [isStepOneValid, setIsStepOneValid] = useState(true);
  const [isStepTwoValid, setIsStepTwoValid] = useState(true);

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  // Керування бонусами
  const [useBonus, setUseBonus] = useState(0);
  const userData = useSelector((state: RootState) => state.user.user);

  const { t } = useTranslation();
  // Доступні бонуси користувача (отримуємо з userData)
  const availableBonuses = Number(userData?.meta?.bonus) || 0;

  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);

  const [tab, setTab] = useState<"PostOffice" | "ParcelLocker">("PostOffice");

  const [saveAsDefaultAddress, setSaveAsDefaultAddress] = useState(false);

  const { width } = useWindowSize();

  const isMobile = width < 1024;

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

  const formatPhoneInput = (phone: string) => {
    const normalized = phone.replace(/\D/g, ""); // залишаємо тільки цифри

    if (normalized.startsWith("380")) {
      return `+${normalized}`; // якщо вже 380 — просто додаємо плюс
    }

    if (normalized.startsWith("0")) {
      return `+38${normalized}`; // якщо 0 на початку — заміняємо на +380
    }

    // Якщо користувач щось ліве ввів — повертаємо як є
    return phone;
  };

  const normalizePhone = (phone: string) => phone.replace(/\D/g, "");

  const validateStepOne = () => {
    const newErrors: Record<string, boolean> = {};

    if (!billing.first_name.trim()) newErrors.first_name = true;
    if (!billing.last_name.trim()) newErrors.last_name = true;
    if (!billing.middle_name.trim()) newErrors.middle_name = true;

    const normalizedBillingPhone = normalizePhone(billing.phone);
    if (
      normalizedBillingPhone.length !== 12 ||
      !normalizedBillingPhone.startsWith("380")
    ) {
      newErrors.phone = true;
    }

    if (!billing.email.trim()) newErrors.email = true;

    if (!shipper) {
      if (!shipping.first_name.trim()) newErrors.shipping_first_name = true;
      if (!shipping.last_name.trim()) newErrors.shipping_last_name = true;
      if (!shipping.middle_name.trim()) newErrors.shipping_middle_name = true;

      const normalizedShippingPhone = normalizePhone(shipping.phone);
      if (
        normalizedShippingPhone.length !== 12 ||
        !normalizedShippingPhone.startsWith("380")
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

  const { token } = useSelector((state: RootState) => state.user);

  const address = userData?.meta.address;

  useEffect(() => {
    if (Array.isArray(address) && address.length > 0) {
      const selected = address.find((addr) => addr.selected) || address[0];

      setSelectedAddressId(selected.id);

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
      setInstructions(value);
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

  const [departmentSelect, setDepartmentSelect] = useState(
    t("delivery.department")
  );

  useEffect(() => {
    if (departmentSelect === "Поштомат" || departmentSelect === "Почтомат") {
      setTab("ParcelLocker");
    } else if (
      departmentSelect === "На відділення" ||
      departmentSelect === "На отделение"
    ) {
      setTab("PostOffice");
    }
  }, [departmentSelect]);

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
    // eslint-disable-next-line no-constant-binary-expression
    phone: user?.meta.phone ? `+38${user.meta.phone}` : "",
  });

  const [shipping, setShipping] = useState({ ...billing });

  useEffect(() => {
    setBilling((prev) => ({
      ...prev,
      city: selectedCity,
      address_1:
        departmentSelect === "На відділення" ||
        departmentSelect === "На отделение"
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
    if (step === 1) {
      const valid = validateStepOne();
      setIsStepOneValid(valid);
      if (!valid) return;
    }
    if (step === 2) {
      const valid = validateStepTwo();
      setIsStepTwoValid(valid);
      if (!valid) return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => setStep((prev) => prev - 1);

  let title: string = "";

  switch (step) {
    case 1:
      title = t("order.contactDetails");
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
      shipping_type: departmentSelect,

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
        appliedCoupon
          ? [
              {
                key: "applied_coupon",
                value: JSON.stringify({
                  code: appliedCoupon.code,
                  discount: appliedCoupon.discountAmount,
                }),
              },
            ]
          : [],
      ],
    };

    if (saveAsDefaultAddress && token) {
      try {
        await dispatch(
          addAddress({
            token,
            address: {
              first_name: billing.first_name,
              last_name: billing.last_name,
              phone: billing.phone,
              middle_name: billing.middle_name,
              city: billing.city || selectedCity,

              street: selectedStreet,
              house: house,
              entrance: entrance,
              apartment: apartment,
              selected: true, // тут обираємо основною
              delivery_type:
                departmentSelect === "На відділення" ? "department" : "courier",
              department: departmentSelect === "На відділення" ? warehouse : "",
            },
          })
        );

        console.log("Адресу оновлено як основну ✅");
      } catch (error) {
        console.error("Помилка при оновленні адреси", error);
      }
    }

    try {
      const resultAction = await dispatch(createOrder(orderData));
      if (createOrder.fulfilled.match(resultAction)) {
        dispatch(clearCart(token));
        setOrderSucces(resultAction.payload);
        console.log("Замовлення успішно створено:", resultAction.payload);

        if (user && useBonus > 0) {
          try {
            await axios.post(
              `${API_URL_WP}user_edit_bonus`,
              {
                bonus: -useBonus, // списання бонусів
                bonus_type: "ordering",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log(`✅ Списано ${useBonus} бонусів`);
          } catch (err) {
            console.error("Помилка при списанні бонусів:", err);
          }
        }
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

  useEffect(() => {
    if (step === 1) {
      const isValid =
        billing.first_name.trim() &&
        billing.last_name.trim() &&
        billing.middle_name.trim() &&
        /^\+380\d{9}$/.test(billing.phone) &&
        billing.email.trim();

      if (shipper) {
        setIsStepOneValid(!!isValid);
      } else {
        const shippingValid =
          shipping.first_name.trim() &&
          shipping.last_name.trim() &&
          shipping.middle_name.trim() &&
          /^\+380\d{9}$/.test(shipping.phone) &&
          shipping.email.trim();

        setIsStepOneValid(!!(isValid && shippingValid));
      }
    }
  }, [step, billing, shipping, shipper]);

  useEffect(() => {
    setErrors({});
  }, [step]);

  return (
    <div className={s.page}>
      <Layout>
        <div className={s.orderTopPanel}>
          {!orderSucces && (
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
          )}

          <Link to="/">
            <div className={s.headerLogo}>
              {isMobile ? (
                <svg
                  viewBox="0 0 37 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_3306_31391)">
                    <path
                      d="M104.276 0C98.4193 0 93.5066 2.01475 89.5378 6.04351C85.5689 10.0723 83.5844 15.0478 83.5844 20.97C83.5844 26.9326 85.5689 31.9285 89.5378 35.9573C93.5066 39.9861 98.4193 42 104.276 42C110.172 42 115.085 40.0062 119.015 36.0179C122.946 31.9488 124.911 26.9326 124.911 20.97C124.911 15.0478 122.946 10.0723 119.015 6.04351C115.124 2.01475 110.21 0 104.276 0ZM220.684 0C214.826 0 209.913 2.01475 205.946 6.04351C201.976 10.0723 199.992 15.0478 199.992 20.97C199.992 26.9326 201.976 31.9285 205.946 35.9573C209.913 39.9861 214.826 42 220.684 42C226.579 42 231.492 40.0062 235.422 36.0179C239.354 31.9488 241.319 26.9326 241.319 20.97C241.319 15.0478 239.354 10.0723 235.422 6.04351C231.531 2.01475 226.618 0 220.684 0ZM10.0967 0.604435V11.1198H22.144C22.7605 11.1198 23.2806 11.3611 23.7045 11.8446C24.1283 12.2877 24.3406 12.8721 24.3406 13.5973C24.3406 13.8793 24.3209 14.0605 24.2824 14.1411C24.2054 14.7051 23.9552 15.1684 23.5314 15.531C23.1075 15.8936 22.6449 16.0748 22.144 16.0748H10.0967V25.5026H23.3003C23.9552 25.5026 24.5141 25.7641 24.9765 26.2879C25.4389 26.7713 25.6697 27.3955 25.6697 28.161C25.6697 28.9265 25.4389 29.5719 24.9765 30.0956C24.5141 30.6193 23.9552 30.8811 23.3003 30.8811H10.0967V41.3955H23.5314C27.346 41.3955 30.5634 40.2479 33.1836 37.9515C35.7653 35.6553 37.0564 32.7943 37.0564 29.3699C37.0564 25.6232 35.5344 22.582 32.4903 20.2453C34.6482 18.0697 35.727 15.4503 35.727 12.3884C35.727 9.00425 34.4554 6.20442 31.9122 3.98861C29.3305 1.7325 26.1706 0.604435 22.4331 0.604435H10.0967ZM40.0042 0.604435V41.3955H50.9278V0.604435H40.0042ZM54.2804 0.604435V41.3955H82.8331V30.8811H65.2041V0.604435H54.2804ZM127.859 0.604435V41.3955H148.435C152.25 41.3955 155.467 40.2479 158.088 37.9515C160.669 35.6553 161.96 32.7943 161.96 29.3699C161.96 25.6232 160.438 22.582 157.394 20.2453C159.551 18.0697 160.63 15.4503 160.63 12.3884C160.63 9.00425 159.359 6.20442 156.815 3.98861C154.234 1.7325 151.075 0.604435 147.337 0.604435H127.859ZM164.907 0.604435V41.3955H175.832V29.6115H181.265L187.623 41.3955H199.819L192.131 27.1339C194.134 25.8044 195.695 24.0921 196.812 21.9971C197.97 19.9022 198.547 17.6062 198.547 15.1084C198.547 10.9588 197.103 7.51358 194.212 4.77403C191.361 1.99417 187.796 0.604435 183.519 0.604435H164.907ZM239.238 0.604435L254.959 41.3955H264.033L279.813 0.604435H268.425L259.523 24.8375L250.624 0.604435H239.238ZM104.276 10.9388C106.896 10.9388 109.093 11.9051 110.866 13.8389C112.677 15.813 113.582 18.1902 113.582 20.97C113.582 23.7498 112.677 26.1272 110.866 28.1012C109.093 30.035 106.896 31.0015 104.276 31.0015C101.656 31.0015 99.4406 30.0545 97.6295 28.161C95.857 26.2675 94.971 23.8709 94.971 20.97C94.971 18.1097 95.857 15.7324 97.6295 13.8389C99.4406 11.9051 101.656 10.9388 104.276 10.9388ZM220.684 10.9388C223.303 10.9388 225.5 11.9051 227.273 13.8389C229.084 15.813 229.99 18.1902 229.99 20.97C229.99 23.7498 229.084 26.1272 227.273 28.1012C225.5 30.035 223.303 31.0015 220.684 31.0015C218.062 31.0015 215.848 30.0545 214.036 28.161C212.263 26.2675 211.377 23.8709 211.377 20.97C211.377 18.1097 212.263 15.7324 214.036 13.8389C215.848 11.9051 218.062 10.9388 220.684 10.9388ZM138.782 11.1198H147.048C147.665 11.1198 148.185 11.3612 148.608 11.8446C149.032 12.2878 149.245 12.8721 149.245 13.5973C149.245 13.8793 149.225 14.0606 149.187 14.1411C149.109 14.7052 148.859 15.1684 148.435 15.531C148.011 15.8936 147.549 16.0748 147.048 16.0748H138.782V11.1198ZM175.832 11.1198H183.519C184.598 11.1198 185.484 11.5026 186.177 12.2681C186.871 12.9932 187.218 13.9401 187.218 15.1084C187.218 16.2768 186.871 17.243 186.177 18.0085C185.484 18.774 184.598 19.1568 183.519 19.1568H175.832V11.1198ZM138.782 25.5026H148.203C148.858 25.5026 149.417 25.7641 149.88 26.2881C150.342 26.7715 150.574 27.3957 150.574 28.161C150.574 28.9265 150.342 29.5719 149.88 30.0956C149.417 30.6193 148.858 30.8811 148.203 30.8811H138.782V25.5026Z"
                      fill="#1A1A1A"
                    />
                    <path
                      d="M2.16039 40.5C1.54787 40.5 1.03467 40.2523 0.620802 39.7567C0.206934 39.2562 0 38.6392 0 37.9055C0 37.371 0.111744 36.8974 0.335233 36.4843C0.550447 36.0713 0.844293 35.7579 1.21677 35.5442L1.58305 36.7248C1.3968 36.8414 1.25195 37.0043 1.14849 37.2131C1.04088 37.4171 0.987075 37.6479 0.987075 37.9055C0.987075 38.2845 1.09882 38.6027 1.32231 38.8603C1.54166 39.1128 1.82101 39.2393 2.16039 39.2393C2.49562 39.2393 2.77706 39.1128 3.00468 38.8603C3.22818 38.6027 3.33992 38.2845 3.33992 37.9055C3.33992 37.6479 3.28819 37.4171 3.18471 37.2131C3.0771 37.0043 2.93019 36.8414 2.74395 36.7248L3.11023 35.5442C3.47856 35.7579 3.77447 36.0713 3.99796 36.4843C4.21731 36.9022 4.32698 37.3759 4.32698 37.9055C4.32698 38.6488 4.12005 39.2659 3.70618 39.7567C3.28819 40.2523 2.77292 40.5 2.16039 40.5ZM2.16039 35.2671C1.54787 35.2671 1.03467 35.0194 0.620802 34.5238C0.206934 34.0233 0 33.4063 0 32.6726C0 31.9341 0.206934 31.3195 0.620802 30.8287C1.03467 30.3331 1.54787 30.0854 2.16039 30.0854C2.77292 30.0854 3.28819 30.3331 3.70618 30.8287C4.12005 31.3147 4.32698 31.9293 4.32698 32.6726C4.32698 33.416 4.12005 34.033 3.70618 34.5238C3.28819 35.0194 2.77292 35.2671 2.16039 35.2671ZM3.33992 32.6726C3.33992 32.2984 3.22818 31.9827 3.00468 31.7251C2.77292 31.4677 2.49149 31.3388 2.16039 31.3388C1.83343 31.3388 1.55615 31.4677 1.32852 31.7251C1.10089 31.9778 0.987075 32.2936 0.987075 32.6726C0.987075 33.0516 1.09882 33.3698 1.32231 33.6274C1.54166 33.88 1.82101 34.0064 2.16039 34.0064C2.49562 34.0064 2.77706 33.88 3.00468 33.6274C3.22818 33.3698 3.33992 33.0516 3.33992 32.6726ZM1.01191 26.208L1.22298 27.4033C1.13607 27.4277 1.06571 27.4933 1.01191 27.6C0.953969 27.707 0.924999 27.8333 0.924999 27.9791C0.924999 28.12 0.953969 28.2415 1.01191 28.3436C1.06571 28.4406 1.134 28.4892 1.21677 28.4892C1.3161 28.4892 1.40094 28.4042 1.4713 28.2342C1.52097 28.1077 1.58098 27.9013 1.65134 27.6147C1.68445 27.4883 1.701 27.4228 1.701 27.418C1.79206 27.0535 1.91828 26.7425 2.07968 26.485C2.27835 26.1547 2.57841 25.9893 2.97985 25.9893C3.38958 25.9893 3.71654 26.1619 3.96072 26.5069C4.20491 26.8519 4.327 27.2964 4.327 27.8407C4.327 28.3412 4.2256 28.776 4.0228 29.1451C3.82 29.5096 3.55099 29.7428 3.21576 29.8449L2.99848 28.6205C3.11436 28.5864 3.20955 28.499 3.28405 28.3581C3.35855 28.2123 3.39579 28.0375 3.39579 27.8333C3.39579 27.6536 3.36682 27.503 3.30887 27.3815C3.24679 27.2599 3.16816 27.1993 3.07298 27.1993C2.9902 27.1993 2.91777 27.2625 2.85569 27.3888C2.79361 27.5102 2.72739 27.707 2.65704 27.9791C2.65289 27.9936 2.64874 28.0107 2.64459 28.03C2.64046 28.0495 2.63632 28.0665 2.63221 28.0812C2.53702 28.4406 2.43562 28.7371 2.32801 28.9703C2.10866 29.4319 1.76516 29.6748 1.29748 29.6991C0.912584 29.6991 0.600114 29.5436 0.360072 29.2327C0.120028 28.9218 5.02392e-06 28.5111 5.02392e-06 28.001C5.02392e-06 27.5491 0.0951946 27.1604 0.285574 26.8348C0.480094 26.4946 0.722202 26.2858 1.01191 26.208ZM4.25871 24.3351V25.5229H0.0682929V24.3351L2.4708 22.7389L0.0682929 21.1502V19.9622H4.25871V21.1502H1.96173L3.82414 22.3454V23.1397L1.96173 24.3351H4.25871ZM0.0682929 19.3937V15.6913H1.01812V18.1839H1.67616V16.1068H2.61979V18.1839H3.31508V15.6549H4.25871V19.3937H0.0682929ZM0.0682929 15.3488V11.2456H1.01812V12.6959H4.25871V13.9057H1.01812V15.3488H0.0682929ZM4.25871 9.61304V10.8229H0.0682929V9.61304H4.25871ZM2.16039 9.11744C1.54787 9.11744 1.03467 8.86963 0.620802 8.37405C0.206934 7.8736 0 7.25655 0 6.52287C0 5.9884 0.111744 5.51468 0.335233 5.10169C0.550447 4.68868 0.844293 4.3753 1.21677 4.16152L1.58305 5.34221C1.3968 5.45881 1.25195 5.62157 1.14849 5.83049C1.04088 6.03456 0.987075 6.26535 0.987075 6.52287C0.987075 6.90184 1.09882 7.22009 1.32231 7.47761C1.54166 7.73027 1.82101 7.85658 2.16039 7.85658C2.49562 7.85658 2.77706 7.73027 3.00468 7.47761C3.22818 7.22009 3.33992 6.90184 3.33992 6.52287C3.33992 6.26535 3.28819 6.03456 3.18471 5.83049C3.0771 5.62157 2.93019 5.45881 2.74395 5.34221L3.11023 4.16152C3.47856 4.3753 3.77447 4.68868 3.99796 5.10169C4.21731 5.51953 4.32698 5.99326 4.32698 6.52287C4.32698 7.26625 4.12005 7.88331 3.70618 8.37405C3.28819 8.86963 2.77292 9.11744 2.16039 9.11744ZM1.01191 0.218642L1.22298 1.4139C1.13607 1.4382 1.06571 1.5038 1.01191 1.61067C0.953969 1.71757 0.924999 1.8439 0.924999 1.98967C0.924999 2.13056 0.953969 2.25204 1.01191 2.35406C1.06571 2.45123 1.134 2.49983 1.21677 2.49983C1.3161 2.49983 1.40094 2.4148 1.4713 2.24475C1.52097 2.11842 1.58098 1.91191 1.65134 1.62526C1.68445 1.49892 1.701 1.43333 1.701 1.42847C1.79206 1.06407 1.91828 0.753103 2.07968 0.495589C2.27835 0.165195 2.57841 0 2.97985 0C3.38958 0 3.71654 0.172489 3.96072 0.517464C4.20491 0.862433 4.327 1.307 4.327 1.85117C4.327 2.35162 4.2256 2.78648 4.0228 3.15575C3.82 3.52016 3.55099 3.75339 3.21576 3.85541L2.99848 2.63101C3.11436 2.59702 3.20955 2.50955 3.28405 2.36864C3.35855 2.22288 3.39579 2.04795 3.39579 1.84388C3.39579 1.66412 3.36682 1.5135 3.30887 1.39203C3.24679 1.27056 3.16816 1.20983 3.07298 1.20983C2.9902 1.20983 2.91777 1.27299 2.85569 1.39932C2.79361 1.52079 2.72739 1.71757 2.65704 1.98967C2.65289 2.00423 2.64874 2.02123 2.64459 2.04066C2.64046 2.06009 2.63632 2.07709 2.63221 2.09167C2.53702 2.45121 2.43562 2.74761 2.32801 2.98082C2.10866 3.44241 1.76516 3.68534 1.29748 3.70965C0.912584 3.70965 0.600114 3.55416 0.360072 3.24319C0.120028 2.93225 5.02392e-06 2.52168 5.02392e-06 2.0115C5.02392e-06 1.55964 0.0951946 1.17094 0.285574 0.845406C0.480094 0.505294 0.722202 0.296382 1.01191 0.218642Z"
                      fill="#1A1A1A"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_3306_31391">
                      <rect width="37" height="42" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              ) : (
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
              )}
            </div>
          </Link>

          <a href="tel:380674811650">
            {isMobile ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.3106 22C14.6674 21.9291 14.0335 21.7983 13.4182 21.6096C12.2133 21.2176 11.0836 20.6474 10.0724 19.921C8.59671 18.872 7.2564 17.6666 6.07839 16.3291C4.96191 15.1129 4.00054 13.7798 3.21359 12.3565C2.60907 11.2725 2.21946 10.0953 2.06351 8.88179C1.92016 7.91129 2.02025 6.923 2.35592 5.99478C2.69158 5.06656 3.25363 4.22382 3.99776 3.53301C4.47742 3.09856 4.98739 2.69425 5.52428 2.32271C5.77496 2.11483 6.09861 2 6.43391 2C6.7692 2 7.09285 2.11483 7.34353 2.32271C7.67206 2.55465 7.95808 2.83483 8.19042 3.15234C8.72564 3.84143 9.20111 4.56931 9.61235 5.32898C9.80618 5.68282 9.93018 6.06632 9.97833 6.46118C10.0134 6.74779 9.97473 7.03808 9.86564 7.30797C9.75654 7.57785 9.58008 7.81959 9.35097 8.01314C8.97036 8.37463 8.55374 8.70145 8.10676 8.9892C7.70788 9.20424 7.41472 9.55616 7.28973 9.97002C7.16474 10.3839 7.21784 10.8269 7.43766 11.2048C7.76974 11.9909 8.23964 12.7199 8.82819 13.3619C9.58375 14.29 10.4463 15.1378 11.4003 15.8899C11.8845 16.2916 12.46 16.5852 13.0836 16.7488C13.3555 16.8175 13.6423 16.8157 13.9132 16.7434C14.184 16.6712 14.4286 16.5313 14.6206 16.3389C14.9761 15.9973 15.342 15.6752 15.7289 15.3628C16.1057 15.0113 16.6001 14.7908 17.1299 14.7381C17.5708 14.7275 18.0071 14.8251 18.395 15.0212C18.9646 15.3083 19.4948 15.6591 19.9738 16.0656C20.5755 16.5086 21.1226 17.0128 21.6048 17.5687C21.7467 17.7102 21.8547 17.8782 21.9217 18.0617C21.9887 18.2451 22.0131 18.4398 21.9933 18.6328C21.9736 18.8257 21.91 19.0125 21.807 19.1807C21.704 19.349 21.5638 19.4949 21.3957 19.6087C20.7812 20.1857 20.1051 20.7024 19.3778 21.1508C18.5839 21.5859 17.7001 21.8588 16.7849 21.9512H16.6907L15.3106 22Z"
                  fill="#222222"
                />
              </svg>
            ) : (
              "+38 (067) 481 16 50"
            )}
          </a>
        </div>
      </Layout>

      {isMobile && !orderSucces && (
        <div className={s.navTabs}>
          <button className={`${step === 1 && s.active} ${step > 1 && s.done}`}>
            <span>1</span> {t("order.contactDetails")}
          </button>
          <button className={`${step === 2 && s.active} ${step > 2 && s.done}`}>
            <span>2</span> {t("order.delivery")}
          </button>
          <button className={`${step === 3 && s.active}`}>
            <span>3</span> {t("order.payment")}
          </button>
        </div>
      )}

      {token && isMobile && !orderSucces && (
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

      {(!orderSucces && (
        <Layout>
          {!isMobile && (
            <div className={s.navTabs}>
              <button
                className={`${step === 1 && s.active} ${step > 1 && s.done}`}
              >
                <span>1</span> {t("order.contactDetails")}
              </button>
              <button
                className={`${step === 2 && s.active} ${step > 2 && s.done}`}
              >
                <span>2</span> {t("order.delivery")}
              </button>
              <button className={`${step === 3 && s.active}`}>
                <span>3</span> {t("order.payment")}
              </button>
            </div>
          )}

          <div className={s.orderAllInfo}>
            <div>
              <div className={s.stepsContainer}>
                {token && !isMobile && (
                  <div className={s.regularCustomerController}>
                    <div
                      onClick={() => setIsRegularCustomer(false)}
                      className={`${!regularCustomer ? s.active : ""}`}
                    >
                      {t("order.firstTime")}
                    </div>
                    <div
                      onClick={() => setIsRegularCustomer(true)}
                      className={`${regularCustomer ? s.active : ""}`}
                    >
                      {t("order.regularCustomer")}
                    </div>
                  </div>
                )}

                <h2>{title}</h2>

                {step === 1 && (
                  <div>
                    <div className={s.inputBox}>
                      <div className={s.inputContainer}>
                        <label>
                          {t("order.fields.firstName")} <span>*</span>
                          <input
                            className={
                              !billing.first_name.trim() && errors.first_name
                                ? s.errorInput
                                : ""
                            }
                            type="text"
                            placeholder={t("order.placeholders.firstName")}
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
                          {t("order.fields.lastName")} <span>*</span>
                          <input
                            className={
                              !billing.last_name.trim() && errors.last_name
                                ? s.errorInput
                                : ""
                            }
                            type="text"
                            placeholder={t("order.placeholders.lastName")}
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
                          {t("order.fields.middleName")} <span>*</span>
                          <input
                            className={
                              !billing.middle_name.trim() && errors.middle_name
                                ? s.errorInput
                                : ""
                            }
                            type="text"
                            placeholder={t("order.placeholders.middleName")}
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
                          {t("order.fields.phone")} <span>*</span>
                          <input
                            type="tel"
                            placeholder={t("order.placeholders.phone")}
                            value={billing.phone}
                            onChange={(e) =>
                              setBilling({
                                ...billing,
                                phone: formatPhoneInput(e.target.value),
                              })
                            }
                            className={`${errors.phone ? s.errorInput : ""}`}
                          />
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
                            placeholder={t("order.placeholders.email")}
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
                          className={s.hiddenCheckbox}
                        />
                        <span className={s.checkboxLabel}>
                          {t("order.checkboxes.receiver")}
                        </span>
                      </label>

                      {!token && (
                        <label className={s.customCheckbox}>
                          <input
                            type="checkbox"
                            checked={register}
                            onChange={() => setRegister(!register)}
                            className={s.hiddenCheckbox}
                          />
                          <span className={s.checkboxLabel}>
                            {t("order.checkboxes.register")}
                          </span>
                        </label>
                      )}
                    </div>

                    {!shipper && (
                      <div className={`${s.inputBox} lg:mt-[1.6vw] mt-[10vw]`}>
                        <h2> {t("order.recipientContactDetails")}</h2>
                        <div className={s.inputContainer}>
                          <label>
                            {t("order.fields.firstName")} <span>*</span>
                            <input
                              className={
                                !shipping.first_name.trim() &&
                                errors.shipping_first_name
                                  ? s.errorInput
                                  : ""
                              }
                              type="text"
                              placeholder={t("order.placeholders.firstName")}
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
                            {t("order.fields.lastName")} <span>*</span>
                            <input
                              className={
                                !shipping.last_name.trim() &&
                                errors.shipping_last_name
                                  ? s.errorInput
                                  : ""
                              }
                              type="text"
                              placeholder={t("order.placeholders.lastName")}
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
                            {t("order.fields.middleName")} <span>*</span>
                            <input
                              className={
                                !shipping.middle_name.trim() &&
                                errors.shipping_middle_name
                                  ? s.errorInput
                                  : ""
                              }
                              type="text"
                              placeholder={t("order.placeholders.middleName")}
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
                            {t("order.fields.phone")} <span>*</span>
                            <input
                              className={
                                !shipping.phone.trim() && errors.shipping_phone
                                  ? s.errorInput
                                  : ""
                              }
                              type="text"
                              placeholder={t("order.placeholders.phone")}
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
                              placeholder={t("order.placeholders.email")}
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
                            <span>
                              {t("address.addressNumber", {
                                number: index + 1,
                              })}
                            </span>

                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={selectedAddressId === address.id}
                              onChange={() => handleAddressSelect(address.id)}
                            />

                            <div className={s.addressInfo}>
                              <p>
                                {address.city &&
                                  `${t("address.city")} ${address.city} `}
                                {address.department &&
                                  `${t("address.department")} ${
                                    address.department
                                  } `}
                                {address.street &&
                                  `${t("address.street")} ${address.street} `}
                                {address.house &&
                                  `${t("address.house")} ${address.house} `}
                                {address.entrance &&
                                  `${t("address.entrance")} ${
                                    address.entrance
                                  } `}
                                {address.apartment &&
                                  `${t("address.apartment")} ${
                                    address.apartment
                                  } `}
                              </p>

                              <p>
                                {t("address.recipient")}:
                                {address.last_name && ` ${address.last_name}`}
                                {address.first_name && ` ${address.first_name}`}
                                {address.middle_name &&
                                  ` ${address.middle_name}`}
                              </p>
                            </div>
                          </div>

                          {/* <div>{address.id}</div> */}

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
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={s.inputBox}>
                      <>
                        <div className={s.inputContainer}>
                          <div className={s.selectContainer}>
                            <p className="lg:mb-[0.6vw] mb-[3.2vw]">
                              {t("addAddress.deliveryMethod")} <span>*</span>
                            </p>
                            <CustomSelect
                              novaIcon={true}
                              options={[
                                t("delivery.department"),
                                t("delivery.courier"),
                                t("delivery.locker"),
                              ]}
                              value={departmentSelect}
                              onChange={setDepartmentSelect}
                              className={errors.city ? s.errorInput : ""}
                            />
                          </div>

                          <div className={s.selectContainer}>
                            <p className="lg:mb-[0.6vw] mb-[3.2vw]">
                              {t("addAddress.city")}
                              <span>*</span>
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

                        {(selectedCity &&
                          (departmentSelect === "На відділення" ||
                            departmentSelect === "На отделение")) ||
                        departmentSelect === "Поштомат" ||
                        departmentSelect === "Почтомат" ? (
                          <div className={s.inputContainer}>
                            <div className={s.selectContainer}>
                              <p className="lg:mb-[0.6vw] mb-[3.2vw]">
                                {t("addAddress.branchNumber")} <span>*</span>
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
                              {t("addAddress.selectOnMap")}
                            </button>

                            {showMapPopup && (
                              <NovaPoshtaMapPopup
                                selectedCity={selectedCity}
                                tab={tab}
                                setTab={setTab}
                                onClose={() => setShowMapPopup(false)}
                                onSelect={(warehouseName) => {
                                  setWarehouse(warehouseName);

                                  setWarehouse(warehouseName);
                                  setShipping((prev) => ({
                                    ...prev,
                                    address_1: warehouseName,
                                  }));
                                  setBilling((prev) => ({
                                    ...prev,
                                    address_1: warehouseName,
                                  }));

                                  setShowMapPopup(false);

                                  if (
                                    warehouseName
                                      .toLowerCase()
                                      .includes("поштомат") ||
                                    warehouseName
                                      .toLowerCase()
                                      .includes("почтомат")
                                  ) {
                                    setDepartmentSelect("Поштомат");
                                  } else if (
                                    warehouseName
                                      .toLowerCase()
                                      .includes("відділення") ||
                                    warehouseName
                                      .toLowerCase()
                                      .includes("отделение")
                                  ) {
                                    setDepartmentSelect("На відділення");
                                  } else {
                                    // опціонально: можна залишити дефолт або вивести помилку
                                    setDepartmentSelect("На відділення");
                                  }
                                }}
                              />
                            )}
                          </div>
                        ) : selectedCity &&
                          (departmentSelect === "Кур'єр" ||
                            departmentSelect === "Курьер") ? (
                          <div>
                            <div className={s.inputContainer}>
                              <div className={s.selectContainer}>
                                <p className="lg:mb-[0.6vw] mb-[3.2vw]">
                                  {t("addAddress.street")} <span>*</span>
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
                                  {t("addAddress.house")} <span>*</span>
                                  <input
                                    value={house}
                                    onChange={handleHouseChange}
                                    placeholder="№"
                                    type="text"
                                  />
                                </label>

                                <label>
                                  {t("addAddress.entrance")}

                                  <input
                                    value={entrance}
                                    onChange={handleEntranceChange}
                                    placeholder="№"
                                    type="text"
                                  />
                                </label>

                                <label>
                                  {t("addAddress.apartment")}

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
                                {t("addAddress.instructions")}

                                <textarea
                                  placeholder={t(
                                    "addAddress.instructionsPlaceholder"
                                  )}
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

                        {token && (
                          <div className={s.checkboxContainer}>
                            <label
                              style={
                                isMobile
                                  ? { justifyContent: "center" }
                                  : undefined
                              }
                              className={s.customCheckbox}
                            >
                              <input
                                type="checkbox"
                                checked={saveAsDefaultAddress}
                                onChange={() =>
                                  setSaveAsDefaultAddress(!saveAsDefaultAddress)
                                }
                                className={s.hiddenCheckbox}
                              />
                              <span className={s.checkboxLabel}>
                                {t("order.makeMain")}
                              </span>
                            </label>
                          </div>
                        )}
                      </>
                    </div>
                  ))}

                {step === 3 && (
                  <div className={s.paymentMethodRadio}>
                    <div className={s.radioBox}>
                      <input
                        id="online"
                        type="radio"
                        name="paymentMethod"
                        onClick={() => setPaymentMethod("online payment")}
                        checked={paymentMethod === "online payment"}
                      />
                      <label
                        className={`${
                          paymentMethod === "online payment" && s.active
                        }`}
                        htmlFor="online"
                      >
                        {t("order.onlinePayment")}
                      </label>
                    </div>

                    <div className={s.radioBox}>
                      <input
                        id="cod"
                        type="radio"
                        name="paymentMethod"
                        onClick={() => setPaymentMethod("cod")}
                        checked={paymentMethod === "cod"}
                      />
                      <label
                        className={`${paymentMethod === "cod" && s.active}`}
                        htmlFor="cod"
                      >
                        {t("order.cod")}
                      </label>
                    </div>
                  </div>
                )}

                <div
                  className={s.stepController}
                  style={step === 3 ? { flexDirection: "column-reverse" } : {}}
                >
                  <div
                    onClick={handlePrevStep}
                    className={`${s.prevBtn} ${step === 1 && s.disabled}`}
                  >
                    Назад
                  </div>

                  {step === 3 ? (
                    <div className={s.orderBtn}>
                      <button onClick={handleOrderSubmit}>
                        {t("orderStep.confirmOrder")}
                      </button>

                      <p>
                        {t("orderStep.acceptTerms")}

                        <a href="">{t("orderStep.privacyPolicy")}</a>
                      </p>
                    </div>
                  ) : (
                    <div
                      onClick={handleNextStep}
                      className={`${s.nextBtn} ${
                        (step === 1 && !isStepOneValid) ||
                        (step === 2 && !isStepTwoValid)
                          ? s.disabledNext
                          : ""
                      }`}
                    >
                      {t("order.next")}
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

            <OrderSidePanel
              useBonus={useBonus}
              setUseBonus={setUseBonus}
              availableBonuses={availableBonuses}
              appliedCoupon={appliedCoupon}
              setAppliedCoupon={setAppliedCoupon}
            />
          </div>
        </Layout>
      )) || (
        <OrderSucces
          data={orderSucces}
          usedBonuses={useBonus}
          appliedCoupon={appliedCoupon}
        />
      )}

      <OrderFooter />

      {addressPopup && (
        <AddressPopup onClose={() => setAddressPopup(false)} user={userData} />
      )}
    </div>
  );
};

export default OrderPage;
